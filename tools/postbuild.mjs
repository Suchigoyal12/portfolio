// Runs after `vite build`. Four jobs.
//
// vercel.json rewrites only the site's real routes, each to its own file.
// Anything else falls through to dist/404.html, which Vercel serves with a
// real 404 status, so crawlers stop seeing every mistyped URL as a live page
// (roadmap item 11).
//
// 1. dist/404.html is a copy of the built index.html. The app boots from it
//    and React Router renders the site's own NotFound page, so a visitor sees
//    exactly what they saw before; only the status code changed. Asset paths
//    in the build are absolute (/bundle/...), so it works at any depth.
//    It is copied FIRST, before job 2 writes Home's reading copy into
//    index.html: a 404 page has no reading copy of its own.
//
// 2. Each route gets its own file with its reading copy inside, the text of
//    the page for readers that don't run JavaScript (tools/reading-copy.mjs).
//    "/" is index.html; /about is about.html; /work/check-access/full is
//    work/check-access/full.html. Visitors see no difference.
//
// 3. The build fails if a route in src/routes.js has no rewrite, or its
//    rewrite points anywhere but its own file. Without one, clicking through
//    to a new case study would work but opening its link directly, or
//    reloading it, would show the 404 page. This check is the only thing
//    standing between "added a case study" and that.
//
// 4. dist/sitemap.xml is written from the same route list, so a new case
//    study appears in it without anyone remembering to add it. The detailed
//    Admin Shell is not in src/routes.js, so it can never be listed. The
//    domain is read from index.html's canonical link rather than typed again
//    here, and the build fails if public/robots.txt points its Sitemap: line
//    anywhere else: one less absolute URL to miss when the domain changes.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ROUTES, routeFile, writeReadingCopy } from "./reading-copy.mjs";

// fileURLToPath, not URL.pathname: the repo path contains a space.
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");

fs.copyFileSync(path.join(DIST, "index.html"), path.join(DIST, "404.html"));

await writeReadingCopy(DIST);

// "/" needs no rewrite: Vercel serves dist/index.html for it directly.
const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, "vercel.json"), "utf8"));
const rewrites = new Map(vercel.rewrites.map((r) => [r.source, r.destination]));
const wrong = ROUTES.filter((r) => r !== "/").filter((r) => rewrites.get(r) !== `/${routeFile(r)}`);

if (wrong.length) {
  console.error(`\nvercel.json is missing or misdirects the rewrite for: ${wrong.join(", ")}`);
  console.error(`Each needs { "source": "<path>", "destination": "/<path>.html" },`);
  console.error(`for example { "source": "/about", "destination": "/about.html" },`);
  console.error(`or direct visits to those pages will show the 404 page.\n`);
  process.exit(1);
}

const html = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
if (!canonical) {
  console.error(`\nindex.html has no <link rel="canonical">; the sitemap needs it for the domain.\n`);
  process.exit(1);
}
const origin = new URL(canonical).origin;

const robots = fs.readFileSync(path.join(DIST, "robots.txt"), "utf8");
const sitemapUrl = `${origin}/sitemap.xml`;
if (!robots.split("\n").some((l) => l.trim() === `Sitemap: ${sitemapUrl}`)) {
  console.error(`\npublic/robots.txt needs the line "Sitemap: ${sitemapUrl}",`);
  console.error(`matching the canonical link in index.html.\n`);
  process.exit(1);
}

const urls = ROUTES.map((r) => `  <url><loc>${origin}${r}</loc></url>`);
fs.writeFileSync(
  path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
);
