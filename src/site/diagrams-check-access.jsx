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
function VideoPlaceholder({ note, src }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        border: "1px solid var(--ink)",
        background:
          "repeating-linear-gradient(45deg, transparent 0 14px, color-mix(in oklch, var(--ink) 6%, transparent) 14px 15px), var(--surface)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 18,
        overflow: "hidden"
      }}>

      <video
        src={src || undefined}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: src ? "block" : "none"
        }} />

      <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
        <MonoLabel>PLACEHOLDER · PRODUCT SCREEN</MonoLabel>
      </div>
      <div
        style={{
          fontFamily: sansFamily,
          fontSize: 14,
          color: "var(--ink)",
          maxWidth: "70%",
          position: "relative",
          zIndex: 1
        }}>
        {note}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
        <MonoLabel>SUCHI.COM / CHECK-ACCESS</MonoLabel>
        <MonoLabel>↗ FULL FIDELITY</MonoLabel>
      </div>
    </div>);
}

// ── Combined stateful pillars + screen section ────────────────
function CheckAccessSolutionSection({ pillars }) {
  const [activePillar, setActivePillar] = React.useState(null);

  // Pillar video sources — all null until wired up
  const pillarSrcs = [null, null, null];
  const videoSrc = activePillar != null ? pillarSrcs[activePillar - 1] : null;

  return (
    <React.Fragment>

      <VideoPlaceholder
        note="Check Access — unified permissions surface. Single navigable view across 15+ services."
        src={videoSrc} />

      <div style={{ marginTop: 24 }}>
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
      </div>
    </React.Fragment>);
}

export { AccessDeniedDiagram, AuditQueryFlow, CheckAccessSolutionSection, ScreenPlaceholder };
