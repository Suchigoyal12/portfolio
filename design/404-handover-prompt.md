# Handover prompt — 404 page

Paste everything below the line into Claude Code, with `404-mock.html` attached.

---

Attached is `404-mock.html` — an approved design mock for the site's not-found page. Build it as a real route. Report before you edit, one change, then screenshot.

**Why this exists.** The Vercel catch-all rewrite (`vercel.json`) sends every unmatched URL to `index.html` so deep links and hard refreshes survive. Correct and non-negotiable. But there is no catch-all *route* in React Router, so any unmatched URL currently renders a completely blank white page — `/nonsense` is blank today. The static site returned a proper 404. This closes that regression.

**What to build.**

1. A `NotFound` component matching the attached mock — layout, hierarchy, spacing, and motion as shown.
2. A catch-all route (`path="*"`) as the last route in the router, rendering it.

**Two things in the mock are placeholders and must be replaced from the repo, not copied:**

- **The wordmark.** The mock renders the text "Suchi Goyal" in Archivo. That is a stand-in. Use the real wordmark from `LeftRail` in `site/shared.jsx` (~line 667) — the same markup and CSS, exactly. On this page it links to `/` with a normal router link; it does **not** need the `window.top.location.href` iframe-escape behaviour, since the 404 never renders inside the stage manager.
- **The colour tokens.** The `:root` block holds approximated hexes. Replace every one with the real token from `DESIGN_SYSTEM.md`, which is the source of truth: cream, paper, ink, muted, line, terracotta. Do not introduce a new value.

**Copy — final, use verbatim:**

- Status line (mono, terracotta): `404 — NOT FOUND`
- Display (serif): `Nothing lives at this address.`
- Sub (muted): `The page may have moved.`
- Primary link: `← HOMEPAGE` → `/`
- Secondary link: `WORK` → `/work`

**Motion.** Interaction only, nothing on arrival — consistent with the rest of the site. Link underline wipes out from the right, arrow nudges left, 300ms. The mock's `prefers-reduced-motion` block is intentional; keep it.

**Do not:**

- add an illustration, an oversized 404 numeral, or any entrance animation
- use FIG. notation anywhere on this page — that system labels figures inside case studies, and a 404 is not a figure
- change `vercel.json`, or touch any other route

**Verify after building:**

- `/nonsense` renders the 404 page rather than a blank screen
- `/` and `/work` still resolve normally, and both links from the 404 work
- `/work/ai-trust-layer` still survives a hard refresh — the rewrite is untouched
- the previously excluded `project-admin-shell.html` now lands on this page rather than a blank screen, and its content is still absent from the bundle

**Out of scope, do not do it in this pass:** redirects mapping old `.html` URLs to the new routes. That is a separate decision, unresolved.
