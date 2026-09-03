import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';


import {
  AppHeader,
  ContentCard,
  PrimaryButton,
  Screen,
  SecondaryButton,
  TextField,
} from '@/src/components/ui';
import { CalculadoraIntegrationBanner } from '@/src/modules/retos/components/CalculadoraIntegrationBanner';
import { ChallengeHeader } from '@/src/modules/retos/components/ChallengeHeader';
import { WordCounter } from '@/src/modules/retos/components/WordCounter';
import type { ChallengeId } from '@/src/modules/retos/domain/types';
import { useChallengeForm } from '@/src/modules/retos/hooks/useChallengeForm';
import { colors, spacing, typography } from '@/src/theme';

const VALID_IDS: ChallengeId[] = ['reto-1', 'reto-2', 'reto-3'];

export default function ChallengeDetailScreen() {
  const router = useRouter();
  const { challengeId } = useLocalSearchParams<{ challengeId: string }>();

  const validId =
    challengeId && VALID_IDS.includes(challengeId as ChallengeId)
      ? (challengeId as ChallengeId)
      : null;

  if (!validId) {
    return (
      <Screen style={styles.safe}>
        <AppHeader title="Retos" showBack onBack={() => router.back()} />
        <ContentCard style={styles.errorCard}>
          <Text style={styles.errorTitle}>Reto no encontrado.</Text>
          <Text style={styles.errorText}>
            El reto solicitado no existe o el enlace es inválido.
          </Text>
          <SecondaryButton
            title="Volver a la lista"
            onPress={() => router.back()}
          />
        </ContentCard>
      </Screen>
    );
  }

  return <ChallengeFormContent challengeId={validId} />;
}

function ChallengeFormContent({ challengeId }: { challengeId: ChallengeId }) {
  const router = useRouter();
  const form = useChallengeForm(challengeId);

  if (form.loading) {
    return (
      <Screen style={styles.safe}>
        <AppHeader title="Cargando..." showBack onBack={() => router.back()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primaryDark} />
          <Text style={styles.loadingText}>Cargando detalle del reto…</Text>
        </View>
      </Screen>
    );
  }

  if (!form.unlocked) {
    return (
      <Screen style={styles.safe}>
        <AppHeader
          title={form.definition?.title || 'Reto'}
          showBack
          onBack={() => router.back()}
        />
        <ContentCard style={styles.lockedCard}>
          <Text style={styles.lockedTitle}>Reto bloqueado</Text>
          <Text style={styles.lockedText}>
            Completa el reto anterior para desbloquearlo.
          </Text>
          <SecondaryButton
            title="Volver a la lista"
            onPress={() => router.back()}
          />
        </ContentCard>
      </Screen>
    );
  }

  const handleSaveDraft = async () => {
    const ok = await form.saveDraft();
    if (ok) {
      Alert.alert(
        'Avance guardado',
        'Tu avance se guardó. Puedes continuar después.',
        [{ text: 'Entendido' }],
      );
    }
  };

  const handleComplete = async () => {
    const ok = await form.complete();
    if (ok) {
      Alert.alert(
        '¡Reto completado!',
        '¡Reto completado! Puedes revisarlo o continuar.',
        [{ text: 'Continuar', onPress: () => router.back() }],
      );
    }
  };

  return (
    <Screen scrollable keyboardAvoiding style={styles.safe}>
      <AppHeader
        title={form.definition.title}
        subtitle={form.definition.subtitle}
        showBack
        onBack={() => router.back()}
      />

      <ChallengeHeader challenge={form.definition} status={form.status} />

      {challengeId === 'reto-2' ? (
        <CalculadoraIntegrationBanner
          onCopyPrice={form.copyPriceFromCalculator}
        />
      ) : null}

      {challengeId === 'reto-3' ? (
        <WordCounter answers={form.answers} />
      ) : null}

      {form.saveError ? (
        <ContentCard style={styles.saveErrorCard}>
          <Text style={styles.saveErrorTitle}>Error al guardar</Text>
          <Text style={styles.saveErrorText}>
            No pudimos guardar tu avance. Reintenta sin cerrar esta pantalla.
          </Text>
        </ContentCard>
      ) : null}

      <ContentCard style={styles.formCard}>
        <Text style={styles.formTitle}>Completa tus respuestas</Text>

        {form.definition.campos.map((campo) => {
          const val =
            form.answers[campo.id] !== undefined &&
            form.answers[campo.id] !== null
              ? String(form.answers[campo.id])
              : '';

          return (
            <TextField
              key={campo.id}
              label={campo.label}
              helperText={campo.help}
              errorMessage={form.errors[campo.id]}
              placeholder={campo.placeholder}
              value={val}
              onChangeText={(text) => form.updateField(campo.id, text)}
              multiline={campo.type !== 'text-short' && campo.type !== 'decimal'}
              keyboardType={campo.type === 'decimal' ? 'numeric' : 'default'}
            />
          );
        })}

        <View style={styles.actionsGroup}>
          <PrimaryButton
            title="Completar reto"
            onPress={handleComplete}
            loading={form.saving}
            accessibilityHint="Valida las respuestas y marca el reto como completado"
          />
          <SecondaryButton
            title="Guardar avance"
            onPress={handleSaveDraft}
            loading={form.saving}
            accessibilityHint="Guarda las respuestas ingresadas sin marcar completado"
          />
          <SecondaryButton
            title="Regresar"
            onPress={() => router.back()}
            disabled={form.saving}
          />
        </View>
      </ContentCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
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
  errorCard: {
    marginTop: spacing.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  errorTitle: {
    ...typography.h2,
    color: colors.error,
  },
  errorText: {
    ...typography.body,
    color: colors.text,
  },
  lockedCard: {
    marginTop: spacing.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  lockedTitle: {
    ...typography.h2,
    color: colors.warning,
  },
  lockedText: {
    ...typography.body,
    color: colors.text,
  },
  saveErrorCard: {
    borderColor: colors.error,
    borderWidth: 1,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
  },
  saveErrorTitle: {
    ...typography.h3,
    color: colors.error,
    marginBottom: spacing.xs,
  },
  saveErrorText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  formCard: {
    marginBottom: spacing.xxl,
  },
  formTitle: {
    ...typography.h3,
    color: colors.secondary,
    marginBottom: spacing.lg,
  },
  actionsGroup: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
});
