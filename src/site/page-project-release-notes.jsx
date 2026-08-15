import React from "react";
import { DEFAULT_TWEAKS, MonoLabel, SITE, ScrollProgress, WaveMotif, chromeHorizon, monoFamily, sansFamily, serifFamily, useTheme } from "./shared.jsx";
// =============================================================
// PROJECT DETAIL — RELEASE COMMUNICATION SYSTEM ("Release Notes")
// Scrollytelling: the left narrative PINS (sticky) while the
// right-column frames scroll past.
//   · Context  → Before          (frame holds)
//   · Problem  → Before          (frame holds)
//   · Solution → After / Widget / Popup, with surface cards
//                1 / 2 / 3 highlighting in sync as each scrolls in.
// Right-column visuals are the supplied SVG frames, used as-is.
// Header (hero) + footer follow the shared project-page styling.
// =============================================================

const RN = {
  eyebrow: "PRODUCT DESIGN CASE STUDY",
  no: "004",
  client: "UiPath",
  headline: ["RELEASE NOTES,", "beyond the doc dive"],
  presence: "walking you through case · 004",
  summary:
  "Bringing release communication out of buried docs and into three connected, in-product surfaces — calibrated by importance.",
  meta: [
  ["ROLE", "Product Designer"],
  ["TIMELINE", "1.5 months"],
  ["DOMAIN", "Release Communication"],
  ["PLATFORM", "UiPath Automation Cloud"]]

};

const STEEL = "#C5D8E4";

const FRAMES = {
  before: "/site/assets/release-notes/before.png",
  after: "/site/assets/release-notes/after.png",
  widget: "/site/assets/release-notes/widget.png",
  popup: "/site/assets/release-notes/popup-full.png"
};

// Matched to the baked-in pills on the supplied frames: those measure 2.468%
// of image width tall; an overlay pill is 2× its font-size tall, so 1.234cqw
// makes the After overlay pills identical in size to the Before raster pills.
const ANNO_CQW = 1.234;

// Scrollytelling row: sticky left + scrolling right
const rnRow = {
  display: "grid",
  gridTemplateColumns: "minmax(300px, 380px) minmax(0, 1fr)",
  gap: 56,
  alignItems: "start"
};
const rnSticky = { position: "sticky", top: 40, alignSelf: "start" };

// ── primitives ────────────────────────────────────────────────
function SectionPill({ children }) {
  return (
    <span
      style={{
        display: "inline-block",
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: 999,
        padding: "7px 15px",
        fontFamily: sansFamily,
        fontWeight: 600,
        fontSize: 13,
        color: "var(--ink)"
      }}>
      
      {children}
    </span>);

}

function NarrativeBody({ children, max = 384, mt = 18 }) {
  return (
    <p
      style={{
        fontFamily: sansFamily,
        fontSize: 16,
        lineHeight: 1.62,
        margin: `${mt}px 0 0`,
        color: "var(--ink)",
        maxWidth: max
      }}>
      
      {children}
    </p>);

}

function InfoBox({ label, tint, children }) {
  return (
    <div
      style={{
        marginTop: 24,
        background: tint || "color-mix(in srgb, #fff 55%, transparent)",
        border: "1px solid var(--line)",
        borderRadius: 16,
        padding: "20px 22px",
        maxWidth: 412
      }}>
      
      <MonoLabel size={10} style={{ display: "block", marginBottom: 10 }}>
        {label}
      </MonoLabel>
      {children}
    </div>);

}

function DiveCrumbs({ items }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 7, marginTop: 4 }}>
      {items.map((it, i) => {
        const solid = i === items.length - 1;
        return (
          <React.Fragment key={it}>
            <span
              style={{
                fontFamily: sansFamily,
                fontSize: 11.5,
                fontWeight: 600,
                padding: "5px 9px",
                borderRadius: 6,
                background: solid ? "var(--accent)" : "color-mix(in srgb, var(--accent) 9%, transparent)",
                color: solid ? "#fff" : "var(--ink)",
                whiteSpace: "nowrap"
              }}>
              
              {it}
            </span>
            {!solid && <span style={{ color: "var(--muted)", fontSize: 11 }}>›</span>}
          </React.Fragment>);

      })}
    </div>);

}

// surface card — highlights when its frame is the active one
function SurfaceCard({ n, title, sub, tag, active }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: active ? "color-mix(in srgb, var(--accent) 8%, var(--surface))" : "var(--surface)",
        border: active ? "1px solid var(--accent)" : "1px solid var(--line)",
        borderRadius: 14,
        padding: "16px 18px",
        transition: "background 220ms ease, border-color 220ms ease, box-shadow 220ms ease",
        boxShadow: active ? "0 10px 26px -20px var(--accent)" : "none"
      }}>
      
      <div
        style={{
          width: 28,
          height: 28,
          flexShrink: 0,
          borderRadius: 999,
          background: active ? "var(--accent)" : "color-mix(in srgb, var(--ink) 6%, transparent)",
          color: active ? "#fff" : "var(--ink)",
          display: "grid",
          placeItems: "center",
          fontFamily: monoFamily,
          fontSize: 12,
          transition: "background 220ms ease, color 220ms ease"
        }}>
        
        {n}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: sansFamily, fontWeight: 700, fontSize: 16, lineHeight: 1.25, color: "var(--ink)" }}>
          {title}
        </div>
        {sub &&
        <div style={{ fontFamily: sansFamily, fontSize: 13, color: "var(--muted)", marginTop: 3 }}>{sub}</div>
        }
      </div>
      {tag &&
      <MonoLabel size={9} color={active ? "var(--accent)" : "var(--muted)"}>
        {tag}
      </MonoLabel>
      }
    </div>);

}

// floating annotation pill — matches the baked-in pill style on the
// supplied frames (solid accent, white dot, white label). Font-size is in
// cqw so it tracks the image width identically to the baked-in raster pills.
function Anno({ children, square, ...pos }) {
  const place = {};
  ["left", "right", "top", "bottom"].forEach((k) => {
    if (pos[k] !== undefined) place[k] = pos[k];
  });
  return (
    <span
      style={{
        position: "absolute",
        ...place,
        display: "inline-flex",
        alignItems: "center",
        gap: "0.6em",
        background: "var(--accent)",
        color: "#fff",
        borderRadius: 999,
        padding: "0.5em 0.9em",
        fontFamily: sansFamily,
        fontSize: ANNO_CQW + "cqw",
        fontWeight: 600,
        lineHeight: 1,
        whiteSpace: "nowrap",
        boxShadow: "0 0.15em 0.6em -0.1em color-mix(in srgb, var(--accent) 55%, transparent)",
        zIndex: 2
      }}>
      
      <span
        style={{ width: "0.62em", height: "0.62em", borderRadius: square ? "0.14em" : 999, background: "#fff", opacity: 0.95, flexShrink: 0 }} />
      
      {children}
    </span>);

}

// the bare image + its overlay pills. The wrapper is the container-query
// context, so Anno's cqw font-size resolves against the image's display width.
function Frame({ src, alt, refEl, children }) {
  return (
    <div
      ref={refEl}
      style={{
        position: "relative",
        width: "100%",
        containerType: "inline-size",
        borderRadius: 10,
        overflow: "hidden",
        border: "1px solid var(--line)",
        background: "#fff"
      }}>
      
      <img src={src} alt={alt} loading="lazy" style={{ display: "block", width: "100%", height: "auto" }} />
      {children}
    </div>);

}

// framed card: heading + subtext, with the image placed inside.
function PreviewPanel({ heading, subtitle, tag, refEl, children }) {
  return (
    <figure
      style={{
        margin: 0,
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 18px 44px -34px rgba(20,20,18,.5)"
      }}>
      
      <figcaption
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          padding: "16px 20px",
          borderBottom: "1px solid var(--line)"
        }}>
        
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--accent)", flexShrink: 0 }} />
            <span style={{ fontFamily: sansFamily, fontWeight: 700, fontSize: 16, color: "var(--ink)", lineHeight: 1.2 }}>
              {heading}
            </span>
          </div>
          {subtitle &&
          <p
            style={{
              margin: "8px 0 0",
              paddingLeft: 17,
              fontFamily: sansFamily,
              fontSize: 13.5,
              lineHeight: 1.5,
              color: "var(--muted)",
              maxWidth: 560
            }}>
            
              {subtitle}
            </p>
          }
        </div>
        {tag && <MonoLabel size={10} style={{ whiteSpace: "nowrap", paddingTop: 2 }}>{tag}</MonoLabel>}
      </figcaption>
      <div style={{ padding: 18 }} ref={refEl}>
        {children}
      </div>
    </figure>);

}

// narrative blocks ────────────────────────────────────────────
const ser = (t) =>
<span style={{ fontFamily: serifFamily, fontStyle: "italic", fontWeight: 500 }}>{t}</span>;


function ContextBlock() {
  return (
    <div>
      <SectionPill>Context</SectionPill>
      <NarrativeBody mt={24}>
        Release notes existed — buried eight hops deep, dumped as bulk content per product line. We wanted to bring
        release info <strong style={{ fontWeight: 700 }}>into the product</strong> instead.
      </NarrativeBody>
      <InfoBox label="RELEASE NOTES?">
        <p style={{ fontFamily: sansFamily, fontSize: 14, lineHeight: 1.55, margin: 0, color: "var(--ink)" }}>
          Product documentation that <strong style={{ fontWeight: 700 }}>communicates changes</strong> in the new
          version of the product. They mention new features, bug fixes, and improvements that affect user's
          experience.
        </p>
        <MonoLabel size={10} style={{ display: "block", margin: "16px 0 10px" }}>
          THE DIVE
        </MonoLabel>
        <DiveCrumbs
          items={["Help", "Documentation", "Release Notes", "Platform", "Product", "Specific Product", "Timeline", "Bulk content"]} />
        
      </InfoBox>
    </div>);

}

function ProblemBlock() {
  return (
    <div>
      <SectionPill>Problem Insight</SectionPill>
      <h2
        style={{
          fontFamily: sansFamily,
          fontWeight: 400,
          fontSize: 16,
          lineHeight: 1.62,
          letterSpacing: "normal",
          margin: "18px 0 0",
          color: "var(--ink)",
          maxWidth: 412
        }}>
        
        Users don't think in "documentation versions." They think in <span style={{ fontFamily: serifFamily, fontStyle: "italic", fontWeight: 500, letterSpacing: "0px", color: "rgb(181, 82, 46)", fontSize: "20px" }}> what's new for me, today?</span>
      </h2>
      <p
        style={{
          fontFamily: serifFamily,
          fontStyle: "italic",
          fontSize: 19,
          lineHeight: 1.45,
          color: "var(--muted)",
          margin: "22px 0 0",
          maxWidth: 412
        }}>
        
        "At this point, it feels like every update creates confusion because communication comes too late or not at
        all."
      </p>
      <div
        style={{
          textAlign: "right",
          maxWidth: 412,
          marginTop: 8,
          fontFamily: monoFamily,
          fontSize: 11,
          letterSpacing: "0.06em",
          color: "var(--muted)"
        }}>
        
        — UiPath Customer
      </div>
      <InfoBox label="THE PIVOT" tint={"color-mix(in srgb, " + STEEL + " 45%, transparent)"}>
        <p style={{ fontFamily: sansFamily, fontSize: 14, lineHeight: 1.55, margin: 0, color: "var(--ink)" }}>
          From "one docs page per product" to three connected in-product surfaces — calibrated by importance.
        </p>
      </InfoBox>
    </div>);

}

function SolutionBlock({ active }) {
  return (
    <div>
      <SectionPill>The Solution</SectionPill>
      <h2
        style={{
          fontFamily: sansFamily,
          fontWeight: 800,
          fontSize: 40,
          lineHeight: 1.03,
          letterSpacing: "-0.025em",
          margin: "18px 0 0",
          color: "var(--ink)"
        }}>
        
        Three<br />connected surfaces<br />
        {ser("calibrated by importance")}.
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 26 }}>
        <SurfaceCard n="1" title="Restructured Docs — Release Notes" active={active === 0} />
        <SurfaceCard n="2" title="Announcement Widget" active={active === 1} />
        <SurfaceCard n="3" title="Critical-update Popup" active={active === 2} />
      </div>
    </div>);

}

// =============================================================
// PAGE
// =============================================================
function ReleaseNotesProjectPage() {
  const tweaks = DEFAULT_TWEAKS;
  useTheme(tweaks);
  const owner = tweaks.ownerName || SITE.owner;

  // active solution frame (0 = after, 1 = widget, 2 = popup)
  const f0 = React.useRef(null);
  const f1 = React.useRef(null);
  const f2 = React.useRef(null);
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight / 2;
      const refs = [f0, f1, f2];
      let best = 0;
      let bestDist = Infinity;
      refs.forEach((r, i) => {
        if (!r.current) return;
        const rect = r.current.getBoundingClientRect();
        const c = rect.top + rect.height / 2;
        const d = Math.abs(c - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "100vh" }}>
      <ScrollProgress />
      <main>
        {/* ───────── HERO (shared project header style) ───────── */}
        <section style={{ padding: "52px 64px 58px", borderBottom: "1px solid var(--line)" }}>
          <div style={{ maxWidth: "var(--content-w)", margin: "0 auto" }}>
          <div className="hero-topbar" style={{ display: "flex", justifyContent: "space-between", marginBottom: 30, ...chromeHorizon(52) }}>
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
            <MonoLabel size={9} style={{ fontWeight: 400 }}>PROJECT 04</MonoLabel>
          </div>

          <h1
            style={{
              fontFamily: sansFamily,
              fontWeight: 800,
              fontSize: "clamp(46px, 6.6vw, 92px)",
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
              margin: 0,
              color: "var(--ink)"
            }}>
            
            {RN.headline.map((l, i) =>
            <div key={i} style={i === 1 ? { fontFamily: serifFamily, fontStyle: "italic", fontWeight: 500, letterSpacing: "-0.01em" } : null}>
                {l}
                {i === RN.headline.length - 1 && <span style={{ color: "var(--accent)" }}>.</span>}
              </div>
            )}
          </h1>

          <div
            style={{
              marginTop: 36,
              display: "flex",
              alignItems: "center",
              gap: 24,
              paddingTop: 24,
              borderTop: "1px solid var(--line)",
              flexWrap: "wrap"
            }}>
            
            <WaveMotif color="var(--accent)" width={140} height={36} />
            <div
              style={{
                fontFamily: serifFamily,
                fontStyle: "italic",
                fontSize: 22,
                color: "var(--ink)",
                maxWidth: "var(--copy-w)"
              }}>
              
              {RN.summary}
            </div>
          </div>

          <div style={{ marginTop: 34, display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}>
            {RN.meta.map(([k, v]) =>
            <div key={k} style={{ borderTop: "1px solid var(--ink)", paddingTop: 12 }}>
                <MonoLabel>{k}</MonoLabel>
                <div style={{ fontFamily: sansFamily, fontWeight: 600, fontSize: 16, marginTop: 6, color: "var(--ink)" }}>
                  {v}
                </div>
              </div>
            )}
          </div>
          </div>
        </section>

        {/* ───────── SCROLLYTELLING ───────── */}
        <section style={{ padding: "60px 64px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(80px, 12vh, 160px)", maxWidth: "var(--content-w)", margin: "0 auto" }}>
            {/* CONTEXT + PROBLEM — one Before frame stays alongside both */}
            <div className="rn-row" style={rnRow}>
              <div style={{ display: "flex", flexDirection: "column", gap: 80 }}>
                <ContextBlock />
                <ProblemBlock />
              </div>
              <div className="rn-sticky" style={rnSticky}>
                <PreviewPanel
                  heading="The original structure"
                  subtitle="UiPath Docs, 2023 — release docs lived one bulk page deep per product line, behind extensive navigation."
                  tag="BEFORE">
                  
                  <Frame src={FRAMES.before} alt="Before · 2022 — the old documentation portal" />
                </PreviewPanel>
              </div>
            </div>

            {/* SOLUTION — After / Widget / Popup scroll; cards 1·2·3 highlight in sync */}
            <div className="rn-row" style={rnRow}>
              <div className="rn-sticky" style={rnSticky}>
                <SolutionBlock active={active} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "13vh", paddingBottom: "40vh" }}>
                <PreviewPanel
                  refEl={f0}
                  heading="Restructured documentation"
                  subtitle="Same page, now timeline-first. Categorised sidebar, single-scroll read, easy scan, scope toggle, update type filters."
                  tag="AFTER">
                  
                  <Frame src={FRAMES.after} alt="After — restructured documentation">
                    <Anno right="3%" top="8.5%" square>Scope switch</Anno>
                    <Anno left="2%" top="18.5%" square>Improved findability</Anno>
                    <Anno left="2%" top="41%" square>Update-type filter</Anno>
                    <Anno right="2%" top="18.5%" square>Integrated Platform overview &amp; Products</Anno>
                    <Anno left="33%" top="61%" square>One scroll read</Anno>
                    <Anno right="2%" top="55%" square>Categorised release notes in sub-sections</Anno>
                  </Frame>
                </PreviewPanel>
                <PreviewPanel
                  refEl={f1}
                  heading="Announcement widget"
                  subtitle="A 'What's new' entry in the product header — two clicks to the latest release relevant to this service."
                  tag="IN-PRODUCT">
                  
                  <Frame src={FRAMES.widget + '?v=2'} alt="In-product announcement widget">
                    <Anno right="12%" top="0.5%" square>Header pill</Anno>
                    <Anno right="4%" top="14%">Scoped to service</Anno>
                    <Anno left="52%" bottom="9%" square>Read more → docs</Anno>
                  </Frame>
                </PreviewPanel>
                <PreviewPanel
                  refEl={f2}
                  heading="Critical-update popup"
                  subtitle="The highest-impact releases surface as a dismissable dialog inside the affected service, at the moment of work."
                  tag="SERVICE-SCOPED">
                  
                  <Frame src={FRAMES.popup} alt="Critical-update popup">
                    <Anno left="20%" top="21%">Service-scoped</Anno>
                    <Anno right="30%" top="12%" square>Dismissable</Anno>
                  </Frame>
                </PreviewPanel>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── NEXT PROJECT (shared footer style) ───────── */}
        <section style={{ padding: "56px 64px", borderTop: "1px solid var(--line)" }}>
          <a
            href="project-check-access.html"
            onClick={(e) => { if (window.parent && window.parent !== window) { e.preventDefault(); window.parent.postMessage({ type: "work:focus", key: "check-access" }, "*"); } }}
            style={{
              textDecoration: "none",
              color: "var(--ink)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 20,
              maxWidth: "var(--content-w)",
              margin: "0 auto"
            }}>
            
            <div>
              <MonoLabel>NEXT PROJECT / 001</MonoLabel>
              <div
                style={{
                  fontFamily: sansFamily,
                  fontWeight: 800,
                  fontSize: 64,
                  lineHeight: 0.95,
                  letterSpacing: "-0.025em",
                  marginTop: 12
                }}>
                
                UNIFYING FRAGMENTED PERMISSIONS<span style={{ color: "var(--accent)" }}>.</span>
              </div>
            </div>
            <div style={{ fontFamily: monoFamily, fontSize: 24, color: "var(--accent)" }}>→</div>
          </a>
        </section>

      </main>
    </div>);

}

export { ReleaseNotesProjectPage };
