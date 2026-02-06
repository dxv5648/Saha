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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
