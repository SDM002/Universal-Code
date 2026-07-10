# bench — how lazy is laconic?

A one-file harness that reads the `before` / `after` blocks in every example under `../examples/` and reports the line reduction.

```bash
node bench/run.mjs            # human table
node bench/run.mjs --json     # + JSON blob (for CI / the landing page)
```

## Why not a fancier tool?

Rung 3. `node:fs`, `node:path`, one regex. If it grows past 60 lines, delete features until it fits.

## Adding an example to the bench

Just add a `.md` file to `examples/` with:

- `## Before` followed by a fenced code block
- `## After` followed by a fenced code block

The harness auto-discovers it — no config, no allow-list.

## What it does not measure (and why)

- **Bytes** — line count is what humans read.
- **AST complexity** — different languages, different weights; not comparable.
- **Runtime perf** — laconic is about the code you never wrote; the code you never wrote also never runs.
