---
name: laconic-js
description: JavaScript / TypeScript ladder. Native browser + Node platform features and stdlib replacements to reach for before adding a dependency. Covers React idioms too.
---

# Laconic — JavaScript / TypeScript cheat sheet

Rung 3 (**stdlib**) and rung 4 (**native platform**) are enormous in JS because the browser and Node ship huge runtimes. Reach for these **before** `npm i`.

## Native browser platform — the stuff people npm-install by accident

| You were about to install… | The browser already has | Docs |
| --- | --- | --- |
| `react-datepicker`, `flatpickr`, `pikaday` | `<input type="date">`, `<input type="time">`, `<input type="datetime-local">` | [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date) |
| `react-color`, color-picker libs | `<input type="color">` | MDN |
| `react-select` (simple case) | `<select>` + `<datalist>` | MDN |
| `react-modal` | `<dialog>` + `.showModal()` | [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) |
| `react-accordion` | `<details>` / `<summary>` | MDN |
| `react-tooltip` (basic) | `title` attribute; CSS `:has()` for fancy | — |
| `lodash.debounce` | `setTimeout` + `clearTimeout` in 4 lines | — |
| `lodash.get`, `lodash.set` | optional chaining `a?.b?.c`, nullish `??` | — |
| `lodash.clonedeep` | `structuredClone(x)` | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) |
| `uuid` (browser-only case) | `crypto.randomUUID()` | MDN |
| `axios` (simple case) | `fetch` + `AbortController` | MDN |
| `date-fns` for basic format | `Intl.DateTimeFormat`, `Intl.RelativeTimeFormat` | MDN |
| `numeral.js`, `accounting.js` | `Intl.NumberFormat` (currency, percent, compact) | MDN |
| `querystring` / URL builders | `URL`, `URLSearchParams` | MDN |
| `pluralize` | `Intl.PluralRules` | MDN |
| `mousetrap`, `hotkeys-js` (simple) | `addEventListener('keydown', …)` + `event.key` | MDN |
| `react-transition-group` (simple) | CSS transitions + `View Transitions API` | MDN |
| `react-router` (static-ish site) | Native `<a>` + History API + `URL` | MDN |
| Custom form validation | HTML5 constraints: `required`, `pattern`, `type`, `minlength`, `:invalid` | MDN |
| Custom clipboard | `navigator.clipboard.writeText(…)` | MDN |
| Custom image lazy-load | `<img loading="lazy">` | MDN |

## Node stdlib

| You were about to write / install… | Use instead |
| --- | --- |
| `fs-extra` for basics | `node:fs/promises` — has `mkdir({recursive:true})`, `cp`, `rm({recursive:true})` since Node 16 |
| `path.join` + string gymnastics | `node:path` — but prefer `URL` for file paths in ESM |
| `dotenv` | Node 20+ has `--env-file=.env`; `process.loadEnvFile()` in 21+ |
| `node-fetch` | native `fetch` (Node 18+) |
| `uuid` | `crypto.randomUUID()` (Node 14.17+) |
| `bcrypt` fallback | `crypto.scrypt` for password hashing (real bcrypt still fine when installed) |
| `chalk` (simple) | `node:util.styleText` (Node 20.12+) |
| `mkdirp`, `rimraf` | `fs.mkdir({recursive:true})`, `fs.rm({recursive:true, force:true})` |
| Custom stream helpers | `node:stream/promises` — `pipeline`, `finished` |
| Custom test runner | `node --test` (Node 20+) — zero-dep test runner |

## JS/TS language features people forget

- Array/iterable: `Array.from`, `Array.of`, `[...set]`, `Object.fromEntries`, `.flat()`, `.flatMap()`, `.at(-1)`, `.findLast`, `.groupBy` (ES2024)
- Object: `Object.groupBy`, `structuredClone`, spread + rest, `Object.hasOwn`
- Set operations (ES2025 in modern browsers): `set.union`, `intersection`, `difference`, `symmetricDifference`
- `Promise.all`, `Promise.allSettled`, `Promise.any`, `Promise.race`, top-level `await` (ESM)
- `AbortController` for cancelling `fetch`, timers, and custom async work
- Tagged templates for safe SQL / HTML (`html\`\`` tag with escaping helper)

## When a library actually earns its place

| Domain | Library | Install | Why |
| --- | --- | --- | --- |
| Runtime validation | `zod` | `npm i zod` | schema → type inference, tiny, universal. [docs](https://zod.dev) |
| Dates (real complexity) | `date-fns` OR `Temporal` polyfill | `npm i date-fns` | tree-shakeable. Skip if `Intl` covers it. [docs](https://date-fns.org) |
| HTTP (retries/interceptors) | `ky` | `npm i ky` | thin `fetch` wrapper, ~3kb. [docs](https://github.com/sindresorhus/ky) |
| State (React) | `zustand` | `npm i zustand` | 1kb, no boilerplate, replaces Redux for 95% of apps. [docs](https://zustand-demo.pmnd.rs) |
| Data fetching (React) | `@tanstack/react-query` | `npm i @tanstack/react-query` | caching, dedup, revalidation. [docs](https://tanstack.com/query) |
| Forms (React) | `react-hook-form` + `zod` | `npm i react-hook-form @hookform/resolvers zod` | uncontrolled = fast. [docs](https://react-hook-form.com) |
| Icons | `lucide-react` | `npm i lucide-react` | tree-shakeable SVG icons. [docs](https://lucide.dev) |
| Styling | Tailwind CSS | `npm i -D tailwindcss` | co-locate style, delete when unused. [docs](https://tailwindcss.com) |
| Testing | `vitest` | `npm i -D vitest` | jest-compat, Vite-fast. [docs](https://vitest.dev) |
| E2E | `playwright` | `npm i -D @playwright/test` | multi-browser, auto-wait. [docs](https://playwright.dev) |

## React-specific anti-patterns to flag

- `useState` + `useEffect(setFoo(computed))` → derive during render.
- `useEffect` to sync props to state → probably a bug; lift up or derive.
- `useMemo` around a cheap expression → measure first; usually dead cost.
- Custom `usePrevious` / `useDebounce` when a `ref` and `setTimeout` would do.
- `React.FC<Props>` — the type has no upside, drop it.
- `class` component in new code — always function + hooks.
- `key={index}` on a list that reorders — bug factory; use a stable id.
- Fetch in `useEffect` when the app has a data-fetching library.
- Prop-drilling more than 2 levels → context, or accept it.

## TypeScript anti-patterns

- `any` — either `unknown` or narrow it.
- `as SomeType` — either the compiler is right or you have a schema at the boundary.
- Enums where a string union works: `type Status = 'idle' | 'loading' | 'done'`.
- Deep type gymnastics for a one-time transform — a plain function is fine.
- Barrel `index.ts` re-exports that break tree-shaking in prod.
