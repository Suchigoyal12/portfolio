import React from "react";
import Placeholder from "./_Placeholder.jsx";

// The long version. Reached from inside the short version and nowhere else;
// never enters the card stack. Standalone by construction — ~22k of inline
// CSS, its own hand-written rail and TOC, no React, sharing nothing with the
// rest of the system. That is intentional. Heaviest file in the project, and
// the three video reels live here.
export default function CheckAccessFull() {
  return <Placeholder source="legacy/project-check-access-long-v2.html" />;
}
