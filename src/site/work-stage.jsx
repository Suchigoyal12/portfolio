import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { WORK_CARDS, CardFace, MONO as W_MONO, SANS as W_SANS, ACCENT, CARD_W as CARD_NAT_W, CARD_H as CARD_NAT_H } from "./work-cards.jsx";
import { useContact } from "../components/ContactOverlay.jsx";
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
// Behaviour preserved from the original:
//   — always stage mode (no rest grid / intro), project 01 focused
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
  c, layout, isFocused, isInStack, isHovered, isMounted, paused, fs, tx = 0,
  iframeRef, onClick, onHover, onUnhover, onIframeLoad, chromeProps
}) {
  const { left, top, width, height, rotateY, scale = 1, zIndex, radius } = layout;
  // Chrome bar shows only when focused AND not in fullscreen.
  const chromeOn = isFocused && !fs;
  const transition = paused ? "none" :
  `left ${SWAP_MS}ms ${EASE}, top ${SWAP_MS}ms ${EASE}, width ${SWAP_MS}ms ${EASE}, height ${SWAP_MS}ms ${EASE}, transform ${SWAP_MS}ms ${EASE}, opacity 360ms ease`;

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
        transform: `perspective(1600px) rotateY(${rotateY}deg) translateX(${tx}px) scale(${scale})`,
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
          src={c.href}
          title={c.title}
          onLoad={isFocused && onIframeLoad ? (e) => onIframeLoad(e.target) : undefined}
          style={{
            width: "100%",
            height: chromeOn ? `calc(100% - ${CHROME_H}px)` : "100%",
            marginTop: chromeOn ? CHROME_H : 0,
            border: 0, display: "block",
            opacity: isFocused ? 1 : 0,
            transition: "opacity 280ms ease 120ms, margin-top 420ms " + EASE + ", height 420ms " + EASE,
            pointerEvents: isFocused ? "auto" : "none",
            background: "#FBFAF6"
          }} /> :

        null}

        {/* Teaser face overlay when stacked */}
        {!isFocused ?
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <CardFace c={c} boxW={width} revealStatus={isHovered} />
          </div> :
        null}

      </div>

      {/* Chrome bar rendered outside the clipped frame so tooltips aren't cut off */}
      {chromeOn ?
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: CHROME_H, borderRadius: `${radius}px ${radius}px 0 0`, overflow: "visible", zIndex: 7 }}>
        <ChromeBar c={c} radius={radius} {...chromeProps} />
      </div> :
      null}
    </div>);

}

// ============================================================
// MAIN
// ============================================================
export default function WorkStage({ focused }) {
  const vp = useViewport();
  const navigate = useNavigate();
  const contact = useContact();

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
  const [mounted, setMounted] = React.useState(() => new Set([order[0]]));
  const [fs, setFs] = React.useState(false);
  const [stackRevealed, setStackRevealed] = React.useState(false);
  const [swapping, setSwapping] = React.useState(false);
  const iframeRefs = React.useRef({});
  const hideTimer = React.useRef(null);
  const swapTimer = React.useRef(null);
  const fsRef = React.useRef(false);
  React.useEffect(() => {fsRef.current = fs;}, [fs]);

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
  function syncIframeFs(el, active) {
    if (!el) return;
    try {
      const doc = el.contentDocument;
      if (!doc || !doc.body) return;
      doc.body.classList.toggle("is-fullscreen", !!active);
      // Guard on the DOCUMENT, not the iframe element: following an in-iframe
      // link replaces the document, so a per-element flag would leave the new
      // page's exit listeners unwired. A fresh document has no flag → rewired.
      if (!doc.__fKeyWired) {
        doc.__fKeyWired = true;
        doc.addEventListener("keydown", (e) => {
          if (e.metaKey || e.ctrlKey || e.altKey) return;
          if (e.key === "f" || e.key === "F") {
            e.preventDefault();toggleFs();
          } else if (e.key === "Escape") {
            if (fsRef.current) {e.preventDefault();exitFsAnywhere();}
          }
        });
      }
    } catch (e) {/* cross-origin — ignore */}
  }

  const focusedKey = order[0];
  // Stack always lists the non-focused projects in ascending project order,
  // regardless of swap history.
  const stackOrder = WORK_CARDS.map((c) => c.key).filter((k) => k !== focusedKey);

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
    swapTimer.current = setTimeout(() => {setSwapping(false);swapTimer.current = null;}, SWAP_MS + 40);

    // Record the focused project in the URL. `replace`, not push: moving a
    // card is a change of view, not a navigation, and the chrome bar's ‹ ›
    // already walks the projects. Pushing would make the browser's own back
    // button step backwards through the cards, so leaving Work would take as
    // many presses as cards you had looked at.
    const card = WORK_CARDS.find((c) => c.key === key);
    if (card) navigate(card.href, { replace: true });
  }

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
    syncIframeFs(iframeRefs.current[order[0]], fs);
  }, [fs, order]);

  // ── Keyboard ──
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = e.target && e.target.tagName || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "f" || e.key === "F") {e.preventDefault();toggleFs();} else
      if (e.key === "ArrowUp") {e.preventDefault();adjacent(-1);} else
      if (e.key === "ArrowDown") {e.preventDefault();adjacent(1);} else
      if (e.key === "Escape") {
        if (contact.isOpen) {contact.close();} else
        if (fsRef.current) exitFsAnywhere();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line
  }, [order, contact.isOpen]);

  // ── Mobile fallback ──
  if (vp.w < 900) {
    return <MobileList onContact={contact.open} />;
  }

  // Same centering offset getLayout uses; 0 below STAGE_CAP.
  const offsetX = Math.max(0, (vp.w - STAGE_CAP) / 2);

  const chromeProps = {
    // Keyed on our own fs state, not isNativeFs(): fullscreen is in-page and
    // has no fullscreenElement, so testing native here would send Close to the
    // homepage while fullscreen rather than exiting fullscreen first.
    onClose: () => {if (fsRef.current) exitFsAnywhere();else navigate("/");},
    onPrev: () => adjacent(-1),
    onNext: () => adjacent(1),
    onFullscreen: toggleFs
  };

  return (
    <div className="route-work">
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "var(--bg)", fontFamily: W_SANS }}>
        {WORK_CARDS.map((c) => {
          const isFocused = c.key === focusedKey;
          const isInStack = !isFocused;
          let layout = getLayout({ vw: vp.w, vh: vp.h, focusedKey, stackOrder, cardKey: c.key, fs });
          if (isInStack && hovered === c.key) layout = hoverNudge(layout);
          // In fullscreen the stack slides fully off the right edge (hidden) and
          // slides back in on right-edge hover. translateX drives the motion.
          let tx = 0;
          if (isInStack && fs) tx = stackRevealed ? -60 : STACK_W + OFF_EDGE + 24;
          return (
            <CardWindow
              key={c.key}
              c={c}
              layout={layout}
              fs={fs}
              tx={tx}
              isFocused={isFocused}
              isInStack={isInStack}
              isHovered={hovered === c.key}
              isMounted={mounted.has(c.key)}
              paused={false}
              iframeRef={(el) => {iframeRefs.current[c.key] = el;}}
              onIframeLoad={(el) => syncIframeFs(el, fsRef.current)}
              onClick={() => focusProject(c.key)}
              onHover={() => {setHovered(c.key);if (fs) revealStack();}}
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

        {/* Contact button — hidden in fullscreen for an edge-to-edge view */}
        {!fs ? <ContactButton fs={fs} offsetX={offsetX} onClick={contact.open} /> : null}
      </div>
    </div>);

}

// ============================================================
// Contact button — pinned bottom-right, aligned to stack column
// ============================================================
function ContactButton({ fs, offsetX = 0, onClick }) {
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
      transition: "transform 220ms " + EASE + ", box-shadow 220ms ease, right 420ms " + EASE
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
