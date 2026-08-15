import React from "react";
import { useParams } from "react-router-dom";
import WorkStage from "../site/work-stage.jsx";
import NotFound from "./NotFound.jsx";
import CheckAccess from "./CheckAccess.jsx";
import AiTrustLayer from "./AiTrustLayer.jsx";
import AdminShell from "./AdminShell.jsx";
import ReleaseNotes from "./ReleaseNotes.jsx";

// The single component behind every /work URL — /work itself and all four
// project slugs. See the route comment in App.jsx for why it is one route
// rather than five: the stage manager holds an iframe per project, and
// matching a different Route per project would rebuild the stage and reload
// every iframe on each card click.
//
// WHAT THIS COMPONENT DECIDES
//
// The same URL renders two different things depending on where it is loaded,
// and that is the whole mechanism:
//
//   Opened normally  → the stage, focused on that project.
//   Inside the frame → the bare case study, no stage around it.
//
// The stage loads /work/<slug> into its own iframe. Without the second case
// that iframe would load another stage, which would open another iframe, for
// as long as the browser allowed. The framed check is what stops it.
//
// It also answers brief 2.4 — "project pages render correct navigation
// standalone and framed." A direct visit is no longer a bare page with no way
// back; it is the stage, which has the chrome bar, the other three projects
// and contact. That is why the temporary is-fullscreen class on Check Access
// could finally come out: nothing renders that page standalone any more.
const PROJECTS = {
  "check-access": CheckAccess,
  "ai-trust-layer": AiTrustLayer,
  "admin-shell": AdminShell,
  "release-notes": ReleaseNotes
};

// Evaluated once. Whether a document is framed cannot change over its life,
// and reading window.top can throw if a parent is ever cross-origin.
const FRAMED = (() => {
  try { return window.self !== window.top; } catch (e) { return true; }
})();

// The stage has no mobile form — below 900 it is a plain list of links, and
// those links point at /work/<slug>. If a slug rendered the stage there, every
// link in the list would lead straight back to the list. So on narrow screens
// a slug renders its case study, which is exactly where the live site's mobile
// list points today.
function useIsNarrow() {
  const [narrow, setNarrow] = React.useState(() => window.matchMedia("(max-width: 899px)").matches);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 899px)");
    const onChange = (e) => setNarrow(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return narrow;
}

export default function Work() {
  const { slug } = useParams();
  const narrow = useIsNarrow();

  if (slug) {
    const Project = PROJECTS[slug];
    // `:slug?` matches anything in that position, so /work/banana arrives here
    // rather than falling through to the catch-all. It still has to be a 404 —
    // the difference is that this one renders inside WorkLayout, which is an
    // empty passthrough today and will be stage chrome later. Worth revisiting
    // when WorkLayout stops being empty.
    if (!Project) return <NotFound />;
    if (FRAMED || narrow) return <Project />;
  }

  return <WorkStage focused={slug} />;
}
