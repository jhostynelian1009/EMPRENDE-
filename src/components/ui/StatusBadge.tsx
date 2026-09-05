import React from 'react';
import { StyleSheet, View, Text, ViewStyle, StyleProp } from 'react-native';
import { colors, radii, spacing, typography } from '@/src/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export type StatusType =
  | 'pending'
  | 'started'
  | 'completed'
  | 'approved'
  | 'failed'
  | 'pending_integration';

export interface StatusBadgeProps {
  status: StatusType;
  customLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function StatusBadge({ status, customLabel, style }: StatusBadgeProps) {
  const getBadgeConfig = (): {
    label: string;
    bgColor: string;
    textColor: string;
    iconName: any;
  } => {
    switch (status) {
      case 'completed':
        return {
          label: customLabel || 'Completado',
          bgColor: '#DCFCE7', // verde suave
          textColor: colors.success,
          iconName: 'checkmark.circle.fill',
        };
      case 'approved':
        return {
          label: customLabel || 'Aprobado',
          bgColor: '#DCFCE7',
          textColor: colors.success,
          iconName: 'checkmark.seal.fill',
        };
      case 'started':
        return {
          label: customLabel || 'En progreso',
          bgColor: '#CCFBF1', // teal suave
          textColor: colors.accent,
          iconName: 'play.circle.fill',
        };
      case 'failed':
        return {
          label: customLabel || 'No aprobado',
          bgColor: '#FEE2E2', // rojo suave
          textColor: colors.error,
          iconName: 'xmark.circle.fill',
        };
      case 'pending_integration':
        return {
          label: customLabel || 'Pendiente de integración',
          bgColor: '#FEF3C7', // amarillo/naranja suave
          textColor: colors.warning,
          iconName: 'clock.fill',
        };
      case 'pending':
      default:
        return {
          label: customLabel || 'Pendiente',
          bgColor: '#F3F4F6', // gris suave
          textColor: colors.textMuted,
          iconName: 'ellipsis.circle.fill',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <View
      style={[styles.badge, { backgroundColor: config.bgColor }, style]}
      accessibilityRole="text"
      accessibilityLabel={`Estado: ${config.label}`}
    >
      <IconSymbol name={config.iconName} size={14} color={config.textColor} />
      <Text style={[styles.text, { color: config.textColor }]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radii.badge,
    alignSelf: 'flex-start',
    gap: spacing.xs,
  },
  text: {
    ...typography.caption,
    fontWeight: '600',
  },
});
