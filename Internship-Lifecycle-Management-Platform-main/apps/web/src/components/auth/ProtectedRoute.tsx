import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { hasRole } from '@/lib/permissions';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-slate-600">
        <Loader2 className="animate-spin text-blue-600 mb-3" size={36} />
        <p className="text-xs font-semibold text-slate-500">Verifying session credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={`/sign-in?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Account Suspended Gatekeeper
  if (user.status === 'SUSPENDED') {
    return <Navigate to="/account-suspended" replace />;
  }

  // Pending Institutional Approval Gatekeeper
  if (user.status === 'PENDING_APPROVAL') {
    return <Navigate to="/pending-approval" replace />;
  }

  // RBAC Permission Check
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (user.role || '').toUpperCase();

    if (!hasRole(userRole, allowedRoles)) {
      return (
        <Navigate
          to={`/unauthorized?required=${encodeURIComponent(allowedRoles.join(','))}&actual=${encodeURIComponent(userRole)}`}
          replace
        />
      );
    }
  }

  return children ? <>{children}</> : <Outlet />;
}

export default ProtectedRoute;
