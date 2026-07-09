---
name: laconic-review
description: Review the current diff (or the file the user names) for over-engineering, unnecessary code, and missed reuse opportunities. Return a delete-list plus a short rationale per item.
---

# /laconic-review

Review the current change (`git diff`, or the file the user names) with the Laconic ladder in hand.

Produce **exactly this** output — nothing else:

## Verdict
_(one sentence: is this minimal, or does it over-build?)_

## Delete-list
For each unnecessary item, one bullet:
- `path/file.ext:LINE-LINE` — **what** to delete — **why** (which ladder rung it violates: YAGNI / already-in-codebase / stdlib / native / installed dep / one-liner).

## Reuse opportunities
- `path/file.ext:LINE` — replace with existing symbol `module.function` already in this codebase (`grep` result).

## Simpler alternatives
- `path/file.ext:LINE` — the 30-line X can be `native_feature` / `stdlib.thing` / `installed_lib.method` (one line, why it works).

## Kept
- Anything worth keeping the human might expect you to cut (safety, validation at trust boundary, accessibility). Explicit list — do not silently keep things.

## Estimated lines removable
_(single integer)_

Rules:
- Do not rewrite the code. Return the delete-list; the human decides.
- Never delete trust-boundary validation, security, accessibility, or real error handling. If in doubt, keep and note it under **Kept**.
- If the diff is already minimal, say so in one line and return empty lists.
