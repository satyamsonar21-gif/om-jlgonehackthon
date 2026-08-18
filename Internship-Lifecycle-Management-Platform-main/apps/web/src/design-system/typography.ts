/**
 * Typography System for ILMP
 * - Inter: Primary UI & Body text
 * - Plus Jakarta Sans: Headings & Display
 * - IBM Plex Mono: Technical identifiers, codes, timestamps
 * - DM Serif Display: Digital Certificates only
 */

export const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    display: "'Plus Jakarta Sans', 'Inter', sans-serif",
    mono: "'IBM Plex Mono', 'JetBrains Mono', ui-monospace, monospace",
    serif: "'DM Serif Display', Georgia, serif",
  },
  fontSize: {
    '2xs': ['0.6875rem', { lineHeight: '0.95rem' }], // 11px
    xs: ['0.75rem', { lineHeight: '1.1rem' }],        // 12px
    sm: ['0.875rem', { lineHeight: '1.35rem' }],     // 14px
    base: ['0.9375rem', { lineHeight: '1.5rem' }],   // 15px
    md: ['1rem', { lineHeight: '1.55rem' }],         // 16px
    lg: ['1.125rem', { lineHeight: '1.65rem' }],     // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],      // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],       // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],  // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],    // 36px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  letterSpacing: {
    tighter: '-0.035em',
    tight: '-0.02em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};
