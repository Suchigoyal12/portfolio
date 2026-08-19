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
 * Three things this got wrong, all fixed here — do not undo them:
 *   · Waiting for `load` is not enough. Large images decode after it, so the
 *     live side renders short and the diff reports a false failure. It scrolls
 *     once to trigger lazy loads, then waits for every image to complete.
 *   · That wait must be bounded. Promise.all over incomplete images never
 *     settles when one is lazy-loaded below the fold, and page.evaluate has no
 *     timeout, so it hangs rather than fails.
 *   · The scroll-through has to YIELD. It used to be a synchronous for-loop in
 *     one page.evaluate, which never painted at any intermediate position, so
 *     IntersectionObserver never fired and `loading="lazy"` images were never
 *     requested at all. Fourteen images on AI Trust Layer captured blank for
 *     four sessions and reported 0.831% — which was read as a porting defect.
 *     Measured: sync loop leaves 14/14 with an empty currentSrc and times out
 *     at 25s; stepping with a rAF yield settles all 14 in 1.8s.
 *
 * AND THE SETTLE FAILURE IS LOUD. It used to be `.catch(() => {})`, which is
 * exactly why the above hid for so long — the capture proceeded with blanks
 * and reported a number as if nothing had happened. A capture that does not
 * settle now says so on stderr and marks its own result line.
 *
 * EXTRA COMPARISON MODES
 *
 *   --framed        wrap BOTH sides in a neutral iframe and compare the framed
 *                   document. Needed because /work/<slug> renders the stage
 *                   now, so a page-to-page diff compares a case study against
 *                   a fixed 900px stage. Also strips `is-fullscreen` from both
 *                   documents, because that is what the real stage does to its
 *                   child on load (syncIframeFs(el, false)) — without it the
 *                   Stage 1 Check Access page keeps the temporary class it
 *                   ships in markup and shows a rail the React build correctly
 *                   does not.
 *   --click=<text>  click an element by text after load, then settle, then
 *                   capture. Applied identically to both sides. For /about,
 *                   whose `mode` starts null: every figure recorded before
 *                   this flag existed compared 61 characters of text.
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
const framed = argv.includes("--framed");
const clickArg = (argv.find((a) => a.startsWith("--click=")) || "").slice("--click=".length) || null;
const args = argv.filter((a) => !a.startsWith("--"));

const [livePath, ...rest] = args;
const localPath = capture ? null : rest.shift();
const widthArgs = rest.map(Number).filter((n) => !Number.isNaN(n));

if (!livePath || (!capture && !localPath)) {
  console.error("usage: node tools/compare.mjs <live-path> <local-path> [widths...]");
  console.error("       node tools/compare.mjs --golden-capture <live-path> [widths...]");
  console.error("       node tools/compare.mjs --golden <live-path> <local-path> [widths...]");
  console.error("  flags: --framed   compare the framed document (case studies)");
  console.error("         --click=TEXT  click by text, settle, then capture");
  process.exit(1);
}

// Both golden modes default to the width list the goldens exist at; only a
// live run sweeps all four. Passing widths explicitly overrides either.
const WIDTHS = widthArgs.length ? widthArgs : (capture || useGolden ? GOLDEN_WIDTHS : WIDTHS_DEFAULT);

// Golden filenames key off the reference path, so the same command line works
// in all three modes with only a flag added.
const slug = livePath.replace(/^\/+/, "").replace(/\.html$/, "").replace(/[^a-zA-Z0-9._-]+/g, "-") || "index";
const variant = (framed ? "-framed" : "") + (clickArg ? "-" + clickArg.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : "");
const goldenFile = (w) => path.join(GOLDEN_DIR, `${slug}${variant}-${w}.png`);

const browser = await chromium.launch({ channel: "chromium" });
const errors = [];

let unsettled = 0;

// Scroll-through, yielding a frame between steps so IntersectionObserver
// actually fires, then wait for every image to be genuinely decoded.
// `complete` alone is true for a failed image, hence naturalHeight.
// Works on both a Page and a Frame — the framed mode needs the latter.
async function settle(ctx, label) {
  await ctx.evaluate(() => document.fonts.ready);
  await ctx.evaluate(async () => {
    const sleep = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 60)));
    const step = Math.round(window.innerHeight * 0.8) || 600;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await sleep();
    }
    window.scrollTo(0, 0);
    await sleep();
  });
  // An <img> with no src or srcset is a placeholder, not a lazy image — the
  // lightbox on both Check Access pages keeps one in the DOM permanently and
  // only fills it on click. Waiting for it burns the full timeout every time
  // and then flags perfectly good numbers as untrustworthy. A genuinely broken
  // image still has a src and still fails loudly, which is the point.
  const ok = await ctx.waitForFunction(
    () => [...document.images]
      .filter((i) => i.getAttribute("src") || i.getAttribute("srcset"))
      .every((i) => i.complete && i.naturalHeight > 0),
    null, { timeout: 30000 }).then(() => true).catch(() => false);
  if (!ok) {
    const bad = await ctx.evaluate(() => [...document.images]
      .filter((i) => i.getAttribute("src") || i.getAttribute("srcset"))
      .filter((i) => !i.complete || i.naturalHeight === 0)
      .map((i) => i.getAttribute("src") || "(no src)"));
    unsettled += bad.length;
    console.error(`  !! ${label}: ${bad.length} image(s) never settled — ${bad.slice(0, 3).join(", ")}`);
  }
}

const FREEZE = "*,*::before,*::after{animation:none !important;transition:none !important}";

// The CSS freeze stops animations and transitions. It does nothing to <video>,
// and the scroll-through now correctly triggers the walkthrough reels'
// IntersectionObserver, so they autoplay — and two captures catch two
// different frames. Measured before this existed: 25,351 differing pixels on
// the long read at 1440, in three bands, one per reel, one side far enough in
// to show a burned-in caption the other had not reached. Rewinding to frame
// zero makes both sides show the same frame of the same file.
async function stillVideo(ctx) {
  await ctx.evaluate(() => {
    document.querySelectorAll("video").forEach((v) => {
      try { v.pause(); v.currentTime = 0; } catch (e) {/* not seekable yet */}
    });
  });
}

// Make the document under test believe it is inside the stage's iframe,
// without an iframe. Work.jsx decides stage-vs-case-study on
// `window.self !== window.top`, and `self` is the half that can be shadowed
// before app code runs. `top` is not configurable; overriding it silently
// fails and the stage renders anyway — which is how the first attempt at this
// went wrong.
//
// It is applied to BOTH sides, which keeps the capture symmetric: the Stage 1
// pages carry no framed-detection at all, so there it is a genuine no-op.
//
// This replaces an earlier approach that wrapped both sides in a real iframe
// and grew it to the content height. That is unsound on any page sized in vh:
// AI Trust Layer has ten such elements, including `height: calc(2341px +
// 100vh)`, so growing the frame grew the document — 900 to 17,564 to 85,424 —
// until the screenshot allocator refused at 1,442,964px tall. Do not reinstate
// it.
const PRETEND_FRAMED = () => {
  try { Object.defineProperty(window, "self", { get: () => ({}), configurable: true }); } catch (e) {}
};

async function shot(url, w, file, { collect = false, click = null, framed = false, label = "" } = {}) {
  const p = await browser.newPage({ viewport: { width: w, height: 900 } });
  if (framed) await p.addInitScript(PRETEND_FRAMED);
  if (collect) {
    p.on("pageerror", (e) => errors.push(String(e)));
    p.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  }

  {
    await p.goto(url, { waitUntil: "load" });
    // The real stage strips this from its child on load (syncIframeFs(el,
    // false)); the Stage 1 Check Access page ships it in markup. Without this
    // the reference shows a section rail the React build correctly does not.
    if (framed) await p.evaluate(() => document.body.classList.remove("is-fullscreen"));
    if (click) {
      await p.click(`text=${click}`);
      await p.waitForTimeout(1500);
    }
    await settle(p, label);
    // Freeze anything ambient — a marquee or an animated connector caught
    // mid-flight differs between two screenshots regardless of correctness.
    await p.addStyleTag({ content: FREEZE });
    await stillVideo(p);
    await p.waitForTimeout(1500);
    await p.screenshot({ path: file, fullPage: true });
    await p.close();
    return;
  }

}

if (capture) {
  fs.mkdirSync(GOLDEN_DIR, { recursive: true });
  for (const w of WIDTHS) {
    const file = goldenFile(w);
    await shot(REFERENCE + livePath, w, file, { click: clickArg, framed, label: `ref ${w}` });
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
    await shot(REFERENCE + livePath, w, refFile, { click: clickArg, framed, label: `ref ${w}` });
  }
  await shot(LOCAL + localPath, w, `new-${w}.png`, { collect: true, click: clickArg, framed, label: `local ${w}` });
  const a = PNG.sync.read(fs.readFileSync(refFile));
  const b = PNG.sync.read(fs.readFileSync(`new-${w}.png`));
  if (a.width !== b.width || a.height !== b.height) {
    console.log(String(w).padEnd(6), `SIZE ${a.width}x${a.height} vs ${b.width}x${b.height} — usually an image that had not decoded; re-run before believing it`);
    continue;
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const n = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 });
  if (n) fs.writeFileSync(`diff-${w}.png`, PNG.sync.write(diff));
  console.log(String(w).padEnd(6), "differing:", String(n).padStart(8), "=", (100 * n / (a.width * a.height)).toFixed(3) + "%", useGolden ? "(golden)" : "", unsettled ? "  << UNSETTLED IMAGES — DO NOT TRUST" : "");
}
if (unsettled) console.error(`!! ${unsettled} image(s) never settled across this run — the numbers above are not reliable`);
console.log(errors.length ? "CONSOLE ERRORS: " + [...new Set(errors)].slice(0, 5).join(" | ") : "no console errors");
await browser.close();
