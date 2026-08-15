import React from "react";
import { ProjectDetailPage } from "../site/page-project.jsx";
import { useProjectShell } from "./ProjectShell.jsx";

// Card 01. legacy/project-check-access.html mounted exactly this, with
// projectId="uipath-check-access" — page-project.jsx is generic enough to
// render other projects, but only this one ever used it.
//
// The shell also loaded page-home, page-works, page-about-process and
// page-rest — roughly 40k of JSX that rendered nothing. Dropped, per brief 2.7.
//
// The "TEMP: added for rail editing, remove before ship" class on <body> is
// gone, along with the forceFullscreen flag that carried it. It existed so
// this page showed its section rail when opened directly — the only thing
// masking the Stage 1 problem of a project page having no navigation of its
// own. Framed-awareness in Work.jsx replaces it: a direct visit now renders
// the stage, and the stage owns is-fullscreen on the framed document.
//
// It had also become actively wrong. The stage strips is-fullscreen from the
// framed page on load; this flag was a layout effect, so it ran afterwards and
// put the class back, showing the rail inside the card where the live site
// shows none.
export default function CheckAccess() {
  useProjectShell();
  return <ProjectDetailPage projectId="uipath-check-access" />;
}
