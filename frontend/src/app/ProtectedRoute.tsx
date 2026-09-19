import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "./hooks";
import { UserRole } from "../features/auth/authSlice";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "admin") {
      return <Navigate to="/admin/books" replace />;
    }
    return <Navigate to="/member/dashboard" replace />;
  }

  return children ? <>{children}</> : null;
};

export default ProtectedRoute;
