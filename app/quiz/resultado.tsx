import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { QUESTION_BANK } from '@/src/modules/quiz/data';
import { loadQuizState, clearQuizState } from '@/src/modules/quiz/repository';
import type { QuizState } from '@/src/modules/quiz/types';

/* ── Tokens del sistema visual ── */
const C = {
  primary: '#F97316',
  primaryDark: '#C2410C',
  primaryLight: '#FFEDD5',
  secondary: '#17365D',
  accent: '#0F766E',
  background: '#FFF7ED',
  surface: '#FFFFFF',
  text: '#1F2937',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  success: '#15803D',
  successLight: '#F0FDF4',
  warning: '#B45309',
  warningLight: '#FFFBEB',
  error: '#B91C1C',
  errorLight: '#FEF2F2',
};



export default function ResultadoScreen() {
  const [state, setState] = useState<QuizState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await loadQuizState();
      if (saved.status !== 'completed' || saved.score === null) {
        // No hay resultado — volver al quiz
        router.replace('/quiz');
        return;
      }
      setState(saved);
      setLoading(false);
    })();
  }, []);

  const handleRepeat = () => {
    Alert.alert(
      'Repetir quiz',
      '¿Deseas iniciar un nuevo intento? Tu resultado anterior será reemplazado al completar el nuevo quiz.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Repetir',
          style: 'destructive',
          onPress: async () => {
            await clearQuizState();
            router.replace('/quiz');
          },
        },
      ],
    );
  };

  if (loading || !state) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={C.primaryDark} />
        <Text style={styles.loadingText}>Cargando resultado…</Text>
      </SafeAreaView>
    );
  }

  const { score, approved, answers } = state;
  const scoreValue = score ?? 0;
  const isApproved = approved === true;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Tarjeta de resultado ── */}
        <View style={[styles.resultCard, isApproved ? styles.resultCardApproved : styles.resultCardNotApproved]}>
          <View style={[styles.scoreCircle, isApproved ? styles.scoreCircleApproved : styles.scoreCircleNotApproved]}>
            <Text style={styles.scoreNumber}>{scoreValue}</Text>
            <Text style={styles.scoreDenom}>/10</Text>
          </View>

          <View style={styles.resultBadge}>
            <Ionicons
              name={isApproved ? 'checkmark-circle' : 'close-circle'}
              size={24}
              color={isApproved ? C.success : C.error}
            />
            <Text style={[styles.resultBadgeText, { color: isApproved ? C.success : C.error }]}>
              {isApproved ? 'Aprobado' : 'No aprobado'}
            </Text>
          </View>

          <Text style={styles.resultMessage}>
            {isApproved
              ? `¡Aprobaste! Obtuviste ${scoreValue}/10.`
              : `Obtuviste ${scoreValue}/10. Revisa la retroalimentación y vuelve a intentarlo.`}
          </Text>
        </View>

        {/* ── Revisión de preguntas ── */}
        <Text style={styles.sectionTitle}>Revisión de respuestas</Text>

        {QUESTION_BANK.map((question, index) => {
          const userAnswerId = answers[question.id];
          const isCorrect = userAnswerId === question.correctOptionId;
          const userOption = question.options.find(o => o.id === userAnswerId);
          const correctOption = question.options.find(o => o.id === question.correctOptionId);

          return (
            <View key={question.id} style={styles.reviewCard}>
              {/* Question header */}
              <View style={styles.reviewHeader}>
                <View style={[styles.reviewBadge, isCorrect ? styles.reviewBadgeCorrect : styles.reviewBadgeIncorrect]}>
                  <Ionicons
                    name={isCorrect ? 'checkmark' : 'close'}
                    size={14}
                    color={C.surface}
                  />
                </View>
                <Text style={styles.reviewQuestionNumber}>Pregunta {index + 1}</Text>
                <Text style={[styles.reviewStatus, { color: isCorrect ? C.success : C.error }]}>
                  {isCorrect ? 'Correcta' : 'Incorrecta'}
                </Text>
              </View>

              {/* Statement */}
              <Text style={styles.reviewStatement}>{question.statement}</Text>

              {/* User answer */}
              <View style={[styles.answerRow, isCorrect ? styles.answerRowCorrect : styles.answerRowIncorrect]}>
                <Ionicons
                  name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                  size={20}
                  color={isCorrect ? C.success : C.error}
                />
                <View style={styles.answerTextWrap}>
                  <Text style={styles.answerLabel}>Tu respuesta:</Text>
                  <Text style={styles.answerValue}>
                    {userOption?.text ?? 'Sin respuesta'}
                  </Text>
                </View>
              </View>

              {/* Correct answer (only if incorrect) */}
              {!isCorrect && correctOption && (
                <View style={[styles.answerRow, styles.answerRowCorrect]}>
                  <Ionicons name="checkmark-circle" size={20} color={C.success} />
                  <View style={styles.answerTextWrap}>
                    <Text style={styles.answerLabel}>Respuesta correcta:</Text>
                    <Text style={styles.answerValue}>{correctOption.text}</Text>
                  </View>
                </View>
              )}

              {/* Feedback */}
              <View style={styles.feedbackRow}>
                <Ionicons name="bulb-outline" size={18} color={C.accent} />
                <Text style={styles.feedbackText}>{question.feedback}</Text>
              </View>
            </View>
          );
        })}

        {/* ── Action buttons ── */}
        <View style={styles.actionsSection}>
          <Pressable
            style={styles.repeatButton}
            onPress={handleRepeat}
            accessibilityRole="button"
            accessibilityLabel="Repetir quiz"
          >
            <Ionicons name="refresh" size={20} color={C.surface} />
            <Text style={styles.repeatButtonText}>Repetir quiz</Text>
          </Pressable>

          <Pressable
            style={styles.homeButton}
            onPress={() => router.replace('/(tabs)')}
            accessibilityRole="button"
            accessibilityLabel="Volver al inicio"
          >
            <Ionicons name="home-outline" size={20} color={C.primaryDark} />
            <Text style={styles.homeButtonText}>Volver al inicio</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ── Estilos ── */
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: C.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: C.textMuted,
  },
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  /* Result card */
  resultCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  resultCardApproved: {
    backgroundColor: C.successLight,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  resultCardNotApproved: {
    backgroundColor: C.errorLight,
    borderWidth: 1,
    borderColor: '#FECACA',
  },

  /* Score circle */
  scoreCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },
  scoreCircleApproved: {
    backgroundColor: '#DCFCE7',
    borderWidth: 3,
    borderColor: C.success,
  },
  scoreCircleNotApproved: {
    backgroundColor: '#FEE2E2',
    borderWidth: 3,
    borderColor: C.error,
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: C.secondary,
  },
  scoreDenom: {
    fontSize: 18,
    fontWeight: '600',
    color: C.textMuted,
    marginTop: 8,
  },

  /* Result badge */
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  resultBadgeText: {
    fontSize: 18,
    fontWeight: '700',
  },
  resultMessage: {
    fontSize: 16,
    lineHeight: 24,
    color: C.text,
    textAlign: 'center',
  },

  /* Section */
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: C.secondary,
    marginBottom: 16,
  },

  /* Review card */
  reviewCard: {
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  reviewBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewBadgeCorrect: {
    backgroundColor: C.success,
  },
  reviewBadgeIncorrect: {
    backgroundColor: C.error,
  },
  reviewQuestionNumber: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: C.secondary,
  },
  reviewStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviewStatement: {
    fontSize: 16,
    lineHeight: 24,
    color: C.text,
    marginBottom: 12,
  },

  /* Answer rows */
  answerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  answerRowCorrect: {
    backgroundColor: C.successLight,
  },
  answerRowIncorrect: {
    backgroundColor: C.errorLight,
  },
  answerTextWrap: {
    flex: 1,
  },
  answerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: C.textMuted,
    marginBottom: 2,
  },
  answerValue: {
    fontSize: 14,
    lineHeight: 20,
    color: C.text,
  },

  /* Feedback */
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDFA',
    borderRadius: 10,
    padding: 12,
    gap: 10,
    marginTop: 4,
  },
  feedbackText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: C.accent,
    fontStyle: 'italic',
  },

  /* Action buttons */
  actionsSection: {
    marginTop: 8,
    gap: 12,
  },
  repeatButton: {
    flexDirection: 'row',
    backgroundColor: C.primaryDark,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    gap: 8,
  },
  repeatButtonText: {
    color: C.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.primaryDark,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    gap: 8,
  },
  homeButtonText: {
    color: C.primaryDark,
    fontSize: 16,
    fontWeight: '600',
  },
});
