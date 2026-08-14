import React from "react";
import { Outlet } from "react-router-dom";

// Homepage and About only.
//
// Still empty — this is the scaffold. Two things land here during the port:
//
//   The main site rail (brief 2.7). Today it is hand-authored markup
//   duplicated four times: desktop and mobile copies on each of the two
//   pages. It becomes one authored nav here. Four items: my context, the
//   work, who am i?, contact. This is NOT the project section rail; they
//   are different systems and must not be merged.
//
//   The fit() scaling hook (brief 2.5), extracted from the two static
//   pages. Reference width is 1300px and must not change — cross-page
//   positional continuity depends on both pages using an identical
//   reference. Three constraints the port has to honour: useLayoutEffect
//   rather than useEffect, or the scale applies after paint and flashes on
//   every route change; recalculate on mount as well as on resize, because
//   .stage remounts when the route changes; and clean the resize listener
//   up on unmount. clearScale() ports alongside fit().
export default function RailLayout() {
  return <Outlet />;
}
