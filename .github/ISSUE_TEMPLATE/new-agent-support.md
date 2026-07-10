---
name: Add support for a new agent
about: You want to use Laconic with an AI coding agent we don't cover yet
title: "[agent] "
labels: new-agent
---

## Agent name

_(e.g. Zed AI, Continue.dev, Aider, Sourcegraph Cody, Tabby, JetBrains AI Assistant, …)_

## Docs / homepage

_(link)_

## How does this agent load context?

- File path it auto-reads: `.???/rules/…` or `AGENTS.md` at repo root or in a workspace setting?
- Global vs. per-project?
- Skill / command support: yes / no. If yes, how are commands registered?

## Have you tested Laconic with it already?

- [ ] Yes — dropped `AGENTS.md` at the repo root and it worked
- [ ] Yes — needed a specific file path (details below)
- [ ] No, requesting support

## Willing to send a PR?

- [ ] Yes — I'll add the adapter file + a row in the README table
- [ ] No, opening this for someone else to pick up
