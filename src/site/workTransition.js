// The Homepage ⇄ Work transition — roadmap item 14, step 3.
//
// Agreed in the pile-to-grid motion study (settings "one flow, fanned pile,
// Work beige, scroll on opens 01"). Home and Work are separate routes, so each
// page plays its own half and the hand-off between them is invisible:
//
//   leaving Home   the page's content scrolls off upward while the rail stays
//                  put; only then does the route change to /work.
//   arriving Work  the ground turns from Homepage cream to Work beige, the four
//                  cards land as a fanned pile, the pile deals out into the
//                  grid. The site rail on /work sits on the Homepage rail's
//                  exact pixels, so it reads as one rail that never moved.
//
// The pile plays once per tab session. Every later arrival skips it: the
// cards fade up straight into their grid places (first-visit rule, 2026-10).
//
// Going back is not the entrance in reverse: the cards fade where they are,
// the ground returns to cream, and the Homepage content slides back down.
//
// Desktop only (900px and up). Phones keep their plain list and plain links.
// Under prefers-reduced-motion nothing travels; each half is a short fade.

// ── EXPERIMENT (branch experiment-blur-ground, preview only, never merged) ──
// The ground behind /work is the Homepage itself, blurred, instead of solid
// Work beige; it stays behind the grid, the stage and direct visits. The
// Homepage does not scroll away or sink back: it blurs in place. And the
// pile plays on every arrival, not only the first in a tab.
export const GROUND = "blur";
export const PILE_EVERY_TIME = true;
export const BLUR_PX = 18;
export const BLUR_DIM = 0.12;      // rgb(14,14,12) veil
export const BLUR_DESAT = 0.18;
export const BLUR_IN_MS = 750;
export const BLUR_IN_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
export const BLUR_OUT_MS = 520;
export const BLUR_OUT_EASE = "cubic-bezier(0.3, 0, 0.2, 1)";
export const BLUR_LAND_START = 300; // no empty beat to wait out: the pile lands sooner
export const blurFilter = (k) => `blur(${(BLUR_PX * k).toFixed(2)}px) saturate(${(1 - BLUR_DESAT * k).toFixed(3)})`;

export const CREAM = "#FBFAF6"; // Homepage ground (--bg-landing, Home.css)
export const BEIGE = "#E8E4DC"; // Work ground (--bg, Work.css)

// Leaving Home.
export const HOME_EXIT_MS = 720;
export const HOME_EXIT_EASE = "cubic-bezier(0.76, 0, 0.24, 1)"; // in-out quart

// Arriving on Work.
export const GROUND_MS = 420;
export const LAND_MS = 520;
export const LAND_EASE = "cubic-bezier(0.34, 1.45, 0.64, 1)";   // a small bounce
export const LAND_DROP = 80;                                    // px the cards fall
export const LAND_START = 60;
export const LAND_STAGGER = 70;                                 // 04 first, 01 last on top
export const PILE_HOLD = 260;                                   // the pile registers
export const DEAL_MS = 780;
export const DEAL_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
export const DEAL_STAGGER = 70;                                 // 01 first
export const RISE_MS = 450;                                     // later visits
export const RISE_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
export const RISE_STAGGER = 60;
export const RISE_START = 160;

// The pile, in the 216×156 stack card's own pixels, relative to a card
// centered in the window: 01 on top, the others peeking out from under it.
export const PILE = [
  { x: 0, y: 0, r: -2 },
  { x: 22, y: -12, r: 6 },
  { x: 40, y: -6, r: 13 },
  { x: -26, y: -8, r: -9 }
];

// Going back to Home.
export const BACK_FADE_MS = 240;
export const BACK_GROUND_MS = 200;
export const HOME_RETURN_MS = 620;
export const HOME_RETURN_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

// A scroll gesture moves one step only if it is fresh (the wheel rested this
// long first) and travels this far. Same guard as the Work stage's.
export const FRESH_MS = 300;
export const STEP_PX = 40;

export const PILE_SEEN_KEY = "work:pile-seen";

export function reducedMotion() {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ssGet(k) {
  try { return window.sessionStorage.getItem(k); } catch (e) { return null; }
}
export function ssSet(k, v) {
  try { window.sessionStorage.setItem(k, v); } catch (e) { /* private mode */ }
}

// The hand-off between the two routes. In memory, not in history state, so a
// reload never replays a transition; and timestamped, so a stale value from a
// minute ago means nothing.
//
//   leftHomeAt  Home's exit finished and it navigated to /work.
//   leftGridAt  the /work grid unmounted on the way to "/". Set on Back too,
//               which carries no state of its own for this.
//   faded       the grid already faded its cards and ground before leaving,
//               so Home only has to slide its content back.
export const handoff = { leftHomeAt: 0, leftGridAt: 0, faded: false };

// The rail marker can move ahead of the route change. Leaving Home, the
// content takes 720ms to clear before /work exists; the marker should travel
// to "the work" as the scroll starts, not after. RailTravel listens for this.
export function previewRail(href) {
  window.dispatchEvent(new CustomEvent("rail:preview", { detail: { href } }));
}
