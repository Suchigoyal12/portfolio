import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import App from "./App.jsx";
import "./base.css";

// Analytics sits beside <App />, outside every route, so it is mounted once
// and sees each client-side navigation as its own page view. It renders
// nothing. Counting only starts once Analytics is enabled for the project
// in the Vercel dashboard.
//
// StrictMode is on deliberately, and should stay on through the port.
//
// It double-invokes effects in development, which is exactly the noise
// needed while porting fit() (brief 2.5): a resize listener that is added
// but never cleaned up shows up immediately as a duplicate rather than as
// a subtle layout bug weeks later. It has no effect on the production build.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Analytics />
    </BrowserRouter>
  </React.StrictMode>
);
