import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import {
  interpretResultadoInicial,
  type InterpretationKind,
} from '../domain';
import { calculatorTheme as theme } from '../theme';

const ICON: Record<InterpretationKind, keyof typeof Ionicons.glyphMap> = {
  positive: 'trending-up-outline',
  zero: 'remove-outline',
  negative: 'trending-down-outline',
};

const TONE: Record<InterpretationKind, string> = {
  positive: theme.color.success,
  zero: theme.color.accent,
  negative: theme.color.warning,
};

type ResultInterpretationProps = {
  resultadoInicial: number;
};

export function ResultInterpretation({
  resultadoInicial,
}: ResultInterpretationProps) {
  const interpretation = interpretResultadoInicial(resultadoInicial);
  const tone = TONE[interpretation.kind];

  return (
    <View
      style={[styles.card, { borderColor: tone }]}
      accessibilityRole="text"
      accessibilityLabel={`${interpretation.title}. ${interpretation.explanation}`}>
      <View style={styles.heading}>
        <Ionicons
          name={ICON[interpretation.kind]}
          size={24}
          color={tone}
          accessibilityElementsHidden
        />
        <Text style={[styles.title, { color: tone }]}>{interpretation.title}</Text>
      </View>
      <Text style={styles.explanation}>{interpretation.explanation}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.card,
    borderWidth: 2,
    padding: theme.space.lg,
    marginBottom: theme.space.xxl,
    ...theme.shadow,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
    marginBottom: theme.space.sm,
  },
  title: {
    flex: 1,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  explanation: {
    color: theme.color.text,
    fontSize: 16,
    lineHeight: 24,
  },
});
