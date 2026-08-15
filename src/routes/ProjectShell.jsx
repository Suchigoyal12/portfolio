import { useLayoutEffect } from "react";
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
export function useProjectShell({ forceFullscreen = false } = {}) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add("project-route");
    if (forceFullscreen) document.body.classList.add("is-fullscreen");
    return () => {
      root.classList.remove("project-route");
      if (forceFullscreen) document.body.classList.remove("is-fullscreen");
    };
  }, [forceFullscreen]);
}
