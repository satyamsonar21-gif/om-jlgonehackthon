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
  isDark: boolean;
}

export const themes: Record<RoleKey, RoleTheme> = {
  student: {
    name: 'student',
    label: 'Student',
    iconName: 'GraduationCap',
    tagline: 'Learning progress, tasks & milestone achievements',
    primary: '#6B4E3D',          // Deep roast espresso coffee
    primaryHover: '#523B2E',
    secondary: '#A67C52',        // Warm caramel / golden mocha
    accentSoft: '#F3E9DD',       // Warm cream linen
    highlights: '#A67C52',       // Caramel highlight
    cta: '#A67C52',              // CTA button
    ctaHover: '#8C6540',
    ctaText: '#FFFFFF',          // Crisp white text on caramel
    bg: '#F3E9DD',               // Primary warm cream background
    surface: '#FFFFFF',          // Pure white cards
    surfaceMuted: '#E6D5C1',     // Warm sand oat
    border: '#E6D5C1',           // Warm sand border
    text: '#6B4E3D',             // Deep roast espresso text
    textMuted: '#8C7362',        // Soft coffee muted text
    ring: 'rgba(166, 124, 82, 0.3)',
    badgeBg: '#E6D5C1',
    badgeText: '#6B4E3D',
    isDark: false,
  },
  faculty: {
    name: 'faculty',
    label: 'Faculty',
    iconName: 'BookOpen',
    tagline: 'Evaluation matrices, reviews & academic guidance',
    primary: '#1B4322',          // Emerald Green main brand
    primaryHover: '#143319',
    secondary: '#038666',        // Secondary Teal Emerald
    accentSoft: '#E6F4EA',
    highlights: '#038666',       // Highlights
    cta: '#FBB02D',              // CTA Buttons (Warm Amber Gold)
    ctaHover: '#F59E0B',
    ctaText: '#081C15',          // Dark forest contrast text
    bg: '#F4F8F6',               // Clean light sage-white background
    surface: '#FFFFFF',          // Pure white cards
    surfaceMuted: '#E8F2EC',     // Soft sage surface
    border: '#D0E4D8',           // Soft sage border
    text: '#0D2B20',             // Deep forest dark text
    textMuted: '#3A6351',        // Muted forest text
    ring: 'rgba(3, 134, 102, 0.25)',
    badgeBg: '#E0F0E6',
    badgeText: '#1B4322',
    isDark: false,
  },
  company: {
    name: 'company',
    label: 'Company Mentor',
    iconName: 'Building2',
    tagline: 'Industry projects, candidate reviews & team milestones',
    primary: '#5400DE',          // Primary vibrant violet
    primaryHover: '#4200B3',
    secondary: '#9E2A2B',        // Secondary crimson maroon
    accentSoft: '#F8E9FC',
    highlights: '#E089F3',       // Accent/CTA
    cta: '#5400DE',              // CTA Buttons (Royal Violet)
    ctaHover: '#4200B3',
    ctaText: '#FFFFFF',          // Pure white text on CTA
    bg: '#FFF8F0',               // Warm soft ivory canvas
    surface: '#FFFFFF',          // Crisp white cards
    surfaceMuted: '#FAF0E6',     // Warm cream surface
    border: '#E2D9D2',           // Muted borders
    text: '#1E1428',             // Deep contrast text on light bg
    textMuted: '#6E6766',        // Muted gray-brown text
    ring: 'rgba(84, 0, 222, 0.25)',
    badgeBg: '#F5E6FB',
    badgeText: '#5400DE',
    isDark: false,
  },
  admin: {
    name: 'admin',
    label: 'Administrator',
    iconName: 'Shield',
    tagline: 'Institutional governance, access control & audit logs',
    primary: '#3C096C',          // Deep royal purple
    primaryHover: '#240046',
    secondary: '#7C3AED',        // Vibrant purple accent
    accentSoft: '#F3E8FF',       // Soft airy lavender
    highlights: '#7C3AED',       // Purple highlight
    cta: '#FBB02D',              // CTA Buttons (Amber Gold)
    ctaHover: '#F59E0B',
    ctaText: '#03071E',          // Deep obsidian contrast text
    bg: '#FAF5FF',               // Light airy lavender canvas
    surface: '#FFFFFF',          // Crisp pure white cards
    surfaceMuted: '#F3E8FF',     // Soft light lilac section background
    border: '#E9D5FF',           // Soft lilac border
    text: '#03071E',             // Deep obsidian dark text
    textMuted: '#6B21A8',        // Rich purple muted text
    ring: 'rgba(124, 58, 237, 0.25)',
    badgeBg: '#ECCAFF',          // Soft pastel lavender badge
    badgeText: '#03071E',        // Deep obsidian text
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
  
  root.setAttribute('data-role', role);
}
