import React from "react";
import { useParams } from "react-router-dom";
import Placeholder from "./_Placeholder.jsx";
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
// The stage itself is still legacy/site-work/stage.jsx plus cards.jsx, not yet
// ported. What lands here when it is:
//
//   <Stage focused={slug} /> in the unframed case, always rendered, never
//   remounted — the slug moves the focused card and nothing else.
//
//   The framed case stays what it is below: a bare case study. The stage
//   loads /work/<slug> into its iframe, that document detects it is framed,
//   and renders the project alone with no stage chrome around it. That is
//   what breaks the recursion — without it the iframe would load another
//   stage, which would load another iframe.
//
// Until the stage exists, a slug renders its case study directly, which is
// exactly what the five separate routes did before. Framed-awareness is then
// a condition inside this component, not another change of shape.
const PROJECTS = {
  "check-access": CheckAccess,
  "ai-trust-layer": AiTrustLayer,
  "admin-shell": AdminShell,
  "release-notes": ReleaseNotes
};

export default function Work() {
  const { slug } = useParams();

  if (slug) {
    const Project = PROJECTS[slug];
    // `:slug?` matches anything in that position, so /work/banana now arrives
    // here rather than falling through to the catch-all. It still has to be a
    // 404 — the difference is that this one renders inside WorkLayout, which
    // is an empty passthrough today and will be stage chrome later. Worth
    // revisiting when WorkLayout stops being empty.
    if (!Project) return <NotFound />;
    return <Project />;
  }

  return <Placeholder source="legacy/work.html" />;
}
