import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth.js";

export default function AdminRoute({ children }) {
  const { isAuthReady, user, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthReady) return null;

  if (!user) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
