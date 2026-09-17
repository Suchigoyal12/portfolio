import React from "react";
import { ReleaseNotesProjectPage } from "../site/page-project-release-notes.jsx";
import { useProjectShell } from "./ProjectShell.jsx";
import "./releasenotes.css";

// Card 04. Built unlike its siblings on purpose: no PageShell, no section rail,
// no Project Overview block — it calls useTheme directly and builds its own
// sticky-column layout. Do not normalise it.
export default function ReleaseNotes() {
  useProjectShell({ variant: "release-notes" });
  return <ReleaseNotesProjectPage />;
}
