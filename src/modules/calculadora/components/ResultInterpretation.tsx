import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ContentCard } from '@/src/components/ui/ContentCard';
import { colors, spacing, typography } from '@/src/theme';

import {
  interpretResultadoInicial,
  type InterpretationKind,
} from '../domain';

const ICON: Record<InterpretationKind, keyof typeof Ionicons.glyphMap> = {
  positive: 'trending-up-outline',
  zero: 'remove-outline',
  negative: 'trending-down-outline',
};

const TONE: Record<InterpretationKind, string> = {
  positive: colors.success,
  zero: colors.accent,
  negative: colors.warning,
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
    <ContentCard
      style={[styles.card, { borderColor: tone }]}
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
    </ContentCard>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    marginBottom: spacing.xxl,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  title: {
    flex: 1,
    ...typography.h3,
  },
  explanation: {
    ...typography.body,
    color: colors.text,
  },
});
