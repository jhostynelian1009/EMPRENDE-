import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { calculatorTheme as theme } from '../theme';

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  accessibilityHint?: string;
};

function ActionButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  accessibilityHint,
}: ActionButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && !loading && styles.pressed,
      ]}>
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? theme.color.surface : theme.color.primaryDark}
        />
      ) : (
        <Text style={isPrimary ? styles.primaryLabel : styles.secondaryLabel}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

type CalculatorActionsProps = {
  phase: 'form' | 'result';
  saving: boolean;
  saveError: boolean;
  onCalculate: () => void;
  onModify: () => void;
  onClear: () => void;
  onRetrySave: () => void;
};

export function CalculatorActions({
  phase,
  saving,
  saveError,
  onCalculate,
  onModify,
  onClear,
  onRetrySave,
}: CalculatorActionsProps) {
  if (phase === 'form') {
    return (
      <View style={styles.group}>
        <ActionButton
          label="Calcular"
          onPress={onCalculate}
          loading={saving}
          accessibilityHint="Calcula costos, precio y recuperación inicial"
        />
      </View>
    );
  }

  return (
    <View style={styles.group}>
      {saveError ? (
        <ActionButton
          label="Reintentar guardado"
          onPress={onRetrySave}
          loading={saving}
          accessibilityHint="Vuelve a guardar el último cálculo válido"
        />
      ) : null}
      <ActionButton
        label="Modificar datos"
        variant="secondary"
        onPress={onModify}
      />
      <ActionButton label="Limpiar" variant="secondary" onPress={onClear} />
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: theme.space.md,
    marginBottom: theme.space.xxl,
  },
  button: {
    minHeight: 48,
    borderRadius: theme.radius.field,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.space.lg,
  },
  primary: {
    backgroundColor: theme.color.primaryDark,
  },
  secondary: {
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.color.primaryDark,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
  primaryLabel: {
    color: theme.color.surface,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
  },
  secondaryLabel: {
    color: theme.color.primaryDark,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
  },
});
