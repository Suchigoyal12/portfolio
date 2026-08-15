import React from "react";
import { MonoLabel, PageShell, WaveMotif, chromeHorizon, monoFamily, sansFamily, serifFamily } from "./shared.jsx";
// =============================================================
// PROJECT DETAIL — AI TRUST LAYER (AITL)
// Reuses the Check Access V5 layout (sticky left rail + magazine
// flow). All copy grounded to the AITL PDF source — narrative
// kept intact: The Stakes → Context Grounding → BYO LLM →
// Audit Export → AI Governance → Learnings.
// =============================================================

const AITL = {
  no: "002",
  client: "UiPath",
  eyebrow: "PRODUCT DESIGN CASE STUDY",
  headline: ["AI "],
  summary:
  "The control plane for enterprise GenAI \u2014 designed to make AI safe, transparent, and governable at scale.",
  meta: [
  ["ROLE", "Sole Product Designer"],
  ["TIMELINE", "2024-25"],
  ["PLATFORM", "UiPath (Admin Console)"],
  ["STATUS", "Shipped (GA)"]],

  tags: ["AI Governance", "LLMOps", "Context Grounding", "BYO LLM", "Audit & Compliance", "UiPath Admin"],
  readingTime: 8
};

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const parseRatio = (r) => {
  const [w, h] = String(r).split("/").map((s) => parseFloat(s));
  return h ? w / h : 1;
};

// ── Single product-screen card (used inside the carousel) ──────
function AITLCard({ item, width, height, onOpen }) {
  return (
    <figure style={{ flex: "0 0 auto", width, margin: 0 }}>
      <button
        type="button"
        onClick={onOpen}
        style={{
          all: "unset",
          display: "block",
          cursor: "zoom-in",
          width: "100%"
        }}
        aria-label={`Open ${item.label}`}>
        
        <div
          style={{
            width: "100%",
            height,
            border: "1px solid var(--ink)",
            background: "#fff",
            overflow: "hidden"
          }}>
          
          <img
            src={item.src}
            alt={item.note}
            loading="lazy"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top left"
            }} />
          
        </div>
      </button>
      <figcaption
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 14,
          marginTop: 12,
          paddingTop: 9,
          borderTop: "1px solid var(--line)"
        }}>
        
        <span
          style={{
            fontFamily: sansFamily,
            fontSize: 14,
            lineHeight: 1.4,
            color: "var(--muted)"
          }}>
          
          {item.note}
        </span>
        <MonoLabel>{item.label}</MonoLabel>
      </figcaption>
    </figure>);

}

// ── Lightbox overlay ──────────────────────────────────────────
function AITLLightbox({ items, index, setIndex, onClose }) {
  const it = items[index];
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();else
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % items.length);else
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [items.length, onClose, setIndex]);

  const arrowBtn = {
    all: "unset",
    cursor: "pointer",
    fontFamily: monoFamily,
    fontSize: 13,
    letterSpacing: "0.08em",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.4)",
    padding: "10px 16px",
    borderRadius: 999
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(12,12,10,0.93)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(20px, 4vw, 56px)",
        gap: 20
      }}>
      
      <div
        style={{
          width: "100%",
          maxWidth: 1280,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
        
        <MonoLabel color="rgba(255,255,255,0.7)">
          {it.label} · {index + 1} / {items.length}
        </MonoLabel>
        <button type="button" onClick={onClose} style={{ ...arrowBtn, padding: "6px 14px" }}>
          CLOSE ✕
        </button>
      </div>
      <img
        src={it.src}
        alt={it.note}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "min(1280px, 94vw)",
          maxHeight: "74vh",
          objectFit: "contain",
          border: "1px solid rgba(255,255,255,0.18)",
          background: "#fff",
          cursor: "default"
        }} />
      
      <div
        style={{
          width: "100%",
          maxWidth: 1280,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20
        }}>
        
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIndex((i) => (i - 1 + items.length) % items.length);
          }}
          style={arrowBtn}>
          
          ← PREV
        </button>
        <span
          style={{
            fontFamily: serifFamily,
            fontStyle: "italic",
            fontSize: 16,
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
            maxWidth: 720
          }}>
          
          {it.note}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIndex((i) => (i + 1) % items.length);
          }}
          style={arrowBtn}>
          
          NEXT →
        </button>
      </div>
    </div>);

}

// ── Scroll-driven horizontal carousel ─────────────────────────
// As the page scrolls down, the stage pins and the screen track
// translates horizontally; when the track ends, the page keeps
// scrolling. Falls back to a plain swipe strip on narrow screens.
function AITLCarousel({ items, label }) {
  const wrapRef = React.useRef(null);
  const stageRef = React.useRef(null);
  const trackRef = React.useRef(null);
  const [dist, setDist] = React.useState(0);
  const [cardH, setCardH] = React.useState(520);
  const [isNarrow, setIsNarrow] = React.useState(
    typeof window !== "undefined" ? window.innerWidth < 900 : false
  );
  const [lightbox, setLightbox] = React.useState(-1);
  const GAP = 28;

  // Responsive card height + narrow detection
  React.useEffect(() => {
    const onResize = () => {
      setIsNarrow(window.innerWidth < 900);
      setCardH(Math.round(clamp(window.innerHeight * 0.6, 360, 600)));
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const widths = items.map((it) => Math.round(cardH * parseRatio(it.ratio)));
  const trackWidth = widths.reduce((a, b) => a + b, 0) + GAP * (items.length - 1);

  // Measure horizontal scroll distance
  React.useLayoutEffect(() => {
    if (isNarrow) {
      setDist(0);
      return;
    }
    const measure = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const visible = stage.clientWidth - 128; // subtract 64px L/R padding
      setDist(Math.max(0, trackWidth - visible));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [trackWidth, isNarrow]);

  // Scroll → translate
  React.useEffect(() => {
    if (isNarrow) {
      if (trackRef.current) trackRef.current.style.transform = "none";
      return;
    }
    const onScroll = () => {
      const wrap = wrapRef.current;
      const track = trackRef.current;
      if (!wrap || !track) return;
      const total = wrap.offsetHeight - window.innerHeight;
      const progress = total > 0 ? clamp(-wrap.getBoundingClientRect().top / total, 0, 1) : 0;
      track.style.transform = `translate3d(${-(progress * dist)}px,0,0)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dist, isNarrow]);

  const header =
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 18
    }}>
    
      <MonoLabel>{label}</MonoLabel>
      <MonoLabel>
        {items.length} SCREENS · {isNarrow ? "SWIPE →" : "SCROLL ↓ TO PAN →"}
      </MonoLabel>
    </div>;


  // Narrow: plain horizontal swipe strip
  if (isNarrow) {
    return (
      <div>
        {header}
        <div
          className="aitl-strip"
          style={{
            display: "flex",
            gap: GAP,
            overflowX: "auto",
            overflowY: "hidden",
            paddingBottom: 14,
            scrollSnapType: "x proximity",
            WebkitOverflowScrolling: "touch"
          }}>
          
          {items.map((it, i) =>
          <div key={it.label} style={{ scrollSnapAlign: "start" }}>
              <AITLCard item={it} width={widths[i]} height={cardH} onOpen={() => setLightbox(i)} />
            </div>
          )}
        </div>
        {lightbox >= 0 &&
        <AITLLightbox items={items} index={lightbox} setIndex={setLightbox} onClose={() => setLightbox(-1)} />
        }
      </div>);

  }

  // Wide: scroll-pinned horizontal pan — break out of the label
  // gutter + section padding to use the full content width.
  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        height: `calc(100vh + ${dist}px)`,
        marginLeft: "calc(-180px - 32px - 64px)",
        marginRight: "-64px",
        width: "calc(100% + 180px + 32px + 128px)"
      }}>
      
      <div
        ref={stageRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
          padding: "0 64px"
        }}>
        
        {header}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: GAP,
            width: trackWidth,
            willChange: "transform"
          }}>
          
          {items.map((it, i) =>
          <AITLCard key={it.label} item={it} width={widths[i]} height={cardH} onOpen={() => setLightbox(i)} />
          )}
        </div>
      </div>
      {lightbox >= 0 &&
      <AITLLightbox items={items} index={lightbox} setIndex={setLightbox} onClose={() => setLightbox(-1)} />
      }
    </div>);

}

// ── Magazine section shell (label rail + content) ─────────────
function Sec({ id, no, kicker, title, intro, children, last }) {
  return (
    <section
      id={id}
      style={{
        padding: "72px 64px",
        borderBottom: last ? "none" : "1px solid var(--line)"
      }}>
      
      <div style={{ display: "grid", gridTemplateColumns: "180px minmax(0, 1fr)", gap: 32, maxWidth: "var(--content-w)", margin: "0 auto" }}>
        <MonoLabel>
          SECTION {no}
          <br />
          {kicker}
        </MonoLabel>
        <div>
          <h2
            style={{
              fontFamily: sansFamily,
              fontWeight: 800,
              fontSize: 48,
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              margin: 0,
              color: "var(--ink)"
            }}>
            
            {title}
            <span style={{ color: "var(--accent)" }}>.</span>
          </h2>
          {intro &&
          <p
            style={{
              fontFamily: sansFamily,
              marginTop: 20,
              color: "var(--ink)",
              maxWidth: "var(--copy-w)", fontSize: "18px", fontWeight: "400", lineHeight: "1.55"
            }}>
            
              {intro}
            </p>
          }
          {children}
        </div>
      </div>
    </section>);

}

// ── Small body paragraph ──────────────────────────────────────
function Body({ children, max = "var(--copy-w)", mt = 16 }) {
  return (
    <p
      style={{
        fontFamily: sansFamily,
        fontSize: 16,
        lineHeight: 1.62,
        marginTop: mt,
        marginBottom: 0,
        color: "var(--ink)",
        maxWidth: max,
        whiteSpace: "pre-line"
      }}>
      
      {children}
    </p>);

}

// ── Mission line (serif italic emphasis, used by hero features) ─
function Mission({ children }) {
  return (
    <p
      style={{
        fontFamily: serifFamily,
        fontStyle: "italic",
        fontSize: 24,
        lineHeight: 1.3,
        margin: "8px 0 0",
        color: "var(--ink)",
        maxWidth: "var(--copy-w-wide)"
      }}>
      
      {children}
    </p>);

}

// ── Two-up "problem / solution" block ─────────────────────────
function DuoBlock({ left, right }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 32,
        marginTop: 28
      }}>
      
      {[left, right].map((col) =>
      <div key={col.tag} style={{ borderTop: "1px solid var(--ink)", paddingTop: 16 }}>
          <MonoLabel>{col.tag}</MonoLabel>
          <Body mt={12}>{col.body}</Body>
          {col.append}
        </div>
      )}
    </div>);

}

// ── Three-column card row ─────────────────────────────────────
function TriCards({ items }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 16,
        marginTop: 28
      }}>
      
      {items.map((it) =>
      <div key={it.tag} style={{ borderTop: "1px solid var(--ink)", paddingTop: 14 }}>
          <MonoLabel>{it.tag}</MonoLabel>
          <Body mt={10} max={420}>{it.body}</Body>
        </div>
      )}
    </div>);

}

// ── Inline text link (sentence case, body color, hover accent) ─
function InlineLink({ href, children, size = 14 }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: sansFamily,
        fontSize: size,
        fontWeight: 400,
        letterSpacing: "normal",
        textTransform: "none",
        color: hover ? "var(--accent)" : "var(--ink)",
        textDecoration: "underline",
        textDecorationColor: hover ? "var(--accent)" : "var(--ink)",
        textUnderlineOffset: 2
      }}>
      {children}
    </a>);

}

function AITLProjectPage() {
  const sections = [
  { id: "premise", no: "00", label: "The Stakes" },
  { id: "grounding", no: "01", label: "Context Grounding" },
  { id: "byollm", no: "02", label: "BYO LLM" },
  { id: "audit", no: "03", label: "Audit Export" },
  { id: "governance", no: "04", label: "AI Governance" },
  { id: "learnings", no: "05", label: "Reflection" }];

  const [currentSection, setCurrentSection] = React.useState("premise");

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
  ["CLIENT", AITL.client],
  ["ROLE", "Sole Designer"],
  ["TIMELINE", "2024-25"],
  ["STATUS", "Shipped (GA)"],
  ["READ", "8 MIN"]];


  return (
    <PageShell
      active="works"
      navMode="rail"
      sections={sections}
      currentSection={currentSection}
      status={status}>
      
      {() =>
      <article style={{ padding: 0 }}>
          {/* ───────── HERO ───────── */}
          <section style={{ padding: "56px 64px 64px", borderBottom: "1px solid var(--line)" }}>
            <div style={{ maxWidth: "var(--content-w)", margin: "0 auto" }}>
            <div className="hero-topbar" style={{ display: "flex", justifyContent: "space-between", marginBottom: 32, ...chromeHorizon(56) }}>
              <span
              style={{
                fontFamily: monoFamily,
                fontSize: 9,
                fontWeight: 400,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)"
              }}>
                PRESS ESC TO EXIT
              </span>
              <MonoLabel size={9} style={{ fontWeight: 400 }}>PROJECT 02</MonoLabel>
            </div>

            <h1
            style={{
              fontFamily: sansFamily,
              fontWeight: 800,
              fontSize: "clamp(48px, 7vw, 96px)",
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
              margin: 0,
              color: "var(--ink)"
            }}>
            
              {AITL.headline.map((l, i) =>
            <div key={i}>
                  {l}
                  {i === AITL.headline.length - 1 && <span>TRUST LAYER<span style={{ color: "var(--accent)" }}>.</span></span>}
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
            
              <WaveMotif color="var(--accent)" width={140} height={36} />
              <div
              style={{
                fontFamily: serifFamily,
                fontStyle: "italic",
                fontSize: 24,
                color: "var(--ink)"
              }}>
              
                {AITL.summary}
              </div>
            </div>
            </div>
          </section>

          {/* PROJECT OVERVIEW — metadata */}
          <section className="project-overview" style={{ padding: "36px 64px", borderBottom: "1px solid var(--line)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, maxWidth: "var(--content-w)", margin: "0 auto" }}>
              {[
                ["CLIENT", "UiPath"],
                ["ROLE", "Sole Designer"],
                ["TIMELINE", "2024\u201325"],
                ["STATUS", "Shipped (GA)"],
                ["READ", "7 MIN"]
              ].map(([k, v]) =>
              <div key={k} style={{ borderTop: "1px solid var(--ink)", paddingTop: 12 }}>
                  <MonoLabel>{k}</MonoLabel>
                  <div style={{ fontFamily: sansFamily, fontWeight: 600, fontSize: 16, marginTop: 6, color: "var(--ink)" }}>
                    {v}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ───────── 00 · THE PREMISE ───────── */}
          <Sec
          id="premise"
          no="00"
          kicker="THE STAKES"
          title="AI Scaled. Trust didn't"
          intro="UiPath had powerful GenAI across its automation platform. What it didn't have was a way to govern it. Every enterprise rollout surfaced the same unanswered questions — about data, model control, and auditability.">
          
            <div style={{ borderTop: "1px solid var(--ink)", paddingTop: 16, marginTop: 32, maxWidth: "var(--copy-w)" }}>
              <div
              style={{
                fontFamily: serifFamily,
                fontSize: 72,
                lineHeight: 1,
                color: "var(--accent)"
              }}>
                
                $1.99M
              </div>
              <p
              style={{
                fontFamily: sansFamily,
                fontSize: 16,
                lineHeight: 1.55,
                marginTop: 12,
                marginBottom: 0,
                color: "var(--ink)",
                maxWidth: 520
              }}>97 enterprise deals stalled on missing audit controls — with the
EU AI Act coming into force.

            </p>
            </div>
            <Body>
              The AI Trust Layer was UiPath's answer: a governance layer inside the Admin Console. I designed four of
              its surfaces, each solving a distinct trust problem{"\n"}— all now shipped to GA and live today.
            </Body>
            <Body>
              The hard part wasn't drawing screens. It was making invisible infrastructure feel visible, predictable,
              and safe — and giving four surfaces, built separately over time, one coherent mental model.
            </Body>

            <div
            style={{
              borderTop: "1px solid var(--ink)",
              paddingTop: 18,
              marginTop: 36,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 28,
              maxWidth: "var(--copy-w-wide)"
            }}>
              {[
            {
              label: "SCOPE",
              body: "End-to-end UX/UI across four AITL surfaces."
            },
            {
              label: "COLLABORATION",
              body: "Product (licensing, compliance), Engineering (connection validation, async constraints). Design guidance from Paresh Joshi."
            },
            {
              label: "DECISION AUTHORITY",
              body: "Drove IA, interaction patterns, and configuration mental models across the four surfaces."
            }].
            map((c) =>
            <div key={c.label}>
                  <MonoLabel size={10} style={{ display: "block" }}>
                    {c.label}
                  </MonoLabel>
                  <p
                style={{
                  fontFamily: sansFamily,
                  fontSize: 16,
                  lineHeight: 1.62,
                  marginTop: 10,
                  marginBottom: 0,
                  color: "var(--ink)"
                }}>
                    
                    {c.body}
                  </p>
                </div>)}

            </div>

            <div
              style={{ maxWidth: "var(--copy-w-wide)", marginTop: 40, marginBottom: 8 }}
              dangerouslySetInnerHTML={{
                __html: `<svg xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:780px;height:auto;margin-left:auto;margin-right:auto" viewBox="0 0 680 376" role="img" aria-label="AI Trust Layer system map: one governance layer with four surfaces.">
  <rect width="680" height="376" fill="#EAE5DB"/>
  <rect x="24" y="24" width="632" height="328" fill="none" stroke="#1F1E1B" stroke-opacity="0.22" stroke-width="1"/>
  <text x="52" y="60" font-family="ui-monospace,'IBM Plex Mono',monospace" font-size="11" letter-spacing="2.5" fill="#6F6E66">THE SYSTEM</text>
  <text x="52" y="95" font-family="Georgia,'Times New Roman',serif" font-size="28" fill="#1F1E1B">AI Trust Layer<tspan fill="#B5482C">.</tspan></text>
  <text x="52" y="121" font-family="Georgia,'Times New Roman',serif" font-style="italic" font-size="15" fill="#6F6E66">One governance layer for enterprise AI.</text>
  <line x1="52" y1="140" x2="628" y2="140" stroke="#1F1E1B" stroke-opacity="0.16" stroke-width="1"/>
  <text x="52" y="171" font-family="ui-monospace,'IBM Plex Mono',monospace" font-size="12" fill="#B5482C">01</text>
  <text x="92" y="171" font-family="system-ui,-apple-system,sans-serif" font-size="16" font-weight="500" fill="#1F1E1B">Context Grounding</text>
  <text x="628" y="171" text-anchor="end" font-family="Georgia,'Times New Roman',serif" font-style="italic" font-size="15" fill="#6F6E66">Where did this answer come from?</text>
  <line x1="52" y1="193" x2="628" y2="193" stroke="#1F1E1B" stroke-opacity="0.1" stroke-width="1"/>
  <text x="52" y="224" font-family="ui-monospace,'IBM Plex Mono',monospace" font-size="12" fill="#B5482C">02</text>
  <text x="92" y="224" font-family="system-ui,-apple-system,sans-serif" font-size="16" font-weight="500" fill="#1F1E1B">LLM Configurations</text>
  <text x="628" y="224" text-anchor="end" font-family="Georgia,'Times New Roman',serif" font-style="italic" font-size="15" fill="#6F6E66">Which model powers this?</text>
  <line x1="52" y1="246" x2="628" y2="246" stroke="#1F1E1B" stroke-opacity="0.1" stroke-width="1"/>
  <text x="52" y="277" font-family="ui-monospace,'IBM Plex Mono',monospace" font-size="12" fill="#B5482C">03</text>
  <text x="92" y="277" font-family="system-ui,-apple-system,sans-serif" font-size="16" font-weight="500" fill="#1F1E1B">Audit Export</text>
  <text x="628" y="277" text-anchor="end" font-family="Georgia,'Times New Roman',serif" font-style="italic" font-size="15" fill="#6F6E66">Can we prove what happened?</text>
  <line x1="52" y1="299" x2="628" y2="299" stroke="#1F1E1B" stroke-opacity="0.1" stroke-width="1"/>
  <text x="52" y="330" font-family="ui-monospace,'IBM Plex Mono',monospace" font-size="12" fill="#B5482C">04</text>
  <text x="92" y="330" font-family="system-ui,-apple-system,sans-serif" font-size="16" font-weight="500" fill="#1F1E1B">AI Governance</text>
  <text x="628" y="330" text-anchor="end" font-family="Georgia,'Times New Roman',serif" font-style="italic" font-size="15" fill="#6F6E66">Who is allowed to use AI?</text>
</svg>`
              }}>
            </div>
          </Sec>

          {/* ───────── 01 · CONTEXT GROUNDING ───────── */}
          <Sec
          id="grounding"
          no="01"
          kicker="HERO FEATURE 01 · CONTEXT GROUNDING"
          title="Demystifying the black box">
          
            <Mission>
              The Mission: empower developers to ground GenAI in their own proprietary data — with transparent source
              traceability.
            </Mission>
            <DuoBlock
            left={{
              tag: "THE PROBLEM",
              body:
              "Automation developers wanted to use Generative AI with their own proprietary data \u2014 internal documents, knowledge bases, records. But foundational models are trained on a general, public corpus. They don't know your business, can't cite their sources, and when they hallucinate there's no trail to follow. \nDevelopers were building automations on outputs they had no way to verify.",
              append:
              <div style={{ marginTop: 14 }}>
                <InlineLink href="https://www.uipath.com/blog/ai/understanding-context-grounding">
                  UiPath's PM on context grounding →
                </InlineLink>
              </div>
            }}
            right={{
              tag: "THE DESIGN SOLUTION",
              body:
              "I designed Context Grounding as a platform service inside the Admin Console \u2014 letting admins ground GenAI in customer-selected data, and giving developers transparent evidence of where every answer came from.\n"
            }} />
          
            <div
            style={{
              borderTop: "1px solid var(--ink)",
              paddingTop: 18,
              marginTop: 28,
              maxWidth: "var(--copy-w-wide)"
            }}>
              <p
              style={{
                fontFamily: serifFamily,
                fontStyle: "italic",
                fontSize: 26,
                lineHeight: 1.4,
                margin: 0,
                color: "var(--ink)",
                maxWidth: "var(--copy-w-wide)"
              }}>
                Reduce hallucination risk by anchoring every answer in citable data. Build trust by making the
                model's reasoning reviewable {"\u2014"} not opaque.
              </p>
            </div>
            <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
              marginTop: 28
            }}>
              {[
            {
              tag: "DESIGNING THE DATA LAYER",
              lead: "RAG, as a workflow admins already know.",
              body:
              "Register a source, build an index per tenant, watch sync resolve \u2014 In progress, Failed, done. The vector-database complexity stays underneath."
            },
            {
              tag: "TRANSPARENT RETRIEVAL",
              lead: "Surfaced the retrieval, didn't hide it.",
              body:
              "A grounded answer shows the documents it pulled and where they came from \u2014 validation becomes part of the flow, not a separate audit."
            },
            {
              tag: "MULTI-TENANT SCOPING",
              lead: "Scoped grounding to the tenant.",
              body:
              "A source live in production stays out of dev \u2014 closing a quiet path for test data to bleed into production answers."
            }].
            map((c) =>
            <div key={c.tag} style={{ borderTop: "1px solid var(--ink)", paddingTop: 14 }}>
                  <MonoLabel>{c.tag}</MonoLabel>
                  <p
                style={{
                  fontFamily: sansFamily,
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: 1.35,
                  margin: "12px 0 0",
                  color: "var(--ink)"
                }}>
                    {c.lead}
                  </p>
                  <p
                style={{
                  fontFamily: sansFamily,
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: 1.55,
                  margin: "8px 0 0",
                  color: "var(--ink)"
                }}>
                    {c.body}
                  </p>
                </div>)}

            </div>
          
            <div style={{ marginTop: 36 }}>
              <AITLCarousel
              label={
              <React.Fragment>
                  WALKTHROUGH · CONTEXT GROUNDING ·{" "}
                  <InlineLink href="https://www.youtube.com/watch?v=xfN8U5Yh4Bw">
                    watch it live →
                  </InlineLink>
                </React.Fragment>
              }
              items={[
              {
                label: "01.1",
                ratio: "4704 / 2706",
                src: "/site/assets/aitl/grounding-list.png",
                note: "Index manager — govern the proprietary data used as context with UiPath GenAI features, with sync status per index."
              },
              {
                label: "01.2",
                ratio: "4704 / 2706",
                src: "/site/assets/aitl/grounding-add-bucket.png",
                note: "Add new index via a Storage bucket source, with an optional Tether to validate retrieval against expected answers."
              },
              {
                label: "01.3",
                ratio: "4704 / 2706",
                src: "/site/assets/aitl/grounding-add-connection.png",
                note: "Or ground from an Integration Service connection — e.g. OneDrive & SharePoint — scoped to a data source location."
              },
              {
                label: "01.4",
                ratio: "4320 / 3891",
                src: "/site/assets/aitl/grounding-detail.png",
                note: "Index detail — the configured source, description and sync state, ready to ground GenAI responses."
              }]
              } />
            
            </div>
          </Sec>

          {/* ───────── 02 · BYO LLM ───────── */}
          <Sec
          id="byollm"
          no="02"
          kicker="HERO FEATURE 02 · LLM CONFIGURATIONS"
          title="Bring your own LLM, without production risk">
          
            <Mission>
              The Mission: design for infrastructure autonomy without production risk.
            </Mission>
            <Body mt={24}>
              Enterprise customers didn't just want UiPath's models {"\u2014"} they wanted to route AI workloads through
              their own subscriptions (Azure OpenAI, Google Vertex). However, if an admin misconfigured a connection,
              multiple AI-powered products would silently fail in production.
            </Body>
            <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
              marginTop: 28
            }}>
              {[
            {
              tag: "01 \u00B7 THE MVP TRAP",
              lead: "Configuring a model, not a product.",
              body:
              "Early explorations let an admin point a model at their own endpoint \u2014 but showed nothing about which products depended on it. Change the model, break something downstream, no warning."
            },
            {
              tag: "02 \u00B7 THE REFRAME",
              lead: "Configure the product, not the model.",
              body:
              "I inverted the mental model to a Product \u2192 Feature \u2192 Model map. Admins configure \u201CAI for Document Understanding,\u201D not \u201CGPT-4\u201D \u2014 so the dependency is visible by design."
            },
            {
              tag: "03 \u00B7 SAFE DEFAULTS",
              lead: "A broken connection can\u2019t go live.",
              body:
              "Every connection must pass a mandatory test before it can go live \u2014 so a misconfiguration is caught at setup, not in production."
            }].
            map((c) =>
            <div key={c.tag} style={{ borderTop: "1px solid var(--ink)", paddingTop: 14 }}>
                  <MonoLabel>{c.tag}</MonoLabel>
                  <p
                style={{
                  fontFamily: sansFamily,
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: 1.35,
                  margin: "12px 0 0",
                  color: "var(--ink)"
                }}>
                    {c.lead}
                  </p>
                  <p
                style={{
                  fontFamily: sansFamily,
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: 1.55,
                  margin: "8px 0 0",
                  color: "var(--ink)"
                }}>
                    {c.body}
                  </p>
                </div>)}

            </div>
          
            <div style={{ marginTop: 20 }}>
              <InlineLink href="https://www.uipath.com/blog/product-and-updates/introducing-bring-your-own-model-to-uipath">
                UiPath's PM on bring-your-own-model {"\u2192"}
              </InlineLink>
            </div>

            <div
            style={{ width: "100%", margin: "48px auto" }}
            dangerouslySetInnerHTML={{
              __html:
              '<svg xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:780px;height:auto;margin-left:auto;margin-right:auto" viewBox="0 0 680 474" role="img" aria-label="The reframe: from configuring a model to configuring a product."><title>BYO LLM mental-model inversion</title><desc>Before: an admin configures a model directly and the products that depend on it are invisible. After: the admin configures a product, with feature and model nested beneath in a visible chain.</desc><defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs><rect width="680" height="474" fill="#EAE5DB"/><rect x="24" y="24" width="632" height="426" fill="none" stroke="#1F1E1B" stroke-opacity="0.22" stroke-width="1"/><text x="52" y="60" font-family="ui-monospace,\'IBM Plex Mono\',monospace" font-size="11" letter-spacing="2.5" fill="#6F6E66">THE REFRAME</text><text x="52" y="95" font-family="Georgia,\'Times New Roman\',serif" font-size="28" fill="#1F1E1B">Configure the product, not the model<tspan fill="#B5482C">.</tspan></text><text x="52" y="121" font-family="Georgia,\'Times New Roman\',serif" font-style="italic" font-size="15" fill="#6F6E66">The mental model, inverted.</text><line x1="52" y1="140" x2="628" y2="140" stroke="#1F1E1B" stroke-opacity="0.16" stroke-width="1"/><text x="52" y="176" font-family="ui-monospace,\'IBM Plex Mono\',monospace" font-size="11" letter-spacing="2" fill="#6F6E66">BEFORE · MODEL-CENTRIC</text><text x="372" y="176" font-family="ui-monospace,\'IBM Plex Mono\',monospace" font-size="11" letter-spacing="2" fill="#B5482C">AFTER · PRODUCT-CENTRIC</text><rect x="86" y="198" width="180" height="48" rx="4" fill="#DDD8CC" stroke="#6F6E66" stroke-opacity="0.5" stroke-width="1"/><text x="176" y="222" text-anchor="middle" dominant-baseline="central" font-family="system-ui,-apple-system,sans-serif" font-size="16" font-weight="500" fill="#3A3A37">Model endpoint</text><line x1="176" y1="246" x2="176" y2="288" stroke="#6F6E66" stroke-opacity="0.5" stroke-width="1" stroke-dasharray="4 4" marker-end="url(#arr)"/><rect x="86" y="288" width="180" height="48" rx="4" fill="none" stroke="#6F6E66" stroke-opacity="0.45" stroke-width="1" stroke-dasharray="4 4"/><text x="176" y="312" text-anchor="middle" dominant-baseline="central" font-family="system-ui,-apple-system,sans-serif" font-size="16" fill="#6F6E66">Unknown impact</text><line x1="314" y1="267" x2="358" y2="267" stroke="#6F6E66" stroke-opacity="0.6" stroke-width="1" marker-end="url(#arr)"/><rect x="406" y="190" width="180" height="56" rx="4" fill="#F3DBCF" stroke="#B5482C" stroke-opacity="0.6" stroke-width="1"/><text x="496" y="212" text-anchor="middle" dominant-baseline="central" font-family="system-ui,-apple-system,sans-serif" font-size="16" font-weight="500" fill="#712B13">Product</text><text x="496" y="232" text-anchor="middle" dominant-baseline="central" font-family="system-ui,-apple-system,sans-serif" font-size="12" fill="#993C1D">Document Understanding</text><line x1="496" y1="246" x2="496" y2="284" stroke="#B5482C" stroke-opacity="0.7" stroke-width="1" marker-end="url(#arr)"/><rect x="406" y="284" width="180" height="48" rx="4" fill="#F3DBCF" stroke="#B5482C" stroke-opacity="0.6" stroke-width="1"/><text x="496" y="308" text-anchor="middle" dominant-baseline="central" font-family="system-ui,-apple-system,sans-serif" font-size="16" fill="#712B13">Feature</text><line x1="496" y1="332" x2="496" y2="370" stroke="#B5482C" stroke-opacity="0.7" stroke-width="1" marker-end="url(#arr)"/><rect x="406" y="370" width="180" height="48" rx="4" fill="#F3DBCF" stroke="#B5482C" stroke-opacity="0.6" stroke-width="1"/><text x="496" y="394" text-anchor="middle" dominant-baseline="central" font-family="system-ui,-apple-system,sans-serif" font-size="16" fill="#712B13">Model</text><text x="52" y="440" font-family="Georgia,\'Times New Roman\',serif" font-style="italic" font-size="15" fill="#6F6E66">Model first. Impact hidden.</text><text x="372" y="440" font-family="Georgia,\'Times New Roman\',serif" font-style="italic" font-size="15" fill="#6F6E66">Product first. Chain visible.</text></svg>'
            }} />

            <div style={{ marginTop: 36 }}>
              <AITLCarousel
              label="WALKTHROUGH · LLM CONFIGURATIONS"
              items={[
              {
                label: "02.1",
                ratio: "5760 / 4281",
                src: "/site/assets/aitl/llm-list.png",
                note: "Configurations listed per Product → Feature, each carrying a live connection Status — Connected or Failed."
              },
              {
                label: "02.2",
                ratio: "5760 / 3240",
                src: "/site/assets/aitl/llm-view.png",
                note: "View configuration — the per-feature model panel detailing folder, connector, connection and deployment."
              },
              {
                label: "02.3",
                ratio: "5760 / 3240",
                src: "/site/assets/aitl/llm-add.png",
                note: "Add configuration — routing a feature’s models to the customer’s own subscriptions before activation."
              },
              {
                label: "02.4",
                ratio: "5760 / 4281",
                src: "/site/assets/aitl/llm-error.png",
                note: "Mandatory connection testing — a failed probe blocks save and points to the exact model that needs attention."
              }]
              } />
            
            </div>
          </Sec>

          {/* ───────── 03 · AUDIT EXPORT ───────── */}
          <Sec
          id="audit"
          no="03"
          kicker="HERO FEATURE 03 · AUDIT EXPORT"
          title="Proving what the AI did">
          
            <Mission>
              Turning silent failures and hidden licensing limits into an export users could trust.
            </Mission>
            <DuoBlock
            left={{
              tag: "THE PROBLEM",
              body:
              "Enterprises have to prove to auditors exactly what their AI did \u2014 every request, model, and outcome. But the audit log was visible for only 60 days, with no scalable way to export it: the compliance gap behind the stalled deals in Section 00. And the export itself was a minefield \u2014 massive CSVs failed silently, and hidden licensing tiers quietly capped how much history a customer could pull."
            }}
            right={{
              tag: "THE DESIGN SOLUTION",
              body:
              "Rather than expose those backend limits or ship a naive \u201CDownload\u201D button, I designed export as a visible, asynchronous lifecycle \u2014 request, process, retry \u2014 and surfaced the system's constraints as intentional UI instead of hidden traps. Retention windows, export quotas, and download deadlines became things a user could see and plan around, so the experience stayed predictable even when the backend wasn't."
            }} />
          
            <div
            style={{
              borderTop: "1px solid var(--ink)",
              paddingTop: 18,
              marginTop: 28,
              maxWidth: "var(--copy-w-wide)"
            }}>
              <p
              style={{
                fontFamily: serifFamily,
                fontStyle: "italic",
                fontSize: 26,
                lineHeight: 1.4,
                margin: 0,
                color: "var(--ink)",
                maxWidth: "var(--copy-w-wide)"
              }}>
                Don't hide the system's limits. Make them legible {"\u2014"} and let the user plan around them.
              </p>
            </div>
            <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
              marginTop: 28
            }}>
              {[
            {
              tag: "01 · ASYNCHRONOUS LIFECYCLE",
              lead: "A long export can't pretend to be instant.",
              body:
              "Big exports take time and sometimes fail. I designed a request \u2192 processing \u2192 ready \u2192 retry lifecycle with a persistent tracker, so a user can fire an export, leave, and get pulled back when it's done \u2014 never staring at a frozen screen."
            },
            {
              tag: "02 · ENTITLEMENT-AWARE STATES",
              lead: "The UI knows what your license allows.",
              body:
              "Retention and quotas vary by tier \u2014 up to 180 days of history, four exports a month with inputs and outputs. I surfaced those limits in context (\u201C2 of 4 remaining\u201D), so users meet a clear ceiling instead of a silent failure."
            },
            {
              tag: "03 · NOTIFICATIONS THAT RESPECT THE WINDOW",
              lead: "Warn people before the download expires.",
              body:
              "A ready export only lives for a limited window. I designed a three-stage email cadence \u2014 ready, a mid-window nudge, a final warning before expiry \u2014 so a compliance export never quietly lapses."
            }].
            map((c) =>
            <div key={c.tag} style={{ borderTop: "1px solid var(--ink)", paddingTop: 14 }}>
                  <MonoLabel>{c.tag}</MonoLabel>
                  <p
                style={{
                  fontFamily: sansFamily,
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: 1.35,
                  margin: "12px 0 0",
                  color: "var(--ink)"
                }}>
                    {c.lead}
                  </p>
                  <p
                style={{
                  fontFamily: sansFamily,
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: 1.55,
                  margin: "8px 0 0",
                  color: "var(--ink)"
                }}>
                    {c.body}
                  </p>
                </div>)}

            </div>
          
            <div style={{ marginTop: 36 }}>
              <AITLCarousel
              label="WALKTHROUGH · AUDIT EXPORT LIFECYCLE"
              items={[
              {
                label: "03a",
                ratio: "1853 / 1038",
                src: "/site/assets/aitl/audit-landing.png",
                note: "Audit landing — a 60-day overview of requests by product, model and status, with export entitlements shown up front."
              },
              {
                label: "03b",
                ratio: "1853 / 1038",
                src: "/site/assets/aitl/audit-initiate.png",
                note: "Initiating an export — the filter settings carry through, and remaining monthly export quota is made explicit."
              },
              {
                label: "03c",
                ratio: "1853 / 1038",
                src: "/site/assets/aitl/audit-process.png",
                note: "Processing — an asynchronous, non-blocking state: it may take time and the user is notified on completion."
              },
              {
                label: "03d",
                ratio: "1853 / 1038",
                src: "/site/assets/aitl/audit-exports.png",
                note: "Export history — In progress / Completed / Failed per run, with retry and download, and clear retention rules."
              }]
              } />
            
            </div>
          </Sec>

          {/* ───────── 04 · AI GOVERNANCE ───────── */}
          <Sec
          id="governance"
          no="04"
          kicker="AI GOVERNANCE"
          title="Who gets to use AI">
          
            <Mission>
              Scattered AI toggles, consolidated into policy you set once {"\u2014"} at the right level.
            </Mission>
            <Body mt={20}>
              Generative-AI access was governed by scattered, low-level switches. I consolidated them into a single
              governance surface inside AITL: an organization sets AI policy once and deploys it across tenants, groups,
              or users.
            </Body>
          
            <div
            style={{
              borderTop: "1px solid var(--ink)",
              paddingTop: 18,
              marginTop: 28,
              maxWidth: "var(--copy-w-wide)"
            }}>
              <p
              style={{
                fontFamily: serifFamily,
                fontStyle: "italic",
                fontSize: 26,
                lineHeight: 1.4,
                margin: 0,
                color: "var(--ink)",
                maxWidth: "var(--copy-w-wide)"
              }}>
                Settings are toggles you flip. Governance is policy you deploy.
              </p>
            </div>
            <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginTop: 28
            }}>
              {[
            {
              tag: "01 · POLICY AT THE RIGHT LEVEL",
              lead: "Org-wide, or down to a tenant.",
              body:
              "Policies apply at organization or tenant level, so a global rule and a team-specific exception can coexist without fighting each other."
            },
            {
              tag: "02 · PRECEDENCE YOU CAN REASON ABOUT",
              lead: "The most specific policy wins.",
              body:
              "When policies stack across tenants, groups, and users, user-level takes precedence over higher levels \u2014 a clear, predictable rule for what actually applies."
            }].
            map((c) =>
            <div key={c.tag} style={{ borderTop: "1px solid var(--ink)", paddingTop: 14 }}>
                  <MonoLabel>{c.tag}</MonoLabel>
                  <p
                style={{
                  fontFamily: sansFamily,
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: 1.35,
                  margin: "12px 0 0",
                  color: "var(--ink)"
                }}>
                    {c.lead}
                  </p>
                  <p
                style={{
                  fontFamily: sansFamily,
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: 1.55,
                  margin: "8px 0 0",
                  color: "var(--ink)"
                }}>
                    {c.body}
                  </p>
                </div>)}

            </div>
          
            <div style={{ marginTop: 36 }}>
              <AITLCarousel
              label="WALKTHROUGH · AI GOVERNANCE"
              items={[
              {
                label: "04a",
                ratio: "4098 / 2931",
                src: "/site/assets/aitl/gov-settings.png",
                note: "AI Trust Layer governance — manage Autopilot usage across organization, tenants and groups, choosing org- or tenant-level policy."
              },
              {
                label: "04b",
                ratio: "1548 / 2931",
                src: "/site/assets/aitl/gov-deployments.png",
                note: "Manage deployments — apply a policy across tenants, users and groups, with precedence rules made legible."
              }]
              } />
            
            </div>
          </Sec>

          {/* ───────── 05 · REFLECTION ───────── */}
          <Sec
          id="learnings"
          no="05"
          kicker="REFLECTION"
          title="What I'd carry forward"
          last>
          
            <Body mt={20}>
              All four surfaces — Context Grounding, LLM Configurations, Audit Export, and AI Governance — shipped to GA
              and are live in the UiPath Admin Console today, governing how enterprises ground, configure, audit, and
              control generative AI.
            </Body>
          
            <div
            style={{
              borderTop: "1px solid var(--ink)",
              paddingTop: 18,
              marginTop: 28,
              maxWidth: "var(--copy-w-wide)"
            }}>
              <p
              style={{
                fontFamily: serifFamily,
                fontStyle: "italic",
                fontSize: 26,
                lineHeight: 1.4,
                margin: 0,
                color: "var(--ink)",
                maxWidth: "var(--copy-w-wide)"
              }}>
                The work was making AI infrastructure {"\u2014"} invisible by nature {"\u2014"} feel visible,
                predictable, and safe.
              </p>
            </div>
            <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
              marginTop: 28
            }}>
              {[
            {
              tag: "01 · ON TRUST",
              lead: "Transparency is the interface.",
              body:
              "Whether it's showing where an answer came from or what an export will and won't include, enterprise trust is built by making the system legible \u2014 not by hiding its machinery."
            },
            {
              tag: "02 · ON ADMIN UX",
              lead: "Constraints are a design material.",
              body:
              "The strongest moments here weren't new controls \u2014 they were turning backend limits, licensing tiers, and failure states into things a user could see and plan around."
            },
            {
              tag: "03 · ON OWNERSHIP",
              lead: "Sole designer, not solo designer.",
              body:
              "I led the design end-to-end across four surfaces, under the guidance of my design manager, Paresh Joshi, and alongside product and engineering. Owning the craft and naming the people who shaped it are the same skill."
            }].
            map((c) =>
            <div key={c.tag} style={{ borderTop: "1px solid var(--ink)", paddingTop: 14 }}>
                  <MonoLabel>{c.tag}</MonoLabel>
                  <p
                style={{
                  fontFamily: sansFamily,
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: 1.35,
                  margin: "12px 0 0",
                  color: "var(--ink)"
                }}>
                    {c.lead}
                  </p>
                  <p
                style={{
                  fontFamily: sansFamily,
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: 1.55,
                  margin: "8px 0 0",
                  color: "var(--ink)"
                }}>
                    {c.body}
                  </p>
                </div>)}

            </div>
          
            <div style={{ marginTop: 44, textAlign: "center" }}>
              <MonoLabel>AI Trust Layer · UiPath · shipped 2024-25</MonoLabel>
            </div>
          </Sec>

          {/* ───────── NEXT PROJECT ───────── */}
          <section style={{ padding: "56px 64px", borderTop: "1px solid var(--line)" }}>
            <a
            href="/work/admin-shell"
            onClick={(e) => { if (window.parent && window.parent !== window) { e.preventDefault(); window.parent.postMessage({ type: "work:focus", key: "admin-shell" }, "*"); } }}
            style={{
              textDecoration: "none",
              color: "var(--ink)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              maxWidth: "var(--content-w)",
              margin: "0 auto"
            }}>
            
              <div>
                <MonoLabel>NEXT PROJECT / 003</MonoLabel>
                <div
                style={{
                  fontFamily: sansFamily,
                  fontWeight: 800,
                  fontSize: 64,
                  lineHeight: 0.95,
                  letterSpacing: "-0.025em",
                  marginTop: 12
                }}>
                
                  RE-ARCHITECTING UIPATH ADMIN SHELL<span style={{ color: "var(--accent)" }}>.</span>
                </div>
              </div>
              <div style={{ fontFamily: monoFamily, fontSize: 24, color: "var(--accent)" }}>→</div>
            </a>
          </section>

        </article>
      }
    </PageShell>);

}

export { AITLProjectPage };
