# Examples — the ladder in action

Real over-built patterns and their laconic one-liners. Each file shows the same task **before** (what an AI agent typically produces) and **after** (what Laconic produces once loaded).

| # | Example | Language | Ladder rung | Lines saved |
| --- | --- | --- | --- | --- |
| 01 | [React date picker](./01-react-date-picker.md) | TSX | 4 · native platform | ~14 → 1 |
| 02 | [Python HTTP retry loop](./02-python-retry.md) | Python | 6 · earned library (`tenacity`) | ~16 → 4 |
| 03 | [Deep-clone in JavaScript](./03-js-deepclone.md) | JS | 4 · native platform | ~12 → 1 |
| 04 | [Go slice utilities](./04-go-slice-utils.md) | Go | 3 · stdlib (`slices`) | ~20 → 2 |
| 05 | [HTML form validation](./05-form-validation.md) | HTML | 4 · native platform | ~40 → 6 |
| 06 | [Node file helpers](./06-node-fs-helpers.md) | Node | 3 · stdlib (`fs/promises`) | ~15 → 3 |
| 07 | [Lodash → JS built-ins](./07-lodash-alternatives.md) | JS | 4 · native language | ~1 dep dropped |
| 08 | [Custom event emitter](./08-custom-emitter.md) | Node | 4 · native (`EventTarget`) | ~30 → 4 |

Each example ends with the **exact ladder rung** that landed. Read them in order or by rung — they all show the same principle.

Run the [bench harness](../bench/) to see the aggregate reduction across all examples:

```bash
node bench/run.mjs
# TOTAL     before: 143      after: 46      saved: 97 (68%)
```

## Want to add one?

See [CONTRIBUTING.md](../CONTRIBUTING.md#what-we-accept). PRs to `examples/` are the fastest way to sharpen the ruleset — a good example teaches an agent more than a page of rules.
