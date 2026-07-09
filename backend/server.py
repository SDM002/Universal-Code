from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json
import logging
import uuid
import re
from pathlib import Path
from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB
mongo_url = os.environ["MONGO_URL"]
mongo_client = AsyncIOMotorClient(mongo_url)
db = mongo_client[os.environ["DB_NAME"]]

EMERGENT_LLM_KEY = os.environ["EMERGENT_LLM_KEY"]

app = FastAPI(title="CodeSage API")
api_router = APIRouter(prefix="/api")

# ---- Model config ----
MODEL_MAP = {
    "claude-sonnet-4.5": ("anthropic", "claude-sonnet-4-5-20250929"),
    "gemini-3-flash": ("gemini", "gemini-3-flash-preview"),
    "gpt-5.2": ("openai", "gpt-5.2"),
}
DEFAULT_MODEL = "claude-sonnet-4.5"


# ---- Schemas ----
class AnalyzeRequest(BaseModel):
    code: str = Field(..., min_length=1, max_length=20000)
    language: str = Field(default="auto")
    model: Literal["claude-sonnet-4.5", "gemini-3-flash", "gpt-5.2"] = Field(default=DEFAULT_MODEL)


class Issue(BaseModel):
    severity: Literal["critical", "high", "medium", "low", "info"] = "medium"
    category: str
    line: Optional[int] = None
    title: str
    description: str
    suggestion: Optional[str] = None


class LineExplanation(BaseModel):
    line: int
    code: str
    what: str
    why: str
    how: str


class LibrarySuggestion(BaseModel):
    name: str
    ecosystem: str  # pypi, npm, cargo, go, etc.
    reason: str
    replaces_lines: Optional[str] = None
    install_command: str
    docs_url: Optional[str] = None
    github_url: Optional[str] = None
    stars_estimate: Optional[str] = None
    example_usage: Optional[str] = None


class MinimalismCheck(BaseModel):
    score: int  # 0-100, higher = more minimal / well-factored
    verdict: str
    issues: List[str]
    refactored_code: Optional[str] = None
    lines_saved_estimate: Optional[int] = None


class AnalyzeResponse(BaseModel):
    id: str
    detected_language: str
    model_used: str
    summary: str
    review: List[Issue]
    line_by_line: List[LineExplanation]
    library_suggestions: List[LibrarySuggestion]
    minimalism: MinimalismCheck
    created_at: str


# ---- Prompt ----
SYSTEM_PROMPT = """You are CodeSage, an elite senior engineer & open-source curator.

Your philosophy — this matters:
- Fewer lines beats more lines. Always ask: is there a well-known open-source library that already does this? Real, existing libraries only (from PyPI, npm, crates.io, Maven, Go modules, etc.). Never invent packages.
- Correctness, security, and clarity beat cleverness.
- Prefer official, actively-maintained libraries with real docs. Reference official documentation URLs (readthedocs, official project sites, MDN, PyPI, npmjs.com, GitHub).
- Systematic, perfectly-aligned, minimal code. No unnecessary abstraction. No boilerplate that doesn't earn its keep.
- Call out over-engineering (unneeded classes, wrappers, premature abstraction, dead branches, redundant validation on internal calls).

You will receive user code. Return ONE strict JSON object matching EXACTLY this schema — no prose outside JSON, no code fences:

{
  "detected_language": "<language, e.g. 'python' | 'javascript' | 'typescript' | 'go' | 'rust' | 'java' | ...>",
  "summary": "<2-3 sentence overall verdict>",
  "review": [
     {
       "severity": "critical|high|medium|low|info",
       "category": "bug|security|performance|style|correctness|maintainability|dependency",
       "line": <int or null>,
       "title": "<short>",
       "description": "<what & why>",
       "suggestion": "<concrete fix, may include code snippet>"
     }
  ],
  "line_by_line": [
     {
       "line": <int, 1-indexed>,
       "code": "<exact line content, trimmed>",
       "what": "<what this line does>",
       "why": "<why it is written this way / its role>",
       "how": "<how it works technically (mechanism, data flow)>"
     }
  ],
  "library_suggestions": [
     {
       "name": "<real package name>",
       "ecosystem": "pypi|npm|cargo|go|maven|gem|composer|nuget",
       "reason": "<why this library replaces or improves the code>",
       "replaces_lines": "<line range or brief mention, optional>",
       "install_command": "<e.g. 'pip install httpx' or 'npm i zod'>",
       "docs_url": "<official docs URL>",
       "github_url": "<GitHub repo URL>",
       "stars_estimate": "<e.g. '15k+' — approximate is fine>",
       "example_usage": "<3-6 line minimal example>"
     }
  ],
  "minimalism": {
     "score": <0-100 int>,
     "verdict": "<one line — is this code minimal & well-factored?>",
     "issues": ["<over-engineering issue 1>", "..."],
     "refactored_code": "<a minimal rewrite of the user's code using recommended libraries where it truly helps. Same language. Keep behavior. If already minimal, return the original with a note in verdict.>",
     "lines_saved_estimate": <int>
  }
}

Rules:
- line_by_line: cover EVERY non-empty, non-comment-only line. Skip blank lines. Use the 1-indexed line number from the original snippet.
- library_suggestions: only include if a real library genuinely helps. 0 items is valid. Never invent packages. Prefer widely-used, actively-maintained ones.
- review: order by severity (critical first). Empty array is valid.
- refactored_code MUST be valid, runnable code in the same language, preserving intent. No prose, no markdown.
- Return STRICT JSON only. No leading text. No trailing text. No ```json fences.
"""


def _extract_json(text: str) -> dict:
    """Robustly pull the JSON object out of an LLM response."""
    text = text.strip()
    # Strip code fences if present
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    # Find first { and matching last }
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("No JSON object found in model response")
    candidate = text[start : end + 1]
    return json.loads(candidate)


async def _run_analysis(code: str, language: str, model_key: str) -> dict:
    provider, model_name = MODEL_MAP[model_key]
    session_id = f"codesage-{uuid.uuid4()}"
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id,
        system_message=SYSTEM_PROMPT,
    ).with_model(provider, model_name)

    lang_hint = f"(hint: language likely = {language})" if language and language != "auto" else "(detect language yourself)"
    user_text = (
        f"Analyze the following code {lang_hint}. Return the STRICT JSON schema.\n\n"
        f"```\n{code}\n```"
    )
    raw = await chat.send_message(UserMessage(text=user_text))
    if not isinstance(raw, str):
        raw = str(raw)
    try:
        return _extract_json(raw)
    except Exception as e:
        logging.exception("Failed to parse model JSON")
        raise HTTPException(status_code=502, detail=f"Model returned malformed JSON: {e}")


@api_router.get("/")
async def root():
    return {"service": "CodeSage", "status": "ok"}


@api_router.get("/models")
async def list_models():
    return {
        "default": DEFAULT_MODEL,
        "models": [
            {"id": "claude-sonnet-4.5", "label": "Claude Sonnet 4.5", "provider": "Anthropic"},
            {"id": "gemini-3-flash", "label": "Gemini 3 Flash", "provider": "Google"},
            {"id": "gpt-5.2", "label": "GPT-5.2", "provider": "OpenAI"},
        ],
    }


@api_router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest):
    data = await _run_analysis(req.code, req.language, req.model)

    # Defensive defaults
    resp = AnalyzeResponse(
        id=str(uuid.uuid4()),
        detected_language=data.get("detected_language") or (req.language if req.language != "auto" else "unknown"),
        model_used=req.model,
        summary=data.get("summary", ""),
        review=[Issue(**x) for x in (data.get("review") or [])],
        line_by_line=[LineExplanation(**x) for x in (data.get("line_by_line") or [])],
        library_suggestions=[LibrarySuggestion(**x) for x in (data.get("library_suggestions") or [])],
        minimalism=MinimalismCheck(**(data.get("minimalism") or {"score": 0, "verdict": "n/a", "issues": []})),
        created_at=datetime.now(timezone.utc).isoformat(),
    )

    # Persist (fire and forget — best effort)
    try:
        await db.analyses.insert_one({
            "_id": resp.id,
            "code": req.code,
            "language": req.language,
            "model": req.model,
            "result": resp.model_dump(),
            "created_at": resp.created_at,
        })
    except Exception:
        logging.exception("Failed to persist analysis")

    return resp


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    mongo_client.close()
