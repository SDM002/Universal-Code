import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Terminal,
  Github,
  Zap,
  ShieldCheck,
  Package,
  Wand2,
  ArrowRight,
  Copy,
  Check,
  Code2,
  MonitorCheck,
  BookOpen,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HERO_TERMINAL_LINES = [
  "# antigravity",
  "$ agy plugin install \\",
  "    github.com/SDM002/Universal-Code",
  "",
  "# vs code (copilot chat)",
  "$ curl -o .github/\\",
  "  copilot-instructions.md \\",
  "  https://raw.githubusercontent.com/\\",
  "  SDM002/Universal-Code/main/\\",
  "  .github/copilot-instructions.md",
  "",
  "laconic: active · full mode",
];

/* ---------------- Data ---------------- */

const RUNGS = [
  { n: 1, k: "Does this need to exist?", v: "no → skip it (YAGNI)" },
  { n: 2, k: "Already in this codebase?", v: "reuse it, don't rewrite" },
  { n: 3, k: "Stdlib does it?", v: "use it" },
  { n: 4, k: "Native platform feature?", v: "use it" },
  { n: 5, k: "Installed dependency?", v: "use it" },
  { n: 6, k: "Open-source library exists?", v: "suggest it (real names only)" },
  { n: 7, k: "One line?", v: "one line" },
  { n: 8, k: "Only then:", v: "the minimum that works" },
];

const INSTALLS = {
  antigravity: {
    label: "Antigravity",
    subtitle: "Google's agentic IDE (agy CLI)",
    lines: ["$ agy plugin install \\", "    https://github.com/SDM002/Universal-Code"],
    note: "Or drop AGENTS.md at your workspace root — Antigravity auto-loads it as always-on context.",
  },
  vscode: {
    label: "VS Code",
    subtitle: "GitHub Copilot Chat",
    lines: [
      "$ mkdir -p .github && curl -o .github/\\",
      "    copilot-instructions.md \\",
      "    https://raw.githubusercontent.com/\\",
      "    SDM002/Universal-Code/main/\\",
      "    .github/copilot-instructions.md",
    ],
    note: "Reload the VS Code window. Copilot now walks the ladder on every prompt.",
  },
  others: {
    label: "Others",
    subtitle: "Claude Code, Codex, Cursor, Windsurf, Cline…",
    lines: [
      "# Claude Code / Codex / Amp / Jules",
      "$ curl -o AGENTS.md \\",
      "    https://raw.githubusercontent.com/\\",
      "    SDM002/Universal-Code/main/AGENTS.md",
      "",
      "# Cursor:  .cursor/rules/laconic.md",
      "# Windsurf: .windsurf/rules/laconic.md",
      "# Cline:    .clinerules/laconic.md",
    ],
    note: "Laconic is just markdown. Every modern agent has a place to drop it.",
  },
};

const DIFFS = [
  {
    id: "date-picker",
    title: "React date picker",
    lang: "tsx",
    file: "BirthdayField.tsx",
    rung: "rung 4 · native platform",
    before: `// User: "add a date picker"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

export function BirthdayField() {
  const [d, setD] = useState<Date | null>(null);
  return (
    <DatePicker
      selected={d}
      onChange={setD}
      dateFormat="yyyy-MM-dd"
      placeholderText="YYYY-MM-DD"
    />
  );
}`,
    after: `// laconic: the browser has one
<input type="date" name="birthday" />`,
  },
  {
    id: "deep-clone",
    title: "Deep clone in JS",
    lang: "js",
    file: "clone.js",
    rung: "rung 4 · native platform",
    before: `function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  const out = {};
  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      out[k] = deepClone(obj[k]);
    }
  }
  return out;
}`,
    after: `// laconic: the platform has one
const copy = structuredClone(value);`,
  },
  {
    id: "python-retry",
    title: "Python HTTP retry",
    lang: "python",
    file: "fetch.py",
    rung: "rung 6 · earned library (tenacity)",
    before: `import time, requests
def fetch(url, tries=3, delay=1):
    for i in range(tries):
        try:
            r = requests.get(url, timeout=5)
            r.raise_for_status()
            return r.json()
        except requests.RequestException:
            if i == tries - 1: raise
            time.sleep(delay * (2 ** i))`,
    after: `from tenacity import retry, stop_after_attempt, wait_exponential
import httpx

@retry(stop=stop_after_attempt(3), wait=wait_exponential())
def fetch(url):
    return httpx.get(url, timeout=5).raise_for_status().json()`,
  },
  {
    id: "go-slice",
    title: "Go slice utils",
    lang: "go",
    file: "utils.go",
    rung: "rung 3 · stdlib (slices)",
    before: `func Contains(xs []int, v int) bool {
  for _, x := range xs {
    if x == v { return true }
  }
  return false
}

func Max(xs []int) int {
  m := xs[0]
  for _, x := range xs { if x > m { m = x } }
  return m
}`,
    after: `import "slices"

slices.Contains(xs, v)
slices.Max(xs)`,
  },
];

const STATS = [
  { k: "97", v: "lines saved" },
  { k: "68%", v: "avg reduction" },
  { k: "8", v: "before/after examples" },
  { k: "0", v: "API keys required" },
];

const COMMANDS = [
  { c: "/laconic", d: "Show the ladder & current mode.", icon: Terminal },
  { c: "/laconic-review", d: "Audit current diff → delete-list.", icon: ShieldCheck },
  { c: "/laconic-explain", d: "Line-by-line what / why / how.", icon: BookOpen },
  { c: "/laconic-libs", d: "Suggest real open-source libraries.", icon: Package },
  { c: "/laconic-minimal", d: "Rewrite as the minimum that works.", icon: Wand2 },
  { c: "/laconic-tests", d: "Smallest test that would have caught it.", icon: MonitorCheck },
  { c: "/laconic-security", d: "Trust-boundary audit, ranked by exploit.", icon: ShieldCheck },
];

/* ---------------- UI Bits ---------------- */

function CopyBtn({ text, testid }) {
  const [c, setC] = useState(false);
  return (
    <button
      data-testid={testid}
      onClick={() => {
        navigator.clipboard.writeText(text);
        setC(true);
        setTimeout(() => setC(false), 1200);
      }}
      className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-cyan-400 transition-colors"
    >
      {c ? <Check size={13} /> : <Copy size={13} />}
      {c ? "copied" : "copy"}
    </button>
  );
}

function TerminalBox({ lines, testid }) {
  const raw = lines.filter((l) => !l.startsWith("#") && l.trim()).join(" ").replace(/\\ /g, "").replace(/\s+/g, " ");
  return (
    <div className="border border-white/10 bg-black rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-neutral-950">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
        </div>
        <span className="text-[11px] text-neutral-500 font-mono">bash — laconic</span>
        <CopyBtn text={raw} testid={`${testid}-copy`} />
      </div>
      <pre className="font-mono text-[13px] leading-relaxed text-neutral-200 p-5 scanlines overflow-x-auto">
        {lines.map((l, i) => (
          <div key={i} className={l.startsWith("#") ? "text-neutral-500" : ""}>
            {l || "\u00A0"}
          </div>
        ))}
      </pre>
    </div>
  );
}

function CodeBlock({ code, lang, label }) {
  return (
    <div className="border border-white/10 bg-neutral-950 rounded-md overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 text-[11px] text-neutral-500 font-mono">
        <span>{label}</span>
        <span>{lang}</span>
      </div>
      <pre className="font-mono text-[12.5px] leading-relaxed text-neutral-200 p-5 overflow-x-auto flex-1">
        {code}
      </pre>
    </div>
  );
}

/* ---------------- Page ---------------- */

const Home = () => {
  const [tab, setTab] = useState("antigravity");
  const [diffId, setDiffId] = useState(DIFFS[0].id);
  const diff = DIFFS.find((d) => d.id === diffId);

  return (
    <div className="min-h-screen bg-black text-neutral-200 grain relative">
      {/* Nav */}
      <nav
        data-testid="nav"
        className="sticky top-0 z-20 backdrop-blur-xl bg-black/60 border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="w-2 h-2 bg-cyan-400 rounded-full" />
            laconic<span className="text-cyan-400">.</span>
          </a>
          <div className="flex items-center gap-5 text-sm">
            <a href="#ladder" className="text-neutral-400 hover:text-white transition-colors">the ladder</a>
            <a href="#example" className="text-neutral-400 hover:text-white transition-colors">example</a>
            <a href="#install" className="text-neutral-400 hover:text-white transition-colors">install</a>
            <a href="#commands" className="text-neutral-400 hover:text-white transition-colors">commands</a>
            <a
              data-testid="github-nav"
              href="https://github.com/SDM002/Universal-Code"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-cyan-400 transition-colors"
            >
              <Github size={15} /> GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="top" className="relative border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-32 grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-7 rise">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono text-cyan-400 border border-cyan-400/30 rounded-full px-3 py-1 mb-8">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" /> ruleset · v0.1 · MIT
            </div>
            <h1 className="font-display font-black text-5xl md:text-7xl leading-[0.95] tracking-tighter text-white">
              Write less.<br />
              <span className="text-cyan-400">Ship more.</span>
            </h1>
            <p className="mt-8 text-lg md:text-xl text-neutral-400 max-w-xl leading-relaxed">
              A ruleset that plugs into <span className="text-white">Antigravity</span>,{" "}
              <span className="text-white">VS Code Copilot</span>, Claude Code, Codex, Cursor — and teaches your AI agent to
              behave like the laziest senior dev in the room.
            </p>
            <p className="mt-4 text-neutral-500 font-mono text-sm max-w-xl">
              <span className="text-cyan-400">$</span> No API keys. No backend. No cost. Just markdown.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                data-testid="cta-install"
                href="#install"
                className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-black font-semibold px-5 py-2.5 rounded-md transition-colors active:scale-95"
              >
                <Terminal size={16} /> Install
              </a>
              <a
                data-testid="cta-github"
                href="https://github.com/SDM002/Universal-Code"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-white/15 hover:border-cyan-400/50 text-white px-5 py-2.5 rounded-md transition-colors"
              >
                <Github size={16} /> Star on GitHub
              </a>
            </div>
          </div>

          <div className="md:col-span-5 rise" style={{ animationDelay: "120ms" }}>
            <TerminalBox
              testid="hero-terminal"
              lines={HERO_TERMINAL_LINES}
            />
          </div>
        </div>
      </section>

      {/* Ladder */}
      <section id="ladder" className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-24">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="text-cyan-400 font-mono text-xs mb-3">01 / the method</p>
              <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-white leading-tight">
                Walk the ladder.<br />Stop at the first rung that holds.
              </h2>
              <p className="mt-6 text-neutral-400 leading-relaxed">
                Before writing any code, the agent works through eight rungs in order.
                The rung that holds is the answer. Every rung above is code you never wrote.
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="border border-white/10 rounded-md overflow-hidden">
                {RUNGS.map((r, i) => (
                  <div
                    key={r.n}
                    data-testid={`rung-${r.n}`}
                    className={`grid grid-cols-[3rem_1fr_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-cyan-400/5 ${
                      i !== RUNGS.length - 1 ? "border-b border-white/10" : ""
                    }`}
                  >
                    <span className="font-mono text-cyan-400 text-sm">0{r.n}</span>
                    <span className="text-white font-medium">{r.k}</span>
                    <span className="font-mono text-sm text-neutral-500 text-right">→ {r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section id="stats" className="border-b border-white/10 bg-neutral-950/40">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.v} data-testid={`stat-${s.v.replace(/\s+/g, "-")}`}>
              <p className="font-display font-black text-4xl md:text-5xl text-cyan-400 tracking-tighter">{s.k}</p>
              <p className="text-xs font-mono text-neutral-500 mt-1 uppercase tracking-wider">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Before / After — live picker */}
      <section id="example" className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-24">
          <p className="text-cyan-400 font-mono text-xs mb-3">02 / before &amp; after</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-white leading-tight max-w-3xl">
            Same prompt.<br />Different agent.
          </h2>
          <p className="mt-4 text-neutral-400 max-w-2xl">
            Pick a real prompt below. On the left, what your agent typically writes. On the right, what it writes with
            laconic loaded.
          </p>

          <div className="mt-10 flex flex-wrap gap-2">
            {DIFFS.map((d) => (
              <button
                key={d.id}
                data-testid={`diff-tab-${d.id}`}
                onClick={() => setDiffId(d.id)}
                className={`text-xs font-mono px-3 py-1.5 rounded-md border transition-colors ${
                  diffId === d.id
                    ? "border-cyan-400 text-cyan-400 bg-cyan-400/5"
                    : "border-white/10 text-neutral-500 hover:border-white/30 hover:text-neutral-300"
                }`}
              >
                {d.title}
              </button>
            ))}
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-6" style={{ minHeight: 340 }}>
            <div>
              <p className="text-xs font-mono text-red-400/80 mb-2">
                // without laconic — {diff.before.split("\n").length} lines
              </p>
              <CodeBlock code={diff.before} lang={diff.lang} label={diff.file} />
            </div>
            <div>
              <p className="text-xs font-mono text-cyan-400 mb-2">
                // with laconic — {diff.after.split("\n").length} lines · {diff.rung}
              </p>
              <CodeBlock code={diff.after} lang={diff.lang} label={diff.file} />
            </div>
          </div>

          <div className="mt-8">
            <a
              data-testid="cta-examples"
              href="https://github.com/SDM002/Universal-Code/tree/main/examples"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
            >
              8 more real-world examples on GitHub <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* Install */}
      <section id="install" className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-24">
          <p className="text-cyan-400 font-mono text-xs mb-3">03 / install</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-white leading-tight max-w-3xl">
            The most effort laconic will ever ask of you.
          </h2>

          <div className="mt-10">
            <div className="flex border-b border-white/10">
              {Object.entries(INSTALLS).map(([key, v]) => (
                <button
                  key={key}
                  data-testid={`tab-${key}`}
                  onClick={() => setTab(key)}
                  className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    tab === key
                      ? "border-cyan-400 text-white"
                      : "border-transparent text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  {v.label}
                  <span className="ml-2 text-[11px] font-mono text-neutral-600">{v.subtitle}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-8 items-start">
              <TerminalBox lines={INSTALLS[tab].lines} testid={`install-${tab}`} />
              <div className="text-neutral-400 leading-relaxed">
                <p className="text-white font-medium mb-3 flex items-center gap-2">
                  <MonitorCheck size={16} className="text-cyan-400" /> {INSTALLS[tab].label}
                </p>
                <p className="text-sm">{INSTALLS[tab].note}</p>
                <p className="text-xs font-mono text-neutral-600 mt-6">
                  Fork the repo → drop the file → your agent walks the ladder.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commands */}
      <section id="commands" className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-24">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="text-cyan-400 font-mono text-xs mb-3">04 / commands</p>
              <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-white leading-tight">
                Seven commands.<br />No more.
              </h2>
              <p className="mt-6 text-neutral-400 leading-relaxed">
                Available in skill-capable hosts (Antigravity, Claude Code, Codex, OpenCode). In VS Code Copilot Chat,
                just tell the agent what you want — the ruleset is already loaded.
              </p>
            </div>
            <div className="md:col-span-8 grid gap-3">
              {COMMANDS.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <div
                    key={cmd.c}
                    data-testid={`cmd-${cmd.c.replace(/\W/g, "")}`}
                    className="grid grid-cols-[2rem_1fr_auto] items-center gap-4 border border-white/10 rounded-md px-5 py-4 hover:border-cyan-400/40 hover:bg-cyan-400/5 transition-colors"
                  >
                    <Icon size={18} className="text-cyan-400" />
                    <div>
                      <p className="font-mono text-white text-sm">{cmd.c}</p>
                      <p className="text-sm text-neutral-500 mt-0.5">{cmd.d}</p>
                    </div>
                    <ArrowRight size={16} className="text-neutral-600" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Non-negotiables */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-24">
          <p className="text-cyan-400 font-mono text-xs mb-3">05 / never on the chopping block</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-white leading-tight max-w-3xl">
            Lazy — never negligent.
          </h2>
          <p className="mt-6 text-neutral-400 max-w-2xl leading-relaxed">
            Laziness stops here. Laconic will never cut the code that keeps your users&apos; data safe.
          </p>
          <div className="mt-10 grid md:grid-cols-2 gap-4">
            {[
              { t: "Trust-boundary validation", d: "user → server, disk → memory, network deserialization.", icon: ShieldCheck },
              { t: "Security", d: "auth, secrets, SQL/NoSQL injection, XSS, CSRF, path traversal.", icon: ShieldCheck },
              { t: "Data-loss handling", d: "transactions, atomic writes, idempotency keys, safe migrations.", icon: Zap },
              { t: "Accessibility", d: "semantic HTML, keyboard focus, alt, label, ARIA where the DOM lies.", icon: MonitorCheck },
              { t: "Real error handling", d: "network, disk, races — not defensive try/except around code that can't throw.", icon: Code2 },
              { t: "The 120-line cache class", d: "if you actually need it, laconic builds it. Correctly. While looking at you.", icon: Package },
            ].map((n) => {
              const Icon = n.icon;
              return (
                <div key={n.t} className="border border-white/10 rounded-md p-5 hover:border-cyan-400/30 transition-colors">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Icon size={16} className="text-cyan-400" /> {n.t}
                  </div>
                  <p className="text-sm text-neutral-500 mt-2 leading-relaxed">{n.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 grid md:grid-cols-3 gap-10 text-sm">
          <div>
            <p className="font-display font-bold text-white text-lg flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full" /> laconic<span className="text-cyan-400">.</span>
            </p>
            <p className="text-neutral-500 mt-3 max-w-xs leading-relaxed">
              _Laconic_ (adj.): using few words. From Sparta. They had a reputation.
            </p>
          </div>
          <div>
            <p className="text-neutral-400 font-medium mb-3">Links</p>
            <ul className="space-y-2 text-neutral-500">
              <li><a href="https://github.com/SDM002/Universal-Code" className="hover:text-cyan-400 transition-colors">GitHub</a></li>
              <li><a href="https://github.com/SDM002/Universal-Code/tree/main/examples" className="hover:text-cyan-400 transition-colors">Examples</a></li>
              <li><a href="https://github.com/SDM002/Universal-Code/blob/main/skills/laconic.md" className="hover:text-cyan-400 transition-colors">The ruleset</a></li>
              <li><a href="https://github.com/SDM002/Universal-Code/blob/main/CONTRIBUTING.md" className="hover:text-cyan-400 transition-colors">Contribute</a></li>
              <li><a href="https://github.com/SDM002/Universal-Code/blob/main/LICENSE" className="hover:text-cyan-400 transition-colors">MIT license</a></li>
            </ul>
          </div>
          <div>
            <p className="text-neutral-400 font-medium mb-3">Works with</p>
            <p className="text-neutral-500 leading-relaxed">
              Google Antigravity · VS Code Copilot · Claude Code · Codex · Cursor · Windsurf · Cline · JetBrains Junie ·
              Amp · Jules · CodeWhale · Swival
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-neutral-600 font-mono">
          <span className="cursor-blink">The best code is the code you never wrote</span>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
