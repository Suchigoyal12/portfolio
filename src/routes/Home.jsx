import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SiteRail from "../layouts/SiteRail.jsx";
import {
  CREAM, BEIGE, HOME_EXIT_MS, HOME_EXIT_EASE, HOME_RETURN_MS, HOME_RETURN_EASE,
  BACK_GROUND_MS, FRESH_MS, STEP_PX, handoff, previewRail, reducedMotion,
  GROUND, BLUR_OUT_MS, BLUR_OUT_EASE, blurFilter
} from "../site/workTransition.js";
import { useFit } from "../hooks/useFit.js";
import { usePanelFluid } from "../hooks/usePanelFluid.js";
import "./Home.css";
import { dims } from "../site/image-dims.js";

// Ported from legacy/index.html. Markup is the original's, structure for
// structure, including the separate mobile stack below 900px and its inline
// styles — the two compositions are authored independently and are not a
// responsive reflow of one another.
//
// Changes forced by the move, and nothing beyond them:
//
//   · Asset paths become root-absolute (/uploads/…). Relative paths resolved
//     correctly when the page was served at /index.html; under a router they
//     would resolve against whatever route is current.
//   · The three real nav destinations become <Link>, which is the point of
//     the migration. The contact item keeps its markup exactly — the overlay's
//     document-level [data-contact] handler catches it, as it always did.
//   · <template id="__bundler_thumbnail"> is dropped. Claude Design export
//     cruft; it rendered nothing.
//
// USE_AUDIO stays as a flag even though the recording now exists and it is
// true. It is the documented pattern, not dead code: the tooltip fallback
// occupies the same box as the real thing, and flipping one constant is the
// whole change if the audio ever goes away.
const USE_AUDIO = true;

// PANEL_L / TOOLING_L are [value@1440, value@1300] in px, left edges.
// Change one and change the other — a single-value edit breaks one band.
const PANEL_L   = [335.14, 190];  // panel biases left toward the rail as width drops
const TOOLING_L = [738,    585];  // tooling packs rightward, glued near the right rail

const BACKGROUND_COPY =
  "The (un)glamorous work holds everything up. UiPath's admin layer: the control plane behind every business automation, 10,000+ customer enterprises. Joined as the most junior designer on it. Led it within the year. Systems, governance, the edge cases that decide whether software earns trust. Depth over breadth.";

// `backdrop`: drawn blurred behind /work (experiment). No rail, no transition
// logic, no interaction; the Work page owns all of that.
export default function Home({ backdrop = false }) {
  // Roadmap item 8 — the tooling "+" toggle. Click state, not hover: it has
  // to persist after the pointer leaves, which the sitewide hover-group
  // mechanism (Home.css ~265) can't do. The two coexist deliberately — this
  // adds an accent highlight to a fixed cross-group set of pills; the
  // existing hover mechanism still dims non-matching *groups* on hover of
  // any pill, independent of this state. Desktop only for now: mobile's
  // pill list is missing 4 of the 8 target pills (Jitter, HTML, CSS, JS) —
  // a pre-existing gap, not something to paper over here.
  const [toolingExpanded, setToolingExpanded] = useState(false);

  const canvasRef  = useRef(null);
  const stageRef   = useRef(null);
  const panelRef   = useRef(null);
  const toolingRef = useRef(null);
  const fluidRef   = useRef(null);
  const audioRef   = useRef(null);
  const tagRef     = useRef(null);
  const tipDesktopRef = useRef(null);
  const tipMobileRef  = useRef(null);

  useFit({
    canvasRef,
    stageRef,
    columns: [
      { ref: panelRef,   at1440: PANEL_L[0],   at1300: PANEL_L[1] },
      { ref: toolingRef, at1440: TOOLING_L[0], at1300: TOOLING_L[1] },
    ],
  });

  usePanelFluid({ panelRef, canvasRef: fluidRef });

  // ── Homepage ⇄ Work (roadmap item 14) ─────────────────────────────────
  // See site/workTransition.js. Every zone of the stage moves as one block,
  // except the rail, which stays where it is: the /work grid has the same rail
  // on the same pixels. `translate` rather than `transform`, so nothing the
  // zones already transform is touched. Desktop only.
  const navigate = useNavigate();
  const [railActive, setRailActive] = useState(null);
  const leavingRef = useRef(false);
  const arrivingRef = useRef(false);
  const arrivalRan = useRef(false);

  const zones = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return { els: [], d: 0 };
    // fit() scales the whole stage between 900 and 1300px; a zone's
    // translate is in the stage's own pixels, so the distance that clears
    // the window is the window height divided by that scale.
    const s = stage.getBoundingClientRect().width / stage.offsetWidth || 1;
    const els = Array.from(stage.children).filter((el) => !el.classList.contains("rail-nav"));
    return { els, d: window.innerHeight / s };
  }, []);

  const leaveForWork = useCallback(() => {
    if (leavingRef.current || arrivingRef.current) return;
    leavingRef.current = true;
    setRailActive("/work");
    previewRail("/work");
    // Blur ground: the Homepage stays where it is. The Work page draws it
    // behind itself and blurs it in, so go now.
    if (GROUND === "blur") {
      handoff.leftHomeAt = performance.now();
      navigate("/work");
      return;
    }
    const { els, d } = zones();
    const reduced = reducedMotion();
    const anims = els.map((el) => el.animate(
      reduced ? [{ opacity: 1 }, { opacity: 0 }] : [{ translate: "0 0" }, { translate: `0 ${-d}px` }],
      { duration: reduced ? 200 : HOME_EXIT_MS, easing: reduced ? "ease" : HOME_EXIT_EASE, fill: "forwards" }
    ));
    Promise.all(anims.map((a) => a.finished)).then(() => {
      handoff.leftHomeAt = performance.now();
      navigate("/work");
    }).catch(() => {});
  }, [navigate, zones]);

  // Scroll down to leave: one fresh gesture, a deliberate amount.
  useEffect(() => {
    const el = canvasRef.current;
    if (!el || backdrop) return undefined;
    let last = 0, acc = null;
    const onWheel = (e) => {
      if (window.innerWidth < 900) return;
      const now = performance.now();
      const gap = now - last;
      last = now;
      if (leavingRef.current || arrivingRef.current) { acc = null; return; }
      if (gap > FRESH_MS) acc = 0;
      if (acc === null) return;
      acc += e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 800 : 1);
      if (acc >= STEP_PX) { acc = null; leaveForWork(); }
    };
    el.addEventListener("wheel", onWheel, { passive: true });
    return () => el.removeEventListener("wheel", onWheel);
  }, [leaveForWork]);

  // The rail's "the work" plays the same exit; every other item navigates.
  const onRailGo = useCallback((to) => {
    if (to !== "/work" || window.innerWidth < 900) return false;
    leaveForWork();
    return true;
  }, [leaveForWork]);

  // Returned to from the /work grid, by scrolling up, the rail or Back: the
  // content slides back down. After useFit, so the stage scale is already set,
  // and in a layout effect, so the first frame already shows it out of view.
  // The ref keeps StrictMode's second effect pass from running it twice.
  useLayoutEffect(() => {
    if (arrivalRan.current || backdrop) return;
    arrivalRan.current = true;
    const at = handoff.leftGridAt;
    const faded = handoff.faded;
    handoff.leftGridAt = 0;
    handoff.faded = false;
    if (!at || performance.now() - at > 1500 || window.innerWidth < 900) return;
    arrivingRef.current = true;
    const reduced = reducedMotion();
    // Blur ground: the grid un-blurs the Homepage before it leaves, so there
    // is nothing to do, except after browser Back, which skips that: the
    // Homepage clears its own blur then.
    if (GROUND === "blur") {
      if (!faded && canvasRef.current) {
        canvasRef.current.animate([{ filter: blurFilter(1) + " brightness(0.88)" }, { filter: blurFilter(0) + " brightness(1)" }],
          { duration: reduced ? 200 : BLUR_OUT_MS, easing: BLUR_OUT_EASE, fill: "backwards" });
      }
      arrivingRef.current = false;
      return;
    }
    const { els, d } = zones();
    // Back from the grid arrives with no fade on the Work side, so the ground
    // makes the beige-to-cream change here instead.
    if (!faded && canvasRef.current) {
      canvasRef.current.animate([{ backgroundColor: BEIGE }, { backgroundColor: CREAM }],
        { duration: BACK_GROUND_MS, easing: "ease", fill: "backwards" });
    }
    const anims = els.map((el) => el.animate(
      reduced ? [{ opacity: 0 }, { opacity: 1 }] : [{ translate: `0 ${-d}px` }, { translate: "0 0" }],
      { duration: reduced ? 200 : HOME_RETURN_MS, easing: reduced ? "ease" : HOME_RETURN_EASE, delay: faded || reduced ? 0 : 80, fill: "backwards" }
    ));
    Promise.all(anims.map((a) => a.finished)).then(() => { arrivingRef.current = false; }).catch(() => {});
  }, [zones]);

  // ── "Visit UiPath" cursor tag ──────────────────────────────────────────
  // The link hides the real cursor (cursor: none) and this follows the
  // pointer in its place, rAF-throttled as in the original.
  const rafRef = useRef(null);
  const moveRef = useRef(null);

  const handleEnter = useCallback((e) => {
    const tag = tagRef.current;
    if (!tag) return;
    const move = (ev) => {
      const tx = ev.clientX + 16;
      const ty = ev.clientY + 16;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          tag.style.transform = `translate(${tx}px, ${ty}px) scale(1)`;
          rafRef.current = null;
        });
      }
    };
    moveRef.current = move;
    tag.classList.add("is-visible");
    move(e);
    document.addEventListener("mousemove", move);
  }, []);

  const handleLeave = useCallback(() => {
    const tag = tagRef.current;
    if (tag) tag.classList.remove("is-visible");
    if (moveRef.current) {
      document.removeEventListener("mousemove", moveRef.current);
      moveRef.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      if (moveRef.current) document.removeEventListener("mousemove", moveRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  // ── Pronunciation ──────────────────────────────────────────────────────
  const playPronunciation = useCallback((tooltipRef) => {
    if (USE_AUDIO) {
      const audio = audioRef.current;
      if (!audio) return;
      audio.currentTime = 0;
      audio.play();
      return;
    }
    const tooltip = tooltipRef.current;
    if (!tooltip) return;
    tooltip.classList.add("is-visible");
    clearTimeout(tooltip._hideTimer);
    tooltip._hideTimer = setTimeout(() => tooltip.classList.remove("is-visible"), 1500);
  }, []);

  return (
    <div className="route-home">
      <div className="canvas" ref={canvasRef}>
        <div className="stage" ref={stageRef}>

          {/* Zone 1: Left rail */}
          <div className="photo"><img src="/uploads/homepage-photo.webp" {...dims("/uploads/homepage-photo.webp")} alt="Profile photo" /></div>

          {backdrop ? null : <SiteRail active={railActive} onGo={onRailGo} />}

          <div className="wordmark">
            <div className="mark">SuCHI</div>
            <div className="phon">
              <button
                type="button"
                className="phon-control"
                aria-label="Play pronunciation of soo-chee"
                style={{ alignItems: "center" }}
                onClick={() => playPronunciation(tipDesktopRef)}>
                <span className="speaker-icon"><img src="/uploads/speaker-icon.png" {...dims("/uploads/speaker-icon.png")} alt="" style={{ width: 15, height: 15 }} /></span>
                <span className="phon-syllables">
                  <span className="phon-text">soo</span>
                  <span className="phon-dot"></span>
                  <span className="phon-text">chee</span>
                </span>
              </button>
              <span className="phon-tooltip" id="phonTooltip" ref={tipDesktopRef}>soo ~ shoe<br />chee ~ bee</span>
            </div>
          </div>

          {/* Zone 2: Quick Background panel */}
          <div className="panel" ref={panelRef}>
            <canvas className="panel-fluid" aria-hidden="true" ref={fluidRef}></canvas>
            <div className="mono-label">/ quick background</div>
            <p className="body-text">{BACKGROUND_COPY}</p>
            <p className="pull-quote">growing at the intersection of design &amp; technology</p>
          </div>

          {/* Zone 3: Tooling */}
          <div className={"tooling" + (toolingExpanded ? " tooling-expanded" : "")} ref={toolingRef}>
            <div className="mono-label tool-heading">
              <span className="th-sizer">/ ai experiments</span>
              <span className="th-label th-default">/ tooling</span>
              <span className="th-label th-group th-design">/ design</span>
              <span className="th-label th-group th-build">/ build</span>
              <span className="th-label th-group th-ai">/ ai experiments</span>
            </div>
            <div className="pill-grid" style={{ gap: 10 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div className="pill-row">
                  <span className="pill" data-tool-group="design" data-highlight="build-note" style={{ fontSize: 9 }}>Figma</span>
                  <span className="pill" data-tool-group="design" style={{ fontSize: 9 }}>Adobe suite</span>
                </div>
                <div className="pill-row">
                  <span className="pill" data-tool-group="design" style={{ fontSize: 9 }}>GOOGLE STITCH</span>
                  <span className="pill" data-tool-group="design" data-highlight="build-note" style={{ fontSize: 9 }}>JITTER</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div className="pill-row">
                  <span className="pill" data-tool-group="build" data-highlight="build-note" style={{ fontSize: 9 }}>Claude</span>
                  <span className="pill" data-tool-group="build" style={{ fontSize: 9 }}>cursor</span>
                  <span className="pill" data-tool-group="build" data-highlight="build-note" style={{ fontSize: 9 }}>GITHUB</span>
                </div>
                <div className="pill-row">
                  <span className="pill" data-tool-group="build" data-highlight="build-note" style={{ fontSize: 9 }}>HTML</span>
                  <span className="pill" data-tool-group="build" data-highlight="build-note" style={{ fontSize: 9 }}>CSS</span>
                  <span className="pill" data-tool-group="build" data-highlight="build-note" style={{ fontSize: 9 }}>JS</span>
                  <span className="pill" data-tool-group="build" data-highlight="build-note" style={{ fontSize: 9 }}>REACT</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div className="pill-row">
                  <span className="pill" data-tool-group="ai" style={{ fontSize: 9 }}>AI STUDIO</span>
                  <span className="pill" data-tool-group="ai" style={{ fontSize: 9 }}>Antigravity</span>
                </div>
              </div>
            </div>
            <div className="tooling-trigger-row">
              <button
                type="button"
                className="tooling-toggle"
                aria-expanded={toolingExpanded}
                aria-label={toolingExpanded ? "Hide build note" : "Show build note"}
                onClick={() => setToolingExpanded((v) => !v)}>
                {toolingExpanded ? "−" : "+"}
              </button>
              {/* Conditionally rendered, not hidden: absent from the DOM and from
                  screen readers entirely while collapsed, per spec point 3. */}
              {toolingExpanded && <span className="tooling-note">used to build this site.</span>}
            </div>
          </div>

          {/* Zone 4: Right rail */}
          <div className="right-rail">
            <div className="exp-block">
              <div className="mono-label">/ experience</div>
              <a
                className="uipath-link uipath-hover-target"
                href="https://www.uipath.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit UiPath (opens in new tab)"
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}>
                <img className="uipath-logo" src="/uploads/uipath-logo-light.png" {...dims("/uploads/uipath-logo-light.png")} alt="UiPath" />
              </a>
              <div className="role-row">
                <span className="date">‘24-’25</span>
                <span className="role">Associate Product Designer</span>
              </div>
              <div className="role-row">
                <span className="date">‘23</span>
                <span className="role">Product Design Intern</span>
              </div>
            </div>
            <div className="edu-block">
              <div className="mono-label">/ education</div>
              <img className="iitg-logo" src="/uploads/iitg-logo.png" {...dims("/uploads/iitg-logo.png")} alt="IIT Guwahati" />
              <div className="role-row">
                <span className="date">‘20-’24</span>
                <span className="role">b.des. <span className="sep"></span> iit Guwahati</span>
              </div>
            </div>
          </div>

          <div className="lockup" style={{ bottom: "0px" }}>
            <p className="h1">Design</p>
            <p className="h1">Technologist</p>
            <p className="sub" style={{ fontWeight: 500 }}>beyond product design</p>
          </div>

        </div>
      </div>

      {/* Mobile fallback (<900px) — mirrors work.html's stacked MobileList pattern */}
      <div className="mobile-stack">
        <div className="photo" style={{ position: "static", width: 127, height: 175, marginBottom: 24 }}><img src="/uploads/homepage-photo.webp" {...dims("/uploads/homepage-photo.webp")} alt="Profile photo" /></div>

        <div className="wordmark" style={{ position: "static", marginBottom: 28 }}>
          <div className="mark" style={{ fontSize: 48 }}>SuCHI</div>
          <div className="phon">
            <button
              type="button"
              className="phon-control"
              aria-label="Play pronunciation of soo-chee"
              onClick={() => playPronunciation(tipMobileRef)}>
              <span className="speaker-icon" style={{ width: 14, height: 14 }}><img src="/uploads/speaker-icon.png" {...dims("/uploads/speaker-icon.png")} alt="" /></span>
              <span className="phon-syllables">
                <span className="phon-text" style={{ fontSize: 12 }}>soo</span>
                <span className="phon-dot"></span>
                <span className="phon-text" style={{ fontSize: 12 }}>chee</span>
              </span>
            </button>
            <span className="phon-tooltip" ref={tipMobileRef}>soo ~ shoe<br />chee ~ bee</span>
          </div>
        </div>

        <SiteRail variant="mobile" />

        <div className="panel" style={{ position: "static", width: "100%", height: "auto", padding: 24 }}>
          <div className="mono-label" style={{ fontSize: 11 }}>/ quick background</div>
          <p className="body-text" style={{ maxWidth: "none", marginTop: 8 }}>{BACKGROUND_COPY}</p>
          <p className="pull-quote" style={{ fontSize: 22, maxWidth: "none", marginTop: 32 }}>growing at the intersection of design &amp; technology</p>
        </div>

        {/* Tool list, order and highlight set are now identical to the desktop
            composition above — they had diverged (mobile carried Framer and v0,
            and was missing Jitter, HTML, CSS, JS and AI Studio), which made the
            build-note highlight impossible to render here. Only the presentation
            differs, deliberately: one wrapping row instead of three columns, and
            11px pills instead of 9px. If a tool changes, change it in BOTH. */}
        <div className={"tooling" + (toolingExpanded ? " tooling-expanded" : "")} style={{ position: "static", width: "100%", marginTop: 40 }}>
          <div className="mono-label tool-heading" style={{ fontSize: 11 }}>
            <span className="th-sizer">/ ai experiments</span>
            <span className="th-label th-default">/ tooling</span>
            <span className="th-label th-group th-design">/ design</span>
            <span className="th-label th-group th-build">/ build</span>
            <span className="th-label th-group th-ai">/ ai experiments</span>
          </div>
          <div className="pill-grid" style={{ marginTop: 8, flexWrap: "wrap", flexDirection: "row" }}>
            <span className="pill" data-tool-group="design" data-highlight="build-note" style={{ fontSize: 11, padding: "8px 14px" }}>Figma</span>
            <span className="pill" data-tool-group="design" style={{ fontSize: 11, padding: "8px 14px" }}>Adobe suite</span>
            <span className="pill" data-tool-group="design" style={{ fontSize: 11, padding: "8px 14px" }}>GOOGLE STITCH</span>
            <span className="pill" data-tool-group="design" data-highlight="build-note" style={{ fontSize: 11, padding: "8px 14px" }}>JITTER</span>
            <span className="pill" data-tool-group="build" data-highlight="build-note" style={{ fontSize: 11, padding: "8px 14px" }}>Claude</span>
            <span className="pill" data-tool-group="build" style={{ fontSize: 11, padding: "8px 14px" }}>cursor</span>
            <span className="pill" data-tool-group="build" data-highlight="build-note" style={{ fontSize: 11, padding: "8px 14px" }}>GITHUB</span>
            <span className="pill" data-tool-group="build" data-highlight="build-note" style={{ fontSize: 11, padding: "8px 14px" }}>HTML</span>
            <span className="pill" data-tool-group="build" data-highlight="build-note" style={{ fontSize: 11, padding: "8px 14px" }}>CSS</span>
            <span className="pill" data-tool-group="build" data-highlight="build-note" style={{ fontSize: 11, padding: "8px 14px" }}>JS</span>
            <span className="pill" data-tool-group="build" data-highlight="build-note" style={{ fontSize: 11, padding: "8px 14px" }}>REACT</span>
            <span className="pill" data-tool-group="ai" style={{ fontSize: 11, padding: "8px 14px" }}>AI STUDIO</span>
            <span className="pill" data-tool-group="ai" style={{ fontSize: 11, padding: "8px 14px" }}>Antigravity</span>
          </div>
          <div className="tooling-trigger-row">
            <button
              type="button"
              className="tooling-toggle"
              aria-expanded={toolingExpanded}
              aria-label={toolingExpanded ? "Hide build note" : "Show build note"}
              onClick={() => setToolingExpanded((v) => !v)}>
              {toolingExpanded ? "−" : "+"}
            </button>
            {toolingExpanded && <span className="tooling-note">used to build this site.</span>}
          </div>
        </div>

        <div className="right-rail" style={{ position: "static", width: "100%", marginTop: 40 }}>
          <div className="exp-block">
            <div className="mono-label" style={{ fontSize: 11 }}>/ experience</div>
            <a
              className="uipath-link uipath-hover-target"
              href="https://www.uipath.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit UiPath (opens in new tab)"
              style={{ marginTop: 8 }}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}>
              <img className="uipath-logo" src="/uploads/uipath-logo-light.png" {...dims("/uploads/uipath-logo-light.png")} alt="UiPath" style={{ height: 16 }} />
            </a>
            <div className="role-row" style={{ fontSize: 13 }}>
              <span className="date" style={{ fontSize: 13, width: 64 }}>‘24-’25</span>
              <span className="role" style={{ fontSize: 13 }}>Associate Product Designer</span>
            </div>
            <div className="role-row">
              <span className="date" style={{ fontSize: 13, width: 64 }}>‘23</span>
              <span className="role" style={{ fontSize: 13 }}>Product Design Intern</span>
            </div>
          </div>
          <div className="edu-block">
            <div className="mono-label" style={{ fontSize: 11 }}>/ education</div>
            <img className="iitg-logo" src="/uploads/iitg-logo.png" {...dims("/uploads/iitg-logo.png")} alt="IIT Guwahati" style={{ width: 36, height: 36, marginTop: 8 }} />
            <div className="role-row">
              <span className="date" style={{ fontSize: 13, width: 64 }}>‘20-’24</span>
              <span className="role" style={{ fontSize: 13 }}>b.des. <span className="sep"></span> iit Guwahati</span>
            </div>
          </div>
        </div>

        <div className="lockup" style={{ position: "static", textAlign: "left", marginTop: 48 }}>
          <p className="h1" style={{ fontSize: 30 }}>Design</p>
          <p className="h1" style={{ fontSize: 30 }}>Technologist</p>
          <p className="sub" style={{ fontSize: 24, marginTop: 4 }}>beyond product design</p>
        </div>
      </div>

      <div className="cursor-tag" id="cursorTag" ref={tagRef}><span className="arrow">↗</span><span>Visit UiPath</span></div>
      <audio id="suchiAudio" preload="none" src="/assets/audio/suchi-pronunciation.mp3" ref={audioRef}></audio>
    </div>
  );
}
