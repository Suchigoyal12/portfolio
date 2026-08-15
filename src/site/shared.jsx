import React from "react";
import { useNavigate } from "react-router-dom";
// =============================================================
// SHARED TOKENS, PRIMITIVES, NAV COMPONENTS
// Used across every page in the portfolio site.
// =============================================================

const SITE = {
  owner: "Suchi.",
  fullName: "Suchi Goyal",
  url: "www.suchi.com",
  year: "26",
  role: "Design Technologist",
  tagline: "OPERATING AS A DESIGN TECHNOLOGIST",
  email: "suchigoyal12@gmail.com",
  phone: "+91-9216700021",
  location: "Bangalore / India",
  resume: "read.cv/suchi",
  linkedin: "www.suchi.com",
  footerCredit: "BUILT AT THE INTERSECTION OF DESIGN & ENGINEERING"
};


const PROJECTS = [
{
  id: "uipath-check-access",
  no: "001",
  title: "Check Access",
  client: "UiPath",
  role: "Lead Product Designer",
  timeline: "'24 — '25",
  sector: "Enterprise SaaS",
  summary:
  "A unified framework for centralising audit governance in enterprise automation platform, via Check Access at UiPath.",
  tags: ["Design System", "User Research", "Interaction", "Information Architecture", "Onboarding", "Flows"],
  metric: "LIVE",
  href: "project-check-access.html",
  accent: true
},
{
  id: "ai-trust-layer",
  no: "002",
  title: "AI Trust Layer",
  client: "UiPath",
  role: "Product Designer",
  timeline: "'24 — '25",
  sector: "Enterprise SaaS",
  summary:
  "Designing trust into agentic workflows — governance, oversight, and observable model behaviour across the automation platform.",
  tags: ["Interaction", "Information Architecture", "Flows", "Governance"],
  metric: "LIVE",
  href: "project-ai-trust-layer.html"
},
{
  id: "uipath-admin-shell",
  no: "003",
  title: "Admin Shell",
  client: "UiPath",
  role: "Product Designer",
  timeline: "'25 — '26",
  sector: "Enterprise SaaS",
  summary:
  "Re-architecting the UiPath admin shell — the connective tissue every admin page is built inside, turning a sprawl of disconnected pages into one navigable system.",
  tags: ["Information Architecture", "Navigation", "Design System", "Multi-Tenant"],
  metric: "SHIPPED 25.1",
  href: "admin-shell-public.html"
},
{
  id: "release-comms",
  no: "004",
  title: "Release Communication System",
  client: "UiPath",
  role: "Product Design Intern",
  timeline: "'23",
  sector: "Enterprise SaaS",
  summary:
  "A system for surfacing what's new, what's changed, and what's deprecated — built so admins never get caught off guard by a release.",
  tags: ["Interaction", "Information Architecture", "Onboarding", "Flows"],
  metric: "CASE STUDY",
  href: "project-release-notes.html"
},
{
  id: "platform-system-contributions",
  no: "005",
  title: "Platform & System Contributions",
  client: "UiPath",
  role: "Product Designer",
  timeline: "'24 — '25",
  sector: "Enterprise SaaS",
  summary:
  "Tokens, components and patterns shipped into the admin design system — quietly making every other surface faster to build.",
  tags: ["Design System", "Interaction", "Data Density"],
  metric: "LIVE",
  href: "#"
},
{
  id: "first-aid-plus",
  no: "006",
  title: "First Aid Plus",
  client: "Self-Initiated",
  role: "Product Designer",
  timeline: "'24",
  sector: "Healthcare / Vision",
  summary:
  "Vision project — rethinking first-aid as an ambient companion that meets you in the moment, not after.",
  tags: ["Case Study", "Interaction", "Information Architecture", "Onboarding", "Flows"],
  metric: "VISION PROJECT",
  href: "#"
},
{
  id: "yelp-case-study",
  no: "007",
  title: "Yelp Case Study",
  client: "IIT Guwahati",
  role: "Student Project",
  timeline: "'23",
  sector: "Consumer",
  summary:
  "Academic case study — restructuring discovery flows around the way people actually decide where to eat.",
  tags: ["Case Study", "Information Architecture", "Flows"],
  metric: "CASE STUDY",
  href: "#"
}];


const EXPERIMENTS = [
{
  id: "linguistic-geometry",
  no: "EXP_01",
  title: "Linguistic Geometry",
  blurb: "Exploration of mapping semantic structures to radial coordinate systems.",
  href: "experiment-linguistic-geometry.html"
},
{
  id: "data-circles",
  no: "EXP_02",
  title: "Weight & Significance",
  blurb: "A non-literal data language. Circles represent weight; grids represent constraint.",
  href: "#"
},
{
  id: "atomic-architecture",
  no: "EXP_03",
  title: "Atomic Architecture V2.0",
  blurb: "Re-thinking component composition from the molecule down.",
  href: "#"
},
{
  id: "system-poetry",
  no: "EXP_04",
  title: "System Poetry",
  blurb: "Documentation written like instruction manuals; manuals written like haiku.",
  href: "#"
}];


// =============================================================
// THEME — three palettes, persisted via TweaksPanel
// =============================================================
const THEMES = {
  cream: {
    bg: "#E8E4DC",
    surface: "#FBFAF6",
    ink: "#1C1C1A",
    inkInverse: "#F4F1E9",
    muted: "#8A857C",
    line: "#D9D4C8",
    accent: "#B5522E",
    inkPanel: "#0E0E0C"
  },
  bw: {
    bg: "#EFECE4",
    surface: "#FBFAF6",
    ink: "#0E0E0C",
    inkInverse: "#F4F1E9",
    muted: "#7A786F",
    line: "#D9D4C8",
    accent: "#0E0E0C",
    inkPanel: "#0E0E0C"
  },
  dark: {
    bg: "#0E0E0C",
    surface: "#161613",
    ink: "#F4F1E9",
    inkInverse: "#0E0E0C",
    muted: "#7A786F",
    line: "#26241F",
    accent: "#D9763E",
    inkPanel: "#161613"
  }
};

const TYPE_SCALES = {
  compact: 0.9,
  default: 1,
  loose: 1.12
};

const sansFamily = "'DM Sans', sans-serif";
const monoFamily = "'JetBrains Mono', ui-monospace, monospace";
const serifFamily = "'Cormorant Garamond', serif";

// Default tweak values — wrapped in EDITMODE markers so changes can persist
const DEFAULT_TWEAKS = /*EDITMODE-BEGIN*/{
  "theme": "cream",
  "accent": "#B5522E",
  "typeScale": "default",
  "ownerName": "Suchi."
} /*EDITMODE-END*/;

// =============================================================
// RESPONSIVE STYLESHEET — injected on every page from shared.jsx
// =============================================================
const RESPONSIVE_CSS = `
  :root {
    /* Shared width system for large screens — same tokens used across
       every project page (short + long versions). Keep in sync with
       project-check-access-long-v2.html, which duplicates these since
       it's a standalone (non-React) document. */
    --content-w: 1160px;  /* body copy, metadata grids, standard section content */
    --frame-w: 1160px;    /* diagrams / illustrations / animation frames — never wider than content */
    --copy-w: 640px;      /* lede / intro paragraphs */
    --copy-w-wide: 760px; /* standard body paragraphs */
  }
  html, body { margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
  * { box-sizing: border-box; }
  img, svg { max-width: 100%; }

  /* HOME — 4 card grid */
  .home-stage { padding: 56px 48px 96px; background: var(--bg); }
  .home-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 24px;
    max-width: 1760px;
    margin: 0 auto;
  }
  .hc-card {
    text-decoration: none;
    border-radius: 18px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 640px;
    height: 78vh;
    max-height: 880px;
    transition: transform 220ms ease, box-shadow 220ms ease;
    font-family: 'DM Sans', sans-serif;
  }
  .hc-card:hover { transform: translateY(-6px); }
  .hc-top { padding: 22px 22px 0; }
  .hc-meta { display: flex; justify-content: space-between; gap: 12px; }
  .hc-middle { flex: 1; padding: 24px 22px 18px; overflow: hidden; }
  .hc-bottom { padding: 0 22px 22px; }
  .hc-foot { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; }
  .hc-headline { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; margin-top: 8px; }
  .hc-headline-text { font-size: 38px; }
  .hc-body { display: flex; flex-direction: column; gap: 18px; height: 100%; }
  .hc-body--center { align-items: center; justify-content: center; }
  .hc-p { font-family: 'DM Sans', sans-serif; font-size: 13px; line-height: 1.5; margin: 0; }
  .hc-chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .hc-chip {
    padding: 6px 11px;
    border-radius: 999px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .hc-card4-list { display: flex; flex-direction: column; gap: 12px; }
  .hc-card4-row { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; }

  @media (max-width: 1600px) {
    .home-stage { padding: 48px 32px 80px; }
    .home-grid { gap: 18px; }
    .hc-headline-text { font-size: 34px; }
  }
  @media (max-width: 1180px) {
    .home-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
    .hc-card { min-height: 600px; height: auto; }
    .hc-headline-text { font-size: 40px; }
  }
  @media (max-width: 820px) {
    .home-stage { padding: 32px 20px 64px; }
    .home-grid { grid-template-columns: 1fr; gap: 16px; }
    .hc-card { min-height: 0; }
    .hc-headline-text { font-size: 44px; }
  }
  @media (max-width: 520px) {
    .home-stage { padding: 20px 14px 48px; }
    .hc-top { padding: 18px 18px 0; }
    .hc-middle { padding: 20px 18px 14px; }
    .hc-bottom { padding: 0 18px 18px; }
    .hc-headline-text { font-size: 36px; }
    .hc-card4-row { flex-direction: column; gap: 4px; align-items: flex-start; }
  }

  /* GLOBAL RESPONSIVE OVERRIDES across all pages */
  @media (max-width: 1180px) {
    main section[style*="56px"], main section[style*="64px"] {
      padding-left: 40px !important; padding-right: 40px !important;
    }
    header[style*="sticky"] { padding-left: 32px !important; padding-right: 32px !important; }
    footer[style*="ink-panel"] { padding-left: 40px !important; padding-right: 40px !important; }
    main h1 { font-size: 80px !important; }
  }
  @media (max-width: 900px) {
    main section[style*="56px"], main section[style*="64px"], main section[style*="48px"], main section[style*="80px"], main section[style*="72px"], main section[style*="96px"], main section[style*="120px"] {
      padding-left: 24px !important; padding-right: 24px !important;
      padding-top: 48px !important; padding-bottom: 40px !important;
    }
    header[style*="sticky"] {
      padding: 14px 20px !important;
      flex-wrap: wrap !important;
      gap: 12px !important;
    }
    header[style*="sticky"] nav { gap: 14px !important; flex-wrap: wrap !important; }
    header[style*="sticky"] > span:last-child { display: none !important; }

    section[style*="1fr 1fr"], section[style*="grid-template-columns"] {
      grid-template-columns: 1fr !important; gap: 28px !important;
    }
    section[style*="180px 1fr"], section[style*="180px minmax"] {
      grid-template-columns: 1fr !important;
    }
    a[style*="60px 1fr 1fr 100px 60px"] {
      grid-template-columns: 40px 1fr !important;
      gap: 12px !important;
      padding: 18px 0 !important;
    }
    a[style*="60px 1fr 1fr 100px 60px"] > *:nth-child(n+3) { display: none !important; }

    footer[style*="ink-panel"] {
      grid-template-columns: 1fr !important;
      gap: 28px !important;
      padding: 40px 24px 24px !important;
    }
    footer[style*="ink-panel"] > div[style*="text-align: right"] { text-align: left !important; }
    footer[style*="ink-panel"] > div[style*="1 / -1"] {
      flex-direction: column !important; gap: 8px !important; align-items: flex-start !important;
    }

    aside[style*="100vh"] {
      width: 100% !important;
      height: auto !important;
      position: relative !important;
      border-right: none !important;
      border-bottom: 1px solid var(--line) !important;
      padding: 20px 24px !important;
      flex-direction: row !important;
      flex-wrap: wrap !important;
      gap: 16px !important;
      align-items: center !important;
    }
    aside[style*="100vh"] nav { flex-direction: row !important; flex-wrap: wrap !important; gap: 12px !important; }
    aside[style*="100vh"] > div:nth-child(n+3) { display: none !important; }

    main h1 { font-size: 56px !important; }
    main section > div[style*="flex"][style*="space-between"] {
      flex-wrap: wrap !important; gap: 16px !important;
    }
  }
  @media (max-width: 560px) {
    main section[style*="56px"], main section[style*="64px"], main section[style*="48px"], main section[style*="80px"], main section[style*="72px"], main section[style*="96px"], main section[style*="120px"] {
      padding-left: 16px !important; padding-right: 16px !important;
      padding-top: 36px !important; padding-bottom: 28px !important;
    }
    header[style*="sticky"] { padding: 12px 16px !important; }
    header[style*="sticky"] nav { gap: 10px !important; }
    header[style*="sticky"] nav a { font-size: 10px !important; }
    main h1 { font-size: 42px !important; line-height: 1 !important; }
  }
`;

// Injected while a project page is mounted, and removed when it unmounts.
//
// The original ran this once at import time and left the stylesheet in the
// document forever, which was harmless when each page was its own document. In
// one app it is not: the rules are broad — `main h1`, `header[style*="sticky"]`,
// `main section[style*="56px"]` — and `main h1` below 560px would reach the 404
// page's display line. Tying the stylesheet's life to the pages that need it
// keeps it off every other route without editing a single selector.
//
// The Archivo <link> the original also injected is gone: it is in the app shell
// now, so re-requesting it here would only duplicate the request.
// `enabled` exists for one caller: the long Check Access page. It is the only
// ported case study that was hand-written HTML rather than a React page, so it
// never loaded this stylesheet, and the overrides above are broad enough to
// reach it — `main h1` resizes its hero below 1180px. Everything else passes
// nothing and gets the stylesheet, exactly as before.
export function useResponsiveCss(enabled = true) {
  React.useEffect(() => {
    if (!enabled) return undefined;
    if (document.getElementById("__suchi_responsive")) return undefined;
    const el = document.createElement("style");
    el.id = "__suchi_responsive";
    el.textContent = RESPONSIVE_CSS;
    document.head.appendChild(el);
    return () => { el.remove(); };
  }, [enabled]);
}

// =============================================================
// THEME HOOK — reads tweaks, applies CSS variables to :root
// =============================================================
const THEME_VARS = ["--bg", "--surface", "--ink", "--ink-inverse", "--muted", "--line", "--accent", "--ink-panel", "--type-scale"];

function useTheme(tweaks) {
  React.useEffect(() => {
    const prevBg = document.body.style.background;
    const prevColor = document.body.style.color;
    const t = THEMES[tweaks.theme] || THEMES.bw;
    const scale = TYPE_SCALES[tweaks.typeScale] || 1;
    const root = document.documentElement;
    root.style.setProperty("--bg", t.bg);
    root.style.setProperty("--surface", t.surface);
    root.style.setProperty("--ink", t.ink);
    root.style.setProperty("--ink-inverse", t.inkInverse);
    root.style.setProperty("--muted", t.muted);
    root.style.setProperty("--line", t.line);
    root.style.setProperty("--accent", tweaks.accent || t.accent);
    root.style.setProperty("--ink-panel", t.inkPanel);
    root.style.setProperty("--type-scale", scale);
    document.body.style.background = t.bg;
    document.body.style.color = t.ink;

    // These are writes to :root and <body> — above any route wrapper. On
    // separate HTML pages they died with the page; in one app they outlive it
    // and tint whatever route comes next. Undo them on unmount.
    return () => {
      THEME_VARS.forEach((v) => root.style.removeProperty(v));
      document.body.style.background = prevBg;
      document.body.style.color = prevColor;
    };
  }, [tweaks.theme, tweaks.accent, tweaks.typeScale]);
}

// =============================================================
// PRIMITIVES
// =============================================================
function MonoLabel({ children, color = "var(--muted)", size = 10, style }) {
  return (
    <span
      style={{
        fontFamily: monoFamily,
        fontSize: size,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color,
        ...style
      }}>
      
      {children}
    </span>);

}

function WaveMotif({ color = "var(--ink)", width = 220, height = 56 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 220 56" fill="none" aria-hidden="true">
      <path
        d="M2 30 Q 35 -8, 70 30 T 138 30 T 218 30"
        stroke={color}
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round" />
      
    </svg>);

}

function Stamp({ size = 32, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="14.5" fill="none" stroke={color} strokeWidth="1" />
      <circle cx="16" cy="16" r="7" fill="none" stroke={color} strokeWidth="1" />
      <circle cx="16" cy="16" r="2" fill={color} />
    </svg>);

}

// Abstract circle-on-grid data viz from the design system
function CirclesOnGrid({ width = 320, height = 200, seed = 1, accent = "var(--accent)" }) {
  // Deterministic pseudo-random based on seed
  const rand = (i) => {
    const x = Math.sin(seed * 9301 + i * 49297) * 233280;
    return x - Math.floor(x);
  };
  const circles = [];
  for (let i = 0; i < 7; i++) {
    circles.push({
      cx: 30 + rand(i) * (width - 60),
      cy: 30 + rand(i + 100) * (height - 60),
      r: 8 + rand(i + 200) * 28,
      filled: rand(i + 300) > 0.5
    });
  }
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <rect width={width} height={height} fill="#C5D8E4" />
      {/* grid */}
      {Array.from({ length: Math.floor(width / 20) }).map((_, i) =>
      <line key={`v${i}`} x1={i * 20} y1={0} x2={i * 20} y2={height} stroke="#A8BFD0" strokeWidth="0.5" />
      )}
      {Array.from({ length: Math.floor(height / 20) }).map((_, i) =>
      <line key={`h${i}`} x1={0} y1={i * 20} x2={width} y2={i * 20} stroke="#A8BFD0" strokeWidth="0.5" />
      )}
      {circles.map((c, i) =>
      <circle
        key={i}
        cx={c.cx}
        cy={c.cy}
        r={c.r}
        fill={c.filled ? accent : "none"}
        stroke={accent}
        strokeWidth="1" />

      )}
    </svg>);

}

// =============================================================
// SCROLL PROGRESS BAR — top of viewport, fills as you scroll
// =============================================================
function ScrollProgress({ accent }) {
  const [p, setP] = React.useState(0);
  React.useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: "transparent",
        zIndex: 50,
        pointerEvents: "none"
      }}>
      
      <div
        style={{
          width: `${p * 100}%`,
          height: "100%",
          background: accent || "var(--accent)",
          transition: "width 60ms linear"
        }} />
      
    </div>);

}

// =============================================================
// TOP-CHROME HORIZON — single shared reference so the rail wordmark
// and every page's hero-topbar (PRESS ESC / PROJECT XX) sit on one
// baseline and cannot drift per page.
//   CHROME_TOP       = box-top of the rail wordmark (rail padding-top)
//   CHROME_ASCENT_DELTA = Archivo(19px) ascent 15.5 − JetBrains Mono(9px) ascent 9
//   CHROME_LABEL_TOP = mono-label box-top that lands its baseline on the
//                      wordmark baseline (55.5px measured).
// chromeHorizon(sectionPadTop) → position:relative offset (no reflow) that
// pulls a hero-topbar onto the shared baseline given its section's padding.
// =============================================================
const CHROME_TOP = 40;
const CHROME_ASCENT_DELTA = 6.5;
const CHROME_LABEL_TOP = CHROME_TOP + CHROME_ASCENT_DELTA; // 46.5
const RAIL_WORDMARK_GAP = 64; // wordmark → first TOC item (masthead separation)
const RAIL_MONO_OPTICAL = -1; // mono columns pulled to optical flush with the wordmark 'S'
const chromeHorizon = (sectionPadTop) => ({ position: "relative", top: CHROME_LABEL_TOP - sectionPadTop });

// =============================================================
// LEFT RAIL NAV — V5 layout — used on project detail pages
// =============================================================
function LeftRail({ active, owner, sections, currentSection, status }) {
  const navigate = useNavigate();

  // The wordmark goes to the homepage — the whole page, never the card.
  // A case study renders inside the stage manager's iframe, so a plain link
  // would navigate the FRAME and leave the homepage sitting inside the little
  // card window. Framed, this takes window.top out to the homepage; standalone
  // it is an ordinary client-side route change with no reload. The href stays
  // real so middle-click and open-in-new-tab behave.
  const onBrandClick = (e) => {
    e.preventDefault();
    const framed = window.self !== window.top;
    if (!framed) { navigate("/"); return; }
    try { window.top.location.href = "/"; } catch (err) { window.location.href = "/"; }
  };

  return (
    <aside
      className="left-nav"
      style={{
        width: 240,
        borderRight: "1px solid var(--line)",
        padding: `${CHROME_TOP}px 24px`,
        position: "sticky",
        top: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: RAIL_WORDMARK_GAP,
        flexShrink: 0,
        // Both carried over from long Check Access's hand-written rail when it
        // was folded into this component. That page is the only one whose
        // content scrolls beneath the rail rather than beside it, so without
        // these the copy shows through. On the other four the background is
        // the same colour the page already paints and nothing overlaps, so
        // they are inert there — verified by re-running the pixel diff on all
        // four after the change.
        background: "var(--bg)",
        zIndex: 40,
        overflowY: "auto"
      }}>
      
      <a href="/" onClick={onBrandClick} style={{ textDecoration: "none" }}>
        <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: 16, letterSpacing: "-0.03em", lineHeight: 1, color: "var(--ink)" }}>
          SuCHI
        </div>
      </a>

      {sections &&
      <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginLeft: RAIL_MONO_OPTICAL }}>
            {sections.map((s) =>
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(s.id);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            style={{
              fontFamily: monoFamily,
              fontSize: 10,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: currentSection === s.id ? "var(--ink)" : "var(--muted)",
              textDecoration: "none",
              fontWeight: currentSection === s.id ? 600 : 400,
              display: "flex",
              gap: 8
            }}>
            
                <span style={{ color: "var(--muted)" }}>{s.no}</span>
                <span>{s.label}</span>
              </a>
          )}
          </div>
        </div>
      }

      <div style={{ marginTop: "auto", marginLeft: RAIL_MONO_OPTICAL }}>
        {status &&
        status.map(([k, v]) =>
        <div key={k} style={{ marginBottom: 10 }}>
              <MonoLabel size={9}>{k}</MonoLabel>
              <div style={{ fontFamily: monoFamily, fontSize: 10, letterSpacing: "0.06em", color: "var(--ink)", marginTop: 2, whiteSpace: "pre-line" }}>
                {v}
              </div>
            </div>
        )}
      </div>
    </aside>);

}

// =============================================================
// PAGE SHELL — wraps any page; handles theme + tweaks + nav choice
// =============================================================
function PageShell({ active, navMode = "top", sections, currentSection, status, children }) {
  // The developer tweaks panel was removed in Stage 1, so there is nothing left
  // to probe for and the defaults are simply the tweaks. The hook that fed the
  // panel went with it — it referenced components that no longer exist.
  const tweaks = DEFAULT_TWEAKS;
  useTheme(tweaks);
  const owner = tweaks.ownerName || SITE.owner;

  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "100vh" }}>
      <ScrollProgress />
      {navMode === "rail" ?
      <div style={{ display: "flex", alignItems: "flex-start" }}>
          <LeftRail
          active={active}
          owner={owner}
          sections={sections}
          currentSection={currentSection}
          status={status} />
        
          <main style={{ flex: 1, minWidth: 0 }}>{children({ tweaks, owner })}</main>
        </div> :

      <main>{children({ tweaks, owner })}</main>
      }
    </div>);

}

export {
  SITE, PROJECTS, EXPERIMENTS, THEMES, TYPE_SCALES, DEFAULT_TWEAKS,
  sansFamily, monoFamily, serifFamily,
  CHROME_TOP, CHROME_LABEL_TOP, chromeHorizon,
  useTheme, MonoLabel, WaveMotif, Stamp, CirclesOnGrid, ScrollProgress,
  LeftRail, PageShell
};
