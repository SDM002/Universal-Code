---
name: laconic-minimal
description: Rewrite the user's code as the minimum that works — using stdlib, native platform features, or existing dependencies where they help. Preserve behavior, safety, and accessibility.
---

# /laconic-minimal

Rewrite the code the user provides as the **minimum that works**. Same language. Same behavior. Same safety.

Output — exactly these four sections, in this order, nothing else:

## Before
```<lang>
<the user's original code, unchanged>
```
_Lines: <int>_

## After
```<lang>
<the minimal rewrite>
```
_Lines: <int>_

## What changed
- <bullet — what you removed and why (which ladder rung applied)>
- <bullet — what you replaced with stdlib / native / existing dep, and where to find it in the docs>

## What stayed (and why)
- <bullet — every safety / validation / accessibility / error-handling line you kept, with a one-clause reason>

## Rules

- **Do not add dependencies** unless the user asked; if a new dep would help, mention it in "What changed" but leave it out of the rewrite.
- **Preserve public API**. Function signatures, exported names, return shapes must match the original unless the user says otherwise.
- **Preserve safety**. Trust-boundary validation, auth, escaping, transactions, error handling at real failure points — all stay.
- **Preserve accessibility**. `alt`, `label`, `aria-*`, keyboard handlers — all stay.
- If the code is already minimal, return _"Already minimal — no change."_ under `After` and empty other sections. Don't rewrite for the sake of it.
- If the rewrite is more than **50% shorter**, add a final line: `Saved N lines (~M%).`

Never introduce behavior the user didn't ask for. Never remove `//` or `#` comments the human wrote for future readers unless they're duplicating the code verbatim.
