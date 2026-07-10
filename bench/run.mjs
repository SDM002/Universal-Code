#!/usr/bin/env node
// laconic bench — measure line reduction across before/after examples.
// zero deps. stdlib only. rung 3.

import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "examples");

// One fenced code block after a heading matching `pattern`. Returns lines[].
const extractBlock = (md, pattern) => {
  const rx = new RegExp(`##\\s*${pattern}[^\\n]*\\n+\`\`\`[a-z]*\\n([\\s\\S]*?)\`\`\``, "i");
  const m = md.match(rx);
  return m ? m[1].trim().split("\n") : null;
};

const pct = (b, a) => (b === 0 ? 0 : Math.round(((b - a) / b) * 100));

const rows = readdirSync(ROOT)
  .filter((f) => /^\d+.+\.md$/.test(f))
  .sort()
  .map((f) => {
    const md = readFileSync(join(ROOT, f), "utf8");
    const before = extractBlock(md, "Before");
    const after = extractBlock(md, "After");
    if (!before || !after) return null;
    const title = md.match(/^#\s+(.+)/m)?.[1] ?? f;
    return { file: f, title, before: before.length, after: after.length };
  })
  .filter(Boolean);

const total = rows.reduce(
  (a, r) => ({ before: a.before + r.before, after: a.after + r.after }),
  { before: 0, after: 0 }
);

const pad = (s, n) => String(s).padEnd(n);
const rpad = (s, n) => String(s).padStart(n);

console.log("\nlaconic bench — line reduction across examples\n");
console.log(pad("example", 42), rpad("before", 8), rpad("after", 8), rpad("saved", 8), rpad("%", 6));
console.log("-".repeat(76));
for (const r of rows) {
  console.log(
    pad(r.title.slice(0, 40), 42),
    rpad(r.before, 8),
    rpad(r.after, 8),
    rpad(r.before - r.after, 8),
    rpad(pct(r.before, r.after) + "%", 6)
  );
}
console.log("-".repeat(76));
console.log(
  pad("TOTAL", 42),
  rpad(total.before, 8),
  rpad(total.after, 8),
  rpad(total.before - total.after, 8),
  rpad(pct(total.before, total.after) + "%", 6)
);

// Machine-readable output for CI / landing page.
if (process.argv.includes("--json")) {
  console.log("\n" + JSON.stringify({ rows, total, pct: pct(total.before, total.after) }, null, 2));
}
