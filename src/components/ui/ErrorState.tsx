import React from 'react';
import { StyleSheet, View, Text, ViewStyle, StyleProp } from 'react-native';
import { colors, spacing, typography } from '@/src/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SecondaryButton } from './SecondaryButton';

export interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
  retryTitle?: string;
  style?: StyleProp<ViewStyle>;
}

export function ErrorState({
  title = 'Ocurrió un problema',
  description,
  onRetry,
  retryTitle = 'Reintentar',
  style,
}: ErrorStateProps) {
  return (
    <View style={[styles.container, style]} accessibilityRole="alert">
      <View style={styles.iconContainer}>
        <IconSymbol name="exclamationmark.triangle.fill" size={32} color={colors.error} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {onRetry ? (
        <SecondaryButton
          title={retryTitle}
          onPress={onRetry}
          style={styles.button}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginVertical: spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.bodySmall,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  button: {
    minWidth: 140,
    borderColor: colors.error,
  },
});
