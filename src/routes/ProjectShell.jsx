import { useLayoutEffect } from "react";
import { useResponsiveCss, FRAMED } from "../site/shared.jsx";
import "./project.css";

// Wraps every ported case study. Owns the two things the old HTML shells set
// on elements no component can reach.
//
// `.project-route` on <html> scopes the page-level background, colour and font
// that each shell declared on `html, body`, so they exist while a case study is
// mounted and not a moment longer.
//
// `is-fullscreen` on <body> is the temporary class Check Access's shell carries,
// with the comment "TEMP: added for rail editing, remove before ship". It is
// still the only reason that page shows its section rail when opened directly.
// It comes out at the Work step, when framed-detection replaces it — removing it
// now would just make the page render wrong.
export function useProjectShell({ forceFullscreen = false, variant, responsive = true } = {}) {
  // Lives here rather than in PageShell because Release Notes has no PageShell
  // — deliberately — and the original injected this from shared.jsx at import,
  // so every case study had it.
  //
  // `responsive: false` is for the long Check Access page alone. It was a
  // hand-written HTML document, not a React page, so it never loaded that
  // stylesheet — and the stylesheet's `main h1` override would shrink its hero
  // below 1180px. See the note at the top of CheckAccessFull.css.
  useResponsiveCss(responsive);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add("project-route");
    if (variant) root.classList.add(variant);
    // Lets CSS ask whether it is rendering inside the stage. The narrow-screen
    // blocks are scoped :not(.is-framed) — see the note on FRAMED in shared.jsx.
    if (FRAMED) root.classList.add("is-framed");
    if (forceFullscreen) document.body.classList.add("is-fullscreen");
    return () => {
      root.classList.remove("project-route");
      if (variant) root.classList.remove(variant);
      if (FRAMED) root.classList.remove("is-framed");
      if (forceFullscreen) document.body.classList.remove("is-fullscreen");
    };
  }, [forceFullscreen, variant]);
}
