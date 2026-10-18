import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { WORK_CARDS, CardFace, MONO as W_MONO, SANS as W_SANS, ACCENT, CARD_W as CARD_NAT_W, CARD_H as CARD_NAT_H } from "./work-cards.jsx";
import { useContact } from "../components/ContactOverlay.jsx";
import SiteRail from "../layouts/SiteRail.jsx";
import { REFERENCE as FIT_REFERENCE } from "../hooks/useFit.js";
import * as WT from "./workTransition.js";
import Home from "../routes/Home.jsx";
import "../routes/Work.css";

// =============================================================
// WORK — Stage Manager
// Ported from legacy/site-work/stage.jsx.
//
// The swap mechanism is the important thing to understand before editing:
// the four cards are persistent absolutely-positioned elements that CSS-
// transition their left/top/width/height whenever the layout changes. That
// transition IS the cross-path motion. There is no separate animation code
// and nothing to sequence — change the numbers getLayout returns and the
// cards travel there.
//
// Behaviour preserved from the original, apart from the /work grid below:
//   — project URLs open in stage mode, that project focused
//   — focused card body = iframe of the real project page
//   — chrome bar: red + green only, nav pill, breadcrumb
//   — in-page fullscreen: chrome hides, iframe edge-to-edge, stack slides
//     fully off-screen right (invisible, no peek/cue); 48px right-edge hover
//     zone slides it back in, leaving the zone + stack hides it after a
//     400ms grace
//   — Contact button kept; dock / clock pill / palette removed
//   — all cards light
//
// FULLSCREEN IS IN-PAGE, NOT NATIVE. Commit aaf8287 made that the default:
// requestFullscreen() takes the whole browser window fullscreen and hides the
// browser's own chrome, which is not what the green dot means. HANDOFF.md and
// MIGRATION_BRIEF.md are both still stale on this — they describe native
// fullscreen and a post-switch sequencing fix that no longer applies.
//
// WHAT WAS REMOVED IN THE PORT, and why it is safe:
// The original carried a full native-fullscreen reconciliation layer — a
// fullscreenchange listener, a visibilitychange backstop, and two click
// backstops — every one of them gated on `nativeFsRef.current`. That flag was
// only ever set true immediately before a requestFullscreen() call, and
// aaf8287 deleted that call. Grepped before removing: six assignments, all
// `false`, and no `= true` anywhere. Every one of those four branches was
// unreachable, so none of them is carried over, and `nativeFsRef` is gone
// with them.
//
// WHAT WAS KEPT, deliberately: the two exitFullscreen() calls below. They are
// gated on isNativeFs(), which reads document.fullscreenElement — the
// browser's live state — not on that flag. A visitor in F11 fullscreen can
// reach them in some browsers. That is a real question about what SHOULD
// happen to an F11 visitor, logged in POST_MIGRATION_ROADMAP.md rather than
// answered here.
// =============================================================

const CARD_AR = CARD_NAT_H / CARD_NAT_W; // 0.7222 (h / w) — landscape

// Motion — unchanged from v3
const EASE = "cubic-bezier(.2,.8,.2,1)";
const SWAP_MS = 520;

// Geometry — tuned for the LANDSCAPE cards (216×156, ratio 0.7222). The stack
// is a right-edge column of three cards that keep their native aspect at every
// size; the focused card is the iframe filling the remaining left area.
const MARGIN = 24;
const STAGE_CAP = 1600; // cap stage width; center as an island above this (matches Homepage .stage)
const STACK_W = 216;    // stack column footprint = native card width
const OFF_EDGE = 14;    // card hangs this far past the right edge
const STACK_GAP = 16;   // vertical gap between the three stack cards
const GAP_TO_STACK = 18; // gutter between focused frame's right edge + stack cards
const CHROME_H = 46;

// ============================================================
// Reload state — a deliberate behaviour change, not parity
// ============================================================
// Reloading the stage used to drop you back on card 01, windowed, at the top
// of the page. Three things now survive it. The focused project lives in the
// URL, which makes it shareable as well as reloadable. The other two live in
// sessionStorage, because they are this tab's state rather than an address:
// nobody wants to send someone a link that opens fullscreen halfway down.
//
// sessionStorage, not localStorage, deliberately — it dies with the tab, so a
// visit next week starts clean rather than resuming a session they have
// forgotten. Every access is wrapped: it throws outright in some private
// browsing modes, and failing to remember a scroll position must never be the
// thing that breaks the page.
const SS_FS = "work:fs";
const ssScrollKey = (path) => "work:scroll:" + path;
const ssFrameKey = (cardKey) => "work:frame:" + cardKey;

function ssGet(k) {
  try { return window.sessionStorage.getItem(k); } catch (e) { return null; }
}
function ssSet(k, v) {
  try { window.sessionStorage.setItem(k, v); } catch (e) {/* private mode — carry on */}
}

// ============================================================
// The /work grid — roadmap item 14
// ============================================================
// /work is an overview: the four cards in a 2×2 grid at the large card size,
// with the site rail beside it. Opening a card is the same mechanism as a
// stack swap (the cards travel to the stage layout's numbers), with its own
// timing, agreed in the pile-to-grid motion study:
//
//   open   700ms in-out, the chosen card first, the others 35ms apart. The
//          card's face fades out as it grows; the case study fades in only
//          once it has landed, so the eye is never tracking two things.
//   close  460ms, quicker than opening, which is the rule for exits.
//
// Project URLs still open straight onto the stage, and stack swaps keep their
// original 520ms motion. Arriving on /work has no entrance animation: this
// site has none on arrival (PROJECT_CONTEXT).
const GRID_CARD_MAX = 424;  // the large card spec's design width (work-cards.jsx)
const GRID_GAP = 28;
const GRID_SIDE = 160;      // clear of the site rail, mirrored on the right
const GRID_VMARGIN = 60;
const MORPH_MS = 700;
const MORPH_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const MORPH_STAGGER = 35;
const UNMORPH_MS = 460;
const UNMORPH_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
// Project to project (a stack card clicked while a project is open). It was
// 520ms on a quick-start curve, which read as abrupt beside the grid's open;
// it now shares that move's in-out curve and its rule that the case study
// arrives only once the card has landed (agreed 2026-10). Hovering the stack
// and the fullscreen stack slide keep SWAP_MS.
const SWAP_MOVE_MS = 640;

// Scroll as a step, not a scroll: from the grid, scrolling on opens 01; in
// the empty space around an open project, scrolling up closes it. Three
// guards keep it from firing by accident (agreed 2026-10):
//   · it must be a fresh gesture: the wheel rested for FRESH_MS first,
//     counting wheel events inside the case study too, so momentum left over
//     from reading can never close the project;
//   · it must travel STEP_PX in one gesture, so a nudge does nothing;
//   · it is a shortcut only. Esc, the red dot and Back stay the main ways out,
//     and nothing on screen advertises it.
const FRESH_MS = 300;
const STEP_PX = 140;

function getGridLayout({ vw, vh, cardKey }) {
  const i = WORK_CARDS.findIndex((c) => c.key === cardKey);
  const stageW = Math.min(vw, STAGE_CAP);
  const offsetX = (vw - stageW) / 2;
  const byW = (stageW - GRID_SIDE * 2 - GRID_GAP) / 2;
  const byH = (vh - GRID_VMARGIN * 2 - GRID_GAP) / 2 / CARD_AR;
  const w = Math.min(GRID_CARD_MAX, byW, byH);
  const h = w * CARD_AR;
  const left0 = offsetX + (stageW - (w * 2 + GRID_GAP)) / 2;
  const top0 = (vh - (h * 2 + GRID_GAP)) / 2;
  return {
    left: left0 + (i % 2) * (w + GRID_GAP),
    top: top0 + Math.floor(i / 2) * (h + GRID_GAP),
    width: w,
    height: h,
    rotateY: 0,
    zIndex: 20 + i,
    radius: 14
  };
}

function gridHover(rect) {
  return { ...rect, ty: -6, scale: 1.012 };
}

// Where the Homepage puts its rail at this width, so the grid's rail sits on
// exactly the same pixels. Mirrors useFit's three bands without calling it:
// ≥1440 the stage is centered at 1440; 1300–1440 it fills the window;
// 900–1300 the whole stage scales by w/1300. The rail's top is 54.511% of the
// stage height in every band (RailLayout.css).
function railDock(vw, vh) {
  if (vw >= 1440) return { left: (vw - 1440) / 2 + 24, top: vh * 0.54511, scale: 1 };
  if (vw >= FIT_REFERENCE) return { left: 24, top: vh * 0.54511, scale: 1 };
  const s = vw / FIT_REFERENCE;
  return { left: 24 * s, top: vh * 0.54511, scale: s };
}

// ============================================================
// Layout math
// ============================================================
function getLayout({ vw, vh, focusedKey, stackOrder, cardKey, fs }) {
  // Capped, centered stage. Below STAGE_CAP, stageW === vw and offsetX === 0
  // (behavior unchanged); above it the layout is an island of width STAGE_CAP
  // shifted right by offsetX to center it.
  const stageW = Math.min(vw, STAGE_CAP);
  const offsetX = (vw - stageW) / 2;

  // FOCUSED
  if (cardKey === focusedKey) {
    if (fs) {
      return { left: 0, top: 0, width: vw, height: vh, rotateY: 0, zIndex: 10, radius: 0 };
    }
    // Stage width = viewport minus the stack's VISIBLE width and the
    // gutter (GAP_TO_STACK). STACK_W is only the card's own width now
    // — the part that hangs off-edge (OFF_EDGE) doesn't steal stage
    // space — so the focused frame keeps its original generous width
    // and the wider landscape cards are absorbed by a tighter gutter.
    const available0 = vh - MARGIN * 2;
    let sw = STACK_W;
    const wanted0 = sw * CARD_AR * 3 + STACK_GAP * 2;
    if (wanted0 > available0) sw *= available0 / wanted0;
    const stackVisible = sw - OFF_EDGE;
    const focusedW = stageW - MARGIN - GAP_TO_STACK - stackVisible;
    return {
      left: offsetX + MARGIN,
      top: MARGIN,
      width: focusedW,
      height: vh - MARGIN * 2,
      rotateY: 0,
      zIndex: 10,
      radius: 18
    };
  }

  // STACK — three landscape cards, native aspect preserved. Start
  // from the native width; if three of them plus gaps overflow the
  // vertical space (short viewports / tablets), scale width + height
  // down together so the aspect never distorts.
  const idx = stackOrder.indexOf(cardKey);
  const available = vh - MARGIN * 2;
  let w = STACK_W;
  let h = w * CARD_AR;
  const wanted = h * 3 + STACK_GAP * 2;
  if (wanted > available) {
    const k = available / wanted;
    w *= k;
    h *= k;
  }
  const totalH = h * 3 + STACK_GAP * 2;
  const top0 = MARGIN + Math.max(0, (available - totalH) / 2);
  return {
    left: offsetX + stageW - w + OFF_EDGE,
    top: top0 + idx * (h + STACK_GAP),
    width: w,
    height: h,
    rotateY: -10,
    zIndex: 44 - idx, // top of stack nearest the viewer
    radius: 14
  };
}

function hoverNudge(rect) {
  return { ...rect, left: rect.left - 46, rotateY: 0, scale: 1.04, zIndex: 60 };
}

function useViewport() {
  const [vp, setVp] = React.useState({ w: window.innerWidth, h: window.innerHeight });
  React.useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return vp;
}

// ============================================================
// Chrome bar — red (close) + nav pill + green (fullscreen).
// Glyphs hidden until the cluster is hovered. Tooltips. Center
// breadcrumb "NN/04 · WORK › PROJECT NAME".
// ============================================================
function ChromeBar({ c, onClose, onPrev, onNext, onFullscreen, radius = 0 }) {
  return (
    <div className="wk-chrome" style={{ borderTopLeftRadius: radius, borderTopRightRadius: radius }}>
      <div className="wk-tl-cluster">
        <button className="wk-dot wk-red" data-tip="Close" aria-label="Close" onClick={onClose}>
          <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 1.5 L6.5 6.5 M6.5 1.5 L1.5 6.5" stroke="rgba(80,10,8,0.85)" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
        <div className="wk-navpill">
          <button data-tip="Previous project" aria-label="Previous project" onClick={onPrev}><span>&#10216;</span></button>
          <button data-tip="Next project" aria-label="Next project" onClick={onNext}><span>&#10217;</span></button>
        </div>
        <button className="wk-dot wk-green" data-tip="Fullscreen · F" aria-label="Fullscreen" onClick={onFullscreen}>
          <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
            <path d="M2 6 L6 2 M3.2 2 H6 V4.8" stroke="rgba(6,60,38,0.9)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="wk-crumb">
        <span className="wk-crumb-n">{String(c.n).padStart(2, "0")}/04</span>
        <span className="wk-sep">·</span>
        <span className="wk-crumb-sec">WORK</span>
        <span className="wk-sep">›</span>
        <span className="wk-crumb-title">{c.title}</span>
      </div>

    </div>);

}

// ============================================================
// Card window — persistent positioned element. iframe when
// focused (once mounted); CardFace teaser overlay otherwise.
// ============================================================
function CardWindow({
  c, src, layout, isFocused, isInStack, isHovered, isMounted, paused, fs, tx = 0,
  iframeRef, onClick, onHover, onUnhover, onIframeLoad, chromeProps, morph = null, moving = false, frameBox = null
}) {
  const { left, top, width, height, rotateY, scale = 1, ty = 0, zIndex, radius } = layout;
  // Chrome bar shows only when focused AND not in fullscreen.
  const chromeOn = isFocused && !fs;
  // `morph` is set while the grid opens or closes, or two projects swap:
  // { dir, delay } for this card. Otherwise (hover, the fullscreen stack) the
  // original motion applies, unchanged.
  const ms = morph ? (morph.dir === "open" ? MORPH_MS : morph.dir === "swap" ? SWAP_MOVE_MS : UNMORPH_MS) : SWAP_MS;
  const ease = morph ? (morph.dir === "close" ? UNMORPH_EASE : MORPH_EASE) : EASE;
  const d = morph ? ` ${morph.delay}ms` : "";
  const transition = paused ? "none" : morph && morph.reduced ? "opacity 200ms ease" :
  `left ${ms}ms ${ease}${d}, top ${ms}ms ${ease}${d}, width ${ms}ms ${ease}${d}, height ${ms}ms ${ease}${d}, transform ${ms}ms ${ease}${d}, opacity 360ms ease`;

  // Arriving on stage (from the grid, or by swap) and leaving it.
  const opening = morph && (morph.dir === "open" || morph.dir === "swap") && isFocused;
  const closing = morph && (morph.dir === "close" || morph.dir === "swap" && morph.wasFocused);
  const landed = morph && !morph.reduced ? (morph.dir === "swap" ? SWAP_MOVE_MS : MORPH_MS) + 30 : 0;
  // Every case study is laid out once, at the open frame's size, and scaled
  // to its card's width, so it never reflows while a card moves. The scale
  // shares the card's own duration, curve and delay, so the two stay locked.
  //
  // What shows during a move depends on the move (agreed 2026-10):
  //   swap (project to project)  the case study travels with its card. The
  //        one coming in grows from a live thumbnail into the page; the one
  //        leaving shrinks into the stack until its face settles over it. A
  //        swap is page to page, and an empty window there read as a gap.
  //   open / close (the grid)    the card carries its face, and the case study
  //        fades in only once the card has landed, and out first on the way
  //        back. Here the card itself is the subject; a page inside it read
  //        as clutter.
  // In fullscreen the open frame fills the window exactly as before.
  const travel = !!morph && morph.dir === "swap";
  const fsFocused = fs && isFocused;
  let frameStyle;
  if (fsFocused || !frameBox) {
    frameStyle = {
      width: "100%",
      height: chromeOn ? `calc(100% - ${CHROME_H}px)` : "100%",
      marginTop: chromeOn ? CHROME_H : 0,
      transition: "opacity 280ms ease 120ms, margin-top 420ms " + EASE + ", height 420ms " + EASE
    };
  } else {
    const k = width / frameBox.width;
    frameStyle = {
      width: frameBox.width,
      height: frameBox.height - CHROME_H,
      transformOrigin: "0 0",
      transform: `translateY(${CHROME_H * k}px) scale(${k})`,
      transition: paused || morph && morph.reduced ? "none" :
      `transform ${ms}ms ${ease}${d}` + (
      closing ? travel ? `, opacity 140ms ease ${Math.round(ms * 0.5)}ms` : ", opacity 130ms ease" : "")
    };
  }

  // The leaving card's page and face hand over in sequence, not on top of
  // each other, so two layers of type never show at once. In a swap the page
  // goes just past halfway and the face follows; closing to the grid the page
  // has already gone, and the face returns a little before halfway.
  const faceIn = travel ? `wkFade 200ms ease ${Math.round(ms * 0.62)}ms both` :
  `wkFade 220ms ease ${Math.round(UNMORPH_MS * 0.45)}ms both`;

  return (
    <div
      onClick={isInStack ? onClick : undefined}
      onMouseEnter={isInStack ? onHover : undefined}
      onMouseLeave={isInStack ? onUnhover : undefined}
      data-card-key={c.key}
      data-state={isFocused ? "focused" : "stack"}
      style={{
        position: "absolute",
        left, top, width, height,
        transform: `perspective(1600px) rotateY(${rotateY}deg) translateX(${tx}px) translateY(${ty}px) scale(${scale})`,
        transformOrigin: "center center",
        transition,
        zIndex,
        cursor: isInStack ? "pointer" : "default",
        willChange: "transform, left, top, width, height"
      }}>

      <div style={{
        position: "absolute", inset: 0, borderRadius: radius, overflow: "hidden",
        background: "#FBFAF6",
        boxShadow: isFocused ?
        "0 54px 96px -48px rgba(0,0,0,0.36)" :
        isHovered ?
        "0 34px 64px -30px rgba(0,0,0,0.42)" :
        "0 24px 48px -30px rgba(0,0,0,0.30)",
        transition: "box-shadow 320ms ease, border-radius 420ms " + EASE
      }}>
        {/* iframe (real project page) */}
        {isMounted ?
        <iframe
          ref={iframeRef}
          src={src}
          title={c.title}
          onLoad={isFocused && onIframeLoad ? (e) => onIframeLoad(e.target) : undefined}
          style={{
            ...frameStyle,
            border: 0, display: "block",
            opacity: isFocused ? 1 : 0,
            animation: opening && morph.reduced ? "wkFade 200ms ease both" :
            opening && !travel ? `wkFade 300ms ease ${landed}ms both` : "none",
            pointerEvents: isFocused ? "auto" : "none",
            background: "#FBFAF6"
          }} /> :

        null}

        {/* Teaser face overlay when stacked, and while a grid card opens */}
        {!isFocused || opening ?
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          opacity: isFocused ? 0 : 1,
          transition: opening ? "opacity 245ms cubic-bezier(0.2, 0, 0, 1)" : "none",
          animation: closing && morph.wasFocused ? faceIn : "none"
        }}>
            {/* `fluid` while moving: the face follows the card's live size */}
            <CardFace c={c} boxW={width} revealStatus={isHovered} fluid={!!morph || moving} />
          </div> :
        null}

      </div>

      {/* Chrome bar rendered outside the clipped frame so tooltips aren't cut off */}
      {chromeOn ?
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: CHROME_H, borderRadius: `${radius}px ${radius}px 0 0`, overflow: "visible", zIndex: 7,
        animation: opening ? `wkFade 300ms ease ${landed}ms both` : "none"
      }}>
        <ChromeBar c={c} radius={radius} {...chromeProps} />
      </div> :
      null}
    </div>);

}

// ============================================================
// MAIN
// ============================================================
export default function WorkStage({ focused, seedFrame = null, seedFs = false }) {
  const vp = useViewport();
  const navigate = useNavigate();
  const location = useLocation();
  const contact = useContact();

  // /work with no project is the grid. Every project URL is the stage.
  const overview = !focused;
  const overviewRef = React.useRef(overview);
  overviewRef.current = overview;
  const locationRef = React.useRef(location);
  locationRef.current = location;
  const reducedMotion = typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // `focused` is the slug from the URL, and the URL is the record of which
  // project is on stage — so a reload comes back to the same card. It is not
  // the source of truth while running: `order` is, because it also carries the
  // stack arrangement the layout animates against. The two are kept in step
  // from both directions — a card click writes the URL, and a URL change
  // (browser back, a pasted link) moves the card.
  const [order, setOrder] = React.useState(() => {
    const keys = WORK_CARDS.map((c) => c.key);
    const card = focused && WORK_CARDS.find((c) => c.slug === focused);
    return card ? [card.key, ...keys.filter((k) => k !== card.key)] : keys;
  });
  const [hovered, setHovered] = React.useState(null);
  // Seeded from whichever card is focused on arrival, not from card 01. The
  // original could only ever open on 01; now /work/ai-trust-layer opens
  // straight onto 02, and seeding this wrong left the focused card with no
  // iframe in it at all.
  // On the grid nothing is open, so no case study loads at first. 01 is
  // preloaded once the grid has settled, because scrolling on opens it.
  const [mounted, setMounted] = React.useState(() => focused ? new Set([order[0]]) : new Set());

  // Each card's iframe source, resolved once. Normally the project's own
  // route; after a reload, whatever page that card was actually showing.
  //
  // Restricted to the card's own subtree, so a stale or hand-edited value can
  // only ever point somewhere that card could have reached on its own. The
  // test is the route itself or a path SEGMENT below it — an ordinary
  // startsWith is not enough, and letting one through is exactly what the
  // first version did: "/work/release-notes-evil" starts with
  // "/work/release-notes" and was accepted straight into an iframe src.
  //
  // Resolved once and held in state rather than read during render, because
  // changing an iframe's src is a navigation: recomputing would reload the
  // card.
  //
  // `seedFrame` is the URL asking for a specific page inside a card — a direct
  // link to /work/check-access/full. It wins over the stored value, because the
  // URL is a deliberate request and sessionStorage is only a memory of where
  // you were. It goes through the same guard: an unvalidated value here would
  // be exactly the injection the guard exists to stop.
  const [frameSrc] = React.useState(() => {
    const out = {};
    WORK_CARDS.forEach((c) => {
      const wanted = seedFrame && seedFrame.slug === c.slug ? seedFrame.path : ssGet(ssFrameKey(c.key));
      const ok = wanted === c.href || wanted && wanted.startsWith(c.href + "/");
      out[c.key] = ok ? wanted : c.href;
    });
    return out;
  });
  // A sub-page URL opens fullscreen: the section rail is gated on
  // `is-fullscreen`, so a shared long-read link landing in stage view would
  // arrive with no table of contents.
  const [fs, setFs] = React.useState(() => seedFs || ssGet(SS_FS) === "1");
  const [stackRevealed, setStackRevealed] = React.useState(false);
  const [swapping, setSwapping] = React.useState(false);
  const iframeRefs = React.useRef({});
  const containerRef = React.useRef(null);
  const backdropRef = React.useRef(null);   // the blurred Homepage (experiment)
  const veilRef = React.useRef(null);
  const lastWheelRef = React.useRef(0);   // last wheel event, here or in a frame
  const gestureRef = React.useRef(null);  // { acc } while a fresh gesture runs
  const hideTimer = React.useRef(null);
  const swapTimer = React.useRef(null);
  const fsRef = React.useRef(fs);
  React.useEffect(() => {fsRef.current = fs;ssSet(SS_FS, fs ? "1" : "0");}, [fs]);

  // The page-level rule the original set on html/body. On its own document it
  // died with the page; here it has to come off on unmount or every route
  // after this one loses its scrollbar.
  React.useLayoutEffect(() => {
    document.documentElement.classList.add("work-route");
    return () => document.documentElement.classList.remove("work-route");
  }, []);

  // Both timers outlive the component if it unmounts mid-flight — one would
  // setState on a dead component, the other would leave the stack hidden.
  React.useEffect(() => () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (swapTimer.current) clearTimeout(swapTimer.current);
  }, []);

  // ── Fullscreen right-edge stack reveal ──
  function revealStack() {
    if (hideTimer.current) {clearTimeout(hideTimer.current);hideTimer.current = null;}
    setStackRevealed(true);
  }
  function scheduleHideStack() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {setStackRevealed(false);hideTimer.current = null;}, 400);
  }

  // A single exit path used from every surface (parent keydown, in-iframe
  // keydown). Exits real native fullscreen if present, and ALWAYS clears our
  // fullscreen UI state — so a stuck-out-of-sync UI is recovered no matter
  // where the event originated.
  function exitFsAnywhere() {
    if (isNativeFs()) {
      try {(document.exitFullscreen || document.webkitExitFullscreen).call(document);} catch (e) {}
    }
    if (fsRef.current) {
      setFs(false);
      setStackRevealed(false);
      if (hideTimer.current) {clearTimeout(hideTimer.current);hideTimer.current = null;}
    }
  }

  // Toggle `is-fullscreen` on the focused iframe's own <body>, and wire the
  // F key from inside the iframe back to the parent's fullscreen toggle.
  // Because focus can live INSIDE the iframe, the parent window never sees
  // its keydowns — so Escape (exit) is wired into the iframe document too,
  // mirroring the parent-level one.
  function syncIframeFs(el, active, cardKey) {
    if (!el) return;
    try {
      const doc = el.contentDocument;
      if (!doc || !doc.body) return;
      doc.body.classList.toggle("is-fullscreen", !!active);
      // Guard on the DOCUMENT, not the iframe element: following an in-iframe
      // link replaces the document, so a per-element flag would leave the new
      // page's exit listeners unwired. A fresh document has no flag → rewired.
      if (!doc.__workWired) {
        doc.__workWired = true;

        // Which page this card is showing, so a reload comes back to it. The
        // card can hold more than its own project: the short Check Access page
        // links to the long read, and following it replaces the document
        // inside the same card. Without this, reloading there quietly returned
        // you to the short version.
        if (cardKey) ssSet(ssFrameKey(cardKey), doc.location.pathname);

        doc.addEventListener("keydown", (e) => {
          if (e.metaKey || e.ctrlKey || e.altKey) return;
          if (e.key === "f" || e.key === "F") {
            e.preventDefault();toggleFs();
          } else if (e.key === "Escape") {
            if (fsRef.current) {e.preventDefault();exitFsAnywhere();} else
            {e.preventDefault();closeRef.current();}
          }
        });

        // Wheel inside the case study counts toward the "fresh gesture" guard,
        // so reading momentum that drifts into the margin cannot close it.
        doc.addEventListener("wheel", () => {
          lastWheelRef.current = performance.now();
          gestureRef.current = null;
        }, { passive: true });

        // Scroll position, remembered per framed page and restored on reload.
        // Keyed on the framed document's own path rather than the card key,
        // because following the long-read link replaces the document inside
        // the same card — keyed on the card, the long page's position would be
        // restored onto the short one.
        const win = el.contentWindow;
        const key = ssScrollKey(doc.location.pathname);
        let last = 0;
        doc.addEventListener("scroll", () => {
          // Throttled: this fires every frame while scrolling, and writing to
          // sessionStorage that often is wasted work.
          const now = Date.now();
          if (now - last < 200) return;
          last = now;
          ssSet(key, String(Math.round(win.scrollY)));
        }, { passive: true });

        const saved = parseInt(ssGet(key) || "0", 10);
        if (saved > 0) {
          // Restored more than once, for the same reason the long page's
          // fragment links need two passes: at load the case study has not
          // finished laying out, so the document is not yet tall enough to
          // scroll that far and the browser clamps the position short. Each
          // later pass corrects it as fonts resolve and images take up their
          // space.
          //
          // The guard is whether the READER has scrolled, not whether the
          // position has moved — checking the latter is what made the first
          // version stop at the clamped value and never recover, because its
          // own restore looked exactly like the reader having scrolled.
          let owned = true;
          const release = () => { owned = false; };
          doc.addEventListener("wheel", release, { passive: true, once: true });
          doc.addEventListener("touchstart", release, { passive: true, once: true });
          doc.addEventListener("keydown", release, { once: true });

          const restore = () => {
            if (!owned) return;
            if (Math.abs(win.scrollY - saved) < 2) return; // already there
            win.scrollTo(0, saved);
          };
          restore();
          if (doc.fonts) doc.fonts.ready.then(restore);
          win.setTimeout(restore, 300);
          win.setTimeout(restore, 1000);
        }
      }
    } catch (e) {/* cross-origin — ignore */}
  }

  // In the grid nothing is focused. On a project URL the URL decides, so the
  // first frame after Back or a pasted link already shows the right card; the
  // [focused] effect below brings `order` into step a moment later.
  const urlCard = focused ? WORK_CARDS.find((c) => c.slug === focused) : null;
  const focusedKey = overview ? null : urlCard ? urlCard.key : order[0];
  // Stack always lists the non-focused projects in ascending project order,
  // regardless of swap history.
  const stackOrder = WORK_CARDS.map((c) => c.key).filter((k) => k !== focusedKey);

  // ── Grid ⇄ stage morph ──
  // Decided during render, not in an effect: the cards' transitions must be
  // set in the same commit as their new positions, or the browser starts the
  // move with the old 520ms timing. A ref, so StrictMode's second render sees
  // the change already recorded and does not start a second morph.
  const prevOverviewRef = React.useRef(overview);
  const lastFocusedRef = React.useRef(focusedKey);
  const morphRef = React.useRef(null);
  const [, bumpMorph] = React.useReducer((x) => x + 1, 0);
  if (prevOverviewRef.current !== overview) {
    const prevId = morphRef.current ? morphRef.current.id : 0;
    morphRef.current = overview ?
    { id: prevId + 1, dir: "close", key: lastFocusedRef.current } :
    { id: prevId + 1, dir: "open", key: focusedKey };
    prevOverviewRef.current = overview;
  }
  if (focusedKey) lastFocusedRef.current = focusedKey;
  const morph = morphRef.current;
  React.useEffect(() => {
    if (!morph) return undefined;
    // Held until the case study has faded in (open) or the face has (close).
    const hold = morph.dir === "open" ? MORPH_MS + MORPH_STAGGER * 3 + 380 :
    morph.dir === "swap" ? SWAP_MOVE_MS + 380 : UNMORPH_MS + 260;
    const t = setTimeout(() => {
      if (morphRef.current && morphRef.current.id === morph.id) {morphRef.current = null;bumpMorph();}
    }, reducedMotion ? 220 : hold);
    return () => clearTimeout(t);
  }, [morph && morph.id]);
  function morphFor(cardKey) {
    if (!morph) return null;
    if (reducedMotion) return { dir: morph.dir, delay: 0, reduced: true };
    if (morph.dir === "close") return { dir: "close", delay: 0, wasFocused: cardKey === morph.key };
    if (morph.dir === "swap") return { dir: "swap", delay: 0, wasFocused: cardKey === morph.prev };
    const seq = [morph.key, ...WORK_CARDS.map((c) => c.key).filter((k) => k !== morph.key)];
    return { dir: "open", delay: seq.indexOf(cardKey) * MORPH_STAGGER };
  }

  // ── Homepage ⇄ Work (roadmap item 14, step 3) ──
  // See workTransition.js. Arriving from Home, the ground turns from cream to
  // beige and the cards land as a pile, then deal out into the grid (first
  // time in the tab), or simply fade up into their places (every time after).
  // The cards' React layout is the grid throughout; the entrance is played on
  // top with the Web Animations API, so it never fights the stage's own CSS
  // transitions and leaves nothing behind when it ends.
  const [entering, setEntering] = React.useState(false);
  const enteringRef = React.useRef(false);
  enteringRef.current = entering;
  const entranceRan = React.useRef(false);
  React.useLayoutEffect(() => {
    if (entranceRan.current) return;
    entranceRan.current = true;
    const at = WT.handoff.leftHomeAt;
    WT.handoff.leftHomeAt = 0;
    const el = containerRef.current;
    if (!overview || !el || !at || performance.now() - at > 1500) return;
    const reduced = WT.reducedMotion();
    const pile = !reduced && (WT.PILE_EVERY_TIME || !WT.ssGet(WT.PILE_SEEN_KEY));
    if (pile) WT.ssSet(WT.PILE_SEEN_KEY, "1");
    setEntering(true);
    const blur = WT.GROUND === "blur" && backdropRef.current;
    const anims = blur ? [
    backdropRef.current.animate([{ filter: WT.blurFilter(0) }, { filter: WT.blurFilter(1) }],
    { duration: reduced ? 200 : WT.BLUR_IN_MS, easing: WT.BLUR_IN_EASE, fill: "backwards" }),
    veilRef.current.animate([{ opacity: 0 }, { opacity: WT.BLUR_DIM }],
    { duration: reduced ? 200 : WT.BLUR_IN_MS, easing: WT.BLUR_IN_EASE, fill: "backwards" })] :
    [el.animate([{ backgroundColor: WT.CREAM }, { backgroundColor: WT.BEIGE }],
    { duration: reduced ? 200 : WT.GROUND_MS, easing: "ease", fill: "backwards" })];
    const landStart = blur ? WT.BLUR_LAND_START : WT.LAND_START;
    const vw = window.innerWidth, vh = window.innerHeight;
    WORK_CARDS.forEach((c, i) => {
      const card = el.querySelector(`[data-card-key="${c.key}"]`);
      if (!card) return;
      if (reduced) {
        anims.push(card.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, fill: "backwards" }));
        return;
      }
      if (!pile) {
        anims.push(card.animate([{ translate: "0 24px", opacity: 0 }, { translate: "0 0", opacity: 1 }],
        { duration: WT.RISE_MS, easing: WT.RISE_EASE, delay: WT.RISE_START + i * WT.RISE_STAGGER, fill: "backwards" }));
        return;
      }
      // Land: 04 first, 01 last on top. Then deal: 01 first.
      const p = WT.PILE[i];
      const g = getGridLayout({ vw, vh, cardKey: c.key });
      const landAt = landStart + (WORK_CARDS.length - 1 - i) * WT.LAND_STAGGER;
      const dealAt = landStart + (WORK_CARDS.length - 1) * WT.LAND_STAGGER + WT.LAND_MS + WT.PILE_HOLD + i * WT.DEAL_STAGGER;
      anims.push(card.animate([{ translate: `0 ${-WT.LAND_DROP}px`, scale: 1.06 }, { translate: "0 0", scale: 1 }],
      { duration: WT.LAND_MS, easing: WT.LAND_EASE, delay: landAt, fill: "backwards" }));
      anims.push(card.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, delay: landAt, fill: "backwards" }));
      anims.push(card.animate([
      { left: (vw - CARD_NAT_W) / 2 + p.x + "px", top: (vh - CARD_NAT_H) / 2 + 10 + p.y + "px", width: CARD_NAT_W + "px", height: CARD_NAT_H + "px", rotate: p.r + "deg" },
      { left: g.left + "px", top: g.top + "px", width: g.width + "px", height: g.height + "px", rotate: "0deg" }],
      { duration: WT.DEAL_MS, easing: WT.DEAL_EASE, delay: dealAt, fill: "backwards" }));
    });
    Promise.all(anims.map((a) => a.finished)).then(() => {
      setEntering(false);
      // Momentum from the scroll that started all this must not open 01.
      lastWheelRef.current = performance.now();
      gestureRef.current = null;
    }).catch(() => {});
  }, []);

  // Load every case study once the page is at rest, one at a time, so a card
  // always has its page ready to travel with it. 01 first: scrolling on from
  // the grid opens it. Waits out entrances and moves so loading never
  // competes with motion.
  React.useEffect(() => {
    if (entering || morph) return undefined;
    const missing = WORK_CARDS.map((c) => c.key).filter((k) => !mounted.has(k));
    if (!missing.length) return undefined;
    const t = setTimeout(() => setMounted((m) => {const n = new Set(m);n.add(missing[0]);return n;}), mounted.size ? 400 : 600);
    return () => clearTimeout(t);
  }, [entering, morph && morph.id, mounted]);

  // Leaving the grid for Home, by scrolling up or the rail's "my context":
  // the cards fade where they are and the ground goes back to cream, then the
  // route changes and Home slides its content back down.
  const leavingHomeRef = React.useRef(false);
  const [railActive, setRailActive] = React.useState(null);
  function leaveForHome() {
    const el = containerRef.current;
    if (!overviewRef.current || leavingHomeRef.current || enteringRef.current || morphRef.current || !el) return;
    leavingHomeRef.current = true;
    setRailActive("/");
    WT.previewRail("/");
    const reduced = WT.reducedMotion();
    const blur = WT.GROUND === "blur" && backdropRef.current;
    const anims = blur ? [
    backdropRef.current.animate([{ filter: WT.blurFilter(1) }, { filter: WT.blurFilter(0) }],
    { duration: reduced ? 200 : WT.BLUR_OUT_MS, easing: WT.BLUR_OUT_EASE, delay: reduced ? 0 : 60, fill: "forwards" }),
    veilRef.current.animate([{ opacity: WT.BLUR_DIM }, { opacity: 0 }],
    { duration: reduced ? 200 : WT.BLUR_OUT_MS, easing: WT.BLUR_OUT_EASE, delay: reduced ? 0 : 60, fill: "forwards" })] :
    [el.animate([{ backgroundColor: WT.BEIGE }, { backgroundColor: WT.CREAM }],
    { duration: reduced ? 200 : WT.BACK_GROUND_MS, easing: "ease", fill: "forwards" })];
    el.querySelectorAll("[data-card-key]").forEach((card) => anims.push(
      card.animate([{ opacity: 1 }, { opacity: 0 }], { duration: reduced ? 200 : WT.BACK_FADE_MS, easing: "ease", fill: "forwards" })
    ));
    Promise.all(anims.map((a) => a.finished)).then(() => {
      WT.handoff.faded = true;
      navigate("/");
    }).catch(() => {});
  }
  const leaveForHomeRef = React.useRef(leaveForHome);
  leaveForHomeRef.current = leaveForHome;
  // Back from the grid lands on Home with no state; this is how Home knows.
  // A layout-effect cleanup, deliberately: React runs those before the next
  // page's layout effects, where Home looks for this. A plain effect's
  // cleanup runs after them, and Home would never see it.
  React.useLayoutEffect(() => () => {
    if (overviewRef.current && window.location.pathname === "/") WT.handoff.leftGridAt = performance.now();
  }, []);

  // The grid has no fullscreen; leaving for it drops out of fullscreen first.
  React.useEffect(() => {if (overview && fsRef.current) setFs(false);}, [overview]);

  // ── Swap (state model from prompt) ──
  function focusProject(key) {
    if (swapping || key === order[0]) return;
    setMounted((m) => {const n = new Set(m);n.add(key);return n;});
    const prev = order[0];
    setOrder((o) => {
      const next = o.map((k) => k === key ? prev : k);
      next[0] = key;
      return next;
    });
    setHovered(null);
    setSwapping(true);
    swapTimer.current = setTimeout(() => {setSwapping(false);swapTimer.current = null;}, SWAP_MOVE_MS + 40);
    // Recorded before the re-render this handler causes, so the cards pick up
    // the swap's timing in the same commit as their new positions.
    const prevId = morphRef.current ? morphRef.current.id : 0;
    morphRef.current = { id: prevId + 1, dir: "swap", key, prev };

    // Record the focused project in the URL. `replace`, not push: moving a
    // card is a change of view, not a navigation, and the chrome bar's ‹ ›
    // already walks the projects. Pushing would make the browser's own back
    // button step backwards through the cards, so leaving Work would take as
    // many presses as cards you had looked at.
    // The history entry's state rides along, so a project opened from the grid
    // still knows to step Back to it after any number of swaps.
    const card = WORK_CARDS.find((c) => c.key === key);
    if (card) navigate(card.href, { replace: true, state: locationRef.current.state });
  }

  // ── The grid: open and close ──
  // Opening pushes a history entry, so Back returns to the grid. Swapping
  // between projects on the stage still replaces it, as before.
  function openFromGrid(key) {
    const card = WORK_CARDS.find((c) => c.key === key);
    if (!card || !overviewRef.current) return;
    setMounted((m) => {const n = new Set(m);n.add(key);return n;});
    setOrder((o) => [key, ...o.filter((k) => k !== key)]);
    setHovered(null);
    navigate(card.href, { state: { fromGrid: true } });
  }
  function closeToGrid() {
    if (overviewRef.current) return;
    const st = locationRef.current.state;
    if (st && st.fromGrid) navigate(-1);else navigate("/work");
  }
  const closeRef = React.useRef(closeToGrid);
  closeRef.current = closeToGrid;

  function adjacent(dir) {
    const fixed = WORK_CARDS.map((c) => c.key);
    const i = fixed.indexOf(order[0]);
    focusProject(fixed[(i + dir + fixed.length) % fixed.length]);
  }

  // ── Cross-frame "next case study" hand-off ──
  // A focused project page (loaded in the iframe) posts
  // { type: "work:focus", key } when its bottom next-case-study link is
  // clicked; we bring that project's card onto the stage instead of letting
  // the iframe navigate. focusRef always points at the latest focusProject.
  const focusRef = React.useRef(focusProject);
  focusRef.current = focusProject;
  React.useEffect(() => {
    const onMsg = (e) => {
      const d = e.data;
      if (d && d.type === "work:focus" && d.key) {
        // Preserve fullscreen across the hand-off: leave `fs` untouched — the
        // syncIframeFs effect re-applies the fullscreen body class to the
        // newly-focused iframe on order change.
        focusRef.current(d.key);
      }
      // A card navigated WITHIN itself, client-side. syncIframeFs records the
      // frame path on document load, which catches following a plain <a> into
      // the long read — but a React Router navigate() replaces no document, so
      // the stage would otherwise never learn the card came back, and
      // re-entering /work would restore the long read forever.
      //
      // Same guard as frameSrc's seeding: the value ends up in an iframe src,
      // so it must be the card's own route or a segment below it.
      if (d && d.type === "work:frame" && typeof d.path === "string") {
        const card = WORK_CARDS.find((c) => c.slug === d.slug);
        if (card && (d.path === card.href || d.path.startsWith(card.href + "/"))) {
          ssSet(ssFrameKey(card.key), d.path);
        }
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // The other direction: the URL changed without a card being clicked —
  // browser back or forward, or a link pasted into the bar. Move the card to
  // match. focusProject no-ops when the key is already focused, so the click
  // path's own navigate() lands here and does nothing, rather than looping.
  React.useEffect(() => {
    if (!focused) return;
    const card = WORK_CARDS.find((c) => c.slug === focused);
    if (card) focusRef.current(card.key);
  }, [focused]);

  // ── Fullscreen ──
  // isNativeFs reads the browser's live state. Our own fullscreen never sets
  // it — see the header note on what was removed and what was kept.
  function isNativeFs() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }
  function toggleFs() {
    if (fsRef.current || isNativeFs()) {
      // exit
      if (isNativeFs()) {
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } else {
        setFs(false);
      }
    } else {
      // enter — in-page fullscreen ONLY. Deliberately does not call
      // requestFullscreen(): that takes the whole browser window fullscreen
      // and hides the browser's own chrome, which is not what this control
      // means. The stage window expands within the page instead.
      setFs(true);
    }
  }

  // Keep the focused iframe's body class in sync with the fs state
  // (covers iframe swaps and loads too).
  React.useEffect(() => {
    syncIframeFs(iframeRefs.current[order[0]], fs, order[0]);
  }, [fs, order]);

  // ── Keyboard ──
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = e.target && e.target.tagName || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (overviewRef.current) return; // the grid has no stage to drive
      if (e.key === "f" || e.key === "F") {e.preventDefault();toggleFs();} else
      if (e.key === "ArrowUp") {e.preventDefault();adjacent(-1);} else
      if (e.key === "ArrowDown") {e.preventDefault();adjacent(1);} else
      if (e.key === "Escape") {
        if (contact.isOpen) {contact.close();} else
        if (fsRef.current) exitFsAnywhere();else
        closeRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line
  }, [order, contact.isOpen]);

  // ── Scroll as a step ──
  // See FRESH_MS / STEP_PX at the top for the three guards.
  const openFromGridRef = React.useRef(openFromGrid);
  openFromGridRef.current = openFromGrid;
  const narrowView = vp.w < 900;
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const onWheel = (e) => {
      const now = performance.now();
      const gap = now - lastWheelRef.current;
      lastWheelRef.current = now;
      if (morphRef.current || enteringRef.current || leavingHomeRef.current) {gestureRef.current = null;return;}
      if (gap > FRESH_MS) gestureRef.current = { acc: 0 };
      const g = gestureRef.current;
      if (!g) return;
      g.acc += e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 800 : 1);
      if (overviewRef.current) {
        if (g.acc >= STEP_PX) {gestureRef.current = null;openFromGridRef.current(WORK_CARDS[0].key);} else
        if (g.acc <= -WT.STEP_PX && window.innerWidth >= 900) {gestureRef.current = null;leaveForHomeRef.current();}
        return;
      }
      // Only the empty space around an open project: not the stack cards, not
      // the chrome bar, never in fullscreen (which has no empty space).
      if (fsRef.current || e.target !== el) {gestureRef.current = null;return;}
      if (g.acc <= -STEP_PX) {gestureRef.current = null;closeRef.current();}
    };
    el.addEventListener("wheel", onWheel, { passive: true });
    return () => el.removeEventListener("wheel", onWheel);
  }, [narrowView]);

  // ── Mobile fallback ──
  if (vp.w < 900) {
    return <MobileList onContact={contact.open} />;
  }

  // Same centering offset getLayout uses; 0 below STAGE_CAP.
  const offsetX = Math.max(0, (vp.w - STAGE_CAP) / 2);

  // The open project's windowed frame at this viewport: the size every case
  // study is laid out at, wherever its card currently is.
  const frameBox = getLayout({ vw: vp.w, vh: vp.h, focusedKey: "_", stackOrder: [], cardKey: "_", fs: false });

  const chromeProps = {
    // Keyed on our own fs state, not isNativeFs(): fullscreen is in-page and
    // has no fullscreenElement, so testing native here would send Close to the
    // homepage while fullscreen rather than exiting fullscreen first.
    onClose: () => {if (fsRef.current) exitFsAnywhere();else closeToGrid();},
    onPrev: () => adjacent(-1),
    onNext: () => adjacent(1),
    onFullscreen: toggleFs
  };

  return (
    <div className="route-work">
      <div ref={containerRef} style={{ position: "fixed", inset: 0, overflow: "hidden", background: WT.GROUND === "blur" ? WT.CREAM : "var(--bg)", fontFamily: W_SANS }}>
        {/* Experiment: the Homepage, blurred, behind everything on /work. Not
            interactive and hidden from assistive tech; the Work rail above it
            is the real one. */}
        {WT.GROUND === "blur" ?
        <div aria-hidden="true" inert="" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
            <div ref={backdropRef} style={{ position: "absolute", inset: 0, filter: WT.blurFilter(1) }}>
              <Home backdrop />
            </div>
            <div ref={veilRef} style={{ position: "absolute", inset: 0, background: "rgb(14, 14, 12)", opacity: WT.BLUR_DIM }} />
          </div> :
        null}
        {WORK_CARDS.map((c) => {
          const isFocused = c.key === focusedKey;
          const isInStack = !isFocused;
          let layout = overview ?
          getGridLayout({ vw: vp.w, vh: vp.h, cardKey: c.key }) :
          getLayout({ vw: vp.w, vh: vp.h, focusedKey, stackOrder, cardKey: c.key, fs });
          // No hover while the grid opens or closes: cards gliding under a still
          // pointer would otherwise catch it and swerve mid-move.
          if (hovered === c.key && !morph && !entering) layout = overview ? gridHover(layout) : isInStack ? hoverNudge(layout) : layout;
          // In the pile, 01 sits on top.
          if (entering) layout = { ...layout, zIndex: 40 - WORK_CARDS.indexOf(c) };
          // In fullscreen the stack slides fully off the right edge (hidden) and
          // slides back in on right-edge hover. translateX drives the motion.
          let tx = 0;
          if (isInStack && fs && !overview) tx = stackRevealed ? -60 : STACK_W + OFF_EDGE + 24;
          return (
            <CardWindow
              key={c.key}
              c={c}
              src={frameSrc[c.key]}
              layout={layout}
              fs={fs}
              tx={tx}
              isFocused={isFocused}
              isInStack={isInStack}
              isHovered={hovered === c.key && !morph && !entering}
              moving={entering}
              isMounted={mounted.has(c.key)}
              paused={false}
              iframeRef={(el) => {iframeRefs.current[c.key] = el;}}
              onIframeLoad={(el) => syncIframeFs(el, fsRef.current, c.key)}
              morph={morphFor(c.key)}
              frameBox={frameBox}
              onClick={() => enteringRef.current || leavingHomeRef.current ? null : overview ? openFromGrid(c.key) : focusProject(c.key)}
              onHover={() => {if (!morphRef.current && !enteringRef.current) setHovered(c.key);if (fs) revealStack();}}
              onUnhover={() => {setHovered(null);if (fs) scheduleHideStack();}}
              chromeProps={isFocused ? chromeProps : null} />);


        })}

        {/* Fullscreen right-edge hover zone — 48px invisible strip. Sits above
             the edge-to-edge iframe (z 12 > iframe 10) but below the stack cards
             (z 44) so revealed cards stay clickable. */}
        {fs ?
        <div
          onMouseEnter={revealStack}
          onMouseLeave={scheduleHideStack}
          style={{
            position: "fixed", top: 0, right: 0, bottom: 0, width: 48,
            zIndex: 12, background: "transparent"
          }} /> :

        null}

        {/* The site rail, on the grid only. Placed on the Homepage rail's exact
            pixels at this width; fades out when a project opens and back in
            once the cards have settled into the grid. */}
        {(() => {
          const r = railDock(vp.w, vp.h);
          return (
            <div
              className="wk-rail"
              aria-hidden={!overview}
              style={{
                position: "fixed", left: r.left, top: r.top, zIndex: 30,
                transform: `scale(${r.scale})`, transformOrigin: "top left",
                opacity: overview ? 1 : 0,
                visibility: overview ? "visible" : "hidden",
                transition: overview ?
                `opacity 260ms ease ${morph ? 280 : 0}ms, visibility 0s` :
                "opacity 200ms ease, visibility 0s linear 200ms"
              }}>
              <SiteRail active={railActive} onGo={(to) => {
                if (to !== "/" || !overview) return false;
                leaveForHome();
                return true;
              }} />
            </div>);

        })()}

        {/* Contact button — hidden in fullscreen for an edge-to-edge view, and
            on the grid, where the rail already carries contact */}
        {!fs && !overview ?
        <ContactButton fs={fs} offsetX={offsetX} onClick={contact.open}
        enter={morph && morph.dir === "open" && !reducedMotion ? MORPH_MS + 30 : null} /> :
        null}
      </div>
    </div>);

}

// ============================================================
// Contact button — pinned bottom-right, aligned to stack column
// ============================================================
function ContactButton({ fs, offsetX = 0, onClick, enter = null }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick} title="Contact Suchi"
    onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    style={{
      all: "unset", position: "fixed",
      right: fs ? 20 : 34 + offsetX, bottom: 30, zIndex: 70, cursor: "pointer",
      display: "flex", alignItems: "center", gap: 8,
      padding: "12px 18px", borderRadius: 999,
      background: "#0E0E0C", color: "#F2EEE6",
      fontFamily: W_MONO, fontSize: 10, letterSpacing: "0.08em",
      textTransform: "uppercase", fontWeight: 600,
      boxShadow: hover ? "0 22px 44px -16px rgba(14,14,12,0.65)" : "0 18px 36px -16px rgba(14,14,12,0.55)",
      transform: hover ? "translateY(-2px)" : "translateY(0)",
      transition: "transform 220ms " + EASE + ", box-shadow 220ms ease, right 420ms " + EASE,
      // Opening from the grid, it arrives with the case study, not before.
      animation: enter != null ? `wkFade 300ms ease ${enter}ms both` : "none"
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: ACCENT }} />
      <span>Get in touch ↗</span>
    </button>);

}

// ============================================================
// Mobile fallback — plain vertical list
// ============================================================
function MobileList({ onContact }) {
  return (
    <div className="route-work">
      <div style={{ padding: "48px 20px 96px", minHeight: "100vh", background: "var(--bg)" }}>
        <div style={{
          fontFamily: W_MONO, fontSize: 10, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "#8A857C", marginBottom: 28
        }}>Work · 4 projects</div>
        {WORK_CARDS.map((c) =>
        <Link key={c.key} to={c.href} style={{
          display: "block", textDecoration: "none", color: "#111110",
          padding: "22px 0", borderBottom: "1px solid #D9D4C8"
        }}>
            <div style={{
            display: "flex", justifyContent: "space-between",
            fontFamily: W_MONO, fontSize: 10, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "#8A857C", marginBottom: 8
          }}>
              <span>{c.num} / {c.label}</span>
              <span>{c.status}</span>
            </div>
            <div style={{
            fontFamily: W_SANS, fontWeight: 800, textTransform: "uppercase",
            fontSize: 22, lineHeight: 1.02, letterSpacing: "-0.01em"
          }}>{c.title}</div>
          </Link>
        )}
        <button onClick={onContact} style={{
          all: "unset", marginTop: 32, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "12px 18px", borderRadius: 999,
          background: "#0E0E0C", color: "#F2EEE6",
          fontFamily: W_MONO, fontSize: 10, letterSpacing: "0.08em",
          textTransform: "uppercase", fontWeight: 600
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: ACCENT }} />
          <span>Get in touch ↗</span>
        </button>
      </div>
    </div>);

}
