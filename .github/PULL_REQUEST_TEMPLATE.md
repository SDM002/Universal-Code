<!-- Laconic PR — keep this short. The ladder applies to PRs too. -->

## What

_(one sentence — what did you change?)_

## Why

_(one sentence — which rung of the ladder does this sharpen, or which agent / language does this add?)_

## Type

- [ ] Sharpen an existing rule
- [ ] Add a new agent adapter
- [ ] Add a new language sheet (`skills/lang/<lang>.md`)
- [ ] Add a before/after example (`examples/`)
- [ ] Fix docs / typo / broken link
- [ ] Landing page (`site/`)

## Checklist

- [ ] Real package names only (verified on the registry)
- [ ] No new rule that softens the ladder or removes a security / accessibility non-negotiable
- [ ] Under ~50 lines (unless it's a new language sheet)
- [ ] Markdown lint passes locally (`npx markdownlint-cli2 "**/*.md"`)
- [ ] I read `CONTRIBUTING.md`

## Test

_(if it's a rule change: paste one prompt where the old rule failed and the new rule holds)_

```
<prompt>
```

**Before this PR:** _(what the agent produced)_
**After this PR:** _(what it should produce now)_
