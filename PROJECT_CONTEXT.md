# Portfolio v4 — Project Context

*Written as a handoff document. It carries the intent behind the portfolio, the decisions already settled, and the reasoning behind the ones that look arbitrary from outside. It is not a build plan — the migration brief covers that.*

---

## Who this is for

Suchi. Product, visual and motion designer. Positioning: **design technologist** — someone who designs and builds, where the building is part of the design practice rather than a separate skill listed underneath it.

Previously Associate Product Designer at UiPath on the admin platform team. Started as the most junior of three designers and ended up owning the surface solo. That arc matters: it is the through-line of the portfolio, and it is why attribution accuracy is treated as non-negotiable rather than as modesty.

The portfolio exists to get hired. The audience is hiring teams — design leads, design directors, occasionally a founder. It is a live job search, not a passive presence.

---

## What the portfolio is trying to be

A hand-coded site that demonstrates the positioning rather than asserting it. The claim "design technologist" is made by the artifact itself: the site is built, not assembled from a template, and the craft is visible in how it behaves.

The editorial register is deliberate — this reads as a publication, not a portfolio template. Cream paper background, serif display type, monospace metadata, a FIG. notation system, a metadata rail. The reference points are print editorial and technical documentation, not Dribbble.

Motion lives on interaction, not on arrival. There is no entrance animation, and that absence is a decision: a choreographed load sequence reads as junior. Restraint reads as senior.

---

## The work

Four case studies, all from UiPath.

**Check Access** — unifying fragmented permissions. Exists in a short version and a longer, deeper version linked from inside it. Satiswar Dash owned V0 and Private Preview; Suchi's ownership begins after that point and the case study says so.

**AI Trust Layer (AITL)** — context grounding, BYO LLM, audit export, AI governance. Paresh Joshi was design director and Suchi's manager on this. Zach Eslami and Bogdan Zavera were the PMs.

**UiPath Admin Shell** — re-architecting the admin surface. 2024–2025. **Designed and specced, not shipped.** The case study must not imply otherwise. Co-led with Satiswar Dash; Suchi owned navigation components, page templates, and design system explorations. Exists as a public version and a detailed version that is not published.

**Release Notes** — product release communication.

Sorin Visan (PM) was a peer collaborator and is a recommendation contact.

---

## Standing principles

These govern decisions and have held consistently. Several look like constraints from outside; each exists for a reason.

**Credibility over decoration.** The single governing principle. Honest attribution, no overclaiming in tool lists, no metrics that can't be stood behind, no animation that doesn't earn its place. Everything below is downstream of this.

**Verifiable facts lead; targets are labelled as targets.** The coral percentage grid signals measured achievement. Putting unverified goals into that format borrows credibility the numbers haven't earned. Shipped scope, timeline and GA status lead the Impact section; success criteria go in a visually separate sub-block, clearly labelled.

**No confession register.** Portfolio writing is a showcase, not interview preparation. Difficulty and constraint can be described; self-deprecation and hedging cannot. Confident and non-defensive throughout.

**Thumbnails must be legible at a glance.** No abstract meaning-encoding, nothing that requires decoding to understand.

**Cross-version consistency.** Where a project has a short and a long version, ownership and attribution claims must match exactly between them.

**`DESIGN_SYSTEM.md` is the source of truth.** All token values come from it. It is not restated elsewhere, and it does not get quietly diverged from.

---

## How to work with Suchi

**One change per prompt, screenshot-gated.** Bounded scope, verify, then move. Not because of caution for its own sake — because unbounded changes make it impossible to attribute a regression.

**Report before edit.** Audit and surface findings before touching a live file. Mock-only preview iteration is lighter and doesn't need this gate.

**Two to three options with rationale, ranked.** Not a single recommendation pushed through. The choice stays hers.

**Sequential approval on multi-part builds.** One deliverable approved before the next begins.

**Locked surfaces stay locked.** Resolved decisions are not re-litigated. If something is described as intentional, treat it as intentional and move on.

Writing voice for anything drafted in her name: terse, fragment-heavy, confident, no ornate flourishes. Education as a quiet sign-off, not a headline.

---

## Where the project stands

Design work in Claude Design is **complete for MVP**. The site is nine pages of hand-coded HTML, CSS and browser-run React. It works.

The next phase is technical, in Claude Code:

1. Export from Claude Design into a private GitHub repo
2. Deploy the static site as-is to Vercel — live URL, shareable during the job search
3. Convert to a React application with a proper build step
4. Then, and only then, the animation and interaction work the migration was undertaken for

There is a separate migration brief covering all of this in detail. It should be treated as authoritative on sequencing.

---

## Decisions that will look wrong from outside

A fresh reader will be tempted to correct several of these. All are deliberate.

**Every surface keeps its own URL.** Homepage, Work, About and each case study remain independently addressable and shareable. The move to React removes page *reloads*, not page *addresses*. This is not becoming one long scrolling page, and a case study must always be linkable on its own.

**The migration is structural only.** Known issues — 900–1440px crowding, image weight, the person-branch collage — stay unfixed until the React version is deployed and verifiably identical to the static one. Mixing "make it work" with "make it better" destroys the ability to attribute a regression.

**Release Notes is built differently** to the other case studies — no section rail, no overview block. Intentional. Do not normalise it.

**The six project pages have no contact affordance.** Intentional. Contact is an overlay reached from the Homepage, About, or Work.

**There is no AI Experiments page.** The concept was never designed and has been removed from the navigation. Do not create a stub for it.

**The detailed Admin Shell case study is not published.** It stays in the private repo and is excluded from the deployed build. It contains material that isn't cleared for a public URL. The public version of the project remains in the Work stack.

**The `USE_AUDIO` flag pattern is correct, not dead code.** A boolean drives a synthetic timeline so the About page's voiceover behaviour works before the recording exists. One flag swap at deploy, identical layout, no rebuild. The same pattern applies to the video reels. Do not "simplify" these by removing the flag.

**Scaling reference widths must match exactly.** The `fit()` system uses a 1300px reference. Homepage and About both use it, and cross-page positional continuity depends on the reference being identical. It is not a number to tidy.

### From the React migration

These were decided mid-migration and used to live only in commit messages.

**The long read opts out of the shared responsive stylesheet.** `useProjectShell({ responsive: false })` is used by that one page only, because the shared `main h1 { font-size: 80px !important }` would resize its hero.

**`/work/:slug?/:sub?` is one route, not five.** Keeping every case study under a single `<Route>` means the stage never unmounts, so its four iframes never reload when you switch cards. Do not split it into per-page routes.

**URL updates on Work use `replace`, not `push`.** One press of the browser's back button leaves Work, instead of retracing every card the visitor looked at.

**sessionStorage keys are `work:fs`, `work:scroll:<path>` and `work:frame:<cardKey>`.** Scroll is keyed by the framed *path*, not the card, so the long read's scroll position is never restored onto the short version.

**Four unreachable `nativeFsRef` branches were dropped in the port; two `exitFullscreen` calls were kept.** Fullscreen is in-page only by design. Do not restore native `requestFullscreen()`.

**`LeftRail` carries `background: var(--bg)` and `z-index: 40`.** Carried over from the long read's hand-written rail. It affects all five case studies.

**Below 900px a slug renders its case study, not the stage.** Otherwise the mobile list's links lead straight back to the mobile list. This is the least obvious decision here and the most likely to be "corrected."

**`vercel.json` lists every route by hand, and unknown URLs return a real 404.** Only the real routes are rewritten to `index.html`; everything else gets `dist/404.html` (a copy of the app, so visitors still see the site's own NotFound page) with a 404 status. A catch-all rewrite looks simpler and is wrong: it answers 200 for every mistyped URL, which search engines count as a soft-404. A new route needs a rewrite line; `tools/postbuild.mjs` fails the build if one is missing. Roadmap item 11.

**The `frameSrc` guard is a security check, not tidiness.** A stored or URL-seeded frame path is accepted only if it is the card's own route or a segment below it, because that value ends up in an iframe `src`.

**About's `shownMode` is derived, not stored.** `mode` starts `null` and only a tap writes it; below 900 a null mode *displays* as THE DESIGNER. The obvious simplification, `useState("designer")`, is wrong: it deletes the authored desktop first paint (two unselected radios, a choice to make) and moves `/about` away from the Stage 1 reference at every measured width.

### Approved differences from Stage 1

Parity was the goal for the migration gate, not for the site. These two differences are deliberate. Do not "restore" them to match the reference.

**Cormorant Garamond requests a true italic 700.** Stage 1 only loaded italic 400, so bold italic was synthesized. The real weight moves framed Check Access to about 0.019% and keeps `/work` at about 2.3% at 900 (a line break shifts). Matching the reference would degrade 13 elements across the site.

**Every rail link keeps a reserved gutter.** Stage 1 indented only the active link, so the labels jumped 14px sideways on every navigation. With the travelling marker (roadmap item 9) the labels have to hold still. This costs about 0.04% on Homepage and About.

---

## Open threads

**Homepage ⇄ Work transition: built, not yet live.** The queued blurred-overlay concept was replaced after two motion studies by "pile to grid": the Homepage scrolls away under a fixed rail, the cards land as a pile and deal into a `/work` grid, and a card opens into the Stage Manager. On branch `work-transition`; roadmap item 14 has the record, DESIGN_SYSTEM §4.8 the spec.

Everything else still open lives in `POST_MIGRATION_ROADMAP_V2.md`, below the line.

**Resolved since this file was written:**
- *About voiceover recording.* Recorded and live, `USE_AUDIO` is `true`, synthetic timeline kept as the fallback. Roadmap item 10.
- *Project pages opened by direct URL had no navigation.* Direct links now open inside the stage, and a long-read link opens fullscreen with its table of contents. Roadmap item 3.
- *Left-nav tab travel animation.* Shipped at 280ms, out-quart (chosen over ease-out-expo on a live comparison), with `prefers-reduced-motion` support. Roadmap item 9.

---

## Tools

- **Claude Design** — original build environment. Work here is complete.
- **Claude Code** — migration, deployment, everything after.
- **Figma (Portfolio '26)** — design source.
- **Jitter** — motion export.
- **Vercel** — deployment. Free tier, private GitHub repo, analytics enabled.
- **`DESIGN_SYSTEM.md`** — token source of truth. Travels with the code.
