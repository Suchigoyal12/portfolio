import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

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
    </BrowserRouter>
  </React.StrictMode>
);
