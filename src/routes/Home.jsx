import React, { useCallback, useEffect, useRef } from "react";
import SiteRail from "../layouts/SiteRail.jsx";
import { useFit } from "../hooks/useFit.js";
import { usePanelFluid } from "../hooks/usePanelFluid.js";
import "./Home.css";

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
  "The (un)glamorous work holds everything up. UiPath's admin layer- the control plane behind every business automation, 10,000+ customer enterprises. Joined as the most junior designer on it. Led it within the year. Systems, governance, the edge cases that decide whether software earns trust. Depth over breadth.";

export default function Home() {
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
          <div className="photo"><img src="/uploads/homepage-photo.png" alt="Profile photo" /></div>

          <SiteRail />

          <div className="wordmark">
            <div className="mark">SuCHI</div>
            <div className="phon">
              <button
                type="button"
                className="phon-control"
                aria-label="Play pronunciation of soo-chee"
                style={{ alignItems: "center" }}
                onClick={() => playPronunciation(tipDesktopRef)}>
                <span className="speaker-icon"><img src="/uploads/speaker-icon.png" alt="" style={{ width: 15, height: 15 }} /></span>
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
          <div className="tooling" ref={toolingRef}>
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
                  <span className="pill" data-tool-group="design" style={{ fontSize: 9 }}>Figma</span>
                  <span className="pill" data-tool-group="design" style={{ fontSize: 9 }}>Adobe suite</span>
                </div>
                <div className="pill-row">
                  <span className="pill" data-tool-group="design" style={{ fontSize: 9 }}>GOOGLE STITCH</span>
                  <span className="pill" data-tool-group="design" style={{ fontSize: 9 }}>JITTER</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div className="pill-row">
                  <span className="pill" data-tool-group="build" style={{ fontSize: 9 }}>Claude</span>
                  <span className="pill" data-tool-group="build" style={{ fontSize: 9 }}>cursor</span>
                  <span className="pill" data-tool-group="build" style={{ fontSize: 9 }}>GITHUB</span>
                </div>
                <div className="pill-row">
                  <span className="pill" data-tool-group="build" style={{ fontSize: 9 }}>HTML</span>
                  <span className="pill" data-tool-group="build" style={{ fontSize: 9 }}>CSS</span>
                  <span className="pill" data-tool-group="build" style={{ fontSize: 9 }}>JS</span>
                  <span className="pill" data-tool-group="build" style={{ fontSize: 9 }}>REACT</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div className="pill-row">
                  <span className="pill" data-tool-group="ai" style={{ fontSize: 9 }}>AI STUDIO</span>
                  <span className="pill" data-tool-group="ai" style={{ fontSize: 9 }}>Antigravity</span>
                </div>
              </div>
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
                <img className="uipath-logo" src="/uploads/uipath-logo-light.png" alt="UiPath" />
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
              <img className="iitg-logo" src="/uploads/iitg-logo.png" alt="IIT Guwahati" />
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
        <div className="photo" style={{ position: "static", width: 127, height: 175, marginBottom: 24 }}><img src="/uploads/homepage-photo.png" alt="Profile photo" /></div>

        <div className="wordmark" style={{ position: "static", marginBottom: 28 }}>
          <div className="mark" style={{ fontSize: 48 }}>SuCHI</div>
          <div className="phon">
            <button
              type="button"
              className="phon-control"
              aria-label="Play pronunciation of soo-chee"
              onClick={() => playPronunciation(tipMobileRef)}>
              <span className="speaker-icon" style={{ width: 14, height: 14 }}><img src="/uploads/speaker-icon.png" alt="" /></span>
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

        <div className="tooling" style={{ position: "static", width: "100%", marginTop: 40 }}>
          <div className="mono-label tool-heading" style={{ fontSize: 11 }}>
            <span className="th-sizer">/ ai experiments</span>
            <span className="th-label th-default">/ tooling</span>
            <span className="th-label th-group th-design">/ design</span>
            <span className="th-label th-group th-build">/ build</span>
            <span className="th-label th-group th-ai">/ ai experiments</span>
          </div>
          <div className="pill-grid" style={{ marginTop: 8, flexWrap: "wrap", flexDirection: "row" }}>
            <span className="pill" data-tool-group="design" style={{ fontSize: 11, padding: "8px 14px" }}>Figma</span>
            <span className="pill" data-tool-group="design" style={{ fontSize: 11, padding: "8px 14px" }}>Adobe suite</span>
            <span className="pill" data-tool-group="design" style={{ fontSize: 11, padding: "8px 14px" }}>Framer</span>
            <span className="pill" data-tool-group="build" style={{ fontSize: 11, padding: "8px 14px" }}>Claude</span>
            <span className="pill" data-tool-group="build" style={{ fontSize: 11, padding: "8px 14px" }}>cursor</span>
            <span className="pill" data-tool-group="ai" style={{ fontSize: 11, padding: "8px 14px" }}>v0</span>
            <span className="pill" data-tool-group="build" style={{ fontSize: 11, padding: "8px 14px" }}>react</span>
            <span className="pill" data-tool-group="build" style={{ fontSize: 11, padding: "8px 14px" }}>github</span>
            <span className="pill" data-tool-group="design" style={{ fontSize: 11, padding: "8px 14px" }}>Google stitch</span>
            <span className="pill" data-tool-group="ai" style={{ fontSize: 11, padding: "8px 14px" }}>Antigravity</span>
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
              <img className="uipath-logo" src="/uploads/uipath-logo-light.png" alt="UiPath" style={{ height: 16 }} />
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
            <img className="iitg-logo" src="/uploads/iitg-logo.png" alt="IIT Guwahati" style={{ width: 36, height: 36, marginTop: 8 }} />
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
