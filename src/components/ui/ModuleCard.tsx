import React from 'react';
import { StyleSheet, View, Text, Pressable, ViewStyle, StyleProp } from 'react-native';
import { colors, radii, shadows, spacing, typography } from '@/src/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { StatusBadge, StatusType } from './StatusBadge';

export interface ModuleCardProps {
  title: string;
  description: string;
  iconName: any;
  status: StatusType;
  statusLabel?: string;
  actionTitle: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ModuleCard({
  title,
  description,
  iconName,
  status,
  statusLabel,
  actionTitle,
  onPress,
  disabled = false,
  style,
}: ModuleCardProps) {
  return (
    <View
      style={[
        styles.card,
        disabled && styles.cardDisabled,
        style,
      ]}
      accessibilityRole="summary"
      accessibilityLabel={`${title}, ${description}. Estado: ${statusLabel || status}`}
    >
      <View style={styles.headerRow}>
        <View style={[styles.iconContainer, disabled && styles.iconContainerDisabled]}>
          <IconSymbol
            name={iconName}
            size={24}
            color={disabled ? colors.textMuted : colors.primary}
          />
        </View>
        <StatusBadge status={status} customLabel={statusLabel} />
      </View>

      <Text style={[styles.title, disabled && styles.textDisabled]}>{title}</Text>
      <Text style={[styles.description, disabled && styles.textDisabled]} numberOfLines={2}>
        {description}
      </Text>

      <View style={styles.footer}>
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={({ pressed }) => [
            styles.actionButton,
            disabled && styles.actionButtonDisabled,
            pressed && !disabled && styles.actionButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`${actionTitle} en ${title}`}
          accessibilityState={{ disabled }}
        >
          <Text style={[styles.actionText, disabled && styles.actionTextDisabled]}>
            {actionTitle}
          </Text>
          <IconSymbol
            name="chevron.right"
            size={16}
            color={disabled ? colors.textMuted : colors.primaryDark}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.lg,
    width: 250,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'space-between',
    ...shadows.card,
  },
  cardDisabled: {
    backgroundColor: '#F9FAFB',
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radii.button,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerDisabled: {
    backgroundColor: '#E5E7EB',
  },
  title: {
    ...typography.h3,
    color: colors.secondary,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    minHeight: 40,
  },
  textDisabled: {
    color: colors.textMuted,
  },
  footer: {
    marginTop: 'auto',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.button,
    minHeight: 44,
  },
  actionButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  actionButtonPressed: {
    opacity: 0.8,
  },
  actionText: {
    ...typography.label,
    color: colors.primaryDark,
  },
  actionTextDisabled: {
    color: colors.textMuted,
  },
});
