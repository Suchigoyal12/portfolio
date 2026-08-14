import React from "react";
import Placeholder from "./_Placeholder.jsx";

// Card 03 — the PUBLIC version, rendered by
// legacy/site/page-admin-shell-public.jsx. The detailed case study it used
// to gate is not published and has no route; the gate is already static
// text. Do not re-link the two.
export default function AdminShell() {
  return <Placeholder source="legacy/admin-shell-public.html" />;
}
