---
name: laconic-explain
description: Explain code line-by-line — what each line does, why it is written that way, and how it works mechanically. For learning, code review, or onboarding.
---

# /laconic-explain

Explain the code the user provides (or the currently-open file). One entry per **non-blank, non-comment-only** line.

Format — strict, one line per entry, no prose between:

```
L<line> │ <code, trimmed> │ WHAT: <one clause> │ WHY: <one clause> │ HOW: <one clause>
```

Rules:

- **WHAT** = the visible effect (assigns, calls, returns, mutates X).
- **WHY** = the role of this line in the surrounding function (guard, setup, hot path, cleanup, boundary check).
- **HOW** = the mechanism (which stdlib / library / language feature is doing the work, and one relevant detail — e.g. "uses HTTP/2 keep-alive via `httpx.Client`", or "amortised O(1) because it's a hash lookup").

After the table, one final block:

## In one paragraph
_(3–5 sentences: what the whole snippet accomplishes, its inputs, its side-effects, and one thing to watch out for.)_

## Redundant / removable lines
_(bulleted list of line numbers the reader could drop with no behavior change, if any — otherwise the line "None.")_

Never invent behavior. If a call's semantics are unclear, mark HOW as `unclear — verify against docs at <url>` rather than guessing.
