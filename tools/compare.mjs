/* Pixel-parity harness for the Stage 2 migration.
 *
 *   node tools/compare.mjs <live-path> <local-path> [widths...]
 *   node tools/compare.mjs /about.html /about
 *   node tools/compare.mjs /project-release-notes.html /work/release-notes 1440 900
 *
 * Compares the deployed Stage 1 site against the local dev server and reports
 * differing pixels per width. Writes diff-<width>.png next to the run for any
 * width that is not zero.
 *
 * Two things this got wrong once, both fixed here — do not undo them:
 *   · Waiting for `load` is not enough. Large images decode after it, so the
 *     live side renders short and the diff reports a false failure. It scrolls
 *     once to trigger lazy loads, then waits for every image to complete.
 *   · That wait must be bounded. Promise.all over incomplete images never
 *     settles when one is lazy-loaded below the fold, and page.evaluate has no
 *     timeout, so it hangs rather than fails.
 *
 * GOLDEN MODE
 *
 *   node tools/compare.mjs --golden-capture <live-path> [widths...]
 *   node tools/compare.mjs --golden <live-path> <local-path> [widths...]
 *
 * `--golden-capture` screenshots the reference to tools/golden/ and stops.
 * `--golden` diffs the local server against those files and never touches the
 * network on the reference side. Default behaviour, with neither flag, is
 * unchanged: both sides are fetched live.
 *
 * Goldens are insurance, not the primary reference. REFERENCE below is a
 * pinned immutable deployment and stays authoritative at every width; the
 * goldens exist only in case that deployment is ever pruned, and one width is
 * enough for that. Hence GOLDEN_WIDTHS — a parameter, overridable per run.
 *
 * Needs: npm i -D playwright pngjs pixelmatch  (and a chromium channel build)
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PNG } from "pngjs";
import pm from "pixelmatch";
const pixelmatch = pm.default || pm;

// Stage 1, FROZEN. This is a per-deployment Vercel URL, which never moves —
// that is the entire point of it. It is deliberately NOT the production alias
// (portfolio-suchi2.vercel.app): that alias swings to whatever is promoted, so
// the moment the React build goes live the harness would be diffing it against
// itself and reporting 0% forever.
//
// DO NOT "update" this to the current production URL. If it ever 404s, the
// deployment was pruned — fall back to --golden rather than repointing it.
//
// Verified on 2026-08-19: byte-identical to the production alias and to
// legacy/ on disk across all eight Stage 1 pages.
const REFERENCE = "https://portfolio-dk8r4mnca-suchi2.vercel.app";
const LOCAL = "http://localhost:5173";

const GOLDEN_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "golden");
// One width, deliberately. See the note above.
const GOLDEN_WIDTHS = [1300];
const WIDTHS_DEFAULT = [1440, 1300, 1150, 900];

const argv = process.argv.slice(2);
const capture = argv.includes("--golden-capture");
const useGolden = argv.includes("--golden");
const args = argv.filter((a) => !a.startsWith("--"));

const [livePath, ...rest] = args;
const localPath = capture ? null : rest.shift();
const widthArgs = rest.map(Number).filter((n) => !Number.isNaN(n));

if (!livePath || (!capture && !localPath)) {
  console.error("usage: node tools/compare.mjs <live-path> <local-path> [widths...]");
  console.error("       node tools/compare.mjs --golden-capture <live-path> [widths...]");
  console.error("       node tools/compare.mjs --golden <live-path> <local-path> [widths...]");
  process.exit(1);
}

// Both golden modes default to the width list the goldens exist at; only a
// live run sweeps all four. Passing widths explicitly overrides either.
const WIDTHS = widthArgs.length ? widthArgs : (capture || useGolden ? GOLDEN_WIDTHS : WIDTHS_DEFAULT);

// Golden filenames key off the reference path, so the same command line works
// in all three modes with only a flag added.
const slug = livePath.replace(/^\/+/, "").replace(/\.html$/, "").replace(/[^a-zA-Z0-9._-]+/g, "-") || "index";
const goldenFile = (w) => path.join(GOLDEN_DIR, `${slug}-${w}.png`);

const browser = await chromium.launch({ channel: "chromium" });
const errors = [];

async function shot(url, w, file, collect) {
  const p = await browser.newPage({ viewport: { width: w, height: 900 } });
  if (collect) {
    p.on("pageerror", (e) => errors.push(String(e)));
    p.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  }
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) window.scrollTo(0, y);
    window.scrollTo(0, 0);
  });
  await p.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 20000 }).catch(() => {});
  // Freeze anything ambient — a marquee or an animated connector caught
  // mid-flight differs between two screenshots regardless of correctness.
  await p.addStyleTag({ content: "*,*::before,*::after{animation:none !important;transition:none !important}" });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: file, fullPage: true });
  await p.close();
}

if (capture) {
  fs.mkdirSync(GOLDEN_DIR, { recursive: true });
  for (const w of WIDTHS) {
    const file = goldenFile(w);
    await shot(REFERENCE + livePath, w, file, false);
    console.log(String(w).padEnd(6), "captured", path.relative(process.cwd(), file), (fs.statSync(file).size / 1024 / 1024).toFixed(2) + "MB");
  }
  await browser.close();
  process.exit(0);
}

for (const w of WIDTHS) {
  let refFile;
  if (useGolden) {
    refFile = goldenFile(w);
    if (!fs.existsSync(refFile)) {
      console.log(String(w).padEnd(6), "NO GOLDEN at", path.relative(process.cwd(), refFile), "— run --golden-capture first");
      continue;
    }
  } else {
    refFile = `ref-${w}.png`;
    await shot(REFERENCE + livePath, w, refFile, false);
  }
  await shot(LOCAL + localPath, w, `new-${w}.png`, true);
  const a = PNG.sync.read(fs.readFileSync(refFile));
  const b = PNG.sync.read(fs.readFileSync(`new-${w}.png`));
  if (a.width !== b.width || a.height !== b.height) {
    console.log(String(w).padEnd(6), `SIZE ${a.width}x${a.height} vs ${b.width}x${b.height} — usually an image that had not decoded; re-run before believing it`);
    continue;
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const n = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 });
  if (n) fs.writeFileSync(`diff-${w}.png`, PNG.sync.write(diff));
  console.log(String(w).padEnd(6), "differing:", String(n).padStart(8), "=", (100 * n / (a.width * a.height)).toFixed(3) + "%", useGolden ? "(golden)" : "");
}
console.log(errors.length ? "CONSOLE ERRORS: " + [...new Set(errors)].slice(0, 5).join(" | ") : "no console errors");
await browser.close();
