import React from "react";
import { Link, useLocation } from "react-router-dom";

// The main site rail — brief 2.7's "four duplicated copies become one".
//
// It was authored four times: a desktop copy inside each rail page's .stage and
// a mobile copy inside each .mobile-stack, identical apart from which item
// carries .active and a font-size on the mobile copies. The markup and the CSS
// were already byte-identical between Homepage and About; only the duplication
// was the problem.
//
// It stays a component rather than moving into RailLayout's own markup, because
// each page positions it inside its own composition: absolutely, within .stage
// on desktop, and in flow within .mobile-stack below 900px. A layout cannot
// reach into either.
//
// This is NOT the project section rail (LeftRail on the case studies). That one
// is an in-page table of contents with no site links. Different systems; the
// brief is explicit that they must not be merged.
//
// The contact item keeps the href it was authored with. It points at a page
// that is not in this repo, and the overlay's document-level [data-contact]
// handler calls preventDefault, so it is only reachable by middle-click — which
// now lands on the 404 rather than a server error. Left as authored.

const ITEMS = [
  { to: "/",      label: "my context" },
  { to: "/work",  label: "the work" },
  { to: "/about", label: "who am i?" },
];

// `active` overrides which item is lit, for a page that has announced where
// it is going before the route changes (the Homepage ⇄ Work transition).
// `onGo(to, event)` lets a page play its exit first: return true to take the
// navigation over, and the link's own navigation is cancelled.
export default function SiteRail({ variant = "desktop", active = null, onGo = null }) {
  const { pathname } = useLocation();
  const lit = active || pathname;

  // Mobile copies carry an inline 12px on every item, as authored.
  const itemStyle = variant === "mobile" ? { fontSize: 12 } : undefined;
  const navStyle = variant === "mobile" ? { position: "static", marginBottom: 40 } : undefined;

  return (
    <nav className="rail-nav" style={navStyle}>
      {ITEMS.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={lit === item.to ? "active" : undefined}
          onClick={onGo ? (e) => { if (onGo(item.to, e)) e.preventDefault(); } : undefined}
          style={itemStyle}>
          {item.label}
        </Link>
      ))}
      <a href="contact%20(old).html" data-contact aria-haspopup="dialog" style={itemStyle}>
        contact
      </a>
    </nav>
  );
}
