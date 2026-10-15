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

**0.3 — Fix the italic-700 font axis. DONE — and it is an approved divergence, not a parity fix.**

The finding was not what the item assumed. Only **two elements on the whole site** ask for italic 700: the two `<strong>` spans in the Check Access hero lede at 24px, authored with an inline `fontWeight: 700` (`page-project.jsx:293`). There is no large-type case and no caption case.

Cormorant Garamond **does** have a real 700 italic — the variable axis is 300–700 in both styles, and the API rejects `1,800` outright — so `1,700` was added to the request and those two words now render a designed weight instead of a synthetic bold. Verified: a `700:loaded` italic face, rendered width 112.06px.

**This moves parity away from the reference, deliberately.** Measured on framed Check Access at 1440:

| | `strong` width | vs reference |
|---|---|---|
| Reference (Stage 1, italic 400 only) | 110.28px | — |
| Before — synthesised from 600 | 111.45px | 1,104 px · 0.016% |
| **After — true italic 700** | **112.06px** | **1,385 px · 0.019%** |
| *Rejected:* match the reference exactly (italic 400 only) | 110.28px | 247 px · 0.003% |

Matching the reference exactly would have driven parity to near zero — it proves the italic axis is essentially the entire residual — but only by degrading **13 elements** across the homepage, both About branches, Release Notes and Check Access from real italic weights to synthesised ones. The reference renders those two words wrongly; matching a wrong rendering is not a win. **Parity is the goal for the gate, not for the site.**

So `/work`'s 2.268% at 900 does **not** go away, and should not be chased. *(Re-measured 2026-08-19: the figure is **2.300%**, 18,627 px, and it is deterministic — identical across repeated runs and identical on a clean `HEAD` with all of items 1/2a/2b stashed. The 2.268% above is simply stale. Same cause, unchanged.)* It is the same italic axis crossing a line-break boundary, and it is now a known, approved difference between a correct build and an incorrect reference. Do not "restore" the font request to match Stage 1.

**0.4 — Promote, and delete `legacy/` in the same pass.**
Deletion is safe: 4.9MB, 38 files, imported by nothing, already `.vercelignore`d, absent from `dist/`, and recoverable from commit `a997fbb` indefinitely. Keep it until this moment only because it's a convenient local copy of the comparison target; the day that stops being true is this day.

**⚠ 2026-09-23 — THE STAGE 1 REFERENCE DEPLOYMENT IS GONE.** `https://portfolio-dk8r4mnca-suchi2.vercel.app` now returns **410 Gone** on every path; Vercel pruned it. Live comparison is dead. Only `--golden` works, and only at **1300**, because that is the one width the goldens were captured at. Parity at 1440/1150/900 can no longer be measured against Stage 1 at all.

**And the goldens have drifted from the current build at 1300.** Measured 2026-09-23 on `HEAD` before item 17: `/work` **0.192%** (recorded 0.083%), framed long read **0.072%** (recorded 0.000%), framed Check Access fails on size, **4862px vs the golden's 4935px**. The likely cause is the deliberate Check Access solution-section changes of 2026-08-22 (pillar walkthroughs, autoplay, overlay text removed), which were never re-baselined. So these figures are now a *before/after* tool (did this change move anything?) rather than a Stage 1 parity measure. Undecided: whether to re-capture the goldens from the current build as a new baseline. Doing so gives up the last link to Stage 1, so it is Suchi's call.

**Known unverified surfaces.** Three things the harness cannot see, recorded so a green table is not mistaken for full coverage. None is a defect; each is a deliberate trade for deterministic capture.

- **The `is-fullscreen` rendering state has never been compared.** `--framed` strips the class from both sides, mirroring what the stage does to its child on load. So every case study is verified in its windowed state only — the section-rail layout that appears in fullscreen is unmeasured on all five pages.
- **Video playback has never been compared.** The three walkthrough reels are paused and rewound to frame zero before capture, because otherwise two captures catch two different frames — that was 25,351 differing pixels on the long read, one band per reel. Frame zero matches; nothing after it is checked.
- **The harness never renders a real iframe.** `--framed` shadows `window.self` instead, so the framed document is captured at the **full viewport width** while the stage's actual iframe is about `viewport - 244`. At a 900px window that is a 656px frame the harness reports on as if it were 900px. Any rule keyed to width — every media query — can therefore pass the harness and still be wrong in the stage. It caught nothing when the item 2 breakpoints fired inside the frame; `/work`, which loads a genuine iframe, is what caught it. See item 2d.

- **THE PERSON in its playing state is unverified.** At rest the branch is 89 characters and two images, and that resting state now compares clean. The lyrics panel, autoscroll and active-paragraph highlight only exist once Play is pressed, and that timeline is not deterministic to screenshot. It stays unverified until the real voiceover exists and item 10 addresses it properly.

---

## Above the line — before a single application goes out

### Correctness

**1 — `/about` renders blank below 900px. DONE (2026-08-19).**

Both halves of the fix, because either alone loses something. `.mobile-stack` now renders its own copy of the branch toggles, so THE PERSON stays reachable on a phone; and a null `mode` resolves to `designer` below 900, so the page has content before anything is tapped. `person` could not be the fallback — its lyrics panel and shelf are hidden until the first Play, so at rest it is an eyebrow and a button above a blank screen.

The resolution happens at render (`shownMode`), not by seeding state. That is what keeps the desktop untouched: the authored null first paint — two unselected radios and a choice to make — survives exactly, and crossing 900 in either direction lands on the right composition without the mobile fallback ever being written into `mode`.

Measured before and after: `/about` at 1440/1300/1150/900, in all three states (null, THE DESIGNER, THE PERSON), is **0.000% on every cell, unchanged**. `/work` re-measured at its expected 0.083%, because `useIsNarrow` moved out of `Work.jsx` into `hooks/` rather than being copied into About.

*Two notes for whoever works here next.* The in-app browser's `resize_window` changes the viewport **without firing `resize` or matchMedia `change`** — it reported the resize case as still-blank, falsely. Drive Playwright's `setViewportSize` for anything on a JS width listener, which includes `useFit`. And `.designer` carries an inline `width: 254px`, authored that way in Stage 1 (`legacy/about.html:219`), which overrides the `max-width: 340px` in About.css's ≤899px rule — so the mobile column is 254px, not 340. Item 19.

**2 — Horizontal overflow at 390px.**

*The original entry named one wrong cause and undercounted the surfaces. Re-measured 2026-08-19, element by element.*

**2a — `/work/check-access`. DONE (2026-08-19).** 245px → **0px at every width**.

Not the pipeline diagram. That 2,980px SVG is real and is the widest element on the page, which is presumably how it was fingered — but it is fully clipped by an `overflow:hidden` ancestor with `maxWidth:100%` and contributes nothing to the scroll width. Three actual causes, all the same defect: **`1fr` carries an automatic `min-content` floor**, so a track refuses to shrink past its longest word no matter how little room the column has.

| | fix |
|---|---|
| Solution-pillars 3-up grid | collapse to `minmax(0, 1fr)` below 700px, divider rotates right → bottom |
| Artifacts 3-up grid | same collapse |
| `180px minmax(0,1fr)` label/content split + 48px `h2` | collapse the split, `h2` to 32px |
| `.evo-tip` hover tooltip | `display:none` — absolute, nowrap, and hover-only, so on touch it is an invisible element whose only effect is horizontal scroll |

**700px is the breakpoint, and it is chosen not guessed:** it is where the three-up tracks stop resolving to equal widths. Overflow existed only at 560 and below. Every width the harness measures — 900/1150/1300/1440, framed — is above it and was verified untouched: **framed Check Access re-measured at 0.021% at 1300, exactly the recorded figure.** Release Notes 0.000% across all four. Two inline track lists moved into stylesheets so the breakpoint could override them without `!important`; both are computed-identical above 700.

**2b — `/work/check-access/full`. DONE (2026-08-19).** 315px → **0px at every width, down to 320.**

Mechanical, as predicted: every multi-column grid to one column, section padding 72/64 → 40/20, headings down. Verified live at 1440/1300/1150/900 and against the golden — **0.000% on every cell, before and after.**

Three things worth keeping, because each cost a debugging pass:

- **The block has to be last in the file.** It was first written into the existing `@media(max-width:760px)` at line 270, and `.lessons`, `.impact-stats`, `.footer-row` and `footer.page` are all declared *below* that. Same specificity, so source order decided it and the base rules silently won — the rules were present, they matched, and they did nothing. The whole 760px block now lives at the end of the file with a comment saying why.
- **`1fr` is not the fix, `minmax(0, 1fr)` is.** A collapsed `section.row` still resolved its single track to 372px inside a 320px viewport, because `1fr` keeps an automatic min-content floor. Same defect as 2a; it just reappears one level up.
- **The last 36px was one word.** The hero `h1` is `clamp(56px, 8vw, 108px)`, and at 390 the 56px *floor* is what renders — "PERMISSIONS." at 56px is 362px wide in a 262px column. Only the floor moved, to 38px. Be precise about the consequence: the old floor bound until 8vw reached 56px, so **475–700px now scales smoothly where it used to sit flat at 56px**, and 700px up is byte-identical. All of it inside the 760px block, which the harness never reaches.

What is *not* done here is how the page reads on a phone — rhythm, type scale, where the reels sit. That is item 19, deliberately.

**2c — Three more surfaces overflow at 390. MOVED BELOW THE LINE (item 19), 2026-08-19.**

Found by sweeping all four case studies rather than the two the original entry named: `/work/admin-shell` 228px at 390 and 58px at 560; `/work/ai-trust-layer` 94px at 390, **and 40px at 900 / 24px at 1150**; `/work/release-notes` 81px at 390.

Suchi's call, and the right one: fixing these piecemeal buys a phone layout nobody designed. Mobile needs a real pass, not four more breakpoints bolted on one at a time, and it is being taken up as one piece of work later. Item 2 above the line is therefore complete at 2a + 2b — the two surfaces that were actually recorded as blockers.

**One exception is not cosmetic and does not belong in a mobile pass:** AI Trust Layer overflows at **900 and 1150**, inside the band the audit called clean. That is a desktop defect, and it is item 13's problem, not item 19's. *(Fixed 2026-09-23, see item 13.)*

**2d — Every narrow-screen rule is scoped `:not(.is-framed)`, and it has to be.**

The stage loads each case study into an iframe **roughly `viewport - 244` wide**. So a 900px window hands the case study a **656px** frame — under the 699/760 breakpoints — and the mobile layout appeared *inside the stage at a desktop window size*. Measured before the scope existed: the framed document ran 5243px tall against Stage 1's 5166px.

`ProjectShell` now writes `is-framed` onto `<html>` when `window.self !== window.top`, and every block in 2a and 2b is scoped `:not(.is-framed)`. Inside the stage the case studies match Stage 1 at every width; below 900 a slug renders unframed and the fixes apply. Verified at the real iframe widths — at a 900px window the framed pillars are back to Stage 1's `160.469px 106.469px 138.844px` with a 48px `h2`, while direct visits at 390 and 656 hold at zero overflow.

`FRAMED` now has one definition, in `shared.jsx`, used by both `Work.jsx` (stage-vs-case-study) and `ProjectShell` (the class). It was declared twice.

**The harness cannot see this class of bug — add it to the unverified surfaces.** `--framed` shadows `window.self` rather than using a real iframe, so it renders the case study at the **full viewport width**. It tested 900px and reported 0.031%; the actual frame was 656px. Anything keyed to width behaves differently in the harness than in the stage. `/work` is the only run that exercises a real iframe.

**A latent bug behind all of this, written down not fixed.** `shared.jsx` already tries to collapse the label/content split on mobile:

```
section[style*="180px 1fr"], section[style*="180px minmax"] { grid-template-columns: 1fr !important }
```

The grid is a `<div>` *inside* the section, not the section, so **this selector has never matched on any case study at any width**. It is deliberately left alone: it sits in the `max-width: 900px` block, Stage 1 ships the identical broken selector, and repairing it would change the framed rendering at a width the harness measures. Every fix in 2a was placed in a new `≤699px` block instead, which is why parity held.

**3 — Direct project links now open in the stage. DONE (2026-08-19).**

*The original entry ("dead end", no contact route) was checked against the live site and did not hold — `← BACK` did reach a surface with a working "Get in touch". The real defect was different, and Suchi's requirements reshaped the item.*

**What was wrong.** `/work/check-access/full` had its own route rendering the page directly, bypassing the stage. A shared link to the deepest piece of work on the site opened as a bare document: no chrome, and — because the section rail is gated on `is-fullscreen`, which only the stage ever sets — **no table of contents**, on a 12-section long-form read.

**Three changes.**

1. **One address pattern, `/work/:slug?/:sub?`.** The long read goes through `Work` like the other four. Deliberately *not* a second `<Route>`: that would put it elsewhere in the tree, and switching to it would unmount the stage and reload all four iframes — the exact thing the existing route comment exists to prevent.
2. **A sub-page URL seeds the stage** — the card's frame opens on that page, and opens **fullscreen**, so a shared long-read link arrives with its table of contents visible. The seed goes through the same `frameSrc` guard as the stored value (decision 8); it wins over sessionStorage because the URL is a deliberate request and storage is only a memory.
3. **`← BACK` always returns to the short version.** It used to try `history.back()` first, which reads as "back" but behaves as "leave" — arriving from LinkedIn or email, the one prominent control on the page sent the reader off the portfolio. Nothing has to preserve stage-vs-fullscreen: framed, it navigates the iframe only and the mode belongs to the parent.

**The sidebar rule needed no code.** It was already exactly right — visible in fullscreen, hidden in stage view. It only ever looked broken because the standalone case existed at all.

**Verified.** Direct long-read link at 1440: stage loads, frame fullscreen, rail visible, 12 TOC links, home link present. Direct short-version link: unchanged stage view, "Get in touch" visible. `← BACK` from a shared link lands on the short version and stays fullscreen; arriving via an external site it no longer leaves the portfolio. `/work/banana` and `/work/check-access/banana` both 404. Mobile unchanged — the long read still renders standalone below 900 (item 19). Parity identical to baseline: `/work` 0.060/0.083/0.095/2.300, framed Check Access 0.021 at 1300 and 0.031 at 900, long read 0.000% at all four.

> **⚠ HARNESS CHANGE — the long read must now be compared with `--framed`.**
> `node tools/compare.mjs /project-check-access-long-v2.html /work/check-access/full --framed`
> Without the flag the local side renders the *stage* and the diff is meaningless. A `--framed` golden was captured to match (`project-check-access-long-v2-framed-1300.png`); the old un-framed golden is left in place and is now unused.

**Known, not fixed — the address bar does not follow navigation inside a card.** The stage writes the URL only when the focused card changes (`focusProject`), so going short → long → short inside the frame leaves the URL where it started. Two consequences: after `← BACK` the URL still says `/full`, so a reload returns to the long read; and copying the URL while reading the long read *inside* the stage gives the short version's link. Neither is new — it is why the long read needed its own route in the first place — but the fix has an obvious home if it is ever wanted: the iframe-load handler already records the frame path to sessionStorage and could write the URL at the same point, guarded to the focused card.

**Skipped, 2026-08-19, Suchi's call** — direct links to the long read are not part of how she shares work, so the "share what I am looking at" case does not arise in practice. Not carried below the line either; recorded here only so a future session does not rediscover it as a bug.

**4 — Stale résumé data. DONE (2026-08-19).**

`SITE.resume` and `SITE.linkedin` deleted from `shared.jsx`. Both had zero usages and zero build occurrences; `resume` said `read.cv/suchi` where the live link is the contact overlay's `/suchi-resume.pdf`, and `linkedin` held the site URL rather than a LinkedIn one. **The built JS hash is unchanged by the deletion** — they were already tree-shaken out — so this is source hygiene with provably zero user-facing effect. No screenshot gate needed and none taken.

The live path was verified working: contact overlay → `/suchi-resume.pdf`, file present at 1,406,908 bytes. Its weight stays a below-the-line concern (item 15).

*A claim in an earlier audit pass was wrong and is corrected here: `SITE.owner` does exist (`owner: "Suchi."`, the object's first key) and needs nothing. The check that reported it missing started reading below the line that defines it.*

*Left alone deliberately:* `fullName: "Suchi Goyal"` — unused, but it matches the LinkedIn profile, where the surname cannot be removed. Not stale, so not touched. The other unused keys (`url`, `year`, `role`, `tagline`, `phone`, `location`, `footerCredit`) are inert rather than wrong; item 17 owns them.

### First impression

**5 — Meta tags, static. DONE (2026-08-19).**

`index.html` now carries a description, canonical, the full `og:` set and `twitter:card` (`summary_large_image`). One card site-wide; per-route tags still need prerendering and stay at item 12.

**Description (124 chars, Suchi's pick):** *"Suchi - design technologist. Enterprise platform design at UiPath: permissions, AI governance, admin systems. Portfolio '26."*

**The share image is a render of the homepage, deliberately interim.** Nothing in `public/` was usable — the only portrait candidate is 508x700 and cards need landscape 1200x630. A card was drafted from the site's own tokens and **rejected**: Suchi will supply a design (item 20). `public/og-image.png` is now a 1200x630 render of `/` itself — the real composition, so the card is at worst an honest preview of what the link opens.

*To regenerate:* screenshot `/` at **1440x756** (the 1.91:1 share ratio at a real desktop width, so the composition is not cropped) at `deviceScaleFactor: 2`, then downsample to 1200 wide. Recorded in the `index.html` comment too. 158KB.

**Verified:** 18 meta lines in `dist/index.html`, `og-image.png` copied into `dist/` at 1200x630, homepage parity 0.000% at 1300 and 900 (a `<head>` change should move nothing, and did not).

> **⚠ THREE ABSOLUTE URLS POINT AT THE VERCEL ALIAS** — `canonical`, `og:url`, `og:image`. They must all change the day a custom domain lands. See item 6; this is now a hard dependency of it, not a nice-to-have. Canonical especially: left pointing at the wrong host it tells Google the wrong page is the real one. `og:image` must stay absolute — several scrapers will not resolve a relative one.

**A standing preference, recorded 2026-08-19:** no em dashes in copy published under Suchi's name - she reads them as AI-written, and the whole positioning rests on the site reading as hand-made. Hyphens instead. The pre-existing em dashes in `index.html`'s font comment are developer-facing and were left alone.

**6 — Custom domain. DONE (2026-08-21).**

Live at **`https://suchigoyal.com`** — apex is primary, `www` redirects to it. Verified before repointing anything: both return 200 and `www` resolves through to the apex.

**It was four URLs in `index.html`, not three.** `canonical`, `og:url`, `og:image` — and `twitter:image`, which was missed in the hand-count and has exactly the same failure mode as `og:image`: fully qualified, fetched by the platform rather than the visitor, and silently renders nothing when the host does not match the link. All four now on the apex.

> **⚠ `tools/compare.mjs` STILL POINTS AT A `vercel.app` URL, AND MUST.**
> `REFERENCE = "https://portfolio-dk8r4mnca-suchi2.vercel.app"` is the frozen Stage 1 per-deployment URL. It is deliberately not the production alias, and it must not be updated to `suchigoyal.com` — that would make the harness diff the React build against itself and report 0.000% forever, destroying the baseline silently. A repo-wide grep for `vercel.app` will surface it; leave it alone. The comment above it says the same thing.

*Also checked and left alone:* `MIGRATION_BRIEF.md` records the Stage 1 deploy target as a `*.vercel.app` subdomain — historically accurate, not a live reference. **No `robots.txt` or `sitemap.xml` exists** in `public/` or at root, so neither carried a stale absolute URL. A sitemap would help Search Console and pairs naturally with item 12's prerendering; not created here. *(2026-10-15: both now exist, see item 21.)*

*Unaffected:* item 11's soft-404 rewrite has nothing to do with the host and stays below the line.

**Outstanding, and not something Claude Code can do:** add `suchigoyal.com` to Google Search Console and verify by DNS TXT in Cloudflare, then paste the URL into LinkedIn's Post Inspector to force a re-scrape of the card — LinkedIn caches aggressively and will otherwise keep serving the old preview.

**7 — Image weight, lite. DONE (2026-08-19).**

*Two of the three bullets were wrong as written. Measured, then done.*

**Explicit `width`/`height` — was "not one image on the site has them". Wrong: About's 28 marquee images already carried them, added during the port. The real figure was 33 of 61 missing.** All 61 now declare dimensions, and every attribute was verified equal to the file's actual pixels — a wrong number reintroduces the exact shift it exists to prevent.

They come from a generated map, `src/site/image-dims.js`, built by `tools/gen-image-dims.mjs` from the real files in `public/`, and spread on with a `dims(src)` helper. Hand-typed pairs across six files would drift the first time an asset is re-exported; this cannot. **Re-run the generator after adding or re-exporting any image.** An unknown `src` returns nothing, so a missing entry degrades to the old behaviour rather than rendering a wrongly-sized box.

**The three root MP4s: 10.62MB → 4.04MB, a 62% cut,** at 1280x720 H.264 CRF 26 with `+faststart`. None had an audio stream, so dropping audio lost nothing. All three verified decoding and playing (`readyState` 4, correct durations, no errors).

*This was expected to cost parity and did not.* The harness rewinds every video to frame zero and compares it, so a re-encode should have moved the long read off 0.000%. Measured: **11 differing pixels at 1440/1300, 5 at 1150/900 — still 0.000%.** CRF 26 lands inside pixelmatch's threshold. Had it not, the trade would have been worth surfacing rather than absorbing.

**`loading="lazy"` — the bullet said homepage (8) and stage cards (5). Measured as no benefit and not done there.** The homepage's 8 tags are 4 unique files rendered twice (desktop + mobile stack); the browser cache collapses that to **6 image requests in total**, and all of them are above the fold, where `lazy` does nothing and can delay the LCP. The stage doodles are visible in the card stack, same story. The pages that genuinely needed it — AI Trust Layer's 14, Release Notes' 4, the long read's 2 — already had it. Added only to the two Check Access icons that are genuinely below the fold (2471px), for uniformity rather than for the 3.6KB.

**Payload: `public/` 26MB → 19MB.** Parity re-verified across every surface, all identical to baseline: homepage and About 0.000%; `/work` 0.060/0.083/0.095/2.300; framed Check Access 0.019/0.021/0.022/0.031; AI Trust Layer 0.003/0.004/0.004/0.006; Admin Shell 0.001/0.002/0.002/0.001; Release Notes and the long read 0.000%.

*Still below the line at item 15:* `srcset`, the six PNGs over 700KB, the two ~1.7MB video posters to WebP, and the 1.37MB CV.

### Positioning

**8 — Colophon and repo decision. HALF SETTLED (2026-08-19). Colophon still open.**

**The repo stays private and is not linked. Decided, closed, do not re-open.** So the design technologist claim cannot be evidenced by pointing at code — whatever the colophon becomes, it has to carry that weight on its own.

**A colophon was built and reverted the same day.** The attempt: appending `designed and built` to the homepage pronunciation tag, so the line read `soo·chee   designed and built`. It worked technically and was rejected on design grounds. Reverted in full; homepage parity is back to 0.000% at all four widths and the build hash matches its pre-colophon state. Suchi is thinking about a different form.

*Everything the attempt established, so the next one does not re-derive it:*

- **`phon-*` is homepage-only.** It appears nowhere outside `Home.jsx` and `Home.css` — not on About, not in the shared rail, not in the stage — and sits inside no conditional. A change there cannot leak to another surface.
- **It renders twice.** `Home.jsx` carries independently authored desktop and mobile compositions, both containing the wordmark and tag. Editing one copy leaves the other unchanged; the desktop copy alone disappears below 900px.
- **Anything inside `.phon-control` plays the audio.** The pronunciation button wraps `soo·chee`, so plain text appended in place inherits the click handler. It has to be a sibling *after* `</button>` — verified by instrumenting the audio element: the new text fired 0 plays, the button 1.
- **`.phon-text` is the type token to reuse** — JetBrains Mono 12px, `letter-spacing: 1px`, lowercase, `var(--muted)`, no hover state. Reusing it needs no new CSS.
- **`.wordmark` is `position: absolute` bottom-left**, so widening it moves nothing else on the page; at 390 the mobile copy still fit on one line.
- **The dot in `soo·chee` is not a character** — it is `.phon-dot`, a 2px CSS circle. A typed `·` will not match it.
- **Spacing is the hard part, not the plumbing.** `.phon` has `gap: 3px`, which had no visual effect before (its only other child, the tooltip, is absolutely positioned). Appended text at that gap read as a typo; 16/24/32px were trialled and none was right.

**9 — Tab travel, plus `prefers-reduced-motion`. DONE (2026-08-20).**

Settled on a live bench rather than in the abstract: **280ms, out-quart, marker + colour, reserved gutter, travel-then-fade on leaving to /work.** (The roadmap guessed ease-out-expo; out-quart won on comparison. 280ms sits inside the specified 270–340 band.)

**One element, above `<Routes>`.** `RailTravel.jsx` renders inside `ContactProvider` and outside the router — the only slot that survives *every* route change, including the one to `/work` where the rail does not exist. That placement is what makes travel-then-fade work with **zero navigation delay**: the click routes immediately and the marker keeps animating over whatever rendered next, because it was never unmounted. The authored `>` was a `::before`, which by definition cannot outlive its parent — that is why it could never have travelled.

Position comes from measuring the real links, never from duplicating geometry; nothing hardcodes 24px, 54.511% or the 10px gap. Viewport rects are cached per href while a rail is on screen, which is how the marker still knows where "the work" was after the rail containing it has gone.

**Verified:** travel 491 → 534 @90ms → 540 settled (decelerating, lands exactly on the active link). Exit travels to 515 then fades to opacity 0. Returning from `/work` repositions instantly then fades in — no slide from a stale position, which would claim a journey that never happened. `prefers-reduced-motion` jumps straight to 540 with no animation. Below 900px the component renders nothing and the authored `::before` marker stays in charge.

**Parity moved, deliberately: 0.039–0.047% on both Homepage and About.** That is the reserved gutter. The site indented only the *active* item, so three labels jumped 14px sideways on every navigation; with a marker that moves, the labels have to hold still or the motion reads as a glitch. Reserving the gutter on every item is a visible change from Stage 1 and an approved divergence, like the italic-700 one.

**A pre-existing regression was found and fixed here.** On a cold load the active rail link animated **ink → accent over ~150ms** — an entrance animation, which this site does not have by policy. Cause: `transition: color 0.15s ease` (`Home.css:50`, `About.css:31`) was ported verbatim from Stage 1, where it never fired because the served HTML already had the rail correct; under React the link paints as `--ink` first, then `html.rail-route` lands and it animates. Measured on the production build at rgb(74,39,26) at 160ms. **Confirmed present on HEAD without item 9, and confirmed absent from the Stage 1 reference (accent at 40ms flat)** — so it was a port defect, not this work. Fixed by suppressing colour transition on rail links until the first navigation; scoped to rail links only.

**10 — About person branch. DONE (2026-08-21).**

The recording exists (`public/assets/audio/about-voiceover.m4a`, AAC mono 48kHz, 127.64s, 1.0MB — renamed from a filename containing spaces). `USE_AUDIO` is now `true` and the real driver is in.

**The flag pattern earned itself.** Swapping the synthetic clock for real audio changed `usePersonTimeline.js` only. Nothing in `About.jsx` moved — the branch had been built and shipped for months against a fake clock exposing the same interface.

**The synthetic timeline stays, as the fallback.** Verified by blocking the file: the branch keeps working, the highlight keeps advancing, Play still reads Pause. A dead network degrades to the clock that worked before the audio existed, not to a button that does nothing.

**No cue-tapper was needed, and building one would have been the wrong instinct.** Silence detection alone could not do it either — the take has 20 pauses over 0.35s against 9 paragraph boundaries, because a natural reader pauses mid-paragraph. What worked: estimate each paragraph's start proportionally by character count across the measured speech span, then snap to the nearest detected silence. All ten landed on a real gap within 1.4s, monotonic, drift consistently in one direction. The re-derivation recipe is in `aboutContent.js` for whenever the take is replaced.

**Gate 0's least-verified surface is now verified.** It was flagged as unverifiable because the playing state only exists after Play and a live timeline cannot be screenshotted. A real element can be seeked and frozen, which turns it into ordinary still frames: **seek to each of the ten cues, freeze, read the highlight — all ten land on the correct paragraph.** Also verified: duration reads 127.64 from metadata rather than the hardcoded constant; pause stops the element; switching to THE DESIGNER stops and rewinds it; navigating away from `/about` stops it; `prefers-reduced-motion` still renders static readable text with no transport at all.

*Three bugs found and fixed while wiring this, all mine, none pre-existing:*

- **`crossOrigin` set after `src`** reset the element's resource selection. With `preload="none"` nothing then started the fetch — `networkState 0`, silence, no error. Removed; the file is same-origin and never needed it.
- **`preload="none"` needs an explicit `load()`.** `play()` alone did not reliably start the fetch.
- **The unmount teardown was destroying the live element.** StrictMode runs effect cleanup and then re-runs effects *without re-rendering*, so `removeAttribute("src")` stripped the source on every dev mount while the ref stayed populated and the render body never rebuilt it. Teardown now pauses and rewinds only; a real unmount drops the last reference and the buffer goes with it.

*Also fixed here, unrelated to audio:* autoscroll fired while paused. Scrolling the lyrics panel at rest snapped back to the highlight three seconds later. Guarded twice — the early return covers scrolling while already paused, the check inside the timeout covers scrolling during playback then pausing inside the 3s window.

*Carried, not forgotten:* the panel's nested scroll on touch belongs to item 19. And the transcript still only appears after Play — raised as a recruiter-facing concern (most visitors never press Play, so the writing mostly does not ship), **considered and declined for now**; revisit when the page gets its pass below the line.

**Explicitly not above the line:** the Work-overlaid-on-blurred-Homepage concept. Most expensive, most breakable, lowest marginal signal.

---

## Then apply.

The site works, the case studies are strong, attribution is honest. Everything below this line improves it while applications are already out doing their job.

---

## Below the line

**11 — Soft-404. DONE (2026-09-23), live on suchigoyal.com.**

`vercel.json` now rewrites only the seven real routes to `index.html`. Everything else falls through to `dist/404.html`, a copy of the built `index.html` written by `tools/postbuild.mjs`, so the app still boots and renders its own NotFound page, now with a **404** status. `trailingSlash: false` redirects `/about/` to `/about` rather than letting it 404. *(2026-10-15: the rewrites now point each route at its own file, `about.html`, `work/ai-trust-layer.html` and so on, rather than at `index.html`; see item 21. The 404 behavior and the guard are unchanged; the guard now also checks each rewrite points at the right file.)*

**The route list is maintained by hand, and the build guards it.** `tools/postbuild.mjs` fails the build if any path in `src/routes.js` has no rewrite. Without that, a new case study would work when clicked through to and show the 404 page when opened directly or reloaded. Tested both ways: one rewrite removed exits 1 with a message naming the path; restored exits 0.

**Verified on the `testing` preview first, then on production after PR #4:** all seven routes 200; `/banana`, `/work/banana`, `/work/check-access/banana` 404 and render NotFound; `/about/` 308 to `/about`; `www` still redirects to the apex; résumé, favicon and `og-image.png` 200; the long read's link still opens in the stage; no page errors.

**12 — Per-route meta and link-preview prerendering. PARTLY DONE (2026-10-15), via item 21.** So each case study previews with its own title and thumbnail rather than one shared card. *Deferred 2026-09-23, Suchi's call: taken up with item 20 after the design-led pieces (items 19, 8, 14), since those will change what each page should preview as.*

*Done as part of item 21:* every route now has its own prerendered HTML file, and each one names its own address in `canonical` and `og:url` (the build fails if any file gets it wrong). *Still open, and still deferred with item 20:* the title, description, `og:image` and `twitter:` tags are the same on every page. The place to add them is now obvious: the per-route files are written by `inject()` in `tools/reading-copy.mjs`, which already rewrites the two address tags.

**13 — AI Trust Layer sideways scroll. DONE (2026-09-23), live via PR #5.** *(Anchor tuning across 900–1440 beyond this defect stays optional refinement.)*

**Re-measured first.** After the 2026-09-18 copy rewrite the 900px overflow was gone; what remained was **24px at every window from about 1150 to 1424** (frame widths 906–1180), in the stage. 900, 1024 and 1440+ were clean.

**Cause:** the four walkthrough carousels break out of the section padding to run full width, and hardcoded that padding as 64px. The site-wide rule in `shared.jsx` narrows section padding to 40px at 1180px and below, so the breakout overshot by 24px on each side; the left overshoot was clipped, the right one scrolled. Fixed with `--aitl-pad` (set in `aitl-impact.css` to follow the site rule: 64 / 40 at ≤1180 / 24 at ≤900). The pan distance had the same assumption (`clientWidth - 128`) and now reads the real padding; without that the pan ran 48px past its last screen.

**Verified:** 0px sideways scroll at nine widths 900–1680; before/after screenshots mid-carousel at 1150 and 1300 **pixel-identical**; pan lengths and card sizes identical at every width. The Stage 1 golden for this page is now a different length (copy rewrite) and was not usable.

**Also fixed in the same PR, found by Suchi on the preview: the carousels now fit the widest screen in a single look.** Card height came from the window height alone (`clamp(60vh, 360, 600)`) and never checked width, so on narrow screens every screen rendered 2 to 2.5 times wider than the strip (903px in 358px at 390). Each carousel now caps its shared height so its widest screen fits the strip (narrow) or the pan stage (wide). **Suchi's rule: a single screen should always fit the width on a phone or small window.** One height per carousel was her choice over per-screen fitting, accepting that the portrait screens in AI Governance come out about 135px wide on a phone (tap opens full size). Width is read with a `ResizeObserver`: the first measurement can happen while the page is hidden and returns 0, which collapsed every card to caption width. 1200px and up is pixel-identical before and after (A/B at 1300/1440/1680); 1150 shrinks about 4%.

**14 — Remaining motion.** Cross-page transitions as progressive enhancement; Work-on-blurred-Homepage with ESC and right-edge hover.

**15 — Image weight, full. DONE (2026-09-23), 15a + 15b. 15c and the CV decided against.**

*Measured first, on production, reading each page top to bottom:* Home, About, Work, Admin Shell and the short Check Access were already light (0.2–0.8 MB). The weight was in three pages: AI Trust Layer 4.8 MB, the long read 4.2 MB (1.77 MB of it before first paint), Release Notes 2.8 MB. The cause was image size, not format alone: AITL screenshots were 5760px wide for a card that displays at most ~1000px, and the long-read posters 7808px.

**15a — case-study screenshots to lossless WebP.** 26 images (AITL, Release Notes, the long read, and the three pillar posters shared with the short version). Suchi's call: **lossless**, so every pixel of the shipped image is exact; tested against lossy q90 on one screenshot (151 KB vs 106 KB), the gap was not worth any risk to small UI text. Images whose long side is over 3200px are resized to **2880px**, the full width of a 1440px laptop at 2x and the largest any lightbox shows them (AITL's lightbox is `maxWidth: 1280`, the long read's is full-window). 2880 cost only 5% more than 2560 in total. Images at or under 3200px keep their pixels, because **resizing an image only slightly over the cap made it bigger**: resampling a flat UI screenshot adds soft edges that lossless compression handles badly (gov-deploy-error: 133 KB PNG, 185 KB resized, 44 KB at original size).

**15b — homepage photo**, the one image on the first screen: 331 KB PNG → 200 KB lossless WebP. Lossy q92 only reached SSIM 0.987 on a photo, so lossless. Already exactly 2x its display size, not resized.

**`cwebp -exact` matters.** By default lossless WebP rewrites the colour under fully transparent pixels. Invisible, but not exact, and the homepage photo and the Option A/B images have real transparency. All 27 files now decode **pixel-exact** against their (resized) masters (PSNR inf).

**Pipeline:** PNG masters live in `masters/images/<public path>` (excluded from deploy by `.vercelignore`, same pattern as the video and About masters). `python3 tools/encode-screenshots.py` rebuilds every WebP; then `node tools/gen-image-dims.mjs`.

**Results, full read on the preview:** long read 4.2 → **0.8 MB**, AITL 4.8 → **2.8 MB**, Release Notes 2.8 → **1.6 MB**, homepage 0.6 → 0.5 MB, short Check Access 0.8 → 0.6 MB. `dist/` 25 MB → 16 MB. Homepage (1440, 390) and Release Notes pixel-identical to production at 2x; where resized screenshots display, 0.1–0.5% of pixels differ, all on text edges from the browser downscaling a different source, and not distinguishable in zoomed crops. No failed requests; the one empty `<img>` on the long read is the lightbox's placeholder, identical on production.

AITL fell less (about 40%) because most of its screenshots were never oversized, so lossless conversion is the only saving there. A near-lossless setting would take it further; not done, because Suchi chose zero loss.

**Decided against, 2026-09-23, Suchi's call:**
- **15c, long-lived caching for `/bundle/`.** Safe (hashed filenames), but it only saves two revalidation round trips on *repeat* visits and nothing on the first visit, which is the one that matters. Images keep the default `max-age=0, must-revalidate`; a long cache on non-hashed image names would serve stale screenshots after a replacement.
- **Compressing the CV.** It only downloads on click, so it never slows a page, and 1.47 MB is normal for a designed PDF. Left at full quality.
- **`srcset`.** After 15a it would only help phones, so it belongs with the mobile pass (item 19).

**Found by Suchi while reviewing, fixed here:** the long read's Option A and Option B screenshots had been swapped since the original export (`option-a` showed the folder tree, `option-b` the dropdown). The files were renamed so each name matches what it shows; the page code did not change.

**16 — Accessibility pass. AUDITED 2026-09-23, DEFERRED.** Full report: **[Portfolio accessibility audit](https://claude.ai/code/artifact/4460f0e4-832f-4f6a-a538-f8801fe315cc)**.

Audited against WCAG 2.2 AA on the `stage-2` preview: an axe-core scan of every page and stage frame, a keyboard-only walkthrough, and a code review. **Suchi's call: none of it is a blocker; take it up once the design-led changes are done** (after items 19, 8, 14, and before 12 + 20), and re-run the scan first because those changes will move things.

In one line each: **A** contrast, about 250 failures, nearly all the `--muted` grey (2.89:1 on `--bg`, needs 4.5), plus small `--accent` text (3.93), fixable as two token changes but a visible design call; **B** keyboard, the full-size screenshot viewer does not take focus, and two focus rings are missing; **C** structure, no `main`/`h1` on Home and About, the About radios lack a group, three skipped heading levels, one tab title for every page; **D** motion, the pillar videos and audit diagram ignore reduced motion; **E** alt text, four to reword and two icons to empty, wording is Suchi's. Already sound: alt text present everywhere, every control named, the contact overlay is a model dialog.

**17 — Dead code. DONE (2026-09-23).**

Both `datasync-*` entries removed from `PROJECT_DATA`, along with `NEXT_HREF` and the fallback branch of `NextProject` that only existed to serve them. Check Access is the only page `ProjectDetailPage` renders, so its next project (002, AI Trust Layer) is now written directly. 139 lines out.

**Verified:** golden parity at 1300 on framed Check Access, `/work` and the framed long read is identical to the pixel with and without the change (A/B by stash, run twice). In the stage, NEXT PROJECT still hands focus to the AI Trust Layer card without navigating the iframe, no page errors.

**18 — Analytics, actually read.** Once applications are out: which case studies get opened, how long people stay, where they bounce. A quiet advantage most candidates don't use.

**19 — Mobile view, as one pass.** *Scope decided 2026-08-19: this is a single piece of work, taken up whole, not a drip of breakpoints added while doing something else.*

Items 1 and 2a/2b fixed the two things that were outright broken — a blank `/about` and two sideways-scrolling Check Access pages. Everything else about how this site behaves on a phone lands here, deliberately unfixed until it can be designed rather than patched.

**Still overflowing at 390** (measured 2026-08-19, moved here from item 2c): `/work/admin-shell` 228px, `/work/ai-trust-layer` 94px, `/work/release-notes` 81px. *(2026-09-23: on AI Trust Layer the 94px is the NEXT PROJECT / 003 footer link, not the carousels, which now fit.)* All three are the same `1fr` min-content defect that 2a and 2b fixed, so the mechanical remedy is known and cheap — it is being held back on purpose, not for lack of a fix. *(AITL's 900/1150 overflow is not in this bucket — see item 2c.)*

**And the rest:**

- `.designer`'s inline `width: 254px` beats the `max-width: 340px` mobile rule, so the column is narrow — conspicuous at 768, where content occupies the left third of the screen. Authored in Stage 1; removing the inline width switches the rule on, which is a visible change and therefore Suchi's call.
- `.mobile-stack`'s cream background stops at the content edge, leaving a grey band below it at both 390 and 768.
- The new mobile toggle row's spacing, gap and 12px label size were set once and screenshot-approved, not designed against the rail's rhythm.
- `.lyrics` keeps its 300px `max-height` and its inner scroll on touch — a nested scroll region inside a scrolling page. Overlaps item 10.
- The two `role="radio"` buttons have no `role="radiogroup"` parent, on both compositions. Overlaps item 16.
- Item 13's anchor tuning is the same kind of work one band up. The AI Trust Layer defect in that band is fixed (item 13); the rest is optional.
- The long read's phone rhythm. Item 2b stops it overflowing mechanically; how it should read at 390 — type scale, section rhythm, where the reels sit — is design work and lands here, not there.
- The long read's missing sidebar on mobile, moved here 2026-08-19 from item 3. Below 900 a slug renders the case study directly (not the stage), so there is no rail on any width there regardless of the `is-fullscreen` question item 3 is deciding for desktop — a phone visitor to this page has `← BACK` / `NEXT PROJECT` only, full stop.

**20 — The link-preview card, designed.** *Deferred 2026-09-23 with item 12, after the design-led pieces.* Item 5 ships a 1200x630 render of the homepage as `og:image`. It is honest and it beats a bare URL, but it is a screenshot, not a card: at preview size the body copy and pills are unreadable, and the composition was laid out for a 100vh screen rather than a 1.91:1 crop.

Suchi is supplying a design. When it lands: export at 1200x630, replace `public/og-image.png`, and update `og:image:alt` in `index.html` to describe the card rather than the homepage. Nothing else changes — the meta plumbing, dimensions and absolute URL are already in place.

*A first attempt built from the site's tokens (wordmark, DESIGN TECHNOLOGIST lockup, rail labels, metadata block) was rejected 2026-08-19; it is not in the repo.*

**Fixed 2026-08-21, found by Suchi in the live build:**

**Check Access short version — the three pillar walkthroughs are wired.** `CheckAccessSolutionSection` carried `pillarSrcs = [null, null, null]` with a "until wired up" comment; the three MP4s existed at the repo root and mapped 1:1 to the pillars by name. Clicking a pillar now plays its own walkthrough. The `<video>` also needed `muted`, `playsInline`, `loop` and a `poster` — a bare `src` renders a blank frame that never plays. `preload="metadata"`, so nobody who does not click a pillar downloads three videos. Two consequences worth knowing: the frame's "PLACEHOLDER · PRODUCT SCREEN" label swaps to the pillar's name while a real screen is playing (leaving it would tell a recruiter the work is unfinished), and the written stand-in description is hidden while playing, because it described the very thing now visible and rendered as unreadable dark text over the footage.

**A card no longer reopens on the long read after you navigated back. REGRESSION FROM ITEM 3, introduced here and fixed here.** The stage records which page a card is showing from the iframe's document `load` event. Following the link *into* the long read is a plain `<a>`, so it is a real document load and records itself. Item 3 replaced `← BACK`'s `history.back()` — which popped to a real document load, and re-recorded as a side effect — with a client-side `navigate()`. No document is replaced, so the stage never learned the card came back, and `work:frame:check-access` stayed pointing at the long read forever: leaving `/work` and returning restored the long version. The long read now posts a `work:frame` message on back-navigation, and the stage applies it through the same guard `frameSrc` uses (the card's own route or a segment below it, because the value ends up in an iframe `src`).

**21 — Readable without JavaScript. DONE (2026-10-15) on `stage-2`, five commits (`7148736`, `cc8560d`, `92f16c8`, `73f1eef`, `e195674`). Not yet deployed.**

**What was wrong.** The site is a React app, so the HTML the server sends is an empty shell and everything a visitor reads is drawn by JavaScript in their browser. Anything that fetches a page without running JavaScript got a blank page: AI fetch tools (someone asking ChatGPT or Claude about the site), AI crawlers, and the screeners in hiring systems that open a portfolio link. People see the site fine; machines that read on someone's behalf saw nothing.

**How it was found.** Investigating a Zscaler block at Piramal. That block was a separate problem, a categorization issue, and was handled outside the repo with Zscaler, Cloudflare, Broadcom, Cisco Talos and FortiGuard. Nothing here fixes it and nothing here was needed for it; the blank page was found along the way.

**What was done.**

- **A "reading copy" of every page, generated at build time.** `tools/reading-copy.mjs` opens the built site in headless Chromium (through Playwright), reads each route in `src/routes.js` at 800px, and flattens what is on screen into plain HTML: one `h1` per page, sections and subheadings, links, and each image's description. Nothing is hand-written, so the copy cannot drift from the pages. Interface hints are left out, About is read in both branches (THE DESIGNER and THE PERSON), and AI Trust Layer's system map is read from its drawing. Admin Shell is not in `src/routes.js`, so it cannot reach the output.
- **Each route has its own file.** `tools/postbuild.mjs` writes one HTML file per route (`about.html`, `work/ai-trust-layer.html`, and so on) with that page's copy inside the app's root element, and the `vercel.json` rewrites point each route at its file instead of `index.html`.
- **Visitors never see it.** A style in `<head>` hides the copy before anything is drawn, and React replaces it when the app starts. Images in the copy sit inside `<noscript>`, because without that the browser downloaded every image React removed (AI Trust Layer went from 4 image downloads to 17). A browser with JavaScript switched off shows the copy, through the same `<noscript>`.
- **Chromium runs in Vercel's build.** Vercel's build machine is missing two libraries Chromium needs (NSS and NSPR), so the build installs them first, only when it is running on Vercel, then installs Chromium. Measured on a preview build on 2026-10-15. **The build fails if the copy cannot be generated**, so a broken step stops the deploy rather than quietly shipping blank pages.
- **Each page names its own address.** Every route's file starts as a copy of `index.html`, so after the step above every case study told Google its real address was the homepage. The build now rewrites `canonical` and `og:url` in each file to that page's own address, and fails if any file gets it wrong. This is part of item 12; title, description and `og:image` stay site-wide, deferred with item 20.
- **`robots.txt` and a sitemap.** `public/robots.txt` lets every search engine and AI assistant read the whole site by default, so there is no list of chatbots to keep up to date. Only crawlers that collect pages to train AI models are asked to stay out: GPTBot, ClaudeBot, anthropic-ai, CCBot, Google-Extended, Applebot-Extended, Meta-ExternalAgent, Bytespider, cohere-training-data-crawler. `dist/sitemap.xml` is written by the build from the route list, so it lists the 8 public pages and can never list Admin Shell; the build fails if `robots.txt` points at any other sitemap address. *Open caveat:* Google's documentation is unclear on whether `Google-Extended` also keeps the site out of answers in the Gemini app, not just out of training. If Suchi wants Gemini fully in, deleting that one line is the fix.
- **Copy fixes found while reading every page as plain text.** Hyphens used as dashes on Home, AI Trust Layer and the Check Access long read became a colon, comma and colon. Admin Shell's request-access email subject had an encoded em dash, now a colon. "Artefact" became "Artifact" in the Check Access audit diagram. Release Notes' before-screenshot alt text said 2022, now 2023 to match its caption and the screenshot. The Check Access evolution icons got empty alt text, since they are decorative. `check:copy` now also catches percent-encoded em dashes and "artefact".

**Verified,** locally, against the same build without the reading copy: full-page screenshots at 1440, 1300, 900 and 390 are identical apart from motion, and that motion difference is the same size as comparing today's build with itself. Zero extra image downloads, no new page errors, `npm run check:copy` passes.

**Deploy.** *Preview checked 2026-10-15* (`stage-2` at `e195674`, https://portfolio-9t8rtb69q-suchi2.vercel.app): the Vercel build passed, which means Chromium ran there and every build check held; all 8 routes return 200 with their reading copy, one `h1` and their own `canonical`, including `/work/check-access` beside its `/full` sub-page (the one thing only Vercel could confirm); `robots.txt` and `sitemap.xml` are served; `/banana`, `/work/banana` and `/work/check-access/banana` are 404; `/about/` 308s to `/about`; in a real browser at 800 and 1440 the copy is gone after start (including inside the stage iframe), there are no console errors, and Vercel Analytics loads. Also noted: `/about.html` (and each route file) answers directly as a second address; nothing links to it and its canonical names `/about`, so it is left as optional tidying. *Production: pending,* until the pull request into `main` is merged.

*For whoever works here next:*

- **Adding a page now takes two edits:** the route in `src/routes.js`, and a rewrite in `vercel.json` pointing at its own `.html` file (not `index.html`). The build names the missing or wrong rewrite if you forget.
- **`tools/postbuild.mjs` cannot be re-run on a `dist/` that has already been built.** Run the full `npm run build`.
- **To read the copy yourself:** build, then `node tools/reading-copy.mjs`, which writes a local preview to `reading-copy-preview/` (not committed).
- The sitemap takes its domain from the `canonical` link in `index.html`. If that tag's shape changes, check the sitemap step in `tools/postbuild.mjs`.
- `dist/404.html` keeps the homepage's address in its `canonical`. Deliberate and harmless: it is copied before the per-page rewrite, and a 404 page has no address of its own.

---

## Documentation debt. DONE (2026-09-23)

*All nine are now in `PROJECT_CONTEXT.md` under "From the React migration", together with the two approved Stage 1 divergences (italic 700, reserved rail gutter). The list is kept below for reference.*

Eight decisions were made mid-migration and exist only in commit messages. They belong in `PROJECT_CONTEXT.md` under *Decisions that will look wrong from outside*, because a future session will otherwise try to "fix" them:

1. `useProjectShell({ responsive: false })` — a per-page opt-out from the shared responsive stylesheet, used only by the long read, because `main h1 { font-size: 80px !important }` would resize its hero.
2. `/work/:slug?` as one route rather than five, so the stage never unmounts and its iframes never reload.
3. URL updates use `replace`, not `push`, so back leaves Work in one press instead of retracing every card.
4. sessionStorage keys `work:fs`, `work:scroll:<path>`, `work:frame:<cardKey>` — scroll keyed by framed *path*, not card, so the long read doesn't restore onto the short version.
5. Four unreachable `nativeFsRef` branches dropped in the port; two `exitFullscreen` calls kept.
6. `LeftRail` gained `background: var(--bg)` and `z-index: 40`, carried from the long read's hand-written rail — affects all five case studies.
7. **Below 900px a slug renders its case study, not the stage** — otherwise the mobile list's links lead back to the mobile list. The least obvious of the eight and the most likely to be "corrected."
8. The `frameSrc` guard — stored paths validated as the card's own route or a segment below it, because that value goes into an iframe `src`.
9. **About's `shownMode` is derived, not stored** — `mode` still starts `null` and only a tap writes it. The obvious "simplification" is `useState("designer")`, and it is wrong: it deletes the authored desktop null state and moves `/about` away from the Stage 1 reference at every measured width. Added 2026-08-19 with item 1.

Also outstanding, logged not fixed: the hero type-scale inconsistency (short renders 80px at 1150 where long renders 92px, predating the port), and the F11 fullscreen-exit question.

---

## Sequence

1. Gate 0, in order. Promote. Delete `legacy/`.
2. Items 1–4 — correctness.
3. Items 5–7 — first impression.
4. Items 8–9 — positioning.
5. **Apply.**
6. Everything below the line. **Order set 2026-09-23:** design-led pieces first (item 19 mobile, item 8 colophon, item 14 motion), then accessibility (item 16, from the [audit doc](https://claude.ai/code/artifact/4460f0e4-832f-4f6a-a538-f8801fe315cc)), then search and sharing (item 12 with item 20). Item 18, analytics, is read whenever enough data exists.

Steps 1–4 are days, not weeks. Nothing above the line is large; several are under an hour. The hard part is step 5, and it is hard for psychological reasons rather than technical ones.
