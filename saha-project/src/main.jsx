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
import AdminRoute from "./admin/AdminRoute.jsx";
import AdminModeration from "./admin/AdminModeration.jsx";
import AdminUsers from "./admin/AdminUsers.jsx";
import Payment from "./payment/payment.jsx";
import PaymentSuccess from "./payment/payment-success.jsx";

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
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminModeration />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
