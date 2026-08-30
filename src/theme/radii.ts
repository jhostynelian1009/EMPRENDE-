export const radii = {
  card: 16,
  button: 12,
  field: 12,
  badge: 8,
  full: 9999,
} as const;

export type Radii = typeof radii;
