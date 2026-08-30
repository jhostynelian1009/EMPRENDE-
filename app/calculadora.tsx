import { Stack } from 'expo-router';
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
import { SafeAreaView } from 'react-native-safe-area-context';

import { CalculatorActions } from '@/src/modules/calculadora/components/CalculatorActions';
import { CalculatorForm } from '@/src/modules/calculadora/components/CalculatorForm';
import { CalculatorResults } from '@/src/modules/calculadora/components/CalculatorResults';
import { ResultInterpretation } from '@/src/modules/calculadora/components/ResultInterpretation';
import { EDUCATIONAL_NOTICE, SCREEN_INTRO } from '@/src/modules/calculadora/domain';
import { useCalculator } from '@/src/modules/calculadora/hooks/useCalculator';
import { calculatorTheme as theme } from '@/src/modules/calculadora/theme';

export default function CalculadoraScreen() {
  const calculator = useCalculator();

  const requestClear = () => {
    if (!calculator.persisted) {
      calculator.clearLocal();
      return;
    }

    Alert.alert(
      'Limpiar cálculo',
      'Se borrará el último cálculo guardado. Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: () => {
            void calculator.clearPersisted();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Calculadora',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.color.background },
          headerTintColor: theme.color.secondary,
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}>
        {calculator.phase === 'loading' ? (
          <View style={styles.loading} accessibilityLabel="Cargando cálculo">
            <ActivityIndicator color={theme.color.primaryDark} />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.color.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.lg,
    paddingBottom: 48,
  },
  intro: {
    color: theme.color.text,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: theme.space.md,
  },
  notice: {
    backgroundColor: theme.color.primaryLight,
    borderRadius: theme.radius.card,
    padding: theme.space.lg,
    marginBottom: theme.space.xxl,
  },
  noticeText: {
    color: theme.color.text,
    fontSize: 14,
    lineHeight: 20,
  },
  recoverable: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.color.warning,
    padding: theme.space.lg,
    marginBottom: theme.space.xxl,
  },
  recoverableTitle: {
    color: theme.color.secondary,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    marginBottom: theme.space.sm,
  },
  recoverableText: {
    color: theme.color.text,
    fontSize: 14,
    lineHeight: 20,
  },
  recoverableAction: {
    minHeight: 48,
    justifyContent: 'center',
    marginTop: theme.space.sm,
  },
  recoverableActionLabel: {
    color: theme.color.primaryDark,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.space.md,
  },
  loadingText: {
    color: theme.color.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
