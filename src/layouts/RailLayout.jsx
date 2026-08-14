import React, { useLayoutEffect } from "react";
import { Outlet } from "react-router-dom";
import "./RailLayout.css";

// Homepage and About only.
//
// What it owns today: the `html, body { height: 100%; overflow: hidden }` rule
// both pages open with. It targets elements above the route wrapper, so it
// cannot live in page CSS, and left global it would stop the project pages
// scrolling. The class goes on <html> for exactly as long as a rail route is
// mounted. useLayoutEffect, not useEffect, so it lands before paint and a
// route change cannot flash a scrollbar.
//
// Still to arrive:
//
//   The main site rail (brief 2.7). Today it is hand-authored markup
//   duplicated four times — desktop and mobile copies on each of the two
//   pages. It becomes one authored nav here once About is ported and both
//   copies can be compared. Four items: my context, the work, who am i?,
//   contact. This is NOT the project section rail; they are different systems
//   and must not be merged.
//
// The fit() scaling system is not here, despite brief 2.5 saying "used by
// RailLayout only". Its column anchors are per-page — PANEL_L/TOOLING_L on
// Homepage, SHELF_L on About — so the layout cannot supply them. It lives in
// src/hooks/useFit.js and the two rail pages call it directly, which keeps the
// rule the brief was protecting: no Work or project route ever scales.
export default function RailLayout() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add("rail-route");
    return () => root.classList.remove("rail-route");
  }, []);

  return <Outlet />;
}
