import React from "react";
import Placeholder from "./_Placeholder.jsx";

// Hand-written HTML. Uses fit(). Two branches, THE DESIGNER and THE PERSON,
// toggled by radio buttons — both preserved, becoming React state (brief
// 2.6). USE_AUDIO drives a synthetic timeline that fakes the playback clock;
// it is not dead code and must not be replaced with a real audio element.
export default function About() {
  return <Placeholder source="legacy/about.html" />;
}
