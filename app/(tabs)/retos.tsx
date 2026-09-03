import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';


import {
  ContentCard,
  ProgressBar,
  Screen,
  SecondaryButton,
} from '@/src/components/ui';
import { ChallengeCard } from '@/src/modules/retos/components/ChallengeCard';
import { CHALLENGE_LIST } from '@/src/modules/retos/domain/data';
import type { ChallengeId } from '@/src/modules/retos/domain/types';
import { useRetos } from '@/src/modules/retos/hooks/useRetos';
import { colors, spacing, typography } from '@/src/theme';

export default function RetosCatalogScreen() {
  const router = useRouter();
  const retos = useRetos();

  const handleOpenChallenge = (challengeId: ChallengeId, isUnlocked: boolean) => {
    if (!isUnlocked) {
      Alert.alert(
        'Reto bloqueado',
        'Completa el reto anterior para desbloquearlo.',
      );
      return;
    }
    router.push(`/retos/${challengeId}` as any);
  };

  return (
    <Screen scrollable style={styles.safe}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Retos de emprendimiento</Text>
        <Text style={styles.subtitle}>
          Aplica lo aprendido en actividades prácticas de tu proyecto.
        </Text>
      </View>

      {retos.notice ? (
        <ContentCard style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>
            {retos.notice === 'unknown_schema'
              ? 'Versión no compatible'
              : retos.notice === 'corrupt'
              ? 'Datos no disponibles'
              : 'Atención en lectura de retos'}
          </Text>
          <Text style={styles.noticeText}>
            Puedes comenzar un reto de nuevo. El avance previo no fue alterado.
          </Text>
          <SecondaryButton
            title="Continuar"
            onPress={retos.dismissNotice}
            style={styles.noticeButton}
          />
        </ContentCard>
      ) : null}

      <ContentCard style={styles.progressCard}>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Progreso total</Text>
          <Text style={styles.progressValue}>
            {retos.progress.completedCount} de {retos.progress.total} completados
          </Text>
        </View>
        <ProgressBar progress={retos.progress.percentage / 100} />
      </ContentCard>

      {retos.phase === 'loading' ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primaryDark} />
          <Text style={styles.loadingText}>Cargando retos…</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {CHALLENGE_LIST.map((challenge) => {
            const unlocked = retos.isUnlocked(challenge.id);
            const item = retos.snapshot.challenges[challenge.id];
            const status = item ? item.status : 'pending';

            return (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                status={status}
                isUnlocked={unlocked}
                onPress={() => handleOpenChallenge(challenge.id, unlocked)}
              />
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.secondary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  noticeCard: {
    backgroundColor: colors.surface,
    borderColor: colors.warning,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  noticeTitle: {
    ...typography.h3,
    color: colors.secondary,
    marginBottom: spacing.xs,
  },
  noticeText: {
    ...typography.bodySmall,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  noticeButton: {
    marginTop: spacing.xs,
  },
  progressCard: {
    marginBottom: spacing.xl,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    ...typography.label,
    color: colors.secondary,
  },
  progressValue: {
    ...typography.caption,
    color: colors.textMuted,
  },
  loadingContainer: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  listContainer: {
    marginBottom: spacing.xxl,
  },
});
