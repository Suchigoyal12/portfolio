import React from "react";
import { PROJECT_ROUTES } from "../routes.js";

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

// ── Stack card — rendered at natural 216×156 and scaled to the
// box the stage hands it (boxW). transform-origin top-left so the
// scaled render exactly fills a box of width boxW × boxW·156/216. ──
function CardFace({ c, boxW = CARD_W, revealStatus = false }) {
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
      <img src={c.doodle.src} alt="" style={{
        position: "absolute", zIndex: 3, pointerEvents: "none",
        left: c.doodle.x, top: c.doodle.y, width: c.doodle.w, height: c.doodle.h
      }} />
    </div>
  );
}

export { WORK_CARDS, CardFace, MONO, SANS, ACCENT, CARD_W, CARD_H };
