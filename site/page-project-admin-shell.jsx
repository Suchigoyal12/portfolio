/* global React */
// =============================================================
// PROJECT DETAIL — UIPATH ADMIN SHELL
// Reuses the V5 layout (sticky left rail + magazine flow) shared
// with Check Access & AI Trust Layer. Copy grounded to the
// "Admin shell revamp — why" research doc + the motion showcase.
// Narrative: Problem -> Research -> The Shell -> Shipped -> Reflection.
// All visuals are the real shell frames; no metrics invented.
// =============================================================

const SHELL = {
  no: "003",
  client: "UiPath",
  eyebrow: "DETAILED PROJECT",
  headline: ["RE-ARCHITECTING", "THE UIPATH", "ADMIN SHELL"],
  summary:
  "The connective tissue every admin page is built inside — turning a sprawl of disconnected pages into one coherent, navigable system.",
  meta: [
  ["ROLE", "Product Designer"],
  ["TIMELINE", "2024 — 2025"],
  ["DOMAIN", "Enterprise Administration"],
  ["PLATFORM", "UiPath Automation Cloud"]],

  tags: [
  "Information Architecture",
  "Navigation",
  "Design System",
  "Admin UX",
  "Multi-Tenant",
  "Enterprise SaaS"],

  readingTime: 5
};

// ── Zoomable image — pinch / ctrl-wheel / drag-pan + ⊕ ⊖ controls ──
function ZoomableImage({ src, alt, contain }) {
  const wrapRef = React.useRef(null);
  const [t, setT] = React.useState({ s: 1, x: 0, y: 0 });
  const tRef = React.useRef(t);
  tRef.current = t;
  const g = React.useRef({ dragging: false, sx: 0, sy: 0, ox: 0, oy: 0, pinch: false, dist: 0 });
  const [active, setActive] = React.useState(false);
  const MIN = 1;
  const MAX = 5;

  const clamp = (nt) => {
    const el = wrapRef.current;
    if (!el) return nt;
    const maxX = el.clientWidth * (nt.s - 1) / 2;
    const maxY = el.clientHeight * (nt.s - 1) / 2;
    return {
      s: nt.s,
      x: Math.max(-maxX, Math.min(maxX, nt.x)),
      y: Math.max(-maxY, Math.min(maxY, nt.y))
    };
  };

  const zoomAt = (cx, cy, factor) => {
    setT((prev) => {
      const s = Math.max(MIN, Math.min(MAX, prev.s * factor));
      if (s === prev.s) return prev;
      const el = wrapRef.current;
      if (!el) return prev;
      const rect = el.getBoundingClientRect();
      const ox = cx - rect.left - rect.width / 2;
      const oy = cy - rect.top - rect.height / 2;
      const ratio = s / prev.s;
      return clamp({ s, x: ox - (ox - prev.x) * ratio, y: oy - (oy - prev.y) * ratio });
    });
  };

  const zoomBtn = (factor) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    zoomAt(r.left + r.width / 2, r.top + r.height / 2, factor);
  };

  const reset = () => setT({ s: 1, x: 0, y: 0 });

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const dist = (a, b) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    const onWheel = (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.1 : 1 / 1.1);
    };
    const onTS = (e) => {
      if (e.touches.length === 2) {
        g.current.pinch = true;
        g.current.dist = dist(e.touches[0], e.touches[1]);
        setActive(true);
      } else if (e.touches.length === 1 && tRef.current.s > 1) {
        g.current.dragging = true;
        g.current.sx = e.touches[0].clientX;
        g.current.sy = e.touches[0].clientY;
        g.current.ox = tRef.current.x;
        g.current.oy = tRef.current.y;
        setActive(true);
      }
    };
    const onTM = (e) => {
      if (g.current.pinch && e.touches.length === 2) {
        e.preventDefault();
        const d = dist(e.touches[0], e.touches[1]);
        const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        if (g.current.dist) zoomAt(cx, cy, d / g.current.dist);
        g.current.dist = d;
      } else if (g.current.dragging && e.touches.length === 1) {
        e.preventDefault();
        setT(clamp({
          s: tRef.current.s,
          x: g.current.ox + (e.touches[0].clientX - g.current.sx),
          y: g.current.oy + (e.touches[0].clientY - g.current.sy)
        }));
      }
    };
    const onTE = (e) => {
      if (e.touches.length < 2) g.current.pinch = false;
      if (e.touches.length === 0) {
        g.current.dragging = false;
        setActive(false);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTS, { passive: false });
    el.addEventListener("touchmove", onTM, { passive: false });
    el.addEventListener("touchend", onTE);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTS);
      el.removeEventListener("touchmove", onTM);
      el.removeEventListener("touchend", onTE);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMouseDown = (e) => {
    if (tRef.current.s <= 1) return;
    e.preventDefault();
    g.current.dragging = true;
    g.current.sx = e.clientX;
    g.current.sy = e.clientY;
    g.current.ox = tRef.current.x;
    g.current.oy = tRef.current.y;
    setActive(true);
    const move = (ev) => {
      if (!g.current.dragging) return;
      setT(clamp({
        s: tRef.current.s,
        x: g.current.ox + (ev.clientX - g.current.sx),
        y: g.current.oy + (ev.clientY - g.current.sy)
      }));
    };
    const up = () => {
      g.current.dragging = false;
      setActive(false);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const ctrlBtn = {
    width: 30,
    height: 30,
    display: "grid",
    placeItems: "center",
    border: "1px solid var(--ink)",
    background: "var(--surface)",
    color: "var(--ink)",
    fontFamily: window.monoFamily,
    fontSize: 15,
    lineHeight: 1,
    cursor: "pointer",
    padding: 0
  };

  return (
    <div
      ref={wrapRef}
      onMouseDown={onMouseDown}
      onDoubleClick={() => tRef.current.s > 1 ? reset() : zoomBtn(2)}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        touchAction: "none",
        display: "flex",
        alignItems: contain ? "center" : "flex-start",
        justifyContent: "center",
        cursor: t.s > 1 ? active ? "grabbing" : "grab" : "default"
      }}>
      
      <img
        src={src}
        alt={alt}
        loading="lazy"
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: contain ? "contain" : "cover",
          objectPosition: "top left",
          display: "block",
          transform: `translate(${t.x}px, ${t.y}px) scale(${t.s})`,
          transformOrigin: "center center",
          transition: active ? "none" : "transform 0.14s ease",
          willChange: "transform",
          userSelect: "none"
        }} />
      
      <div
        style={{
          position: "absolute",
          right: 10,
          bottom: 10,
          display: "flex",
          gap: 6,
          zIndex: 2
        }}>
        
        {t.s > 1 &&
        <button type="button" onMouseDown={(e) => e.stopPropagation()} onClick={reset} style={{ ...ctrlBtn, width: "auto", padding: "0 10px", fontSize: 9, letterSpacing: "0.1em" }}>
            RESET
          </button>
        }
        <button type="button" onMouseDown={(e) => e.stopPropagation()} onClick={() => zoomBtn(1 / 1.4)} disabled={t.s <= MIN} style={{ ...ctrlBtn, opacity: t.s <= MIN ? 0.4 : 1 }} aria-label="Zoom out">
          −
        </button>
        <button type="button" onMouseDown={(e) => e.stopPropagation()} onClick={() => zoomBtn(1.4)} disabled={t.s >= MAX} style={{ ...ctrlBtn, opacity: t.s >= MAX ? 0.4 : 1 }} aria-label="Zoom in">
          +
        </button>
      </div>
    </div>);

}

// ── Real product frame, framed like a case-study plate ─────────
function Figure({ src, alt, ratio = "16 / 9", fig, caption, contain = false, maxW }) {
  return (
    <figure style={{ margin: 0 }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: maxW || "none",
          marginLeft: maxW ? "auto" : 0,
          marginRight: maxW ? "auto" : 0,
          aspectRatio: ratio,
          border: "1px solid var(--ink)",
          background: "var(--surface)",
          overflow: "hidden"
        }}>
        
        <ZoomableImage src={src} alt={alt} contain={contain} />
      </div>
      <figcaption
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          marginTop: 10
        }}>
        
        <window.MonoLabel>{caption}</window.MonoLabel>
      </figcaption>
    </figure>);

}

// ── Magazine section shell (label rail + content) ─────────────
function Sec({ id, no, kicker, title, intro, children, last }) {
  return (
    <section
      id={id}
      style={{ padding: "72px 64px", borderBottom: last ? "none" : "1px solid var(--line)" }}>
      
      <div style={{ display: "grid", gridTemplateColumns: "180px minmax(0, 1fr)", gap: 32 }}>
        <window.MonoLabel>
          SECTION {no}
          <br />
          {kicker}
        </window.MonoLabel>
        <div>
          <h2
            style={{
              fontFamily: window.sansFamily,
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
              fontFamily: window.sansFamily,
              fontSize: 18,
              lineHeight: 1.55,
              marginTop: 20,
              color: "var(--ink)",
              maxWidth: 640
            }}>
            
              {intro}
            </p>
          }
          {children}
        </div>
      </div>
    </section>);

}

function Body({ children, max = 640, mt = 16 }) {
  return (
    <p
      style={{
        fontFamily: window.sansFamily,
        fontSize: 16,
        lineHeight: 1.62,
        marginTop: mt,
        marginBottom: 0,
        color: "var(--ink)",
        maxWidth: max
      }}>
      
      {children}
    </p>);

}

function Mission({ children }) {
  return (
    <p
      style={{
        fontFamily: window.serifFamily,
        fontStyle: "italic",
        fontSize: 24,
        lineHeight: 1.3,
        margin: "28px 0 0",
        color: "var(--ink)",
        maxWidth: 720
      }}>
      
      {children}
    </p>);

}

// Accent serif stat row (problem & research figures)
function StatRow({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 32 }}>
      {items.map((s) =>
      <div key={s.v} style={{ borderTop: "1px solid var(--ink)", paddingTop: 16 }}>
          <div
          style={{
            fontFamily: window.serifFamily,
            fontSize: 64,
            lineHeight: 1,
            color: "var(--accent)"
          }}>
          
            {s.k}
          </div>
          <window.MonoLabel style={{ marginTop: 8, display: "block" }}>{s.v}</window.MonoLabel>
        </div>
      )}
    </div>);

}

// Three-up card row (failures / artifacts)
function TriCards({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 28 }}>
      {items.map((it) =>
      <div key={it.tag} style={{ borderTop: "1px solid var(--ink)", paddingTop: 14 }}>
          <window.MonoLabel>{it.tag}</window.MonoLabel>
          <Body mt={10} max={420}>
            {it.body}
          </Body>
        </div>
      )}
    </div>);

}

// Principles as pills (the approach)
function PrinciplePills({ items }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, margin: "28px 0 0" }}>
      {items.map((b, i) =>
      <span
        key={i}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 18px",
          borderRadius: 999,
          border: "1px solid var(--line)",
          fontFamily: window.sansFamily,
          fontSize: 15,
          fontWeight: 600,
          lineHeight: 1,
          color: "var(--ink)",
          whiteSpace: "nowrap"
        }}>
        
          <span style={{ fontFamily: window.monoFamily, fontSize: 11, color: "var(--accent)" }}>
            {String(i + 1).padStart(2, "0")}
          </span>
          {b.h}
        </span>
      )}
    </div>);

}

// Sub-feature block inside the Solution section
function SubFeature({ tag, title, body, children }) {
  return (
    <div style={{ marginTop: 48 }}>
      <window.MonoLabel>{tag}</window.MonoLabel>
      <h3
        style={{
          fontFamily: window.sansFamily,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: "-0.02em",
          margin: "10px 0 0",
          color: "var(--ink)"
        }}>
        
        {title}
      </h3>
      {body && <Body mt={14}>{body}</Body>}
      {children && <div style={{ marginTop: 28 }}>{children}</div>}
    </div>);

}

function AdminShellProjectPage() {
  const sections = [
  { id: "summary", no: "00", label: "Summary" },
  { id: "problem", no: "01", label: "The Problem" },
  { id: "approach", no: "02", label: "The Research" },
  { id: "solution", no: "03", label: "The Shell" },
  { id: "shipped", no: "04", label: "What It Establishes" }];

  const [currentSection, setCurrentSection] = React.useState("summary");

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
  }, []);

  const status = [
  ["CLIENT", SHELL.client],
  ["ROLE", "Product Designer"],
  ["DESIGNED WITH", "Satiswar Dash, Senior Product Designer"],
  ["TIMELINE", "2024-25"],
  ["STATUS", "Slated for release"],
  ["READ", `${SHELL.readingTime} MIN`]];


  return (
    <window.PageShell
      active="works"
      navMode="rail"
      sections={sections}
      currentSection={currentSection}
      status={status}>
      
      {() =>
      <article style={{ padding: 0 }}>
          {/* ───────── TOP NAV — sticky, styled + behaving like Check Access long version's .topline ───────── */}
          <div className="topline-spacer" style={{ height: 32 }}></div>
          <div
          className="hero-topbar"
          style={{
            display: "flex",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "var(--bg)",
            padding: "24px 64px",
            borderBottom: "1px solid var(--line)"
          }}>
          
            <a
            href="admin-shell-public.html"
            onClick={(e) => {if (history.length > 1) {history.back();e.preventDefault();}}}
            style={{
              fontFamily: window.monoFamily,
              fontSize: 9,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              textDecoration: "none"
            }}>
            
              ← BACK
            </a>
            <window.MonoLabel size={9}>
              {SHELL.eyebrow}
            </window.MonoLabel>
          </div>

          {/* ───────── HERO ───────── */}
          <section style={{ padding: "56px 64px 64px", borderBottom: "1px solid var(--line)" }}>
            <h1
            style={{
              fontFamily: window.sansFamily,
              fontWeight: 800,
              fontSize: "clamp(48px, 7vw, 96px)",
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
              margin: 0,
              color: "var(--ink)"
            }}>
            
              {SHELL.headline.map((l, i) =>
            <div key={i}>
                  {l}
                  {i === SHELL.headline.length - 1 && <span style={{ color: "var(--accent)" }}>.</span>}
                </div>
            )}
            </h1>

            <div
            style={{
              marginTop: 40,
              display: "flex",
              alignItems: "center",
              gap: 24,
              paddingTop: 24,
              borderTop: "1px solid var(--line)"
            }}>
            
              <window.WaveMotif color="var(--accent)" width={140} height={36} />
              <div
              style={{
                fontFamily: window.serifFamily,
                fontStyle: "italic",
                fontSize: 24,
                color: "var(--ink)",
                maxWidth: 640
              }}>
              
                {SHELL.summary}
              </div>
            </div>



            <div style={{ marginTop: 40 }}>
              <Figure
              src="frames/shell-root.svg"
              alt="The assembled UiPath admin shell"
              ratio="1920 / 1080"
              fig="00"
              caption="The assembled shell — top bar, navigation, header & content grid" />
            
            </div>
          </section>

          {/* PROJECT OVERVIEW — metadata */}
          <section className="project-overview" style={{ padding: "36px 64px", borderBottom: "1px solid var(--line)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16 }}>
              {[
            ["CLIENT", "UiPath"],
            ["ROLE", "Product Designer"],
            ["DESIGNED WITH", "Satiswar Dash, Senior Product Designer"],
            ["TIMELINE", "2024\u201325"],
            ["STATUS", "Slated for release"],
            ["READ", "2 MIN"]].
            map(([k, v]) =>
            <div key={k} style={{ borderTop: "1px solid var(--ink)", paddingTop: 12 }}>
                  <window.MonoLabel>{k}</window.MonoLabel>
                  <div style={{ fontFamily: window.sansFamily, fontWeight: 600, fontSize: 16, marginTop: 6, color: "var(--ink)" }}>
                    {v}
                  </div>
                </div>
            )}
            </div>
          </section>

          {/* ───────── 00 · SUMMARY / TAGS ───────── */}
          <section style={{ padding: "56px 64px", borderBottom: "1px solid var(--line)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "180px minmax(0, 1fr)", gap: 32 }}>
              <window.MonoLabel>
                SECTION 00
                <br />
                SUMMARY
              </window.MonoLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SHELL.tags.map((t) =>
              <span
                key={t}
                style={{
                  border: "1px solid var(--ink)",
                  padding: "8px 14px",
                  borderRadius: 999,
                  fontFamily: window.monoFamily,
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase"
                }}>
                
                    {t}
                  </span>
              )}
              </div>
            </div>
          </section>

          {/* ───────── 01 · PROBLEM ───────── */}
          <Sec
          id="problem"
          no="01"
          kicker="WHERE IT BROKE"
          title="Growth outpaced the structure."
          intro="UiPath administration expanded across dozens of pages. The homepage connected them all, but every new capability added another destination, leaving even simple tasks scattered across multiple pages.">
          
            <div style={{ marginTop: 32 }}>
              <Figure
              src="frames/before-home.png"
              alt="Old Org Admin home — seven-card landing grid"
              ratio="1440 / 1080"
              fig="01"
              caption="Org Admin home, before — seven cards on an empty canvas" />
            
            </div>
            <TriCards
            items={[
            {
              tag: "NO VISIBILITY",
              body:
              "Primary and secondary items hid behind tiles. Nothing was legible at a glance."
            },
            {
              tag: "NOT FOR POWER USERS",
              body:
              "No scanning, no jumping. Every new task meant returning to the grid first."
            },
            {
              tag: "THE WRONG PATTERN",
              body:
              "Administrators expect a vertical navigation. A tile-based home read as unfamiliar from first click."
            }]
            } />
          
          </Sec>

          {/* ───────── 02 · RESEARCH / APPROACH ───────── */}
          <Sec
          id="approach"
          no="02"
          kicker="GROUNDED IN RESEARCH"
          title="How admins actually work"
          intro="Before redrawing a single screen, the work started with how customers actually run UiPath — how many tenants they manage, what screens they sit on all day, and where they get lost.">
          
            <StatRow
            items={[
            { k: "75%", v: "RUN 1–5 TENANTS" },
            { k: "20+", v: "TENANTS AT SCALE" },
            { k: "36%", v: "ON FULL HD" }]
            } />
          
            <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: window.serifFamily,
              fontStyle: "italic",
              fontSize: 14,
              color: "var(--muted)"
            }}>
            
              <span style={{ width: 20, height: 1, background: "var(--muted)", flex: "none" }}></span>
              Source: internal admin user research, 2025
            </div>
            <Body mt={28}>
              Most customers are early in adoption or have simpler needs — three-quarters run between one and five
              tenants. A meaningful tail of mature, higher-ARR customers manage twenty or more. And the most common
              admin display is Full HD, with admins frequently resizing windows to multi-task — a clear argument for a
              compact, vertical, resizable navigation model.
            </Body>
            <div style={{ marginTop: 40 }}>
              <window.MonoLabel>PRINCIPLES FOR THE ADMIN EXPERIENCE</window.MonoLabel>
              <PrinciplePills
              items={[
              { h: "Discoverability first", b: "everything reachable from a structure, not a search." },
              { h: "Work across scopes", b: "aggregate, act, and reuse roles across tenants." },
              { h: "Journey over hierarchy", b: "organise by jobs-to-be-done, not by scope." },
              { h: "Tailored by role", b: "distinct experiences for Org admins and Tenant admins." },
              { h: "At a glance", b: "surface items by importance and usage so admins decide and act faster." },
              { h: "Future-proof", b: "centralise, promote reuse, and absorb new services without a redesign." }]
              } />
            
            </div>

            <blockquote
            style={{
              margin: "40px 0 0",
              padding: "28px 0",
              borderTop: "1px solid var(--ink)",
              borderBottom: "1px solid var(--ink)",
              fontFamily: window.serifFamily,
              fontStyle: "italic",
              fontSize: 30,
              lineHeight: 1.3,
              color: "var(--ink)",
              maxWidth: 760
            }}>
            
              "I'm a first-timer and I can't find authentication settings. And why is{" "}
              <span style={{ color: "rgb(28, 28, 26)" }}>Licenses</span> available everywhere?"
            </blockquote>
            <window.MonoLabel style={{ marginTop: 16, display: "block" }}>
              — ENTERPRISE ADMIN, FEATURE-DISCOVERY INTERVIEW
            </window.MonoLabel>
          </Sec>

          {/* ───────── 03 · THE SHELL (solution) ───────── */}
          <Sec
          id="solution"
          no="03"
          kicker="THE SOLUTION"
          title="A shell, not a screen"
          intro="The answer wasn't a better home page. It was a shell — one structure every admin page is built inside, so new services slot in instead of forcing a redesign around each release.">
          
            <SubFeature
            tag="INFORMATION ARCHITECTURE"
            title="One portal, every page placed"
            body="The whole admin surface re-mapped into a single Unified Admin Portal — organisation and tenant scope, categories, root pages, and tabs. The 25.1 crawl state is the blueprint the shell is built to render.">
            
              <Figure
              src="frames/sitemap.svg"
              alt="25.1 Unified Admin Portal sitemap"
              ratio="3040 / 3536"
              contain
              maxW={680}
              fig="03.1"
              caption="phase one of the unified portal" />
            
            </SubFeature>

            <SubFeature
            tag="NAVIGATION"
            title="A vertical model admins recognise"
            body="Thirteen categories, root pages, and tabs — ordered by importance and usage frequency, not alphabetised. Everything reachable from a structure, the pattern admins already expect.">
            
              <Figure
              src="frames/tenant-landing.svg"
              alt="New admin left navigation, populated"
              ratio="1920 / 1080"
              fig="03.2"
              caption="Left navigation — categories, root pages, tabs" />
            
            </SubFeature>

            <SubFeature
            tag="CROSS-SCOPE"
            title="Scope you can search"
            body="Switch tenants from the global header without losing your place — built for the admin who juggles a handful of tenants all day, and for aggregating and acting across them.">
            
              <Figure
              src="frames/org-picker.svg"
              alt="Tenant picker open in the global header"
              ratio="1920 / 1080"
              fig="03.3"
              caption="Tenant picker — search any tenant from the header" />
            
            </SubFeature>

            <SubFeature
            tag="PAGE HEADER SYSTEM"
            title="One template, every root page"
            body="Title, scope, and actions land in the same place on every page — so each surface reads as part of one product, not a page that happens to share a logo.">
            
              <Figure
              src="frames/page-header.svg"
              alt="Page header system"
              ratio="1688 / 804"
              fig="03.4"
              caption="Page header system — one template, every root page" />
            
            </SubFeature>

            <SubFeature
            tag="COMPONENTS"
            title="The pieces, defined once"
            body="The shell is assembled from a small, consistent kit — picker, navigation, header, and content states — defined once and reused on every admin page.">
            
              <Figure
              src="frames/component-states.svg"
              alt="Component states across the shell"
              ratio="2161 / 1622"
              contain
              fig="03.5"
              caption="Component states — defined once, reused everywhere" />
            
            </SubFeature>

            <div style={{ marginTop: 48 }}>
              <window.MonoLabel>WHAT THE SHELL GUARANTEES</window.MonoLabel>
              <TriCards
              items={[
              {
                tag: "DISCOVERABILITY",
                body: "Everything reachable from a vertical structure, not a search box."
              },
              {
                tag: "AT A GLANCE",
                body: "State and scope legible before any drill-down."
              },
              {
                tag: "FUTURE-PROOF",
                body: "A model that absorbs new services without a redesign."
              }]
              } />
            
            </div>
          </Sec>

          {/* ───────── 04 · WHAT SHIPPED (dark band) ───────── */}
          <section
          id="shipped"
          style={{
            padding: "72px 64px",
            background: "var(--ink-panel)",
            color: "var(--ink-inverse)",
            borderTop: "1px solid var(--line)",
            borderBottom: "1px solid var(--line)"
          }}>
          
            <div style={{ display: "grid", gridTemplateColumns: "180px minmax(0, 1fr)", gap: 32 }}>
              <window.MonoLabel color="var(--muted)">
                SECTION 04
                <br />
                WHAT IT ESTABLISHES
              </window.MonoLabel>
              <div>
                <h2
                style={{
                  fontFamily: window.sansFamily,
                  fontWeight: 800,
                  fontSize: 56,
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                  margin: 0,
                  color: "var(--ink-inverse)"
                }}>
                
                  One product. One structure<span style={{ color: "var(--accent)" }}>.</span>
                </h2>
                <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 24,
                  marginTop: 36
                }}>
                
                  {[
                { k: "1", v: "UNIFIED ADMIN PORTAL", note: "Administration designed as a single experience." },
                { k: "13", v: "CATEGORIES, ONE MODEL", note: "A clear model for where capabilities belong." },
                { k: "\u221e", v: "ROOM TO SCALE", note: "Growth no longer requires reinventing navigation." }].
                map((s) =>
                <div key={s.v} style={{ borderTop: "1px solid var(--ink-inverse)", paddingTop: 16 }}>
                      <div
                    style={{
                      fontFamily: window.serifFamily,
                      fontSize: 72,
                      lineHeight: 1,
                      color: "var(--accent)"
                    }}>
                    
                        {s.k}
                      </div>
                      <window.MonoLabel style={{ marginTop: 8, display: "block", color: "var(--ink-inverse)" }}>
                        {s.v}
                      </window.MonoLabel>
                      <p
                    style={{
                      fontFamily: window.sansFamily,
                      fontSize: 14,
                      lineHeight: 1.55,
                      marginTop: 12,
                      marginBottom: 0,
                      color: "var(--ink-inverse)"
                    }}>
                    
                        {s.note}
                      </p>
                    </div>
                )}
                </div>
                <p
                style={{
                  fontFamily: window.sansFamily,
                  fontSize: 16,
                  lineHeight: 1.6,
                  marginTop: 32,
                  color: "var(--ink-inverse)",
                  maxWidth: 640
                }}>The outcome isn't a new homepage — it's a new foundation. Administration moves from a collection of destinations to a coherent system, designed to absorb future capabilities without increasing complexity.





              </p>
              </div>
            </div>
          </section>

          {/* ───────── END OF CASE STUDY — GATED NAV ───────── */}
          <section style={{ padding: "56px 64px", borderTop: "1px solid var(--line)" }}>
            <a
            href="project-release-notes.html"
            onClick={(e) => {if (window.parent && window.parent !== window) {e.preventDefault();window.parent.postMessage({ type: "work:focus", key: "release-notes" }, "*");}}}
            style={{
              textDecoration: "none",
              color: "var(--ink)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 32
            }}>
            
              <div>
                <window.MonoLabel>NEXT PROJECT / 004</window.MonoLabel>
                <div
                style={{
                  fontFamily: window.sansFamily,
                  fontWeight: 800,
                  fontSize: 64,
                  lineHeight: 0.95,
                  letterSpacing: "-0.025em",
                  marginTop: 12
                }}>
                
                  PRODUCT-RELEASE COMMUNICATION<span style={{ color: "var(--accent)" }}>.</span>
                </div>
              </div>
              <div style={{ fontFamily: window.monoFamily, fontSize: 24, color: "var(--accent)" }}>→</div>
            </a>
          </section>

        </article>
      }
    </window.PageShell>);

}

window.AdminShellProjectPage = AdminShellProjectPage;