/* global React */
// =============================================================
// PROJECT DETAIL — UIPATH ADMIN SHELL · PUBLIC VERSION
// A gated, pre-release-safe retelling of the Admin Shell work.
// ZERO real product imagery: every plate is an abstract line-work
// illustration drawn in the page's own design language. No
// screenshots, no UI recreations, no release names, no internal
// numbers. The full case study is shared on request, under password.
// Reuses the V5 shell (sticky left rail + magazine flow) via
// shared.jsx primitives. Self-contained components below.
// =============================================================

const sans = window.sansFamily;
const mono = window.monoFamily;
const serif = window.serifFamily;

// ── Lock glyph — discretion mark used in hero + gate ───────────
function Lock({ size = 16, color = "currentColor", sw = 1.6 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: "block" }}>
      <rect x="4" y="10.5" width="16" height="11" rx="2.4" stroke={color} strokeWidth={sw} />
      <path d="M7.5 10.5 V7.4 a4.5 4.5 0 0 1 9 0 V10.5" stroke={color} strokeWidth={sw} />
      <circle cx="12" cy="15.2" r="1.5" fill={color} />
      <line x1="12" y1="16.2" x2="12" y2="18.4" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>);

}

// ── Abstract plate — bordered surface + dual caption ──────────
// Every illustration is wrapped here, double-labelled so it can
// never be mistaken for a screenshot.
function Plate({ ratio = "16 / 9", caption, children }) {
  return (
    <figure style={{ margin: 0 }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: ratio,
          border: "1px solid var(--ink)",
          background: "var(--surface)",
          overflow: "hidden"
        }}>
        
        {children}
      </div>
      <figcaption style={{ display: "flex", justifyContent: "space-between", gap: 16, marginTop: 10 }}>
        <window.MonoLabel>{caption}</window.MonoLabel>
        <window.MonoLabel>ABSTRACT · NOT PRODUCT UI</window.MonoLabel>
      </figcaption>
    </figure>);

}

// ── Magazine section shell (label rail + content) ─────────────
function Sec({ id, no, kicker, title, intro, children, last }) {
  return (
    <section id={id} style={{ padding: "72px 64px", borderBottom: last ? "none" : "1px solid var(--line)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "180px minmax(0, 1fr)", gap: 32, maxWidth: "var(--content-w)", margin: "0 auto" }}>
        <window.MonoLabel>
          SECTION {no}
          <br />
          {kicker}
        </window.MonoLabel>
        <div>
          <h2
            style={{
              fontFamily: sans,
              fontWeight: 800,
              fontSize: 48,
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              margin: 0,
              color: "var(--ink)"
            }}>
            
            {title}
          </h2>
          {intro &&
          <p
            style={{
              fontFamily: sans,
              fontSize: 18,
              lineHeight: 1.55,
              marginTop: 20,
              color: "var(--ink)",
              maxWidth: "var(--copy-w)"
            }}>
            
              {intro}
            </p>
          }
          {children}
        </div>
      </div>
    </section>);

}

// ── HERO illustration — assembled shell, schematic + abstract ──
function HeroShell() {
  const ink = "var(--ink)";
  const navY = [150, 196, 242, 288, 334, 380];
  return (
    <svg viewBox="0 0 1280 560" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true"
    style={{ position: "absolute", inset: 0 }}>
      {/* outer frame */}
      <rect x="40" y="40" width="1200" height="480" fill="none" stroke={ink} strokeWidth="2" />
      {/* top bar */}
      <line x1="40" y1="116" x2="1240" y2="116" stroke={ink} strokeWidth="2" />
      <circle cx="84" cy="78" r="12" fill="var(--accent)" />
      <rect x="112" y="70" width="120" height="16" rx="8" fill="none" stroke={ink} strokeWidth="1.5" />
      <rect x="1050" y="68" width="80" height="20" rx="10" fill="none" stroke={ink} strokeWidth="1.5" />
      <circle cx="1184" cy="78" r="12" fill="none" stroke={ink} strokeWidth="1.5" />
      {/* sidebar */}
      <line x1="312" y1="116" x2="312" y2="520" stroke={ink} strokeWidth="2" />
      {navY.map((y, i) =>
      <g key={i}>
          {i === 1 && <rect x="48" y={y - 4} width="6" height="24" fill="var(--accent)" />}
          <rect x="64" y={y} width="200" height="16" rx="8" fill={i === 1 ? "var(--line)" : "none"} stroke={ink} strokeWidth="1.5" />
        </g>
      )}
      {/* content — page header + block grid */}
      <rect x="360" y="150" width="832" height="58" fill="none" stroke={ink} strokeWidth="1.6" />
      <rect x="384" y="170" width="240" height="16" rx="8" fill="none" stroke={ink} strokeWidth="1.4" />
      <rect x="1096" y="168" width="72" height="22" rx="6" fill="none" stroke="var(--accent)" strokeWidth="1.6" />
      <rect x="360" y="246" width="398" height="118" fill="none" stroke={ink} strokeWidth="1.6" />
      <rect x="794" y="246" width="398" height="118" fill="none" stroke={ink} strokeWidth="1.6" />
      <rect x="360" y="392" width="398" height="100" fill="none" stroke={ink} strokeWidth="1.6" />
      <rect x="794" y="392" width="398" height="100" fill="none" stroke={ink} strokeWidth="1.6" />
    </svg>);

}

// ── FIG (Problem) — a flat pile of pages, resolved into a hierarchy ──
function FigProblem() {
  const ink = "var(--ink)";
  // LEFT: seven scattered, deliberately unordered outlined rectangles
  const piles = [
  { x: 56, y: 92, w: 156, h: 96, r: -6 },
  { x: 258, y: 130, w: 122, h: 78, r: 7 },
  { x: 118, y: 250, w: 164, h: 92, r: 3 },
  { x: 352, y: 286, w: 108, h: 124, r: -5 },
  { x: 64, y: 432, w: 142, h: 84, r: 8 },
  { x: 286, y: 452, w: 152, h: 98, r: -7 },
  { x: 178, y: 566, w: 132, h: 100, r: 2 }];

  // RIGHT: abstract tree — one root → three clusters of small nodes
  const clusters = [180, 360, 540];
  return (
    <svg viewBox="0 0 1280 720" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true"
    style={{ position: "absolute", inset: 0 }}>
      {/* LEFT — flat pile of seven scattered pages */}
      {piles.map((c, i) =>
      <rect
        key={i}
        x={c.x} y={c.y} width={c.w} height={c.h}
        fill="none" stroke={ink} strokeWidth="1.8"
        transform={`rotate(${c.r} ${c.x + c.w / 2} ${c.y + c.h / 2})`} />

      )}
      {/* transition arrow */}
      <line x1="560" y1="360" x2="686" y2="360" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
      <path d="M670 344 L702 360 L670 376" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* RIGHT — root node */}
      <rect x="744" y="328" width="96" height="64" rx="9" fill="none" stroke={ink} strokeWidth="2" />
      <circle cx="792" cy="360" r="6" fill="var(--accent)" />
      {clusters.map((cy, ci) =>
      <g key={ci}>
          {/* root → cluster parent */}
          <path d={`M840 360 C 922 360, 940 ${cy}, 1000 ${cy}`} fill="none" stroke={ink} strokeWidth="1.6" />
          <circle cx="1018" cy={cy} r="18" fill={ci === 0 ? "var(--accent)" : "none"} stroke={ci === 0 ? "var(--accent)" : ink} strokeWidth="1.8" />
          {/* parent → three child nodes */}
          {[-48, 0, 48].map((dy, di) =>
        <g key={di}>
              <path d={`M1036 ${cy} C 1092 ${cy}, 1104 ${cy + dy}, 1152 ${cy + dy}`} fill="none" stroke={ink} strokeWidth="1.4" />
              <circle cx="1168" cy={cy + dy} r="10" fill="none" stroke={ink} strokeWidth="1.5" />
            </g>
        )}
        </g>
      )}
    </svg>);

}

// ── FIG (Kit) — one kit, every state: matrix of shapes × states ─
function FigStates() {
  const cols = ["DEFAULT", "HOVER", "SELECTED", "DISABLED"];
  // outline → grey fill → red fill → dashed outline @ 40%
  const states = [
  { background: "transparent", border: "1.6px solid var(--ink)", opacity: 1 },
  { background: "var(--line)", border: "1.6px solid var(--ink)", opacity: 1 },
  { background: "var(--accent)", border: "1.6px solid var(--accent)", opacity: 1 },
  { background: "transparent", border: "1.6px dashed var(--ink)", opacity: 0.4 }];

  // four distinct abstract shapes
  const shapes = [
  { w: 72, h: 26, radius: 999 }, // pill
  { w: 80, h: 16, radius: 4 }, //  wide bar
  { w: 44, h: 44, radius: 6 }, //  square block
  { w: 28, h: 28, radius: 999 }]; // small circle
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 24px"
      }}>
      
      {/* column headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 18 }}>
        {cols.map((c) =>
        <div key={c} style={{ textAlign: "center" }}>
            <window.MonoLabel>{c}</window.MonoLabel>
          </div>
        )}
      </div>
      {/* rows of shapes */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {shapes.map((sh, ri) =>
        <div key={ri} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", alignItems: "center" }}>
            {states.map((st, ci) =>
          <div key={ci} style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: sh.w, height: sh.h, borderRadius: sh.radius, ...st }} />
              </div>
          )}
          </div>
        )}
      </div>
    </div>);

}

// ── PASSWORD GATE — quiet affordance under "Request access" ────
// Reveals an inline, editorial password field. Correct password
// ("123456") redirects to the full, detailed case study. Wrong
// entry shakes and shows a mono caption. No modal, no popup.
function PasswordGate() {
  const [open, setOpen] = React.useState(false);
  const [val, setVal] = React.useState("");
  const [error, setError] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const inputRef = React.useRef(null);
  const rowRef = React.useRef(null);

  const reveal = () => {
    setOpen(true);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
  };

  const shakeNow = () => {
    const el = rowRef.current;
    if (!el) return;
    el.classList.remove("pw-shake");
    void el.offsetWidth; // force reflow so the animation retriggers
    el.classList.add("pw-shake");
  };

  const submit = (e) => {
    e.preventDefault();
    if (val === "123456") {
      window.location.href = "project-admin-shell.html";
    } else {
      setError(true);
      shakeNow();
    }
  };

  const lineColor = error ? "var(--accent)" : focused ? "var(--accent)" : "var(--ink)";

  return (
    <div style={{ marginTop: 26, minHeight: 40 }}>
      <style>{`@keyframes pwShake {
        0%,100% { transform: translateX(0); }
        15% { transform: translateX(-7px); }
        30% { transform: translateX(6px); }
        45% { transform: translateX(-5px); }
        60% { transform: translateX(4px); }
        75% { transform: translateX(-2px); }
      }
      .pw-shake { animation: pwShake 360ms ease; }`}</style>
      {!open ?
      <button
        onClick={reveal}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: mono,
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--muted)",
          padding: 4
        }}>
        Have a password? <span style={{ color: "var(--accent)" }}>→</span>
      </button> :

      <form onSubmit={submit} style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div ref={rowRef} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <input
            ref={inputRef}
            type="password"
            value={val}
            onChange={(e) => { setVal(e.target.value); if (error) setError(false); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="ENTER PASSWORD"
            aria-label="Password"
            style={{
              background: "none",
              border: "none",
              borderBottom: `1.5px solid ${lineColor}`,
              outline: "none",
              fontFamily: mono,
              fontSize: 14,
              letterSpacing: "0.2em",
              color: "var(--ink)",
              padding: "8px 2px",
              width: 230,
              textAlign: "center",
              transition: "border-color 160ms ease"
            }} />
          <button
            type="submit"
            aria-label="Submit password"
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: mono, fontSize: 18, color: "var(--accent)", padding: 4 }}>
            →
          </button>
        </div>
        <div style={{ height: 14 }}>
          {error && <window.MonoLabel color="var(--accent)">Not quite.</window.MonoLabel>}
        </div>
      </form>
      }
    </div>);

}

function AdminShellPublicPage() {
  const sections = [
  { id: "overview", no: "00", label: "Overview" },
  { id: "owned", no: "01", label: "What I Owned" },
  { id: "problem", no: "02", label: "The Problem" },
  { id: "principles", no: "03", label: "The Principles" },
  { id: "gate", no: "04", label: "Full Case Study" }];


  const status = [
  ["CLIENT", "UiPath"],
  ["ROLE", "Product Designer"],
  ["DESIGNED WITH", "Satiswar Dash, Senior Product Designer"],
  ["TIMELINE", "2024-25"],
  ["READ", "2 MIN"]];


  const meta = [
  ["ROLE", "Product Designer"],
  ["TIMELINE", "2024 — 2025"],
  ["DOMAIN", "Enterprise Administration"],
  ["PLATFORM", "UiPath Automation Cloud"]];


  const owned = [
  "Navigation components — tenant picker, left nav",
  "Page templates & header system",
  "Admin grid & spacing system",
  "Design-system explorations & component states"];


  const principles = [
  { h: "Discoverability", b: "structure over search." },
  { h: "At a glance", b: "state legible before any drill-down." },
  { h: "Future-proof", b: "absorb new services without redesign." }];


  const [currentSection, setCurrentSection] = React.useState("overview");

  React.useEffect(() => {
    const onScroll = () => {
      const offsets = sections.map((s) => {
        const el = document.getElementById(s.id);
        return { id: s.id, top: el ? el.getBoundingClientRect().top : Infinity };
      });
      const top = offsets.filter((o) => o.top <= 120).sort((a, b) => b.top - a.top)[0];
      if (top) setCurrentSection(top.id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mailto =
  "mailto:" + window.SITE.email +
  "?subject=Request%20access%20%E2%80%94%20UiPath%20Admin%20Shell%20case%20study" +
  "&body=Hi%20Suchi%2C%20I%27d%20like%20access%20to%20the%20full%20Admin%20Shell%20case%20study.";

  return (
    <window.PageShell
      active="works"
      navMode="rail"
      sections={sections}
      currentSection={currentSection}
      status={status}>
      
      {() =>
      <article style={{ padding: 0 }}>
          {/* ───────── 00 · HERO ───────── */}
          <section id="overview" style={{ padding: "56px 64px 64px", borderBottom: "1px solid var(--line)" }}>
            <div style={{ maxWidth: "var(--content-w)", margin: "0 auto" }}>
            <div className="hero-topbar" style={{ display: "flex", justifyContent: "space-between", marginBottom: 32, ...window.chromeHorizon(56) }}>
              <span
              style={{
                fontFamily: mono,
                fontSize: 9,
                fontWeight: 400,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)"
              }}>
                PRESS ESC TO EXIT
              </span>
              <window.MonoLabel size={9} style={{ fontWeight: 400 }}>PROJECT 03</window.MonoLabel>
            </div>

            <h1
            style={{
              fontFamily: sans,
              fontWeight: 800,
              fontSize: "clamp(40px, 5.4vw, 76px)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              margin: 0,
              maxWidth: 1040,
              color: "var(--ink)"
            }}>
            Re-architecting the UiPath admin shell<span style={{ color: "var(--accent)" }}>.</span>
            </h1>

            <div
            style={{
              marginTop: 32,
              display: "flex",
              alignItems: "center",
              gap: 24,
              paddingTop: 24,
              borderTop: "1px solid var(--line)"
            }}>
            
              <window.WaveMotif color="var(--accent)" width={140} height={36} />
              <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 22, color: "var(--ink)", maxWidth: "var(--copy-w-wide)" }}>
                The connective tissue every admin page is built inside. Full case study available on request.
              </div>
            </div>

            <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10, color: "var(--muted)" }}>
              <Lock size={15} color="var(--muted)" />
              <window.MonoLabel>PRE-RELEASE WORK — SHOWN IN ABSTRACT</window.MonoLabel>
            </div>



            </div>
          </section>

          {/* PROJECT OVERVIEW — metadata */}
          <section className="project-overview" style={{ padding: "36px 64px", borderBottom: "1px solid var(--line)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, maxWidth: "var(--content-w)", margin: "0 auto" }}>
              {[
                ["CLIENT", "UiPath"],
                ["ROLE", "Product Designer"],
                ["DESIGNED WITH", "Satiswar Dash, Senior Product Designer"],
                ["TIMELINE", "2024\u201325"],
                ["READ", "2 MIN"]
              ].map(([k, v]) =>
              <div key={k} style={{ borderTop: "1px solid var(--ink)", paddingTop: 12 }}>
                  <window.MonoLabel>{k}</window.MonoLabel>
                  <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 16, marginTop: 6, color: "var(--ink)" }}>
                    {v}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ───────── 01 · WHAT I OWNED ───────── */}
          <Sec id="owned" no="01" kicker="MY SCOPE" title="The pieces, not just the screens.">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 28 }}>
              {owned.map((it, i) =>
            <div key={i} style={{ borderTop: "1px solid var(--ink)", paddingTop: 14, display: "flex", gap: 14 }}>
                  <window.MonoLabel color="var(--accent)">{String(i + 1).padStart(2, "0")}</window.MonoLabel>
                  <div style={{ fontFamily: sans, fontSize: 18, lineHeight: 1.4, color: "var(--ink)" }}>{it}</div>
                </div>
            )}
            </div>
          </Sec>

          {/* ───────── 02 · THE PROBLEM ───────── */}
          <Sec
          id="problem"
          no="02"
          kicker="WHERE IT BROKE"
          title="Growth outpaced the structure."
          intro="UiPath administration expanded across dozens of pages. The homepage connected them all, but every new capability added another destination — even simple tasks scattered across multiple pages.">
          
            <div style={{ marginTop: 32 }}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9" }}>
                <FigProblem />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginTop: 10 }}>
                <window.MonoLabel>A flat pile of pages, resolved into a hierarchy</window.MonoLabel>
                <window.MonoLabel>ABSTRACT · NOT PRODUCT UI</window.MonoLabel>
              </div>
            </div>
          </Sec>

          {/* ───────── 03 · THE PRINCIPLES ───────── */}
          <Sec id="principles" no="03" kicker="WHAT GUIDED IT" title="Three rules the shell holds to.">
            <div style={{ marginTop: 36 }}>
              {principles.map((p, i) =>
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "84px minmax(0, 1fr)",
                gap: 24,
                alignItems: "baseline",
                padding: "30px 0",
                borderTop: i === 0 ? "1px solid var(--ink)" : "none",
                borderBottom: "1px solid var(--line)"
              }}>
              
                  <div style={{ fontFamily: serif, fontSize: 52, lineHeight: 1, color: "var(--accent)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div
                style={{
                  fontFamily: sans,
                  fontWeight: 700,
                  fontSize: 34,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.12,
                  color: "var(--ink)"
                }}>
                
                    {p.h}
                    <span style={{ color: "var(--muted)", fontWeight: 500 }}> — {p.b}</span>
                  </div>
                </div>
            )}
            </div>
          </Sec>

          {/* ───────── 04 · THE GATE ───────── */}
          <section
          id="gate"
          style={{
            padding: "96px 64px",
            background: "var(--surface)",
            borderTop: "1px solid var(--ink)",
            borderBottom: "1px solid var(--ink)"
          }}>
          
            <div style={{ maxWidth: "var(--copy-w-wide)", margin: "0 auto", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
                <Lock size={40} color="var(--ink)" sw={1.4} />
              </div>
              <window.MonoLabel color="var(--accent)">RESTRICTED · SHARED ON REQUEST</window.MonoLabel>
              <p style={{ fontFamily: sans, fontSize: 18, lineHeight: 1.55, margin: "24px auto 0", maxWidth: 560, color: "var(--muted)" }}>
                The IA work, the component system, and the designed surfaces — shared with hiring teams under password.
              </p>
              <a
              href={mailto}
              style={{
                marginTop: 32,
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background: "var(--ink)",
                color: "var(--ink-inverse)",
                textDecoration: "none",
                padding: "16px 28px",
                fontFamily: mono,
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase"
              }}>
              
                <Lock size={15} color="var(--ink-inverse)" />
                Request access
                <span style={{ color: "var(--accent)" }}>→</span>
              </a>

              <PasswordGate />
            </div>
          </section>

          {/* ───────── END — NEXT PROJECT ───────── */}
          <section style={{ padding: "56px 64px", borderTop: "1px solid var(--line)" }}>
            <a
            href="project-release-notes.html"
            onClick={(e) => { if (window.parent && window.parent !== window) { e.preventDefault(); window.parent.postMessage({ type: "work:focus", key: "release-notes" }, "*"); } }}
            style={{
              textDecoration: "none",
              color: "var(--ink)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 32,
              maxWidth: "var(--content-w)",
              margin: "0 auto"
            }}>
            
              <div>
                <window.MonoLabel>NEXT PROJECT / 004</window.MonoLabel>
                <div
                style={{
                  fontFamily: sans,
                  fontWeight: 800,
                  fontSize: 64,
                  lineHeight: 0.95,
                  letterSpacing: "-0.025em",
                  marginTop: 12
                }}>
                
                  PRODUCT-RELEASE COMMUNICATION<span style={{ color: "var(--accent)" }}>.</span>
                </div>
              </div>
              <div style={{ fontFamily: mono, fontSize: 24, color: "var(--accent)" }}>→</div>
            </a>
          </section>

        </article>
      }
    </window.PageShell>);

}

window.AdminShellPublicPage = AdminShellPublicPage;
