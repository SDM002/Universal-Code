# Security Policy

Laconic is a markdown ruleset. It has no runtime, no dependencies, no network access — it can't have a CVE in the traditional sense. But the **content** of a rule could indirectly cause harm if it teaches an agent to write unsafe code.

## What counts as a security issue in Laconic

- A rule that would cause an AI agent to omit a security control (auth check, input validation, escaping, path traversal guard, transaction integrity, secret handling).
- A rule that recommends a library with a known unpatched CVE.
- An example that ships insecure code without a warning.
- A CI workflow that could be abused (script injection, secret leak).

## What is _not_ a security issue

- The agent still over-builds — that's a rule-quality issue. Open a normal [issue](https://github.com/SDM002/Universal-Code/issues).
- The agent occasionally ignores the ladder — that's a model / host limitation, not laconic's fault. File it against the agent vendor.

## Reporting

**Do not open a public issue for security concerns.** Instead:

Email **[security@your-domain.example](mailto:security@your-domain.example)** with:

1. The rule / file / line you're flagging.
2. The prompt that reproduces the unsafe output.
3. The unsafe response the agent gave.
4. What the safe version would look like.

I'll respond within **7 days**. Confirmed issues get a fix in the next commit; the reporter is credited in the release notes unless they prefer to stay anonymous.

## Supply-chain surface

Laconic itself installs nothing. The landing page (`site/`) uses standard React deps managed via `yarn`. The backend uses `fastapi` + `motor`. Neither ships with the ruleset.

If you're forking the repo and only using the ruleset (`skills/`, `AGENTS.md`, `.github/copilot-instructions.md`, `gemini-extension.json`), your supply-chain surface is **zero** — it's markdown.

## Coordinated disclosure

If the issue affects an upstream agent (e.g. a specific Copilot / Antigravity / Claude Code behavior triggered by a rule), I'll coordinate with the vendor before public disclosure.
