import { Stack } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Screen } from '@/src/components/ui/Screen';
import { CalculatorActions } from '@/src/modules/calculadora/components/CalculatorActions';
import { CalculatorForm } from '@/src/modules/calculadora/components/CalculatorForm';
import { CalculatorResults } from '@/src/modules/calculadora/components/CalculatorResults';
import { ResultInterpretation } from '@/src/modules/calculadora/components/ResultInterpretation';
import { EDUCATIONAL_NOTICE, SCREEN_INTRO } from '@/src/modules/calculadora/domain';
import { useCalculator } from '@/src/modules/calculadora/hooks/useCalculator';
import { colors, radii, spacing, typography } from '@/src/theme';

export default function CalculadoraScreen() {
  const calculator = useCalculator();

  const requestClear = () => {
    if (!calculator.hasContentToClear) {
      calculator.clearLocal();
      return;
    }

    Alert.alert(
      'Limpiar cálculo',
      'Se borrarán los datos ingresados y el cálculo guardado. Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: () => {
            if (calculator.persisted) {
              void calculator.clearPersisted();
            } else {
              calculator.clearLocal();
            }
          },
        },
      ],
    );
  };

  return (
    <Screen style={styles.safe}>
      <Stack.Screen
        options={{
          title: 'Calculadora',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.secondary,
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}>
        {calculator.phase === 'loading' ? (
          <View style={styles.loading} accessibilityLabel="Cargando cálculo">
            <ActivityIndicator color={colors.primaryDark} />
            <Text style={styles.loadingText}>Cargando cálculo…</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag">
            <Text style={styles.intro}>{SCREEN_INTRO}</Text>
            <View style={styles.notice}>
              <Text style={styles.noticeText}>{EDUCATIONAL_NOTICE}</Text>
            </View>

            {calculator.notice ? (
              <View style={styles.recoverable}>
                <Text style={styles.recoverableTitle}>
                  {calculator.notice === 'unavailable'
                    ? 'Cálculo no disponible'
                    : 'No se pudo leer el cálculo guardado'}
                </Text>
                <Text style={styles.recoverableText}>
                  Puedes continuar con un cálculo nuevo. El valor original no se
                  borró.
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Continuar"
                  onPress={calculator.dismissNotice}
                  style={styles.recoverableAction}>
                  <Text style={styles.recoverableActionLabel}>Continuar</Text>
                </Pressable>
              </View>
            ) : null}

            {calculator.saveError ? (
              <View style={styles.recoverable}>
                <Text style={styles.recoverableTitle}>
                  El cálculo se muestra, pero no se pudo guardar
                </Text>
                <Text style={styles.recoverableText}>
                  Tus entradas se conservan. Puedes reintentar el guardado.
                </Text>
              </View>
            ) : null}

            {calculator.phase === 'form' ? (
              <CalculatorForm
                values={calculator.values}
                errors={calculator.errors}
                firstErrorField={calculator.firstErrorField}
                onChange={calculator.updateField}
                onFirstErrorFocused={calculator.clearFirstErrorField}
              />
            ) : calculator.snapshot ? (
              <>
                <CalculatorResults results={calculator.snapshot.results} />
                <ResultInterpretation
                  resultadoInicial={calculator.snapshot.results.resultadoInicial}
                />
              </>
            ) : null}

            <CalculatorActions
              phase={calculator.phase === 'result' ? 'result' : 'form'}
              saving={calculator.saving}
              saveError={calculator.saveError}
              onCalculate={calculator.calculate}
              onModify={calculator.modify}
              onClear={requestClear}
              onRetrySave={calculator.retrySave}
            />
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 48,
  },
  intro: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.md,
  },
  notice: {
    backgroundColor: colors.primaryLight,
    borderRadius: radii.card,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
  },
  noticeText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  recoverable: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.warning,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
  },
  recoverableTitle: {
    ...typography.h3,
    color: colors.secondary,
    marginBottom: spacing.sm,
  },
  recoverableText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  recoverableAction: {
    minHeight: 48,
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  recoverableActionLabel: {
    ...typography.label,
    color: colors.primaryDark,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
});
