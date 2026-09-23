// Runs after `vite build`. Two jobs, both for roadmap item 11 (soft-404).
//
// vercel.json rewrites only the site's real routes to index.html. Anything
// else falls through to dist/404.html, which Vercel serves with a real 404
// status, so crawlers stop seeing every mistyped URL as a live page.
//
// 1. dist/404.html is a copy of the built index.html. The app boots from it
//    and React Router renders the site's own NotFound page, so a visitor sees
//    exactly what they saw before; only the status code changed. Asset paths
//    in the build are absolute (/bundle/...), so it works at any depth.
//
// 2. The build fails if a route in src/routes.js has no rewrite. Without one,
//    clicking through to a new case study would work but opening its link
//    directly, or reloading it, would show the 404 page. This check is the
//    only thing standing between "added a case study" and that.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PROJECT_ROUTES, CHECK_ACCESS_FULL } from "../src/routes.js";

// fileURLToPath, not URL.pathname: the repo path contains a space.
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");

fs.copyFileSync(path.join(DIST, "index.html"), path.join(DIST, "404.html"));

// "/" needs no rewrite: Vercel serves dist/index.html for it directly.
const routes = ["/about", "/work", ...PROJECT_ROUTES.map((r) => r.path), CHECK_ACCESS_FULL];
const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, "vercel.json"), "utf8"));
const rewritten = new Set(vercel.rewrites.map((r) => r.source));
const missing = routes.filter((r) => !rewritten.has(r));

if (missing.length) {
  console.error(`\nvercel.json has no rewrite for: ${missing.join(", ")}`);
  console.error(`Add { "source": "<path>", "destination": "/index.html" } for each,`);
  console.error(`or direct visits to those pages will show the 404 page.\n`);
  process.exit(1);
}
