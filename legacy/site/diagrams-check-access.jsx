/* global React */
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
        <window.MonoLabel>PLACEHOLDER · PRODUCT SCREEN</window.MonoLabel>
      </div>
      <div
        style={{
          fontFamily: window.sansFamily,
          fontSize: 14,
          color: "var(--ink)",
          maxWidth: "70%"
        }}>
        
        {note}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <window.MonoLabel>SUCHI.COM / CHECK-ACCESS</window.MonoLabel>
        <window.MonoLabel>↗ FULL FIDELITY</window.MonoLabel>
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
        <window.MonoLabel>BEFORE STATE</window.MonoLabel>
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
              fontFamily: window.sansFamily,
              fontWeight: 700,
              fontSize: 18,
              color: "var(--ink)",
              marginBottom: 8
            }}>
            
            Access Denied
          </div>
          <div
            style={{
              fontFamily: window.sansFamily,
              fontSize: 13,
              lineHeight: 1.5,
              color: "var(--muted)"
            }}>
            
            Please ask your administrator to check your permissions for this automation.
          </div>
        </div>
      </div>
      <div>
        <window.MonoLabel>USER QUERY → ADMIN BURDEN</window.MonoLabel>
        <p
          style={{
            fontFamily: window.serifFamily,
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
    
      <window.MonoLabel
      style={{ color: accent ? "var(--ink-inverse)" : "var(--muted)", display: "block" }}>
      
        {sub}
      </window.MonoLabel>
      <div
      style={{
        fontFamily: window.sansFamily,
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
    
      <window.MonoLabel style={{ color: "var(--accent)" }}>{caption}</window.MonoLabel>
      <div
      style={{
        fontFamily: window.monoFamily,
        color: "var(--accent)",
        fontSize: 22,
        lineHeight: 1
      }}>
      
        →
      </div>
    </div>;


  return (
    <div>
      <window.MonoLabel>AUDIT QUERY FLOW</window.MonoLabel>
      <div
        style={{
          marginTop: 14
        }}>
        
        <div
          style={{
            fontFamily: window.serifFamily,
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
          
          <window.MonoLabel>Initiating system-wide scan.</window.MonoLabel>
          <window.MonoLabel>15+ SERVICES · MULTI-TENANT</window.MonoLabel>
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
        <window.MonoLabel>PLACEHOLDER · PRODUCT SCREEN</window.MonoLabel>
      </div>
      <div
        style={{
          fontFamily: window.sansFamily,
          fontSize: 14,
          color: "var(--ink)",
          maxWidth: "70%",
          position: "relative",
          zIndex: 1
        }}>
        {note}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
        <window.MonoLabel>SUCHI.COM / CHECK-ACCESS</window.MonoLabel>
        <window.MonoLabel>↗ FULL FIDELITY</window.MonoLabel>
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
        <window.MonoLabel>SOLUTION PILLARS</window.MonoLabel>

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
        `}</style>

        <div
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
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
                  borderRight: i < pillars.length - 1 ? "1px solid var(--ink)" : "none",
                  height: 160,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start"
                }}>

                <div
                  style={{
                    fontFamily: window.serifFamily,
                    fontSize: 56,
                    lineHeight: 1,
                    color: "var(--accent)"
                  }}>
                  0{num}
                </div>

                <div style={{ height: 20 }} />

                <div
                  style={{
                    fontFamily: window.sansFamily,
                    fontWeight: 700,
                    fontSize: 18,
                    letterSpacing: "-0.01em",
                    color: "var(--ink)"
                  }}>
                  {p.label}
                </div>

                <div style={{ height: 6 }} />

                <window.MonoLabel>{p.tag}</window.MonoLabel>
              </div>);
          })}
        </div>
      </div>
    </React.Fragment>);
}

window.AccessDeniedDiagram = AccessDeniedDiagram;
window.AuditQueryFlow = AuditQueryFlow;
window.CheckAccessSolutionSection = CheckAccessSolutionSection;
window.ScreenPlaceholder = ScreenPlaceholder;