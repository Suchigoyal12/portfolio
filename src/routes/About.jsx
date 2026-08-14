import React, { useCallback, useEffect, useRef, useState } from "react";
import SiteRail from "../layouts/SiteRail.jsx";
import { useFit } from "../hooks/useFit.js";
import { usePersonTimeline } from "../hooks/usePersonTimeline.js";
import { LYRICS, PHOTOS, PH_GAP, PH_PX_PER_SEC } from "./aboutContent.js";
import "./About.css";

// Ported from legacy/about.html. Both branches preserved (brief 2.6).
//
// The original drove everything through one render() that replaced
// .mode-content's innerHTML on every toggle. That becomes React state — but the
// consequence the brief calls out survives with it: the toggle destroys and
// recreates .shelf and the photo marquee, so the layout pass has to re-run
// after every branch change, not only on resize. useFit takes `deps: [mode]`
// for exactly that, and afterFit re-measures the marquee.
//
// `mode` starts null, so nothing renders until a branch is chosen. Below 900px
// there is no way to choose one, which leaves the mobile page blank. That is a
// known, deferred issue — listed in the brief's deferred section. Preserved
// deliberately; do not "fix" it here.

const SHELF_L = [772, 632]; // [value@1440, value@1300] — left edge, px

const ICON_RING = (
  <circle cx="8" cy="8" r="6.6" stroke="currentColor" strokeWidth="1" fill="none" />
);
const IconPlay = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">{ICON_RING}<path d="M6.5 5.4 10.6 8 6.5 10.6Z" fill="currentColor" /></svg>
);
const IconPause = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">{ICON_RING}<rect x="6.1" y="5.4" width="1.3" height="5.2" fill="currentColor" /><rect x="8.6" y="5.4" width="1.3" height="5.2" fill="currentColor" /></svg>
);

// Full set duplicated once → rendered strip is PHOTOS.length × 2, so the reset is seamless.
function PhotoMarquee() {
  const slot = (p, i, dupe) => (
    <div className={dupe ? "ph-slot ph-dupe" : "ph-slot"} aria-hidden={dupe ? "true" : undefined} key={(dupe ? "d" : "s") + i}>
      <img src={p.src} width={p.w} height={p.h} alt="" draggable="false" />
    </div>
  );
  return (
    <div className="ph-marquee" style={{ "--ph-gap": PH_GAP + "px" }}>
      <div className="ph-track">
        {PHOTOS.map((p, i) => slot(p, i, false))}
        {PHOTOS.map((p, i) => slot(p, i, true))}
      </div>
    </div>
  );
}

// DESIGNER branch — static content above the marquee unchanged.
function DesignerBranch() {
  return (
    <div className="designer" style={{ width: 254 }}>
      <div className="block">
        <p className="mono-label">HI THERE! I’M SUCHI</p>
        <p className="positioning">I believe the definition of "done" has changed. I don’t just hand off static pixels; I operate at the execution layer. I focus on <span className="hl">translating complex logic into systems that make users smile</span> :)</p>
        <p className="signature" style={{ display: "none" }}>PRODUCT DESIGNER · 2 YRS · ENTERPRISE / AI PLATFORM TOOLING</p>
      </div>
      <div className="block">
        <p className="mono-label">/THE MOTTO</p>
        <p className="motto">Good design should disappear into the task getting done.</p>
      </div>
      <div style={{ boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 36, justifyContent: "normal", alignItems: "normal" }}>
        <div className="block">
          <p className="mono-label">/ MORE ABOUT ME</p>
          <div className="pill-row">
            <span className="pill">Anchorenza</span>
            <span className="pill">Travel</span>
            <span className="pill">Sports</span>
            <span className="pill">Gardening</span>
            <span className="pill">Fun facts</span>
          </div>
        </div>
        <PhotoMarquee />
      </div>
    </div>
  );
}

function PersonBranch({ reduceMotion, timeline, lyricsRef, shelfRef }) {
  const { playing, cue, revealed, toggle, seekTo, onScrollIntent } = timeline;
  const revealClass = revealed ? " is-revealed" : "";

  return (
    <div className="person">
      <p className="mono-label eyebrow"><span className="hl">/ lets build a persona</span></p>

      {!reduceMotion && (
        <button type="button" className="play-btn" aria-pressed={String(playing)} onClick={toggle}>
          {playing ? <IconPause /> : <IconPlay />}
          <span className="play-label">{playing ? "Pause" : "Play"}</span>
        </button>
      )}

      <div
        className={"lyrics" + revealClass}
        ref={lyricsRef}
        onWheel={onScrollIntent}
        onTouchMove={onScrollIntent}
        onPointerDown={onScrollIntent}>
        {LYRICS.map((p, i) =>
          reduceMotion ? (
            // No timeline in the reduced-motion path — nothing to seek, so the
            // paragraphs stay plain text rather than becoming controls.
            <p key={i} className={i === cue ? "is-active" : undefined}>{p}</p>
          ) : (
            <p
              key={i}
              className={i === cue ? "is-active" : undefined}
              tabIndex={0}
              role="button"
              onClick={() => seekTo(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); seekTo(i); }
              }}>
              {p}
            </p>
          )
        )}
      </div>

      <div className={"shelf" + revealClass} ref={shelfRef}>
        <img src="/uploads/shelf.png" alt="A shelf of books, potted plants, pine cones and a candle" />
        <p className="shelf-cap">Always in “let me try this” mode, curious, building &amp; exploring.</p>
      </div>
    </div>
  );
}

export default function About() {
  // Single state variable.
  const [mode, setMode] = useState(null); // null | 'designer' | 'person'

  const canvasRef = useRef(null);
  const stageRef  = useRef(null);
  const shelfRef  = useRef(null);   // desktop copy — the one fit() anchors
  const shelfMobileRef = useRef(null);
  const lyricsRefs = useRef([]);

  const [reduceMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const setLyricsRef = (i) => (el) => { lyricsRefs.current[i] = el; };

  const timeline = usePersonTimeline({ reduceMotion, panelRefs: lyricsRefs });
  const { teardown } = timeline;

  // Sum the FIRST SET's real slot widths and re-derive the loop-reset point + duration.
  // Slots no longer share a width — each one is as wide as its photo's ratio makes it —
  // so this adds up the actual widths instead of multiplying one by the count.
  // Count-driven still: swapping PHOTOS to 4 or 10 needs no change here.
  const phMeasure = useCallback(() => {
    document.querySelectorAll(".route-about .ph-marquee").forEach((m) => {
      const slots = m.querySelectorAll(".ph-slot");
      if (!slots.length) return;
      let setW = 0;
      for (let i = 0; i < PHOTOS.length && i < slots.length; i++) {
        const w = slots[i].offsetWidth; // layout px — getBoundingClientRect() would return scaled px under fit()
        if (!w) return;                 // not laid out yet; a later call will catch it
        setW += w + PH_GAP;
      }
      if (!setW) return;
      m.style.setProperty("--ph-set-w", setW + "px");
      m.style.setProperty("--ph-dur", (setW / PH_PX_PER_SEC).toFixed(2) + "s");
    });
  }, []);

  // Safety net: width/height attributes make the pre-load layout correct, but if a photo's
  // attributes ever drift from its real pixels, re-measuring on load self-corrects.
  useEffect(() => {
    const onLoad = (e) => {
      if (e.target && e.target.tagName === "IMG" && e.target.closest(".ph-slot")) phMeasure();
    };
    document.addEventListener("load", onLoad, true);
    return () => document.removeEventListener("load", onLoad, true);
  }, [phMeasure]);

  /* ---------- Responsive shell — ported from index.html fit() ----------
     Frame 1440, anchor 1300, identical band boundaries to Homepage so the rail and the
     left column sit at the same absolute position on both pages at every width.
     .shelf is destroyed and recreated by the branch toggle, so this re-runs on [mode]
     as well as on resize — the original's applyLayout() after every innerHTML swap. */
  useFit({
    canvasRef,
    stageRef,
    columns: [{ ref: shelfRef, at1440: SHELF_L[0], at1300: SHELF_L[1] }],
    afterFit: phMeasure,
    deps: [mode],
  });

  // Leaving the branch always resets it — returning starts fresh.
  useEffect(() => {
    if (mode !== "person") teardown();
  }, [mode, teardown]);

  const pick = (next) => {
    if (mode === next) return; // already active — no deselect
    setMode(next);
  };

  const toggles = (
    <>
      <button
        type="button"
        className="mode-toggle is-designer"
        role="radio"
        aria-checked={String(mode === "designer")}
        data-mode="designer"
        onClick={() => pick("designer")}>
        <span className="radio"></span>
        <span className="label">the designer</span>
      </button>
      <button
        type="button"
        className="mode-toggle is-person"
        role="radio"
        aria-checked={String(mode === "person")}
        data-mode="person"
        onClick={() => pick("person")}>
        <span className="radio"></span>
        <span className="label">the person</span>
      </button>
    </>
  );

  const branch = (which) => {
    if (mode === null) return null;
    if (mode === "designer") return <DesignerBranch />;
    if (mode === "person")
      return (
        <PersonBranch
          reduceMotion={reduceMotion}
          timeline={timeline}
          lyricsRef={setLyricsRef(which === "desktop" ? 0 : 1)}
          shelfRef={which === "desktop" ? shelfRef : shelfMobileRef}
        />
      );
    return <p className="stub">{mode} branch</p>;
  };

  return (
    <div className="route-about">
      <div className="canvas" ref={canvasRef}>
        <div className="stage" ref={stageRef}>

          {/* Zone 1: Left rail */}
          <SiteRail />

          {/* Mode toggles */}
          {toggles}

          {/* Content area — renders off `mode` */}
          <div className="mode-content" id="modeContent">{branch("desktop")}</div>

        </div>
      </div>

      <div className="mobile-stack">
        <SiteRail variant="mobile" />
        <div className="mode-content" id="modeContentMobile" style={{ position: "static", left: "auto", top: "auto" }}>{branch("mobile")}</div>
      </div>
    </div>
  );
}
