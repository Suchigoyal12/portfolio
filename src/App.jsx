import React from "react";
import { Routes, Route } from "react-router-dom";

import RailLayout from "./layouts/RailLayout.jsx";
import WorkLayout from "./layouts/WorkLayout.jsx";
import { ContactProvider } from "./components/ContactOverlay.jsx";

import Home from "./routes/Home.jsx";
import About from "./routes/About.jsx";
import Work from "./routes/Work.jsx";
import CheckAccessFull from "./routes/CheckAccessFull.jsx";
import NotFound from "./routes/NotFound.jsx";

// The four case studies are no longer imported here. They are reached through
// Work, which is the single component behind /work/:slug? — see the route
// comment below.

// Two layouts, per brief 2.2, and they are not interchangeable:
//
//   RailLayout — the main site rail plus the fit() scaling system. Used by
//                / and /about only. Nothing else may call fit().
//   WorkLayout — the stage manager's chrome. Used by /work and every
//                project route.
//
// The project section rail (LeftRail) is a third, separate thing that lives
// inside the project pages themselves. It is an in-page table of contents,
// it carries no site links, and it must not be merged into either layout.
//
// ContactProvider sits outside <Routes> so the overlay can open above any
// route without changing the URL. Contact is not a page.
export default function App() {
  return (
    <ContactProvider>
      <Routes>
        <Route element={<RailLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Route>

        <Route element={<WorkLayout />}>
          {/* Two entries, and the shapes matter.

              `/work/:slug?` is ONE route for /work and all four project URLs,
              rather than five. The stage manager keeps an iframe per project
              and only ever mounts each one once; if focusing a project meant
              matching a different Route, React would tear the stage down and
              rebuild it, reloading all four iframes and losing their scroll
              positions on every card click. One route means changing the slug
              is a prop change and the stage never unmounts.

              The long Check Access page is deliberately NOT part of that. It
              is two segments deep, so `:slug?` cannot match it, and it is not
              a card — it is reached from inside the short version and never
              enters the stack. */}
          <Route path="/work/check-access/full" element={<CheckAccessFull />} />
          <Route path="/work/:slug?" element={<Work />} />
        </Route>

        {/* Last, and in neither layout — a not-found page gets no site rail,
            no fit() scaling and no stage chrome. Everything Vercel cannot
            match to a real file arrives here. */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ContactProvider>
  );
}
