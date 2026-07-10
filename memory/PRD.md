# Laconic — PRD

## Original problem statement (verbatim)

> Build a ai tool, which helps all developers, whatever the code the cluade, codex, antigravity gives, … should write 100lines of code.. rather check whts necessary for teh used case.. is there any library availabel…. Specific… more useful.. open source and all.. the. Only hep for coding… review the code.. explain each line of code what going to do.. why… how it will inplemt and everything. It should be open source, github so anyone can plugin to there vs code, antigravity to do there job… similar to ponytail repo (https://github.com/DietrichGebert/ponytail)

## Product

**Laconic** — an open-source (MIT) ruleset that plugs into AI coding agents (Antigravity, VS Code Copilot Chat, Claude Code, Codex, Cursor, Windsurf, Cline, Junie, Amp, Jules, CodeWhale). Teaches them to walk a lazy-senior-dev **ladder** before writing code. Zero infra, zero API keys, zero cost. Monorepo hosting the ruleset + live landing page + examples gallery.

Live: https://code-explain-ai-3.emergent.host
GitHub target: https://github.com/SDM002/Universal-Code

## User personas

- **Individual developers** on Antigravity / VS Code Copilot / Cursor who are tired of their agent over-building.
- **Team leads / staff engineers** wanting to standardize agent behaviour across a codebase.
- **OSS contributors** who want their PRs (AI-drafted or otherwise) to reuse before rewriting.
- **Contest / hackathon judges** — scanning a public GitHub repo for signs of a live OSS project.

## Core requirements

1. Markdown-only ruleset, agent-agnostic, zero infrastructure.
2. The ladder (YAGNI → reuse → stdlib → native → installed dep → open-source lib → one-liner → minimum-that-works).
3. Never touch security / trust boundaries / accessibility / data-loss handling.
4. Five commands: `/laconic`, `/laconic-review`, `/laconic-explain`, `/laconic-libs`, `/laconic-minimal`.
5. Install docs for Antigravity + VS Code Copilot Chat as P0; other agents as bonus.
6. Public landing page that markets the project + hosts install commands.
7. Community kit — CONTRIBUTING, SECURITY, issue templates, PR template, CI lint — so contributors can plug in.

## Repo structure (as of Jan 10, 2026)

```
Universal-Code/
├── skills/                                the ruleset
│   ├── laconic.md, laconic-review.md, laconic-explain.md, laconic-libs.md, laconic-minimal.md
│   └── lang/{python,js,go}.md             stdlib cheat sheets
├── examples/                              8 before/after files
├── AGENTS.md                              universal ruleset entry point
├── gemini-extension.json                  Antigravity (agy) plugin manifest
├── .github/
│   ├── copilot-instructions.md            VS Code Copilot Chat entry point
│   ├── ISSUE_TEMPLATE/{bug-in-rule, new-agent-support, new-language-sheet}.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/lint.yml                 markdown + JSON lint on PR
├── frontend/                              React landing page (deployed live)
├── backend/                               minimal FastAPI health check
├── package.json                           @sdm002/laconic, npm-publishable
├── LICENSE                                MIT
├── README.md                              badges, install, ladder, examples, layout
├── CONTRIBUTING.md
├── SECURITY.md
└── .gitignore
```

## What's been implemented

**Jan 9**
- Ruleset (`skills/laconic.md`) + 4 skill commands (`review`, `explain`, `libs`, `minimal`).
- `AGENTS.md` (universal), `.github/copilot-instructions.md` (VS Code), `gemini-extension.json` (Antigravity).
- Landing page — hero, ladder, before/after, install tabs, commands, non-negotiables, footer. Dark terminal aesthetic (Outfit + Geist + JetBrains Mono, cyan phosphor accent, grain, scanlines).
- Backend stripped to health-check only.

**Jan 10**
- Language cheat sheets: `skills/lang/python.md`, `js.md`, `go.md`.
- `YOUR-USER` → `SDM002/Universal-Code` swap across README + landing page.
- Monorepo restructure — ruleset moved to repo root (ponytail-style) so forks look right.
- OSS community kit:
  - `CONTRIBUTING.md`, `SECURITY.md`
  - `.github/ISSUE_TEMPLATE/` × 3 (bug in rule / new agent / new language)
  - `.github/PULL_REQUEST_TEMPLATE.md`
  - `.github/workflows/lint.yml` (markdown + JSON lint on PR)
  - `.gitignore` updated for workspace files
- **`examples/`** — 8 real-world before/after files: React date picker, Python retry, JS deep-clone, Go slice utils, form validation, Node fs helpers, lodash alternatives, custom event emitter.
- README rewritten with badges (MIT / PRs Welcome / GH Actions / Live Site) + repo-layout diagram + examples link.
- `package.json` renamed to `@sdm002/laconic` with `homepage`, `repository`, `bugs`, keywords.
- Landing page now has "8 more real-world examples on GitHub" CTA in the before/after section.

## Verified

- Backend `/api/` + `/api/health` respond OK.
- Landing page renders cleanly at preview URL — hero, ladder, before/after with new examples CTA, install tabs, commands grid all working.
- ESLint clean on `App.js`.

**Feb 10, 2026**
- **App.js**: removed a dead `useEffect` that fired `axios.get(/api/)` and discarded the result (YAGNI, rung 1). Also dropped the `axios` import — no longer used anywhere in the frontend.
- **App.js**: extracted the hero terminal's inline `lines={[…]}` array to a module-level `HERO_TERMINAL_LINES` const.
- **App.js**: sanitized stats test-ids (`stat-${label.replace(/\W+/g, "-")}`) so labels containing `/` produce valid dash-separated ids.
- **backend/server.py**: added return type hints to all three functions (`root`, `health`, `shutdown_db_client`). Then deleted the entire `motor` MongoDB client, `mongo_url`, `db`, and `shutdown_db_client` — nothing was using it. The backend is now a pure two-endpoint health-check, aligning with the "zero backend" promise on the landing page.
- **Rejected 4 scanner false positives** (documented in main-agent response): shadcn/ui `use-toast.js` untouched (module-level singletons, not stale closures); static array-index keys kept (`TerminalBox.lines` never reorders); 355-line `Home` component kept as-is (splitting into 8 files serves nobody).
- **Testing**: `testing_agent_v3_fork` reported 100% pass on both frontend and backend after these changes.
- **New skills**: `skills/laconic-tests.md` (smallest test that would have caught the bug) and `skills/laconic-security.md` (trust-boundary audit, ranked by exploitability). Command count: 5 → 7.
- **New language sheets**: `skills/lang/rust.md` and `skills/lang/typescript.md` (dedicated type-system cheat sheet complementing js.md). Languages covered: 3 → 5.
- **Benchmark harness** (`bench/run.mjs`) — zero-dep Node script that auto-discovers `## Before` / `## After` blocks in every example and prints a reduction table (or JSON via `--json`). Current numbers: **143 → 46 lines, 68% saved across 7 examples**. Documented in `bench/README.md`.
- **npm publish prep**: `package.json` gained `type: "module"`, `bench` / `bench:json` scripts, `publishConfig.access: public`. `.npmignore` added to keep `frontend/`, `backend/`, `tests/`, CI workflows and issue templates out of the shipped tarball. `bench/` added to the `files` allow-list.
- **Landing page polish**:
  - Stats bar (**97 lines saved · 68% avg reduction · 8 examples · 0 API keys**).
  - Before/after section is now a live picker across 4 diffs (React date picker, JS deep-clone, Python retry, Go slice utils) — each shows the exact ladder rung that landed and the live line count.
  - Commands grid now shows all 7 (added `/laconic-tests` and `/laconic-security`).
- README updated: new commands, new languages, bench section, refreshed repo layout tree.

## Repo structure (Feb 10, 2026)

```
Universal-Code/
├── skills/
│   ├── laconic.md
│   ├── laconic-{review,explain,libs,minimal,tests,security}.md
│   └── lang/{python,js,typescript,go,rust}.md
├── examples/                        8 before/after files
├── bench/                           run.mjs + README.md (zero-dep harness)
├── AGENTS.md
├── gemini-extension.json
├── .github/{copilot-instructions.md, ISSUE_TEMPLATE/, workflows/lint.yml, …}
├── frontend/                        React landing page (deployed live)
├── backend/                         minimal FastAPI health check
├── package.json                     @sdm002/laconic, npm-publishable
├── .npmignore                       keeps frontend/backend/CI out of the tarball
├── LICENSE (MIT), README.md, CONTRIBUTING.md, SECURITY.md
```

## What's next (user needs to do)

1. **Push to GitHub** — use Emergent's "Save to GitHub" button in the chat input → connect to `SDM002/Universal-Code`.
2. **Repo settings on GitHub** — set Public, add topics, enable Discussions, add the live URL as the repo website.
3. **npm publish** (locally): `npm login` → create `@sdm002` scope on npmjs.com (free) → `npm publish --access public`.
4. **Contest submission** — email support@emergent.sh for Raj Shamani contest official rules; project is submission-ready.
5. **GitHub social preview image** — `.github/preview.png` for share cards.

## Backlog

- **P1** — Cursor / Windsurf / Cline mirror rule files (currently only documented in README).
- **P1** — Discord / Discussions link (placeholder in CONTRIBUTING.md and SECURITY.md).
- **P2** — Java / Ruby / PHP / Kotlin language sheets.
- **P2** — Benchmark: reproduce ponytail-style measurement in a headless Copilot session (upgrade beyond the current static harness).
- **P2** — Hooks for auto-activation on skill-capable hosts (Claude Code, Codex).
- **P3** — Live-try playground on landing page (paste code → get delete-list). Deliberately deferred.
