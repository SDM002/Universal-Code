---
name: laconic-security
description: Security review for the current diff or file. Focus on trust boundaries — the places laconic never lets you cut corners. Return actionable findings ranked by exploitability, not by CVSS theatre.
---

# /laconic-security

Read the diff (or file) and audit **only what a real attacker would try**. No compliance checklists, no boilerplate.

## Output — exactly this shape

## Verdict
_(one sentence — safe / one issue / needs work.)_

## Findings
Ranked. For each:

```
### <short title>
- **Severity**: critical / high / medium / low   _(exploitability, not CVSS)_
- **Where**: `path/file.ext:LINE-LINE`
- **Attack**: <one sentence — what an attacker sends / clicks / crafts>
- **Impact**: <one sentence — what they get>
- **Fix**: <one line or one snippet — the smallest change that closes it>
- **Reuse**: <existing stdlib / native / installed dep that already handles this — if any>
```

## Non-issues (checked and passed)
- <bullet — items you looked at that are correct, so the human doesn't wonder>

## Out of scope
- <bullet — anything the diff doesn't touch that you didn't audit>

## The trust boundaries — laconic's never-cut list

1. **Every input crossing user → server** — validate at the boundary, not deep in a helper.
2. **Every value going into a query / template / shell / eval** — parameterise / escape / never string-concat.
3. **Every path from user input** — resolve, then check it stays under a known root. Reject symlinks unless you meant them.
4. **Every deserialization** — JSON only. `pickle`, `yaml.load`, `eval`, `unserialize` from network = no.
5. **Every auth check** — on the server. Never trust the client's `role`, `is_admin`, or JWT `exp` without verification.
6. **Every secret** — from env, not from source. Never logged, never in error responses.
7. **Every crypto call** — use the platform / library. `bcrypt`, `argon2`, `nacl`, `crypto.subtle`. Never roll your own.
8. **Every random used for security** — `secrets` / `crypto.randomBytes` / `crypto.getRandomValues`, never `Math.random` or `random`.

## What laconic does not care about here

- CVE headline-chasing on dependencies you don't call.
- Adding rate-limits to endpoints that don't exist.
- HSTS / CSP unless the diff introduces a page or route.
- Renaming a variable because it "sounds insecure".

## When the human insists on a custom auth flow

Note it in comments: `// laconic: custom auth kept at user request — see #issue`. Then implement it correctly. Correctness beats laziness here — always.
