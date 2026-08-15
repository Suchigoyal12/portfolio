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
// The stage is ported and renders at /work. What is still to come:
//
//   Framed-awareness. A slug should render the stage focused on that project
//   when opened normally, and the bare case study when it is inside the
//   stage's own iframe. The stage loads /work/<slug> into its frame, that
//   document detects it is framed, and renders the project alone with no
//   stage chrome around it. That detection is what breaks the recursion —
//   without it the iframe would load another stage, which would load another
//   iframe.
//
//   Until then a slug renders its case study directly, which is what the five
//   separate routes did before and what the framed half will keep doing
//   afterwards. So framed-awareness becomes a condition added here, not
//   another change of shape.
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

  return <WorkStage />;
}
