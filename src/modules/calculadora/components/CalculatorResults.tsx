import { StyleSheet, Text, View } from 'react-native';

import {
  RESULT_LABELS,
  formatMoney,
  type CalculatorResults as Results,
} from '../domain';
import { calculatorTheme as theme } from '../theme';

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
    <View style={styles.card} accessibilityRole="summary">
      <Text style={styles.title}>Resumen de resultados</Text>
      {RESULT_ORDER.map((key) => (
        <View key={key} style={styles.row}>
          <Text style={styles.label}>{RESULT_LABELS[key]}</Text>
          <Text style={styles.value}>{formatMoney(results[key])}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.card,
    padding: theme.space.lg,
    marginBottom: theme.space.xxl,
    ...theme.shadow,
  },
  title: {
    color: theme.color.secondary,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    marginBottom: theme.space.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.space.md,
    paddingVertical: theme.space.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.color.border,
  },
  label: {
    flex: 1,
    color: theme.color.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  value: {
    color: theme.color.text,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
});
