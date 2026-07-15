import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./App.jsx";
import "./index.css";

// No StrictMode: its dev-only double-mounting forces WebGL context loss in
// react-three-fiber's Canvas teardown/reinit, intermittently killing the
// model viewer on piece pages (r3f#1151). Production semantics are identical.
createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
