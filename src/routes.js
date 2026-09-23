// The route table, in one place.
//
// Slugs are public and effectively permanent — confirmed against migration
// brief 2.3 before this file was written. Do not rename one without deciding
// what happens to links already shared.
//
// `key` is the project's identifier in the existing stage manager: it is what
// travels in the postMessage next-project contract, `{ type: "work:focus",
// key }`, and what orders the card stack. The values here match
// legacy/site-work/cards.jsx exactly, so porting the stage does not also
// become a rename. That is why `ai-trust` does not match the slug
// `ai-trust-layer` — the mismatch is inherited, and harmless.
//
// When the stage is ported (brief 2.1), WORK_CARDS drops its hand-maintained
// `href` strings and reads PROJECT_ROUTES for iframe sources instead.
//
// ADDING A ROUTE? It also needs a line in vercel.json's `rewrites`, or direct
// visits to it get the 404 page (roadmap item 11). The build checks this and
// fails with a message if one is missing: tools/postbuild.mjs.

export const PROJECT_ROUTES = [
  { key: "check-access",  n: 1, path: "/work/check-access",   title: "UNIFYING FRAGMENTED PERMISSIONS" },
  { key: "ai-trust",      n: 2, path: "/work/ai-trust-layer",  title: "AI TRUST LAYER" },
  { key: "admin-shell",   n: 3, path: "/work/admin-shell",     title: "RE-ARCHITECTING THE UIPATH ADMIN SHELL" },
  { key: "release-notes", n: 4, path: "/work/release-notes",   title: "RELEASE NOTES" },
];

// Reachable from inside the short Check Access page, and from nowhere else —
// it is not a card and never enters the stack.
export const CHECK_ACCESS_FULL = "/work/check-access/full";

// The detailed UiPath Admin Shell case study has no entry here on purpose.
// It is not published (brief 2.3). Nothing routes to it and nothing imports
// its component, which is what keeps its content out of the bundle.
//
// There is also no AI Experiments route. It was never designed, and brief
// 2.3 is explicit that no route, stub or placeholder should exist for it.
