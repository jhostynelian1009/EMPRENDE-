import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  ContentCard,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
} from '@/src/components/ui';
import { colors, spacing, typography } from '@/src/theme';

import type { ChallengeDefinition, ChallengeStatus } from '../domain';

type ChallengeCardProps = {
  challenge: ChallengeDefinition;
  status: ChallengeStatus;
  isUnlocked: boolean;
  onPress: () => void;
};

export function ChallengeCard({
  challenge,
  status,
  isUnlocked,
  onPress,
}: ChallengeCardProps) {
  let buttonTitle = 'Comenzar';
  if (status === 'started') {
    buttonTitle = 'Continuar';
  } else if (status === 'completed') {
    buttonTitle = 'Revisar';
  }

  return (
    <ContentCard style={[styles.card, !isUnlocked && styles.lockedCard]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{challenge.title}</Text>
        {isUnlocked ? (
          <StatusBadge status={status} />
        ) : (
          <StatusBadge status="pending" customLabel="Bloqueado" />
        )}
      </View>

      <Text style={styles.subtitle}>{challenge.subtitle}</Text>
      <Text style={styles.proposito}>{challenge.proposito}</Text>

      {!isUnlocked ? (
        <View style={styles.lockedContainer}>
          <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />
          <Text style={styles.lockedText}>
            Completa el reto anterior para desbloquearlo.
          </Text>
        </View>
      ) : (
        <View style={styles.actionContainer}>
          {status === 'completed' ? (
            <SecondaryButton
              title={buttonTitle}
              onPress={onPress}
              accessibilityHint={`Ver respuestas de ${challenge.title}`}
            />
          ) : (
            <PrimaryButton
              title={buttonTitle}
              onPress={onPress}
              accessibilityHint={`${buttonTitle} ${challenge.title}`}
            />
          )}
        </View>
      )}
    </ContentCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  lockedCard: {
    opacity: 0.85,
    backgroundColor: colors.surface,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h3,
    color: colors.secondary,
  },
  subtitle: {
    ...typography.label,
    color: colors.primaryDark,
    marginBottom: spacing.sm,
  },
  proposito: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  lockedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 8,
  },
  lockedText: {
    ...typography.caption,
    color: colors.textMuted,
    flex: 1,
  },
  actionContainer: {
    marginTop: spacing.xs,
  },
});
