# HANDOFF — Suchi Portfolio '26

This file describes the code as it exists today. It is written for someone who has never seen this project. Where something looks wrong but is deliberate, it says so — the point of this document is to stop a reader from "fixing" what is already correct.

The migration plan lives elsewhere. Nothing here is a proposal.

---

## 1. Architecture

### The nine pages

| File | What it is |
|---|---|
| `Homepage.html` | The index. A single fixed-composition canvas — portrait, name with a pronunciation control, credentials, scattered tooling column. Left rail navigation. |
| `about.html` | The personal page. Two branches (a "person" narrative driven by a fake timeline, and a shelf of objects). Same left rail. |
| `Work.html` | The work section. A stage manager: project pages float as cards in a windowed stack and expand to fullscreen. Its own chrome, no left rail. |
| `project-check-access.html` | Case study — UiPath Check Access. The short version. |
| `project-check-access-long-v2.html` | The same project, long form. Reached from inside the short version, not from anywhere else. |
| `project-ai-trust-layer.html` | Case study — AI Trust Layer. The largest component in the project. |
| `UiPath Admin Shell - Public Version.html` | Case study — Admin Shell, public summary. Ends in a passcode gate. |
| `project-admin-shell.html` | The full Admin Shell case study, behind that gate. |
| `project-release-notes.html` | Case study — Release Notes. |

### Three construction methods

The project is not built one way. Do not assume a pattern from the first file you open.

**Browser-transpiled React** covers six pages: `Work.html` and the five project pages other than long-v2. Each is a shell of thirty to forty lines — a `<style>` block, three unpkg script tags (React 18.3.1, ReactDOM 18.3.1, Babel standalone 7.29.0), a list of `<script type="text/babel">` sources, and a single `ReactDOM.createRoot(...).render(...)` call. There is no build step and no module system. Every component file is transpiled in the browser on load, and components find each other through `window`.

**Hand-written HTML** covers `Homepage.html` and `about.html`. Roughly 11–12k characters of inline CSS and 12–16k of inline vanilla JS each, plus one shared script (`contact-modal.js`). No React. These are the two pages that use the `fit()` scaling system described in Conventions.

**Standalone, no React, no shared anything** is `project-check-access-long-v2.html` alone. About 22k of inline CSS and 6.5k of inline JS, its own hand-written rail, its own TOC. It links to no local stylesheet or script. It is the single most self-contained file here, and also the heaviest.

### How the Work stage manager works

`Work.html` renders `site-work/stage.jsx`, which draws the project pages as **live iframes** — one per card, `src` taken from `WORK_CARDS` in `site-work/cards.jsx`. Four pages load into the stage, in this order: check-access (01, focused on load), ai-trust-layer (02), Admin Shell public (03), release-notes (04). The long-v2 and full Admin Shell pages are never loaded by the stage.

Three coupling mechanisms matter, and all three are same-origin DOM access across documents:

**The `is-fullscreen` class.** The parent writes it into the child. `stage.jsx` around line 299 reaches into `iframe.contentDocument` and calls `doc.body.classList.toggle("is-fullscreen", active)`. Every project page's inline `<style>` then keys off it: `body:not(.is-fullscreen) .left-nav { display: none !important }` and the inverse `body.is-fullscreen .project-overview { display: none }`. The child cannot set this for itself. The guard is placed on the *document*, not the iframe element, because following a link inside the iframe replaces the document and a per-element flag would go stale.

**The `postMessage` next-project contract.** A focused project page posts `{ type: "work:focus", key }` to its parent when a next-project link is clicked (`page-project.jsx` around line 780, with equivalents in the other project components). `stage.jsx` listens around line 361 and moves the stack instead of navigating the iframe. Both halves must survive any refactor together — break one and next-project links start navigating inside the card.

**Native fullscreen ordering.** `requestFullscreen()` is called on `document.documentElement` (`stage.jsx` ~392) and must fire *after* the card switch completes, not alongside it. Firing during the transition drops the request or leaves the stack mid-animation.

### Two navigation systems

These are different things and should not be merged.

**The main site rail** exists on `Homepage.html` and `about.html` only. It is hand-written markup, duplicated four times (desktop and mobile copies on each of the two pages). Four items: my context → Homepage, the work → Work, who am i? → about, contact → the overlay.

**`LeftRail`** (`site/shared.jsx:649`) is a *project section* nav. Despite the name, it contains no site links. It renders exactly three things: the "SuCHI" wordmark (which navigates `window.top` to Homepage, correctly escaping the iframe), the page's own `sections` array as in-page `#anchor` links with smooth scroll, and a `status` block pinned to the bottom. It is mounted by `PageShell` when `navMode="rail"`, on four pages: check-access, ai-trust-layer, Admin Shell public, and full Admin Shell.

If you are looking for the six-item site nav in `LeftRail`, it is not there and never was in this version. See Known State.

### The contact overlay

Contact is an overlay, not a page. `contact-modal.js` binds a document-level click handler on `[data-contact]`, and exposes `window.openContactModal`, `closeContactModal` and `isContactModalOpen`. It is loaded by three pages: **Homepage, about, and Work**. On Homepage and about, the rail's contact item carries both `data-contact` and a fallback `href="contact%20(old).html"` pointing at a page that is not in this export — the handler calls `preventDefault`, so the href is only reachable via middle-click or if the script fails. On Work, the contact button and the mobile contact row call `openContactModal()` directly with no href, which is the cleaner pattern.

---

## 2. File map

### `site/`
Shared React components and the four React project pages' bodies.

- `shared.jsx` — the spine. Site metadata, the `NAV` array, `PROJECTS` and `EXPERIMENTS` data, `THEMES`, `TYPE_SCALES`, responsive CSS injection, the runtime Archivo font link, `useTheme`, primitives (`MonoLabel`, `WaveMotif`, `Stamp`, `CirclesOnGrid`, `ScrollProgress`), `TopNav`, `LeftRail`, `SiteFooter`, `PageShell`, and the tweaks wiring.
- `page-project.jsx` — drives `project-check-access.html` (rendered as `<window.ProjectDetailPage projectId="uipath-check-access" />`). Generic enough to render other projects; only one is used.
- `diagrams-check-access.jsx`, `diagram-audit-pipeline.jsx` — diagrams for that page.
- `page-project-aitl.jsx` → `project-ai-trust-layer.html` (`AITLProjectPage`).
- `page-admin-shell-public.jsx` → `UiPath Admin Shell - Public Version.html` (`AdminShellPublicPage`).
- `page-project-admin-shell.jsx` → `project-admin-shell.html` (`AdminShellProjectPage`).
- `page-project-release-notes.jsx` → `project-release-notes.html` (`ReleaseNotesProjectPage`).
- `page-home.jsx`, `page-works.jsx`, `page-about-process.jsx`, `page-rest.jsx` — loaded by check-access, rendered by nothing. See Known State.
- `assets/aitl/` — 14 product screenshots for the AI Trust Layer page.
- `assets/release-notes/` — 4 frames for the Release Notes page. Note `popup-full.png` is the live one; a similarly named `popup.png` exists in the project and is not used.

### `site-work/`
Everything the Work page needs, and nothing else.
- `cards.jsx` — the `WORK_CARDS` data array (titles, tags, hrefs) and the card face. **The four iframe URLs live here.**
- `stage.jsx` — the stage manager: stack layout, card transitions, chrome bar, keyboard handling, iframe coupling, contact button, mobile list.
- `doodle-1-t.png` … `doodle-4-t.png` — card artwork. Near-identical copies exist under `card-stack/assets/`; the `site-work/` copies are the live ones.

### `frames/`
Seven static diagram exports used only by `project-admin-shell.html`: six SVGs and `before-home.png`. Other SVGs in this folder (`logo.svg`, the three `tenant-picker*` files) belong to discarded pages.

### `uploads/`
The original drop folder — around 130 files, of which **nine images and one markdown file** are actually referenced by a kept page. Everything else is working material. The nine live files are listed in the download list. Do not treat `uploads/` as an asset directory; treat it as an archive that happens to contain nine live assets.

### Root-level assets
Three poster PNGs sit at the project root rather than in a folder: `Disclose Progressively.png`, `Scope Seperation.png`, `Trace Origins.png`. Used by long-v2 only. Near-duplicates with different capitalisation exist in `uploads/` (`Scope seperation.png`, `Trace Origin.png`) — **the root copies are the live ones.**

### The `window.*` contract
There is no import system. `shared.jsx` ends with a single `Object.assign(window, { ... })` block — that is the export list, and it is the last statement in the file. It publishes `SITE`, `NAV`, `PROJECTS`, `EXPERIMENTS`, `THEMES`, `TYPE_SCALES`, `DEFAULT_TWEAKS`, the three font-family constants, `useTheme`, all five primitives, `TopNav`, `LeftRail`, `SiteFooter`, `PageShell` and `useTweaksWithPanel`. Page components read them as `window.PageShell`, `window.MonoLabel` and so on. Diagram files publish their own components the same way. Script order in the HTML shell is therefore load-bearing: `tweaks-panel.jsx`, then `shared.jsx`, then page bodies, then the render call.

---

## 3. Known state — things that look wrong and are

**`NAV`, `TopNav` and `SiteFooter` are dead code.** `shared.jsx:22–28` defines a six-item `NAV` array (Index, Works, Process, About, Experiments, Contact) whose targets include `works.html`, `process.html`, `experiments.html` and `contact (old).html` — none of which are in this export. `NAV` is read in exactly two places: `TopNav` (line 556) and `SiteFooter`'s sitemap column (line 750). `PageShell` renders `TopNav` only when `navMode === "top"` and `SiteFooter` only when `navMode !== "rail"`, and every kept page passes `navMode="rail"` or bypasses `PageShell` entirely. **`LeftRail` never reads `NAV`.** So those four broken targets ship in the bundle but no visitor can click them. This is cleanup, not broken navigation — an earlier audit got this wrong by reading the definition without following the render path.

**Four component files load and render nothing.** `project-check-access.html` loads `page-home.jsx`, `page-works.jsx`, `page-about-process.jsx` and `page-rest.jsx` — roughly 40k of JSX — but only mounts `ProjectDetailPage`. These four files are where the remaining references to `index.html`, `works.html`, `experiments.html` and `experiment-linguistic-geometry.html` live. They are included in the export because the page loads them today; removing them means also deleting those four script tags.

**Check Access has a temporary `class="is-fullscreen"` on `<body>`**, with the comment "TEMP: added for rail editing, remove before ship". It is still there. It is currently the *only* reason the section rail is visible when that page is opened standalone.

**Project pages have no navigation when opened by direct URL.** Because the parent owns `is-fullscreen`, a project page loaded at its own URL gets no rail, no hero topbar (except on full Admin Shell), no footer and no contact. Three of the four rail pages render with no navigation at all. Only the temporary class above masks this on Check Access. Whatever replaces the iframe stage must take ownership of that state, or each page needs a self-set default.

**`tweaks-panel.jsx` is a dev panel** — theme switcher, type scale, owner name — and it currently loads on all five React project pages. It is not production UI.

**The Admin Shell public page gates its full case study with a client-side passcode.** `page-admin-shell-public.jsx` around line 266 compares a string in JavaScript and redirects to `project-admin-shell.html`. On a static host the target is directly reachable by URL and the passcode is readable in the source. If that content is genuinely non-public, this needs a real solution.

**Two sets of missing files, both guarded by flags and therefore invisible today:**
- `assets/audio/suchi-pronunciation.mp3` — Homepage references it in an `<audio>` element. Neither the file nor the folder exists. `USE_AUDIO = false` (Homepage.html:902) and `preload="none"` keep it harmless; the control shows a tooltip instead.
- `Disclose Progressively.mov`, `Scope Seperation.mov`, `Trace Origins.mov` — long-v2's three walkthrough reels, held in `data-src` behind a flag that is false. The matching poster PNGs exist and render in their place.

**`Scope Seperation` is misspelled** ("Seperation" for "Separation") and the misspelling is *consistent* across the image filename, the `.mov` path and the code that references them. It is wrong everywhere, which means it currently works. Fix all three together or none.

---

## 4. Known state — things that look wrong and are intentional

**Release Notes has no `PageShell`, no section rail and no Project Overview block.** `ReleaseNotesProjectPage` calls `useTheme` and `useTweaksWithPanel` directly and builds its own layout with sticky columns. It is the only project page constructed this way. This is deliberate — do not "restore" the rail to make it match its siblings.

**Project Admin Shell shows its hero topbar in windowed view as well as fullscreen.** The other pages hide it outside fullscreen. That page's own stylesheet comment states the intent: the topbar stays visible in both states. Leave it.

**Long-v2 has its own hand-written rail** — an `<aside class="rail">` with its own TOC — rather than using `LeftRail`.

> **Superseded 2026-08-15.** This was recorded as intentional; Suchi has confirmed it was not. The rail was always meant to be the same one, differing only in content. A property-by-property comparison found the two already identical on width, padding, sticky behaviour, border, gaps, TOC type and the meta block — the duplication was hand-typing, not design. Stage 2 ports long-v2 onto the shared `LeftRail` with its own TOC and meta content. The wordmark resolves to **16px**, the shared component's value, so long-v2's 19px is the one visible change; the other four case studies are unaffected. `background: var(--bg)` and `z-index: 40` move onto the shared component, since long-v2 scrolls beneath its sticky rail and needs them.

**The six project pages have no contact affordance.** No button, no link, no `data-contact`; they do not load `contact-modal.js`. Contact lives on Homepage, about and Work.

**There is no AI Experiments page, and none should be created.** `NAV` mentions `experiments.html` and `page-rest.jsx` contains an experiments component; both are dead code, not a missing feature.

---

## 5. Conventions

**`DESIGN_SYSTEM.md` is the source of truth for every token** — typefaces (DM Sans, JetBrains Mono, Cormorant Garamond, plus Archivo for the wordmark only), colour tokens, the three palettes, the type scale, spacing and motion. It also carries a running list of known drifts between Figma, the live pages and the spec. Read it there; do not restate or re-derive values, and when a page and the document disagree, the document is the intent.

**The flag pattern for missing media.** Where an asset does not exist yet, the page ships the complete layout and one boolean: `USE_AUDIO` on Homepage, the equivalent video flag on long-v2. The fallback (tooltip, poster image) occupies the same box as the real thing. Adding the media means dropping the file in and flipping one constant — no rebuild, no layout change. Keep this pattern rather than commenting code out.

**The `fit()` scaling system**, used by **Homepage and about only**, and by nothing else in the project. Both pages are fixed compositions authored against a 1440 frame with **1300px as the anchor width**, and both use identical band boundaries so the rail and left column land at the same absolute position on either page at any width:

- **≥1440** — pure CSS. The stage is capped at 1440 and centred; `fit()` hands the anchors back to CSS and writes nothing.
- **1300–1440** — full-size type, no scaling. Individual column anchors lerp between their `@1440` and `@1300` values (`PANEL_L`/`TOOLING_L` on Homepage, `SHELF_L` on about) so columns spread into available width rather than converging.
- **900–1300** — uniform scale `s = clientWidth / 1300` applied to the whole stage as one unit, using the 1300 layout. Scatter is preserved and nothing overlaps.
- **<900** — early return; a separate mobile stack owns the layout.

A `?fw=` query parameter forces a width for testing. If you change a fixed position on either page, change its `@1440` and `@1300` values together — a single-value edit breaks one band.
