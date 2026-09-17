import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

// The catch-all. vercel.json rewrites every unmatched URL to index.html so
// deep links and hard refreshes survive, which means React Router — not the
// server — decides what an unknown address looks like. Without this route it
// rendered a blank white page.
//
// Real page, not a placeholder: it renders the approved mock. It sits
// outside both layouts on purpose — no rail, no fit() scaling, no stage
// chrome. Copy is final and verbatim.
export default function NotFound() {
  return (
    <div className="nf">
      <main className="nf-sheet">
        <div className="nf-rail">
          <Link className="nf-wordmark" to="/">SuCHI</Link>
          <p className="nf-status">404 · Not found</p>
        </div>

        <div>
          <h1 className="nf-display">Nothing lives at this address.</h1>
          <p className="nf-sub">The page may have moved.</p>
          <div className="nf-actions">
            <Link className="nf-link" to="/">
              <span className="nf-arrow">←</span>&nbsp; Homepage
            </Link>
            <Link className="nf-link is-secondary" to="/work">Work</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
