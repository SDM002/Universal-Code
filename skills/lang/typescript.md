---
name: laconic-typescript
description: TypeScript-specific ladder — the type-system side of the JS sheet. Reach for these language features before adding a validator, a class hierarchy, or a codegen tool.
---

# Laconic — TypeScript cheat sheet

Use alongside [`js.md`](./js.md). That sheet handles runtime — this one handles the type system. If it can be expressed as a type, don't turn it into runtime code.

## Types — what people forget

| You were about to write… | Use instead |
| --- | --- |
| `interface Foo { a: string }` with one call site | Inline `{ a: string }` — extract when it's reused. |
| Enum for string constants | `type Role = "admin" \| "user"` — no runtime overhead, better DX. |
| `any` because "I'll fix it later" | `unknown` + narrow at the boundary. `any` disables the type checker. |
| Type guard function with 12 lines | `in` operator (`if ("id" in x)`), `typeof`, `instanceof`, or discriminated union. |
| Class with static-only methods | Module with exported functions. |
| Optional param with `?` and then check inside | Overloads or discriminated union — model the two shapes. |
| Runtime shape validation | `zod` at the boundary; static types in the interior. |
| Utility type by hand | `Pick`, `Omit`, `Partial`, `Required`, `Readonly`, `Record`, `Awaited`, `ReturnType`, `Parameters`. |
| Const-narrowing ceremony | `as const` on the literal — the type follows for free. |
| `Array<string>` verbosely | `string[]` — same type, half the noise. |
| `Promise<Foo> \| Foo` return | `MaybePromise<Foo>` via `Awaited` — or just always return `Promise<Foo>`. |
| `keyof typeof CONST_OBJ` gymnastics | Define the type as `as const`, use `typeof CONST_OBJ[keyof typeof CONST_OBJ]`. |
| Branded types via classes | `type UserId = string & { readonly __brand: "UserId" }`. |

## Discriminated unions beat class hierarchies

```ts
// no
class ApiOk { data: T }
class ApiErr { message: string }
type ApiResult = ApiOk | ApiErr;

// yes
type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
```

The compiler narrows on `.ok`. Zero runtime cost.

## `unknown` at trust boundaries

```ts
// zod at the edge
const User = z.object({ id: z.string(), name: z.string() });
type User = z.infer<typeof User>;

// safe from here on — the type IS the validator
const user = User.parse(await res.json());
```

## When a library actually earns its place

Only after stdlib types are ruled out:

| Domain | Library | Install | Why |
| --- | --- | --- | --- |
| Runtime validation | `zod` | `npm i zod` | schema + inferred TS type, no duplication. [docs](https://zod.dev) |
| Better fetch | `ky` (browser) / native `fetch` | `npm i ky` | timeouts, retries, JSON in one line — or use plain `fetch`. [docs](https://github.com/sindresorhus/ky) |
| ORM | `drizzle-orm` | `npm i drizzle-orm` | typed SQL without codegen overhead. [docs](https://orm.drizzle.team) |
| Env vars | `zod` + your own parse — no dep | — | you already have `zod`. |
| Env vars (no zod) | `@t3-oss/env-core` | `npm i @t3-oss/env-core` | typed env — only if you don't already have `zod`. [docs](https://env.t3.gg) |
| ts helpers | `type-fest` | `npm i type-fest` | curated utility types when stdlib runs out. [docs](https://github.com/sindresorhus/type-fest) |
| tRPC / hono | `hono` | `npm i hono` | typed router + client, zero-runtime types across boundaries. [docs](https://hono.dev) |

## `tsconfig` — the settings that matter

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "isolatedModules": true,
    "moduleResolution": "bundler",
    "target": "ES2022"
  }
}
```

Every one of these has caught a real bug. Turning them off is a decision — flag it if it silently changes.

## Anti-patterns to flag in review

- `any` — replace with `unknown` and narrow, or type it properly.
- `as SomeType` casts on unknown input — validate instead. Casts lie.
- `!` non-null assertion on values from `.find()`, DOM queries, `Map.get()` — narrow with `if (!x) throw`.
- `enum` for string constants — use string literal unions.
- `namespace` — legacy; use modules.
- `abstract class` with one implementation — collapse to a function or plain object.
- Generic `T` used only once in a function signature — you don't need generics.
- `interface` merging by accident — grep before you name types.
- Type files (`*.d.ts`) shipped for internal code — colocate types with implementation.
- `// @ts-ignore` without a comment explaining why — either fix it, or use `// @ts-expect-error` so it fails when the underlying bug is fixed.
