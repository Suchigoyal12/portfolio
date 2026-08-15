# Portfolio v4 — Migration Brief

**For:** Claude Code
**From:** Suchi — product designer, not a developer. Explain decisions in plain language. Don't assume familiarity with tooling, build systems, or git.
**Status:** Two read-only audits have been completed in Claude Design. Their findings are incorporated below. Where this brief and the audits disagree, this brief wins.

---

## The rule that governs everything below

**Nothing about this project changes what a visitor sees or how the site behaves. The work is entirely internal.**

Layout, spacing, type, colour, imagery, copy, scroll behaviour, hover states, transitions, the stage manager's card mechanics, fullscreen, the About page's branch toggle — all of it must look and behave after the work exactly as it does before. Every route stays independently addressable: Homepage, Work, About and each case study keep their own URL and remain shareable on their own. Removing page *reloads* is the goal; removing page *addresses* is not.

What does change is how the code is organised: separate HTML files with duplicated nav markup and browser-transpiled React become one React application with a proper build step, real imports, and a navigation shell that persists across route changes.

**The four permitted exceptions, all in Stage 1.** This is a closed list:

1. The developer tweaks panel is removed (section 1.3)
2. The passcode field on the public Admin Shell page becomes static text (section 1.2)
3. The three video reels begin playing instead of showing still posters (section 1.5)
4. Filenames are normalized, changing URLs but nothing on screen (section 1.4)

**Anything else that looks different is a regression, not an improvement.** If achieving parity appears to require changing the design, stop and ask. If something in the existing code looks wrong, write it down rather than fixing it — section 1.6 lists the known cases, and there will be more.

This matters because of what comes next. Once the React version is deployed and verified identical, there is a substantial list of genuine improvements waiting. Making any of them early destroys the ability to tell whether a visual difference came from the migration or from the improvement — and that ambiguity costs more time than every item on the list is worth.

---

## The sequence

**Stage 1 — deploy the current static site.** It works today. Getting it live means a real URL to share during an active job search, and a verified reference to compare every later change against.

**Stage 2 — convert to React properly.** Done against a deployed baseline, with the ability to roll back.

Do not merge these. Do not begin Stage 2 until Stage 1 is live and confirmed.

---

## What the site actually is

Nine pages, three construction methods, two navigation systems. This is not a uniform codebase and should not be treated as one.

### Construction

**Already React** — Work and five project pages. These load React, ReactDOM and Babel from a CDN and transpile in the browser at runtime, with components communicating through `window.*` globals. Functional today; not how a deployed site should work. Converting them is mechanical but tedious: replace browser transpilation with a build step, turn globals into real imports.

**Hand-written HTML** — Homepage, About, and the Check Access long version. Roughly 70,000 characters of inline CSS and vanilla JS between them. These are genuine rewrites in Stage 2. Long-v2 is the heaviest single file in the project.

### Navigation — two separate systems

**The main site rail** — Homepage and About only. Hand-authored inline HTML, duplicated four times (desktop and mobile × two pages). Items: my context, the work, who am i?, contact.

**The project section rail** (`LeftRail` in `site/shared.jsx`) — an in-page table of contents for a single project. Wordmark, that project's section anchors, status pairs. **It contains no site-level links.** Visible only when `<body>` carries `is-fullscreen`.

These are different things and must not be merged.

> **Note on the first audit:** it claimed `LeftRail` renders six site links, four of them dead. That was wrong. The second audit confirmed `LeftRail` never reads the `NAV` array. `NAV` is consumed only by `TopNav` and `SiteFooter`, neither of which is mounted by any kept page. Those four links are unmounted dead code that ships in the bundle. Cleanup in Stage 2, not a Stage 1 problem.

### The Work stage manager

`Work.html` renders a Stage Manager pattern: a focused window with a tilted card stack, terminal-style chrome bar, breadcrumb formatted `NN/04 · WORK › PROJECT NAME`.

**The focused window is an `<iframe>` loading the real project page.** The stage reaches into the iframed document and toggles `is-fullscreen` on the child `<body>` — same-origin cross-document DOM access. A `postMessage` contract handles next-project navigation: the child posts `{type:"work:focus", key}`, the stage listens.

Fullscreen uses browser-native `requestFullscreen()`. **It must be called after the card switch completes**, so it targets the newly active element. This was a bug once. Preserve the fix.

Stack order: Check Access (01) → AI Trust Layer (02) → Admin Shell public (03) → Release Notes (04).

### Contact

An overlay (`contact-modal.js`), opening on top of the current view. Not a page. Loaded by Homepage, About and Work only.

**The six project pages have no Contact affordance. This is intentional — do not add one.**

### Deliberate inconsistencies — leave alone

- **Release Notes** is built differently: no `PageShell`, no section rail, no Project Overview block. Intentional.
- **Project Admin Shell** shows its hero topbar in both windowed and fullscreen, unlike the other three. Intentional, per its own code comment.
- ~~**Check Access long-v2** has its own hand-written rail rather than using `LeftRail`. Intentional.~~ **Superseded 2026-08-15** — confirmed not intentional. It becomes the shared `LeftRail` with its own content. Wordmark resolves to 16px (the shared value), which is the single visible change; the other four case studies are untouched. See HANDOFF §4.

### Not built

An AI Experiments page was never designed and has been removed from the rail. **Do not create a route, stub, or placeholder for it.**

---

## Stage 1 — Deploy static

### 1.1 Repo

Files arrive as a folder exported from Claude Design against a verified **69-file** checklist (the first audit said 62; that was a miscount of a correct list — the true count is 68 files plus `HANDOFF.md`). Folder structure must be preserved exactly — `site/`, `site/assets/`, `site-work/`, `frames/`, `uploads/` — because every file references the others by path.

Structural constraints confirmed by the export verification:

- Every HTML shell loads its components as `site/…` and `site-work/…`. Flattening either folder breaks all six React pages at once.
- `site/assets/aitl/` and `site/assets/release-notes/` are referenced from inside JSX as paths **relative to the page, not the component**. Moving `site/` without moving `assets/` with it breaks 18 images.
- `frames/` and `uploads/` are referenced from page level. Renaming either breaks 16 images.
- The three video poster PNGs sit at the **project root** with no folder prefix. Moving them into an assets folder requires editing the long-v2 page. Leave them where they are.
- Confirmed live-versus-duplicate: long-v2 uses the root-level posters, not the similarly named copies in `uploads/`; `site-work/` doodles are live and `card-stack/assets/` copies are not; `popup-full.png` is live and `popup.png` is not.

1. Verify the folder against the checklist.
2. Initialize git. **Commit the exported files completely untouched as the first commit.** No edits in this commit. It is the reference point for everything that follows.
3. Push to a **private** GitHub repo. Suchi may need to create a GitHub account — walk her through it.

Private matters: the repo holds material that is not being published (see 1.2).

### 1.2 Excluded from deployment

`project-admin-shell.html` — the detailed UiPath Admin Shell case study — is **non-public**. It currently sits behind a passcode compared in client-side JavaScript, which is not protection: the code is readable in the page source, and the page is reachable by URL regardless.

**Do not attempt to fix the passcode gate. Exclude the page from the deployed build instead.**

- The file and its seven `frames/` diagrams stay in the private repo
- Neither is included in what gets published
- Verify after deploy that both the page and every diagram return 404 on the live site — **gating the page is not enough if the images remain reachable at their own URLs**

**Consequence that must be handled:** `page-admin-shell-public.jsx` (line ~266) gates a link to this page behind the passcode. With the page unpublished, entering the code leads to a 404 — worse than no gate at all.

Replace the passcode UI on the public version with static text along the lines of *"The detailed case study is available on request."* No input field, no redirect. Confirm the wording with Suchi.

The public Admin Shell version stays in the Work stack as normal.

### 1.3 Remove before deploy

Visible to visitors, or actively wrong. This is the only content change permitted in Stage 1 beyond renames and videos.

- **`tweaks-panel.jsx`** — a developer control panel (themes, type scales) loaded by all five React project pages. Remove the script tags and the mount calls.

Nothing else. See 1.6.

### 1.4 Filename normalization

Required — current names will fail on a real server.

| Current | Becomes |
|---|---|
| `Homepage.html` | `index.html` |
| `Work.html` | `work.html` |
| `UiPath Admin Shell - Public Version.html` | `admin-shell-public.html` |
| `uploads/homepage photo.jpg.png` | `uploads/homepage-photo.png` |
| `uploads/speaker icon new.png` | `uploads/speaker-icon.png` |
| `uploads/IITG_logo (2) 2.png` | `uploads/iitg-logo.png` |
| `uploads/Option A.png` · `Option B.png` | `uploads/option-a.png` · `option-b.png` |
| `uploads/sentiment_content_24dp_…opsz24 1.png` | `uploads/sentiment-icon.png` |
| `Disclose Progressively.png` etc. | `disclose-progressively.png` etc. |
| Remaining capitalised assets | lowercase-hyphenated |

**Every reference must be updated, and they are not all in HTML.** The audit found these in JS strings:

- `site-work/cards.jsx:53` — card 03 href, feeds both the iframe src and the mobile list
- `site/shared.jsx:23` — `NAV[0].href`
- `site/shared.jsx:73` — `PROJECTS[2].href`
- `site/shared.jsx:572` — TopNav brand link
- `site/shared.jsx:667` — LeftRail brand link, **three occurrences on one line**: the href, `window.top.location.href`, and the `window.location.href` fallback
- `site-work/stage.jsx:477` — chrome close button
- `site/page-project.jsx:774` — `NEXT_CARD_KEY` object key
- `site/page-project-aitl.jsx:1373` — next-project href
- `site/page-project-admin-shell.jsx:513` — back link

Search for both literal and percent-encoded forms (`homepage%20photo.jpg.png`). Files on disk have literal spaces; the HTML references them encoded.

Commit renames as their own commit.

### 1.5 Videos

Three walkthrough reels on the Check Access long version currently show still posters. Suchi has the recordings; Claude Design could not accept video files.

- Sources are `.mov` screen recordings — likely very large. **Convert to web format before adding to the repo.** MP4 (H.264) primary, WebM optional. Target well under 10MB each; GitHub hard-rejects any file over 100MB.
- Keep the existing poster images as the loading frame.
- The page holds video paths in `data-src` behind a flag currently set false. Add the converted files, update paths, flip the flag.
- **Filename warning:** the existing files read `Scope Seperation` — misspelled. The code looks files up by name. Either keep the misspelling consistently across image, video and code reference, or correct it in all three at once. Do not correct it in one place. Simplest is to leave it; the filename is never visible to a visitor.

### 1.6 Leave alone

Do not fix these in Stage 1, even though they look wrong:
 
- The dead `NAV` array, `TopNav`, `SiteFooter`
- The four component files loaded but never rendered by Check Access (`page-home`, `page-works`, `page-about-process`, `page-rest`) — roughly 40k of inert JSX
- Dead `NEXT_HREF` entries pointing at `project-design-system.html` / `project-onboarding.html`
- The temporary `class="is-fullscreen"` on Check Access's `<body>`, despite its "remove before ship" comment — removing it changes how that page appears both standalone and in the stack. It stays until Stage 2.
- The `contact (old).html` fallback href on the Contact rail item — the overlay intercepts it; it only surfaces on middle-click or if JS fails.

If you find anything else that looks broken: **write it down, don't fix it.**

### 1.7 Verify locally

Serve over a local web server — not by opening files directly. `file://` behaves differently and masks broken paths.

- Every link on every page
- All four projects load in the stage manager
- Fullscreen enter and exit, including the post-switch sequencing
- Next-project links move the stack rather than navigating the iframe
- Contact overlay from Homepage, About and Work
- Resize 1440 → 900px on Homepage and About; confirm scaling
- The three video reels play

### 1.8 Deploy

- **Vercel**, free Hobby tier, static site, default `*.vercel.app` subdomain
- Connect the private GitHub repo; pushes deploy automatically
- Enable Vercel Web Analytics — free, and useful for knowing whether an application led to a visit
- Confirm `project-admin-shell.html` and all seven `frames/` files 404 on the live site
- Confirm every other asset loads — broken paths often only surface after deploy
- Re-run the full 1.7 checklist against the live URL

**Stage 1 is done when Suchi can send someone the link and everything works.**

> **Known limitation, accepted for Stage 1:** project pages opened by direct URL render with no navigation — no rail, no way back, no contact. The rail's visibility is owned by the parent stage manager, which writes `is-fullscreen` into the child document; the page cannot set it for itself. Only Check Access looks correct standalone, because of the temporary hard-coded class. **Share the homepage or Work URL, not project URLs, until Stage 2 resolves this.**

---

## Stage 2 — React conversion

### 2.1 Keep the iframe

The stage manager doesn't merely embed project pages — it reaches into them, toggling `is-fullscreen` on the child body and wiring key handlers across documents. Converting projects to plain components means rebuilding all of that and scoping every project's CSS so it can't leak.

**Point the iframe at React routes instead:** `<iframe src="/work/check-access">` loads the app fresh at that route inside the frame. CSS isolation preserved, `requestFullscreen()` still targets a real iframe element, the `postMessage` contract survives intact.

Revisit only if a future animation genuinely requires shared elements between the stack and the focused project.

### 2.2 Stack

- **Vite + React**, plain JavaScript (`.jsx`). No TypeScript — Suchi may read and edit these files.
- **React Router**. Real, deep-linkable URLs.
- **Two layouts:**
  - `RailLayout` — main site rail + `fit()` scaling. `/` and `/about` only.
  - `WorkLayout` — stage manager chrome. `/work` and project routes.
- **`ContactOverlay`** at app root, openable above any route. Does not change the URL.
- **CSS stays as-is.** No CSS Modules, no Tailwind, no styled-components. No class renames, no reformatting. The CSS is the design.
- **No animation library yet.**

### 2.3 Routes

| Route | Page |
|---|---|
| `/` | Homepage |
| `/about` | About |
| `/work` | Work — stage manager |
| `/work/check-access` | Check Access, short |
| `/work/check-access/full` | Check Access, long — linked from the short version |
| `/work/ai-trust-layer` | AI Trust Layer |
| `/work/admin-shell` | Admin Shell, public |
| `/work/release-notes` | Release Notes |

The detailed Admin Shell is not routed — it remains unpublished.

Confirm all slugs with Suchi before committing. These are public and effectively permanent.

### 2.4 Resolve the standalone-navigation problem

The main functional improvement in Stage 2. Solve it deliberately rather than inheriting it.

Each project route must render correctly both inside the stage manager's iframe and when opened directly. Recommended: the project component detects whether it is framed (`window.self !== window.top`) and sets its own default state when it is not — so a direct visit gets the section rail and a route back to the site.

Once this works, delete the temporary `is-fullscreen` class from Check Access.

### 2.5 The scaling system

Extract `fit()` into a shared hook used by `RailLayout` only. Work and project routes never call it. Reference width is **1300px** and must not change — cross-page positional continuity depends on both rail pages using an identical reference.

- Use `useLayoutEffect`, **not** `useEffect` — the scale must apply before paint or there is a visible flash on every route change
- `.stage` remounts on route change, so recalculate on mount, not only on resize
- Clean up the resize listener on unmount; React's development StrictMode double-invokes effects, so verify no duplicate listeners
- Port `clearScale()` alongside `fit()`
- About's `render()` replaces `.mode-content` innerHTML on branch toggle, destroying and recreating `.shelf`. Whatever re-runs layout after that toggle must survive the port.

### 2.6 About page

- Two branches, **THE DESIGNER** and **THE PERSON**, toggled by radio buttons. Becomes React state. Both preserved.
- The PERSON branch is voiceover-driven: lyrics-style panel, fixed-height crop, autoscroll, active-paragraph highlight in the accent colour, Play/Pause.
- **No audio file exists.** `USE_AUDIO = false` drives a synthetic timeline faking the playback clock. Intentional. It becomes a single exported constant; flipping it to `true` is the only change needed when the recording exists.
- Do not simplify the timeline driver, replace it with a real audio element, or remove it as dead code.
- Homepage also references `assets/audio/suchi-pronunciation.mp3`, which does not exist, guarded by the same flag. Leave the guard in place.

### 2.7 Dead code cleanup

Now safe to remove:

- `NAV`, `TopNav`, `SiteFooter` in `shared.jsx`
- The four unrendered component files loaded by Check Access, and their script tags
- Dead `NEXT_HREF` entries
- The four duplicated copies of the main site rail — becomes one authored nav in `RailLayout`

### 2.8 Port order

`Homepage → About → Work → project pages.`

Screenshot-compare each against the deployed Stage 1 site before starting the next — same viewport width, same scroll position. Resolve differences before moving on. Do not port everything and then check.

---

## Definition of done

**Stage 1**
- [ ] All 69 files present at correct paths; original export committed untouched as first commit
- [ ] Private repo; detailed Admin Shell and its frames excluded from deploy and confirmed 404 live
- [ ] Passcode gate replaced with static text
- [ ] `tweaks-panel.jsx` removed
- [ ] All filenames normalized; every reference updated, including JS strings
- [ ] Videos converted, added, flag flipped, reels play
- [ ] Live on Vercel; full click-through verified against the live URL

**Stage 2**
- [ ] All eight routes work; direct links and refreshes correct
- [ ] Project pages render correct navigation standalone *and* framed
- [ ] Temp `is-fullscreen` class removed
- [ ] Screenshot parity at 1440 / 1300 / 1150 / 900px against Stage 1
- [ ] Rail scales on Homepage and About; Work section unaffected
- [ ] Stage manager: all four projects, fullscreen enter/exit, post-switch sequencing, `postMessage` next-project
- [ ] Contact overlay opens over every route
- [ ] Both About branches work; `USE_AUDIO = false` timeline behaves as before
- [ ] Fonts render identically — Archivo, Cormorant Garamond, DM Sans, JetBrains Mono, correct weights

---

## Deferred — do not touch

- Left-nav tab travel animation (270–340ms, ease-out-expo)
- Work stage manager overlaid on a blurred Homepage, with ESC and right-edge hover replacing back-navigation
- Responsive behaviour in the 900–1440px range on About
- Mobile: About initialises `mode` as `null` with no way to set it below 900px, rendering blank. Known.
- Person-branch image collage; designer-branch image system
- Image weight and loading optimization
- Real voiceover cue timings — blocked on the recording existing
- AI Experiments page — not designed
- Custom domain
- Prerendering for LinkedIn and Slack link previews

---

## Ask, don't assume

- Final URL slugs — public and effectively permanent
- Wording for the text replacing the Admin Shell passcode gate
- Any point where achieving parity seems to require changing the design
- Any dependency beyond Vite, React and React Router
- Anything in the exported code that is ambiguous or looks like a bug — **write it down, don't fix it**
