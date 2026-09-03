import { ViewStyle } from 'react-native';

export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  } as ViewStyle,
} as const;

export type Shadows = typeof shadows;
