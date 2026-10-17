import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useIsNarrow } from "../hooks/useIsNarrow.js";

// The left-rail travel indicator — roadmap item 9, and the reason the React
// migration happened at all.
//
// WHY THIS LIVES ABOVE <Routes> RATHER THAN INSIDE SiteRail
//
// The marker has to outlive the thing it points at. Homepage and About are
// separate route components, so their SiteRail unmounts and remounts on every
// navigation — a marker inside it would be destroyed and rebuilt, which is a
// cut, not a journey. Worse, `>` was a ::before pseudo-element, and a
// pseudo-element cannot outlive its parent by definition.
//
// So it is one element rendered inside ContactProvider and outside <Routes>,
// which is the only slot in the tree that survives *every* route change —
// including the one to /work, where the rail does not exist at all. That is
// what makes "travel then fade" possible with **no navigation delay**: the
// click routes immediately, and this element keeps animating over whatever
// rendered next, because it was never unmounted.
//
// It is position:fixed and driven by measuring the real rail links, not by
// duplicating their geometry. Nothing here hardcodes 24px, 54.511% or the
// 10px gap; if the rail moves, the marker follows, because it asks the DOM
// where the links actually are.
//
// Desktop only. Below 900px the rail is a plain list inside .mobile-stack with
// no travel to perform, so the authored ::before marker stays in charge there
// (see RailLayout.css) and this component renders nothing.

// Settled 2026-08-20 after comparing durations, easings and exit behaviours
// on a live bench: 280ms, out-quart, marker + colour, reserved gutter,
// travel-then-fade on leaving to /work.
const DUR = 280;
const EASE = "cubic-bezier(0.25, 1, 0.5, 1)";
const FADE = 180;

// Where the marker retreats to when the destination has no rail: an open
// project. The /work grid carries the rail (roadmap item 14), so the marker
// rests on "the work" there and fades from that spot when a project opens.
const EXIT_HREF = "/work";

function railHrefFor(pathname) {
  if (pathname === "/") return "/";
  if (pathname === "/about") return "/about";
  if (pathname === "/work") return "/work";
  return null; // an open project: no rail on the far side
}

export default function RailTravel() {
  const { pathname } = useLocation();
  const narrow = useIsNarrow();

  const markerRef = useRef(null);
  // Last known viewport rect + colour per rail href, captured while a rail was
  // actually on screen. This is what lets the marker travel to "the work"
  // after the rail that contained it has already unmounted.
  const cacheRef = useRef({});
  const placedRef = useRef(false); // has the marker ever been positioned?
  const lastPathRef = useRef(null); // null until the first render completes
  const fadeTimer = useRef(0);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // `move` and `fade` are set independently, because the three cases each want
  // a different pair:
  //   cold load          — neither: the marker is simply already there
  //   returning from /work — fade in, but do NOT slide from a stale position
  //   travel             — slide; opacity is already 1 and stays put
  // Both properties are committed inside one no-transition window when either
  // is instant, otherwise re-arming the transition mid-function lets the
  // second property animate when it was meant to be immediate. That was the
  // entrance fade: transform was applied instantly, transition restored, and
  // then opacity assigned — so opacity animated on a cold load.
  const place = useCallback((x, y, opacity, { move, fade }) => {
    const el = markerRef.current;
    if (!el) return;
    const parts = [];
    if (move && !reduced) parts.push(`transform ${DUR}ms ${EASE}`);
    if (fade && !reduced) parts.push(`opacity ${FADE}ms ease`);
    el.style.transition = parts.length ? parts.join(", ") : "none";
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    el.style.opacity = String(opacity);
    if (!parts.length) void el.offsetHeight;
  }, [reduced]);

  const sync = useCallback(() => {
    const el = markerRef.current;
    if (!el) return;

    // The desktop rail. Below 900 .canvas is display:none, so a zero-width
    // rect is how we know we are looking at a rail that is not on screen.
    const rails = Array.from(document.querySelectorAll("html.rail-route .rail-nav, .wk-rail .rail-nav"));
    const rail = rails.find((r) => r.getBoundingClientRect().width > 0);

    if (rail) {
      // Refresh the cache from live geometry every time a rail is visible.
      rail.querySelectorAll("a[href]").forEach((a) => {
        const href = a.getAttribute("href");
        const r = a.getBoundingClientRect();
        if (r.width > 0) {
          cacheRef.current[href] = {
            x: Math.round(r.left),
            y: Math.round(r.top),
            color: getComputedStyle(rail).getPropertyValue("--accent").trim() || "#B5522E",
          };
        }
      });
    }

    const activeHref = railHrefFor(pathname);
    const target = activeHref ? cacheRef.current[activeHref] : cacheRef.current[EXIT_HREF];
    if (!target) {
      // Landed somewhere with no rail and no history of one — a cold load on
      // /work. Nothing to point at; stay hidden rather than guess.
      el.style.opacity = "0";
      return;
    }

    window.clearTimeout(fadeTimer.current);

    if (activeHref) {
      // Colour comes from the --accent custom property, read off the rail.
      // NOT from the active link's computed colour: that link now carries a
      // 280ms colour transition, so reading it mid-flight captures an
      // interpolated value — measured once at 83% of the way, which rendered
      // the marker a visibly different shade from the label beside it.
      // Custom properties do not animate here, so this is always the endpoint.
      el.style.color = target.color;

      const first = !placedRef.current;
      const wasHidden = el.style.opacity === "0";
      // Coming back from a route with no rail, the marker's last position is
      // stale — sliding in from it would claim a journey that never happened.
      place(target.x, target.y, 1, {
        move: !first && !wasHidden,
        fade: !first && wasHidden,
      });
      placedRef.current = true;
      return;
    }

    // Leaving to a route with no rail: travel to where "the work" was, then go.
    if (!placedRef.current) { el.style.opacity = "0"; return; }
    el.style.color = target.color;
    place(target.x, target.y, 1, { move: true, fade: true });
    fadeTimer.current = window.setTimeout(
      () => { if (markerRef.current) markerRef.current.style.opacity = "0"; },
      reduced ? 0 : DUR
    );
  }, [pathname, place, reduced]);

  // useLayoutEffect so the marker is positioned in the same frame the new route
  // paints — a useEffect here shows the marker at its old spot for one frame.
  useLayoutEffect(() => {
    if (narrow) {
      if (markerRef.current) markerRef.current.style.opacity = "0";
      return undefined;
    }
    // Arm the links' colour transition on the first NAVIGATION, never on
    // mount. Arming it a frame after mount still caught the tail of the route
    // wrapper settling, and the active link visibly animated from ink to
    // accent on a cold load — an entrance animation, which this site does not
    // have (PROJECT_CONTEXT). Before any navigation there is, by definition,
    // no colour change worth transitioning.
    if (lastPathRef.current !== null && lastPathRef.current !== pathname) {
      document.documentElement.classList.add("rail-travel-ready");
    }
    lastPathRef.current = pathname;
    // Two passes: one now, one after paint. The rail on a freshly mounted route
    // is measured before fonts settle, and JetBrains Mono loading late shifts
    // the links by a pixel or two.
    sync();
    const raf = window.requestAnimationFrame(sync);
    return () => window.cancelAnimationFrame(raf);
  }, [narrow, sync, pathname]);

  useEffect(() => {
    if (narrow) return undefined;
    const onResize = () => {
      placedRef.current = false; // reposition without animating across a resize
      sync();
    };
    window.addEventListener("resize", onResize);
    document.fonts && document.fonts.ready.then(sync).catch(() => {});
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(fadeTimer.current);
    };
  }, [narrow, sync]);

  if (narrow) return null;

  return (
    <span
      ref={markerRef}
      className="rail-travel"
      aria-hidden="true"
      style={{ opacity: 0 }}>
      &gt;
    </span>
  );
}
