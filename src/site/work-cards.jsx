import React from "react";
import { PROJECT_ROUTES } from "../routes.js";
import { dims } from "./image-dims.js";

// =============================================================
// WORK — Card data + stack-card rendering
// Ported from legacy/site-work/cards.jsx.
//
// The teaser face renders the coded card from card-stack/assets
// ("Stack Cards- rest" / "- hover", 216×156): num row, two-line
// uppercase headline, label + status meta row (status reveals on
// hover), and a doodle PNG positioned in the card's own 216×156
// coordinate space. The focused card body is still an iframe of the
// real project.
//
// One change from the original: the hand-maintained `href` strings are
// gone. Each card reads its route from PROJECT_ROUTES instead, which is
// what routes.js was written to expect — "WORK_CARDS drops its
// hand-maintained href strings and reads PROJECT_ROUTES for iframe
// sources instead." Key, number and title come from there too, so the
// stack order and the breadcrumb cannot drift from the route table.
// =============================================================

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const SANS = "'DM Sans', system-ui, sans-serif";
const ACCENT = "#B5522E";

// Natural card dimensions (Figma). Everything scales off these.
const CARD_W = 216;
const CARD_H = 156;

// ── Card face content ───────────────────────────────────────
// Everything the route table does not already carry, keyed by the same
// project key. Pulled directly from card-stack/assets/cards-data.js.
const CARD_FACES = {
  "check-access": {
    num: "01",
    headline: "user\naccess",
    label: "access control",
    status: "Shipped",
    dot: "green",
    doodle: { src: "/site-work/doodle-1-t.png", x: 104, y: 37, w: 107, h: 70.7 }
  },
  "ai-trust": {
    num: "02",
    headline: "ai trust\nlayer",
    label: "governance",
    status: "Shipped",
    dot: "green",
    doodle: { src: "/site-work/doodle-2-t.png", x: 93, y: 59, w: 101, h: 55.2 }
  },
  "admin-shell": {
    num: "03",
    headline: "admin\nshell",
    label: "design system",
    status: "slated",
    dot: "amber",
    doodle: { src: "/site-work/doodle-3-t.png", x: 101, y: 29, w: 125, h: 83.3 }
  },
  "release-notes": {
    num: "04",
    headline: "release\nnotes",
    label: "communication",
    status: "Exploratory",
    dot: "muted",
    doodle: { src: "/site-work/doodle-4-t.png", x: 87, y: 36, w: 129.2, h: 76 }
  }
};

const WORK_CARDS = PROJECT_ROUTES.map((r) => ({
  key: r.key,
  n: r.n,
  title: r.title,
  href: r.path,
  // The last segment of the route, which is what /work/:slug? matches on.
  // `key` is the stage manager's own identifier and travels in the
  // postMessage contract; the two differ for AI Trust Layer and always have.
  slug: r.path.split("/").pop(),
  ...CARD_FACES[r.key]
}));

// ── Palette (all cards paper) ───────────────────────────────
const CARD_BG = "#FBFAF6";
const INK = "#111110";
const INK2 = "#20201E";
const MUTED = "#8A857C";
const GREEN = "#1F8A5B";
const AMBER = "#FABC4E";

// ── Named style tokens (mono-sm) — .card-num / .card-meta ──
const CARD_NUM_STYLE = {
  fontFamily: MONO, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
  textTransform: "uppercase", color: INK2, lineHeight: "12px"
};
const CARD_META_STYLE = {
  fontFamily: MONO, fontSize: 10, fontWeight: 400, letterSpacing: "0.08em",
  textTransform: "uppercase", color: MUTED, lineHeight: "12px"
};

function dotStyle(dot) {
  return {
    width: 6, height: 6, borderRadius: "50%", boxSizing: "border-box", flex: "none",
    background: dot === "green" ? GREEN : dot === "amber" ? AMBER : dot === "muted" ? MUTED : "transparent",
    border: dot === "amber" || dot === "hollow" ? "0.75px solid " + MUTED : "none"
  };
}

// ── Large card spec ─────────────────────────────────────────
// The stack card is designed at 216×156. Scaled up uniformly, its 10px
// labels become 20px and the doodle hugs the corner, which reads as an
// enlarged thumbnail rather than a card. So a wider card is laid out at its
// real size from a second spec, drawn for the 424px Work grid card and agreed
// in the pile-to-grid motion study:
//
//   · headline 20 → 34px, slightly tighter leading and tracking
//   · number and label 10 → 11px only; small type steps up far less than
//     the card does
//   · padding 16/22 → 28/32px
//   · doodle 1.6×, centered on the right instead of anchored to the corner
//
// Between 216 and 424 every value is blended by width, so a card growing out
// of the stack never jumps. The blend reads the card's LIVE width through CSS
// container units (cqw), not the width React was given: when the grid opens
// into the stage, the cards' boxes are mid-transition, and a face laid out for
// the destination size would sit shrunken in a still-large card (or spill out
// of a still-small one) for the whole move. With cqw the browser re-blends
// every frame on its own. Each value is a straight line in width, clamped at
// both specs:  a + (width − 216) · (b − a) / 208.
//
// At exactly 216 the blend lands on the small spec's positions. At rest at 216
// and below the original scaled render is still used, so the stack cards are
// untouched; the fluid face appears only on wider cards and during a move.
const CARD_W_LG = 424;
const SPEC_SM = { px: 22, py: 16, gap: 16, num: 10, head: 20, lh: 23, ls: -0.4, meta: 10 };
const SPEC_LG = { px: 32, py: 28, gap: 20, num: 11, head: 34, lh: 35.36, ls: -0.952, meta: 11 };
const DOODLE_LG = 1.6;
const DOODLE_RIGHT_LG = 26;

function fluid(a, b) {
  const k = (b - a) / (CARD_W_LG - CARD_W);
  return `clamp(${Math.min(a, b)}px, calc(${a}px + (100cqw - ${CARD_W}px) * ${k.toFixed(6)}), ${Math.max(a, b)}px)`;
}
const FLUID = Object.fromEntries(Object.keys(SPEC_SM).map((k) => [k, fluid(SPEC_SM[k], SPEC_LG[k])]));

function FluidCardFace({ c, revealStatus }) {
  const d = c.doodle;
  // The doodle is placed from the right edge and the vertical center, so its
  // position stays a straight line in width: hugging the corner at 216,
  // centered on the right at 424.
  const right = CARD_W - (d.x + d.w);
  const cy = d.y + d.h / 2 - CARD_H / 2;
  const metaStyle = { ...CARD_META_STYLE, fontSize: FLUID.meta, lineHeight: 1.2 };
  return (
    <div style={{ position: "absolute", inset: 0, containerType: "inline-size" }}>
      <div style={{
        position: "absolute", inset: 0,
        boxSizing: "border-box", padding: `${FLUID.py} ${FLUID.px}`,
        display: "flex", flexDirection: "column",
        background: CARD_BG, borderRadius: 14, overflow: "hidden"
      }}>
        <span style={{ ...CARD_NUM_STYLE, fontSize: FLUID.num, lineHeight: 1.2, position: "relative", zIndex: 2 }} className="card-num">{c.num}</span>

        <h3 style={{
          fontFamily: SANS, fontSize: FLUID.head, fontWeight: 800, lineHeight: FLUID.lh,
          letterSpacing: FLUID.ls, textTransform: "uppercase", color: INK,
          margin: `${FLUID.gap} 0 0`, whiteSpace: "pre-line", position: "relative", zIndex: 2
        }}>{c.headline}</h3>

        <div style={{
          marginTop: "auto", position: "relative", zIndex: 2,
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <span style={metaStyle} className="card-meta">{c.label}</span>
          <span style={{
            display: "flex", alignItems: "center", gap: 4,
            opacity: revealStatus ? 1 : 0,
            transform: revealStatus ? "translateX(0)" : "translateX(4px)",
            transition: "opacity 0.3s ease, transform 0.3s ease"
          }}>
            <span style={dotStyle(c.dot)} />
            <span style={metaStyle} className="card-meta">{c.status}</span>
          </span>
        </div>

        <img src={d.src} {...dims(d.src)} alt="" style={{
          position: "absolute", zIndex: 3, pointerEvents: "none",
          right: fluid(right, DOODLE_RIGHT_LG),
          top: `calc(50% + ${fluid(cy, 2)})`,
          transform: "translateY(-50%)",
          width: fluid(d.w, d.w * DOODLE_LG),
          height: fluid(d.h, d.h * DOODLE_LG)
        }} />
      </div>
    </div>
  );
}

// ── Stack card — rendered at natural 216×156 and scaled to the
// box the stage hands it (boxW). transform-origin top-left so the
// scaled render exactly fills a box of width boxW × boxW·156/216.
// Wider than 216, or while the card is moving (`fluid`), the large spec
// above takes over. ──
function CardFace({ c, boxW = CARD_W, revealStatus = false, fluid: moving = false }) {
  if (boxW > CARD_W || moving) return <FluidCardFace c={c} revealStatus={revealStatus} />;
  const scale = boxW / CARD_W;
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, width: CARD_W, height: CARD_H,
      transform: "scale(" + scale + ")", transformOrigin: "top left",
      boxSizing: "border-box", padding: "16px 22px",
      display: "flex", flexDirection: "column", gap: 16,
      background: CARD_BG, borderRadius: 14, overflow: "hidden"
    }}>
      {/* top — project number */}
      <div style={{
        height: 12, flex: "none", position: "relative", zIndex: 2,
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <span style={CARD_NUM_STYLE} className="card-num">{c.num}</span>
      </div>

      {/* mid — two-line headline */}
      <div style={{ height: 68, flex: "none", position: "relative", zIndex: 2 }}>
        <h3 style={{
          fontFamily: SANS, fontSize: 20, fontWeight: 800, lineHeight: 1.15,
          letterSpacing: "-0.02em", textTransform: "uppercase", color: INK, margin: 0,
          whiteSpace: "pre-line", position: "absolute", top: 0, left: 0, right: 0
        }}>{c.headline}</h3>
      </div>

      {/* meta — label + status (status reveals on hover) */}
      <div style={{
        height: 12, flex: "none", position: "relative", zIndex: 2,
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <span style={CARD_META_STYLE} className="card-meta">{c.label}</span>
        <span style={{
          display: "flex", alignItems: "center", gap: 4,
          opacity: revealStatus ? 1 : 0,
          transform: revealStatus ? "translateX(0)" : "translateX(4px)",
          transition: "opacity 0.3s ease, transform 0.3s ease"
        }}>
          <span style={dotStyle(c.dot)} />
          <span style={CARD_META_STYLE} className="card-meta">{c.status}</span>
        </span>
      </div>

      {/* doodle — positioned in the card's own coordinate space */}
      <img src={c.doodle.src} {...dims(c.doodle.src)} alt="" style={{
        position: "absolute", zIndex: 3, pointerEvents: "none",
        left: c.doodle.x, top: c.doodle.y, width: c.doodle.w, height: c.doodle.h
      }} />
    </div>
  );
}

export { WORK_CARDS, CardFace, MONO, SANS, ACCENT, CARD_W, CARD_H };
