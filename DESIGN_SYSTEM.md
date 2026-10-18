# Suchi. Portfolio '26 — Design System

> **Honesty in Design.**
> A specification sheet for a portfolio that reads like an architectural drawing — typographic, gridded, archival. This document is the source of truth for typography, spacing, components, and motion across every page in the portfolio site.

---

## 0. Foundations

### 0.1 Typefaces

| Role | Family | Source | Weights | Use |
|---|---|---|---|---|
| **Display / UI** | DM Sans | Google Fonts | 400 / 500 / 600 / 700 / 800 | All headings, body, buttons, labels |
| **Editorial** | Cormorant Garamond | Google Fonts | 400 / 500 / 600, italic 400 / 500 | Pull quotes, owner mark, drop numerals, ledes |
| **Mono / Spec** | JetBrains Mono | Google Fonts | 400 / 500 / 600 | Section labels, navigation, metadata, archival markers |

**Exception:** the `SuCHI` wordmark (Homepage `.mark`) uses **Archivo**, weight 600 — a brand-mark-only exception, not part of the shared type scale. Intentional, not a drift.

**Rule:** Three families, no more (excluding the wordmark above). DM Sans is the workhorse. Cormorant is reserved for editorial moments (italic ledes, large numerals, the `Suchi.` mark). JetBrains Mono is reserved for system metadata (section numbers, captions, taxonomy).

### 0.2 Color tokens

```css
:root {
  --bg:           #E8E4DC;  /* cream */
  --surface:      #FBFAF6;  /* paper white */
  --ink:          #111110;  /* near-black */
  --ink-inverse:  #F4F1E9;  /* cream on dark panels */
  --muted:        #8A857C;  /* secondary text */
  --line:         #D9D4C8;  /* hairlines */
  --accent:       #B5522E;  /* terracotta */
  --ink-panel:    #0E0E0C;  /* dark band background */
  --live:         #1F8A5B;  /* transport "live" state — play/pause control, About person branch */
}
```

Three palettes ship: **Cream + Terracotta** (default), **B&W**, **All-dark**. All accents are tweakable; defaults are tuned warm-neutral.

`--live` is a **state** colour, not an accent: it marks a transport control that is playing or ready to play (`about.html`, person branch). It never carries brand emphasis, never appears as a fill or a background, and is not part of the palette-switching set — one role, one usage. Hover still resolves to `var(--ink)` like every other mono control (§3.4).

---

## 1. Typography

A modular type system with three voices (Sans / Serif / Mono) and one display register that breaks the rules on purpose.

### 1.1 Heading scale

| Token | Family | Weight | Size (clamp) | Line-height | Tracking | Use |
|---|---|---|---|---|---|---|
| `h-display` | DM Sans | 800 | `clamp(72px, 9vw, 140px)` | 0.88 | -0.04em | Page hero only |
| `h-case-hero` | DM Sans | 800 | `clamp(48px, 7vw, 96px)` | 0.92 | -0.04em | Case-study body hero (separate from `h-display`) |
| `h-1` | DM Sans | 800 | 64px | 0.92 | -0.035em | Page titles, "Next" CTA |
| `h-cta` | DM Sans | 800 | 64px | 0.92 | -0.035em | Closing CTA headline |
| `h-2` | DM Sans | 800 | 48px | 1.0 | -0.02em | Section headlines (`.row h2`), outcomes headline |
| `h-3` | DM Sans | 700 | 30px | 1.10 | -0.02em | Sub-section, project card titles |
| `h-4` | DM Sans | 700 | 22px | 1.15 | -0.01em | Card headings, decision cards |
| `h-5` | DM Sans | 800 | 20px | 1.15 | -0.02em | Work page card headline (`CardFace`, `site-work/cards.jsx`) |
| `h-editorial` | Cormorant Garamond | per-instance | 24px | 1.3 | 0 | Opening editorial framing — page dek/summary + `Mission` thesis statement (designer-authored, unattributed) |
| `serif-callout` | Cormorant Garamond | per-instance | 26px | 1.4 | 0 | Per-phase takeaway/synthesis (designer's own conclusion, no attribution) |
| `serif-quote` | Cormorant Garamond | per-instance | 30px | 1.3 | 0 | Attributed user-research quote, bordered — the credibility/evidence moment |
| `serif-pull` | Cormorant Garamond | per-instance | 36px | 1.3 | 0 | Closing reflection pull-quote — largest serif beat, one per case study |
| `h-contact-modal` | Cormorant Garamond | 500 | 38px | 1.04 | -0.01em | Contact modal "Let's talk." headline (`ContactModal`, `site-work/stage.jsx`) — own role, distinct from `serif-pull`; only weight was previously confirmed |

**Flagged, not in scope this pass:**
- `site/page-works.jsx`'s Works-index card title (`fontSize:24, fontWeight:700`) is a separate live spec, undocumented, distinct from `h-5`. Needs its own token in a future pass.
- `site-work/cards.jsx`'s `.num`/`.label`/`.status` (matches `mono-sm`) and card headline (matches `h-5`) are correct in value but implemented as bare inline styles, not classed tokens — refactor to named classes in a future pass.
- Work.html's `.wk-crumb-title` (weight/tracking) and `MobileList`'s title div (22px/800) are held pending the deferred mobile stage-title decision — not normalized in this pass.

**Display rule:** every page hero ends with a terracotta full-stop — `<span class="acc">.</span>` — set in the accent color. It's the system's signature.

### 1.2 Body scale

| Token | Family | Weight | Size | Line-height | Use |
|---|---|---|---|---|---|
| `body` | DM Sans | 400 | 16px | 1.6 | Default body, card paragraphs, long-read narrative (merged `body-lg`; `.row .body`) |
| `body-text` | DM Sans | 400 | 14px | 1.55 | Card details, decision grids (renamed from `body-sm`; matches live `.body-text` class) |
| `body-xs` | DM Sans | 400 | 13px | 1.5 | Quote findings, dense tables |
| `caption` | DM Sans | 500 | 12px | 1.4 | Captions, footnotes |

Body copy max-width: **680px** for `.body`, **760px** for editorial italic. Never wider — readability over filling space.

### 1.3 Mono / spec scale

JetBrains Mono is **always** uppercase with `letter-spacing: 0.1em` (or 0.06–0.08em for inline metadata). It carries section numbering, navigation labels, taxonomic tags, and timestamps.

| Token | Size | Weight | Tracking | Use |
|---|---|---|---|---|
| `mono-lg` | 12px | 400 | 0.10em | Pill tags, eyebrow labels |
| `mono` | 11px | 400 | 0.10em | Section labels, nav items |
| `mono-sm` | 10px | 400 / 600 active | 0.08em | Micro/mono labels, captions, `.role-row` date/role text, tooltips/cues (`Work.html`), stage labels (`site-work/stage.jsx`), `page-home.jsx` meta, left-nav TOC links/status values |
| `mono-xs` | 9px | 400 | 0.1em | Left-nav/topbar labels — brand tag ("PORTFOLIO"), "ON THIS PAGE", status keys, "PRESS ESC TO EXIT" / eyebrow, "← BACK" / page context. Matches `project-check-access-long-v2.html`'s original left-rail scale — restored as source of truth for this role across all Work projects (short, long, public).

**Work page card tokens** (uses `mono-sm`): `.num` (card index) — 10px, weight 800. `.label` / `.status` — 10px, weight 400.

### 1.4 Other registers

- **Numerals (serif drop)** — Cormorant 500, 36–88px, line-height 1, in `--accent`. Used for ordinals (`01 / 02 / 03`) on cards and impact stats.
- **Selection** — `::selection { background: var(--accent); color: #fff; }`. The whole site selects terracotta.
- **Contact modal "Let's talk."** — uses `h-editorial`, weight 500.
- **Copy punctuation and spelling.** Visitor-facing text uses no em dashes and American spelling. Labels and eyebrows separate their parts with a spaced middle dot (`V1 · PREVIEW`). Full rules and the `npm run check:copy` check are in `CLAUDE.md` under "Copy rules".

### 1.5 Spacing rhythm (vertical type)

A typographic rhythm based on the **8px baseline** with a relaxed line-height stack:

```
heading → 12–24px gap → body → 24–40px gap → next block
heading → 16px gap → editorial italic lede
section label (mono) → 24px gap → headline
```

Rule: between an h2 and its body, **always 20px**. Between a body paragraph and a system block (cascade, table, grid), **always 32px**. These two values do most of the work.

### 1.6 Responsive typography

The hero uses `clamp()` so display copy scales with viewport. Section h2 stays fixed at 48px on desktop, drops to 36px below 900px, 28px below 600px. Body copy never goes below 14px on mobile. Mono stays mono — same size, same tracking, at every breakpoint, because it's a system label, not content.

| Breakpoint | h-display | h-1 | h-2 | body |
|---|---|---|---|---|
| ≥1280px | clamp 140px | 64px | 48px | 16px |
| 900–1279px | clamp ~110px | 56px | 40px | 16px |
| 600–899px | clamp ~84px | 44px | 36px | 15px |
| <600px | 64px | 36px | 28px | 14px |

---

## 2. Spacing System

### 2.1 Base unit

**4px base / 8px primary step.** All spacing is a multiple of 4px; the canonical scale is 8-based with a few half-steps for fine adjustments.

```
--s-0:   0px
--s-1:   4px   (hairline gap, icon-to-text)
--s-2:   8px   (chip padding, tight rhythm)
--s-3:  12px   (card padding-y small)
--s-4:  16px   (default gap)
--s-5:  20px   (heading→body)
--s-6:  24px   (block separation)
--s-8:  32px   (section internal)
--s-10: 40px   (section internal large)
--s-12: 48px   (column gap, hero internal)
--s-14: 56px   (page padding-x desktop)
--s-16: 64px   (section padding-x)
--s-18: 72px   (section padding-y)
```

### 2.2 Component padding contract

| Surface | Padding |
|---|---|
| Pill / chip | `8px 14px` |
| Card (default) | `22px 26px` |
| Card (decision, large) | `24px 28px` |
| Hero | `72px 64px` |
| Section row | `72px 64px` |
| Summary row | `48px 64px` |
| Top nav | `18px 56px` |
| Left rail | `32px 20px` |
| Footer | `56px 56px 32px` |

### 2.3 Section spacing rules

1. **Every major section has a hairline divider.** `border-bottom: 1px solid var(--line)`. No floating sections.
2. **Padding-y is 72px for content rows, 48px for index/summary rows, 56px for footer.** No section is "tighter" than 48px.
3. **Internal block separation is 32px.** Heading → meta → body is 20px / 24px. Anything past the body uses 32px.
4. **Section labels are gutter-anchored.** `grid-template-columns: 180px 1fr` with a 32px gap. The 180px column holds the mono section label; the 1fr holds the headline + content.
5. **The dark "impact" band breaks rhythm intentionally.** Same 72px y-padding, but inverted ink — used once per page max.

### 2.4 Grid

- **Page max-width:** unconstrained on long-read pages (the section row grid does the work). Constrained content max-width: 1280px.
- **Project shell:** `grid-template-columns: 240px 1fr` — fixed left rail + flex main.
- **Section row:** `grid-template-columns: 180px 1fr` — gutter label + content.
- **Card grids:** 2-up (16/24px gap), 3-up (16–20px gap), 4-up rare. Always `gap`, never margin.

### 2.5 Responsive spacing

| Breakpoint | Section padding | Row gutter | Card gap |
|---|---|---|---|
| ≥1280px | 72px / 64px | 180px label + 32px | 16–24px |
| 900–1279px | 64px / 48px | 140px label + 24px | 14–20px |
| 600–899px | 48px / 32px | label collapses to top | 12–16px |
| <600px | 40px / 24px | single column | 12px |

Below 900px the gutter label moves above the headline (display:block, mb:16px) instead of beside it. Below 600px the left rail collapses into a top-bar.

---

## 3. Components

### 3.1 Navbar

Two flavors. Both share the owner mark + uppercase mono links.

**A. Top nav (sticky)**
- Sticky at top, `var(--bg)` background, `1px solid var(--line)` bottom border.
- `padding: 18px 56px`, flex `space-between`.
- Left: `Suchi.` in Cormorant 22/500 + `PORTFOLIO '26` mono caption.
- Center/right: nav items as `01 — Works`, mono 11px, 0.08em tracking, uppercase.
- Active state: `color: var(--ink)`, weight 600, with a 2px terracotta underline 22px below the link (`bottom: -22px`).
- Right edge: `AVAILABLE'26` status mono.

**B. Left rail (case-study pages)**
- `width: 240px`, sticky `top: 0; height: 100vh`, `border-right: 1px solid var(--line)`.
- Vertical stack: brand → primary nav → on-this-page TOC → meta block at bottom.
- TOC active item: filled terracotta dot prefix (`●`) at the left margin.
- Below 900px the rail collapses into a top bar with a hamburger.

### 3.2 Project cards

Two layouts; both use the same anatomy.

**Anatomy:**
1. Index number — Cormorant 500, 56–88px, accent color, line-height 1.
2. Title — DM Sans 700/800, 22–30px.
3. Client / role / timeline — mono row, `0.08em` tracking, muted color.
4. Summary — body 14–15px, max-width 56ch.
5. Tag pills — chips with `1px solid var(--ink)`, `border-radius: 999px`, mono 10px, padding `8px 14px`.
6. Metric badge (optional) — small mono, accent color.
7. Hover affordance — see §3.4.

**Layouts:**
- **Stacked card** — vertical, used in 3-up grids on Works. Hairline top border (`border-top: 1px solid var(--ink)`), 24px padding.
- **Index row** — horizontal, used in long lists. Grid `grid-template-columns: 80px 1fr 200px 120px` (no, title+sum, tags, metric). Hairline between rows.

**Work stage card** (the four project cards on `/work`, `src/site/work-cards.jsx`). Two specs, blended by the card's live width:

| | Small, 216×156 (stack, pile) | Large, 424 wide (grid) |
|---|---|---|
| Padding | 16 / 22px | 28 / 32px |
| Number | mono 800, 10px | 11px |
| Headline | DM Sans 800, 20px, leading 23px | 34px, leading 35.4px, slightly tighter tracking |
| Label, status | mono, 10px | 11px |
| Doodle | as drawn, hugging the right corner | 1.6×, centered on the right, 26px in |

Type steps up far less than the card does; a uniformly scaled card read as an enlarged thumbnail. Between the two widths every value blends in a straight line, through CSS container units, so a card moving between sizes stays composed on every frame. At rest at 216px and below, the original scaled render is used unchanged.

### 3.3 Buttons

The system uses three button registers.

| Variant | Treatment | Use |
|---|---|---|
| **Primary** | Background `var(--ink)`, text `var(--ink-inverse)`, mono 11px, `0.1em` tracking, padding `14px 22px`, no radius. | One per page max. |
| **Secondary** | `1px solid var(--ink)`, transparent bg, text `var(--ink)`, same type spec as primary. | Inline CTAs. |
| **Pill** | `border-radius: 999px`, `1px solid var(--ink)`, padding `8px 14px`, mono 10px. | Tag chips, filters. |
| **Text link (mono)** | Mono 10–11px uppercase, color inherits, with a leading `↗` or `↩` arrow. | Inline navigation. |

All buttons sit on the 8px grid: heights are 32 / 40 / 48px.

### 3.4 Hover behaviors

A consistent hover language across the site:

| Element | Hover |
|---|---|
| **Mono nav link** | Color → `var(--ink)`, no other change. 160ms `ease-out`. |
| **Active nav link** | The 2px terracotta underline is **already** showing; on hover it extends 4px wider via `transform: scaleX(1.05)` (160ms). |
| **Project card** | Subtle: index numeral fades from accent into ink, OR card surface lifts to `var(--surface)` if it sat on `var(--bg)`. 200ms. No box-shadow. |
| **Pill / chip** | Background `var(--ink)`, text `var(--ink-inverse)`. 160ms. |
| **Primary button** | Background `var(--accent)`, text remains inverse. 160ms. |
| **Secondary button** | Fill in to ink. 160ms. |
| **Text link with arrow** | Arrow translates `4px` in its direction. `transform`, 200ms `ease-out`. |
| **Image / media block** | Image scales `1.02` on the inside of an `overflow:hidden` parent; meta caption fades in (`opacity 0 → 1`) over 240ms. |

**Cursor rule:** never custom cursors. Pointer for click targets, default for content. The system's restraint is the brand.

### 3.5 Media blocks

Standardized image containers used in case studies, walkthroughs, and the hero.

**Spec:**
- `aspect-ratio` is explicit per block. Defaults: **16/10** for screens, **4/5** for portraits, **1/1** for diagrammatic, **3/2** for landscape photo.
- `border: 1px solid var(--ink)` always — images are framed, not floating.
- `overflow: hidden` for hover scale.
- Caption sits **outside** the frame, mono 10px uppercase, with a top margin of 14px.
- Placeholder treatment: `background: #C5D8E4` with a 135deg repeating-linear-gradient stripe (`rgba(255,255,255,0.18) 0 18px, transparent 18px 36px`) and a mono label inset bottom-left (5/9px padding, hairline border).
- A media block can be tagged `Screen 03 / Permissions`-style — that label always follows the format `Screen NN / Title`.

### 3.6 Content layouts

Five canonical row layouts. Pick one per section.

| Layout | Grid | Use |
|---|---|---|
| **Gutter** | `180px 1fr` | Default — labelled section. |
| **Two-up** | `1fr 1fr`, gap 16–24px | Comparison (A/B), constraint vs. decision. |
| **Three-up** | `repeat(3, 1fr)`, gap 16–20px | Pillars, quotes, artifacts. |
| **Four-up** | `repeat(2, 1fr)` × 2 rows | Decision matrix, lessons. |
| **Stat row** | `repeat(3, 1fr)`, gap 32px, hairline tops | Impact metrics. |

Every grid item has a `border-top: 1px solid var(--ink)` and `padding-top: 14–18px` — the row reads as a tabular index, not a card sea.

### 3.7 Quote sections

Two flavors:

**A. Pull quote (in-flow)**
- Cormorant italic 400, 42px, line-height 1.2.
- Bordered top + bottom (`1px solid var(--ink)`), padding `24px 0`.
- Opens with an oversized terracotta quotation mark (`<span class="o">"</span>`).

**B. Quote card (3-up)**
- Surface card, `1px solid var(--ink)`, padding 24px.
- Open quote: Cormorant italic 48px, accent color, line-height 0.4 (intentional — the glyph hangs over the blockquote).
- Quote body: Cormorant italic 22px, line-height 1.25, 22px bottom margin.
- Finding label: mono 10px uppercase, with a hairline top border, 10px top padding.
- Finding body: 13px, line-height 1.5.

A "Key Takeaway" follow-up sits beneath the row in a `160px 1fr` grid: mono label + Cormorant italic 22px paragraph.

### 3.8 Process blocks

Used to express decisions, constraints, walkthroughs.

**Decision card**
- Surface bg, `1px solid var(--ink)`, padding `24px 28px`.
- Grid: `60px 1fr` — large Cormorant numeral + content.
- Inside content: h3 (22/700) + a `80px 1fr` grid for `lbl / value` rows, gap `6px 16px`, body 14px.
- "Rejected" label is set in `--accent`. An italic Cormorant footnote can span the full width with `grid-column: 1 / -1`.

**Constraint table**
- 2-column table with `1px solid var(--ink)` borders.
- Row header: mono 11px uppercase, padding `12px 20px`.
- Row body: 17px, line-height 1.5, padding 20px.
- Accent emphasis inside the cell sets the operative phrase to `--accent` weight 600.

**Walkthrough step**
- Media block (16/10) on top.
- Step meta (`Step 1 — Title`) in mono 10px uppercase.
- h4 18/700 below.
- Body 13px description.
- 24px gap between steps in a 2-up grid.

**Cascade / arch diagram**
- Vertical stack of layered "layer" cards, each `1px solid var(--ink)` with `lk` (mono caption) + `lv` (DM Sans 22/700).
- The terminal layer fills with `--accent` background + inverse text.
- Between layers, a centered mono arrow caption `↓ cascades to`.

### 3.9 Image grids

Three canonical grids:

| Grid | Use |
|---|---|
| **Mosaic 2-up** | One landscape (16/10) + one portrait (4/5) side by side, equal heights. |
| **Tile 3-up** | Three equal tiles (3/2), gap 16px. |
| **Stack of 4** | 2×2, alternating 16/10 and 4/5 to break symmetry. |

Every grid item is a Media block (§3.5) — same border, same caption rules. Captions can collapse on mobile to a stacked column rather than wrapping under each tile.

---

## 4. Motion Language

Restraint over flourish. Motion exists to confirm cause-and-effect, not to entertain.

### 4.1 Easing

Three easings. Pick by intent.

| Token | Curve | Use |
|---|---|---|
| `ease-standard` | `cubic-bezier(0.2, 0.0, 0.0, 1.0)` | Default — entrances, hover. |
| `ease-emphasis` | `cubic-bezier(0.16, 1, 0.3, 1)` | Long entrances (hero, scroll reveals). Decisive overshoot-free. |
| `ease-exit` | `cubic-bezier(0.4, 0.0, 1, 1)` | Exits, dismissals. Faster start. |

Linear is reserved for the scroll progress bar (`width 60ms linear`) where the eye expects a 1:1 mapping.

### 4.2 Duration

| Token | ms | Use |
|---|---|---|
| `dur-instant` | 60 | Scroll progress, very tight feedback. |
| `dur-fast` | 160 | Hover color/border swaps. |
| `dur-base` | 200 | Card hover, default transition. |
| `dur-medium` | 240 | Image scale, caption fade-in. |
| `dur-slow` | 400 | Section reveal entrances. |
| `dur-extra` | 600 | Hero entrance only — once per page. |

Anything longer than 600ms is forbidden.

### 4.3 Stagger rules

When multiple peers animate in (cards, list items, grid cells), they stagger.

- **Stagger step:** 60ms between siblings, 80ms for hero meta rows.
- **Direction:** top-to-bottom for vertical lists, left-to-right for horizontal rows, top-left → bottom-right diagonal for grids.
- **Cap:** never stagger more than 8 items. Past 8, group into batches of 6 and stagger the *batches* instead.
- **Combined with `ease-emphasis`** + `dur-slow` + `translateY(12px) → 0` + `opacity 0 → 1`.

### 4.4 Scroll timing

- Reveals fire when the element's top crosses **85% of the viewport height** (`IntersectionObserver` with `rootMargin: "0px 0px -15% 0px"`).
- Each reveal runs **once** — `unobserve` on first intersection. No re-reveals on scroll-up.
- The scroll progress bar is exempt — it tracks scrollY in real time, no easing, 60ms linear catch-up.
- Sticky elements (top nav, left rail) **do not animate**. Sticky already implies movement; doubling it reads as jitter.
- Anchor scroll uses `behavior: "smooth"` with `block: "start"` and a `scroll-margin-top: 96px` so the section label clears the sticky nav.

### 4.5 Transition consistency

Three rules that keep the system coherent:

1. **One property at a time per element.** A button transitions `background-color` and `color` together (visually one event), but never also `transform` and `box-shadow`. Each motion must read as a single intent.
2. **Hover and reveal use the same easing family.** `ease-standard` for both. Motion vocabulary should not change based on trigger.
3. **Color transitions are 160ms; spatial transitions are 200–240ms; entrance transitions are 400–600ms.** This three-speed rule applies everywhere — break it only with cause.

### 4.6 Reduced motion

Honor `prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Reveals fall back to immediate visibility (no fade, no translate). Hover color swaps still occur but instantly.

---

### 4.7 Ambient motion exception — About / designer photo marquee

The system's rule is **motion is interaction-only** (§4). One deliberate exception exists: the photo marquee at the foot of the About page's designer branch (`about.html`, `.ph-marquee`). It runs continuously, unprompted, with no user trigger.

Why it's allowed: the strip is the designer branch's only imagery, and a static row of 4–10 photos in a 254px column reads as a contact sheet, not a life. Continuous drift makes it ambient background texture rather than content demanding attention.

Terms of the exception — it stays legal only while all of these hold:

- **Linear easing** (the second sanctioned linear use after the scroll progress bar). A marquee with an eased curve reads as broken.
- **Speed is a constant, not a duration.** `22 px/s`, right-to-left. Duration is derived: `setWidth / pxPerSec`, so a longer array loops proportionally longer instead of speeding up.
- **Duration exceeds the 600ms ceiling on purpose.** §4.2's cap governs event-response motion; ambient loops are exempt.
- **Pauses on hover.** Cursor-over halts the strip so any frame can be read.
- **`prefers-reduced-motion` kills it entirely** — static, first set only, wrapped rows. Not slowed: stopped.
- **One per site.** No second ambient loop anywhere without a new exception entry here.

Geometry derives from item count (`PHOTOS.length`): strip width, loop-reset point, and duration all recompute; the full set is duplicated once in the DOM and the track translates by exactly one set's width before resetting to 0.

### 4.8 Place-change exception: Homepage ⇄ Work, and the Work stage

Roadmap item 14, agreed 2026-10 through two interactive motion studies. These moves carry the visitor between places rather than responding to a control, so they run longer than §4.2's 600ms ceiling. It is the site's one orchestrated motion moment. Source of truth for every number: `src/site/workTransition.js` (Homepage ⇄ Work) and the constants at the top of `src/site/work-stage.jsx` (the grid and the stage).

**Homepage → Work** (scroll down once, or "the work" in the rail; desktop only)

| Beat | Duration | Easing | Notes |
|---|---|---|---|
| The Homepage blurs in place | 750ms | `cubic-bezier(0.16, 1, 0.3, 1)` | To 18px blur, 18% desaturation and a 12% dim (`rgb(14,14,12)`). It does not move or sink back; the rail stays sharp on top, and its marker travels to "the work" (280ms) as the scroll starts. |
| Cards land as a fanned pile | 520ms each, 70ms apart, from 300ms | `cubic-bezier(0.34, 1.45, 0.64, 1)` | 04 first, 01 last on top; each drops 80px with a small bounce. |
| Pile holds | 260ms | | Long enough to register as a pile. |
| Pile deals out into the 2×2 grid | 780ms each, 70ms apart | `cubic-bezier(0.22, 1, 0.36, 1)` | 01 first. |

- **The blurred Homepage is the ground for all of /work**: behind the grid, an open project, and direct visits. Work reads as one layer over Home.
- **The pile plays on every arrival.** (A first-visit-only rule shipped first and was replaced after comparing live previews; `PILE_EVERY_TIME` in `workTransition.js` restores it.)
- **Going back** is not the entrance reversed: the cards fade where they are (240ms) and the Homepage comes back into focus (520ms, `cubic-bezier(0.3, 0, 0.2, 1)`). After browser Back, the Homepage clears its own blur.
- **No arrival animation.** Direct visits and reloads show the destination at rest, per the site's no-entrance rule.
- **Contact's overlay uses the same blur, dim and 750ms blur-in**, so the site's two layers over the Homepage feel related.
- The first version, a solid Work beige ground with the Homepage scrolling off upward (720ms, `cubic-bezier(0.76, 0, 0.24, 1)`), remains behind `GROUND = "solid"`.

**The /work grid and the Stage Manager**

| Move | Duration | Easing | What shows inside the card |
|---|---|---|---|
| Grid → project | 700ms, chosen card first, others 35ms apart | `cubic-bezier(0.65, 0, 0.35, 1)` | The face fades out (245ms); the case study fades in only after landing (300ms). |
| Project → grid | 460ms | `cubic-bezier(0.4, 0, 0.2, 1)` | The case study fades out first (130ms); the face returns a little before halfway. |
| Project → project (stack card clicked) | 640ms | `cubic-bezier(0.65, 0, 0.35, 1)` | The case study travels inside its card, scaled rather than reflowed, so the window is never empty. The leaving page fades just past halfway and its face follows. |
| Stack hover, fullscreen stack slide | 520ms | `cubic-bezier(.2,.8,.2,1)` | Unchanged from the original stage. |

**Scroll as a step.** One fresh gesture moves one step: the wheel must rest 300ms first, counting scrolls inside a case study, so momentum never skips ahead. Homepage ⇄ grid needs 40px of travel; grid → 01 and closing a project from the empty space around it need 140px. Scrolling inside an open case study only ever scrolls the case study. Esc, the red dot and Back remain the primary ways out.

**Reduced motion:** nothing travels. Each change is a short fade (about 200ms).

---

## 5. Implementation notes

- All tokens live in `:root` as CSS custom properties. Theme switching (`bw` / `cream` / `dark`) re-assigns these variables — no class-based theming.
- Type families are loaded once per page via a single Google Fonts request with all weights pinned: `DM Sans 400/500/600/700/800`, `Cormorant Garamond 400/500/600 + italic 400/500`, `JetBrains Mono 400/500/600`.
- The grid system is implicit, not explicit — there is no `.col-6` class. Use CSS Grid `grid-template-columns` directly, with the canonical column counts (1, 2, 3, 4, plus the `180px 1fr` and `240px 1fr` shells).
- Every page surface ends with the same `SiteFooter` (dark band, 3-column, sitemap + contact). It's the system's punctuation mark.

---

*Sheet 000 — Foundations. Suchi. Portfolio '26.*
