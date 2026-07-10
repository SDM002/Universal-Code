# 06 — Node file helpers

**Prompt:** _"Read a file, make a directory if it doesn't exist, write JSON to it."_

## Before

```javascript
const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");

function saveConfig(configPath, data) {
  return new Promise((resolve, reject) => {
    mkdirp(path.dirname(configPath), (err) => {
      if (err) return reject(err);
      fs.writeFile(configPath, JSON.stringify(data, null, 2), "utf8", (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });
}
```

**Cost:** 13 lines, `mkdirp` dep, callback-hell, uses old CommonJS require. Doesn't handle read side.

## After

```javascript
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname } from "node:path";

async function saveConfig(p, data) {
  await mkdir(dirname(p), { recursive: true });
  await writeFile(p, JSON.stringify(data, null, 2));
}

const loadConfig = async (p) => JSON.parse(await readFile(p, "utf8"));
```

**Cost:** 7 lines. No dep. Native promises. `{recursive: true}` replaces `mkdirp`. Default encoding for `writeFile` is fine (utf8).

## Which rung landed

**Rung 3 — stdlib.** Node 16+ shipped `fs.mkdir({recursive: true})` — the entire reason `mkdirp` exists is gone. Node 18+ has `node:fs/promises` fully baked. Same story for `node-fetch` (native `fetch` in 18+) and `dotenv` (Node 21+ has `--env-file=.env`).

## Bonus native replacements

| Package you'd install | Node native replacement |
| --- | --- |
| `mkdirp` | `fs.mkdir({recursive: true})` |
| `rimraf` | `fs.rm({recursive: true, force: true})` |
| `node-fetch` | native `fetch` (18+) |
| `uuid` (v4) | `crypto.randomUUID()` |
| `dotenv` | `node --env-file=.env` (20+) or `process.loadEnvFile()` (21+) |
| `chalk` (basic) | `util.styleText` (20.12+) |
| `p-limit` (basic) | `Promise.all` + `AbortController` pattern |
