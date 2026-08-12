/* global React */
// =============================================================
// HOME — V2 four-card grid (Context / Product Designer / Work / Builds)
// =============================================================

const HOME_CONTENT = {
  card1: {
    tone: "ink",
    topL: ["EXP: 2 YEARS", "EDU: B.DES, IIT GUWAHATI"],
    topR: ["FRIDAY 11:05 PM", "BANGALORE, INDIA"],
    footL: "HONESTY IN DESIGN",
    footR: "NO. 001",
    headline: ["CONTEXT", "MATTERS"],
    headlineMode: "upper",
    href: "about.html",
    body: "card1",
  },
  card2: {
    tone: "paper",
    topL: ["DOC: PORTFOLIO '26", "LOGIC & SYSTEMS"],
    topR: ["LINKEDIN \u2197", "RESUME \u2197", "CONTACT \u2197"],
    footL: "DESIGN TECHNOLOGIST",
    footLAfter: "OPERATING AS A",
    footR: "AVAILABLE '26",
    headline: ["PRODUCT", "DESIGNER"],
    headlineMode: "upper",
    href: "process.html",
    body: "card2",
  },
  card3: {
    tone: "paper",
    topL: ["EMPLOYER: UIPATH", "ROLE: ASSOCIATE PRODUCT", "DESIGNER"],
    topR: ["TIMELINE: '23-'25", "B2B / SAAS", "ENTERPRISE"],
    footL: "MEASURABLE OUTPUT",
    footR: "QUALITY ASSURED",
    headline: ["THE ACTUAL", "WORK"],
    headlineMode: "upper",
    href: "works.html",
    body: "card3",
  },
  card4: {
    tone: "paper",
    topL: ["PLAYGROUND", "AGENTIC BUILDS"],
    topR: ["ENV: UNSTABLE", "LIVE / UNPOLISHED"],
    footL: "ACTIVE NODES",
    footR: "BETA STATE",
    headline: ["unstable", "BUILDS"],
    headlineMode: "mixed",
    href: "experiments.html",
    body: "card4",
  },
};

const CARD1 = {
  situation:
    "One SaaS tenure. Maximum focus. 18 months of deep, unglamorous, high-impact product work. I didn't design concept apps; I maintained a live B2B Admin ecosystem.",
  focus: [
    "Enterprise Governance Workflows",
    "AI Governance Optimisation",
    "Admin Shell & Component Library",
  ],
  tooling: [
    "FIGMA",
    "FRAMER",
    "ADOBE SUITE",
    "CLAUDE CODE",
    "CLAUDE DESIGN",
    "GOOGLE AI STUDIO",
    "GOOGLE STITCH",
    "ANTIGRAVITY",
  ],
};

const CARD3 = {
  artifacts: [
    {
      label: "/ ARTIFACT 01: CHECK ACCESS",
      body: "Migrated 45+ legacy sketch components to a unified Figma structure utilizing local variables. Reduced engineering QA kickbacks by roughly 15%.",
    },
    {
      label: "/ ARTIFACT 02: AI TRUST LAYER",
      body: "Redesigned the multi-tenant setup flow. Replaced a 6-step wizard with a contextual sidebar approach. Time-to-first-value improved.",
    },
    {
      label: "/ ARTIFACT 03: RELEASE COMMUNICATION SYSTEM",
      body: "Redesigned the multi-tenant setup flow. Replaced a 6-step wizard with a contextual sidebar approach. Time-to-first-value improved.",
    },
    {
      label: "/ PHILOSOPHY",
      body: "Complexity is not the enemy, ambiguity is.",
    },
  ],
};

const CARD4 = {
  items: [
    { label: "/ ANTIGRAVITY:", name: "001_AUDIO_REACTIVE_TYPE.EXE", status: "LIVE \u2197" },
    { label: "/ GOOGLE STITCH:", name: "003_ABC.EXE", status: "LIVE \u2197" },
    { label: "/ GOOGLE STITCH:", name: "002_MICRO_SAAS_LOGIC.EXE", status: "LIVE \u2197" },
  ],
  blurb:
    "A repository of AI-assisted prototypes and functional experiments built for speed.",
};

// ---------------------------------------------------------------
// Palettes
// ---------------------------------------------------------------
function palette(tone) {
  if (tone === "ink") {
    return { bg: "#0E0E0C", fg: "#F2EEE6", muted: "#7A786F", line: "#26241F", chipLine: "#3A3833" };
  }
  return { bg: "#FBFAF6", fg: "#111110", muted: "#7A786F", line: "#D9D4C8", chipLine: "#C8C2B3" };
}

// ---------------------------------------------------------------
// Card chrome
// ---------------------------------------------------------------
function MetaRow({ left, right, fg, muted }) {
  const style = {
    fontFamily: window.monoFamily,
    fontSize: 10,
    letterSpacing: "0.08em",
    lineHeight: 1.6,
    textTransform: "uppercase",
    color: fg,
  };
  return (
    <div className="hc-meta">
      <div style={style}>
        {left.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
      <div style={{ ...style, textAlign: "right" }}>
        {right.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
}

function FootRow({ left, leftAfter, right, fg, accentFg }) {
  return (
    <div
      className="hc-foot"
      style={{
        fontFamily: window.monoFamily,
        fontSize: 10,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: fg,
      }}
    >
      <span>
        <span style={{ color: accentFg, fontWeight: 600 }}>{left}</span>
        {leftAfter ? <span style={{ marginLeft: 6 }}>{leftAfter}</span> : null}
      </span>
      <span>{right}</span>
    </div>
  );
}

function Headline({ lines, mode, fg, accent }) {
  return (
    <div className="hc-headline">
      <div className="hc-headline-text">
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              fontFamily: window.sansFamily,
              fontWeight: mode === "mixed" && i === 0 ? 600 : 800,
              fontStyle: "normal",
              textTransform: mode === "mixed" && i === 0 ? "lowercase" : "uppercase",
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
              color: fg,
            }}
          >
            {l}
          </div>
        ))}
      </div>
      <window.Stamp color={accent} size={26} />
    </div>
  );
}

function SectionLabel({ children, color }) {
  return (
    <div
      style={{
        fontFamily: window.monoFamily,
        fontSize: 10,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color,
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------
// Card bodies
// ---------------------------------------------------------------
function Card1Body({ p }) {
  return (
    <div className="hc-body">
      <div>
        <SectionLabel color={p.muted}>/ THE SITUATION</SectionLabel>
        <p className="hc-p" style={{ color: p.fg }}>
          {CARD1.situation}
        </p>
      </div>
      <div>
        <SectionLabel color={p.muted}>/ FOCUS AREAS</SectionLabel>
        <div style={{ fontFamily: window.sansFamily, fontSize: 13, lineHeight: 1.65, color: p.fg }}>
          {CARD1.focus.map((x) => (
            <div key={x}>{x}</div>
          ))}
        </div>
      </div>
      <div>
        <SectionLabel color={p.muted}>/ TOOLING</SectionLabel>
        <div className="hc-chips">
          {CARD1.tooling.map((x) => (
            <span
              key={x}
              className="hc-chip"
              style={{
                border: `1px solid ${p.chipLine}`,
                color: p.fg,
              }}
            >
              {x}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card2Body({ p }) {
  return (
    <div className="hc-body hc-body--center">
      <window.WaveMotif color={p.fg} width={200} height={48} />
      <div
        style={{
          fontFamily: window.sansFamily,
          fontWeight: 500,
          letterSpacing: "0.5em",
          fontSize: 18,
          color: p.fg,
          paddingLeft: "0.5em",
          marginTop: 18,
        }}
      >
        SUCHI
      </div>
    </div>
  );
}

function Card3Body({ p }) {
  return (
    <div className="hc-body">
      {CARD3.artifacts.map((a, i) => (
        <div key={i}>
          <SectionLabel color={p.muted}>{a.label}</SectionLabel>
          <p className="hc-p" style={{ color: p.fg }}>
            {a.body}
          </p>
        </div>
      ))}
    </div>
  );
}

function Card4Body({ p, accent }) {
  return (
    <div className="hc-body">
      <div className="hc-card4-list">
        {CARD4.items.map((it, i) => (
          <div key={i} className="hc-card4-row">
            <span
              style={{
                fontFamily: window.monoFamily,
                fontSize: 11,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: p.fg,
              }}
            >
              <span style={{ color: p.muted }}>{it.label}</span> {it.name}
            </span>
            <span
              style={{
                fontFamily: window.monoFamily,
                fontSize: 10,
                letterSpacing: "0.1em",
                color: accent,
                fontWeight: 600,
              }}
            >
              {it.status}
            </span>
          </div>
        ))}
      </div>
      <div>
        <SectionLabel color={p.muted}>/ WHAT IS PLAYGROUND?</SectionLabel>
        <p className="hc-p" style={{ color: p.fg }}>
          {CARD4.blurb}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Card shell
// ---------------------------------------------------------------
function HomeCard({ c, accent }) {
  const p = palette(c.tone);
  const Body = { card1: Card1Body, card2: Card2Body, card3: Card3Body, card4: Card4Body }[c.body];
  return (
    <a
      href={c.href}
      className="hc-card"
      style={{
        background: p.bg,
        color: p.fg,
        boxShadow: c.tone === "ink"
          ? "0 28px 56px -22px rgba(0,0,0,0.45)"
          : "0 22px 48px -26px rgba(0,0,0,0.20)",
      }}
    >
      <div className="hc-top">
        <MetaRow left={c.topL} right={c.topR} fg={p.fg} muted={p.muted} />
      </div>
      <div className="hc-middle">
        <Body p={p} accent={accent} />
      </div>
      <div className="hc-bottom">
        <FootRow
          left={c.footL}
          leftAfter={c.footLAfter}
          right={c.footR}
          fg={p.muted}
          accentFg={p.fg}
        />
        <Headline lines={c.headline} mode={c.headlineMode} fg={p.fg} accent={accent} />
      </div>
    </a>
  );
}

// ---------------------------------------------------------------
// Home page
// ---------------------------------------------------------------
function HomePage() {
  return (
    <window.PageShell active="home" navMode="top">
      {({ tweaks }) => (
        <div>
          <section className="home-stage">
            <div className="home-grid">
              <HomeCard c={HOME_CONTENT.card1} accent="var(--accent)" />
              <HomeCard c={HOME_CONTENT.card2} accent="var(--accent)" />
              <HomeCard c={HOME_CONTENT.card3} accent="var(--accent)" />
              <HomeCard c={HOME_CONTENT.card4} accent="var(--accent)" />
            </div>
          </section>
        </div>
      )}
    </window.PageShell>
  );
}

window.HomePage = HomePage;
