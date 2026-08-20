import React from "react";
import { useParams } from "react-router-dom";
import WorkStage from "../site/work-stage.jsx";
import NotFound from "./NotFound.jsx";
import CheckAccess from "./CheckAccess.jsx";
import AiTrustLayer from "./AiTrustLayer.jsx";
import AdminShell from "./AdminShell.jsx";
import ReleaseNotes from "./ReleaseNotes.jsx";
import CheckAccessFull from "./CheckAccessFull.jsx";
import { useIsNarrow } from "../hooks/useIsNarrow.js";
import { FRAMED } from "../site/shared.jsx";

// The single component behind every /work URL — /work itself and all four
// project slugs. See the route comment in App.jsx for why it is one route
// rather than five: the stage manager holds an iframe per project, and
// matching a different Route per project would rebuild the stage and reload
// every iframe on each card click.
//
// WHAT THIS COMPONENT DECIDES
//
// The same URL renders two different things depending on where it is loaded,
// and that is the whole mechanism:
//
//   Opened normally  → the stage, focused on that project.
//   Inside the frame → the bare case study, no stage around it.
//
// The stage loads /work/<slug> into its own iframe. Without the second case
// that iframe would load another stage, which would open another iframe, for
// as long as the browser allowed. The framed check is what stops it.
//
// It also answers brief 2.4 — "project pages render correct navigation
// standalone and framed." A direct visit is no longer a bare page with no way
// back; it is the stage, which has the chrome bar, the other three projects
// and contact. That is why the temporary is-fullscreen class on Check Access
// could finally come out: nothing renders that page standalone any more.
const PROJECTS = {
  "check-access": CheckAccess,
  "ai-trust-layer": AiTrustLayer,
  "admin-shell": AdminShell,
  "release-notes": ReleaseNotes
};

// The stage has no mobile form — below 900 it is a plain list of links, and
// those links point at /work/<slug>. If a slug rendered the stage there, every
// link in the list would lead straight back to the list. So on narrow screens
// a slug renders its case study, which is exactly where the live site's mobile
// list points today.
//
// The hook itself was declared here until About needed the same boundary. It
// moved to hooks/useIsNarrow.js unchanged rather than being copied.

// The only legal second segment, and which card owns it. A direct link to the
// long read focuses the Check Access card with the long read in its frame,
// rather than rendering a bare document outside the stage (roadmap item 3).
const SUBPAGES = {
  "check-access": { full: CheckAccessFull }
};

export default function Work() {
  const { slug, sub } = useParams();
  const narrow = useIsNarrow();

  if (slug) {
    const subPage = sub ? (SUBPAGES[slug] || {})[sub] : null;
    // `:slug?/:sub?` matches anything in those positions, so /work/banana and
    // /work/check-access/banana both arrive here rather than falling through
    // to the catch-all. Both still have to be a 404 — the difference is that
    // these render inside WorkLayout, which is an empty passthrough today and
    // will be stage chrome later. Worth revisiting when WorkLayout stops being
    // empty.
    if (sub && !subPage) return <NotFound />;
    const Project = subPage || PROJECTS[slug];
    if (!Project) return <NotFound />;
    // Inside the stage's iframe, or on a phone where there is no stage, this
    // URL is the document itself.
    if (FRAMED || narrow) return <Project />;
  }

  // Top level. A sub-page URL seeds the card's frame so the stage opens
  // showing it, and opens fullscreen — the section rail is gated on
  // `is-fullscreen`, and landing a shared long-read link in stage view would
  // hide the table of contents the deep read exists to be navigated by.
  const seedFrame = sub ? { slug, path: `/work/${slug}/${sub}` } : null;

  return <WorkStage focused={slug} seedFrame={seedFrame} seedFs={!!seedFrame} />;
}
