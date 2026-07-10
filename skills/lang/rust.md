---
name: laconic-rust
description: Rust-specific ladder. Stdlib and native replacements to reach for before adding a crate. Use with laconic.md — this sheet is the "rung 3" (stdlib) and "rung 4" (installed defaults) memory bank for Rust code.
---

# Laconic — Rust cheat sheet

When the ladder lands on rung 3 (**stdlib does it?**) in a Rust codebase, this is the memory bank. Reach for these **before** adding a crate.

## Standard library — what people forget

| You were about to write… | Use instead | Import |
| --- | --- | --- |
| Manual iterator loop | `.iter().map().filter().collect()` | prelude |
| Custom `Option` unwrap-or-default | `.unwrap_or_default()`, `.unwrap_or_else(\|\| …)`, `.ok_or(err)?` | prelude |
| Error boilerplate | `?` + `impl From<Src> for Err` | prelude |
| Slice search / dedup / sort | `slice::binary_search`, `.dedup()`, `.sort_by_key()` | prelude |
| Group / chunk / windows | `.chunks(n)`, `.windows(n)` | prelude |
| Sum / product / min / max | `.sum::<u64>()`, `.max_by_key()` | prelude |
| Read whole file | `std::fs::read_to_string` | `use std::fs;` |
| Read line by line | `BufRead::lines()` | `use std::io::{BufRead, BufReader};` |
| Env vars | `std::env::var("KEY")?` — no default; let missing fail loud | `use std::env;` |
| Path joining | `Path::new(a).join(b)` — never `format!("{a}/{b}")` | `use std::path::{Path, PathBuf};` |
| Temp dirs / files | `tempfile` crate (widely installed) OR `std::env::temp_dir()` | — |
| HashMap defaults | `.entry(k).or_default()` / `.or_insert_with()` | prelude |
| Sorting for `Ord` | `.sort()` — stable, in place | prelude |
| Parsing numbers | `"42".parse::<i64>()?` | prelude |
| String from bytes | `std::str::from_utf8(&bytes)?` | prelude |
| Concurrency | `std::thread::spawn` for compute; `std::sync::mpsc` for channels | `use std::thread;` |
| Locks | `std::sync::Mutex`, `RwLock` (never both) | `use std::sync::Mutex;` |
| Once-init | `std::sync::OnceLock` (stable), `std::sync::LazyLock` (1.80+) | — |
| Formatting numbers | `format!("{n:>8}")`, `{:e}`, `{:.3}` | prelude |
| Time | `std::time::Instant` for durations; `SystemTime` only for wall clock | — |

## When a crate actually earns its place

Only after stdlib is ruled out. Real, widely-used, docs a human can read:

| Domain | Crate | Add | Why |
| --- | --- | --- | --- |
| Async runtime | `tokio` | `cargo add tokio -F rt-multi-thread,macros` | de-facto standard; only if you need async I/O. [docs](https://docs.rs/tokio) |
| HTTP client | `reqwest` | `cargo add reqwest -F json` | ergonomic, TLS, JSON. [docs](https://docs.rs/reqwest) |
| Serde | `serde`, `serde_json` | `cargo add serde -F derive && cargo add serde_json` | JSON / TOML / YAML / … the ecosystem's serialization. [docs](https://serde.rs) |
| CLI | `clap` | `cargo add clap -F derive` | derive-based args parser. [docs](https://docs.rs/clap) |
| Errors | `thiserror` (libs) / `anyhow` (apps) | `cargo add thiserror` / `cargo add anyhow` | never two error crates in one file. [docs](https://docs.rs/anyhow) |
| Tracing / logging | `tracing`, `tracing-subscriber` | `cargo add tracing tracing-subscriber` | structured, span-based. [docs](https://docs.rs/tracing) |
| UUIDs | `uuid` | `cargo add uuid -F v4` | never roll your own. [docs](https://docs.rs/uuid) |
| Date/time | `jiff` or `chrono` | `cargo add jiff` | `jiff` is the modern choice. [docs](https://docs.rs/jiff) |
| Regex | `regex` | `cargo add regex` | linear-time; compile once at module scope. [docs](https://docs.rs/regex) |
| Property tests | `proptest` | `cargo add --dev proptest` | for pure functions with lots of shapes. [docs](https://docs.rs/proptest) |

## Anti-patterns to flag in review

- `.unwrap()` on anything that can fail in production — return `Result` or `?`.
- `String::from(&s)` when `s.clone()` (or a `&str` reference) works.
- `Vec::new()` + `.push()` in a loop when `.collect()` fits.
- `if let Some(x) = opt { … } else { panic!() }` → `let x = opt.expect("why");`.
- Two `.iter()` passes when one `.fold()` does it.
- `Arc<Mutex<Vec<T>>>` shared across threads — usually a channel is simpler.
- `Box<dyn Trait>` used to "make it compile" — reach for generics first.
- `pub struct Wrapper(String)` with no invariant — use the inner type.
- Custom `Result<T, String>` — use a real error type (`thiserror`).
- Custom `Display` impl that duplicates `Debug`.
