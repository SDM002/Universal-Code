---
name: laconic-python
description: Python-specific ladder. Stdlib and native replacements to reach for before adding a dependency. Use with laconic.md — this sheet is the "rung 3" (stdlib) and "rung 4" (installed defaults) memory bank for Python code.
---

# Laconic — Python cheat sheet

When the ladder lands on rung 3 (**stdlib does it?**) in a Python codebase, this is the memory bank. Reach for these **before** suggesting a new dependency.

## Standard library — the ones people forget

| You were about to write… | Use instead | Import |
| --- | --- | --- |
| Manual path joining, `os.path` gymnastics | `pathlib.Path` | `from pathlib import Path` |
| Custom retry loop | `tenacity` (installed) OR write 3 lines | — |
| `for … while … accumulate` boilerplate | `itertools.chain / groupby / accumulate / batched` (3.12+) | `import itertools` |
| Dict merging, defaultdict-ish counters | `collections.Counter`, `collections.ChainMap`, `dict | dict` (3.9+) | `import collections` |
| Timezone-aware datetime | `datetime.now(timezone.utc)`, `zoneinfo.ZoneInfo` | `from datetime import datetime, timezone; from zoneinfo import ZoneInfo` |
| Timestamp parsing | `datetime.fromisoformat` (3.11 handles Z suffix) | `datetime` |
| Reading/writing JSON | `json.loads / json.dumps` | `import json` |
| Config parsing | `tomllib` (3.11+, read-only) | `import tomllib` |
| CLI arg parsing | `argparse` (stdlib!) — reach for `typer` only if you actually want type-hint-driven UX | — |
| HTTP fetch | `urllib.request.urlopen` for one-shot; `httpx` if the project uses it | — |
| Env vars | `os.environ["KEY"]` — let missing keys raise, don't `.get()` with a silent fallback | — |
| Temp files/dirs | `tempfile.TemporaryDirectory()` (context manager) | `import tempfile` |
| Simple SQL | `sqlite3` for local; `duckdb` for analytics | `import sqlite3` |
| Concurrency | `concurrent.futures.ThreadPoolExecutor` for I/O; `asyncio.gather` for async | — |
| Regex | `re.compile` at module scope; `re.fullmatch` when you mean it | `import re` |
| Random | `secrets` for tokens/passwords, `random` for anything not security-sensitive | `import secrets` |
| UUID | `uuid.uuid4()` — never roll your own | `import uuid` |
| Deep copy | `copy.deepcopy` — or better, don't mutate | `import copy` |
| Data classes | `@dataclass(slots=True, frozen=True)` before reaching for pydantic | `from dataclasses import dataclass` |
| Enum | `enum.StrEnum` (3.11+) | `from enum import StrEnum` |
| Function memoization | `functools.lru_cache`, `functools.cache` (3.9+) | `from functools import cache` |
| Partial application | `functools.partial` | `from functools import partial` |

## When a library actually earns its place

Only after the ladder rules out stdlib. Real, actively-maintained, docs you can read:

| Domain | Library | Install | Why |
| --- | --- | --- | --- |
| HTTP client | `httpx` | `pip install httpx` | requests-compatible + sync/async + HTTP/2. [docs](https://www.python-httpx.org) |
| Validation & settings | `pydantic` v2 | `pip install pydantic` | fast, typed, great errors. [docs](https://docs.pydantic.dev) |
| CLI | `typer` | `pip install typer` | type-hint CLI on top of Click. [docs](https://typer.tiangolo.com) |
| Retries | `tenacity` | `pip install tenacity` | declarative retry; don't hand-roll exponential backoff. [docs](https://tenacity.readthedocs.io) |
| Dates (parse/format) | `python-dateutil` | `pip install python-dateutil` | only if you need loose parsing; stdlib handles ISO. [docs](https://dateutil.readthedocs.io) |
| Data | `polars` | `pip install polars` | pandas replacement — faster, saner API. [docs](https://docs.pola.rs) |
| Analytics DB | `duckdb` | `pip install duckdb` | in-process OLAP; kills a Postgres-for-analytics build. [docs](https://duckdb.org/docs) |
| Testing | `pytest` | `pip install pytest` | zero boilerplate. [docs](https://docs.pytest.org) |
| Fake data / factories | `polyfactory` | `pip install polyfactory` | for pydantic/dataclass models. [docs](https://polyfactory.litestar.dev) |

## Anti-patterns to flag in review

- `class FooManager` / `class FooService` with only static methods → make them module-level functions.
- `try: … except Exception: pass` — either handle it or let it raise.
- `if x == True:` → `if x:`.
- `list(map(f, xs))` → `[f(x) for x in xs]`.
- Custom singleton class → module-level constant.
- `os.path.join(os.path.dirname(__file__), "..", "config")` → `Path(__file__).parent.parent / "config"`.
- Custom `retry` decorator → `tenacity.retry`.
- Custom JSON encoder for datetime → store as ISO string, decode explicitly.
- Bare `assert` in production code (stripped with `-O`) → raise `ValueError`.
- `datetime.utcnow()` → **never**; use `datetime.now(timezone.utc)`.
