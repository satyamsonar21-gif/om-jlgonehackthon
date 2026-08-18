import { RoleKey } from '@/design-system/tokens';

export type PermissionKey =
  | 'view_listings'
  | 'apply_internships'
  | 'create_listings'
  | 'manage_own_listings'
  | 'review_applicants'
  | 'issue_offer_letter'
  | 'approve_tnp'
  | 'submit_daily_logs'
  | 'submit_weekly_reports'
  | 'evaluate_weekly_reports'
  | 'assign_sprint_tasks'
  | 'update_sprint_tasks'
  | 'clock_attendance'
  | 'submit_milestone_appraisal'
  | 'generate_crypto_certificates'
  | 'verify_certificates'
  | 'view_admin_analytics'
  | 'export_institutional_reports'
  | 'manage_system_settings'
  | 'verify_faculty_and_companies';

/**
 * Institutional RBAC Permission Matrix
 */
export const PERMISSION_MATRIX: Record<PermissionKey, Record<RoleKey, boolean>> = {
  view_listings: {
    student: true,
    faculty: true,
    company: true,
    admin: true,
  },
  apply_internships: {
    student: true,
    faculty: false,
    company: false,
    admin: true, // Administrative proxy assist
  },
  create_listings: {
    student: false,
    faculty: false,
    company: true,
    admin: true,
  },
  manage_own_listings: {
    student: false,
    faculty: false,
    company: true,
    admin: true,
  },
  review_applicants: {
    student: false,
    faculty: false,
    company: true,
    admin: true,
  },
  issue_offer_letter: {
    student: false,
    faculty: false,
    company: true,
    admin: true,
  },
  approve_tnp: {
    student: false,
    faculty: false,
    company: false,
    admin: true,
  },
  submit_daily_logs: {
    student: true,
    faculty: false,
    company: false,
    admin: true,
  },
  submit_weekly_reports: {
    student: true,
    faculty: false,
    company: false,
    admin: true,
  },
  evaluate_weekly_reports: {
    student: false,
    faculty: true,
    company: false,
    admin: true,
  },
  assign_sprint_tasks: {
    student: false,
    faculty: false,
    company: true,
    admin: true,
  },
  update_sprint_tasks: {
    student: true,
    faculty: false,
    company: true,
    admin: true,
  },
  clock_attendance: {
    student: true,
    faculty: false,
    company: true,
    admin: true,
  },
  submit_milestone_appraisal: {
    student: false,
    faculty: true,
    company: true,
    admin: true,
  },
  generate_crypto_certificates: {
    student: false,
    faculty: false,
    company: true,
    admin: true,
  },
  verify_certificates: {
    student: true,
    faculty: true,
    company: true,
    admin: true,
  },
  view_admin_analytics: {
    student: false,
    faculty: false,
    company: false,
    admin: true,
  },
  export_institutional_reports: {
    student: false,
    faculty: true,
    company: false,
    admin: true,
  },
  manage_system_settings: {
    student: false,
    faculty: false,
    company: false,
    admin: true,
  },
  verify_faculty_and_companies: {
    student: false,
    faculty: false,
    company: false,
    admin: true,
  },
};

/**
 * Check if a normalized role has a specific permission
 */
export function hasPermission(role: RoleKey, permission: PermissionKey): boolean {
  return Boolean(PERMISSION_MATRIX[permission]?.[role]);
}

/**
 * Check if a raw user role matches any allowed role strings
 */
export function hasRole(userRole: string | undefined, allowedRoles: string[]): boolean {
  if (!userRole) return false;
  const ur = userRole.toUpperCase();

  const normalizedUserRole =
    ur === 'COMPANY' ? 'COMPANY_MENTOR' :
    ur === 'FACULTY' ? 'FACULTY_MENTOR' :
    ur;

  return allowedRoles.some((role) => {
    const r = role.toUpperCase();
    if (r === ur || r === normalizedUserRole) return true;
    if (r === 'ADMIN' && ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'].includes(ur)) return true;
    if (r === 'FACULTY' && ['FACULTY', 'FACULTY_MENTOR'].includes(ur)) return true;
    if (r === 'COMPANY' && ['COMPANY', 'COMPANY_MENTOR'].includes(ur)) return true;
    return false;
  });
}
