import React from "react";
import { Routes, Route } from "react-router-dom";

import RailLayout from "./layouts/RailLayout.jsx";
import WorkLayout from "./layouts/WorkLayout.jsx";
import { ContactProvider } from "./components/ContactOverlay.jsx";

import Home from "./routes/Home.jsx";
import About from "./routes/About.jsx";
import Work from "./routes/Work.jsx";
import CheckAccess from "./routes/CheckAccess.jsx";
import CheckAccessFull from "./routes/CheckAccessFull.jsx";
import AiTrustLayer from "./routes/AiTrustLayer.jsx";
import AdminShell from "./routes/AdminShell.jsx";
import ReleaseNotes from "./routes/ReleaseNotes.jsx";
import NotFound from "./routes/NotFound.jsx";

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
          <Route path="/work" element={<Work />} />
          <Route path="/work/check-access" element={<CheckAccess />} />
          <Route path="/work/check-access/full" element={<CheckAccessFull />} />
          <Route path="/work/ai-trust-layer" element={<AiTrustLayer />} />
          <Route path="/work/admin-shell" element={<AdminShell />} />
          <Route path="/work/release-notes" element={<ReleaseNotes />} />
        </Route>

        {/* Last, and in neither layout — a not-found page gets no site rail,
            no fit() scaling and no stage chrome. Everything Vercel cannot
            match to a real file arrives here. */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ContactProvider>
  );
}
