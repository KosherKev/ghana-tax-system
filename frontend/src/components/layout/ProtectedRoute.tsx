/**
 * ProtectedRoute — guards admin routes behind JWT authentication.
 * Full implementation in Phase 8.
 */
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "SYS_ADMIN" | "TAX_ADMIN";
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}
