// Reading copy: the text of each page, as plain HTML, for anything that reads
// the site without running JavaScript. Roadmap: "blank to anything that
// doesn't run JavaScript" (crawlers, AI fetch tools, hiring-system screeners).
//
//   node tools/reading-copy.mjs            build first; writes reading-copy-preview/
//
// HOW IT WORKS
//
// It opens the built site (dist/) in headless Chromium and reads each route
// as a visitor would see it, then flattens what is on screen into simple
// semantic HTML: headings, paragraphs, lists, links, images with their alt
// text. Nothing is hand-written, so the copy cannot drift from the pages.
//
// Every route is read at 800px wide, below the 899px boundary. That is the
// one width where every route renders its own content in a single linear
// column: case-study URLs render the case study rather than the stage and
// its iframe, and Home and About render their mobile stack, which is the
// authored reading order of the desktop composition.
//
// "On screen" is decided by the browser (display and visibility), which is
// what removes the duplicates: Home and About render a desktop canvas and a
// mobile stack at once and hide one of them, and the photo marquee renders
// its strip twice. Opacity is deliberately NOT a filter: content that fades
// in on scroll is real content.
//
// ABOUT is the one route that needs a hand. Its text is split across two
// branches behind the "the designer / the person" toggle, and the person
// branch only shows its paragraphs after Play. It is read with reduced
// motion on, which is the site's own static, fully revealed form of that
// branch (About.css), once per branch, and the two are joined.
//
// Only routes in src/routes.js are read, so the unpublished Admin Shell case
// study cannot reach the output.
//
// IN THE BUILD (tools/postbuild.mjs calls writeReadingCopy): each route gets
// its own copy of index.html with its reading copy inside the app's root
// element, and vercel.json points each route at its file. A visitor's
// browser never shows it: a style in <head> hides it before anything is
// drawn, and React replaces the root's contents when the app starts. A
// reader that does not run JavaScript gets the text; a browser with
// JavaScript off shows it, through <noscript>.
import { execSync } from "child_process";
import fs from "fs";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { PROJECT_ROUTES, CHECK_ACCESS_FULL } from "../src/routes.js";

// fileURLToPath, not URL.pathname: the repo path contains a space.
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

export const ROUTES = ["/", "/about", "/work", ...PROJECT_ROUTES.map((r) => r.path), CHECK_ACCESS_FULL];

const VIEWPORT = { width: 800, height: 1000 };

const TYPES = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg",
  ".ico": "image/x-icon", ".mp4": "video/mp4", ".m4a": "audio/mp4", ".pdf": "application/pdf",
};

// dist/ over HTTP, with the same fallback vercel.json gives the real routes.
// A missing FILE is a 404, not index.html: Vercel's analytics script only
// exists on Vercel, and handing it HTML would throw a page error here.
function serve(dist) {
  const server = http.createServer((req, res) => {
    let p = path.join(dist, decodeURIComponent(req.url.split("?")[0]));
    const missing = !p.startsWith(dist) || !fs.existsSync(p) || fs.statSync(p).isDirectory();
    if (missing && path.extname(p)) { res.writeHead(404); res.end(); return; }
    if (missing) p = path.join(dist, "index.html");
    res.writeHead(200, { "content-type": TYPES[path.extname(p)] || "application/octet-stream" });
    fs.createReadStream(p).pipe(res);
  });
  return new Promise((r) => server.listen(0, "127.0.0.1", () => r(server)));
}

// Interface text that means nothing without the interface: instructions for
// a gesture, a tooltip, a back arrow. Matched against a whole line (or a whole
// item in a joined line), ignoring case. Every entry has to keep matching
// something, or the run warns: a stale entry is a sign the page changed.
const HINTS = [
  "HOVER + SCROLL TO TRAVERSE",   // Check Access: the task pipeline diagram
  "Read in detail ↗",             // Check Access: the version cards' link label
  "SWIPE →",                      // AI Trust Layer: the four walkthrough carousels
  "← BACK",                       // the long read's back link
  "Visit UiPath",                 // Home: the logo's hover tooltip
];

// Runs in the page. Returns the reading copy of everything on screen.
function flatten({ hints }) {
  const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "SVG", "CANVAS", "VIDEO", "AUDIO", "IFRAME", "BUTTON", "INPUT", "SELECT", "TEXTAREA", "DIALOG"]);
  const WHOLE = new Set(["H1", "H2", "H3", "H4", "H5", "H6", "P"]);
  const KEEP_INLINE = { A: "a", STRONG: "strong", B: "strong", EM: "em", I: "em" };

  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const attr = (s) => esc(s).replace(/"/g, "&quot;");
  const plain = (s) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
  const shown = (el) => el.checkVisibility({ visibilityProperty: true });
  const hidden = (el) => el.getAttribute("aria-hidden") === "true" || !shown(el);
  const skipped = (el) => SKIP.has(el.tagName.toUpperCase()) || hidden(el);
  // Flex and grid children are blockified, so computed display is the only
  // honest test of whether a child starts a new line. inline-block flows on
  // the line too: the "~13" and "4" in "~13 services ... GA in 4 months".
  const isInline = (el) => /^inline(-block|-flex|-grid)?$/.test(getComputedStyle(el).display) && el.tagName !== "IMG";
  // Two things SKIP drops that still carry content: an SVG with text drawn in
  // it, and a button wrapping a screenshot. They count as blocks.
  const carries = (el) => !hidden(el) && (
    (el.tagName.toUpperCase() === "SVG" && !!el.querySelector("text")) ||
    (el.tagName === "BUTTON" && !!el.querySelector("img")));
  const isBlock = (c) => (!skipped(c) || carries(c)) && (!isInline(c) || carries(c));
  const hasBlockChild = (el) => [...el.children].some(isBlock);

  const hintSet = new Set(hints.map((h) => h.toLowerCase()));
  const hintsSeen = new Set();
  const isHint = (s) => {
    const k = plain(s).toLowerCase();
    if (hintSet.has(k)) { hintsSeen.add(k); return true; }
    return false;
  };
  const hasWords = (s) => /[\p{L}\p{N}]/u.test(plain(s)) && !isHint(s);
  const tidy = (s) => s.replace(/\s+/g, " ").replace(/\s*<br>\s*/g, "<br>").replace(/^· /, "").trim();
  const keepImage = (img) => !!(img.getAttribute("alt") || "").trim();

  // A screen number set after its caption or title ("... per index. 01.1",
  // "The structure is the experience. 01") reads first, as it does on a list.
  const NUMBER = /^\d{1,2}(\.\d+)?[a-z]?(\.\d+)?$/;
  const joinLine = (parts) => {
    const p = parts.filter(hasWords);
    // Not after a label ending in a colon: "ORG ID: 03" is a label and its value.
    if (p.length > 1 && NUMBER.test(plain(p[p.length - 1])) && !NUMBER.test(plain(p[0])) &&
      !plain(p[p.length - 2]).endsWith(":")) p.unshift(p.pop());
    return p.join(" · ");
  };

  // The text of a subtree, with links and emphasis kept and every other tag
  // dropped. A child that starts its own line gets a space either side, so
  // "01" in one span and "Understand." in the next do not run together.
  function inline(node) {
    if (node.nodeType === 3) return esc(node.textContent);
    if (node.nodeType !== 1 || skipped(node)) return "";
    if (node.tagName === "BR") return "<br>";
    const inner = [...node.childNodes].map(inline).join("");
    const pad = isInline(node) ? "" : " ";
    const tag = KEEP_INLINE[node.tagName];
    if (!tag || !inner.trim()) return pad + inner + pad;
    if (tag === "a") {
      const href = node.getAttribute("href");
      return href ? `<a href="${attr(href)}">${inner}</a>` : inner;
    }
    return `<${tag}>${inner}</${tag}>`;
  }
  const textOf = (el) => tidy([...el.childNodes].map(inline).join(""));

  // A block with nothing block-level inside it: one line of reading copy.
  const isLeaf = (el) => !hasBlockChild(el) && el.tagName !== "IMG";
  const visibleBlocks = (el) => [...el.children].filter(isBlock);

  // Every line of text in a subtree, in order: block children recurse, loose
  // inline text between them is a line of its own, an image counts by its alt.
  function lines(el) {
    if (skipped(el)) return [];
    if (el.tagName === "IMG") return keepImage(el) ? [esc(el.alt.trim())] : [];
    if (isLeaf(el)) { const t = textOf(el); return hasWords(t) ? [t] : []; }
    const found = [];
    let run = "";
    const flush = () => { const t = tidy(run); if (hasWords(t)) found.push(t); run = ""; };
    for (const c of el.childNodes) {
      if (c.nodeType === 1 && !skipped(c) && !isInline(c)) { flush(); found.push(...lines(c)); }
      else if (c.nodeType === 1 && carries(c)) flush();
      else run += inline(c);
    }
    flush();
    return found;
  }

  const out = [];
  // A hint can also be one part of a joined line ("4 SCREENS · SWIPE →").
  const dropHintParts = (text) => text.split(" · ").filter((part) => !isHint(part)).join(" · ");
  const push = (tag, text) => { text = dropHintParts(text); if (hasWords(text)) out.push(`<${tag}>${text}</${tag}>`); };
  const pushImage = (img) => {
    if (keepImage(img)) out.push(`<img src="${attr(img.getAttribute("src") || "")}" alt="${attr(img.alt.trim())}">`);
  };

  // Text drawn inside an SVG (AI Trust Layer's system map carries the four
  // questions the page is built around). One line per row of the drawing,
  // read top to bottom, left to right.
  function svg(el) {
    // A drawing that describes itself (<desc>) is read by its description:
    // a two-column before/after diagram read row by row interleaves the two
    // columns. One without a description is read by its drawn text.
    const desc = el.querySelector("desc");
    if (desc) {
      const title = el.querySelector("title");
      if (title) push("p", tidy(esc(title.textContent)));
      push("p", tidy(esc(desc.textContent)));
      return;
    }
    const rows = [];
    for (const t of el.querySelectorAll("text")) {
      const text = tidy(esc(t.textContent));
      if (!text) continue;
      const box = t.getBBox();
      const row = rows.find((r) => Math.abs(r.y - box.y) < box.height / 2);
      if (row) row.parts.push({ x: box.x, text });
      else rows.push({ y: box.y, parts: [{ x: box.x, text }] });
    }
    rows.sort((a, b) => a.y - b.y);
    for (const r of rows) push("p", joinLine(r.parts.sort((a, b) => a.x - b.x).map((p) => p.text)));
  }

  function block(el) {
    const tag = el.tagName.toUpperCase();
    if (tag === "SVG") { if (!hidden(el)) svg(el); return; }
    // A screenshot wrapped in a button (tap to open full size) is still a
    // screenshot. The button's own label is interface; its image is content.
    if (tag === "BUTTON") { if (!hidden(el)) el.querySelectorAll("img").forEach((i) => { if (shown(i)) pushImage(i); }); return; }
    if (skipped(el)) return;
    if (tag === "IMG") { pushImage(el); return; }
    if (tag === "UL" || tag === "OL") {
      const items = [...el.children].filter((c) => !skipped(c)).map(textOf).filter(hasWords);
      if (items.length) out.push(`<${tag.toLowerCase()}>${items.map((i) => `<li>${i}</li>`).join("")}</${tag.toLowerCase()}>`);
      return;
    }
    // Headings and paragraphs stay whole, whatever their insides do: a title
    // set as three stacked words is still one title.
    // Line breaks inside a heading are typesetting, not structure.
    if (WHOLE.has(tag)) { push(tag.toLowerCase(), tag === "P" ? textOf(el) : textOf(el).replace(/<br>/g, " ")); return; }
    // Captions, quotes and list items keep their tag, with the lines inside
    // them kept apart ("The original structure · UiPath Docs, 2023: ...").
    if (["BLOCKQUOTE", "FIGCAPTION", "LI", "DT", "DD"].includes(tag) && hasBlockChild(el)) {
      push(tag.toLowerCase(), joinLine(lines(el))); return;
    }
    if (["BLOCKQUOTE", "FIGCAPTION", "LI", "DT", "DD"].includes(tag)) { push(tag.toLowerCase(), textOf(el)); return; }

    const kids = visibleBlocks(el);
    // The element as a row of items: each block child, and each run of loose
    // inline text between them (a label set as an inline span is a run).
    const items = [];
    let pending = "";
    for (const c of el.childNodes) {
      if (c.nodeType === 1 && isBlock(c)) {
        if (hasWords(pending)) items.push(tidy(pending));
        pending = "";
        items.push(c);
      } else pending += inline(c);
    }
    if (hasWords(pending)) items.push(tidy(pending));
    const itemText = (i) => {
      if (typeof i === "string") return i;
      if (i.tagName === "IMG") return keepImage(i) ? esc(i.alt.trim()) : "";
      const href = i.tagName === "A" && i.getAttribute("href");
      return href ? `<a href="${attr(href)}">${plain(joinLine(lines(i)))}</a>` : textOf(i);
    };
    const words = items.filter((i) => hasWords(itemText(i)));
    const isHeading = (k) => typeof k !== "string" && /^H[1-6]$/.test(k.tagName);
    // A row of short labels (CLIENT / UiPath, a row of pills, 01 / a title)
    // reads as one line rather than a stack of one-word paragraphs.
    const flat = kids.every((k) => !carries(k) && !isHeading(k) && (isLeaf(k) || k.tagName === "IMG")) &&
      !kids.some((k) => k.tagName === "IMG" && keepImage(k));
    const short = flat && words.length >= 2 && words.every((i) => plain(itemText(i)).length <= 60);
    // A short label and the sentence it introduces ("Why", "Trade-off",
    // "User Insight") read as one line: "Why · Access is computed ...".
    // Not a "/ label": those are the site's section names and become headings.
    const labelled = flat && words.length === 2 && plain(itemText(words[0])).length <= 20 &&
      !plain(itemText(words[0])).startsWith("/");
    const line = () => joinLine(items.map(itemText));

    if (tag === "A" && el.getAttribute("href")) {
      // A link stays a link even when it wraps a whole card. Its text is every
      // line inside it, in order; a link that is only a logo uses the alt text.
      const text = joinLine(lines(el));
      if (hasWords(text)) out.push(`<p><a href="${attr(el.getAttribute("href"))}">${plain(text)}</a></p>`);
      return;
    }
    if (!kids.length) { push("p", textOf(el)); return; }

    // A heading with a short marker beside it (the long read's lessons:
    // "The structure is the experience." with "01" at the right) stays a
    // heading, marker first: "<h4>01 · The structure is the experience.</h4>".
    const headed = kids.filter(isHeading);
    if (headed.length === 1 && kids.length >= 2 && kids.every(isLeaf) &&
      words.every((i) => isHeading(i) || plain(itemText(i)).length <= 12)) {
      push(headed[0].tagName.toLowerCase(), joinLine(items.map(itemText)));
      return;
    }

    // A two-column grid of labels and their sentences (the long read's Why /
    // Alt / Rejected / Trade-off) reads pair by pair: "Why · Access is ...".
    const columns = getComputedStyle(el).display === "grid" ? getComputedStyle(el).gridTemplateColumns.split(" ").length : 0;
    // A last line without a partner (decision 02's "Some wouldn't call it a
    // tradeoff!") follows the pairs on its own.
    const pairs = kids.length - (kids.length % 2);
    if (columns === 2 && flat && pairs >= 4 && items.length === kids.length &&
      kids.slice(0, pairs).every((k, i) => i % 2 || plain(textOf(k)).length <= 20)) {
      for (let i = 0; i < pairs; i += 2) push("p", joinLine([textOf(kids[i]), textOf(kids[i + 1])]));
      if (pairs < kids.length) push("p", textOf(kids[pairs]));
      return;
    }
    if (short || labelled) { push("p", line()); return; }

    // A two-row table, headers over answers ("The Engineering Constraint /
    // The Design Decision"), reads column by column: each header with its own
    // answer, not both headers and then both answers.
    if (kids.length === 2 && items.length === 2) {
      const [head, body] = kids.map(visibleBlocks);
      // Headers are short labels, answers are sentences; two stat cards
      // ("5 / Customers ...", "7 / UiPath products ...") are not a table.
      if (head.length >= 2 && head.length === body.length && [...head, ...body].every(isLeaf) &&
        head.every((h) => plain(textOf(h)).length <= 40 && !/^\d/.test(plain(textOf(h)))) &&
        body.every((b) => plain(textOf(b)).length > 40)) {
        head.forEach((h, i) => push("p", joinLine([textOf(h), textOf(body[i])])));
        return;
      }
    }

    // Mixed content: loose text runs become paragraphs, block children recurse.
    let run = "";
    const flush = () => { push("p", tidy(run)); run = ""; };
    for (const c of el.childNodes) {
      if (c.nodeType === 1 && isBlock(c)) { flush(); block(c); }
      else run += inline(c);
    }
    flush();
  }
  block(document.getElementById("root"));

  // A bare number or letter on its own line ("02", "A") is the marker of the
  // line after it, which is often a heading: "02 · Indirect and inherited
  // access", "<h3>01 · Progressive Access Disclosure</h3>".
  const merged = [];
  for (let i = 0; i < out.length; i++) {
    const m = out[i].match(/^<p>(\d{1,2}|[A-Z])<\/p>$/);
    const next = out[i + 1] && out[i + 1].match(/^<(p|h[1-6])>(.*)<\/\1>$/);
    if (m && next) { merged.push(`<${next[1]}>${m[1]} · ${next[2]}</${next[1]}>`); i++; }
    else merged.push(out[i]);
  }
  // A caption that only repeats the screenshot's own description (AI Trust
  // Layer's carousels use the caption as the alt) is said once: the image and
  // its description stay, the repeat and its screen number ("01.1") go.
  const final = [];
  for (const b of merged) {
    const cap = b.match(/^<figcaption>(?:[\w.]+ · )?(.*)<\/figcaption>$/);
    const img = (final[final.length - 1] || "").match(/^<img src="[^"]*" alt="(.*)">$/);
    if (!(cap && img && plain(img[1]) === plain(cap[1]))) final.push(b);
  }
  return { blocks: final, hintsSeen: [...hintsSeen] };
}

// Scroll top to bottom, yielding a frame per step, so anything that renders
// on IntersectionObserver gets the chance (see tools/compare.mjs on why the
// yield matters).
async function scrollThrough(page) {
  await page.evaluate(async () => {
    const frame = () => new Promise((r) => requestAnimationFrame(() => r()));
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await frame(); await frame();
    }
    window.scrollTo(0, 0);
  });
}

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await scrollThrough(page);
  await page.waitForTimeout(300);
}

// HEADINGS. Each page reads as a heading, its sections, and their
// subheadings, with content under the heading it belongs to (Suchi's rule:
// "/ quick background" is a heading inside the Home page, and its paragraph
// sits under it). The pages set most of this as styled labels rather than
// heading tags, so it is rebuilt from the shape of the text:
//
//   h1  the page: its own <h1>, or for Home the tagline, About "who am i?"
//       (its rail label) and Work "Work · 4 projects"
//   h2  a section: "SECTION 01 · WHY?", or the label set directly above a
//       section title ("Problem Insight" above "Users don't think ...")
//   h3  that section's title, which the page sets as <h2>; the page's own
//       h3 and h4 move down one level with it
//   +1  a label inside a section ("THE PROBLEM", "/ tooling") becomes a
//       heading one level below the heading it sits under
function structure(route, blocks, pageTitle) {
  const tag = (b) => ((b || "").match(/^<(\w+)/) || [])[1];
  const inner = (b) => b.replace(/^<(\w+)>([\s\S]*)<\/\1>$/, "$2");
  const text = (b) => inner(b).replace(/<br>/g, " ").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
  const SECTION = /^<p>(section \d+)<br>(.*)<\/p>$/i;
  const linkOnly = (b) => /^<p><a [^>]*>[^<]*<\/a><\/p>$/.test(b);

  // A label: short, not a sentence, set as a "/ name", in capitals, in
  // Title Case, or as a numbered capital label ("01 · THE MVP TRAP").
  const isLabel = (b) => {
    if (tag(b) !== "p" || linkOnly(b) || SECTION.test(b)) return false;
    const t = text(b);
    if (!t || t.length > 40 || /[.,;:]$/.test(t)) return false;
    if (t.startsWith("/")) return true;
    if (/^\d{1,2} · [^a-z]+$/.test(t)) return true;
    if (t.includes(" · ")) return false;
    const caps = t === t.toUpperCase() && /[A-Z]/.test(t);
    const title = t.split(" ").length <= 4 && t.split(" ").every((w) => /^[A-Z&]/.test(w));
    return caps || title;
  };
  // ...and it heads something: the content after it, not another label
  // (alone, or joined to its own sentence, like "THE PIVOT · From ...").
  const heads = (b, next) => {
    if (text(b).startsWith("/")) return true;
    if (!next || !["p", "ul", "img", "blockquote", "figcaption"].includes(tag(next)) || linkOnly(next) || split(next)) return false;
    return tag(next) !== "p" || text(next).length > 40 || /[.?!]$/.test(text(next));
  };

  let out = [...blocks];
  if (route === "/") {
    // The tagline, which the phone layout sets last, leads: it is what the
    // page says Suchi is. Read as one line (Suchi's wording, 2026-10-15).
    const i = out.findIndex((b) => /beyond product design/i.test(text(b)));
    const parts = i >= 0 ? text(out[i]).split(" · ") : [];
    if (parts.length !== 3) throw new Error("Home: tagline not found as three parts");
    out.splice(i, 1);
    out.unshift(`<h1>${parts[0]} ${parts[1]}, ${parts[2]}</h1>`);
  }
  if (route === "/about") out.unshift(`<h1>${pageTitle}</h1>`);
  if (route === "/work") out[0] = `<h1>${inner(out[0])}</h1>`;

  const eyebrow = (i) => tag(out[i + 1]) === "h2" && isLabel(out[i]) &&
    !SECTION.test(out[i - 1] || "") && !SECTION.test(out[i - 2] || "");

  // A label joined to what it introduces ("/ design · Figma · ...",
  // "HI THERE! I'M SUCHI · I believe ...") comes apart: the label becomes a
  // heading one level below the last heading, the rest sits under it. Only
  // "/ labels", or a label in capitals followed by a full sentence, so
  // "CLIENT · UiPath" and "Why · Access is ..." stay as they are.
  const split = (b) => {
    if (tag(b) !== "p" || linkOnly(b)) return null;
    const parts = inner(b).split(" · ");
    if (parts.length < 2 || /<a /.test(parts[0])) return null;
    const first = text(`<p>${parts[0]}</p>`);
    const rest = parts.slice(1).join(" · ");
    const restText = text(`<p>${rest}</p>`);
    if (first.length > 40) return null;
    const caps = first === first.toUpperCase() && /[A-Z]/.test(first);
    if (first.startsWith("/") || (caps && restText.length > 40 && /[.?!)]$/.test(restText))) return [parts[0], rest];
    return null;
  };

  // Levels come from the page's own outline, not a fixed shift: the long
  // read sets titles as h2 and its cards as h4 with nothing between, and
  // that must not leave a gap. Each section starts a fresh outline under
  // its h2; inside it, a heading sits one below the nearest heading above it
  // with a smaller original number.
  const result = [];
  let base = 1;       // 2 inside a section, 1 before any
  let stack = [];     // open headings in the section: { orig, out }
  let slash = 0;      // the last "/ label" heading, while it is still open
  const title = () => (stack.length ? stack[0].out : base);
  for (let i = 0; i < out.length; i++) {
    const b = out[i];
    const m = b.match(SECTION);
    const t = tag(b);
    if (m || eyebrow(i)) {
      result.push(`<h2>${m ? `${m[1]} · ${m[2]}` : inner(b)}</h2>`);
      base = 2; stack = []; slash = 0;
      continue;
    }
    if (t === "h1") { result.push(b); stack = []; slash = 0; continue; }
    if (/^h[2-6]$/.test(t)) {
      const orig = Number(t[1]);
      while (stack.length && stack[stack.length - 1].orig >= orig) stack.pop();
      const level = Math.min(6, (stack.length ? stack[stack.length - 1].out : base) + 1);
      stack.push({ orig, out: level });
      // A label set directly above a small heading is that heading's
      // eyebrow: "<h4>Entry Point · Introduced Check Access ...</h4>".
      const prev = result[result.length - 1];
      const label = level >= 4 && prev === out[i - 1] && isLabel(prev) ? `${inner(result.pop())} · ` : "";
      result.push(`<h${level}>${label}${inner(b)}</h${level}>`);
      slash = 0;
      continue;
    }
    // Labels belong to the section's title, not to whichever card came last.
    if (isLabel(b) && heads(b, out[i + 1])) {
      const level = Math.min(6, title() + 1);
      result.push(`<h${level}>${inner(b)}</h${level}>`);
      slash = text(b).startsWith("/") ? level : 0;
      continue;
    }
    const pair = split(b);
    if (pair) {
      // "/ design" under "/ tooling" nests; anything else sits beside the
      // labels of its section.
      const level = Math.min(6, (slash && text(`<p>${pair[0]}</p>`).startsWith("/") ? slash : title()) + 1);
      result.push(`<h${level}>${pair[0]}</h${level}>`, `<p>${pair[1]}</p>`);
      continue;
    }
    result.push(b);
  }
  return result;
}

// A link in the reading copy is an invitation to a crawler, so one that leads
// nowhere keeps its text and loses the link: the Contact rail item's
// fallback href, "contact (old).html", is the case this exists for. Outside
// links are kept as they are; only the site's own are checked.
function dropDeadLinks(html, route, dist) {
  return html.replace(/<a href="([^"]*)">(.*?)<\/a>/g, (whole, href, text) => {
    const raw = href.replace(/&amp;/g, "&");
    if (/^(https?:|mailto:|tel:)/.test(raw)) return whole;
    const url = new URL(raw, `http://site${route}`);
    if (url.pathname === route && url.hash) return text; // in-page anchors: no use without the page
    const file = path.join(dist, decodeURIComponent(url.pathname));
    const live = ROUTES.includes(url.pathname) || (file.startsWith(dist) && fs.existsSync(file) && fs.statSync(file).isFile());
    return live ? `<a href="${url.pathname}${url.search}">${text}</a>` : text;
  });
}

// HOME: the tooling block's group names ("/ design", "/ build",
// "/ ai experiments") only appear on hover, stacked in one heading slot, so
// read as they sit they come out as four labels followed by thirteen pills
// with no way to tell which belongs where. In this throwaway browser only,
// each column of pills gets its own group name in front of it. Fails loudly
// if the markup it relies on has moved.
function groupHomeTooling() {
  const blocks = document.querySelectorAll(".tooling");
  if (!blocks.length) throw new Error("Home: no .tooling block");
  for (const tooling of blocks) {
    const grid = tooling.querySelector(".pill-grid");
    const pills = grid ? [...grid.querySelectorAll(".pill[data-tool-group]")] : [];
    if (!pills.length) throw new Error("Home: no grouped pills in .tooling");
    const rows = new Map();
    for (const pill of pills) {
      const group = pill.dataset.toolGroup;
      if (!rows.has(group)) {
        const name = tooling.querySelector(`.th-${group}`);
        if (!name) throw new Error(`Home: no .th-${group} label for the "${group}" pills`);
        rows.set(group, [name.textContent.trim()]);
      }
      rows.get(group).push(pill.textContent.trim());
    }
    tooling.querySelectorAll(".th-sizer, .th-group").forEach((e) => e.remove());
    grid.replaceChildren(...[...rows.values()].map((texts) => {
      const row = document.createElement("div");
      for (const text of texts) {
        const item = document.createElement("div");
        item.textContent = text;
        row.append(item);
      }
      return row;
    }));
  }
}

async function readRoute(context, base, route, dist, hintsSeen) {
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const read = async () => {
    const { blocks, hintsSeen: seen } = await page.evaluate(flatten, { hints: HINTS });
    seen.forEach((h) => hintsSeen.add(h));
    return blocks;
  };
  try {
    await page.goto(base + route, { waitUntil: "load", timeout: 30000 });
    await settle(page);
    if (route === "/") await page.evaluate(groupHomeTooling);
    let blocks = await read();
    if (route === "/about") {
      // The designer branch is what 800px shows first. Pick the person branch
      // with the toggle a visitor would use, read again, and label each half
      // with its toggle's own words. Blocks both reads share (the rail) lead.
      const toggle = (which) => page.locator(`.mobile-stack .mode-toggle.is-${which} .label`);
      const designerLabel = (await toggle("designer").textContent()).trim();
      const personLabel = (await toggle("person").textContent()).trim();
      await page.locator(".mobile-stack .mode-toggle.is-person").click();
      await settle(page);
      const person = await read();
      const both = blocks.filter((b) => person.includes(b));
      blocks = [
        ...both,
        `<h2>${designerLabel}</h2>`, ...blocks.filter((b) => !both.includes(b)),
        `<h2>${personLabel}</h2>`, ...person.filter((b) => !both.includes(b)),
      ];
    }
    if (errors.length) throw new Error(`page errors on ${route}: ${errors.join(" | ")}`);
    const title = route === "/about" ? (await page.locator(".mobile-stack a.active").first().textContent()).trim() : null;
    return dropDeadLinks(structure(route, blocks, title).join("\n"), route, dist);
  } finally {
    await page.close();
  }
}

export async function extractReadingCopy(dist = path.join(ROOT, "dist")) {
  const { chromium } = await import("playwright");
  const server = await serve(dist);
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ viewport: VIEWPORT, reducedMotion: "reduce" });
    const result = {};
    const hintsSeen = new Set();
    for (const route of ROUTES) result[route] = await readRoute(context, base, route, dist, hintsSeen);
    const stale = HINTS.filter((h) => !hintsSeen.has(h.toLowerCase()));
    if (stale.length) console.warn(`reading-copy: these HINTS matched nothing, so the page has changed: ${stale.join(", ")}`);
    return result;
  } finally {
    await browser.close();
    server.close();
  }
}

// Chromium for the build. The browser goes inside node_modules ("0"), where
// Vercel's build cache keeps it between deploys. Vercel's build image lacks
// two libraries Chromium needs (NSS and NSPR): measured on a preview build
// 2026-10-15, launch fails without them and works with them.
function ensureBrowser() {
  process.env.PLAYWRIGHT_BROWSERS_PATH = "0";
  const run = (cmd) => execSync(cmd, { cwd: ROOT, stdio: ["ignore", "ignore", "inherit"] });
  if (process.env.VERCEL) run("dnf install -y nss nspr");
  run("node_modules/.bin/playwright install chromium --only-shell");
}

// Where each route's file lives in dist/, and what vercel.json must point
// the route at. "/" is index.html itself.
export const routeFile = (route) => (route === "/" ? "index.html" : `${route.slice(1)}.html`);

// Hidden before the first paint for every browser; shown again only where
// scripts are off. Readers that ignore CSS (crawlers, AI fetch tools) see
// the text either way.
const HEAD = `<style>#reading-copy{display:none}</style>` +
  `<noscript><style>#reading-copy{display:block;max-width:720px;margin:40px auto;padding:0 16px}` +
  `#reading-copy img{max-width:100%;height:auto}</style></noscript>`;
const ROOT_EL = '<div id="root"></div>';

function inject(template, copy) {
  if (!template.includes(ROOT_EL) || !template.includes("</head>")) {
    throw new Error(`reading-copy: index.html no longer has ${ROOT_EL} and </head>`);
  }
  // Images go inside <noscript>. Hidden is not enough: a hidden image is not
  // fetched while it sits in the page, but the moment React clears the root
  // the browser fetches every image it removed (measured: AI Trust Layer
  // went from 4 image downloads to 17). With scripts on, <noscript> content
  // is never parsed as markup, so nothing is fetched; crawlers and
  // scripts-off browsers read it as an ordinary image.
  const images = copy.replace(/<img [^>]*>/g, (img) => `<noscript>${img}</noscript>`);
  return template
    .replace("</head>", `${HEAD}\n</head>`)
    .replace(ROOT_EL, `<div id="root"><div id="reading-copy">\n${images}\n</div></div>`);
}

// The build step. Reads every route from the finished dist/, then writes
// each route's file. The reading happens first, from the untouched
// index.html, so no file is read after it has been changed.
export async function writeReadingCopy(dist) {
  ensureBrowser();
  const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
  const copy = await extractReadingCopy(dist);
  for (const route of ROUTES) {
    const file = path.join(dist, routeFile(route));
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, inject(template, copy[route]));
  }
  return copy;
}

// CLI: write a preview, one file per route, for reading before it ships.
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  ensureBrowser();
  const outDir = path.join(ROOT, "reading-copy-preview");
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir);
  const copy = await extractReadingCopy();
  const index = [];
  for (const [route, html] of Object.entries(copy)) {
    const name = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    fs.writeFileSync(path.join(outDir, `${name}.html`),
      `<!doctype html><meta charset="utf-8"><title>${route}</title>\n<body style="font:16px/1.5 system-ui;max-width:720px;margin:40px auto;padding:0 16px">\n${html}\n`);
    index.push(`${route.padEnd(26)} ${String(text.length).padStart(6)} chars  ${name}.html`);
  }
  fs.writeFileSync(path.join(outDir, "summary.txt"), index.join("\n") + "\n");
  console.log(index.join("\n"));
}
