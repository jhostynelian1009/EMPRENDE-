import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ContentCard, StatusBadge } from '@/src/components/ui';
import { colors, spacing, typography } from '@/src/theme';

import type { ChallengeDefinition, ChallengeStatus } from '../domain';

type ChallengeHeaderProps = {
  challenge: ChallengeDefinition;
  status: ChallengeStatus;
};

export function ChallengeHeader({ challenge, status }: ChallengeHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.titleCol}>
          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.subtitle}>{challenge.subtitle}</Text>
        </View>
        <StatusBadge status={status} />
      </View>

      <ContentCard style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Propósito</Text>
        <Text style={styles.sectionText}>{challenge.proposito}</Text>
      </ContentCard>

      <ContentCard style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Situación y Problema</Text>
        <Text style={styles.sectionText}>{challenge.situacion}</Text>
        <Text style={[styles.sectionText, styles.highlight]}>
          {challenge.problema}
        </Text>
      </ContentCard>

      <ContentCard style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Pasos sugeridos</Text>
        {challenge.pasos.map((paso, idx) => (
          <View key={idx} style={styles.pasoRow}>
            <Text style={styles.pasoNum}>{idx + 1}.</Text>
            <Text style={styles.pasoText}>{paso}</Text>
          </View>
        ))}
      </ContentCard>

      <ContentCard style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Ejemplo de referencia</Text>
        <Text style={styles.exampleText}>{challenge.ejemplo}</Text>
      </ContentCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  titleCol: {
    flex: 1,
    paddingRight: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.secondary,
  },
  subtitle: {
    ...typography.body,
    color: colors.primaryDark,
    marginTop: spacing.xs,
  },
  sectionCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.secondary,
    marginBottom: spacing.xs,
  },
  sectionText: {
    ...typography.bodySmall,
    color: colors.text,
    lineHeight: 20,
  },
  highlight: {
    marginTop: spacing.xs,
    color: colors.warning,
    fontWeight: '500',
  },
  pasoRow: {
    flexDirection: 'row',
    marginTop: spacing.xs,
    alignItems: 'flex-start',
  },
  pasoNum: {
    ...typography.label,
    color: colors.primaryDark,
    width: 20,
  },
  pasoText: {
    ...typography.bodySmall,
    color: colors.text,
    flex: 1,
  },
  exampleText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});
