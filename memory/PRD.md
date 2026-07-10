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

## What's next (user needs to do)

1. **Push to GitHub** — use Emergent's "Save to GitHub" button in the chat input → connect to `SDM002/Universal-Code`. `.gitignore` will exclude `/memory`, `/test_reports`, `/design_guidelines.json`.
2. **Repo settings on GitHub** — set to Public, add topics (`ai-agent`, `ai-coding`, `antigravity`, `copilot`, `minimalism`, `open-source`, `yagni`, `code-review`), enable Discussions, add the live URL as the repo website.
3. **npm publish** (locally): `npm login` → create `@sdm002` scope on npmjs.com (free) → `npm publish --access public`.
4. **Contest submission** — email support@emergent.sh for Raj Shamani contest official rules; the project is submission-ready (deployed, public repo, README, examples).
5. **GitHub social preview image** — `.github/preview.png` for the card that renders on X/LinkedIn shares.

## Backlog

- **P1** — Cursor / Windsurf / Cline mirror rule files (currently only documented in README).
- **P1** — Discord / Discussions link (placeholder in CONTRIBUTING.md and SECURITY.md).
- **P2** — Rust / Ruby / PHP / Kotlin language sheets.
- **P2** — `benchmarks/` — reproduce ponytail-style "% less code" measurement in a headless Copilot session.
- **P2** — Hooks for auto-activation on skill-capable hosts (Claude Code, Codex).
- **P3** — Live-try playground on landing page (paste code → get delete-list). Deliberately deferred; core value doesn't need it.
