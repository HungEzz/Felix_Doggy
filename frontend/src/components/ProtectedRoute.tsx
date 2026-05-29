import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'ADMIN',
  redirectTo = '/',
}) => {
  const { isAdminLoggedIn, adminProfile } = useSelector((state: RootState) => state.user);

  // For admin routes, check the admin session (separate from user session)
  if (requiredRole.toUpperCase() === 'ADMIN') {
    if (!isAdminLoggedIn || !adminProfile) {
      return <Navigate to={redirectTo} replace />;
    }
    if (adminProfile.role?.toUpperCase() !== 'ADMIN') {
      return <Navigate to={redirectTo} replace />;
    }
    return <>{children}</>;
  }

  // Fallback for non-admin protected routes (uses user session)
  const { isLoggedIn, profile } = useSelector((state: RootState) => state.user);
  if (!isLoggedIn || !profile) {
    return <Navigate to={redirectTo} replace />;
  }
  if (profile.role?.toUpperCase() !== requiredRole.toUpperCase()) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
