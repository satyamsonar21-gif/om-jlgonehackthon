/**
 * Unified Color System for ILMP
 * Foundation: Slate & Clean Neutral
 * Role Accents: Semantic accent per user portal
 */

export const baseColors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F5F9',
  surfaceSubtle: '#F8FAFC',
  border: '#E2E8F0',
  borderSubtle: '#F1F5F9',
  borderStrong: '#CBD5E1',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textSubtle: '#94A3B8',
};

export const semanticColors = {
  success: {
    base: '#16A34A',
    light: '#DCFCE7',
    border: '#BBF7D0',
    dark: '#15803D',
    text: '#166534',
  },
  warning: {
    base: '#D97706',
    light: '#FEF3C7',
    border: '#FDE68A',
    dark: '#B45309',
    text: '#92400E',
  },
  danger: {
    base: '#DC2626',
    light: '#FEE2E2',
    border: '#FECACA',
    dark: '#B91C1C',
    text: '#991B1B',
  },
  info: {
    base: '#2563EB',
    light: '#DBEAFE',
    border: '#BFDBFE',
    dark: '#1D4ED8',
    text: '#1E40AF',
  },
  neutral: {
    base: '#64748B',
    light: '#F1F5F9',
    border: '#E2E8F0',
    dark: '#475569',
    text: '#334155',
  },
};

export const roleAccents = {
  student: {
    primary: '#D97706',       // Amber / Warm Terracotta
    primaryHover: '#B45309',
    primaryLight: '#FFFBEB',
    primarySubtle: '#FEF3C7',
    border: '#FDE68A',
    text: '#92400E',
    ring: 'rgba(217, 119, 6, 0.35)',
    label: 'Student',
  },
  faculty: {
    primary: '#059669',       // Emerald
    primaryHover: '#047857',
    primaryLight: '#ECFDF5',
    primarySubtle: '#D1FAE5',
    border: '#A7F3D0',
    text: '#065F46',
    ring: 'rgba(5, 150, 105, 0.35)',
    label: 'Faculty Guide',
  },
  company: {
    primary: '#4F46E5',       // Royal Indigo
    primaryHover: '#4338CA',
    primaryLight: '#EEF2FF',
    primarySubtle: '#E0E7FF',
    border: '#C7D2FE',
    text: '#3730A3',
    ring: 'rgba(79, 70, 229, 0.35)',
    label: 'Company Mentor',
  },
  admin: {
    primary: '#0284C7',       // Azure / Sky
    primaryHover: '#0369A1',
    primaryLight: '#F0F9FF',
    primarySubtle: '#E0F2FE',
    border: '#BAE6FD',
    text: '#075985',
    ring: 'rgba(2, 132, 199, 0.35)',
    label: 'Administrator',
  },
};
