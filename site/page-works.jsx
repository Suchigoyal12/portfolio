/* global React */
// WORKS INDEX — list of projects with hover preview
function WorksPage() {
  const [hovered, setHovered] = React.useState(null);

  return (
    <window.PageShell active="works" navMode="top">
      {({ tweaks }) => (
        <div>
          {/* HEADER STRIP */}
          <section style={{ padding: "72px 56px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 32, marginBottom: 48 }}>
              <div>
                <window.MonoLabel>SECTION 01 / WORKS</window.MonoLabel>
                <h1
                  style={{
                    fontFamily: window.sansFamily,
                    fontWeight: 800,
                    fontSize: 96,
                    lineHeight: 0.92,
                    letterSpacing: "-0.03em",
                    margin: "12px 0 0",
                    color: "var(--ink)",
                  }}
                >
                  THE ACTUAL<br />WORK<span style={{ color: "var(--accent)" }}>.</span>
                </h1>
              </div>
              <div style={{ textAlign: "right", maxWidth: 320 }}>
                <window.MonoLabel>{window.PROJECTS.length} LIVE PROJECTS · '23 — '26</window.MonoLabel>
                <p
                  style={{
                    fontFamily: window.serifFamily,
                    fontStyle: "italic",
                    fontSize: 18,
                    lineHeight: 1.4,
                    color: "var(--ink)",
                    marginTop: 12,
                  }}
                >
                  Live B2B work, in chronological order. The shipped over the showcase.
                </p>
              </div>
            </div>
          </section>

          {/* PROJECT TABLE */}
          <section style={{ padding: "0 56px", position: "relative" }}>
            <div style={{ borderTop: "1px solid var(--ink)" }}>
              {window.PROJECTS.map((proj, i) => (
                <a
                  key={proj.id}
                  href={proj.href}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    textDecoration: "none",
                    color: "var(--ink)",
                    display: "grid",
                    gridTemplateColumns: "60px 1fr 1fr 100px 60px",
                    gap: 24,
                    padding: "24px 0",
                    borderBottom: "1px solid var(--line)",
                    alignItems: "center",
                    transition: "background 200ms",
                    position: "relative",
                  }}
                >
                  <div style={{ fontFamily: window.serifFamily, fontSize: 36, color: hovered === i ? "var(--accent)" : "var(--muted)", lineHeight: 0.9, transition: "color 200ms" }}>
                    {proj.no}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: window.sansFamily,
                        fontWeight: 700,
                        fontSize: 24,
                        letterSpacing: "-0.01em",
                        textTransform: "uppercase",
                      }}
                    >
                      {proj.title}
                    </div>
                    <window.MonoLabel style={{ marginTop: 6, display: "block" }}>
                      {proj.client} · {proj.timeline}
                    </window.MonoLabel>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {proj.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          border: "1px solid var(--line)",
                          padding: "5px 10px",
                          borderRadius: 999,
                          fontFamily: window.monoFamily,
                          fontSize: 9,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--muted)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div style={{ fontFamily: window.monoFamily, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: hovered === i ? "var(--accent)" : "var(--muted)", transition: "color 200ms" }}>
                    {proj.metric}
                  </div>
                  <div style={{ textAlign: "right", fontFamily: window.monoFamily, fontSize: 14, color: hovered === i ? "var(--accent)" : "var(--muted)", transition: "color 200ms" }}>
                    →
                  </div>

                  {/* HOVER PREVIEW */}
                  {hovered === i && proj.href !== "#" && (
                    <div
                      style={{
                        position: "absolute",
                        right: 80,
                        top: -20,
                        width: 220,
                        height: 140,
                        borderRadius: 12,
                        overflow: "hidden",
                        boxShadow: "0 20px 40px -12px rgba(0,0,0,0.25)",
                        pointerEvents: "none",
                        zIndex: 5,
                        animation: "fadeIn 200ms ease",
                      }}
                    >
                      <window.CirclesOnGrid seed={i + 1} width={220} height={140} accent="var(--accent)" />
                    </div>
                  )}
                </a>
              ))}
            </div>
          </section>

          {/* FOOTER COMMENTARY */}
          <section style={{ padding: "56px 56px 0", display: "flex", justifyContent: "space-between" }}>
            <window.MonoLabel>MEASURABLE OUTPUT</window.MonoLabel>
            <window.MonoLabel>QUALITY ASSURED</window.MonoLabel>
          </section>

          <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
      )}
    </window.PageShell>
  );
}

window.WorksPage = WorksPage;
