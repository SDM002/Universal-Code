---
name: laconic-libs
description: Given a code snippet or a task description, suggest existing open-source libraries (PyPI / npm / crates / Maven / Go / etc.) that would replace or shorten the code. Real, verifiable packages only.
---

# /laconic-libs

For the code or task the user provides, list open-source libraries that would replace hand-written code.

Format — one block per suggestion:

```
### <package-name>
- **Ecosystem**: pypi / npm / cargo / go / maven / gem / composer / nuget
- **Install**: `<exact install command>`
- **Replaces**: `<lines / behavior it would replace>`
- **Why it wins**: <one sentence — maintained, battle-tested, native perf, less code>
- **Docs**: <official docs URL — readthedocs / pypi.org / npmjs.com / docs.rs / official project site>
- **Repo**: <GitHub URL>
- **Example** (3–6 lines, same language as the user's code):
  ```<lang>
  <minimal working snippet>
  ```
```

Rules:

- **Real packages only.** Do not invent names. If you are not sure whether `foo-magic` exists, say _"I'm not certain this package exists — verify on the registry."_
- Prefer **widely-used, actively-maintained** libraries with docs a human can actually read.
- Prefer **standard-library first**. If Python's `pathlib` or JS's `Intl.NumberFormat` already does it, say so and return **zero** external libraries.
- Prefer libraries **already in the project**. Read `package.json` / `requirements.txt` / `Cargo.toml` / `go.mod` before suggesting a new dep.
- If nothing beats the current code, return one line: _"Current code is already minimal; no library adds value here."_

End with:

## Ranked recommendation
_(one line — which suggestion, if any, the user should try first, and why.)_
