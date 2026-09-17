import React from "react";
import { Outlet } from "react-router-dom";

// /work and every project route. Never calls fit().
//
// Still empty — this is the scaffold. What lands here during the port:
//
//   The stage manager chrome (brief 2.1): tilted card stack, terminal-style
//   chrome bar, breadcrumb formatted NN/04 · WORK › PROJECT NAME. The
//   focused window stays an <iframe>, now pointed at the React route rather
//   than at a .html file. Keeping the iframe is a decision, not an
//   oversight: it preserves CSS isolation between projects, keeps
//   requestFullscreen() targeting a real element, and leaves the
//   postMessage contract intact.
//
//   Three couplings that must survive together, or the stage breaks in ways
//   that are hard to trace:
//     · the parent writes is-fullscreen into the child document — the child
//       cannot set it for itself, and the flag lives on the document, not
//       the iframe element, because navigating inside the frame replaces
//       the document;
//     · the child posts { type: "work:focus", key } and the parent moves
//       the stack instead of navigating the frame — break one half and
//       next-project links start navigating inside the card;
//     · requestFullscreen() fires AFTER the card switch completes, never
//       alongside it. This was a bug once. Preserve the fix.
//
//   Standalone navigation (brief 2.4) — the one real functional improvement
//   in Stage 2. Each project route has to render correctly both framed and
//   opened directly. The approach in the brief: the project component
//   detects window.self !== window.top and sets its own default state when
//   it is not framed, so a direct visit gets the section rail and a route
//   back. Once that works, the temporary is-fullscreen class on Check
//   Access's <body> comes out.
export default function WorkLayout() {
  return <Outlet />;
}
