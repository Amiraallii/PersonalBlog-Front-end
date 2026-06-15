import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { type Role } from "../types/auth";

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles?: Role[]; 
  fallbackPath?: string; 
  isRoute?: boolean;     
}

export const RouteGuard = ({
  children,
  allowedRoles,
  fallbackPath = "/login",
  isRoute = false,
}: RouteGuardProps) => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return isRoute ? <Navigate to={fallbackPath} replace /> : null;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role as Role))) {
    return isRoute ? <Navigate to="/unauthorized" replace /> : null;
  }

  return <>{children}</>;
};