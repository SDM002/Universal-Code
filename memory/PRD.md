# Laconic — PRD

## Original problem statement (verbatim)

> Build a ai tool, which helps all developers, whatever the code the cluade, codex, antigravity gives, … should write 100lines of code.. rather check whts necessary for teh used case.. is there any library availabel…. Specific… more useful.. open source and all.. the. Only hep for coding… review the code.. explain each line of code what going to do.. why… how it will inplemt and everything. It should be open source, github so anyone can plugin to there vs code, antigravity to do there job… similar to ponytail repo (https://github.com/DietrichGebert/ponytail)

## Product

**Laconic** — an open-source ruleset (markdown skill pack, MIT) that plugs into AI coding agents (Antigravity, VS Code Copilot Chat, Claude Code, Codex, Cursor, Windsurf, Cline, etc.) and teaches them to walk a **lazy-senior-dev ladder** before writing any code. **No backend LLM required** — the ruleset piggybacks on the agent the developer already uses. Ponytail-style delivery.

Deliverables:
- `/app/laconic/` — the fork-ready GitHub repo (ruleset + adapters + install docs)
- Landing page at the preview URL — hero, ladder, before/after example, install tabs (Antigravity / VS Code / Others), commands, non-negotiables, footer

## User personas

- **Individual developers** using Antigravity / VS Code Copilot / Cursor who are tired of their agent over-building.
- **Team leads / staff engineers** wanting to standardize agent behaviour across a codebase (via `AGENTS.md` in repo).
- **OSS maintainers** who want contributors' AI-generated PRs to reuse before rewriting.

## Core requirements (static)

1. Markdown-only ruleset, agent-agnostic, zero infra.
2. The ladder (YAGNI → reuse → stdlib → native → installed dep → open-source lib → one-liner → minimum-that-works).
3. Never touch security / trust boundaries / accessibility / data-loss handling.
4. Five commands: `/laconic`, `/laconic-review`, `/laconic-explain`, `/laconic-libs`, `/laconic-minimal`.
5. Install docs for Antigravity + VS Code Copilot Chat as P0; other agents as bonus.
6. Landing page that markets the project + hosts install commands.

## What's been implemented (Jan 2026)

- `laconic/skills/laconic.md` — the always-on ruleset (full ladder + non-negotiables + code style + library-suggestion contract).
- `laconic/skills/laconic-review.md` — `/laconic-review` command spec (delete-list format).
- `laconic/skills/laconic-explain.md` — `/laconic-explain` line-by-line what/why/how table format.
- `laconic/skills/laconic-libs.md` — `/laconic-libs` real-package-only library suggestion format.
- `laconic/skills/laconic-minimal.md` — `/laconic-minimal` rewrite spec (before/after/what-changed/what-stayed).
- `laconic/AGENTS.md` — compact universal ruleset (auto-loaded by VS Code Copilot, Antigravity, Claude Code, Codex, Amp, Jules, CodeWhale, Junie).
- `laconic/.github/copilot-instructions.md` — VS Code Copilot Chat specific.
- `laconic/gemini-extension.json` — Antigravity/Gemini CLI plugin manifest with 5 commands.
- `laconic/package.json` — npm-publishable manifest.
- `laconic/LICENSE` — MIT.
- `laconic/README.md` — full install docs (Antigravity + VS Code first, others tabled).
- Landing page (React) at `/app/frontend/src/App.js` with:
  - Sticky glass nav
  - Hero (Outfit black display type, cyan accent, terminal panel)
  - The Ladder (8-rung grid with hover states)
  - Before/After date-picker code compare
  - Install tabs (Antigravity / VS Code / Others) with copy-to-clipboard
  - Commands grid (5 commands, icons)
  - Non-negotiables (2×3 bento)
  - Footer with cursor-blink slogan
- Backend stripped to health-check only (`/api/`, `/api/health`) — no LLM dependency.

## Verified

- Backend `/api/` and `/api/health` respond OK.
- Landing page loads at preview URL; tabs switch content; all sections render; typography (Outfit / Geist / JetBrains Mono) loads; cyan accent + dark theme + terminal panels intact.

## Prioritized backlog

- **P1** — Replace all `YOUR-USER` placeholders in the ruleset repo with the real GitHub owner once forked.
- **P1** — Add per-language cheat-sheets under `skills/lang/` (`python.md`, `js.md`, `go.md`) — most common stdlib / native replacements per ecosystem.
- **P2** — Cursor / Windsurf / Cline / Kiro `.rules/` mirror files (currently documented in README; not yet committed as files).
- **P2** — `benchmarks/` — reproduce the ponytail-style "% less code" measurement with a headless Copilot / Antigravity session.
- **P2** — `hooks/` — Node.js lifecycle hooks for skill-capable hosts (Claude Code, Codex) so the ruleset auto-activates without manual `/plugin install`.
- **P3** — Landing page: a "try live" playground that takes pasted code and returns a `/laconic-review`-style delete-list (would need an LLM backend — deliberately deferred; the core value doesn't need it).

## Next tasks (if the user continues)

1. Have the user fork the repo → replace `YOUR-USER` string across README + landing page (single find/replace).
2. Publish to npm (`npm publish --access public`) so `agy plugin install @laconic/skill` works.
3. Add language cheat-sheets (Python, JS/TS, Go — the big three).
4. Ship Cursor / Windsurf / Cline rule mirror files.
