"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = "/login",
  requireAuth = true 
}) => {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && !authState.isAuthenticated) {
      const currentPath = window.location.pathname;
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
      router.push(redirectUrl);
    }
  }, [authState.isAuthenticated, requireAuth, redirectTo, router]);

  // Show loading state while checking authentication
  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if auth is required but user is not authenticated
  if (requireAuth && !authState.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;