import * as React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { App } from  "./App";

const domNode = document.getElementById("root");

const router = createBrowserRouter([
  {
    path: "*",
    element: <App/>
  }
]);

if (domNode) {
  createRoot(domNode).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
} else {
  console.log('Error: could not initialize React DOM due to "root" node missing');
}
