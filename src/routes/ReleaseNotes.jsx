import React from "react";
import Placeholder from "./_Placeholder.jsx";

// Card 04. Built unlike its siblings on purpose: no PageShell, no section
// rail, no Project Overview block — it calls useTheme directly and builds
// its own sticky-column layout. Do not normalise it during the port.
export default function ReleaseNotes() {
  return <Placeholder source="legacy/project-release-notes.html" />;
}
