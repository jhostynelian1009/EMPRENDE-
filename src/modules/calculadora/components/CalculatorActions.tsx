import React from 'react';
import { StyleSheet, View } from 'react-native';

import { PrimaryButton, SecondaryButton } from '@/src/components/ui';
import { spacing } from '@/src/theme';

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
        <PrimaryButton
          title="Calcular"
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
        <PrimaryButton
          title="Reintentar guardado"
          onPress={onRetrySave}
          loading={saving}
          accessibilityHint="Vuelve a guardar el último cálculo válido"
        />
      ) : null}
      <SecondaryButton
        title="Modificar datos"
        onPress={onModify}
      />
      <SecondaryButton title="Limpiar" onPress={onClear} />
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
});
