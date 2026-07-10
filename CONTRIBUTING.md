# Contributing to Laconic

Laconic is markdown. That's the whole point. Contributing = adding or sharpening a rule, a language sheet, an agent adapter, or an example. **You don't need to be able to code to contribute — you need to have opinions about code.**

## What we accept

- **Sharper rules** — a rung on the ladder that isn't landing (agent still over-builds despite the rule). Rewrite it, PR it, cite the failing prompt.
- **New agent adapters** — a `.rules/laconic.md` / `.clinerules/laconic.md` / `.cursor/rules/laconic.md` for an agent we don't cover yet.
- **New language sheets** — add `skills/lang/<language>.md` following the shape of `python.md`, `js.md`, `go.md`. Stdlib table + earned-libraries table + anti-patterns.
- **Before/after examples** — a real over-built pattern + the laconic one-liner. Add to `examples/`, ~30–80 lines total per file.
- **README fixes** — typos, broken links, unclear install instructions.

## What we don't accept

- New rules that soften the ladder (no _"unless the developer prefers…"_ escape hatches). Laconic is opinionated on purpose.
- Rules that would cut security, validation at trust boundaries, or accessibility. Those are non-negotiable — see `skills/laconic.md`.
- Package recommendations for libraries you haven't verified exist on the registry. **Never invent a package name.**
- Frameworks, tooling, opinions dressed as rules ("prefer functional over OOP"). Rules must be _measurable_ ("if `structuredClone` exists, use it").

## PR checklist

- [ ] Rule / example / adapter is under **~50 lines** unless it's a new language sheet.
- [ ] Real, verifiable package names only. Include the registry URL if you're citing a library.
- [ ] Cross-linked from the closest ladder rung in `skills/laconic.md` (if you added a rule).
- [ ] Added to the README table (if you added a new agent adapter).
- [ ] `npm run lint` passes (markdown lint runs in CI).

## Local dev

The ruleset itself is just markdown — clone and edit. The landing page:

```bash
cd site        # or /frontend if you cloned the monorepo
yarn install
yarn start     # http://localhost:3000
```

The backend is a health check only — no LLM keys, no build step.

## How the ladder gets sharper over time

The single best contribution is a **failing prompt**: _"I asked Copilot X with laconic loaded, and it still over-built by Y."_ Open an issue with the exact prompt + the agent's response + the shorter one you expected. That's how rungs get honed.

## Style

- Second person, present tense (_"When you see X, do Y"_).
- No hedging (_"maybe"_, _"consider"_, _"you might"_). If the ladder says it, it means it.
- No emoji.
- Prefer bullets over paragraphs. Prefer tables over bullets when the shape matches.

## License

By contributing, you agree your contribution is MIT-licensed. That's the whole legal footprint.

## Getting help

- Open a [discussion](https://github.com/SDM002/Universal-Code/discussions) for open-ended questions.
- Open an [issue](https://github.com/SDM002/Universal-Code/issues) for a specific rule bug, agent that isn't loading the ruleset, or new-agent request.

Thanks for making the ladder sharper.
