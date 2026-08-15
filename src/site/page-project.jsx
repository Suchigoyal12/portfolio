import React from "react";
import { CirclesOnGrid, MonoLabel, PageShell, WaveMotif, chromeHorizon, monoFamily, sansFamily, serifFamily } from "./shared.jsx";
import { AuditPipeline } from "./diagram-audit-pipeline.jsx";
import { CheckAccessSolutionSection } from "./diagrams-check-access.jsx";
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
    "A unified framework for centralising audit governance in enterprise automation platform, via Check Access @ UiPath.",
    tags: ["User Access", "Permissions Audit Pipeline", "Enterprise SaaS"],
    readingTime: 5,
    problem: {
      title: "The Cost of Decentralised Chaos",
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
      "Three principles drove every decision — from the data model up to the surface. Understand the access landscape first, systemise it into a coherent model, then design for the scale that enterprise complexity demands.",
      bullets: [
      "Understand. Map the access landscape to uncover gaps and hidden complexity.",
      "Systemise. Bring structure to roles and permissions through a coherent, unified model.",
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
      "One query returns a user's full access across the tenant — grouped by service, read top to bottom."
    },
    reflection: {
      title: "Reflection",
      body:
      "Working under enterprise constraint is a design discipline of its own. Each version (MVP → Private Preview → V1.5) was a negotiation between the ideal model and what could ship — and the framework only got sharper because of it.",
      pull: "Honestly, it was one of the best deliverables I saw this year and I really had little-to-no comments to add after it was shipped.",
      pullAttribution: "SORIN VISAN — PLATFORM PRODUCT MANAGER, UIPATH"
    }
  },
  "datasync-design-system": {
    no: "001",
    title: "Unified Design System",
    headline: ["UNIFIED", "DESIGN SYSTEM."],
    client: "DataSync Inc.",
    role: "Junior Product Designer",
    timeline: "'24 — '25",
    sector: "B2B / SaaS Enterprise",
    summary:
    "Migrated 45+ legacy sketch components to a unified Figma structure utilizing local variables. Reduced engineering QA kickbacks by roughly 15%.",
    tags: ["Design System", "Tokens", "Figma"],
    readingTime: 6,
    problem: {
      title: "The Situation",
      body: "DataSync had grown from a single product to four surfaces in eighteen months. Each surface had forked its own component set. Engineers were re-implementing the same modal, button, and table across four codebases — and design QA was catching the divergence months too late.",
      stats: [
      { k: "45+", v: "LEGACY COMPONENTS" },
      { k: "4", v: "PRODUCT SURFACES" },
      { k: "12", v: "MO. OF DRIFT" }]

    },
    approach: {
      title: "Approach",
      body: "I treated the system as a contract between design and engineering, not a finished product. Token migration came first — color, spacing, type — because tokens are the only thing both disciplines have to agree on every day. Components followed, audited surface by surface.",
      bullets: [
      "Audit every shipped component against its Figma source.",
      "Map tokens to local Figma variables before touching components.",
      "Re-build the 12 most-used components from scratch with variants.",
      "Document decisions inline so the system reads like a contract."]

    },
    solution: {
      title: "Solution",
      body: "A unified Figma file with local variables, paired with a Storybook surface that engineers could fork from. The system now has one source of truth per token, and the QA loop runs against the system instead of against eyeballs.",
      artifacts: [
      { label: "TOKENS", desc: "Color, spacing, type, radius — local variables." },
      { label: "COMPONENTS", desc: "12 atomic + 8 molecular, fully variant-mapped." },
      { label: "STORYBOOK", desc: "Read-only mirror, hosted alongside the Figma source." }]

    },
    outcomes: {
      title: "Outcomes",
      stats: [
      { k: "−15%", v: "ENG. QA KICKBACKS", note: "Q1 — Q3, '25" },
      { k: "12 → 1", v: "SOURCE OF TRUTH" },
      { k: "4×", v: "FASTER COMPONENT SHIP" }],

      body: "QA kickbacks measurably dropped in the quarters following rollout. The team uses the system without thinking about it — which is the highest compliment a system can earn."
    },
    reflection: {
      title: "Reflection",
      body: "Design systems are easy to start and hard to maintain. The hardest part wasn't building — it was teaching the team to amend the system instead of forking it. I'd spend more time, earlier, on governance rituals next round.",
      pull: "The beauty is in the utility."
    }
  },
  "datasync-onboarding": {
    no: "002",
    title: "Multi-Tenant Onboarding",
    headline: ["MULTI-TENANT", "ONBOARDING."],
    client: "DataSync Inc.",
    role: "Junior Product Designer",
    timeline: "'24",
    sector: "B2B / SaaS Enterprise",
    summary:
    "Redesigned the multi-tenant setup flow. Replaced a 6-step wizard with a contextual sidebar approach. Time-to-first-value improved.",
    tags: ["Onboarding", "Flows", "IA"],
    readingTime: 8,
    problem: {
      title: "The Situation",
      body: "New admins arriving at DataSync had to complete a 6-step wizard before they could see their data. The wizard locked the product in a modal. Admins dropped off at step 3 — the step where they had to invite their team without knowing what the product looked like yet.",
      stats: [
      { k: "6", v: "WIZARD STEPS" },
      { k: "Step 3", v: "DROP-OFF POINT" },
      { k: "0%", v: "PRODUCT VISIBLE" }]

    },
    approach: {
      title: "Approach",
      body: "I argued for inverting the relationship: show the product first, scaffold setup as a sidebar that runs alongside it. Setup becomes a conversation with the product rather than a gate in front of it.",
      bullets: [
      "Map every wizard step to a piece of the product UI it gates.",
      "Identify which steps are truly blocking vs. defer-able.",
      "Move blocking steps inline; move defer-able steps to a checklist.",
      "Keep the product visible at all times — context teaches faster than copy."]

    },
    solution: {
      title: "Solution",
      body: "A contextual setup sidebar that lives next to the product. Tasks complete as the admin clicks into product surfaces. The wizard is gone; the checklist remains, dismissable.",
      artifacts: [
      { label: "SIDEBAR", desc: "Persistent setup checklist, contextual to current page." },
      { label: "INLINE PROMPTS", desc: "Setup steps fire where they're relevant, not upfront." },
      { label: "EMPTY STATES", desc: "Empty product surfaces become teaching moments." }]

    },
    outcomes: {
      title: "Outcomes",
      stats: [
      { k: "↑", v: "TIME-TO-FIRST-VALUE" },
      { k: "−40%", v: "DROP-OFF AT STEP 3" },
      { k: "+22%", v: "TEAM INVITES SENT" }],

      body: "Time-to-first-value improved meaningfully — admins now see their data within 90 seconds. Team invites went up because admins invite once they understand what they're inviting people to."
    },
    reflection: {
      title: "Reflection",
      body: "Wizards feel safe to PMs because they're a sequence. But sequences punish exploration. The lesson: trust the product to teach itself when you give it room to.",
      pull: "Show the product. The product teaches."
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
                    <a className="evo-step" href="project-check-access-long-v2.html#v1">
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
                    <a className="evo-step" href="project-check-access-long-v2.html#v1">
                      <span className="evo-tip">Read in detail ↗</span>
                      <div className="evo-tile">
                        <img src="uploads/sentiment-icon.png" alt="sentiment" />
                      </div>
                      <div className="evo-label">Private Preview</div>
                      <div className="evo-desc">Enterprise admin insight.</div>
                    </a>

                    {/* Node 3 — Version 1.5 (key) */}
                    <a className="evo-step evo-step--key" href="project-check-access-long-v2.html#v15">
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
                    <a className="evo-step" href="project-check-access-long-v2.html#v2">
                      <span className="evo-tip">Read in detail ↗</span>
                      <div className="evo-tile">
                        <img src="uploads/container.png" alt="verified" />
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 24 }}>
              {data.solution.artifacts.map((a) =>
            <div key={a.label} style={{ borderTop: "1px solid var(--ink)", paddingTop: 14 }}>
                  <MonoLabel>{a.label}</MonoLabel>
                  <p style={{ fontFamily: sansFamily, fontSize: 14, lineHeight: 1.5, marginTop: 8, color: "var(--ink)" }}>
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
                — {data.reflection.pullAttribution}
              </MonoLabel>
          }
          </CSSection>

          {/* LONG VERSION CALLOUT — only on Check Access for now */}
          {projectId === "uipath-check-access" &&
        <section style={{ padding: "48px 64px", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", background: "var(--surface)" }}>
              <a
            href="project-check-access-long-v2.html"
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
            <NextProject currentId={projectId} />
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

const NEXT_HREF = {
  "uipath-check-access": "project-check-access.html",
  "datasync-design-system": "project-design-system.html",
  "datasync-onboarding": "project-onboarding.html"
};

// Map a next-project href to its Stage Manager card key so the bottom
// link can hand off to the parent stack instead of navigating the iframe.
const NEXT_CARD_KEY = {
  "project-check-access.html": "check-access",
  "project-check-access-long-v2.html": "check-access",
  "project-ai-trust-layer.html": "ai-trust",
  "admin-shell-public.html": "admin-shell",
  "project-admin-shell.html": "admin-shell",
  "project-release-notes.html": "release-notes"
};

function goToNextCard(e, href) {
  if (window.parent && window.parent !== window) {
    e.preventDefault();
    window.parent.postMessage({ type: "work:focus", key: NEXT_CARD_KEY[href] }, "*");
  }
}
function NextProject({ currentId }) {
  const OVERRIDE = {
    "uipath-check-access": { no: "002", title: "AI Trust Layer", href: "project-ai-trust-layer.html" }
  };
  let nextNo, nextTitle, nextHref;
  if (OVERRIDE[currentId]) {
    ({ no: nextNo, title: nextTitle, href: nextHref } = OVERRIDE[currentId]);
  } else {
    const ids = Object.keys(PROJECT_DATA);
    const idx = ids.indexOf(currentId);
    const next = ids[(idx + 1) % ids.length];
    nextNo = PROJECT_DATA[next].no;
    nextTitle = PROJECT_DATA[next].title;
    nextHref = NEXT_HREF[next];
  }
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
