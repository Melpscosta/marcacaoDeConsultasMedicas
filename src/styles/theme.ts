/**
 * HealthConnect Design System
 * Design tokens para consistência visual, acessibilidade (WCAG AA) e usabilidade
 */
export default {
  colors: {
    primary: '#0066CC',
    primaryHover: '#0052A3',
    primaryMuted: 'rgba(0, 102, 204, 0.12)',
    secondary: '#00A878',
    secondaryHover: '#008F67',
    secondaryMuted: 'rgba(0, 168, 120, 0.12)',
    background: '#F8FCFF',
    surface: '#FFFFFF',
    text: '#1A202C',
    textSecondary: '#4A5568',
    textMuted: '#718096',
    error: '#E53E3E',
    errorMuted: 'rgba(229, 62, 62, 0.12)',
    success: '#00C896',
    successMuted: 'rgba(0, 200, 150, 0.12)',
    warning: '#D69E2E',
    warningMuted: 'rgba(214, 158, 46, 0.15)',
    white: '#FFFFFF',
    border: '#E2E8F0',
    borderFocus: '#0066CC',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  typography: {
    h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
    h2: { fontSize: 22, fontWeight: '600' as const, lineHeight: 28 },
    h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
    body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
    bodyMedium: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
    caption: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
    captionMedium: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
    small: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
    smallMedium: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16 },
    // Compatibilidade
    title: { fontSize: 28, fontWeight: '700' as const },
    subtitle: { fontSize: 18, fontWeight: '600' as const },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    // Aliases
    small: 8,
    medium: 16,
    large: 24,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
  },
  // Área mínima tocável para acessibilidade (44x44pt)
  touchTarget: 44,
};
