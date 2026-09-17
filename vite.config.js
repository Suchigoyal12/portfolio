import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Deliberately minimal. No aliases, no PostCSS, no CSS transforms.
//
// The CSS is the design (migration brief 2.2) — every rule ported from the
// static pages must reach the browser exactly as authored, so nothing is
// allowed to rewrite, prefix, scope or reorder it. If a future need looks
// like it wants a CSS plugin here, that is a parity risk and worth a
// conversation first.
//
// publicDir defaults to public/, which is copied verbatim into dist/.
// Anything placed there is publicly reachable at its own URL — see
// .vercelignore for what that means for the non-public case study.
export default defineConfig({
  plugins: [react()],
  build: {
    // Vite's default output folder is dist/assets/, which is also where
    // public/assets/ lands — the site's own /assets/about/ and
    // /assets/audio/ URLs, which must not move. Two unrelated things
    // sharing one folder is a collision waiting to happen, so the build
    // output goes somewhere of its own.
    assetsDir: "bundle",
  },
});
