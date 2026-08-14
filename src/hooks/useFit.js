import { useLayoutEffect } from "react";

// The fit() scaling system, ported from legacy/index.html's first <script>.
// Homepage and About only — Work and the project routes never call it.
//
//   ≥1440      pure CSS. The stage is capped at 1440 and centred; fit() hands
//              the anchors back to CSS and writes nothing.
//   1300–1440  full-size type, no scaling. Column anchors lerp between their
//              @1440 and @1300 values so columns spread into the available
//              width rather than converging.
//   900–1300   uniform scale s = clientWidth / 1300 applied to the whole stage
//              as one unit, using the 1300 layout. Scatter preserved.
//   <900       early return; the mobile stack owns the layout.
//
// REFERENCE is 1300 and must not change. Homepage and About are both authored
// against it, and cross-page positional continuity depends on the two using an
// identical reference. It is not a number to tidy.
//
// Columns are passed in because they differ per page — PANEL_L and TOOLING_L
// here, SHELF_L on About. Each entry is { ref, at1440, at1300 }, matching the
// original's [value@1440, value@1300] pairs. If you change one of those values,
// change both: a single-value edit breaks one band.

export const REFERENCE = 1300;
const CAP = 1440;

export function useFit({ canvasRef, stageRef, columns }) {
  // useLayoutEffect, not useEffect: the scale has to be applied before paint,
  // or every route change onto this page shows one unscaled frame first.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || columns.some((c) => !c.ref.current)) return;

    function clearScale() {
      stage.style.left = "";
      stage.style.transform = "";
      stage.style.transformOrigin = "";
      stage.style.height = "";
    }

    function fit() {
      const forced =
        window.__fw ||
        parseInt((location.search.match(/[?&]fw=(\d+)/) || [])[1], 10) ||
        0;
      const w = forced || document.documentElement.clientWidth;
      const h = document.documentElement.clientHeight;
      if (w < 900) return; // mobile-stack owns this

      if (w >= CAP) {
        // Pure CSS layout — strip every inline override.
        clearScale();
        stage.style.width = "";
        columns.forEach((c) => {
          c.ref.current.style.left = "";
        });
        return;
      }

      if (w >= REFERENCE) {
        // Band A: full type, re-anchor the middle columns.
        clearScale();
        stage.style.width = w + "px";
        const t = (w - REFERENCE) / (CAP - REFERENCE); // 0 at 1300 → 1 at 1440
        columns.forEach((c) => {
          c.ref.current.style.left = c.at1300 + (c.at1440 - c.at1300) * t + "px";
        });
        return;
      }

      // Band B: uniform scale-down of the whole stage, using the 1300 layout.
      const s = w / REFERENCE;
      stage.style.width = REFERENCE + "px";
      stage.style.height = h / s + "px";
      columns.forEach((c) => {
        c.ref.current.style.left = c.at1300 + "px";
      });
      stage.style.left = "50%";
      stage.style.transformOrigin = "top center";
      stage.style.transform = "translateX(-50%) scale(" + s + ")";
    }

    // Runs on mount as well as on resize: .stage remounts on every route
    // change, so a resize-only binding would leave the first paint unscaled.
    fit();
    window.addEventListener("resize", fit);
    window.__fit = fit;

    // ?fw=NNNN renders that width, scaled to fit the real viewport. A testing
    // affordance the conventions document describes — kept, not inherited by
    // accident.
    const forced =
      parseInt((location.search.match(/[?&]fw=(\d+)/) || [])[1], 10) || 0;
    const canvasEl = canvasRef.current;
    if (forced && canvasEl) {
      if (forced >= CAP) stage.style.width = CAP + "px";
      const real = document.documentElement.clientWidth;
      canvasEl.style.transformOrigin = "top left";
      canvasEl.style.transform = "scale(" + real / forced + ")";
    }

    return () => {
      window.removeEventListener("resize", fit);
      if (window.__fit === fit) delete window.__fit;
      clearScale();
      stage.style.width = "";
      columns.forEach((c) => {
        if (c.ref.current) c.ref.current.style.left = "";
      });
      if (forced && canvasEl) {
        canvasEl.style.transformOrigin = "";
        canvasEl.style.transform = "";
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
