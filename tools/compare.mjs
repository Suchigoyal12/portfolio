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
 * Needs: npm i -D playwright pngjs pixelmatch  (and a chromium channel build)
 */
import { chromium } from "playwright";
import fs from "fs";
import { PNG } from "pngjs";
import pm from "pixelmatch";
const pixelmatch = pm.default || pm;

const LIVE = "https://portfolio-suchi2.vercel.app";
const LOCAL = "http://localhost:5173";

const [livePath, localPath, ...widthArgs] = process.argv.slice(2);
if (!livePath || !localPath) {
  console.error("usage: node tools/compare.mjs <live-path> <local-path> [widths...]");
  process.exit(1);
}
const WIDTHS = (widthArgs.length ? widthArgs.map(Number) : [1440, 1300, 1150, 900]);

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

for (const w of WIDTHS) {
  await shot(LIVE + livePath, w, `ref-${w}.png`, false);
  await shot(LOCAL + localPath, w, `new-${w}.png`, true);
  const a = PNG.sync.read(fs.readFileSync(`ref-${w}.png`));
  const b = PNG.sync.read(fs.readFileSync(`new-${w}.png`));
  if (a.width !== b.width || a.height !== b.height) {
    console.log(String(w).padEnd(6), `SIZE ${a.width}x${a.height} vs ${b.width}x${b.height} — usually an image that had not decoded; re-run before believing it`);
    continue;
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const n = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 });
  if (n) fs.writeFileSync(`diff-${w}.png`, PNG.sync.write(diff));
  console.log(String(w).padEnd(6), "differing:", String(n).padStart(8), "=", (100 * n / (a.width * a.height)).toFixed(3) + "%");
}
console.log(errors.length ? "CONSOLE ERRORS: " + [...new Set(errors)].slice(0, 5).join(" | ") : "no console errors");
await browser.close();
