import React from 'react';
import { StyleSheet, View, Text, ViewStyle, StyleProp } from 'react-native';
import { colors, spacing, typography } from '@/src/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PrimaryButton } from './PrimaryButton';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
  iconName?: any;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({
  title,
  description,
  actionTitle,
  onAction,
  iconName = 'tray',
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]} accessibilityRole="summary">
      <View style={styles.iconContainer}>
        <IconSymbol name={iconName} size={36} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {actionTitle && onAction ? (
        <PrimaryButton
          title={actionTitle}
          onPress={onAction}
          style={styles.button}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    minWidth: 160,
  },
});
