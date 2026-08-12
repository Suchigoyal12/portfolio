/* global React */
// =============================================================
// ABOUT PAGE
// =============================================================
function AboutPage() {
  return (
    <window.PageShell active="about" navMode="top">
      {({ tweaks, owner }) => (
        <div>
          <section style={{ padding: "80px 56px 24px" }}>
            <window.MonoLabel>SECTION 03 / ABOUT</window.MonoLabel>
            <h1
              style={{
                fontFamily: window.serifFamily,
                fontSize: "clamp(64px, 9vw, 132px)",
                lineHeight: 0.95,
                fontWeight: 400,
                letterSpacing: "-0.025em",
                margin: "16px 0 48px",
                color: "var(--ink)",
              }}
            >
              I am a <em>technical</em> product designer.
            </h1>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
              <div>
                <window.WaveMotif color="var(--accent)" width={220} height={56} />
              </div>
              <div>
              <p
                style={{
                  fontFamily: window.sansFamily,
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: "var(--ink)",
                  margin: 0,
                  maxWidth: 520,
                }}
              >
                The definition of ‘done’ has changed. I don't just hand off static pixels; I operate at the execution layer. Focused on translating complex logic into high-fidelity systems, I design for speed to market, technical viability, and enterprise scale.
              </p>
              </div>
            </div>
          </section>

          {/* BIO + IMAGE */}
          <section style={{ padding: "72px 56px", borderTop: "1px solid var(--line)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
            <div>
              <window.MonoLabel>/ ON RECORD</window.MonoLabel>
              <p style={{ fontFamily: window.sansFamily, fontSize: 16, lineHeight: 1.65, color: "var(--ink)", marginTop: 16 }}>
                One SaaS tenure. Maximum focus. 15 months of deep, unglamorous, high-impact product work. I didn't design concept apps; I maintained a live B2B Admin ecosystem.
              </p>
              <p style={{ fontFamily: window.sansFamily, fontSize: 16, lineHeight: 1.65, color: "var(--ink)", marginTop: 16 }}>
                I prefer solving complex table sorting logic over making shiny landing pages. The beauty is in the utility.
              </p>
            </div>
            <div
              style={{
                borderTop: "1px solid var(--line)",
                paddingTop: 16,
              }}
            >
              <div
                style={{
                  aspectRatio: "4/3",
                  background: "#D9D9D9",
                  width: "100%",
                  position: "relative",
                  overflow: "hidden",
                  backgroundImage: "repeating-linear-gradient(45deg, #D4D4D0 0 8px, #DCDCD8 8px 16px)",
                }}
              >
                <div style={{ position: "absolute", left: 14, bottom: 14, fontFamily: window.monoFamily, fontSize: 10, letterSpacing: "0.1em", color: "#8A857C", textTransform: "uppercase" }}>
                  PORTRAIT — DROP HERE
                </div>
              </div>
            </div>
          </section>

          {/* TIMELINE */}
          <section style={{ padding: "72px 56px", borderTop: "1px solid var(--line)" }}>
            <window.MonoLabel>/ TIMELINE</window.MonoLabel>
            <div style={{ marginTop: 32 }}>
              {[
                ["'26", "Architecting AI-integrated systems at the intersection of design tokens, automation, and agentic optimization.", "PRESENT"],
                ["'25", "Orchestrated the admin system overhaul. Shipped IDP components and maintained the core interaction library.", "PRESENT"],
                ["'24", "Continued at UiPath Inc. as Associate Product Designer. Engineered the redesign of core admin workflows.", "UIPATH"],
                ["'23", "Joined UiPath as Product Design Intern. Began foundation work on what would become a unified admin ecosystem.", "UIPATH, IIT GUWAHATI"],
              ].map(([year, body, where], i) => (
                <div
                  key={year}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "100px 1fr 220px",
                    gap: 32,
                    padding: "24px 0",
                    borderTop: "1px solid var(--line)",
                    borderBottom: i === 3 ? "1px solid var(--line)" : "none",
                  }}
                >
                  <div style={{ fontFamily: window.serifFamily, fontSize: 56, lineHeight: 0.9, color: "var(--ink)" }}>{year}</div>
                  <p style={{ fontFamily: window.sansFamily, fontSize: 16, lineHeight: 1.55, margin: 0, color: "var(--ink)" }}>{body}</p>
                  <window.MonoLabel style={{ alignSelf: "center", textAlign: "right" }}>{where}</window.MonoLabel>
                </div>
              ))}
            </div>
          </section>

          {/* PHILOSOPHY PULL QUOTE */}
          <section
            style={{
              padding: "96px 56px",
              background: "var(--ink-panel)",
              color: "var(--ink-inverse)",
              borderTop: "1px solid var(--line)",
              borderBottom: "1px solid var(--line)",
            }}
          >
            <window.MonoLabel color="var(--muted)">/ PHILOSOPHY</window.MonoLabel>
            <div
              style={{
                fontFamily: window.serifFamily,
                fontStyle: "italic",
                fontSize: 56,
                lineHeight: 1.18,
                marginTop: 24,
                color: "var(--ink-inverse)",
                maxWidth: 920,
              }}
            >
              "Complexity is not the enemy, ambiguity is.<br />I design to bridge the gap between human intuition and machine execution."
            </div>
          </section>

          {/* COLLABORATORS / CONTACT TEASE */}
          <section style={{ padding: "72px 56px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <window.MonoLabel>/ AVAILABLE FOR</window.MonoLabel>
              <div style={{ fontFamily: window.sansFamily, fontSize: 26, fontWeight: 600, marginTop: 12 }}>
                High-impact roles at the intersection of design and emerging tech.
              </div>
            </div>
            <a
              href="contact%20(old).html"
              style={{
                textDecoration: "none",
                fontFamily: window.monoFamily,
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--ink)",
                border: "1px solid var(--ink)",
                padding: "16px 24px",
                borderRadius: 999,
              }}
            >
              GET IN TOUCH →
            </a>
          </section>
        </div>
      )}
    </window.PageShell>
  );
}

// =============================================================
// PROCESS PAGE
// =============================================================
function ProcessPage() {
  const phases = [
    {
      no: "01",
      label: "OBSERVE",
      title: "Sit with the live product first.",
      body: "Before a brief, before a sketch — I spend time inside the live product. I want to feel where it lags, where it lies, where the team has carved workarounds. That's the brief.",
    },
    {
      no: "02",
      label: "MAP",
      title: "Diagram the contract.",
      body: "Every interface is a contract between user and system. I diagram the contract before I redesign the surface. If the contract is unclear, the surface can't be clear.",
    },
    {
      no: "03",
      label: "REDUCE",
      title: "Strip until something complains.",
      body: "I remove until a real user (engineer, support, PM) complains. The thing that complains is the thing that matters. Everything else was decoration.",
    },
    {
      no: "04",
      label: "BUILD",
      title: "Hi-fi early. Pixels are cheap.",
      body: "I jump to high-fidelity quickly because real type and real spacing reveal real problems. Wireframes lie about hierarchy.",
    },
    {
      no: "05",
      label: "GOVERN",
      title: "Ship the contract, not the file.",
      body: "Components without governance drift. I document decisions inline, version visibly, and treat the system like a product with users — because it is.",
    },
  ];

  return (
    <window.PageShell active="process" navMode="top">
      {() => (
        <div>
          <section style={{ padding: "80px 56px 24px" }}>
            <window.MonoLabel>SECTION 02 / PROCESS</window.MonoLabel>
            <h1
              style={{
                fontFamily: window.sansFamily,
                fontWeight: 800,
                fontSize: 120,
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
                margin: "16px 0 32px",
                color: "var(--ink)",
              }}
            >
              FIVE PHASES.<br />NO ROMANCE<span style={{ color: "var(--accent)" }}>.</span>
            </h1>
            <p style={{ fontFamily: window.serifFamily, fontStyle: "italic", fontSize: 22, lineHeight: 1.45, color: "var(--ink)", maxWidth: 640 }}>
              Process is a tool, not a religion. These five phases describe how I work most of the time — but the work always wins the argument.
            </p>
          </section>

          {/* PHASE STRIP */}
          <section style={{ padding: "0 56px", marginTop: 48 }}>
            <div style={{ borderTop: "1px solid var(--ink)" }}>
              {phases.map((p, i) => (
                <div
                  key={p.no}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 200px 1fr 60px",
                    gap: 32,
                    padding: "40px 0",
                    borderBottom: "1px solid var(--line)",
                    alignItems: "start",
                  }}
                >
                  <div style={{ fontFamily: window.serifFamily, fontSize: 72, lineHeight: 0.9, color: "var(--accent)" }}>
                    {p.no}
                  </div>
                  <window.MonoLabel style={{ paddingTop: 28 }}>{p.label}</window.MonoLabel>
                  <div>
                    <h3
                      style={{
                        fontFamily: window.sansFamily,
                        fontWeight: 700,
                        fontSize: 32,
                        letterSpacing: "-0.015em",
                        margin: 0,
                        color: "var(--ink)",
                      }}
                    >
                      {p.title}
                    </h3>
                    <p style={{ fontFamily: window.sansFamily, fontSize: 16, lineHeight: 1.6, color: "var(--ink)", marginTop: 12, maxWidth: 580 }}>
                      {p.body}
                    </p>
                  </div>
                  <div style={{ paddingTop: 32, justifySelf: "end" }}>
                    <window.Stamp color="var(--ink)" size={28} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SYSTEMS WAVE BLOCK */}
          <section
            style={{
              padding: "96px 56px",
              marginTop: 48,
              background: "var(--ink-panel)",
              color: "var(--ink-inverse)",
              textAlign: "center",
            }}
          >
            <window.WaveMotif color="var(--ink-inverse)" width={420} height={108} />
            <div style={{ fontFamily: window.sansFamily, fontWeight: 600, letterSpacing: "0.18em", fontSize: 16, marginTop: 16 }}>
              SYSTEMS
            </div>
            <p
              style={{
                fontFamily: window.serifFamily,
                fontStyle: "italic",
                fontSize: 28,
                lineHeight: 1.4,
                marginTop: 32,
                maxWidth: 720,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              The wave repeats. Process repeats. Insight comes from the loop, not the line.
            </p>
          </section>
        </div>
      )}
    </window.PageShell>
  );
}

window.AboutPage = AboutPage;
window.ProcessPage = ProcessPage;
