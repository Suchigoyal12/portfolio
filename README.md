# Portfolio

Design portfolio of Suchi, product designer and design technologist.

Live site: https://suchigoyal.com

## Stack

- React 18 and React Router 7, in plain JavaScript (JSX)
- Vite 7 for the dev server and production build
- Plain CSS with custom properties, no CSS framework or preprocessor
- Google Fonts: DM Sans, Cormorant Garamond, JetBrains Mono, plus Archivo for the wordmark
- Hosted on Vercel, with Vercel Analytics
- Playwright, pixelmatch and pngjs for pixel-parity testing and the build's no-JavaScript reading copy
- Node scripts in `tools/` for post-build route checks, copy linting and image sizing

## How it was built

I designed and built this site myself using AI-assisted development. Designed using Figma, Google Stitch, Jitter and built with Claude Design, Claude Code.
It started as nine standalone pages exported from Claude Design: three written in HTML, CSS and vanilla JavaScript, and six that loaded React from a CDN and compiled it in the browser.
I migrated them into a single Vite and React Router app with clean URLs, porting one page at a time and checking each against the live original with a pixel-diff harness (`tools/compare.mjs`), so the move changed nothing a visitor could see.
The design system is documented in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md): type scale, color tokens, spacing, components and motion.
Tokens are CSS custom properties in each route's stylesheet in `src/routes/`; shared components live in `src/components/`, `src/layouts/` and `src/site/`.

## Run locally

Requires Node 20.19 or later.

```bash
npm install
npm run dev
```

The site runs at http://localhost:5173.

For a production build, install Playwright's Chromium once (the build uses it to generate reading copy), then build and preview:

```bash
npx playwright install chromium
npm run build
npm run preview
```
