import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LeftRail } from "../site/shared.jsx";
import { useProjectShell } from "./ProjectShell.jsx";
import "./CheckAccessFull.css";
import { dims } from "../site/image-dims.js";

// The long version. Reached from inside the short version and nowhere else;
// never enters the card stack. The last hand-written HTML page in the project
// and the heaviest single file — ~290 lines of CSS, ~430 of markup and three
// pieces of behaviour: a scroll-spy table of contents, a lightbox with
// wheel-zoom and pointer-drag panning, and the three walkthrough reels.
//
// Four things about this port are worth knowing before editing it:
//
//   · The rail is the shared LeftRail now, not the page's own <aside>. It is
//     fed this page's 12 TOC entries and three meta rows below. The wordmark
//     resolves to 16px rather than the 19px this page hand-wrote — the single
//     intended visual change, approved. It is not visible yet: the rail only
//     renders under body.is-fullscreen, which nothing sets on this route
//     today, so standalone the page runs full width exactly as it does live.
//
//   · No shared responsive stylesheet — useProjectShell({ responsive: false }).
//     The reasoning is at the top of CheckAccessFull.css. Without this the
//     hero shrinks below 1180px.
//
//   · Every effect unbinds. The originals never did, because the page only
//     ever went away by navigating; in one app the listeners would outlive the
//     route. Scroll, keydown, wheel, the pointer handlers, the three
//     IntersectionObservers and the lightbox's lock on body overflow all clean
//     up on unmount.
//
//   · The reels' data moved out of data-* attributes and into REELS. The
//     original read data-src / data-poster / data-reel back out of the DOM
//     because it had nowhere else to keep them.

// MP4 (H.264) reels live at the project root; flag is on.
// true  → autoplay-on-scroll <video> with coral progress bar
// false → static <img> using the SAME poster asset
//
// The documented pattern for media that may not exist yet, not dead code:
// the layout ships complete and the fallback occupies the same box, so
// arriving footage means dropping a file in and flipping one constant. Do not
// remove it or comment the other branch out. (HANDOFF §5.)
export const USE_VIDEO = true;

const TOC = [
  { id: "summary", no: "00", label: "Summary" },
  { id: "system", no: "01", label: "System" },
  { id: "problem", no: "02", label: "Problem" },
  { id: "challenge", no: "03", label: "Challenge" },
  { id: "decisions", no: "04", label: "Decisions" },
  { id: "v1", no: "05", label: "V1 — Preview" },
  { id: "feedback", no: "06", label: "Feedback" },
  { id: "v15", no: "07", label: "V1.5" },
  { id: "v2", no: "08", label: "V2 — Final" },
  { id: "walkthrough", no: "09", label: "Walkthrough" },
  { id: "impact", no: "10", label: "Impact" },
  { id: "learnings", no: "11", label: "Learnings" }
];

const META = [
  ["Timeline", "2024-25"],
  ["Status", "Shipped (GA)"],
  ["Read", "9 MIN"]
];

// "scope-seperation" is misspelled, consistently, across the poster, the mp4
// and this reference — which is why it works. Correct all three together or
// none. (HANDOFF §3.)
const REELS = [
  {
    src: "/disclose-progressively.mp4",
    poster: "/disclose-progressively.png",
    eyebrow: "01 — Disclose Progressively",
    bold: "Overview first, detail on demand.",
    support: "Start with roles across every service; open permissions only when the task requires it."
  },
  {
    src: "/scope-seperation.mp4",
    poster: "/scope-seperation.png",
    eyebrow: "02 — Scope Separation",
    bold: "Tenant, service, and folder, never confused.",
    support: "Navigate access by scope, each level cleanly separated from the one above."
  },
  {
    src: "/trace-origins.mp4",
    poster: "/trace-origins.png",
    eyebrow: "03 — Trace Origins",
    bold: "Every assignment surfaces its own source.",
    support: "See whether access is explicit, inherited from a group, or inherited from a folder."
  }
];

// ── 09 WALKTHROUGH MEDIA REEL ────────────────────────────────
// One component per reel so the observer and the two media listeners are
// created and torn down together with the element they watch.
function Reel({ src, poster, eyebrow, bold, support }) {
  const figRef = useRef(null);
  const videoRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    if (!USE_VIDEO) return undefined;
    const v = videoRef.current;
    const bar = barRef.current;
    const fig = figRef.current;

    let completed = false;
    const onTime = () => {
      if (v.duration) bar.style.width = (v.currentTime / v.duration) * 100 + "%";
    };
    const onEnded = () => { completed = true; };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          if (completed) { completed = false; v.currentTime = 0; }
          v.play().catch(() => {}); // poster stays if autoplay blocked
        } else {
          if (!v.ended) v.pause();
        }
      });
    }, { threshold: 0.5 });
    io.observe(fig);

    return () => {
      io.disconnect();
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
      v.pause();
    };
  }, []);

  return (
    <figure className="reel" ref={figRef}>
      <figcaption className="take">
        <div className="eyebrow">{eyebrow}</div>
        <p className="bold">{bold}</p>
        <p className="support">{support}</p>
      </figcaption>
      <div className="media">
        {USE_VIDEO ? (
          <>
            <video ref={videoRef} src={src} poster={poster} muted playsInline preload="metadata" />
            <div className="bar" ref={barRef} />
          </>
        ) : (
          <img src={poster} {...dims(poster)} alt={bold} loading="lazy" />
        )}
      </div>
    </figure>
  );
}

// ── LIGHTBOX ─────────────────────────────────────────────────
// Wheel + two-finger pinch zoom and pan. The transform is written straight to
// the node rather than held in state: the original does the same, and the
// pointer maths depends on reading the image's live rect between frames.
// Kept mounted and toggled with .open, as the CSS expects.
function Lightbox({ shot, onClose }) {
  const stageRef = useRef(null);
  const imgRef = useRef(null);
  const api = useRef({ reset: () => {} });

  useEffect(() => {
    const stage = stageRef.current;
    const img = imgRef.current;
    let scale = 1, tx = 0, ty = 0;
    const pointers = new Map();
    let startDist = 0, lastMid = null, panStart = null, downPos = null, moved = false;

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    function apply() {
      img.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
      stage.classList.toggle("zoomed", scale > 1);
    }
    function reset() { scale = 1; tx = 0; ty = 0; apply(); }
    function zoomAt(cx, cy, factor) {
      const rect = img.getBoundingClientRect();
      const ox = cx - rect.left, oy = cy - rect.top;
      const ns = clamp(scale * factor, 1, 8);
      const rf = ns / scale;
      tx -= ox * (rf - 1); ty -= oy * (rf - 1); scale = ns;
      if (scale === 1) { tx = 0; ty = 0; }
      apply();
    }
    const dist = () => { const p = [...pointers.values()]; return Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); };
    const mid = () => { const p = [...pointers.values()]; return { x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2 }; };

    api.current.reset = reset;

    const onWheel = (e) => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.12 : 1 / 1.12);
    };
    const onPointerDown = (e) => {
      stage.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      downPos = { x: e.clientX, y: e.clientY }; moved = false;
      if (pointers.size === 2) { startDist = dist(); lastMid = mid(); }
      else { panStart = { x: e.clientX, y: e.clientY, tx, ty }; stage.classList.add("panning"); }
    };
    const onPointerMove = (e) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (downPos && Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 6) moved = true;
      if (pointers.size === 2) {
        const d = dist(), m = mid();
        if (startDist) { zoomAt(m.x, m.y, d / startDist); startDist = d; }
        if (lastMid) { tx += m.x - lastMid.x; ty += m.y - lastMid.y; apply(); }
        lastMid = m;
      } else if (panStart && scale > 1) {
        tx = panStart.tx + (e.clientX - panStart.x);
        ty = panStart.ty + (e.clientY - panStart.y);
        apply();
      }
    };
    const up = (e) => {
      pointers.delete(e.pointerId);
      stage.classList.remove("panning");
      if (pointers.size < 2) { startDist = 0; lastMid = null; }
      if (pointers.size === 1) { const p = [...pointers.values()][0]; panStart = { x: p.x, y: p.y, tx, ty }; }
    };
    const onClick = (e) => {
      if (moved) return;
      if (scale <= 1) zoomAt(e.clientX, e.clientY, 2.4); else reset();
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", up);
    stage.addEventListener("click", onClick);
    return () => {
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", up);
      stage.removeEventListener("pointercancel", up);
      stage.removeEventListener("click", onClick);
    };
  }, []);

  // Opening resets the transform and locks the page behind the overlay. The
  // cleanup also covers unmounting while open — navigating away with the
  // lightbox up would otherwise leave the whole app unscrollable.
  useEffect(() => {
    if (!shot) return undefined;
    api.current.reset();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [shot]);

  useEffect(() => {
    if (!shot) return undefined;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [shot, onClose]);

  return (
    <div className={shot ? "lightbox open" : "lightbox"} aria-hidden={shot ? "false" : "true"} role="dialog" aria-modal="true">
      <div className="lb-bar">
        <span className="lb-title">{shot ? shot.title : ""}</span>
        <div className="lb-actions">
          <button type="button" className="lb-btn" onClick={() => api.current.reset()}>Reset</button>
          <button type="button" className="lb-btn" onClick={onClose}>Close ✕</button>
        </div>
      </div>
      <div className="lb-stage" ref={stageRef}>
        <img ref={imgRef} src={shot ? shot.src : undefined} {...dims(shot && shot.src)} alt={shot ? shot.title : ""} draggable="false" />
      </div>
      <div className="lb-hint">Scroll or pinch to zoom · drag to pan · click image to zoom · Esc to close</div>
    </div>
  );
}

export default function CheckAccessFull() {
  useProjectShell({ variant: "check-access-full", responsive: false });

  const navigate = useNavigate();
  const progRef = useRef(null);
  const [current, setCurrent] = useState(TOC[0].id);
  const [shot, setShot] = useState(null);

  const closeShot = useCallback(() => setShot(null), []);

  // Progress bar and scroll-spy, one listener as in the original. The bar is
  // written straight to the node — it changes every frame and does not need a
  // render — while the active section is state, because LeftRail takes it as a
  // prop. Setting it to the value it already holds is a no-op in React, so
  // this does not re-render on every scroll event.
  useEffect(() => {
    const sections = TOC.map((s) => document.getElementById(s.id));
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progRef.current) progRef.current.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
      let activeIdx = 0;
      sections.forEach((s, i) => {
        if (s && s.getBoundingClientRect().top <= 120) activeIdx = i;
      });
      setCurrent(TOC[activeIdx].id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The short version deep-links into this page — #v1, #v15, #v2 from its
  // evolution strip. On the static page the browser did this itself, because
  // the sections existed at parse time. Here they do not exist until React has
  // rendered, so the browser's jump finds nothing and the page sits at the
  // top. Re-run it once, after mount. scrollIntoView honours the section's
  // scroll-margin-top, which is what lands the heading 96px down — the same
  // place the live page puts it.
  //
  // Two passes, because the browser does two as well: it keeps re-anchoring a
  // fragment target while the page settles and stops the moment the reader
  // scrolls. A single pass at mount lands short — 29px on #v15 — as the
  // webfonts resolve afterwards and the copy above reflows. The second pass
  // waits for fonts and runs only if the reader has not taken over.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return undefined;
    const el = document.getElementById(id);
    if (!el) return undefined;

    let owned = true;
    const release = () => { owned = false; };
    window.addEventListener("wheel", release, { passive: true, once: true });
    window.addEventListener("touchstart", release, { passive: true, once: true });
    window.addEventListener("keydown", release, { once: true });

    el.scrollIntoView();
    document.fonts.ready.then(() => { if (owned) el.scrollIntoView(); });

    return () => {
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchstart", release);
      window.removeEventListener("keydown", release);
    };
  }, []);

  // ← BACK always returns to the short version, in whatever view this page is
  // being read in.
  //
  // It used to try `history.back()` first and only fall through to this URL
  // when there was no history — the original's rule. That reads as "back" but
  // behaves as "leave": arriving from a shared link on LinkedIn or in an email,
  // the previous entry is that other site, so the one prominent control on the
  // page sent the reader off the portfolio entirely. Roadmap item 3.
  //
  // Nothing here has to preserve stage-vs-fullscreen. Framed, this navigates
  // the iframe only, and the mode belongs to the parent stage; unframed, it is
  // a route change within the same document. Either way the view survives on
  // its own.
  const onBack = (e) => {
    e.preventDefault();
    // Tell the stage the card is showing the short version again.
    //
    // This is a client-side route change: no document is replaced, so the
    // stage's load-time recorder (syncIframeFs) never fires and sessionStorage
    // would keep pointing at the long read. Following the link INTO the long
    // read is a plain <a>, i.e. a real document load, which is why the trip
    // out records itself and the trip back has to say so explicitly.
    //
    // Regression introduced with item 3: the previous onBack called
    // history.back(), which inside the frame popped to a real document load
    // and re-recorded as a side effect. Replacing it with navigate() was
    // correct for the "arriving from LinkedIn" case and silently broke this.
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        { type: "work:frame", slug: "check-access", path: "/work/check-access" },
        "*"
      );
    }
    navigate("/work/check-access");
  };

  // Framed, the next-project link hands the key to the stage manager so the
  // stack moves instead of the frame navigating. This page is never actually
  // a card — it is reachable only from inside the short version — but the
  // guard is in the original and costs nothing to keep.
  const onNext = (e) => {
    e.preventDefault();
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "work:focus", key: "ai-trust" }, "*");
      return;
    }
    navigate("/work/ai-trust-layer");
  };

  return (
    <div className="route-check-access-full">
      <div className="progress"><div ref={progRef} /></div>

      <div className="shell">
        <LeftRail sections={TOC} currentSection={current} status={META} />

        {/* MAIN */}
        <main>
          <div className="topline-spacer"></div>
          <div className="topline">
            <a href="/work/check-access" className="mono" style={{ textDecoration: "none" }} onClick={onBack}>← BACK</a>
            <span className="mono">DETAILED PROJECT CASE STUDY</span>
          </div>

          {/* HERO */}
          <section className="hero">
            <h1>UNIFYING<br />FRAGMENTED<br />PERMISSIONS<span className="acc">.</span></h1>
            <div className="lede">
              <svg width="140" height="36" viewBox="0 0 220 56" aria-hidden="true">
                <path d="M2 30 Q 35 -8, 70 30 T 138 30 T 218 30" stroke="#B5522E" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              </svg>
              <p>Centralized access auditing for enterprise automation. Aggregating inherited permissions across federated systems to enable definitive access verification.</p>
            </div>
          </section>

          {/* PROJECT OVERVIEW */}
          <section className="project-overview">
            <div className="grid">
              <div className="cell"><div className="k">Client</div><div className="v">UiPath</div></div>
              <div className="cell"><div className="k">Role</div><div className="v">Product Designer (Lead V1.5–V2)</div></div>
              <div className="cell"><div className="k">Timeline</div><div className="v">2024–25</div></div>
              <div className="cell"><div className="k">Status</div><div className="v">Shipped (GA)</div></div>
              <div className="cell"><div className="k">Read</div><div className="v">9 MIN</div></div>
            </div>
          </section>

          {/* SUMMARY */}
          <section id="summary" className="summary">
            <div className="lbl">Section 00<br />Summary</div>
            <div className="tags">
              <span className="pill">User Access</span>
              <span className="pill">Permissions Audit Pipeline</span>
              <span className="pill">Enterprise SaaS</span>
            </div>
          </section>

          {/* 01 SYSTEM */}
          <section id="system" className="row">
            <div className="lbl">Section 01<br />System</div>
            <div>
              <h2>Unpacking a distributed architecture<span className="acc">.</span></h2>
              <p className="body">Permissions in UiPath aren't stored in one place — they are the output of dynamic, distributed system logic. Because groups, roles, and nested folders interact across multiple services, a user's effective access is the output of distributed logic, not a static assignment.</p>

              <div className="cascade">
                <span className="mono ink" style={{ fontSize: 10 }}>ARCHITECTURE LOGIC</span>
                <div className="layer"><div className="lk">Layer 01</div><div className="lv">User Identity / AD Group</div></div>
                <div className="arrow">↓ &nbsp; cascades to</div>
                <div className="layer"><div className="lk">Layer 02</div><div className="lv">Assigned Role</div></div>
                <div className="arrow">↓ &nbsp; bound to</div>
                <div className="layer acc"><div className="lk">Layer 03</div><div className="lv">Scope (Tenant → 6-Level Folders)</div></div>
              </div>
            </div>
          </section>

          {/* 02 PROBLEM */}
          <section id="problem" className="row">
            <div className="lbl">Section 02<br />Problem</div>
            <div>
              <h2>The cost of decentralised chaos<span className="acc">.</span></h2>
              <blockquote className="pull"><span className="o">"</span>What access does this user actually have across the platform?</blockquote>
              <p className="body">Because permissions were scattered across Orchestrator, Data Service, Automation Ops and multiple other services; admins had to manually cross-reference identity dashboards against nested folder policies. This inability to reliably trace the origin of access made routine audits exceptionally tedious and increased the risk of misconfiguration.</p>
              <div className="pain-row">
                <div className="pain">⏱ &nbsp;Time-Consuming</div>
                <div className="pain">🔨 &nbsp;Error-Prone</div>
                <div className="pain">🔍 &nbsp;Hard to Audit</div>
              </div>
            </div>
          </section>

          {/* 03 CHALLENGE */}
          <section id="challenge" className="row">
            <div className="lbl">Section 03<br />Challenge</div>
            <div>
              <h2>Visualizing effective access without exposing system complexity<span className="acc">.</span></h2>
              <div className="grid-4">
                <div>
                  <div className="n">01</div>
                  <div className="h">No single source of truth</div>
                  <div className="p">Access data is fragmented across independent control planes.</div>
                </div>
                <div>
                  <div className="n">02</div>
                  <div className="h">Indirect and inherited access</div>
                  <div className="p">Permissions are rarely assigned directly, making it difficult to trace their origin.</div>
                </div>
                <div>
                  <div className="n">03</div>
                  <div className="h">Multi-layered scope ambiguity</div>
                  <div className="p">Access varies across tenant, service, and folder levels, without clear visibility into scope boundaries.</div>
                </div>
                <div>
                  <div className="n">04</div>
                  <div className="h">Mental Reconstruction</div>
                  <div className="p">Admins must mentally simulate how overlapping policies resolved.</div>
                </div>
              </div>
            </div>
          </section>

          {/* 04 DECISIONS */}
          <section id="decisions" className="row">
            <div className="lbl">Section 04<br />Decisions</div>
            <div>
              <h2>Four decisions, four trade-offs<span className="acc">.</span></h2>
              <div className="decisions">
                <div className="card">
                  <div className="num">01</div>
                  <div>
                    <h3>Progressive Access Disclosure</h3>
                    <div className="grid">
                      <span className="lbl">Why</span><span>Access is computed across multiple layers. Showing everything at once obscures what matters.</span>
                      <span className="lbl">Alt</span><span>Flattening all access details (roles, permissions, origin) in a single expanded view.</span>
                      <span className="lbl rej">Rejected</span><span style={{ color: "var(--accent)" }}>High noise, poor scanability.</span>
                      <span className="lbl">Trade-off</span><span>Requires an extra drill-down click for micro-level inspection.</span>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="num">02</div>
                  <div>
                    <h3>Explicit Scope Separation</h3>
                    <div className="grid">
                      <span className="lbl">Why</span><span>Admins required immediate distinction between globally scoped roles and localized roles.</span>
                      <span className="lbl">Trade-off</span><span>Introduces segmented views instead of a perfectly unified list.</span>
                      <span className="it">Some wouldn't call it a tradeoff!</span>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="num">03</div>
                  <div>
                    <h3>Origin Traceability</h3>
                    <div className="grid">
                      <span className="lbl">Why</span><span>Seeing that a user has access is useless if the admin cannot trace the identity rule that granted it.</span>
                      <span className="lbl">Alt</span><span>Display roles without inheritance or origin details.</span>
                      <span className="lbl rej">Rejected</span><span style={{ color: "var(--accent)" }}>Forced admins to manually trace access across systems, breaking audit workflows.</span>
                      <span className="lbl">Trade-off</span><span>Increased data density in the grid, requiring tighter layout and column prioritization.</span>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="num">04</div>
                  <div>
                    <h3>Prioritizing Traceability over Actionability</h3>
                    <div className="grid">
                      <span className="lbl">Why</span><span>Admins first need to understand why access exists before modifying it.</span>
                      <span className="lbl">Alt</span><span>Allow direct editing of roles within the audit view.</span>
                      <span className="lbl rej">Rejected</span><span style={{ color: "var(--accent)" }}>Introduced complexity and risk of incorrect changes without full context.</span>
                      <span className="lbl">Trade-off</span><span>Requires navigation to source systems for action, but ensures safer decision-making.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 05 V1 PRIVATE PREVIEW */}
          <section id="v1" className="row">
            <div className="lbl">Section 05<br />V1 — Preview</div>
            <div>
              <div className="vtag"><span className="dot"></span><span className="lbl">V1 — INITIAL SOLUTION (PRIVATE PREVIEW)</span></div>
              <h2>Consolidating access visibility across services<span className="acc">.</span></h2>
              <p className="body">The MVP version focused on bringing fragmented access data into a single, navigable interface. It reduced the need for administrators to scrutinise multiple systems to understand user permissions.</p>

              <p className="credit">Satiswar Dash (Senior Designer) led V1. I worked on it, under his mentorship — and led the work from V1.5 onward.</p>

              <div className="art-row">
                <div>
                  <span className="lbl">Entry Point</span>
                  <h4>Introduced Check Access within Manage Access.</h4>
                  <p>Positioned as an audit tool for user access.</p>
                </div>
                <div>
                  <span className="lbl">Role Assignments</span>
                  <h4>Consolidated roles across services.</h4>
                  <p>Organized via left navigation hierarchy.</p>
                </div>
                <div>
                  <span className="lbl">Permissions</span>
                  <h4>Grouped permissions for readability.</h4>
                  <p>Enabled deeper inspection when needed.</p>
                </div>
              </div>

              <div className="incomp">
                <span className="lbl">WHERE V1 STOPPED SHORT</span>
                <div className="it">V1 proved the concept. Four limits were visible before any feedback came in — and they set the scope of what I led next.</div>
                <ul>
                  <li>· Unclear assignment visibility</li>
                  <li>· Ambiguous navigation behaviour across levels</li>
                  <li>· Limited visibility into absence of access</li>
                  <li>· Entry point ambiguity against Manage Access</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 06 FEEDBACK */}
          <section id="feedback" className="row">
            <div className="lbl">Section 06<br />Feedback</div>
            <div>
              <h2>Three questions admins kept asking<span className="acc">.</span></h2>
              <p className="body">Through UiPath Private Preview and UiPath Insider Program research, we identified key gaps in how administrators understood and navigated access.</p>
              <div className="quotes">
                <div className="q">
                  <span className="open">"</span>
                  <blockquote>What kind of role is this and where does it apply?</blockquote>
                  <span className="findlbl">Access structure lacked clarity</span>
                  <p className="findbody">System didn't differentiate tenant / service / folder roles.</p>
                </div>
                <div className="q">
                  <span className="open">"</span>
                  <blockquote>Where is this permission actually coming from?</blockquote>
                  <span className="findlbl">Permission origin was unclear</span>
                  <p className="findbody">Admins couldn't trace access from groups or folders.</p>
                </div>
                <div className="q">
                  <span className="open">"</span>
                  <blockquote>Okay.. I see the access. Do I navigate back to the service to fix it?</blockquote>
                  <span className="findlbl">Actionability was missing</span>
                  <p className="findbody">Users could view, but not easily act on insights.</p>
                </div>
              </div>
              <div className="takeaway">
                <span className="lbl">Key Takeaway</span>
                <p>These gaps became more evident when the feature was used in real-world scenarios. Actionability and traceability were the missing links that prevented this from being a complete workflow.</p>
              </div>
            </div>
          </section>

          {/* 07 V1.5 */}
          <section id="v15" className="row">
            <div className="lbl">Section 07<br />V1.5</div>
            <div>
              <div className="vtag"><span className="dot"></span><span className="lbl">V1.5 — DESIGNING UNDER CONSTRAINT</span></div>
              <h2>The ideal vs. the shipped<span className="acc">.</span></h2>

              <div className="ctable">
                <div className="row-h"><div>The Engineering Constraint</div><div>The Design Decision</div></div>
                <div className="row-b">
                  <div>APIs couldn't support deep hierarchy without performance trade-offs. <span className="acc">Full traceability wasn't feasible.</span></div>
                  <div>I focused on improving clarity and structure of access data, making it interpretable without full traceability.</div>
                </div>
              </div>

              <div className="insight">
                <span className="lbl">User Insight</span>
                <p>Research showed that administrators primarily needed to quickly understand <span className="acc">what access exists and where it applies</span>, before tracing its origin.</p>
              </div>

              <div className="pillars">
                <div className="p">
                  <div className="l">A</div>
                  <div className="h">Access Structure Clarity</div>
                  <div className="b">Made role scope more explicit through clearer labelling and separation.</div>
                  <span className="o">Outcome · Reduced ambiguity.</span>
                </div>
                <div className="p">
                  <div className="l">B</div>
                  <div className="h">Information Hierarchy</div>
                  <div className="b">Reordered roles and grouped services to improve scanability in high-density views.</div>
                  <span className="o">Outcome · Faster comprehension.</span>
                </div>
                <div className="p">
                  <div className="l">C</div>
                  <div className="h">Navigation &amp; Entry</div>
                  <div className="b">Improved entry point positioning and intuitive service navigation.</div>
                  <span className="o">Outcome · Less friction.</span>
                </div>
              </div>
            </div>
          </section>

          {/* 08 V2 FINAL */}
          <section id="v2" className="row">
            <div className="lbl">Section 08<br />V2 — Final</div>
            <div>
              <div className="vtag"><span className="dot"></span><span className="lbl">V2 — VISIBILITY TO TRACEABILITY</span></div>
              <h2>Centralized, explicit, and traceable<span className="acc">.</span></h2>
              <p className="body">Admins no longer just audited access — they could explicitly map it. The UI now fully matched their mental model of investigating.</p>
              <p className="body" style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)" }}>Who → What Role → What Scope → Why.</p>

              <div className="ab">
                <div className="card">
                  <div className="top"><span className="opt">Option A</span><span className="desc">Dropdown-Based Selection</span></div>
                  <button type="button" className="shot" onClick={() => setShot({ src: "/uploads/option-a.png", title: "Option A — Dropdown-Based Selection" })}><img src="/uploads/option-a.png" {...dims("/uploads/option-a.png")} alt="Option A — Dropdown-based folder path selection" loading="lazy" /></button>
                  <h4>Allowed users to select folder paths via a dropdown.</h4>
                  <p><span className="lbl">Limitation · </span>Lacked visibility into hierarchy and made it difficult to understand structure at a glance.</p>
                </div>
                <div className="card sel">
                  <div className="top"><span className="opt">Option B · Selected</span><span className="desc">Tree Navigation</span></div>
                  <button type="button" className="shot" onClick={() => setShot({ src: "/uploads/option-b.png", title: "Option B — Tree Navigation" })}><img src="/uploads/option-b.png" {...dims("/uploads/option-b.png")} alt="Option B — Persistent folder tree navigation" loading="lazy" /></button>
                  <h4>Introduced a persistent folder tree.</h4>
                  <p>Enables users to explore hierarchy and understand context while auditing access.</p>
                </div>
              </div>

              <div className="decstrip">
                <span className="lbl">Why Tree Navigation</span>
                <ul>
                  <li>Handles deep, multi-level structures</li>
                  <li>Provides spatial understanding of hierarchy</li>
                  <li>Reduces cognitive load compared to recalling paths</li>
                  <li>Enables faster debugging of access issues</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 09 WALKTHROUGH */}
          <section id="walkthrough" className="row">
            <div className="lbl">Section 09<br />Walkthrough</div>
            <div>
              <h2>Tracing access from start to finish<span className="acc">.</span></h2>
              <p className="body">The final experience connects access management with auditing, allowing administrators to move from assigning roles to fully understanding and tracing access across services and folders.</p>
              <div className="reels">
                {REELS.map((r) => <Reel key={r.src} {...r} />)}
              </div>
            </div>
          </section>

          {/* 10 IMPACT */}
          <section id="impact" className="row impact">
            <div className="lbl">Section 10<br />Impact</div>
            <div>
              <h2>Bringing clarity to complex governance<span className="acc">.</span></h2>
              <p className="body">The redesigned Check Access experience significantly improved the efficiency and clarity of access audits. A user's complete access across services &amp; folders, in a single query- grouped, scannable, read in one pass.</p>
              <div className="impact-hero"><span className="o">~13</span> services <span className="c">·</span> Private Preview <span className="c">→</span> GA in <span className="o">4</span> months</div>
              <div className="impact-note" style={{ fontFamily: '"JetBrains Mono"' }}>Built to move three numbers the team owned: adoption, audit-time, and access-related support load.</div>
            </div>
          </section>

          {/* 11 LEARNINGS */}
          <section id="learnings" className="row">
            <div className="lbl">Section 11<br />Learnings</div>
            <div>
              <h2>Designing for complex data structures<span className="acc">.</span></h2>
              <div className="lessons">
                <div className="l">
                  <div className="row"><h4>The structure is the experience.</h4><span className="n">01</span></div>
                  <p>The hardest problem wasn't UI — it was modeling access in a way admins could understand. I designed around user mental models (who has access where) instead of backend structures (roles, inheritance chains).</p>
                </div>
                <div className="l">
                  <div className="row"><h4>Complexity requires narrative.</h4><span className="n">02</span></div>
                  <p>When presenting dense data, you can't just show everything at once. Progressive disclosure is a form of storytelling — guiding the user through layers of complexity only when they ask for it.</p>
                </div>
                <div className="l">
                  <div className="row"><h4>Edge cases are the system.</h4><span className="n">03</span></div>
                  <p>In access management, the "happy path" is rarely the reality. We had to account for inherited access, conflicting permissions, and deeply nested folder structures from day one of designing the interactions.</p>
                </div>
                <div className="l">
                  <div className="row"><h4>Clarity over completeness.</h4><span className="n">04</span></div>
                  <p>When full hierarchy traceability wasn't technically feasible, I prioritized making existing data interpretable rather than introducing partial or misleading representations.</p>
                </div>
              </div>
            </div>
          </section>

          {/* NEXT CASE STUDY */}
          <section className="row" style={{ borderBottom: "none" }}>
            <div className="lbl"></div>
            <a href="/work/ai-trust-layer" onClick={onNext} style={{ textDecoration: "none", color: "var(--ink)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20 }}>
              <div>
                <div className="mono">NEXT PROJECT / 002</div>
                <div style={{ fontFamily: "'DM Sans'", fontWeight: 800, fontSize: 64, lineHeight: 0.95, letterSpacing: "-0.025em", marginTop: 12 }}>AI TRUST LAYER<span className="acc" style={{ color: "var(--accent)" }}>.</span></div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 24, color: "var(--accent)" }}>→</div>
            </a>
          </section>

        </main>
      </div>

      <Lightbox shot={shot} onClose={closeShot} />
    </div>
  );
}
