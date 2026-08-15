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
// forceFullscreen carries over the "TEMP: added for rail editing" class on
// <body>; see ProjectShell for why it stays until the Work step.
export default function CheckAccess() {
  useProjectShell({ forceFullscreen: true });
  return <ProjectDetailPage projectId="uipath-check-access" />;
}
