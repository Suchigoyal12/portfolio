# Portfolio

Hand-coded portfolio site, exported from Claude Design. This is the MVP. Currently deploying the static site as-is (Stage 1). React conversion comes after (Stage 2).

Refer to this project as **Portfolio**. Not "v4" — that was exploratory-phase versioning and is retired.

**`MIGRATION_BRIEF.md` is authoritative. Read it before any work in this repo.** This file is the short version of what must not happen.

Suchi is a product designer, not a developer. Explain decisions in plain language. Don't assume familiarity with tooling, build systems, or git.

---

## The governing rule

Nothing in Stage 1 changes what a visitor sees or how the site behaves. The work is entirely internal.

**Anything that looks different is a regression, not an improvement.** If achieving parity appears to require changing the design, stop and ask.

## Permitted changes in Stage 1 — closed list

1. Remove `tweaks-panel.jsx` (script tags and mount calls)
2. Replace the Admin Shell passcode field with static text
3. Add the three converted video reels and flip the flag
4. Normalize filenames

Nothing else. If it isn't on this list, it isn't a Stage 1 change.

## Do not fix

These look wrong. They are staying until Stage 2.

- The dead `NAV` array, `TopNav`, `SiteFooter`
- The four unrendered component files loaded by Check Access (`page-home`, `page-works`, `page-about-process`, `page-rest`)
- Dead `NEXT_HREF` entries pointing at `project-design-system.html` / `project-onboarding.html`
- The temporary `is-fullscreen` class on Check Access's `<body>`, despite its "remove before ship" comment
- The `contact (old).html` fallback href on the Contact rail item
- The `Scope Seperation` misspelling — correct it in all three places at once or not at all. Not at all is fine.

## Do not touch — these are intentional

- `USE_AUDIO = false` drives a synthetic timeline. It is not dead code. Same pattern for the video reels. Do not remove the flag or replace it with a real audio element.
- Release Notes is built differently — no `PageShell`, no section rail, no overview block. Do not normalise it.
- Admin Shell shows its hero topbar in both windowed and fullscreen, unlike the others.
- ~~Check Access long-v2 has its own hand-written rail rather than `LeftRail`.~~ **No longer true (2026-08-15)** — it becomes the shared `LeftRail` with its own content. Wordmark resolves to 16px; the other four case studies do not change.
- The six project pages have no Contact affordance. Do not add one.
- The `fit()` reference width is 1300px. Not a number to tidy.
- There is no AI Experiments page. Do not create a route, stub, or placeholder.
- The main site rail and the project section rail are different systems. Do not merge them.

## Not published

`project-admin-shell.html` and its seven `frames/` diagrams are excluded from the deployed build. Do not fix the passcode gate — exclude the page instead. Verify both the page and every diagram 404 on the live site.

## Copy rules

These apply to every change, in every stage, to anything a visitor can see or a browser receives: page text, headings, captions, image `alt` text, `title` and `aria-label` attributes, the tab title, meta and link-preview tags, and any comment inside `index.html` or an injected `<style>` string. Developer notes in `//` and `/* */` that the build removes, and the `*.md` working documents, are exempt.

1. **No em dashes (—).** Use the punctuation the sentence actually needs, not a one-for-one swap:
   - An aside mid-sentence: comma, or parentheses.
   - A lead-in to a list or an explanation: colon.
   - Two complete thoughts: period or semicolon.
   - A caption shaped "Name — description": colon ("Index manager: govern...").
   - Short labels and eyebrows: a spaced middle dot ("V1 · PREVIEW", "404 · NOT FOUND"), which matches the site's existing labels.
   - Quote attributions: no leading dash, commas between name and role ("SORIN VISAN, PLATFORM PRODUCT MANAGER, UIPATH").
   - Number ranges: a plain hyphen ("2024-25"). The en dash (–) is left as it is where it already appears.
2. **American spelling.** organization, systemize, centralizing, behavior, labeling, color, center, categorized, analyze, modeling, license (noun). Not the British forms.
3. **Check before committing:** `npm run check:copy`. It builds the site and scans `dist/` for em dashes and British spellings. It must pass. If it flags a word that is genuinely correct, adjust the list in `tools/check-copy.mjs` rather than ignoring the result.

Leave "Scope Seperation" alone under this rule too; see "Do not fix".

---

## How to work here

- **Write it down, don't fix it.** Anything ambiguous or broken beyond the lists above gets reported, not repaired.
- **Report before edit.** Audit and surface findings before touching a live file.
- **One change per prompt.** Bounded scope, verify, then move.
- **Two to three options with rationale, ranked.** Not a single recommendation pushed through.
- **Sequential approval on multi-part builds.** One deliverable approved before the next begins.
- **Locked surfaces stay locked.** Resolved decisions are not re-litigated. If something is described as intentional, treat it as intentional and move on.

## Ask, don't assume

- Final URL slugs — public and effectively permanent
- Wording for the text replacing the Admin Shell passcode gate
- Any point where parity seems to require changing the design
- Any dependency beyond Vite, React and React Router

---

*Update this file when Stage 1 is deployed. Most of the "do not fix" list becomes valid Stage 2 cleanup.*
