---
name: laconic-go
description: Go-specific ladder. Stdlib is the star of the show — reach for a third-party module only when the stdlib genuinely doesn't cover it.
---

# Laconic — Go cheat sheet

Go's stdlib is the most complete in mainstream languages. Rung 3 (**stdlib does it?**) will hold for the vast majority of tasks. This sheet is your memory bank.

## Standard library — the ones you should be reaching for first

| You were about to write / import… | Use instead |
| --- | --- |
| Custom slice helpers (map/filter/contains) | `slices` package (Go 1.21+): `slices.Contains`, `slices.Index`, `slices.Sort`, `slices.SortFunc`, `slices.Concat`, `slices.Chunk` (1.23+), `slices.Collect` for iterators |
| Custom map helpers | `maps` package (Go 1.21+): `maps.Keys`, `maps.Values`, `maps.Clone`, `maps.Equal` |
| Iterators / generators | `iter` package + `range` over funcs (Go 1.23+) |
| Custom min/max | `min(a,b)`, `max(a,b)` built-ins (Go 1.21+) |
| Log libs (zap/logrus for basic) | `log/slog` — structured, leveled, in stdlib (Go 1.21+) |
| gorilla/mux (basic) | `net/http.ServeMux` — method + path patterns since Go 1.22 (`GET /users/{id}`) |
| `errors.Wrap` (pkg/errors) | `fmt.Errorf("… %w", err)` + `errors.Is` / `errors.As` |
| Custom retry | 4 lines: `for i := 0; i < n; i++ { … time.Sleep(backoff) }` |
| `time` formatting | `time.Format` with layout constants; `time.RFC3339` |
| UUID (v4) | `crypto/rand` + hex — but `github.com/google/uuid` is fine, one dep |
| CLI arg parsing | `flag` — reach for `spf13/cobra` only for multi-command CLIs |
| Env vars | `os.Getenv` / `os.LookupEnv` — no dep for this |
| HTTP client | `net/http.Client` + `context.Context` for timeouts |
| JSON | `encoding/json` — `json.Marshal`, `json.Unmarshal`, struct tags |
| YAML | `gopkg.in/yaml.v3` (unavoidable — not in stdlib) |
| TOML | `github.com/BurntSushi/toml` |
| SQL | `database/sql` + a driver; add `sqlx` only if scans hurt |
| Query building | prefer plain SQL strings + `?` placeholders; add `squirrel` only if joins get gnarly |
| Concurrency primitives | `sync`, `sync/atomic`, `context` — you rarely need a queue library |
| Worker pools | `errgroup.Group.SetLimit(n)` — from `golang.org/x/sync/errgroup` |
| Config files | `encoding/json` or `BurntSushi/toml` — reach for `viper` only when you truly need env + file + flag merge |
| Testing | `testing` package + `testify` **only for assert/require** — Go 1.24 has `testing/synctest` |
| HTTP testing | `net/http/httptest.Server` — no library needed |
| Random | `math/rand/v2` (Go 1.22+ — auto-seeded, generics-friendly); `crypto/rand` for security |
| File I/O | `os.ReadFile`, `os.WriteFile` — one-liners; `bufio.Scanner` for line iteration |
| Path manipulation | `path/filepath` for OS paths; `path` for URL-style |

## The `context.Context` rules (never violated)

- Every function that does I/O or can block takes `ctx context.Context` as the **first** argument.
- Never `context.Background()` inside a request handler — propagate the incoming ctx.
- Never store a `context.Context` in a struct — pass it explicitly.
- Cancel with `defer cancel()` immediately after `context.WithTimeout`/`WithCancel`.

## When a module actually earns its place

Real, well-maintained, boring-good Go modules:

| Domain | Module | Why |
| --- | --- | --- |
| SQL scanning | `github.com/jmoiron/sqlx` | `sql.DB` on stims. [docs](https://jmoiron.github.io/sqlx) |
| Postgres | `github.com/jackc/pgx/v5` | best pg driver. [repo](https://github.com/jackc/pgx) |
| ORM (only if you truly want one) | `github.com/uptrace/bun` | thin, honest SQL. [docs](https://bun.uptrace.dev) |
| HTTP router (fancy) | `github.com/go-chi/chi/v5` | net/http-compatible; middleware chains. [docs](https://go-chi.io) |
| Validation | `github.com/go-playground/validator/v10` | struct-tag driven. |
| Errgroup / concurrency | `golang.org/x/sync/errgroup` | first-party. |
| UUID | `github.com/google/uuid` | one dep, standard. |
| CLI (multi-command) | `github.com/spf13/cobra` | industry standard. |
| Config (env+file+flag) | `github.com/kelseyhightower/envconfig` | dead simple. Or `caarlos0/env`. |
| Testing helpers | `github.com/stretchr/testify` (only `require` / `assert`) | keep it to those two — skip `mock`. |
| Metrics / tracing | `go.opentelemetry.io/otel` | vendor-neutral, boring. |

## Anti-patterns to flag in review

- `interface{}` in a function signature that isn't marshalling / logging → use a concrete type or `any` + generics.
- Empty `interface Foo { … }` for "future flexibility" with one implementation — delete it.
- Panics as control flow — return errors, always.
- `err != nil { return err }` **without** wrapping context → wrap with `fmt.Errorf("read config: %w", err)`.
- `goroutine` leaks — every `go func()` needs a way to be cancelled (context) or bounded (waitgroup / errgroup).
- Global mutable state (`var db *sql.DB` at package level) — pass it explicitly.
- `for _, x := range slice { go func(x X) { … }(x) }` — Go 1.22+ fixed the loop-var trap; older code needs the shadow.
- Custom `SetTimeout` on `http.Client` when `context.WithTimeout` on the request is what you actually want.
- Reinventing `errgroup` with channels + waitgroups.
- Naming: acronyms stay upper case (`URL` not `Url`); receivers are one letter (`func (u *User)`); no `Get` prefix on getters.

## The Go proverbs (still true, still ignored)

- _"A little copying is better than a little dependency."_
- _"Don't communicate by sharing memory; share memory by communicating."_
- _"Clear is better than clever."_
- _"Errors are values."_
- _"The bigger the interface, the weaker the abstraction."_

If your PR contradicts one of these without a note, expect `/laconic-review` to call it out.
