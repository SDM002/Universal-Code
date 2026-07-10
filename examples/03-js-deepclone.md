# 03 — Deep-clone in JavaScript

**Prompt:** _"Deep-clone this object without mutating the original."_

## Before

```javascript
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(deepClone);
  if (obj instanceof Object) {
    const copy = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        copy[key] = deepClone(obj[key]);
      }
    }
    return copy;
  }
}

const copy = deepClone(original);
```

Even worse: `npm i lodash.clonedeep`, then `const copy = cloneDeep(original)`. That's 71kb minified for one function.

## After

```javascript
const copy = structuredClone(original);
```

**Cost:** 1 line. Native in every modern browser and Node 17+. Handles `Date`, `Map`, `Set`, `RegExp`, typed arrays, and cycles. Doesn't handle functions or DOM nodes — but a `lodash.cloneDeep` doesn't either.

## Which rung landed

**Rung 4 — native platform feature.** `structuredClone` shipped in [all major browsers in 2022](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) and Node 17+. The custom function above will fail on cycles (stack overflow), lose `Map`/`Set`, and mishandle typed arrays. `structuredClone` handles all of them.

## When it doesn't work

- Cloning DOM nodes → use `node.cloneNode(true)`
- Cloning functions → you probably shouldn't be
- Very old Node (<17) → the polyfill package is called `@ungap/structured-clone`
