import * as React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom"
import { App } from  "./App";

const domNode = document.getElementById("root");

if (domNode) {
  createRoot(domNode).render(
    <StrictMode>
      <HashRouter>
        <Routes>
          <Route
            path="/"
            element={<App />}
          />
        </Routes>
      </HashRouter>
    </StrictMode>
  );
} else {
  console.log('Error: could not initialize React DOM due to "root" node missing');
}
