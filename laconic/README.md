# Laconic

> _"He says nothing. He writes one line. It works."_

**Write less. Ship more.** Laconic is a minimalism ruleset — a bundle of markdown skills that plug into your AI coding agent (Antigravity, VS Code Copilot, Claude Code, Codex, Cursor, Windsurf, Cline, and more) and teach it to walk a **lazy-senior-dev ladder** before writing a single line.

No API keys. No backend. No cost. Zero infrastructure. It's markdown that gets injected as system prompt into whatever agent you already use.

---

## The Ladder

Before writing any code, the agent stops at the first rung that holds:

```
1. Does this need to exist?     → no: skip it (YAGNI)
2. Already in this codebase?    → reuse it, don't rewrite
3. Stdlib does it?              → use it
4. Native platform feature?     → use it (<input type="date">, <dialog>, Intl, URL, fetch, pathlib, slices…)
5. Installed dependency?        → use it (no duplicate HTTP clients / date libs)
6. Open-source library exists?  → suggest it (real package name; never invent one)
7. One line?                    → one line
8. Only then:                    the minimum that works
```

The ladder runs **after** understanding the problem, never instead of it. Lazy about the solution — never about reading the code.

## Before / after

You ask for a date picker. Your agent installs `react-datepicker`, writes a wrapper component, adds three stylesheets, and starts a discussion about timezones.

With Laconic:

```html
<!-- laconic: browser has one -->
<input type="date" />
```

---

## Install — VS Code (Copilot Chat)

Copy Laconic's instructions into your project (or globally):

```bash
# in your project root
mkdir -p .github
curl -o .github/copilot-instructions.md \
  https://raw.githubusercontent.com/SDM002/Universal-Code/main/.github/copilot-instructions.md

# also drop AGENTS.md — most modern agents read this
curl -o AGENTS.md \
  https://raw.githubusercontent.com/SDM002/Universal-Code/main/AGENTS.md
```

Reload the VS Code window (or restart Copilot Chat). Your agent now walks the ladder on every prompt. To make it global, drop the same files at `~/.copilot/copilot-instructions.md`.

## Install — Google Antigravity

Antigravity CLI (the `agy` binary) installs Laconic like any Gemini extension:

```bash
agy plugin install https://github.com/SDM002/Universal-Code
```

That's it. The `AGENTS.md` and the five skill commands (`/laconic`, `/laconic-review`, `/laconic-explain`, `/laconic-libs`, `/laconic-minimal`) become available in every session.

For the Antigravity IDE / agent workspace, drop `AGENTS.md` at the workspace root — Antigravity auto-loads it as always-on context.

## Install — Other agents (bonus)

Laconic is just markdown. Copy the matching file into any agent that reads it:

| Agent | Where |
| --- | --- |
| VS Code Copilot Chat | `.github/copilot-instructions.md` (project) or `~/.copilot/copilot-instructions.md` (global) |
| Antigravity / Gemini CLI | `agy plugin install <repo>` or drop `AGENTS.md` in workspace |
| Claude Code | `AGENTS.md` at repo root |
| Codex CLI | `AGENTS.md` at repo root (or `~/.codex/AGENTS.md` globally) |
| Cursor | `.cursor/rules/laconic.md` |
| Windsurf | `.windsurf/rules/laconic.md` |
| Cline | `.clinerules/laconic.md` |
| JetBrains Junie | Settings → Junie → Guidelines Path → point at `AGENTS.md` |
| Amp / Jules / CodeWhale | `AGENTS.md` at repo root (auto-loaded) |

## Commands

Available in skill-capable agents (Antigravity, Claude Code, Codex, OpenCode, and any host that supports `/skills`).

| Command | What it does |
| --- | --- |
| `/laconic` | Show the ladder and current mode. |
| `/laconic-review` | Review the current diff for over-engineering. Returns a delete-list. |
| `/laconic-explain` | Line-by-line **what / why / how** for the current file or selection. |
| `/laconic-libs` | Suggest existing open-source libraries that would replace the code. Real packages only. |
| `/laconic-minimal` | Rewrite the current code as the minimum that works. Preserves behavior, security, and accessibility. |

In VS Code Copilot Chat (no `/skills` support), just paste the intent into chat: _"review this diff with laconic"_, _"explain this function laconic-style"_, _"suggest a library instead of this hand-rolled code"_.

## Language cheat sheets

The ruleset ships with per-language memory banks so the agent stops reinventing stdlib. These are auto-loaded on skill-capable hosts and can be dropped into your project alongside `AGENTS.md`:

- **Python** — [`skills/lang/python.md`](./skills/lang/python.md) — `pathlib`, `slog`-ish `logging`, `zoneinfo`, `functools.cache`, when `httpx` / `pydantic` / `duckdb` / `polars` earn their keep.
- **JavaScript / TypeScript** — [`skills/lang/js.md`](./skills/lang/js.md) — the enormous list of npm packages the browser already ships (`<input type="date">`, `structuredClone`, `Intl`, `<dialog>`, `crypto.randomUUID`), plus Node stdlib and the small set of libs that actually earn a slot (`zod`, `ky`, `zustand`, `@tanstack/react-query`).
- **Go** — [`skills/lang/go.md`](./skills/lang/go.md) — `slices` / `maps` / `iter`, `log/slog`, `net/http.ServeMux` since 1.22, `errgroup`, and the boring-good modules that earn a place (`pgx`, `chi`, `sqlx`).

---

## Non-negotiables

Laziness stops at these lines. Laconic will **never** cut:

- Trust-boundary validation (user → server, disk → memory, network deserialization).
- Security (auth, secrets, SQL/NoSQL injection, XSS, CSRF, path traversal).
- Data-loss handling (transactions, atomic writes, idempotency keys).
- Accessibility (semantic HTML, keyboard focus, `alt`, `label`, ARIA).
- Error handling at real failure modes (network, disk, races).

The code you never wrote has zero bugs, zero CVEs, zero maintenance, and 100% uptime. The code that guards your users' data stays.

## FAQ

**Does it need an API key?**
No. Laconic is markdown. Your existing agent's model does the work.

**What about the 120-line cache class I actually need?**
Ask for it. Laconic will build it, correctly, while making a note of it.

**Does it work with GPT-5.4 / Claude Opus 4.8 / Gemini 3 Pro?**
Yes. It's agent-agnostic — plug it into whatever agent shells around whatever model you use.

**Why "Laconic"?**
_Laconic_ (adj.): using few words. From Sparta. They had a reputation.

## License

MIT. The shortest license that works.
