import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./home-page/home.jsx";
import Testing from "./home-page/test-button.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/Testing" element={<Testing />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
