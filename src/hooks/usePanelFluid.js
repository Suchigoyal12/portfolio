import { useEffect } from "react";

// Quick Background panel — fluid-repel cursor interaction.
// Ported from legacy/index.html's second <script>, maths unchanged.
//
// Level-set field: phi = min(rectSDF, CAP) - A*exp(-d^2/2σ^2)
// Fill blue where phi > T. Void reveals paper (--bg-landing).
// Scoped to the panel only. Touch/reduced-motion => flat blue.
//
// One adaptation: the original read --bg-landing and --panel-fill off
// document.documentElement, because they were declared on :root. They now live
// on .route-home, so they are read from the panel element, which inherits
// them. Same values, one level down.

export function usePanelFluid({ panelRef, canvasRef }) {
  useEffect(() => {
    // ---- Tunable constants ----
    const A     = 42;   // repulsion strength / void depth
    const SIGMA = 24;   // void spread
    const CAP   = 14;   // interior plateau
    const AA    = 0.9;  // edge crispness — lower is sharper
    const KVOL  = 0.35; // compensating bulge, redistributed inward only (eraser <-> fluid)
    const M     = 0;    // rest rect = full panel box (outer edge pinned, blue aligns to text)
    const CR    = 0;    // corner radius — matches the panel's square corners
    const TRAIL = 1.4;  // velocity wake

    const SETTLE_MS   = 900;  // keep animating this long after pointer leaves
    const SMOOTH      = 0.35; // pointer smoothing per frame
    const GAUSS_CUT   = 3.4;  // only evaluate exp() within this many σ

    const panel = panelRef.current;
    const canvas = canvasRef.current;
    if (!panel || !canvas) return;

    const coarse  = window.matchMedia("(hover: none)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // No-JS / incapable devices keep the CSS flat blue fill untouched.
    if (coarse || reduced) return;

    // Blue fill + paper read from the real tokens.
    const panelStyle = getComputedStyle(panel);
    const paper = panelStyle.getPropertyValue("--bg-landing").trim() || "#FBFAF6";
    const fill  = panelStyle.getPropertyValue("--panel-fill").trim() || "rgba(210,235,254,0.38)";
    const m = fill.match(/rgba?\(([^)]+)\)/i);
    const parts = m ? m[1].split(",").map((s) => parseFloat(s)) : [210, 235, 254, 0.38];
    const R = parts[0] || 210, G = parts[1] || 235, B = parts[2] || 254;
    const BASE_A = parts[3] === undefined ? 1 : parts[3]; // 0.38

    // Panel paints paper now; the canvas paints the blue fluid on top.
    const prevBackground = panel.style.background;
    const prevDisplay = canvas.style.display;
    panel.style.background = paper;
    canvas.style.display = "block";

    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, dpr = 1, img = null;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      const r = panel.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width  * dpr));
      H = Math.max(1, Math.round(r.height * dpr));
      canvas.width = W;
      canvas.height = H;
      img = ctx.createImageData(W, H);
    }
    resize();

    // Pointer state in device px, relative to the panel.
    let targetX = -1e5, targetY = -1e5;   // off-panel = flat
    let smoothX = -1e5, smoothY = -1e5;
    let prevX = -1e5, prevY = -1e5;
    let raf = null, leaving = false, leaveAt = 0;

    function onMove(e) {
      const r = panel.getBoundingClientRect();
      targetX = (e.clientX - r.left) * dpr;
      targetY = (e.clientY - r.top)  * dpr;
    }
    function onEnter(e) {
      leaving = false;
      onMove(e);
      if (smoothX < -9e4) { smoothX = targetX; smoothY = targetY; prevX = targetX; prevY = targetY; }
      start();
    }
    function onLeave() {
      leaving = true;
      leaveAt = performance.now();
      targetX = -1e5; targetY = -1e5;   // let the void ease closed
    }

    panel.addEventListener("pointerenter", onEnter);
    panel.addEventListener("pointermove", onMove);
    panel.addEventListener("pointerleave", onLeave);

    function draw() {
      // Smooth pointer + velocity wake center.
      smoothX += (targetX - smoothX) * SMOOTH;
      smoothY += (targetY - smoothY) * SMOOTH;
      const vx = smoothX - prevX, vy = smoothY - prevY;
      prevX = smoothX; prevY = smoothY;
      const cxp = smoothX + vx * TRAIL;
      const cyp = smoothY + vy * TRAIL;

      // Inset rounded-rect (CR=0 => plain rect) geometry.
      const bx = M, by = M, bw = W - 2 * M, bh = H - 2 * M;
      const cx = bx + bw / 2, cy = by + bh / 2;
      const ex = bw / 2 - CR, ey = bh / 2 - CR;
      const perim = 2 * (bw + bh);

      // Volume conservation: estimate carved area from cursor depth. The
      // compensation is applied LOCALLY (weighted by the Gaussian) so it only
      // redistributes fluid around the void — never a global level shift that
      // would move the far edges.
      let cursorSDF;
      {
        const qx = Math.abs(cxp - cx) - ex, qy = Math.abs(cyp - cy) - ey;
        const ox = Math.max(qx, 0), oy = Math.max(qy, 0);
        const sd = Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - CR;
        cursorSDF = -sd; // positive inside
      }
      const s = Math.min(cursorSDF, CAP);
      const ratio = (s - 0) / A;                 // base threshold 0 for the estimate
      let carvedArea = 0;
      if (ratio > 0 && ratio < 1) carvedArea = Math.PI * (-2 * SIGMA * SIGMA * Math.log(ratio));
      else if (ratio <= 0) carvedArea = Math.PI * (GAUSS_CUT * SIGMA) * (GAUSS_CUT * SIGMA);
      const carveComp = KVOL * carvedArea / perim; // positive magnitude, applied locally

      // Gaussian influence box (only evaluate exp within GAUSS_CUT*σ).
      const gR = GAUSS_CUT * SIGMA;
      const gx0 = Math.max(0, Math.floor(cxp - gR)), gx1 = Math.min(W - 1, Math.ceil(cxp + gR));
      const gy0 = Math.max(0, Math.floor(cyp - gR)), gy1 = Math.min(H - 1, Math.ceil(cyp + gR));
      const inv2s2 = 1 / (2 * SIGMA * SIGMA);
      const invAA = 1 / (2 * AA);
      const data = img.data;

      for (let y = 0; y < H; y++) {
        const dyc = Math.abs(y - cy) - ey;
        const inGX = (y >= gy0 && y <= gy1);
        const gdy = y - cyp;
        let row = y * W * 4;
        for (let x = 0; x < W; x++, row += 4) {
          // rounded-rect SDF (positive inside) of the REST rectangle
          const qx = Math.abs(x - cx) - ex;
          const ox = Math.max(qx, 0), oy = Math.max(dyc, 0);
          const sd = Math.sqrt(ox * ox + oy * oy) + Math.min(Math.max(qx, dyc), 0) - CR;
          const restSDF = -sd;
          // Pin the outer boundary: no fluid can exist past the rest rect,
          // independent of the volume/threshold term. Only inward carving.
          if (restSDF < 0) { data[row + 3] = 0; continue; }
          let phi = restSDF > CAP ? CAP : restSDF; // interior plateau
          // subtract Gaussian only near the cursor
          let g = 0;
          if (inGX && x >= gx0 && x <= gx1) {
            const gdx = x - cxp;
            const d2 = gdx * gdx + gdy * gdy;
            g = Math.exp(-d2 * inv2s2);
            phi -= A * g;
          }
          // Local threshold shift: compensation acts only in the void's
          // neighborhood (weighted by g), bulging fluid inward around the void.
          const localT = -carveComp * g;
          let a = 0.5 + (phi - localT) * invAA;
          if (a <= 0) { data[row + 3] = 0; continue; }
          if (a > 1) a = 1;
          data[row]     = R;
          data[row + 1] = G;
          data[row + 2] = B;
          data[row + 3] = (a * BASE_A * 255) | 0;
        }
      }
      ctx.putImageData(img, 0, 0);
    }

    function loop() {
      draw();
      if (leaving && performance.now() - leaveAt > SETTLE_MS) {
        raf = null;
        return; // settled — stop until next pointerenter
      }
      raf = requestAnimationFrame(loop);
    }
    function start() { if (!raf) raf = requestAnimationFrame(loop); }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    function onVisibility() {
      if (document.hidden) stop();
    }
    document.addEventListener("visibilitychange", onVisibility);

    let ro = null;
    function onResize() { resize(); draw(); }
    if (window.ResizeObserver) {
      ro = new ResizeObserver(function () {
        resize();
        draw(); // keep the flat/at-rest fill correct after size changes
      });
      ro.observe(panel);
    } else {
      window.addEventListener("resize", onResize);
    }

    draw(); // initial at-rest frame: full flat blue fill (no cursor => no void)

    // The original never unbound any of this — the page only ever went away
    // by navigating. A route change unmounts it now, so every listener, the
    // animation frame and the two inline styles have to come back off, or
    // StrictMode's second mount would run two draw loops over one canvas.
    return () => {
      stop();
      panel.removeEventListener("pointerenter", onEnter);
      panel.removeEventListener("pointermove", onMove);
      panel.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", onResize);
      panel.style.background = prevBackground;
      canvas.style.display = prevDisplay;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
