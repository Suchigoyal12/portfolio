import { useEffect, useState } from "react";

// The 899px boundary, as a subscription rather than a one-shot read.
//
// Extracted from Work.jsx, which had it inline. Two routes need it now: Work
// decides stage-vs-case-study on it, and About resolves its null branch on it.
// Same treatment as the four duplicated site rails that became one SiteRail —
// a second copy is how the first divergence starts.
//
// 899 is the same boundary the CSS uses. Home.css, About.css, Work.css and
// RailLayout.css all switch their mobile stacks at `max-width: 899px`; a hook
// that disagreed with them by a pixel would render the wrong composition in
// exactly one column of the viewport.
const QUERY = "(max-width: 899px)";

export function useIsNarrow() {
  const [narrow, setNarrow] = useState(() => window.matchMedia(QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = (e) => setNarrow(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return narrow;
}
