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

**One exception is not cosmetic and does not belong in a mobile pass:** AI Trust Layer overflows at **900 and 1150**, inside the band the audit called clean. That is a desktop defect, and it is item 13's problem, not item 19's.

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

*Also checked and left alone:* `MIGRATION_BRIEF.md` records the Stage 1 deploy target as a `*.vercel.app` subdomain — historically accurate, not a live reference. **No `robots.txt` or `sitemap.xml` exists** in `public/` or at root, so neither carried a stale absolute URL. A sitemap would help Search Console and pairs naturally with item 12's prerendering; not created here.

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

**11 — Soft-404.** `vercel.json` rewrites every unmatched path to `index.html` with status 200, so React Router renders the 404 page correctly for humans while crawlers see a soft-404. Cosmetically fine, technically wrong. Fix when convenient.

**12 — Per-route meta and link-preview prerendering.** So each case study previews with its own title and thumbnail rather than one shared card.

**13 — Anchor tuning, 900–1440.** The audit found this band clean on the React build — no overflow, no blank content, on any route. The previously flagged 900px `<main>` squeeze was caused by a temporary `is-fullscreen` class and does not reproduce. This item is now optional refinement, not repair.

**14 — Remaining motion.** Cross-page transitions as progressive enhancement; Work-on-blurred-Homepage with ESC and right-edge hover.

**15 — Image weight, full.** `srcset` across the site; the six PNGs over 700KB re-encoded; the two ~1.7MB video posters to WebP; the 1.37MB CV compressed.

**16 — Accessibility pass.** Alt text on case-study images, contrast on the muted greys, keyboard navigability. Being asked about accessibility in an interview with a failing site is a bad look.

**17 — Dead code.** `PROJECT_DATA` carries ~110 lines for `datasync-design-system` and `datasync-onboarding`, which have no page, route or card. `NEXT_HREF` has one entry nothing reads, shadowed by `OVERRIDE`.

**18 — Analytics, actually read.** Once applications are out: which case studies get opened, how long people stay, where they bounce. A quiet advantage most candidates don't use.

**19 — Mobile view, as one pass.** *Scope decided 2026-08-19: this is a single piece of work, taken up whole, not a drip of breakpoints added while doing something else.*

Items 1 and 2a/2b fixed the two things that were outright broken — a blank `/about` and two sideways-scrolling Check Access pages. Everything else about how this site behaves on a phone lands here, deliberately unfixed until it can be designed rather than patched.

**Still overflowing at 390** (measured 2026-08-19, moved here from item 2c): `/work/admin-shell` 228px, `/work/ai-trust-layer` 94px, `/work/release-notes` 81px. All three are the same `1fr` min-content defect that 2a and 2b fixed, so the mechanical remedy is known and cheap — it is being held back on purpose, not for lack of a fix. *(AITL's 900/1150 overflow is not in this bucket — see item 2c.)*

**And the rest:**

- `.designer`'s inline `width: 254px` beats the `max-width: 340px` mobile rule, so the column is narrow — conspicuous at 768, where content occupies the left third of the screen. Authored in Stage 1; removing the inline width switches the rule on, which is a visible change and therefore Suchi's call.
- `.mobile-stack`'s cream background stops at the content edge, leaving a grey band below it at both 390 and 768.
- The new mobile toggle row's spacing, gap and 12px label size were set once and screenshot-approved, not designed against the rail's rhythm.
- `.lyrics` keeps its 300px `max-height` and its inner scroll on touch — a nested scroll region inside a scrolling page. Overlaps item 10.
- The two `role="radio"` buttons have no `role="radiogroup"` parent, on both compositions. Overlaps item 16.
- Item 13's anchor tuning is the same kind of work one band up — and note item 2c found the 900–1440 band is *not* clean on AI Trust Layer, so item 13 is no longer purely optional.
- The long read's phone rhythm. Item 2b stops it overflowing mechanically; how it should read at 390 — type scale, section rhythm, where the reels sit — is design work and lands here, not there.
- The long read's missing sidebar on mobile, moved here 2026-08-19 from item 3. Below 900 a slug renders the case study directly (not the stage), so there is no rail on any width there regardless of the `is-fullscreen` question item 3 is deciding for desktop — a phone visitor to this page has `← BACK` / `NEXT PROJECT` only, full stop.

**20 — The link-preview card, designed.** Item 5 ships a 1200x630 render of the homepage as `og:image`. It is honest and it beats a bare URL, but it is a screenshot, not a card: at preview size the body copy and pills are unreadable, and the composition was laid out for a 100vh screen rather than a 1.91:1 crop.

Suchi is supplying a design. When it lands: export at 1200x630, replace `public/og-image.png`, and update `og:image:alt` in `index.html` to describe the card rather than the homepage. Nothing else changes — the meta plumbing, dimensions and absolute URL are already in place.

*A first attempt built from the site's tokens (wordmark, DESIGN TECHNOLOGIST lockup, rail labels, metadata block) was rejected 2026-08-19; it is not in the repo.*

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
9. **About's `shownMode` is derived, not stored** — `mode` still starts `null` and only a tap writes it. The obvious "simplification" is `useState("designer")`, and it is wrong: it deletes the authored desktop null state and moves `/about` away from the Stage 1 reference at every measured width. Added 2026-08-19 with item 1.

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
