export type RoleKey = 'student' | 'faculty' | 'company' | 'admin';

export interface RoleTheme {
  name: string;
  label: string;
  iconName: string;
  tagline: string;
  primary: string;
  primaryHover: string;
  secondary: string;
  accentSoft: string;
  highlights: string;
  cta: string;
  ctaHover: string;
  ctaText: string;
  bg: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  text: string;
  textMuted: string;
  ring: string;
  badgeBg: string;
  badgeText: string;
  fontDisplay: string;
  fontBody: string;
  isDark: boolean;
}

export const themes: Record<RoleKey, RoleTheme> = {
  student: {
    name: 'student',
    label: 'Student',
    iconName: 'GraduationCap',
    tagline: 'Learning progress, tasks & milestone achievements',
    primary: '#0f172a',          // Slate 900
    primaryHover: '#1e293b',
    secondary: '#c2410c',        // Deep terracotta
    accentSoft: '#ffedd5',
    highlights: '#c2410c',
    cta: '#c2410c',              // High contrast terracotta CTA
    ctaHover: '#9a3412',
    ctaText: '#ffffff',
    bg: '#f8fafc',
    surface: '#ffffff',
    surfaceMuted: '#ffedd5',
    border: 'rgba(148, 163, 184, 0.25)',
    text: '#0f172a',
    textMuted: '#64748b',
    ring: 'rgba(194, 65, 12, 0.4)',
    badgeBg: '#fed7aa',
    badgeText: '#7c2d12',
    fontDisplay: "'Plus Jakarta Sans', 'Inter', sans-serif",
    fontBody: "'Inter', sans-serif",
    isDark: false,
  },
  faculty: {
    name: 'faculty',
    label: 'Faculty',
    iconName: 'BookOpen',
    tagline: 'Evaluation matrices, reviews & academic guidance',
    primary: '#064e3b',          // Deep forest
    primaryHover: '#022c22',
    secondary: '#059669',        // Emerald
    accentSoft: '#d1fae5',
    highlights: '#059669',
    cta: '#059669',              // High contrast Emerald CTA
    ctaHover: '#047857',
    ctaText: '#ffffff',
    bg: '#f4fbf7',
    surface: '#ffffff',
    surfaceMuted: '#d1fae5',
    border: 'rgba(5, 150, 105, 0.22)',
    text: '#064e3b',
    textMuted: '#065f46',
    ring: 'rgba(5, 150, 105, 0.4)',
    badgeBg: '#a7f3d0',
    badgeText: '#065f46',
    fontDisplay: "'Plus Jakarta Sans', 'Inter', sans-serif",
    fontBody: "'Inter', sans-serif",
    isDark: false,
  },
  company: {
    name: 'company',
    label: 'Company Mentor',
    iconName: 'Building2',
    tagline: 'Industry projects, candidate reviews & team milestones',
    primary: '#1e1b4b',          // Obsidian indigo
    primaryHover: '#0f0e26',
    secondary: '#4f46e5',        // Royal indigo
    accentSoft: '#e0e7ff',
    highlights: '#4f46e5',
    cta: '#4f46e5',              // Royal indigo CTA
    ctaHover: '#4338ca',
    ctaText: '#ffffff',
    bg: '#f8faff',
    surface: '#ffffff',
    surfaceMuted: '#e0e7ff',
    border: 'rgba(79, 70, 229, 0.22)',
    text: '#1e1b4b',
    textMuted: '#4338ca',
    ring: 'rgba(79, 70, 229, 0.4)',
    badgeBg: '#c7d2fe',
    badgeText: '#3730a3',
    fontDisplay: "'Plus Jakarta Sans', 'Inter', sans-serif",
    fontBody: "'Inter', sans-serif",
    isDark: false,
  },
  admin: {
    name: 'admin',
    label: 'Administrator',
    iconName: 'Shield',
    tagline: 'Institutional governance, access control & audit logs',
    primary: '#0f172a',          // Midnight steel
    primaryHover: '#0284c7',
    secondary: '#0284c7',        // Azure Sky
    accentSoft: '#e0f2fe',
    highlights: '#0284c7',
    cta: '#0284c7',              // Azure Sky CTA
    ctaHover: '#0369a1',
    ctaText: '#ffffff',
    bg: '#f8fafc',
    surface: '#ffffff',
    surfaceMuted: '#e0f2fe',
    border: 'rgba(2, 132, 199, 0.22)',
    text: '#0f172a',
    textMuted: '#0369a1',
    ring: 'rgba(2, 132, 199, 0.4)',
    badgeBg: '#bae6fd',
    badgeText: '#0369a1',
    fontDisplay: "'Plus Jakarta Sans', 'Inter', sans-serif",
    fontBody: "'Inter', sans-serif",
    isDark: false,
  },
};

export type LifecycleStage = 'DISCOVER' | 'APPLY' | 'SELECT' | 'ONBOARD' | 'WORK' | 'REVIEW' | 'CERTIFY';

export const lifecycleStages: LifecycleStage[] = [
  'DISCOVER',
  'APPLY',
  'SELECT',
  'ONBOARD',
  'WORK',
  'REVIEW',
  'CERTIFY'
];

export const motionTokens = {
  duration: {
    snappy: 0.2,
    normal: 0.28,
    smooth: 0.35,
  },
  easing: {
    tactile: [0.16, 1, 0.3, 1],
    spring: { type: 'spring' as const, stiffness: 450, damping: 35 },
  }
};

export function getRoleFromPath(pathname: string): RoleKey {
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/company')) return 'company';
  if (pathname.startsWith('/faculty')) return 'faculty';
  return 'student';
}

export function applyTheme(role: RoleKey) {
  if (typeof document === 'undefined') return;
  const theme = themes[role];
  const root = document.documentElement;
  
  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--primary-hover', theme.primaryHover);
  root.style.setProperty('--secondary', theme.secondary);
  root.style.setProperty('--accent-soft', theme.accentSoft);
  root.style.setProperty('--highlights', theme.highlights);
  root.style.setProperty('--cta', theme.cta);
  root.style.setProperty('--cta-hover', theme.ctaHover);
  root.style.setProperty('--cta-text', theme.ctaText);
  root.style.setProperty('--bg', theme.bg);
  root.style.setProperty('--surface', theme.surface);
  root.style.setProperty('--surface-muted', theme.surfaceMuted);
  root.style.setProperty('--border', theme.border);
  root.style.setProperty('--text', theme.text);
  root.style.setProperty('--text-muted', theme.textMuted);
  root.style.setProperty('--ring-color', theme.ring);
  root.style.setProperty('--font-display', theme.fontDisplay);
  root.style.setProperty('--font-body', theme.fontBody);
  
  root.setAttribute('data-role', role);
}
