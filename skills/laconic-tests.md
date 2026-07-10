---
name: laconic-tests
description: Write the smallest test that would have caught the bug — or the smallest test that pins the behavior the user cares about. One assertion per test. No test frameworks the project doesn't already use.
---

# /laconic-tests

Given a function, a bug report, or a diff, write tests that are minimal, targeted, and use whatever framework the project already ships. **Do not add a new testing dependency.**

## Output shape

```
## Test plan
- <one bullet per test — what behavior it pins, what it would have caught>

## Tests
```<lang>
<the tests — one file, importable, runnable via the project's existing test command>
```

## What is not tested (and why)
- <bullet — behavior you deliberately did not cover, with one-clause reason>
```

## Rules

- **One assertion per test.** If you need three assertions, you have three tests.
- **AAA layout** — Arrange, Act, Assert. Blank lines between. No helper if the setup is 2 lines.
- **Names describe behavior**, not the function name.
  - ✅ `test_retries_three_times_then_gives_up`
  - ❌ `test_retry_1`
- **Table-driven** where the same shape repeats (`pytest.mark.parametrize`, `it.each` / `describe.each`, Go `for _, tc := range cases`).
- **Fixtures** only if used by ≥2 tests. Otherwise inline.
- **No mocks for code the test controls.** Only mock at real trust boundaries (network, disk, clock, randomness). Prefer fakes over mock objects.
- **Clock / randomness / uuid**: inject or freeze. `freezegun` for Python if already installed; otherwise pass a `now()` param. Never call the real clock in tests.
- **Coverage is not a target.** Cover the behavior the user cares about + the failure modes that actually happen. Ignore lines that are trivially wrong-if-broken (getters, forwarding).

## When the user asks for "unit tests" but means "any tests"

Ask once: _"unit, integration, or an end-to-end that walks the real API? each catches different bugs — which one just bit you?"_ Then write only that layer.

## When the tested code is over-engineered

Do not write tests around a bad abstraction. Say so: _"I'd rather delete <thing> than test it — see laconic-review. If you want it tested as-is, here you go."_ Then write the tests.

## Anti-patterns to flag

- `test_it_works` — meaningless name.
- Tests that print instead of assert.
- `sleep(1)` — the test is wrong; use fake clocks / awaited events.
- Snapshot tests for logic (fine for HTML / JSON schemas, wrong for functions).
- Setup fixtures shared across the whole file when only 2 tests use them.
- `@pytest.mark.skip` or `it.skip` without a linked issue.
- Mocking the function you are testing.
