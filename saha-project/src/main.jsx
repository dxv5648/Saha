import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./auth/AuthProvider.jsx";
import Home from "./home-page/home.jsx";
import Profile from "./profile-page/profile.jsx";
import Service from "./service-page/service.jsx";
import ServiceExpand from "./service-expand-page/service-expand.jsx";
import Cart from "./cart/cart.jsx";
import Payment from "./payment/payment.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Service" element={<Service />} />
          <Route path="/service/:serviceId" element={<ServiceExpand />} />
          <Route path="/Service-Expand" element={<ServiceExpand />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
