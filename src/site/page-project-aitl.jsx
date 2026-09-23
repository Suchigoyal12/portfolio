import React from "react";
import { MonoLabel, PageShell, WaveMotif, chromeHorizon, monoFamily, sansFamily, serifFamily } from "./shared.jsx";
import { dims } from "./image-dims.js";
import "./aitl-impact.css";
// =============================================================
// PROJECT DETAIL — AI TRUST LAYER (AITL)
// Reuses the Check Access V5 layout (sticky left rail + magazine
// flow). All copy grounded to the AITL PDF source — narrative
// kept intact: The Stakes → Context Grounding → LLM Configurations →
// Audit Export → AI Governance → Learnings.
// =============================================================

const AITL = {
  no: "002",
  client: "UiPath",
  eyebrow: "PRODUCT DESIGN CASE STUDY",
  headline: ["AI "],
  summary:
  "The control plane for enterprise GenAI, designed to make AI safe, transparent, and governable at scale.",
  meta: [
  ["ROLE", "Sole Product Designer"],
  ["TIMELINE", "2024-25"],
  ["PLATFORM", "UiPath (Admin Console)"],
  ["STATUS", "Shipped (GA)"]],

  tags: ["AI Governance", "LLMOps", "Context Grounding", "LLM Configurations", "Audit & Compliance", "UiPath Admin"],
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
            {...dims(item.src)}
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
        {...dims(it.src)}
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
// ── Impact block (numbers first, qualitative cards underneath) ─
// Markup and classes follow the "AI Trust Layer — Impact Sections" artifact;
// styles live in aitl-impact.css. Audit Export has no figures, so it uses a
// statement hero and no stat grid. That asymmetry is intentional.
function ImpactBlock({ label, hero, stats, cards }) {
  return (
    <div className="aitl-impact">
      <p className="meta">Impact · <span>{label}</span></p>
      {hero}
      {stats &&
      <div className="stat-grid">
          {stats.map(([num, cap]) =>
        <div key={cap} className="stat-card">
              <span className="stat-num">{num}</span>
              <p className="stat-cap">{cap}</p>
            </div>
        )}
        </div>
      }
      <div className="changed-grid">
        {cards.map((c) =>
        <div key={c.kw} className={c.span ? "changed-card span" : "changed-card"}>
            <p className="changed-kw">{c.kw}</p>
            <p className="changed-line">{c.line}</p>
          </div>
        )}
      </div>
    </div>);

}

const IMPACT = {
  grounding:
  <ImpactBlock
    label="Context Grounding"
    hero={
    <div className="hero-block">
        <span className="hero-num">~$5M</span>
        <p className="hero-cap">Net ARR through first-party products</p>
      </div>
    }
    stats={[
    ["~20%", "Better retrieval accuracy, completeness & NDCG"],
    ["0\u21921", "First-class feature in UiPath Cloud"],
    ["5", "UiPath first-party products embedding it at launch"],
    ["5", "Data sources supported at launch"]]
    }
    cards={[
    {
      kw: "Answers became traceable",
      line: <>Every index names its origin: folder, bucket, connector, account. A wrong answer becomes <strong>a lookup, not an investigation.</strong></>
    },
    {
      kw: "Broken data stopped being invisible",
      line: <>Sync failures, stale indexes, and in-progress jobs each surface their own state, where admins already look, <strong>catching a bad index before it produces a bad answer.</strong></>
    },
    {
      kw: "Customers kept their choice of stack",
      line: <>Five data sources at launch, including two third-party vector databases. <strong>No forced migration, no lock-in.</strong></>
    },
    {
      kw: "Developers stopped rebuilding the same thing",
      line: <>One index, configured once, consumed by every GenAI surface on the platform. <strong>The work moved from every developer to one admin.</strong></>
    }]
    } />,

  byollm:
  <ImpactBlock
    label="LLM Configurations"
    hero={
    <div className="hero-block">
        <span className="hero-num sm">$1.7M / $2.3M</span>
        <p className="hero-cap">ARR / iARR: competitive revenue this work was built against</p>
      </div>
    }
    stats={[
    ["5", "Customers onboarded in private preview"],
    ["7", "UiPath products onboarded at launch ensuring increased visibility and control for customers"]]
    }
    cards={[
    {
      kw: "Enterprises stopped paying twice",
      line: <>Customers route UiPath's AI through Azure, AWS, or Google subscriptions <strong>they already own.</strong></>
    },
    {
      kw: "Compliance stopped being a blocker",
      line: <>Regulated customers run UiPath AI <strong>inside their own infrastructure, in their own region.</strong></>
    },
    {
      kw: "Misconfiguration stopped reaching production",
      line: <>Validation moved to setup time: <strong>a broken endpoint is caught by the admin who made it</strong>, not a failed run days later.</>
    },
    {
      kw: "AI infrastructure became visible",
      line: <>One table answers what was unanswerable: <strong>which model powers which product, through whose subscription, connected right now.</strong></>
    },
    {
      kw: "Built once, extends to the whole platform",
      span: true,
      line: <>Seven products onboarded at launch. <strong>Adding a product became an onboarding task, not a new interface.</strong></>
    }]
    } />,

  audit:
  <ImpactBlock
    label="Audit Export"
    hero={
    <>
        <p className="hero-line">Proof that governance <em>actually ran.</em></p>
        <p className="hero-cap" style={{ marginBottom: 48 }}>Audit now gives a record that an auditor can defend, instead of a log of what succeeded.</p>
      </>
    }
    cards={[
    {
      kw: "The file proves enforcement, not just activity",
      line: <>Blocked requests are in it, so the export shows governance <strong>actually working</strong>, not only the requests that succeeded. That's the part an auditor is checking.</>
    },
    {
      kw: "Compliance evidence stays defensible later",
      line: <>Every export carries its own provenance: <strong>{"\u201C"}where did this file come from{"\u201D"} has an answer inside the platform.</strong></>
    }]
    } />

};

function AITLCarousel({ items, label }) {
  const wrapRef = React.useRef(null);
  const stageRef = React.useRef(null);
  const trackRef = React.useRef(null);
  const stripRef = React.useRef(null);
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

  // The width the cards have to fit in: the swipe strip when narrow, the
  // pan stage's content box when wide. Padding is read, not assumed, because
  // the stage's follows --aitl-pad.
  //
  // A ResizeObserver, not a window resize listener: the page can be hidden
  // when this first runs, which measures 0, and nothing resizes the window
  // afterwards to correct it. The observer also catches the stage padding
  // changing when a media query crosses. A 0 reading means "not laid out
  // yet" and leaves the cap off rather than collapsing every card.
  const [avail, setAvail] = React.useState(Infinity);
  React.useLayoutEffect(() => {
    const el = isNarrow ? stripRef.current : stageRef.current;
    if (!el) return;
    const measure = () => {
      const cs = getComputedStyle(el);
      const w = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      setAvail(w > 0 ? w : Infinity);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isNarrow]);

  // One height per carousel, capped so its widest screen fits the available
  // width in a single look. Suchi's rule: a screen should never be cut off on
  // a phone or a small window. Sharing the height keeps the row even, at the
  // cost of portrait screens coming out small next to landscape ones; a tap
  // still opens any of them full size. Wide windows are unaffected, because
  // the cap only bites when the height-derived width would not fit.
  const maxRatio = Math.max(...items.map((it) => parseRatio(it.ratio)));
  const fitH = Math.min(cardH, Math.floor(avail / maxRatio));
  const widths = items.map((it) => Math.round(fitH * parseRatio(it.ratio)));
  const trackWidth = widths.reduce((a, b) => a + b, 0) + GAP * (items.length - 1);

  // Horizontal scroll distance for the wide pan
  React.useLayoutEffect(() => {
    setDist(isNarrow || !isFinite(avail) ? 0 : Math.max(0, trackWidth - avail));
  }, [trackWidth, isNarrow, avail]);

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
          ref={stripRef}
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
              <AITLCard item={it} width={widths[i]} height={fitH} onOpen={() => setLightbox(i)} />
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
  //
  // --aitl-pad is the section's side padding, 64px by default. The site-wide
  // rule in shared.jsx narrows that padding to 40px at 1180px and below, and
  // aitl-impact.css follows it here. Hardcoding 64 overshot the page edge by
  // 24px on each side in that band and made the page scroll sideways
  // (roadmap item 13).
  return (
    <div
      ref={wrapRef}
      className="aitl-pan"
      style={{
        position: "relative",
        height: `calc(100vh + ${dist}px)`,
        marginLeft: "calc(-180px - 32px - var(--aitl-pad, 64px))",
        marginRight: "calc(-1 * var(--aitl-pad, 64px))",
        width: "calc(100% + 180px + 32px + 2 * var(--aitl-pad, 64px))"
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
          padding: "0 var(--aitl-pad, 64px)"
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
          <AITLCard key={it.label} item={it} width={widths[i]} height={fitH} onOpen={() => setLightbox(i)} />
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
  { id: "byollm", no: "02", label: "LLM Configurations" },
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
          intro="UiPath had powerful GenAI across its platform, and no way to govern it. Every enterprise rollout surfaced the same four questions.">
          
            <div
              style={{ maxWidth: "var(--copy-w-wide)", marginTop: 40 }}
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
            <Body mt={40}>
              I designed the primary features answering them: four surfaces, built separately over time, given one
              coherent mental model. All now shipped to GA and live today.
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
              body: "Drove IA, interaction patterns, and configuration mental models."
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
          </Sec>

          {/* ───────── 01 · CONTEXT GROUNDING ───────── */}
          <Sec
          id="grounding"
          no="01"
          kicker="HERO FEATURE 01 · CONTEXT GROUNDING"
          title="Demystifying the black box">
          
            <Mission>
              The Mission: empower developers to ground GenAI in their own proprietary data, with transparent source
              traceability.
            </Mission>
            <DuoBlock
            left={{
              tag: "THE PROBLEM",
              body:
              "Automation developers wanted to use Generative AI with their own proprietary data: internal documents, knowledge bases, records. But foundational models are trained on a general, public corpus. They don't know your business, can't cite their sources, and when they hallucinate there's no trail to follow. \nDevelopers were building automations on outputs they had no way to verify.",
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
              "I designed Context Grounding as a platform service inside the Admin Console, letting admins ground GenAI in customer-selected data, and giving developers transparent evidence of where every answer came from.\n"
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
                model's reasoning reviewable, not opaque.
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
              "Register a source, build an index per tenant, watch sync resolve: In progress, Failed, done. The vector-database complexity stays underneath."
            },
            {
              tag: "TRANSPARENT RETRIEVAL",
              lead: "Surfaced the retrieval, didn't hide it.",
              body:
              "A grounded answer shows the documents it pulled and where they came from, so validation becomes part of the flow, not a separate audit."
            },
            {
              tag: "MULTI-TENANT SCOPING",
              lead: "Scoped grounding to the tenant.",
              body:
              "A source live in production stays out of dev, closing a quiet path for test data to bleed into production answers."
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
                src: "/site/assets/aitl/grounding-list.webp",
                note: "Index manager: govern the proprietary data used as context with UiPath GenAI features, with sync status per index."
              },
              {
                label: "01.2",
                ratio: "4704 / 2706",
                src: "/site/assets/aitl/grounding-add-bucket.webp",
                note: "Add new index via a Storage bucket source, with an optional Tether to validate retrieval against expected answers."
              },
              {
                label: "01.3",
                ratio: "4704 / 2706",
                src: "/site/assets/aitl/grounding-add-connection.webp",
                note: "Or ground from an Integration Service connection (e.g. OneDrive & SharePoint), scoped to a data source location."
              },
              {
                label: "01.4",
                ratio: "4320 / 3891",
                src: "/site/assets/aitl/grounding-detail.webp",
                note: "Index detail: the configured source, description and sync state, ready to ground GenAI responses."
              }]
              } />
            
            </div>
            {IMPACT.grounding}
          </Sec>

          {/* ───────── 02 · LLM CONFIGURATIONS ───────── */}
          <Sec
          id="byollm"
          no="02"
          kicker="HERO FEATURE 02 · LLM CONFIGURATIONS"
          title="Bring your own LLM, without production risk">
          
            <Mission>
              The Mission: design for infrastructure autonomy without production risk.
            </Mission>
            <Body mt={24}>
              Enterprise customers didn't just want UiPath's models; they wanted to route AI workloads through
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
              "Early explorations let an admin point a model at their own endpoint, but showed nothing about which products depended on it. Change the model, break something downstream, no warning."
            },
            {
              tag: "02 \u00B7 THE REFRAME",
              lead: "Configure the product, not the model.",
              body:
              "I inverted the mental model to a Product \u2192 Feature \u2192 Model map. Admins configure \u201CAI for Document Understanding,\u201D not \u201CGPT-4,\u201D so the dependency is visible by design."
            },
            {
              tag: "03 \u00B7 SAFE DEFAULTS",
              lead: "A broken connection can\u2019t go live.",
              body:
              "Every connection must pass a mandatory test before it can go live, so a misconfiguration is caught at setup, not in production."
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
              '<svg xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:780px;height:auto;margin-left:auto;margin-right:auto" viewBox="0 0 680 474" role="img" aria-label="The reframe: from configuring a model to configuring a product."><title>LLM Configurations mental-model inversion</title><desc>Before: an admin configures a model directly and the products that depend on it are invisible. After: the admin configures a product, with feature and model nested beneath in a visible chain.</desc><defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs><rect width="680" height="474" fill="#EAE5DB"/><rect x="24" y="24" width="632" height="426" fill="none" stroke="#1F1E1B" stroke-opacity="0.22" stroke-width="1"/><text x="52" y="60" font-family="ui-monospace,\'IBM Plex Mono\',monospace" font-size="11" letter-spacing="2.5" fill="#6F6E66">THE REFRAME</text><text x="52" y="95" font-family="Georgia,\'Times New Roman\',serif" font-size="28" fill="#1F1E1B">Configure the product, not the model<tspan fill="#B5482C">.</tspan></text><text x="52" y="121" font-family="Georgia,\'Times New Roman\',serif" font-style="italic" font-size="15" fill="#6F6E66">The mental model, inverted.</text><line x1="52" y1="140" x2="628" y2="140" stroke="#1F1E1B" stroke-opacity="0.16" stroke-width="1"/><text x="52" y="176" font-family="ui-monospace,\'IBM Plex Mono\',monospace" font-size="11" letter-spacing="2" fill="#6F6E66">BEFORE · MODEL-CENTRIC</text><text x="372" y="176" font-family="ui-monospace,\'IBM Plex Mono\',monospace" font-size="11" letter-spacing="2" fill="#B5482C">AFTER · PRODUCT-CENTRIC</text><rect x="86" y="198" width="180" height="48" rx="4" fill="#DDD8CC" stroke="#6F6E66" stroke-opacity="0.5" stroke-width="1"/><text x="176" y="222" text-anchor="middle" dominant-baseline="central" font-family="system-ui,-apple-system,sans-serif" font-size="16" font-weight="500" fill="#3A3A37">Model endpoint</text><line x1="176" y1="246" x2="176" y2="288" stroke="#6F6E66" stroke-opacity="0.5" stroke-width="1" stroke-dasharray="4 4" marker-end="url(#arr)"/><rect x="86" y="288" width="180" height="48" rx="4" fill="none" stroke="#6F6E66" stroke-opacity="0.45" stroke-width="1" stroke-dasharray="4 4"/><text x="176" y="312" text-anchor="middle" dominant-baseline="central" font-family="system-ui,-apple-system,sans-serif" font-size="16" fill="#6F6E66">Unknown impact</text><line x1="314" y1="267" x2="358" y2="267" stroke="#6F6E66" stroke-opacity="0.6" stroke-width="1" marker-end="url(#arr)"/><rect x="406" y="190" width="180" height="56" rx="4" fill="#F3DBCF" stroke="#B5482C" stroke-opacity="0.6" stroke-width="1"/><text x="496" y="212" text-anchor="middle" dominant-baseline="central" font-family="system-ui,-apple-system,sans-serif" font-size="16" font-weight="500" fill="#712B13">Product</text><text x="496" y="232" text-anchor="middle" dominant-baseline="central" font-family="system-ui,-apple-system,sans-serif" font-size="12" fill="#993C1D">Document Understanding</text><line x1="496" y1="246" x2="496" y2="284" stroke="#B5482C" stroke-opacity="0.7" stroke-width="1" marker-end="url(#arr)"/><rect x="406" y="284" width="180" height="48" rx="4" fill="#F3DBCF" stroke="#B5482C" stroke-opacity="0.6" stroke-width="1"/><text x="496" y="308" text-anchor="middle" dominant-baseline="central" font-family="system-ui,-apple-system,sans-serif" font-size="16" fill="#712B13">Feature</text><line x1="496" y1="332" x2="496" y2="370" stroke="#B5482C" stroke-opacity="0.7" stroke-width="1" marker-end="url(#arr)"/><rect x="406" y="370" width="180" height="48" rx="4" fill="#F3DBCF" stroke="#B5482C" stroke-opacity="0.6" stroke-width="1"/><text x="496" y="394" text-anchor="middle" dominant-baseline="central" font-family="system-ui,-apple-system,sans-serif" font-size="16" fill="#712B13">Model</text><text x="52" y="440" font-family="Georgia,\'Times New Roman\',serif" font-style="italic" font-size="15" fill="#6F6E66">Model first. Impact hidden.</text><text x="372" y="440" font-family="Georgia,\'Times New Roman\',serif" font-style="italic" font-size="15" fill="#6F6E66">Product first. Chain visible.</text></svg>'
            }} />

            <div style={{ marginTop: 36 }}>
              <AITLCarousel
              label="WALKTHROUGH · LLM CONFIGURATIONS"
              items={[
              {
                label: "02.1",
                ratio: "5760 / 4281",
                src: "/site/assets/aitl/llm-list.webp",
                note: "Configurations listed per Product → Feature, each carrying a live connection Status: Connected or Failed."
              },
              {
                label: "02.2",
                ratio: "5760 / 3240",
                src: "/site/assets/aitl/llm-view.webp",
                note: "View configuration: the per-feature model panel detailing folder, connector, connection and deployment."
              },
              {
                label: "02.3",
                ratio: "5760 / 3240",
                src: "/site/assets/aitl/llm-add.webp",
                note: "Add configuration: routing a feature’s models to the customer’s own subscriptions before activation."
              },
              {
                label: "02.4",
                ratio: "5760 / 4281",
                src: "/site/assets/aitl/llm-error.webp",
                note: "Mandatory connection testing: a failed probe blocks save and points to the exact model that needs attention."
              }]
              } />
            
            </div>
            {IMPACT.byollm}
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
              "Enterprises have to prove to auditors exactly what their AI did: every request, model, and outcome. The EU AI Act turned that into a legal deadline, and finance and healthcare were the first to ask.\n\nThe platform logged all of it, but admins could only see 60 days on screen, and there was no reliable way to get it out. Large exports failed silently, and licensing tiers quietly capped how much history a customer could pull.",
              append:
              <Body mt={16}>
                <strong>$1.99M across 97 deals</strong> was recorded as lost to insufficient auditing at the platform
                level - the gap this feature was scoped against.
              </Body>
            }}
            right={{
              tag: "THE DESIGN SOLUTION",
              body:
              "Rather than expose the backend's limits or ship a naive \u201CDownload\u201D button, I designed export as a visible, asynchronous lifecycle and turned those constraints into UI. Retention windows, quotas and deadlines became things a user could see and plan around, so the experience stayed predictable even when the backend wasn't."
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
                Don't hide the system's limits. Make them legible, and let the user plan around them.
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
              tag: "01 · ASYNCHRONOUS LIFECYCLE",
              lead: "A long export can't pretend to be instant.",
              body:
              "I designed a request \u2192 processing \u2192 ready \u2192 retry lifecycle with a persistent tracker, so a user can fire an export, leave, and get pulled back when it's done."
            },
            {
              tag: "02 · ENTITLEMENT-AWARE STATES",
              lead: "The UI knows what your license allows.",
              body:
              <React.Fragment>
                Retention and quotas vary by tier, so I surfaced them in context (<em>2 of 4 remaining</em>), and users
                meet a stated ceiling instead of a silent failure. Only exports carrying prompts and responses are
                metered; the compliance record itself stays uncapped.
              </React.Fragment>
            },
            {
              tag: "03 · SCOPING THE EXPORT",
              lead: "Filters decide whether the file survives.",
              body:
              "Every export has a size it can't exceed, and the honest place to handle that is before the request, not after. I made the filter set do that work (time, product, model, status, tenant, user), so the admin chooses what to leave out instead of the system deciding by failing."
            },
            {
              tag: "04 · EVERY FILE EXPLAINS ITSELF",
              lead: "An export has to hold up months after it was pulled.",
              body:
              "The exports list keeps who generated each file, when, and the exact filters behind it."
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
                src: "/site/assets/aitl/audit-landing.webp",
                note: "Audit landing: a 60-day overview of requests by product, model and status, with export entitlements shown up front."
              },
              {
                label: "03b",
                ratio: "1853 / 1038",
                src: "/site/assets/aitl/audit-initiate.webp",
                note: "Initiating an export: the filter settings carry through, and remaining monthly export quota is made explicit."
              },
              {
                label: "03c",
                ratio: "1853 / 1038",
                src: "/site/assets/aitl/audit-process.webp",
                note: "Processing: an asynchronous, non-blocking state. It may take time and the user is notified on completion."
              },
              {
                label: "03d",
                ratio: "1853 / 1038",
                src: "/site/assets/aitl/audit-exports.webp",
                note: "Export history: In progress / Completed / Failed per run, with retry and download, and clear retention rules."
              }]
              } />
            
            </div>
            {IMPACT.audit}
          </Sec>

          {/* ───────── 04 · AI GOVERNANCE ───────── */}
          <Sec
          id="governance"
          no="04"
          kicker="AI GOVERNANCE"
          title="Who gets to use AI">
          
            <Mission>
              AI policy, created and deployed where the rest of AI is managed.
            </Mission>
            <Body mt={20}>
              AI access policies used to live in Automation Ops, a separate product that handled every policy type.
              Creating one meant leaving Admin. Deploying one meant working through tenant, then user, then a policy per
              product. AI Governance was the first policy type to move into Admin, inside the AI Trust Layer, alongside
              everything else it governs. Create a policy, deploy it across the organization, tenants, groups or users,
              and see where it applies. One surface. Fewer steps.
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
                Start from the policy, then choose who it's for.
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
              tag: "01 · CLEAR SCOPE",
              lead: "Organization, tenant, group or user.",
              body:
              "A policy is created for the organization or a tenant. Admins then choose which groups or users it applies to, and only valid options are shown."
            },
            {
              tag: "02 · CONFLICTS, CAUGHT IN PLACE",
              lead: "The most specific policy wins.",
              body:
              "A user's policy overrides their group's or tenant's. If a group already has a policy, admins see it before saving."
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
                src: "/site/assets/aitl/gov-policy-list.webp",
                note: "Policies live in the AI Trust Layer. Each one is created as an Organization or Tenant policy."
              },
              {
                label: "04b",
                ratio: "4098 / 2931",
                src: "/site/assets/aitl/gov-new-policy.webp",
                note: "The new policy appears in the list. Deployment starts from its row."
              },
              {
                label: "04c",
                ratio: "1548 / 2931",
                src: "/site/assets/aitl/gov-deploy-tenant.webp",
                note: "Tenants, groups and users from one panel. The precedence rule stays in view."
              },
              {
                label: "04c.2",
                ratio: "1548 / 2931",
                src: "/site/assets/aitl/gov-deploy-org.webp",
                note: "An Organization policy can't target individual tenants, so the option isn't offered."
              },
              {
                label: "04d",
                ratio: "1548 / 2931",
                src: "/site/assets/aitl/gov-deploy-error.webp",
                note: "Conflicts are flagged before saving, not discovered later."
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
              All four surfaces (Context Grounding, LLM Configurations, Audit Export, and AI Governance) shipped to GA
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
                The work was making AI infrastructure, invisible by nature, feel visible,
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
              "Whether it's showing where an answer came from or what an export will and won't include, enterprise trust is built by making the system legible, not by hiding its machinery."
            },
            {
              tag: "02 · ON ADMIN UX",
              lead: "Constraints are a design material.",
              body:
              "The strongest moments here weren't new controls. They were turning backend limits, licensing tiers, and failure states into things a user could see and plan around."
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
