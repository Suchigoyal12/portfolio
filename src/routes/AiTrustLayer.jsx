import React from "react";
import { AITLProjectPage } from "../site/page-project-aitl.jsx";
import { useProjectShell } from "./ProjectShell.jsx";

// Card 02. The largest component in the project — 1,409 lines and 14 product
// screenshots. Its shell's inline CSS was byte-identical to Check Access's, so
// it shares project.css; unlike Check Access it carries no temporary
// is-fullscreen class, so opened directly it renders with no navigation. That
// is the Stage 1 behaviour and the parity reference until the Work step.
export default function AiTrustLayer() {
  useProjectShell();
  return <AITLProjectPage />;
}
