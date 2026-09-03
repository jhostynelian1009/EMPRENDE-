import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ContentCard } from '@/src/components/ui/ContentCard';
import { colors, spacing, typography } from '@/src/theme';

import {
  RESULT_LABELS,
  formatMoney,
  type CalculatorResults as Results,
} from '../domain';

const RESULT_ORDER = [
  'costoVariableTotal',
  'costoTotal',
  'costoUnitario',
  'precioSugerido',
  'ingresosEstimados',
  'gananciaOperativa',
  'resultadoInicial',
] as const;

type CalculatorResultsProps = {
  results: Results;
};

export function CalculatorResults({ results }: CalculatorResultsProps) {
  return (
    <ContentCard style={styles.card} accessibilityLabel="Resumen de resultados">
      <Text style={styles.title}>Resumen de resultados</Text>
      {RESULT_ORDER.map((key) => (
        <View key={key} style={styles.row}>
          <Text style={styles.label}>{RESULT_LABELS[key]}</Text>
          <Text style={styles.value}>{formatMoney(results[key])}</Text>
        </View>
      ))}
    </ContentCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h3,
    color: colors.secondary,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    flex: 1,
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  value: {
    ...typography.label,
    color: colors.text,
  },
});
