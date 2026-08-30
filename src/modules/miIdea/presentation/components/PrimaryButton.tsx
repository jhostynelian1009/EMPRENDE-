import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { MiIdeaColors } from '../theme/colors';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
}

export function PrimaryButton({ title, loading, disabled, style, ...props }: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isDisabled && styles.buttonDisabled,
        style
      ]}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={MiIdeaColors.surface} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: MiIdeaColors.primaryDark,
    minHeight: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    color: MiIdeaColors.surface,
    fontSize: 16,
    fontWeight: '600',
  }
});
