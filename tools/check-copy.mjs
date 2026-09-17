// Copy check: no em dashes, American spelling. See "Copy rules" in CLAUDE.md.
//
// Scans dist/, the exact files Vercel serves, rather than src/. The build
// strips code comments, so only text that actually ships can be flagged;
// developer notes may use whatever punctuation they like.
//
//   npm run check:copy
//
// Builds first, then prints each hit with a little surrounding text so it
// can be found in src/. Exits 1 if anything is found.
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// fileURLToPath, not URL.pathname: the repo path contains a space.
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");

execSync("npm run build", { cwd: ROOT, stdio: "ignore" });

// The em dash, literal or as the escape a minifier may write instead.
const EM_DASH = /—|\\u2014|&mdash;|&#8212;/g;

// British stems. Add to this list rather than loosening it. "labelledby" is
// excluded because aria-labelledby is an HTML attribute name, not copy.
const BRITISH = new RegExp(
  "\\b\\w*(" + [
    "organis", "systemis", "centralis", "prioritis", "visualis", "summaris",
    "customis", "recognis", "optimis", "categoris", "minimis", "standardis",
    "normalis", "utilis", "realis(?:e|ed|es|ing|ation)", "scrutinis", "emphasis[ei]", "synthesis[ei]",
    "analys(?:e|ed|es|ing)\\b", "behaviour", "colour", "favour", "honour", "labour",
    "labell(?!edby)", "modell", "travell", "cancell", "centre", "licence",
    "catalogue", "programme", "judgement", "whilst", "amongst",
  ].join("|") + ")\\w*",
  "gi",
);

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? walk(p) : [p];
});

const files = walk(DIST).filter((f) => /\.(html|js|css|json|svg|txt)$/i.test(f));
let hits = 0;
for (const f of files) {
  const text = fs.readFileSync(f, "utf8");
  for (const [label, re] of [["em dash", EM_DASH], ["British spelling", BRITISH]]) {
    for (const m of text.matchAll(re)) {
      const snippet = text.slice(Math.max(0, m.index - 50), m.index + m[0].length + 50).replace(/\s+/g, " ");
      console.log(`${label.padEnd(17)} ${path.relative(ROOT, f)}  "${m[0]}"  …${snippet}…`);
      hits++;
    }
  }
}

console.log(hits ? `\n${hits} issue(s). Fix them in src/ and run again.` : "Copy check passed: no em dashes, no British spellings.");
process.exit(hits ? 1 : 0);
