import React from 'react';
import { useAuth } from '@/lib/auth';
import { PermissionKey, hasPermission, hasRole } from '@/lib/permissions';

interface CanProps {
  role?: string | string[];
  permission?: PermissionKey;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function Can({ role, permission, fallback = null, children }: CanProps) {
  const { user, activeRole } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  // Role validation
  if (role) {
    const rolesArray = Array.isArray(role) ? role : [role];
    if (!hasRole(user.role, rolesArray)) {
      return <>{fallback}</>;
    }
  }

  // Permission validation
  if (permission) {
    if (!hasPermission(activeRole, permission)) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

export default Can;
