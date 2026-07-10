# 04 — Go slice utilities

**Prompt:** _"I need to check if a slice contains a value, find its index, and sort a slice of structs by a field."_

## Before

```go
package sliceutil

func Contains(s []string, v string) bool {
    for _, x := range s {
        if x == v { return true }
    }
    return false
}

func IndexOf(s []string, v string) int {
    for i, x := range s {
        if x == v { return i }
    }
    return -1
}

type User struct{ Name string; Age int }

func SortByAge(users []User) {
    sort.Slice(users, func(i, j int) bool {
        return users[i].Age < users[j].Age
    })
}
```

Plus a whole file (`sliceutil/sliceutil.go`) that only this package uses. Plus tests. Plus a `sliceutil` import in every caller.

## After

```go
import "slices"

exists := slices.Contains(names, "alice")
idx := slices.Index(names, "alice")
slices.SortFunc(users, func(a, b User) int { return a.Age - b.Age })
```

**Cost:** 3 lines. Package deleted. Import replaced with `slices` (stdlib since Go 1.21). Generic — works on any comparable slice, not just `[]string`.

## Which rung landed

**Rung 3 — stdlib.** Go 1.21 added the `slices` and `maps` packages. Before that, everyone rolled their own `Contains` / `IndexOf` in a `util` package — now it's stdlib.

Bonus 1.23 additions worth knowing:
- `slices.Chunk(s, n)` — batch a slice into groups of size `n`
- `slices.Collect(iter)` — materialize an iterator into a slice
- `maps.Collect(iter)` — same for maps
- `slices.All` / `slices.Values` — return iterators for `range` over func (1.23+)

## Anti-pattern to flag

Any Go project with a `pkg/util/`, `internal/helpers/`, or `sliceutil/` folder — usually 80% of it is now stdlib. `/laconic-review` catches this on sight.
