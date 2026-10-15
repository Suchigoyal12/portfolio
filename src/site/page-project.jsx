import React from "react";
import { CirclesOnGrid, MonoLabel, PageShell, WaveMotif, chromeHorizon, monoFamily, sansFamily, serifFamily } from "./shared.jsx";
import { PROJECT_ROUTES } from "../routes.js";
import { AuditPipeline } from "./diagram-audit-pipeline.jsx";
import { CheckAccessSolutionSection } from "./diagrams-check-access.jsx";
import { dims } from "./image-dims.js";
// =============================================================
// PROJECT DETAIL — V5 layout (sticky left rail + magazine flow)
// Standard case study: Problem, Approach, Solution, Outcomes, Reflection
// =============================================================

const PROJECT_DATA = {
  "uipath-check-access": {
    no: "001",
    title: "Check Access",
    headline: ["UNIFYING", "FRAGMENTED", "PERMISSIONS"],
    client: "UiPath",
    role: "Product Designer\n(Lead V1.5→V2)",
    timeline: "2024-25",
    sector: "Enterprise SaaS",
    status: "Shipped (GA)",
    summary:
    "A unified framework for centralizing audit governance in enterprise automation platform, via Check Access @ UiPath.",
    tags: ["User Access", "Permissions Audit Pipeline", "Enterprise SaaS"],
    readingTime: 5,
    problem: {
      title: "The Cost of Decentralized Chaos",
      navLabel: "Why?",
      body:
      "Administrators were navigating 15+ disparate UiPath services across multiple tenant layers just to compile a single compliance report or verify basic access controls. This compounding cognitive load wasn't just an annoyance; it was an active security vulnerability and a massive drain on operational expenditure.",
      stats: [
      { k: "15+", v: "DISPARATE SERVICES" },
      { k: "MULTI", v: "TENANT LAYERS" },
      { k: "1", v: "COMPLIANCE REPORT" }]

    },
    approach: {
      title: "Core Principles",
      navLabel: "Approach",
      body:
      "Three principles drove every decision, from the data model up to the surface. Understand the access landscape first, systemize it into a coherent model, then design for the scale that enterprise complexity demands.",
      bullets: [
      "Understand. Map the access landscape to uncover gaps and hidden complexity.",
      "Systemize. Bring structure to roles and permissions through a coherent, unified model.",
      "Scale. Enable consistent access decisions as complexity grows."]

    },
    solution: {
      title: "The Check Access",
      navLabel: "Process",
      body:
      "By restructuring the core architecture, we established a definitive source of truth. The new Check Access feature reduced latency while bringing fragmented access data into a single, navigable interface. Centralized, explicit, and traceable.",
      artifacts: [
      { label: "DISCLOSE PROGRESSIVELY", desc: "Information density is managed through strategic revelation. Users are only presented with contextually relevant permissions, reducing cognitive load while maintaining deep access trails when needed." },
      { label: "TRACE ORIGINS", desc: "Every permission node connects back to its root policy. This lineage is visualized cleanly, allowing auditors to trace the exact policy granting access without hopping across scopes." },
      { label: "SCOPE SEPARATION", desc: "Audit logs are no longer raw data dumps. They are structured as narrative flows, making the technical 'who → what role → what scope → why' fully match admin's mental model of investigating." }],

      phases: [
      { tag: "MVP", desc: "Consolidating access visibility across services." },
      { tag: "PRIVATE PREVIEW", desc: "Enterprise admin insight." },
      { tag: "VERSION 1.5", desc: "Designing under constraint." }]

    },
    outcomes: {
      title: "Impact",
      headline: "What shipped",
      hero: ["~13", " services · Private Preview → GA in ", "4", " months"],
      note: "Built to move three numbers the team owned: adoption, audit-time, and access-related support load.",
      body:
      "One query returns a user's full access across the tenant, grouped by service, read top to bottom."
    },
    reflection: {
      title: "Reflection",
      body:
      "Working under enterprise constraint is a design discipline of its own. Each version (MVP → Private Preview → V1.5) was a negotiation between the ideal model and what could ship, and the framework only got sharper because of it.",
      pull: "Honestly, it was one of the best deliverables I saw this year and I really had little-to-no comments to add after it was shipped.",
      pullAttribution: "SORIN VISAN, PLATFORM PRODUCT MANAGER, UIPATH"
    }
  }
};

function ProjectDetailPage({ projectId }) {
  const data = PROJECT_DATA[projectId];
  const sections = [
  { id: "top", no: "00", label: "WHAT?" },
  { id: "problem", no: "01", label: data.problem.navLabel || data.problem.title },
  { id: "approach", no: "02", label: data.approach.navLabel || data.approach.title },
  { id: "solution", no: "03", label: data.solution.navLabel || data.solution.title },
  { id: "outcomes", no: "04", label: data.outcomes.title },
  { id: "reflection", no: "05", label: data.reflection.title }];

  const [currentSection, setCurrentSection] = React.useState("problem");

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
  ["CLIENT", data.client],
  ["ROLE", data.role],
  ["TIMELINE", data.timeline],
  ...(data.status ? [["STATUS", data.status]] : []),
  ["READ", `${data.readingTime} MIN`]];


  return (
    <PageShell
      active="works"
      navMode="rail"
      sections={sections}
      currentSection={currentSection}
      status={status}>
      
      {() =>
      <article style={{ padding: 0 }}>
          {/* HERO */}
          <section id="top" style={{ padding: "56px 64px 64px", borderBottom: "1px solid var(--line)" }}>
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
              <MonoLabel size={9} style={{ fontWeight: 400 }}>PROJECT 01</MonoLabel>
            </div>

            <h1
            style={{
              fontFamily: sansFamily,
              fontWeight: 800,
              fontSize: "clamp(56px, 8vw, 108px)",
              lineHeight: 0.9,
              letterSpacing: "-0.035em",
              margin: 0,
              color: "var(--ink)"
            }}>
            
              {data.headline.map((l, i) =>
            <div key={i}>
                  {l}
                  {i === data.headline.length - 1 && <span style={{ color: "var(--accent)" }}>.</span>}
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
              
                {data.summary.split(/(Check Access|UiPath)/g).map((part, i) =>
              part === "Check Access" || part === "UiPath" ?
              <strong key={i} style={{ fontWeight: 700 }}>{part}</strong> :
              part
              )}
              </div>
            </div>
            </div>
          </section>

          {/* PROJECT OVERVIEW — metadata */}
          <section className="project-overview" style={{ padding: "36px 64px", borderBottom: "1px solid var(--line)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, maxWidth: "var(--content-w)", margin: "0 auto" }}>
              {[
                ["CLIENT", "UiPath"],
                ["ROLE", "Product Designer (Lead V1.5\u2013V2)"],
                ["TIMELINE", "2024\u201325"],
                ["STATUS", "Shipped (GA)"],
                ["READ", "5 MIN"]
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

          {/* PROBLEM */}
          <CSSection
          id="problem" no="01" data={data.problem} hideBody={projectId === "uipath-check-access"}
          frameSlot={
          projectId === "uipath-check-access" && AuditPipeline ?
          <div style={{ marginTop: 24 }}>
            <AuditPipeline
            intro={
            <p
              style={{
                fontFamily: sansFamily,
                fontSize: 16,
                lineHeight: 1.55,
                marginTop: 0,
                color: "var(--ink)",
                maxWidth: "var(--copy-w)"
              }}>
              
                  {data.problem.body}
                </p>
            } />
          </div> :

          null}>

          </CSSection>

          {/* APPROACH */}
          <CSSection id="approach" no="02" data={data.approach}>
            <ul
            style={{
              margin: "32px 0 0",
              padding: 0,
              listStyle: "none",
              fontFamily: sansFamily,
              fontSize: 16,
              lineHeight: 1.6
            }}>
            
              {data.approach.bullets.map((b, i) =>
            <li
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "40px 1fr",
                gap: 16,
                padding: "14px 0",
                borderTop: "1px solid var(--line)",
                borderBottom: i === data.approach.bullets.length - 1 ? "1px solid var(--line)" : "none"
              }}>
              
                  <span style={{ fontFamily: monoFamily, fontSize: 11, color: "var(--muted)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{b}</span>
                </li>
            )}
            </ul>
          </CSSection>

          {/* SOLUTION (with circle-on-grid visual) */}
          <CSSection
          id="solution" no="03" data={data.solution}
          frameSlot={
          <React.Fragment>
            {projectId === "uipath-check-access" &&
          <div style={{ marginTop: 40 }}>
                {/* VERSION EVOLUTION BAND */}
                <MonoLabel style={{ display: "block", letterSpacing: "0.1em" }}>VERSION EVOLUTION</MonoLabel>

                <style>{`
                  .evo-card {
                    position: relative;
                    margin-top: 28px;
                  }
                  .evo-flow {
                    position: relative;
                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    align-items: start;
                  }
                  .evo-step {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    padding: 12px 4px 10px;
                    text-decoration: none;
                    color: inherit;
                    border-radius: 12px;
                    transition: transform 150ms ease, box-shadow 150ms ease;
                  }
                  .evo-step:hover { transform: translateY(-2px); cursor: pointer; }
                  .evo-tile {
                    width: 64px; height: 64px;
                    border-radius: 12px;
                    background: #F4F1EA;
                    border: 1px solid var(--line);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--ink);
                    transition: box-shadow 150ms ease;
                  }
                  .evo-tile svg { width: 24px; height: 24px; display: block; }
                  .evo-tile img { width: 24px; height: 24px; display: block; }
                  .evo-step:hover .evo-tile { box-shadow: 0 14px 22px -10px rgba(28,28,26,0.28); }
                  .evo-step--key { z-index: 2; }
                  .evo-step--key .evo-tile {
                    width: 76px; height: 76px;
                    background: var(--accent);
                    border: none;
                    border-radius: 14px;
                    color: var(--surface);
                    transform: rotate(-3deg);
                    box-shadow: 0 18px 32px -10px rgba(181,82,46,0.45);
                  }
                  .evo-step--key .evo-tile svg { width: 30px; height: 30px; }
                  .evo-step:hover.evo-step--key .evo-tile { box-shadow: 0 24px 38px -10px rgba(181,82,46,0.55); }
                  .evo-label {
                    margin-top: 20px;
                    font-family: ${JSON.stringify(monoFamily || "monospace")};
                    font-size: 9.5px;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: var(--muted);
                  }
                  .evo-step--key .evo-label { color: var(--accent); font-weight: 500; }
                  .evo-desc {
                    margin-top: 9px;
                    font-size: 12px;
                    line-height: 1.45;
                    color: var(--ink);
                    max-width: 16ch;
                  }
                  .evo-tip {
                    position: absolute;
                    bottom: calc(100% - 6px);
                    left: 50%;
                    transform: translate(-50%, 4px);
                    background: var(--accent);
                    color: #fff;
                    font-family: ${JSON.stringify(monoFamily || "monospace")};
                    font-size: 9.5px;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    white-space: nowrap;
                    padding: 5px 9px;
                    border-radius: 5px;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 150ms ease, transform 150ms ease;
                    z-index: 5;
                  }
                  .evo-tip::after {
                    content: "";
                    position: absolute;
                    top: 100%; left: 50%;
                    transform: translateX(-50%);
                    border: 4px solid transparent;
                    border-top-color: var(--accent);
                  }
                  .evo-step:hover .evo-tip { opacity: 1; transform: translate(-50%, 0); }
                  .evo-connector {
                    position: absolute;
                    top: 32px;
                    transform: translate(-50%, -50%);
                    width: max(0px, calc(25% - 90px));
                    height: 1px;
                    z-index: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                  .evo-connector::before {
                    content: "";
                    position: absolute;
                    left: 0; right: 0;
                    height: 1px;
                    background: repeating-linear-gradient(to right, color-mix(in oklch, var(--muted) 45%, transparent) 0 5px, transparent 5px 11px);
                  }
                  .evo-dot {
                    width: 7px; height: 7px;
                    border-radius: 50%;
                    background: color-mix(in oklch, var(--accent) 55%, var(--muted));
                    position: relative;
                    z-index: 1;
                  }
                `}</style>

                <div className="evo-card">
                  <div className="evo-flow">
                    <div className="evo-connector" style={{ left: "25%" }}><span className="evo-dot"></span></div>
                    <div className="evo-connector" style={{ left: "50%" }}><span className="evo-dot"></span></div>
                    <div className="evo-connector" style={{ left: "75%" }}><span className="evo-dot"></span></div>

                    {/* Node 1 — MVP */}
                    <a className="evo-step" href="/work/check-access/full#v1">
                      <span className="evo-tip">Read in detail ↗</span>
                      <div className="evo-tile">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                          <polyline points="10 17 15 12 10 7"></polyline>
                          <line x1="15" y1="12" x2="3" y2="12"></line>
                        </svg>
                      </div>
                      <div className="evo-label">MVP</div>
                      <div className="evo-desc">Consolidating access visibility across services.</div>
                    </a>

                    {/* Node 2 — Private Preview */}
                    <a className="evo-step" href="/work/check-access/full#v1">
                      <span className="evo-tip">Read in detail ↗</span>
                      <div className="evo-tile">
                        <img src="/uploads/sentiment-icon.png" {...dims("/uploads/sentiment-icon.png")} alt="" loading="lazy" />
                      </div>
                      <div className="evo-label">Private Preview</div>
                      <div className="evo-desc">Enterprise admin insight.</div>
                    </a>

                    {/* Node 3 — Version 1.5 (key) */}
                    <a className="evo-step evo-step--key" href="/work/check-access/full#v15">
                      <span className="evo-tip">Read in detail ↗</span>
                      <div className="evo-tile">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="3" y1="8" x2="11" y2="8"></line>
                          <polyline points="14 6 16 8 20 4"></polyline>
                          <line x1="3" y1="16" x2="11" y2="16"></line>
                          <line x1="15" y1="14" x2="20" y2="19"></line>
                          <line x1="20" y1="14" x2="15" y2="19"></line>
                        </svg>
                      </div>
                      <div className="evo-label">Version 1.5</div>
                      <div className="evo-desc">Designing under constraint.</div>
                    </a>

                    {/* Node 4 — The Solution (V2) */}
                    <a className="evo-step" href="/work/check-access/full#v2">
                      <span className="evo-tip">Read in detail ↗</span>
                      <div className="evo-tile">
                        <img src="/uploads/container.png" {...dims("/uploads/container.png")} alt="" loading="lazy" />
                      </div>
                      <div className="evo-label">The Solution</div>
                      <div className="evo-desc">Centralized, explicit, and traceable.</div>
                    </a>
                  </div>
                </div>
              </div>
          }

            {projectId === "uipath-check-access" && CheckAccessSolutionSection ?
          <div style={{ marginTop: 32 }}>
                <CheckAccessSolutionSection pillars={[
            { label: "Disclose Progressively", tag: "COGNITIVE LOAD" },
            { label: "Trace Origins", tag: "POLICY LINEAGE" },
            { label: "Scope Separation", tag: "NARRATIVE LOGS" }]
            } />
              </div> :

          <div
            style={{
              marginTop: 32,
              height: 280,
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid var(--line)"
            }}>
            
                <CirclesOnGrid width={760} height={280} seed={data.no === "001" ? 7 : data.no === "002" ? 13 : 21} accent="var(--accent)" />
              </div>
          }
          </React.Fragment>
          }>

            {/* The pillar descriptions, last in the section. Each one used to
                carry a mono label (DISCLOSE PROGRESSIVELY, …) above a rule —
                both gone: the pillar card above already names it, so the label
                said it twice, and the rule was separating a heading that no
                longer exists. This file renders Check Access only, so nothing
                else is affected. */}
            <div className="artifact-grid" style={{ display: "grid", gap: 16, marginTop: 28 }}>
              {data.solution.artifacts.map((a) =>
            <div key={a.label}>
                  <p style={{ fontFamily: sansFamily, fontSize: 14, lineHeight: 1.5, margin: 0, color: "var(--ink)" }}>
                    {a.desc}
                  </p>
                </div>
            )}
            </div>
          </CSSection>

          {/* OUTCOMES — dark band */}
          <section
          id="outcomes"
          style={{
            padding: "72px 64px",
            background: "var(--ink-panel)",
            color: "var(--ink-inverse)",
            borderTop: "1px solid var(--line)",
            borderBottom: "1px solid var(--line)"
          }}>
          
            <div style={{ display: "grid", gridTemplateColumns: "180px minmax(0, 1fr)", gap: 32, maxWidth: "var(--content-w)", margin: "0 auto" }}>
              <MonoLabel color="var(--muted)">SECTION 04<br />IMPACT</MonoLabel>
              <div>
                <h2
                style={{
                  fontFamily: sansFamily,
                  fontWeight: 800,
                  fontSize: data.outcomes.hero ? 48 : 56,
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                  margin: 0,
                  color: "var(--ink-inverse)"
                }}>
                
                  {data.outcomes.headline || "Measurable output"}<span style={{ color: "var(--accent)" }}>.</span>
                </h2>
                {data.outcomes.hero ?
              <React.Fragment>
                    <div style={{ fontFamily: serifFamily, fontWeight: 500, fontSize: 30, lineHeight: 1.4, marginTop: 32, color: "var(--ink-inverse)" }}>
                      <span style={{ color: "var(--accent)", fontSize: 76, lineHeight: 0.9, display: "inline-block", verticalAlign: "middle" }}>{data.outcomes.hero[0]}</span>
                      {data.outcomes.hero[1]}
                      <span style={{ color: "var(--accent)", fontSize: 76, lineHeight: 0.9, display: "inline-block", verticalAlign: "middle" }}>{data.outcomes.hero[2]}</span>
                      {data.outcomes.hero[3]}
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.08em", lineHeight: 1.7, color: "#7A786F", marginTop: 18, maxWidth: 560 }}>
                      {data.outcomes.note}
                    </div>
                  </React.Fragment> :

              <div style={{ display: "grid", gridTemplateColumns: data.outcomes.stats.length === 4 ? "1fr 1fr 1fr 1fr" : "1fr 1fr 1fr", gap: 24, marginTop: 32 }}>
                  {data.outcomes.stats.map((s, i) =>
                <div key={`${s.k}-${i}`} style={{ borderTop: `1px solid var(--ink-inverse)`, paddingTop: 16 }}>
                      <div style={{ fontFamily: serifFamily, fontSize: data.outcomes.stats.length === 4 ? 64 : 80, lineHeight: 1, color: "var(--accent)" }}>
                        {s.k}
                      </div>
                      <MonoLabel style={{ marginTop: 8, display: "block", color: "var(--ink-inverse)" }}>
                        {s.v}
                      </MonoLabel>
                      {s.note &&
                  <MonoLabel style={{ marginTop: 4, display: "block" }}>{s.note}</MonoLabel>
                  }
                    </div>
                )}
                </div>
              }
                <p style={{ fontFamily: sansFamily, fontSize: 16, lineHeight: 1.6, marginTop: 32, color: "var(--ink-inverse)", opacity: 0.85, maxWidth: "var(--copy-w-wide)" }}>
                  {data.outcomes.body}
                </p>
              </div>
            </div>
          </section>

          {/* REFLECTION + PULL QUOTE */}
          <CSSection id="reflection" no="05" data={data.reflection}>
            <blockquote
            style={{
              margin: "40px 0 0",
              padding: "32px 0",
              borderTop: "1px solid var(--ink)",
              borderBottom: "1px solid var(--ink)",
              fontFamily: serifFamily,
              fontStyle: "italic",
              fontSize: 36,
              lineHeight: 1.3,
              color: "var(--ink)"
            }}>
            
              "{data.reflection.pull}"
            </blockquote>
            {data.reflection.pullAttribution &&
          <MonoLabel style={{ marginTop: 16, display: "block" }}>
                {data.reflection.pullAttribution}
              </MonoLabel>
          }
          </CSSection>

          {/* LONG VERSION CALLOUT — only on Check Access for now */}
          {projectId === "uipath-check-access" &&
        <section style={{ padding: "48px 64px", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", background: "var(--surface)" }}>
              <a
            href="/work/check-access/full"
            style={{ textDecoration: "none", color: "var(--ink)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 32, maxWidth: "var(--content-w)", margin: "0 auto" }}>
            
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontFamily: sansFamily, fontWeight: 800, fontSize: 44, letterSpacing: "-0.02em", lineHeight: 1 }}>
                    Read the complete story<span style={{ color: "var(--accent)" }}>.</span>
                  </div>
                </div>
                <div style={{ fontFamily: monoFamily, fontSize: 32, color: "var(--accent)" }}>→</div>
              </a>
            </section>
        }

          {/* NEXT PROJECT */}
          <section style={{ padding: "56px 64px", borderTop: "1px solid var(--line)" }}>
            <NextProject />
          </section>
        </article>
      }
    </PageShell>);

}

function CSSection({ id, no, data, children, hideBody, frameSlot }) {
  return (
    <section id={id} style={{ padding: "72px 64px", borderBottom: "1px solid var(--line)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "180px minmax(0, 1fr)", gap: 32, maxWidth: "var(--content-w)", margin: "0 auto" }}>
        <MonoLabel>SECTION {no}<br />{(data.navLabel || data.title).toUpperCase()}</MonoLabel>
        <div>
          <h2
            style={{
              fontFamily: sansFamily,
              fontWeight: 800,
              fontSize: 48,
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              margin: 0,
              color: "var(--ink)"
            }}>
            
            {data.title}<span style={{ color: "var(--accent)" }}>.</span>
          </h2>
          {!hideBody &&
          <p
            style={{
              fontFamily: sansFamily,
              fontSize: 16,
              lineHeight: 1.55,
              marginTop: 20,
              color: "var(--ink)",
              maxWidth: "var(--copy-w)"
            }}>
            
            {data.body}
          </p>
          }
          {/* Diagrams / illustrations live in the same column as the heading —
               same left edge, same max-width as the text above them. */}
          {frameSlot}
          {children}
        </div>
      </div>
    </section>);

}

// Map a next-project href to its Stage Manager card key so the bottom
// link can hand off to the parent stack instead of navigating the iframe.
//
// Derived from the route table rather than hand-written. The old version was a
// list of filenames maintained by hand, and it had drifted: it carried entries
// for the long Check Access page, which posts its own message and is not a
// card, and for the unpublished detailed Admin Shell case study, which has no
// route at all. Four cards, four entries, and it can no longer disagree with
// the hrefs it is looking up.
const NEXT_CARD_KEY = Object.fromEntries(PROJECT_ROUTES.map((r) => [r.path, r.key]));

function goToNextCard(e, href) {
  if (window.parent && window.parent !== window) {
    e.preventDefault();
    window.parent.postMessage({ type: "work:focus", key: NEXT_CARD_KEY[href] }, "*");
  }
}
// Check Access is the only case study rendered by this page, and its next
// project is AI Trust Layer. The other case studies carry their own pages.
function NextProject() {
  const nextNo = "002";
  const nextTitle = "AI Trust Layer";
  const nextHref = "/work/ai-trust-layer";
  return (
    <a
      href={nextHref}
      onClick={(e) => goToNextCard(e, nextHref)}
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
        <MonoLabel>NEXT PROJECT / {nextNo}</MonoLabel>
        <div
          style={{
            fontFamily: sansFamily,
            fontWeight: 800,
            fontSize: 64,
            lineHeight: 0.95,
            letterSpacing: "-0.025em",
            marginTop: 12
          }}>
          
          {nextTitle.toUpperCase()}<span style={{ color: "var(--accent)" }}>.</span>
        </div>
      </div>
      <div style={{ fontFamily: monoFamily, fontSize: 24, color: "var(--accent)" }}>→</div>
    </a>);

}

export { PROJECT_DATA, ProjectDetailPage, goToNextCard };
