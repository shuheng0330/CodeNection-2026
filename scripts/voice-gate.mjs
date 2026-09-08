/**
 * The voice gate.
 *
 * Pikul's whole thesis is "show the maths to judges, never to the user".
 * With several people writing UI in parallel, clinical vocabulary leaks in
 * by accident. This fails the build if any BANNED word reaches a string a
 * user could actually read.
 *
 * Import paths and comments are stripped first — `@/lib/engine/acwr` is a
 * module specifier, not something anyone sees on screen.
 *
 *   node scripts/voice-gate.mjs
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = ["app", "components"];
/** copy.ts and decline.ts are where every user-facing string actually lives,
 *  so gating only app/ and components/ misses the file this exists to police.
 *  The rest of lib/ is named in the engine's own vocabulary and is not scanned. */
const FILES = ["lib/copy.ts", "lib/decline.ts"];
const BANNED = [
  "acwr",
  "acute",
  "chronic",
  "burnout",
  "streak",
  "productivity score",
  "risk score",
];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if ([".ts", ".tsx"].includes(extname(p))) out.push(p);
  }
  return out;
}

/** Remove block comments, line comments and import statements. */
function strip(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .map((l) => (/^\s*import\s|^\s*}\s*from\s|^\s*from\s/.test(l) ? "" : l))
    .map((l) => l.replace(/\/\/.*$/, ""))
    .join("\n");
}

let failures = 0;

const targets = [...ROOTS.flatMap(walk), ...FILES];

for (const file of targets) {
  {
    const lines = strip(readFileSync(file, "utf8")).split("\n");
    lines.forEach((line, i) => {
      for (const word of BANNED) {
        if (line.toLowerCase().includes(word)) {
          console.error(`  ${file}:${i + 1}  "${word}"  ->  ${line.trim()}`);
          failures++;
        }
      }
    });
  }
}

if (failures) {
  console.error(`\nvoice gate FAILED: ${failures} clinical term(s) reachable by a user.\n`);
  process.exit(1);
}
console.log("voice gate passed — no clinical vocabulary in any user-facing string.");
