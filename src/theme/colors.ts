export const colors = {
  primary: '#F97316',
  primaryDark: '#C2410C',
  primaryLight: '#FFEDD5',
  secondary: '#17365D',
  accent: '#0F766E',
  background: '#FFF7ED',
  surface: '#FFFFFF',
  text: '#1F2937',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  success: '#15803D',
  warning: '#B45309',
  error: '#B91C1C',
} as const;

export type Colors = typeof colors;
