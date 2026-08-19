# Portfolio — Post-Migration Roadmap (v2)

*Supersedes the previous roadmap, which was written before the React migration ran and is now factually stale. This version is written against the audit of the actual built state.*

**Positioning driver:** design technologist. The claim is made by the artifact. That is why one motion moment and a colophon sit above the line, and why performance and correctness sit above the line with them — a design technologist whose site jumps, blanks on mobile, or loads slowly contradicts the claim more loudly than any transition supports it.

**Working method, unchanged:** one change per prompt, report before edit, screenshot-gated, sequential approval. Nothing here should be handed to Claude Code as a batch.

---

## Gate 0 — before promoting `stage-2` to production

**Promotion is one-way and it destroys the parity reference.** Production currently serves Stage 1, and `compare.mjs` diffs against the live production URL. The moment `stage-2` is promoted, the reference is gone — and AI Trust Layer has never been cleanly measured. These four run in order, before anything else in this document.

**0.1 — Freeze the parity reference.**
Replace the production alias in `compare.mjs` with Stage 1's own immutable deployment URL (Vercel per-deployment URLs never move). Additionally capture the Stage 1 screenshots to disk as golden images, committed. After this, parity survives promotion permanently and `legacy/` is unambiguously free to delete.

**0.2 — Fix the harness, then measure what was never measured.**
The AITL 0.831% is a capture fault: 14 `loading="lazy"` images never triggered inside the shot window. Scroll to full height and wait for network idle before capturing, or force `loading="eager"` during capture only. Then:
- Take the real AI Trust Layer number.
- Resolve the Release Notes size-mismatch at 1440 and 1150 (0% at 1300 and 900 already).
- Re-establish per-case-study comparison now that slugs render the stage — compare the framed document, not the stage wrapper.
- **`/about` has never actually been compared.** Its `mode` starts `null`, so a fresh load renders the rail and two unselected radios and nothing else — 61 characters of text, 96% of the capture uniform. The recorded "0 differing pixels at all four widths" matched two near-empty pages. Parity here needs a capture that clicks a branch first, with **THE DESIGNER and THE PERSON as two separate comparison targets**. Neither branch's content has been pixel-compared on any width, which makes About the least-verified page in the migration rather than the best-verified one.

**0.3 — Fix the italic-700 font axis.**
The app shell requests Cormorant Garamond italic 400/500/600; the page renders an italic-700 run, so the browser synthesises it. 110.28px vs 111.45px, which crosses a line-break boundary at 900px and shifts everything below by 29px — the entire `/work` 2.268%. This is a live rendering bug independent of parity. One line in the font request. Re-run `/work` after.

**0.4 — Promote, and delete `legacy/` in the same pass.**
Deletion is safe: 4.9MB, 38 files, imported by nothing, already `.vercelignore`d, absent from `dist/`, and recoverable from commit `a997fbb` indefinitely. Keep it until this moment only because it's a convenient local copy of the comparison target; the day that stops being true is this day.

**Known unverified surfaces.** Three things the harness cannot see, recorded so a green table is not mistaken for full coverage. None is a defect; each is a deliberate trade for deterministic capture.

- **The `is-fullscreen` rendering state has never been compared.** `--framed` strips the class from both sides, mirroring what the stage does to its child on load. So every case study is verified in its windowed state only — the section-rail layout that appears in fullscreen is unmeasured on all five pages.
- **Video playback has never been compared.** The three walkthrough reels are paused and rewound to frame zero before capture, because otherwise two captures catch two different frames — that was 25,351 differing pixels on the long read, one band per reel. Frame zero matches; nothing after it is checked.
- **THE PERSON in its playing state is unverified.** At rest the branch is 89 characters and two images, and that resting state now compares clean. The lyrics panel, autoscroll and active-paragraph highlight only exist once Play is pressed, and that timeline is not deterministic to screenshot. It stays unverified until the real voiceover exists and item 10 addresses it properly.

---

## Above the line — before a single application goes out

### Correctness

**1 — `/about` renders blank below 900px.**
`useState(null)` with `if (mode === null) return null`, and the branch radios exist only in the desktop layout. A white page at 768 and 390. This is the single most damaging item in the document: About is the page most likely to be opened casually, on a phone, by someone who was curious. Needs a mobile branch affordance or a sensible default `mode`.

**2 — Horizontal overflow at 390px.**
- `/work/check-access` overflows 245px — a 2,980px-wide audit-pipeline SVG container that doesn't shrink.
- `/work/check-access/full` overflows 315px — `section.row` is `grid-template-columns: 180px 1fr` with 64px side padding, and the page has no mobile treatment beyond one 760px rule for the video reels.

**3 — The long read is a dead end.**
`/work/check-access/full` renders standalone with `railVisible: false`, no contact affordance, and one `← BACK` link to the short version. It is directly shareable and it is the deepest piece of work on the site. A recruiter who lands there from a link has no route to you. Either grant this one page a contact affordance — a deliberate, documented exception to the "six project pages have no contact affordance" rule — or route `← BACK` to a surface that has one.

**4 — Stale résumé data.**
`SITE.resume = "read.cv/suchi"` in `shared.jsx` has zero usages and zero bundle occurrences, and points somewhere different from the live link. Delete it, or make it the source of truth. The actual link — contact overlay → `/suchi-resume.pdf` — works; its 1.37MB weight is a below-the-line concern.

### First impression

**5 — Meta tags, static.**
`dist/index.html` currently has charset, viewport, and `<title>Suchi. Portfolio '26</title>`. No description, no `og:`, no `twitter:`, no canonical, and nothing set client-side. Add a static description and an `og:image` to `index.html` so a pasted link previews as a card rather than a bare URL. One title for the whole site is acceptable at this stage; per-route tags need prerendering and stay below the line.

**6 — Custom domain.**
Both production and preview are on default `*.vercel.app` subdomains. `suchi.design/work` on a résumé reads differently. Verify in Vercel → Settings → Domains; Claude Code cannot see this.

**7 — Image weight, lite.**
*The minimum that affects perceived quality. The rest is below the line at item 15.*
- Explicit `width`/`height` on every `<img>`. Not one image on the site has them, so every page shifts as images arrive. Mechanical, ~30 minutes, and it removes the most amateur-reading loading behaviour there is.
- Re-encode the three root MP4s — 11MB of a 26MB payload, one at 5.4MB.
- Add `loading="lazy"` where it's missing: homepage (8 images) and stage cards (5).

*If Gate 0 runs long, this item can drop below the line without argument.*

### Positioning

**8 — Colophon and repo decision.**
Nothing on the site currently states it is hand-built. The design technologist claim is being made entirely implicitly, by an audience that has no way to see the code. A short build note — stack, hand-coded, no template — and a decision on whether the repo becomes public and linkable. Cheapest proof available; an afternoon.

**9 — Tab travel, plus `prefers-reduced-motion`.**
The left-nav travel indicator between Homepage and About, 270–340ms, ease-out-expo. The reason the React migration happened. One signature motion moment rather than three, because it carries the positioning at a fraction of the risk. `prefers-reduced-motion` ships with it — non-negotiable, and itself a craft signal.

**Explicitly not above the line:** the Work-overlaid-on-blurred-Homepage concept. Most expensive, most breakable, lowest marginal signal.

---

## Then apply.

The site works, the case studies are strong, attribution is honest. Everything below this line improves it while applications are already out doing their job.

---

## Below the line

**10 — About person branch.** Gated on the final voiceover recording, which is your work not the build's. Once it exists: swap behind `USE_AUDIO`, replace placeholder cue timings, verify lyrics-panel scroll sync, confirm `personTeardown()` restart-from-zero, check slow-connection and pause/resume.

**11 — Soft-404.** `vercel.json` rewrites every unmatched path to `index.html` with status 200, so React Router renders the 404 page correctly for humans while crawlers see a soft-404. Cosmetically fine, technically wrong. Fix when convenient.

**12 — Per-route meta and link-preview prerendering.** So each case study previews with its own title and thumbnail rather than one shared card.

**13 — Anchor tuning, 900–1440.** The audit found this band clean on the React build — no overflow, no blank content, on any route. The previously flagged 900px `<main>` squeeze was caused by a temporary `is-fullscreen` class and does not reproduce. This item is now optional refinement, not repair.

**14 — Remaining motion.** Cross-page transitions as progressive enhancement; Work-on-blurred-Homepage with ESC and right-edge hover.

**15 — Image weight, full.** `srcset` across the site; the six PNGs over 700KB re-encoded; the two ~1.7MB video posters to WebP; the 1.37MB CV compressed.

**16 — Accessibility pass.** Alt text on case-study images, contrast on the muted greys, keyboard navigability. Being asked about accessibility in an interview with a failing site is a bad look.

**17 — Dead code.** `PROJECT_DATA` carries ~110 lines for `datasync-design-system` and `datasync-onboarding`, which have no page, route or card. `NEXT_HREF` has one entry nothing reads, shadowed by `OVERRIDE`.

**18 — Analytics, actually read.** Once applications are out: which case studies get opened, how long people stay, where they bounce. A quiet advantage most candidates don't use.

---

## Not a task — documentation debt, do it at the first natural pause

Eight decisions were made mid-migration and exist only in commit messages. They belong in `PROJECT_CONTEXT.md` under *Decisions that will look wrong from outside*, because a future session will otherwise try to "fix" them:

1. `useProjectShell({ responsive: false })` — a per-page opt-out from the shared responsive stylesheet, used only by the long read, because `main h1 { font-size: 80px !important }` would resize its hero.
2. `/work/:slug?` as one route rather than five, so the stage never unmounts and its iframes never reload.
3. URL updates use `replace`, not `push`, so back leaves Work in one press instead of retracing every card.
4. sessionStorage keys `work:fs`, `work:scroll:<path>`, `work:frame:<cardKey>` — scroll keyed by framed *path*, not card, so the long read doesn't restore onto the short version.
5. Four unreachable `nativeFsRef` branches dropped in the port; two `exitFullscreen` calls kept.
6. `LeftRail` gained `background: var(--bg)` and `z-index: 40`, carried from the long read's hand-written rail — affects all five case studies.
7. **Below 900px a slug renders its case study, not the stage** — otherwise the mobile list's links lead back to the mobile list. The least obvious of the eight and the most likely to be "corrected."
8. The `frameSrc` guard — stored paths validated as the card's own route or a segment below it, because that value goes into an iframe `src`.

Also outstanding, logged not fixed: the hero type-scale inconsistency (short renders 80px at 1150 where long renders 92px, predating the port), and the F11 fullscreen-exit question.

---

## Sequence

1. Gate 0, in order. Promote. Delete `legacy/`.
2. Items 1–4 — correctness.
3. Items 5–7 — first impression.
4. Items 8–9 — positioning.
5. **Apply.**
6. Everything below the line, in whatever order the job search suggests.

Steps 1–4 are days, not weeks. Nothing above the line is large; several are under an hour. The hard part is step 5, and it is hard for psychological reasons rather than technical ones.
