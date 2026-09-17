import React from "react";
import { AdminShellPublicPage } from "../site/page-admin-shell-public.jsx";
import { useProjectShell } from "./ProjectShell.jsx";
import "./adminshell.css";

// Card 03 — the PUBLIC version. The detailed case study it used to gate is not
// published and has no route; Stage 1 already replaced the passcode field with
// static text. Do not re-link the two.
//
// This page shows its hero topbar in windowed view as well as fullscreen,
// unlike its siblings. Its own stylesheet says that is the intent. Left alone.
export default function AdminShell() {
  useProjectShell({ variant: "admin-shell" });
  return <AdminShellPublicPage />;
}
