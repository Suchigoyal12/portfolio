// ARCHIVED — not loaded by any page, not deployed.
//
// The password gate that used to sit under "Request access" on the public
// Admin Shell page (site/page-admin-shell-public.jsx). Removed from the live
// page because the detailed case study it unlocked is no longer published —
// the passcode led nowhere, and the passcode itself was readable in the page
// source, so it was never real protection.
//
// Kept here so the interaction design is recoverable: the reveal-on-click
// affordance, the inline editorial underline field, the shake-on-wrong-entry
// animation and the "Not quite." caption.
//
// TO RESTORE:
//   1. Copy the component below back into site/page-admin-shell-public.jsx,
//      above `function AdminShellPublicPage()`.
//   2. Add `<PasswordGate />` inside the #gate section, after the
//      "Request access" link.
//   3. Point `submit()` at a real destination — and note that a passcode
//      compared in client-side JavaScript is not access control. Anyone can
//      read it in the source. Use it as an affordance, not as a lock.
//
// This folder is listed in .vercelignore and never reaches the live site.

// ── PASSWORD GATE — quiet affordance under "Request access" ────
// Reveals an inline, editorial password field. Correct password
// ("123456") redirects to the full, detailed case study. Wrong
// entry shakes and shows a mono caption. No modal, no popup.
function PasswordGate() {
  const [open, setOpen] = React.useState(false);
  const [val, setVal] = React.useState("");
  const [error, setError] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const inputRef = React.useRef(null);
  const rowRef = React.useRef(null);

  const reveal = () => {
    setOpen(true);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
  };

  const shakeNow = () => {
    const el = rowRef.current;
    if (!el) return;
    el.classList.remove("pw-shake");
    void el.offsetWidth; // force reflow so the animation retriggers
    el.classList.add("pw-shake");
  };

  const submit = (e) => {
    e.preventDefault();
    if (val === "123456") {
      window.location.href = "project-admin-shell.html";
    } else {
      setError(true);
      shakeNow();
    }
  };

  const lineColor = error ? "var(--accent)" : focused ? "var(--accent)" : "var(--ink)";

  return (
    <div style={{ marginTop: 26, minHeight: 40 }}>
      <style>{`@keyframes pwShake {
        0%,100% { transform: translateX(0); }
        15% { transform: translateX(-7px); }
        30% { transform: translateX(6px); }
        45% { transform: translateX(-5px); }
        60% { transform: translateX(4px); }
        75% { transform: translateX(-2px); }
      }
      .pw-shake { animation: pwShake 360ms ease; }`}</style>
      {!open ?
      <button
        onClick={reveal}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: mono,
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--muted)",
          padding: 4
        }}>
        Have a password? <span style={{ color: "var(--accent)" }}>→</span>
      </button> :

      <form onSubmit={submit} style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div ref={rowRef} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <input
            ref={inputRef}
            type="password"
            value={val}
            onChange={(e) => { setVal(e.target.value); if (error) setError(false); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="ENTER PASSWORD"
            aria-label="Password"
            style={{
              background: "none",
              border: "none",
              borderBottom: `1.5px solid ${lineColor}`,
              outline: "none",
              fontFamily: mono,
              fontSize: 14,
              letterSpacing: "0.2em",
              color: "var(--ink)",
              padding: "8px 2px",
              width: 230,
              textAlign: "center",
              transition: "border-color 160ms ease"
            }} />
          <button
            type="submit"
            aria-label="Submit password"
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: mono, fontSize: 18, color: "var(--accent)", padding: 4 }}>
            →
          </button>
        </div>
        <div style={{ height: 14 }}>
          {error && <window.MonoLabel color="var(--accent)">Not quite.</window.MonoLabel>}
        </div>
      </form>
      }
    </div>);

}
