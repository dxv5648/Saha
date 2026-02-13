import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth.js";

export default function AdminRoute({ children }) {
  const { isAuthReady, user, isAdmin, isAdminLoading } = useAuth();
  const location = useLocation();

  // Don't render anything until we know the auth state AND admin status.
  // This prevents the "flash redirect" where the component momentarily
  // renders a <Navigate /> before the admin check resolves.
  if (!isAuthReady || isAdminLoading) return null;

  if (!user) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
