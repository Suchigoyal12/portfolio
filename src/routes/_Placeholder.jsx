import React from "react";
import { useLocation } from "react-router-dom";

// Scaffold-only. Every route renders this until its page is ported, in the
// order brief 2.8 sets: Homepage → About → Work → project pages, each one
// screenshot-compared against the deployed Stage 1 site before the next
// begins. Delete this file when the last route stops importing it.
//
// Intentionally unstyled — no fonts, no tokens, nothing that could be
// mistaken for design work in progress.
export default function Placeholder({ source }) {
  const { pathname } = useLocation();
  return (
    <main style={{ fontFamily: "monospace", padding: "2rem", lineHeight: 1.6 }}>
      <p>{pathname}</p>
      <p style={{ opacity: 0.6 }}>not ported yet — source: {source}</p>
    </main>
  );
}
