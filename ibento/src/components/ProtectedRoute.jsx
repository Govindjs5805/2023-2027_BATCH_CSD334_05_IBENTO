import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRole }) {
  const { user, role, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/verify-email" />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/home" />;
  }

  return children;
}

export default ProtectedRoute;