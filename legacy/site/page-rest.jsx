/* global React */
// =============================================================
// EXPERIMENTS INDEX
// =============================================================
function ExperimentsPage() {
  return (
    <window.PageShell active="experiments" navMode="top">
      {() => (
        <div>
          <section style={{ padding: "80px 56px 24px" }}>
            <window.MonoLabel>SECTION 04 / EXPERIMENTS</window.MonoLabel>
            <h1
              style={{
                fontFamily: window.serifFamily,
                fontSize: 160,
                lineHeight: 0.88,
                fontWeight: 400,
                letterSpacing: "-0.03em",
                margin: "16px 0 0",
                color: "var(--ink)",
              }}
            >
              <em>Experiments.</em>
            </h1>
            <p style={{ fontFamily: window.sansFamily, fontSize: 17, lineHeight: 1.6, color: "var(--ink)", marginTop: 24, maxWidth: 580 }}>
              Process work, generative studies, and visual notes that don't belong to a client. Ungated; unfinished by design.
            </p>
          </section>

          <section style={{ padding: "56px 56px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            {window.EXPERIMENTS.map((e, i) => (
              <a
                key={e.id}
                href={e.href}
                style={{
                  textDecoration: "none",
                  color: "var(--ink)",
                  background: "var(--surface)",
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
                  transition: "transform 200ms",
                }}
                onMouseEnter={(ev) => (ev.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={(ev) => (ev.currentTarget.style.transform = "translateY(0)")}
              >
                <div style={{ height: 240, position: "relative" }}>
                  <window.CirclesOnGrid seed={i + 5} width={520} height={240} accent="var(--accent)" />
                </div>
                <div style={{ padding: 28 }}>
                  <window.MonoLabel>{e.no}</window.MonoLabel>
                  <h3 style={{ fontFamily: window.serifFamily, fontStyle: "italic", fontSize: 32, lineHeight: 1.2, margin: "10px 0 8px", color: "var(--ink)" }}>
                    {e.title}
                  </h3>
                  <p style={{ fontFamily: window.sansFamily, fontSize: 14, lineHeight: 1.55, color: "var(--muted)", margin: 0 }}>
                    {e.blurb}
                  </p>
                </div>
              </a>
            ))}
          </section>
        </div>
      )}
    </window.PageShell>
  );
}

// =============================================================
// EXPERIMENT DETAIL — Linguistic Geometry
// =============================================================
function ExperimentDetailPage() {
  return (
    <window.PageShell active="experiments" navMode="top">
      {() => (
        <div>
          <section style={{ padding: "56px 56px 24px" }}>
            <a href="experiments.html" style={{ fontFamily: window.monoFamily, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none" }}>
              ← EXPERIMENTS
            </a>
          </section>

          <section style={{ padding: "24px 56px 64px" }}>
            <window.MonoLabel>EXP_01 / IN PROGRESS</window.MonoLabel>
            <h1
              style={{
                fontFamily: window.serifFamily,
                fontSize: 132,
                lineHeight: 0.9,
                fontWeight: 400,
                letterSpacing: "-0.025em",
                margin: "16px 0 0",
                color: "var(--ink)",
              }}
            >
              <em>Linguistic<br />Geometry.</em>
            </h1>
            <p style={{ fontFamily: window.sansFamily, fontSize: 18, lineHeight: 1.55, color: "var(--ink)", marginTop: 24, maxWidth: 640 }}>
              Exploration of mapping semantic structures to radial coordinate systems. Words, plotted as weights, on a constraint-grid.
            </p>
          </section>

          {/* BIG VIZ */}
          <section style={{ padding: "0 56px" }}>
            <div style={{ height: 480, borderRadius: 16, overflow: "hidden", border: "1px solid var(--line)" }}>
              <window.CirclesOnGrid width={960} height={480} seed={42} accent="var(--accent)" />
            </div>
          </section>

          {/* NOTES */}
          <section style={{ padding: "72px 56px", display: "grid", gridTemplateColumns: "180px 1fr", gap: 32 }}>
            <window.MonoLabel>/ NOTES</window.MonoLabel>
            <div style={{ maxWidth: 640 }}>
              <p style={{ fontFamily: window.sansFamily, fontSize: 17, lineHeight: 1.65, color: "var(--ink)", margin: 0 }}>
                A grid is a constraint. A circle is a weight. Together, they form a non-literal data
                language — circles drift toward each other where their semantic attraction is strong,
                and the grid keeps them honest.
              </p>
              <p style={{ fontFamily: window.sansFamily, fontSize: 17, lineHeight: 1.65, color: "var(--ink)", marginTop: 20 }}>
                The experiment isn't finished. It may not finish. Some things are better as questions.
              </p>
            </div>
          </section>
        </div>
      )}
    </window.PageShell>
  );
}

// =============================================================
// CONTACT PAGE
// =============================================================
function ContactPage() {
  return (
    <window.PageShell active="contact" navMode="top">
      {() => (
        <div>
          <section style={{ padding: "80px 56px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
            <div>
              <window.MonoLabel>SECTION 05 / CONTACT</window.MonoLabel>
              <h1
                style={{
                  fontFamily: window.sansFamily,
                  fontWeight: 800,
                  fontSize: 132,
                  lineHeight: 0.9,
                  letterSpacing: "-0.03em",
                  margin: "16px 0 32px",
                  color: "var(--ink)",
                }}
              >
                LET'S<br />TALK<span style={{ color: "var(--accent)" }}>.</span>
              </h1>
              <p style={{ fontFamily: window.serifFamily, fontStyle: "italic", fontSize: 20, lineHeight: 1.45, color: "var(--ink)", marginTop: 8 }}>
                Available for high-impact roles at intersection of <em style={{ fontStyle: "italic" }}>design</em> and <em style={{ fontStyle: "italic" }}>emerging tech</em>
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                ["EMAIL", "suchigoyal12@gmail.com ↗"],
                ["PHONE", "+91–9216700021"],
                ["LINKEDIN", "www.suchi.com ↗"],
                ["READ.CV", "read.cv/suchi ↗"],
                ["LOCATION", "Bangalore / India"],
              ].map(([k, v]) => (
                <div key={k} style={{ borderTop: "1px solid var(--ink)", paddingTop: 14 }}>
                  <window.MonoLabel>{k}</window.MonoLabel>
                  <div style={{ fontFamily: window.sansFamily, fontSize: 24, fontWeight: 600, marginTop: 6, color: "var(--ink)", letterSpacing: "-0.01em" }}>
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ padding: "72px 56px", borderTop: "1px solid var(--line)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
              <window.WaveMotif color="var(--accent)" width={320} height={80} />
              <div style={{ fontFamily: window.serifFamily, fontStyle: "italic", fontSize: 32, color: "var(--ink)", textAlign: "right" }}>
                Bring your logic to the world.
              </div>
            </div>
          </section>
        </div>
      )}
    </window.PageShell>
  );
}

// =============================================================
// 404 PAGE
// =============================================================
function NotFoundPage() {
  return (
    <window.PageShell active={null} navMode="top">
      {() => (
        <div style={{ padding: "120px 56px", textAlign: "center" }}>
          <window.MonoLabel>SYS.ERR.404</window.MonoLabel>
          <h1
            style={{
              fontFamily: window.sansFamily,
              fontWeight: 800,
              fontSize: 200,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              margin: "16px 0 32px",
              color: "var(--ink)",
            }}
          >
            404<span style={{ color: "var(--accent)" }}>.</span>
          </h1>
          <p style={{ fontFamily: window.serifFamily, fontStyle: "italic", fontSize: 28, color: "var(--ink)", maxWidth: 640, margin: "0 auto" }}>
            This page is not in the index. The system has nothing to show you here.
          </p>
          <a
            href="index.html"
            style={{
              display: "inline-block",
              marginTop: 48,
              fontFamily: window.monoFamily,
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--ink)",
              border: "1px solid var(--ink)",
              padding: "16px 24px",
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            ← RETURN TO INDEX
          </a>
        </div>
      )}
    </window.PageShell>
  );
}

window.ExperimentsPage = ExperimentsPage;
window.ExperimentDetailPage = ExperimentDetailPage;
window.ContactPage = ContactPage;
window.NotFoundPage = NotFoundPage;
