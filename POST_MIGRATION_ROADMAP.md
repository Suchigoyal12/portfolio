# Portfolio — Post-Migration Roadmap

**The organising fact:** the portfolio link goes out with every job application, and applications haven't started yet. So the backlog isn't one list — it's two. Things that must be true before a recruiter sees the site, and everything else, which happens *while* applications are already out.

The goal is not to finish the backlog before applying. It's to reach a state you'd be proud to attach to an application, apply, and keep improving in parallel. A designer who waits for a perfect portfolio applies months late; a designer who ships a strong-but-improving one applies now.

---

## The line

Everything above the line blocks applying. Everything below it does not. Be ruthless about what goes above — most things don't belong there.

### Above the line — before you send a single application

**1. Direct-link navigation on project pages.** This is the one true blocker. Right now a project page opened from a direct URL has no navigation — no way back, no contact. Every application you send *is* a direct link to your work. A recruiter clicking through from your résumé lands on a page with no way out. This has to work before anything goes out.

**2. The two Admin Shell copy fixes**, if Claude Code hasn't already done them: the "shared under password" line and the "04 · Full Case Study" rail label that now leads to a mailto. Wrong-on-screen text a recruiter will read.

**3. Favicon.** A blank tab icon reads as unfinished. Fifteen minutes.

**4. A basic responsive sanity pass.** Not the full 900–1440px anchor tuning — just confirming the site doesn't visibly break at common laptop widths and on a phone. Recruiters open links on phones constantly. It doesn't need to be perfect on mobile; it needs to not look broken.

**5. Custom domain.** You want one, and it's worth having before you apply — `suchi.design/work` on a résumé reads very differently from `portfolio-v4.vercel.app`. It's a small job and it changes the first impression. Do it in this push.

That's the whole above-the-line list. Five items, none of them large. This is what "ready to apply" means — not the person branch, not animations.

### Below the line — while applications are out

Everything else. The site is live and being sent; these make it better without holding up the thing that matters.

---

## After you're applying — ordered by value

### Phase 1 — Finish the About person branch

Your instinct to prioritise this is right; it's just below the line, not above it, because a strong About-designer branch already carries you and the person branch is additive.

**Blocked on your final voiceover recording** — that's your work, not the build's. The rough cut you have lets everything else get built and timed approximately; the final recording locks it.

Sequence once the final VO exists:
- Swap the real recording in behind the `USE_AUDIO` flag
- Replace placeholder cue timings with real ones, tuned to the actual audio
- Verify lyrics-panel scroll sync against the real recording
- Confirm `personTeardown()` restart-from-zero behaviour still reads correctly with real audio
- Check slow-connection and pause/resume behaviour

The designer-branch image system and person-branch collage are separate, and stay deferred below even this — the branch works without them.

### Phase 2 — The polish pass

The responsive and weight work, done properly this time rather than the sanity pass above:
- 900–1440px crowding — anchor tuning to ~1300, then uniform scale to 900
- Image weight and asset optimisation — matters for load time, which matters for recruiters on slow or mobile connections
- Left-nav active state backported to project pages

### Phase 3 — The motion work

This is the reason React happened, and it's genuinely worth doing — it just comes after the site is working and being seen, because motion is invisible to an application still sitting in someone's inbox.
- Cross-page transitions as progressive enhancement
- The tab-travel indicator between Homepage and About
- The Work-overlaid-on-blurred-Homepage concept
- `prefers-reduced-motion` throughout — non-negotiable whenever motion ships

### Later / maybe

- AI Experiments page — design it first, then build. Only if you have experiments worth showing; an empty section is worse than none.
- Link-preview prerendering — so a pasted link shows a proper card on LinkedIn and Slack. Genuinely useful for a job search, but not visible on the site itself. Worth doing during Phase 2 if it's cheap.

---

## Portfolio best-practice items worth adding

These aren't on any prior list, and a few are the kind of thing that quietly costs interviews. Ordered by how much they matter for hiring.

**Above the line — do these before applying:**

- **A résumé/CV link that works.** Recruiters look for it within seconds. If your portfolio doesn't offer an obvious way to get your CV or contact you, that's friction at exactly the wrong moment. Confirm the contact overlay covers this, or add a CV link.
- **Meta tags and a page title.** The audit noted no page sets a title beyond charset, no `og:image`, no description. This means: a nothing title in the browser tab, and a blank grey box when your link is pasted anywhere. For someone whose link gets pasted into ATS systems, LinkedIn messages and Slack, this is worth more than it sounds. A title and description per page is small; the `og:image` can wait for prerendering.

**Below the line — while applying:**

- **Analytics, actually read.** You enabled Vercel analytics. Once applications are out, watch which case studies get opened and how long people stay. If everyone bounces off one project, that's signal. This is a quiet advantage most candidates don't use.
- **A 404 page.** Right now a mistyped URL gives a default error. A simple branded 404 with a link home is a nice touch and cheap. Not urgent.
- **Accessibility basics.** Alt text on your case study images, sufficient colour contrast on the muted greys, keyboard navigability. As a designer, being asked about accessibility in an interview and having your own site fail it is a bad look. Worth a pass during Phase 2.
- **Loading performance check.** Run the live site through a tool like PageSpeed once. Not to chase a perfect score, but to catch anything egregiously slow, which usually means an unoptimised image — which Phase 2 handles anyway.

---

## What I'd actually do

1. Finish the five above-the-line items. Days, not weeks.
2. Add the two best-practice above-the-line items — CV access and meta tags.
3. **Apply.** The site is strong and honest and works. Send it.
4. Record the final voiceover and finish the person branch (Phase 1).
5. Polish pass (Phase 2), best-practice below-the-line items folded in.
6. Motion (Phase 3) — the fun part, earned.

The hardest part of this plan is psychological, not technical: applying before the person branch and the animations are done. But those are the parts only you notice. The parts a recruiter notices — does it work, does it load, can I reach her, does it look finished — are all above the line and all small. Ship at "strong," improve toward "exceptional" while the applications are already working for you.

---

## One question that changes Phase 3

Whether the motion work is worth its risk depends on how much you're leaning on "design technologist" in your applications. If the roles you're targeting care that you can build, the animations are portfolio content — proof, not polish, and worth doing sooner. If you're targeting pure product-design roles, they're lower-value and can wait indefinitely. Worth deciding as you see what you're applying to.

---

## Logged during Stage 2 — for the replacement plan

*Appended, not merged. Nothing above this line was read, revised or acted on;
this file is still marked out-of-date and awaiting the replacement plan. These
are findings from the migration that need somewhere durable to live so they
survive into that discussion.*

**Unify the hero type scale across all case studies.** The four React case
studies load `RESPONSIVE_CSS` from `site/shared.jsx`, which sets
`main h1 { font-size: 80px !important }` below 1180px and 56px below 900. The
long Check Access page was hand-written HTML, never loaded it, and sizes its
hero with `clamp(56px, 8vw, 108px)` instead. Measured on the deployed Stage 1
site, at the same viewport:

| Viewport | Short Check Access | Long Check Access |
|---|---|---|
| 1440 | 108px | 108px |
| 1300 | 104px | 104px |
| 1150 | **80px** | **92px** |
| 900 | **56px** | **72px** |

**The inconsistency predates the port and was carried across deliberately** —
the Stage 2 rule is that anything that looks different is a regression, so the
long page keeps its own scale via `useProjectShell({ responsive: false })`.
Deciding which of the two scales is right is a design decision and belongs
here, not in the migration. Whichever wins, the fix is one of: fold the long
page into the shared stylesheet, or lift the `clamp()` into it for everyone.

**Related, and probably the more urgent half:** those same overrides are broad
attribute selectors — `main h1`, `aside[style*="100vh"]`,
`section[style*="1fr 1fr"]` — matching by inline-style substring. They are
brittle in a way that only shows up when something new happens to match. Worth
replacing with real class names in the same pass.
