import React from 'react';
import { StyleSheet, View, Text, ViewStyle, StyleProp } from 'react-native';
import { colors, radii, spacing, typography } from '@/src/theme';

export interface ProgressBarProps {
  progress: number; // 0 a 100
  showLabel?: boolean;
  label?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function ProgressBar({
  progress,
  showLabel = true,
  label,
  style,
  accessibilityLabel,
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clampedProgress }}
      accessibilityLabel={accessibilityLabel || label || `Progreso: ${clampedProgress}%`}
    >
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label || 'Progreso'}</Text>
          <Text style={styles.percentage}>{clampedProgress}%</Text>
        </View>
      )}

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clampedProgress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
  },
  percentage: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.accent,
  },
  track: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: radii.full,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: radii.full,
  },
});
