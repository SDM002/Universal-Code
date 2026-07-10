# 07 — Lodash → JS built-ins

**Prompt:** _"I use lodash — can I drop it?"_

## The tradeoff

Lodash is 71kb minified (24kb the tree-shaken version). Every function you use has a native equivalent that shipped years ago. Most projects drag lodash in for 2–3 functions.

## The lookup table

| Lodash | Modern JS |
| --- | --- |
| `_.get(obj, 'a.b.c')` | `obj?.a?.b?.c` |
| `_.set(obj, 'a.b', v)` | ternary + spread — or `structuredClone` first |
| `_.cloneDeep(x)` | `structuredClone(x)` |
| `_.merge(a, b)` | `{...a, ...b}` (shallow) or `structuredClone` + walk (deep) |
| `_.isEqual(a, b)` | `JSON.stringify(a) === JSON.stringify(b)` for plain data, or a 5-line recursive walk |
| `_.debounce(fn, ms)` | 4 lines with `setTimeout` + `clearTimeout` |
| `_.throttle(fn, ms)` | 5 lines with a timestamp check |
| `_.uniq(arr)` | `[...new Set(arr)]` |
| `_.uniqBy(arr, 'id')` | `[...new Map(arr.map(x => [x.id, x])).values()]` |
| `_.chunk(arr, n)` | 4 lines with `.slice()` + `for` — or `Array.from({length: Math.ceil(arr.length/n)}, ...)` |
| `_.groupBy(arr, 'k')` | `Object.groupBy(arr, x => x.k)` (ES2024) |
| `_.keyBy(arr, 'id')` | `Object.fromEntries(arr.map(x => [x.id, x]))` |
| `_.flatten(arr)` | `arr.flat()` |
| `_.flattenDeep(arr)` | `arr.flat(Infinity)` |
| `_.pick(obj, keys)` | `Object.fromEntries(keys.map(k => [k, obj[k]]))` |
| `_.omit(obj, keys)` | `Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)))` |
| `_.orderBy(arr, ['k'], ['asc'])` | `[...arr].sort((a,b) => a.k - b.k)` |
| `_.range(n)` | `Array.from({length: n}, (_, i) => i)` |
| `_.max(arr)` / `_.min` | `Math.max(...arr)` / `Math.min(...arr)` |
| `_.sum(arr)` | `arr.reduce((s, x) => s + x, 0)` |
| `_.mean(arr)` | `arr.reduce((s,x) => s+x, 0) / arr.length` |
| `_.capitalize(s)` | `s[0].toUpperCase() + s.slice(1)` |
| `_.kebabCase(s)` | 1 regex: `s.replace(/[A-Z]/g, m => '-' + m.toLowerCase()).replace(/^-/, '')` |
| `_.isEmpty(x)` | `!x || (typeof x === 'object' && !Object.keys(x).length)` |
| `_.compact(arr)` | `arr.filter(Boolean)` |
| `_.partition(arr, fn)` | manual: `arr.reduce(([a,b], x) => fn(x) ? [[...a,x],b] : [a,[...b,x]], [[],[]])` |

## Which rung landed

**Rung 4 — native language features.** Every entry above is either syntax (`?.`, spread, `Object.groupBy`) or a built-in (`structuredClone`, `Set`, `Map`, `Array.prototype.flat`).

## When lodash still earns its slot

- **You use 15+ functions** — then removal cost > bundle size.
- **Deep-merge with custom customizer functions** — lodash's is genuinely more capable than the naive one.
- **Legacy IE support** — you probably don't care in 2026, but if you do, keep it.

For the 95% case: drop it, save 70kb.
