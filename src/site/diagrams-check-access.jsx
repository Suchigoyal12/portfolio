import React from "react";
import { MonoLabel, monoFamily, sansFamily, serifFamily } from "./shared.jsx";
// =============================================================
// CASE STUDY DIAGRAMS — UiPath Check Access
// Recreated from PDF source in brutalist editorial style.
// Heavy product screens are represented as labeled placeholders.
// =============================================================

// ── Heavy-screen placeholder (striped, mono caption) ──────────
function ScreenPlaceholder({ label, ratio = "16 / 10", note }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: ratio,
        border: "1px solid var(--ink)",
        background:
        "repeating-linear-gradient(45deg, transparent 0 14px, color-mix(in oklch, var(--ink) 6%, transparent) 14px 15px), var(--surface)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 18
      }}>
      
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <MonoLabel>PLACEHOLDER · PRODUCT SCREEN</MonoLabel>
      </div>
      <div
        style={{
          fontFamily: sansFamily,
          fontSize: 14,
          color: "var(--ink)",
          maxWidth: "70%"
        }}>
        
        {note}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <MonoLabel>SUCHI.COM / CHECK-ACCESS</MonoLabel>
        <MonoLabel>↗ FULL FIDELITY</MonoLabel>
      </div>
    </div>);

}

// ── "Access Denied" diagram (recreated from PDF top) ──────────
function AccessDeniedDiagram() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
        alignItems: "center"
      }}>
      
      <div>
        <MonoLabel>BEFORE STATE</MonoLabel>
        <div
          style={{
            marginTop: 16,
            border: "1px solid var(--ink)",
            background: "var(--bg)",
            padding: "20px 22px"
          }}>
          
          <div
            style={{
              width: 18,
              height: 18,
              border: "2px solid var(--accent)",
              borderRadius: "50%",
              position: "relative",
              marginBottom: 12
            }}>
            
            <span
              style={{
                position: "absolute",
                inset: 0,
                margin: "auto",
                width: 10,
                height: 2,
                background: "var(--accent)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) rotate(45deg)"
              }} />
            
          </div>
          <div
            style={{
              fontFamily: sansFamily,
              fontWeight: 700,
              fontSize: 18,
              color: "var(--ink)",
              marginBottom: 8
            }}>
            
            Access Denied
          </div>
          <div
            style={{
              fontFamily: sansFamily,
              fontSize: 13,
              lineHeight: 1.5,
              color: "var(--muted)"
            }}>
            
            Please ask your administrator to check your permissions for this automation.
          </div>
        </div>
      </div>
      <div>
        <MonoLabel>USER QUERY → ADMIN BURDEN</MonoLabel>
        <p
          style={{
            fontFamily: serifFamily,
            fontStyle: "italic",
            fontSize: 22,
            lineHeight: 1.35,
            marginTop: 12,
            color: "var(--ink)"
          }}>
          
          Every denial routed back to a human, traversing 15+ services to answer a single question.
        </p>
      </div>
    </div>);

}

// ── Audit query flow: Admin → Scan → User (Alex) ───────────────
function AuditQueryFlow() {
  const Node = ({ label, sub, accent }) =>
  <div
    style={{
      flex: 1,
      border: "1px solid var(--ink)",
      background: accent ? "var(--ink-panel)" : "var(--surface)",
      color: accent ? "var(--ink-inverse)" : "var(--ink)",
      padding: "20px 18px",
      minHeight: 110
    }}>
    
      <MonoLabel
      style={{ color: accent ? "var(--ink-inverse)" : "var(--muted)", display: "block" }}>
      
        {sub}
      </MonoLabel>
      <div
      style={{
        fontFamily: sansFamily,
        fontWeight: 700,
        fontSize: 22,
        letterSpacing: "-0.01em",
        marginTop: 10
      }}>
      
        {label}
      </div>
    </div>;


  const Arrow = ({ caption }) =>
  <div
    style={{
      flex: "0 0 80px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 6
    }}>
    
      <MonoLabel style={{ color: "var(--accent)" }}>{caption}</MonoLabel>
      <div
      style={{
        fontFamily: monoFamily,
        color: "var(--accent)",
        fontSize: 22,
        lineHeight: 1
      }}>
      
        →
      </div>
    </div>;


  return (
    <div>
      <MonoLabel>AUDIT QUERY FLOW</MonoLabel>
      <div
        style={{
          marginTop: 14
        }}>
        
        <div
          style={{
            fontFamily: serifFamily,
            fontStyle: "italic",
            fontSize: 26,
            color: "var(--ink)",
            marginBottom: 22
          }}>
          
          “What can the user access?”
        </div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
          <Node sub="ROLE 01" label="IT Admin" />
          <Arrow caption="QUERY" />
          <Node sub="SYSTEM" label="Check Access" accent />
          <Arrow caption="SCAN" />
          <Node sub="ROLE 02" label="User (Alex)" />
        </div>
        <div
          style={{
            marginTop: 18,
            paddingTop: 14,
            borderTop: "1px solid var(--line)",
            display: "flex",
            justifyContent: "space-between"
          }}>
          
          <MonoLabel>Initiating system-wide scan.</MonoLabel>
          <MonoLabel>15+ SERVICES · MULTI-TENANT</MonoLabel>
        </div>
      </div>
    </div>);

}

// ── Video placeholder — hatched fallback, video when src provided ──
function VideoPlaceholder({ src, poster, onEnterView }) {
  const videoRef = React.useRef(null);
  const frameRef = React.useRef(null);

  // Autoplay on scroll, pause off-screen. Same shape as the long read's reels
  // (CheckAccessFull.jsx): a video that keeps running out of view is wasted
  // decode work and, on a phone, wasted battery.
  //
  // onEnterView also selects the first pillar the first time the section is
  // reached, so the reader arrives to something already playing rather than to
  // an empty frame that has to be clicked before it does anything.
  React.useEffect(() => {
    const fig = frameRef.current;
    if (!fig) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            if (onEnterView) onEnterView();
            const v = videoRef.current;
            if (v && v.getAttribute("src")) v.play().catch(() => {});
          } else {
            const v = videoRef.current;
            if (v) v.pause();
          }
        });
      },
      { threshold: 0.5 }
    );
    io.observe(fig);
    return () => io.disconnect();
  }, [onEnterView]);

  // Restart whenever the chosen pillar changes.
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;
    if (!src) { v.pause(); return undefined; }
    v.currentTime = 0;
    v.play().catch(() => {}); // blocked autoplay simply leaves the poster up
    return () => v.pause();
  }, [src]);

  return (
    <div
      ref={frameRef}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        border: "1px solid var(--ink)",
        background:
          "repeating-linear-gradient(45deg, transparent 0 14px, color-mix(in oklch, var(--ink) 6%, transparent) 14px 15px), var(--surface)",
        overflow: "hidden"
      }}>

      {/* Nothing overlays the footage. The frame carried a "PLACEHOLDER ·
          PRODUCT SCREEN" label, a written stand-in description, and
          "SUCHI.COM / CHECK-ACCESS" and "↗ FULL FIDELITY" along the bottom —
          all of it invented chrome from before real product screens existed.
          Over a real walkthrough it read as a layering bug, and the border
          alone frames the video perfectly well. */}
      <video
        ref={videoRef}
        src={src || undefined}
        poster={poster || undefined}
        muted
        loop
        playsInline
        preload="metadata"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: src ? "block" : "none"
        }} />
    </div>
  );
}

// ── Combined stateful pillars + screen section ────────────────
// Owns the whole solution block for Check Access, in this order:
//   SOLUTION PILLARS -> the three cards -> their descriptions -> the walkthrough
//
// The descriptions are passed in rather than left where they were, in
// page-project.jsx's `children`. They have to sit BETWEEN the cards and the
// video, and CSSection renders frameSlot before children — so with the video
// in here and the descriptions out there, no arrangement of the two puts the
// video last. Taking the descriptions in is what makes the order expressible
// at all. Every other project still renders its own copy out there.
function CheckAccessSolutionSection({ pillars, artifacts }) {
  const [activePillar, setActivePillar] = React.useState(null);

  // One walkthrough per pillar, in the order the pillars are declared in
  // page-project.jsx: Disclose Progressively, Trace Origins, Scope Separation.
  // The long read shows all three as a scroll-triggered sequence; here they are
  // selected, one at a time, by clicking the pillar they belong to.
  //
  // "seperation" is the real filename, misspelled on disk. CLAUDE.md is
  // explicit that the misspelling is corrected in all three places at once or
  // not at all, and not at all is fine — so this matches the file rather than
  // quietly renaming half of it.
  const PILLAR_MEDIA = [
    { src: "/disclose-progressively.mp4", poster: "/disclose-progressively.png", label: "DISCLOSE PROGRESSIVELY" },
    { src: "/trace-origins.mp4",          poster: "/trace-origins.png",          label: "TRACE ORIGINS" },
    { src: "/scope-seperation.mp4",       poster: "/scope-seperation.png",       label: "SCOPE SEPARATION" },
  ];
  const media = activePillar != null ? PILLAR_MEDIA[activePillar - 1] : null;
  const videoSrc = media ? media.src : null;

  // Select pillar 01 the first time the section is scrolled into view, so the
  // reader arrives to the first walkthrough already running. Only ever fires
  // once, and only while nothing is selected: re-selecting on every scroll-by
  // would yank a reader off whichever pillar they had chosen.
  const autoSelectedRef = React.useRef(false);
  const handleEnterView = React.useCallback(() => {
    if (autoSelectedRef.current) return;
    autoSelectedRef.current = true;
    setActivePillar((cur) => (cur == null ? 1 : cur));
  }, []);

  return (
    <React.Fragment>

      <div>
        <MonoLabel>SOLUTION PILLARS</MonoLabel>

        <style>{`
          .pillar-card {
            background: var(--surface);
            cursor: pointer;
            transition: background 150ms ease, box-shadow 150ms ease;
            user-select: none;
          }
          .pillar-card:hover {
            background: color-mix(in oklch, var(--accent) 4%, var(--surface));
            box-shadow: inset 0 -1px 0 var(--accent);
          }
          .pillar-card.pillar-active {
            background: color-mix(in oklch, var(--accent) 8%, var(--surface));
            box-shadow: inset 2px 0 0 var(--accent);
          }

          /* The track list and the divider live here rather than inline so the
             breakpoint below can override them without !important. Both are
             computed-identical to the inline values they replace: three equal
             tracks, and a right border on every card but the last. */
          .pillar-grid { grid-template-columns: 1fr 1fr 1fr; }
          .pillar-card { height: 160px; }
          .pillar-card:not(:last-child) { border-right: 1px solid var(--ink); }

          /* Three 300px-min cards cannot sit side by side on a phone. Measured
             at 390: the tracks resolve to 160/106/139 inside a 146px column and
             push the page 245px wide. 1fr keeps an automatic min-content floor,
             so the fix is minmax(0,1fr) plus min-width:0 — a plain 1fr still
             refuses to shrink past the longest word.

             700px, because that is where the tracks stop being equal. Every
             width the parity harness measures (900/1150/1300/1440, framed) is
             above it and is untouched. */
          /* :not(.is-framed) — the stage's iframe is roughly viewport-244, so a
             900px window hands this page a 656px frame and this block would
             fire at a desktop window size. Inside the stage the layout must
             stay Stage 1's. */
          @media (max-width: 699px) {
            html:not(.is-framed) .pillar-grid { grid-template-columns: minmax(0, 1fr); }
            html:not(.is-framed) .pillar-card { min-width: 0; height: auto; min-height: 160px; }
            html:not(.is-framed) .pillar-card:not(:last-child) {
              border-right: none;
              border-bottom: 1px solid var(--ink);
            }
          }
        `}</style>

        <div
          className="pillar-grid"
          style={{
            marginTop: 14,
            display: "grid",
            gap: 0,
            border: "1px solid var(--ink)"
          }}>

          {pillars.map((p, i) => {
            const num = i + 1;
            const isActive = activePillar === num;
            return (
              <div
                key={p.label}
                className={`pillar-card${isActive ? " pillar-active" : ""}`}
                onClick={() => setActivePillar(isActive ? null : num)}
                style={{
                  paddingTop: 32,
                  paddingLeft: 22,
                  paddingRight: 22,
                  paddingBottom: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start"
                }}>

                <div
                  style={{
                    fontFamily: serifFamily,
                    fontSize: 56,
                    lineHeight: 1,
                    color: "var(--accent)"
                  }}>
                  0{num}
                </div>

                <div style={{ height: 20 }} />

                <div
                  style={{
                    fontFamily: sansFamily,
                    fontWeight: 700,
                    fontSize: 18,
                    letterSpacing: "-0.01em",
                    color: "var(--ink)"
                  }}>
                  {p.label}
                </div>

                <div style={{ height: 6 }} />

                <MonoLabel>{p.tag}</MonoLabel>
              </div>);
          })}
        </div>

        {/* The pillar descriptions. The mono label each one carried
            (DISCLOSE PROGRESSIVELY, …) is gone: the card directly above names
            the same pillar, so the label was saying it twice. Keeps the
            .artifact-grid class — project.css collapses it to one column below
            700px, and that rule should keep applying here. */}
        {artifacts && artifacts.length > 0 &&
          <div className="artifact-grid" style={{ display: "grid", gap: 16, marginTop: 24 }}>
            {artifacts.map((a) =>
              <div key={a.label} style={{ borderTop: "1px solid var(--ink)", paddingTop: 14 }}>
                <p style={{ fontFamily: sansFamily, fontSize: 14, lineHeight: 1.5, margin: 0, color: "var(--ink)" }}>
                  {a.desc}
                </p>
              </div>
            )}
          </div>
        }

        {/* The walkthrough, last. 40px rather than the 24px used between the
            cards and their descriptions: those two belong together, and the
            video is a separate beat that should not read as a fourth column
            of the same group. */}
        <div style={{ marginTop: 40 }}>
          <VideoPlaceholder
            src={videoSrc}
            poster={media ? media.poster : null}
            onEnterView={handleEnterView} />
        </div>
      </div>
    </React.Fragment>);
}

export { AccessDeniedDiagram, AuditQueryFlow, CheckAccessSolutionSection, ScreenPlaceholder };
