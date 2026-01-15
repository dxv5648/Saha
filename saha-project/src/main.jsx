import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ComparePage from "./pages/ComparePage.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ComparePage />
  </StrictMode>
);
