import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./home-page/home.jsx";
import Profile from "./profile-page/profile.jsx";
import Service from "./service-page/service.jsx";
import ServiceExpand from "./service-expand-page/service-expand.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Service" element={<Service />} />
        <Route path="/Service-Expand" element={<ServiceExpand />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
