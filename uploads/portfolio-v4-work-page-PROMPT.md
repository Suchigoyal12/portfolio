# Portfolio v4 — work.html — Claude Design Build Prompt

Build a new standalone page: **work.html**. Not an edit of the current version —
a fresh page. The old stage manager in homepage in Portfolio v3 page gives you the base concept and visual
system. This prompt replaces or overrides anything in that file where they conflict.

---

## MASTER PROMPT (paste whole)

```
Build a new standalone page — work.html — using the old stage manager file as
your conceptual and visual reference. Every decision below either replaces or
adds to that reference. Where this prompt is silent, follow the old file.

────────────────────────────────────────────────
CONCEPT (unchanged from reference)
────────────────────────────────────────────────
Stage Manager: one project focused in a chrome-bar frame, the others sitting as
tilted preview cards in a persistent stack. Clicking a preview card swaps it to
focus; the outgoing project takes the clicked card's slot. True swap — they cross
paths. Client-side state change, no page reload.

────────────────────────────────────────────────
WHAT'S DIFFERENT FROM THE REFERENCE FILE
────────────────────────────────────────────────

1. STACK POSITION — RIGHT EDGE OF SCREEN
   The preview card stack is pinned to the right edge of the viewport at all
   times — exactly as it sits in the current homepage, not in a column beside
   the focused window. It is a persistent, always-hoverable right-edge layer,
   overlapping whatever is behind it.

2. FOCUSED WINDOW = IFRAME
   The main content area is a full-width, full-height iframe loading the actual
   existing project page. No custom window body, no invented copy, no teaser
   layout. The real project page loads directly into the frame.
   Default on load: iframe loads project 01 (Check Access short version).
   Use placeholder hrefs for now — real URLs will be wired separately.

3. FULLSCREEN — BROWSER NATIVE
   Green dot / F key triggers browser-native requestFullscreen() on the whole
   page. On entering fullscreen:
   — Chrome bar hides completely.
   — Window margins collapse to zero; iframe goes true edge-to-edge.
   — Stack cards STAY on the right edge, still visible and hoverable.
     The swap mechanic works inside fullscreen: hovering the right edge reveals
     the stack, clicking a card swaps the iframe src — no exit needed.
   — A 3px terracotta peek strip remains visible on the far right edge at all
     times in fullscreen, signaling the stack is there.
   Esc exits fullscreen (browser native). Chrome bar reappears on exit.
   On the FIRST fullscreen entry in a session: briefly nudge the top stack card
   ~30px into view then back out (~700ms) so the visitor discovers the stack.

4. NO YELLOW DOT
   Only two traffic lights: red (✕) and green (↗). No yellow dot at all.

5. NO BOTTOM DOCK / PILL STRIP
   Remove the dock dots, breadcrumb pill, ESC hint, ⌘K hint from below the
   stage. Not needed for this page.

6. ALL CARDS LIGHT
   All 4 projects render as light (warm paper) cards — in both focused and
   preview states. Drop the dark-card treatment for AI Trust Layer entirely.

7. THIS IS A DISCOVERABLE LAYER
   The stage manager mechanic is not announced. No onboarding tooltip, no
   instructional copy, no entrance animation. Leave a TODO comment in the code
   where a section-entrance animation would hook in later.

────────────────────────────────────────────────
CHROME BAR (full spec — treat this as ground truth)
────────────────────────────────────────────────
Pinned to the top of the focused frame. Stays fixed while iframe content scrolls.

Left cluster:
  — Red dot (#E5564E). On hover of the cluster: reveal ✕ glyph inside (macOS
    style — hidden until hovered). Tooltip on hover: "Close".
    Click: exits fullscreen if active; otherwise scrolls to top / homepage.
  — A subtle pill immediately right of the red dot containing ⟨ ⟩ arrows.
    Click ⟨ = previous project. Click ⟩ = next project. Fixed order, wraps.
    Glyphs hidden until the left cluster is hovered; same reveal as red dot.
  — Green dot (#1F8A5B) styled with a ↗ expand glyph. Tooltip: "Fullscreen · F".
    Glyph hidden until cluster is hovered.

Center:
  — Breadcrumb: "NN/04 · WORK › PROJECT NAME"
    (section label "WORK", chevron ›, then current project name)
    Updates live on every project change.

Right:
  — Hint text: "F · FULLSCREEN" (mono, muted, uppercase)

No timestamp. No yellow dot. No dock strip below.

During fullscreen: entire chrome bar hides. Reappears on Esc.

────────────────────────────────────────────────
INTERACTIONS (full spec)
────────────────────────────────────────────────
SWAP
  Clicking a preview card: outgoing focused project travels to the clicked
  card's slot; incoming card travels to center. They cross paths — not a
  cross-fade. ~480ms, cubic-bezier(.2,.8,.2,1). Iframe src updates with a
  soft fade (~200ms) after position animation settles.

PREV / NEXT
  ⟨ ⟩ pill and ↑ / ↓ keys navigate the fixed project order, wrapping at the
  ends. Breadcrumb updates live.

STACK HOVER
  On preview-card hover: untilt to 0deg, slide ~12px left, scale 1.02, shadow
  deepens, raise z-index above neighbors, reveal "bring on stage →" cue in the
  card footer.

FULLSCREEN
  See §3 above. requestFullscreen() on the page element. Stack stays on right
  edge and remains functional. Peek strip always visible. First-session nudge.

────────────────────────────────────────────────
PROJECTS (exact order — use placeholder hrefs)
────────────────────────────────────────────────
01 — UNIFYING FRAGMENTED PERMISSIONS
     (Check Access — short version page) [placeholder href]

02 — AI TRUST LAYER
     (AI Trust Layer project page) [placeholder href]

03 — RE-ARCHITECTING THE UIPATH ADMIN SHELL
     (Admin Shell — public version) [placeholder href]

04 — RELEASE NOTES
     (Release Notes project page) [placeholder href]

────────────────────────────────────────────────
PREVIEW CARD CONTENT
────────────────────────────────────────────────
Placeholder for now. Keep the card structure from the reference file but use:
  [PROJECT TITLE] / [AREA] / [ONE-LINER]
I will fill real content separately.

────────────────────────────────────────────────
MOTION TOKENS (unchanged from reference)
────────────────────────────────────────────────
All transitions: 340–520ms, cubic-bezier(.2,.8,.2,1). No spring overshoot.
Stack cards fade+slide in on first render, staggered ~60ms.

────────────────────────────────────────────────
VISUAL TOKENS (unchanged from reference)
────────────────────────────────────────────────
--bg:       #EFECE4   warm bone background
--paper:    #FBFAF6   light cards / window body
--ink:      #111110   primary text
--muted:    #8A857C   mono labels, secondary
--line:     #D9D4C8   hairlines
--accent:   #B5522E   terracotta — peek strip, hover cues, active states
--green:    #1F8A5B   fullscreen dot
--red:      #E5564E   close dot

Fonts:
  Cormorant Garamond (400,500 + italics) — serif / accent lines
  DM Sans (400–800) — UI, titles, body
  JetBrains Mono (400,500) — all labels/meta/breadcrumbs, uppercase, ls 0.12em

Radii: window 18px · cards 14px · pills fully rounded
Focused window shadow: 0 54px 96px -48px rgba(0,0,0,0.36)
Card shadow: 0 24px 48px -30px rgba(0,0,0,0.30)

────────────────────────────────────────────────
STATE MODEL (reference if logic drifts)
────────────────────────────────────────────────
order = [focusedId, ...stackIds]   // 4 project ids; order[0] is focused

focusProject(id):
  if id === order[0] return
  prev = order[0]
  order = order.map(k => k === id ? prev : k)
  order[0] = id
  re-render + animate + update iframe src

adjacent(dir):   // +1 next, -1 prev over FIXED project order
  i = fixedProjects.indexOf(order[0])
  focusProject(fixedProjects[(i + dir + 4) % 4])

fullscreen: boolean
  true  → requestFullscreen(), chrome bar hidden, iframe edge-to-edge,
          stack stays on right edge, peek strip visible
  false → exitFullscreen(), chrome bar reappears, margins restore

────────────────────────────────────────────────
RESPONSIVE
────────────────────────────────────────────────
Below 900px: drop Stage Manager entirely. Show a simple vertical list of the
4 projects — title, area, year, link. No chrome bar, no tilt, no iframe.

────────────────────────────────────────────────
DEFERRED (not in this build)
────────────────────────────────────────────────
— Entrance animation (cards fanning in on scroll) — leave TODO comment
— Timestamp / clock — lives in the contact section, separate task
— Real project URLs — placeholder hrefs for now
— Preview card real copy — to be filled separately
```

---

## Acceptance checklist

- [ ] Four projects; one iframe-loaded in chrome frame, three tilted in right-edge stack
- [ ] Stack pinned to right edge of viewport, overlapping, always hoverable
- [ ] Clicking a preview card cross-path swaps iframe src and card positions
- [ ] ⟨ ⟩ pill and ↑↓ keys change focus, wrap, update breadcrumb live
- [ ] Breadcrumb format: "NN/04 · WORK › PROJECT NAME"
- [ ] Chrome bar: red + green only (no yellow), glyphs hidden until cluster hovered, tooltips present
- [ ] Fullscreen: requestFullscreen(), chrome bar hides, iframe edge-to-edge, stack stays + functional, 3px peek strip visible, first-session nudge plays
- [ ] Esc exits fullscreen, chrome bar reappears
- [ ] Swap inside fullscreen works (hover right edge → stack appears → click card → iframe swaps)
- [ ] All cards light (no dark variant)
- [ ] No bottom dock/pill strip
- [ ] Motion 340–520ms, cubic-bezier(.2,.8,.2,1), no overshoot
- [ ] Below 900px: plain vertical list, no stage manager chrome
