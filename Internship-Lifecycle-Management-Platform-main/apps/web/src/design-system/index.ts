import { baseColors, semanticColors, roleAccents } from './colors';
import { typography } from './typography';
import { spacing, radius, shadows, motion } from './spacing';

export * from './colors';
export * from './typography';
export * from './spacing';

export type RoleKey = 'student' | 'faculty' | 'company' | 'admin';

export interface RoleThemeConfig {
  name: RoleKey;
  label: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primarySubtle: string;
  border: string;
  text: string;
  ring: string;
}

export const themes: Record<RoleKey, RoleThemeConfig> = {
  student: {
    name: 'student',
    label: 'Student',
    primary: roleAccents.student.primary,
    primaryHover: roleAccents.student.primaryHover,
    primaryLight: roleAccents.student.primaryLight,
    primarySubtle: roleAccents.student.primarySubtle,
    border: roleAccents.student.border,
    text: roleAccents.student.text,
    ring: roleAccents.student.ring,
  },
  faculty: {
    name: 'faculty',
    label: 'Faculty Guide',
    primary: roleAccents.faculty.primary,
    primaryHover: roleAccents.faculty.primaryHover,
    primaryLight: roleAccents.faculty.primaryLight,
    primarySubtle: roleAccents.faculty.primarySubtle,
    border: roleAccents.faculty.border,
    text: roleAccents.faculty.text,
    ring: roleAccents.faculty.ring,
  },
  company: {
    name: 'company',
    label: 'Company Mentor',
    primary: roleAccents.company.primary,
    primaryHover: roleAccents.company.primaryHover,
    primaryLight: roleAccents.company.primaryLight,
    primarySubtle: roleAccents.company.primarySubtle,
    border: roleAccents.company.border,
    text: roleAccents.company.text,
    ring: roleAccents.company.ring,
  },
  admin: {
    name: 'admin',
    label: 'Administrator',
    primary: roleAccents.admin.primary,
    primaryHover: roleAccents.admin.primaryHover,
    primaryLight: roleAccents.admin.primaryLight,
    primarySubtle: roleAccents.admin.primarySubtle,
    border: roleAccents.admin.border,
    text: roleAccents.admin.text,
    ring: roleAccents.admin.ring,
  },
};

export type LifecycleStage = 'DISCOVER' | 'APPLY' | 'SELECT' | 'ONBOARD' | 'WORK' | 'REVIEW' | 'CERTIFY';

export const lifecycleStages: { stage: LifecycleStage; label: string; order: number }[] = [
  { stage: 'DISCOVER', label: 'Discover', order: 1 },
  { stage: 'APPLY', label: 'Apply', order: 2 },
  { stage: 'SELECT', label: 'Select', order: 3 },
  { stage: 'ONBOARD', label: 'Onboard', order: 4 },
  { stage: 'WORK', label: 'Work Logs', order: 5 },
  { stage: 'REVIEW', label: 'Weekly Review', order: 6 },
  { stage: 'CERTIFY', label: 'Certification', order: 7 },
];

export function getRoleFromPath(pathname: string): RoleKey {
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/company')) return 'company';
  if (pathname.startsWith('/faculty')) return 'faculty';
  return 'student';
}

export function applyTheme(role: RoleKey) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const theme = themes[role];

  root.setAttribute('data-role', role);
  root.style.setProperty('--role-accent', theme.primary);
  root.style.setProperty('--role-accent-hover', theme.primaryHover);
  root.style.setProperty('--role-accent-light', theme.primaryLight);
  root.style.setProperty('--role-accent-subtle', theme.primarySubtle);
  root.style.setProperty('--role-border', theme.border);
  root.style.setProperty('--role-text', theme.text);
  root.style.setProperty('--role-ring', theme.ring);
  
  // Legacy compatibility mappings
  root.style.setProperty('--cta', theme.primary);
  root.style.setProperty('--cta-hover', theme.primaryHover);
  root.style.setProperty('--cta-text', '#FFFFFF');
  root.style.setProperty('--highlights', theme.primary);
  root.style.setProperty('--accent-soft', theme.primaryLight);
  root.style.setProperty('--ring-color', theme.ring);
}
