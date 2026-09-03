import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/src/theme';

type WordCounterProps = {
  answers: Record<string, string | number>;
};

export function WordCounter({ answers }: WordCounterProps) {
  const fullText = Object.values(answers)
    .map((val) => (val !== undefined && val !== null ? String(val) : ''))
    .join(' ')
    .trim();

  const words = fullText === '' ? 0 : fullText.split(/\s+/).filter(Boolean).length;

  return (
    <View style={styles.container} accessibilityRole="text">
      <Ionicons name="time-outline" size={18} color={colors.primaryDark} />
      <Text style={styles.text}>
        Total de palabras: <Text style={styles.count}>{words}</Text> (Orientativo: 100-150 palabras $\approx$ 1 minuto)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: radii.card,
    marginBottom: spacing.lg,
  },
  text: {
    ...typography.caption,
    color: colors.text,
    flex: 1,
  },
  count: {
    fontWeight: '700',
    color: colors.primaryDark,
  },
});
