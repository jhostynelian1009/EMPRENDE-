import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
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
import { shuffleQuizOptions, calculateQuizScore } from '@/src/modules/quiz/logic';
import { loadQuizState, saveQuizState, clearQuizState } from '@/src/modules/quiz/repository';
import type { Question } from '@/src/modules/quiz/types';

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
  warning: '#B45309',
  error: '#B91C1C',
};

const TOTAL_QUESTIONS = 10;
const PASSING_SCORE = 7;

type ScreenPhase = 'loading' | 'resume' | 'intro' | 'quiz';

export default function QuizScreen() {
  /* ── Estado ── */
  const [phase, setPhase] = useState<ScreenPhase>('loading');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  /* ── Montaje: cargar estado persistido ── */
  useEffect(() => {
    (async () => {
      const saved = await loadQuizState();
      if (saved.status === 'inProgress' && Object.keys(saved.answers).length > 0) {
        // Hay un intento previo en progreso
        setAnswers(saved.answers);
        setQuestions(shuffleQuizOptions(QUESTION_BANK));
        setPhase('resume');
      } else if (saved.status === 'completed') {
        // Ya completó – ir directo a resultado
        router.replace('/quiz/resultado');
      } else {
        setPhase('intro');
      }
    })();
  }, []);

  /* ── Iniciar nuevo intento ── */
  const startNewQuiz = useCallback(() => {
    const shuffled = shuffleQuizOptions(QUESTION_BANK);
    setQuestions(shuffled);
    setAnswers({});
    setCurrentIndex(0);
    setPhase('quiz');
  }, []);

  /* ── Continuar intento previo ── */
  const continueQuiz = useCallback(() => {
    // Las preguntas ya están barajadas desde el montaje
    setCurrentIndex(0);
    setPhase('quiz');
  }, []);

  /* ── Empezar de nuevo (desde resume) ── */
  const restartFromResume = useCallback(async () => {
    await clearQuizState();
    startNewQuiz();
  }, [startNewQuiz]);

  /* ── Seleccionar respuesta ── */
  const selectAnswer = useCallback(
    async (questionId: string, optionId: string) => {
      const updated = { ...answers, [questionId]: optionId };
      setAnswers(updated);

      // Persistir borrador
      setSaving(true);
      try {
        await saveQuizState({
          schemaVersion: 1,
          status: 'inProgress',
          answers: updated,
          score: null,
          approved: null,
          completedAt: null,
          updatedAt: null,
        });
      } catch {
        // El repositorio ya logea el error; no bloqueamos la UI
      } finally {
        setSaving(false);
      }
    },
    [answers],
  );

  /* ── Navegación entre preguntas ── */
  const goNext = useCallback(() => {
    if (currentIndex < TOTAL_QUESTIONS - 1) {
      setCurrentIndex(i => i + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [currentIndex]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [currentIndex]);

  /* ── Finalizar Quiz ── */
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === TOTAL_QUESTIONS;

  const finishQuiz = useCallback(async () => {
    const score = calculateQuizScore(QUESTION_BANK, answers);
    const approved = score >= PASSING_SCORE;
    const now = new Date().toISOString();

    await saveQuizState({
      schemaVersion: 1,
      status: 'completed',
      answers,
      score,
      approved,
      completedAt: now,
      updatedAt: null,
    });

    router.replace('/quiz/resultado');
  }, [answers]);

  const handleFinish = useCallback(() => {
    if (!allAnswered) {
      if (Platform.OS === 'web') {
        window.alert('Responde las 10 preguntas antes de finalizar.');
      } else {
        Alert.alert('Quiz incompleto', 'Responde las 10 preguntas antes de finalizar.');
      }
      return;
    }

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        '¿Estás seguro de que deseas finalizar? No podrás cambiar tus respuestas.',
      );
      if (confirmed) {
        finishQuiz();
      }
    } else {
      Alert.alert(
        'Finalizar quiz',
        '¿Estás seguro de que deseas finalizar? No podrás cambiar tus respuestas.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Finalizar', style: 'destructive', onPress: finishQuiz },
        ],
      );
    }
  }, [allAnswered, finishQuiz]);

  /* ── Render helpers ── */

  // ─── Loading ───
  if (phase === 'loading') {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={C.primaryDark} />
        <Text style={styles.loadingText}>Cargando tu avance…</Text>
      </SafeAreaView>
    );
  }

  // ─── Resume (intento previo detectado) ───
  if (phase === 'resume') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <View style={styles.introCard}>
            <Ionicons name="time-outline" size={48} color={C.primaryDark} />
            <Text style={styles.introTitle}>Intento en progreso</Text>
            <Text style={styles.introBody}>
              Tienes {answeredCount} de {TOTAL_QUESTIONS} preguntas respondidas.
              ¿Deseas continuar o empezar de nuevo?
            </Text>
            <Pressable
              style={styles.primaryButton}
              onPress={continueQuiz}
              accessibilityRole="button"
              accessibilityLabel="Continuar intento"
            >
              <Text style={styles.primaryButtonText}>Continuar intento</Text>
            </Pressable>
            <Pressable
              style={styles.secondaryButton}
              onPress={restartFromResume}
              accessibilityRole="button"
              accessibilityLabel="Empezar de nuevo"
            >
              <Text style={styles.secondaryButtonText}>Empezar de nuevo</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Intro ───
  if (phase === 'intro') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <View style={styles.introCard}>
            <Ionicons name="school-outline" size={48} color={C.primaryDark} />
            <Text style={styles.introTitle}>Quiz de Emprendimiento</Text>
            <Text style={styles.introBody}>
              Comprueba lo que has aprendido respondiendo 10 preguntas de
              selección múltiple. Cada pregunta vale 1 punto.
            </Text>
            <View style={styles.infoRow}>
              <Ionicons name="checkmark-circle-outline" size={20} color={C.success} />
              <Text style={styles.infoText}>Aprobación: 7 de 10 correctas</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="swap-horizontal-outline" size={20} color={C.accent} />
              <Text style={styles.infoText}>Puedes volver a cualquier pregunta</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="save-outline" size={20} color={C.accent} />
              <Text style={styles.infoText}>Tu avance se guarda automáticamente</Text>
            </View>
            <Pressable
              style={styles.primaryButton}
              onPress={startNewQuiz}
              accessibilityRole="button"
              accessibilityLabel="Comenzar quiz"
            >
              <Text style={styles.primaryButtonText}>Comenzar quiz</Text>
            </Pressable>
            <Pressable
              style={styles.backLinkButton}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Volver"
            >
              <Ionicons name="arrow-back" size={18} color={C.textMuted} />
              <Text style={styles.backLinkText}>Volver</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Cuestionario ───
  const question = questions[currentIndex];
  const selectedOptionId = question ? answers[question.id] : undefined;
  const progress = ((currentIndex + 1) / TOTAL_QUESTIONS) * 100;
  const isLastQuestion = currentIndex === TOTAL_QUESTIONS - 1;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.headerBack}
          accessibilityRole="button"
          accessibilityLabel="Volver atrás"
        >
          <Ionicons name="arrow-back" size={24} color={C.secondary} />
        </Pressable>
        <Text style={styles.headerTitle}>Quiz</Text>
        <View style={styles.headerRight}>
          {saving && <ActivityIndicator size="small" color={C.primaryDark} />}
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>
          Pregunta {currentIndex + 1} de {TOTAL_QUESTIONS}
        </Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressCaption}>
          {answeredCount} de {TOTAL_QUESTIONS} respondidas
        </Text>
      </View>

      {/* Question */}
      <ScrollView
        ref={scrollRef}
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {question && (
          <>
            <Text style={styles.questionStatement}>{question.statement}</Text>

            {question.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              return (
                <Pressable
                  key={option.id}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                  ]}
                  onPress={() => selectAnswer(question.id, option.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={option.text}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      isSelected && styles.radioOuterSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {option.text}
                  </Text>
                </Pressable>
              );
            })}
          </>
        )}

        {/* Navigation buttons */}
        <View style={styles.navRow}>
          <Pressable
            style={[styles.secondaryButton, styles.navButton, currentIndex === 0 && styles.buttonDisabled]}
            onPress={goPrev}
            disabled={currentIndex === 0}
            accessibilityRole="button"
            accessibilityLabel="Pregunta anterior"
          >
            <Ionicons name="chevron-back" size={18} color={currentIndex === 0 ? C.border : C.primaryDark} />
            <Text style={[styles.secondaryButtonText, currentIndex === 0 && styles.textDisabled]}>
              Anterior
            </Text>
          </Pressable>

          {!isLastQuestion ? (
            <Pressable
              style={[styles.primaryButton, styles.navButton]}
              onPress={goNext}
              accessibilityRole="button"
              accessibilityLabel="Siguiente pregunta"
            >
              <Text style={styles.primaryButtonText}>Siguiente</Text>
              <Ionicons name="chevron-forward" size={18} color={C.surface} />
            </Pressable>
          ) : (
            <Pressable
              style={[
                styles.finishButton,
                styles.navButton,
                !allAnswered && styles.finishButtonDisabled,
              ]}
              onPress={handleFinish}
              disabled={!allAnswered}
              accessibilityRole="button"
              accessibilityLabel={
                allAnswered
                  ? 'Finalizar quiz'
                  : `Finalizar quiz deshabilitado. Faltan ${TOTAL_QUESTIONS - answeredCount} respuestas.`
              }
            >
              <Ionicons name="checkmark-done" size={18} color={C.surface} />
              <Text style={styles.finishButtonText}>Finalizar quiz</Text>
            </Pressable>
          )}
        </View>

        {/* Incomplete warning on last question */}
        {isLastQuestion && !allAnswered && (
          <View style={styles.warningBanner}>
            <Ionicons name="alert-circle-outline" size={20} color={C.warning} />
            <Text style={styles.warningText}>
              Responde las {TOTAL_QUESTIONS} preguntas antes de finalizar.
              Faltan {TOTAL_QUESTIONS - answeredCount}.
            </Text>
          </View>
        )}

        {/* Question dots */}
        <View style={styles.dotsRow}>
          {questions.map((q, i) => {
            const isAnswered = !!answers[q.id];
            const isCurrent = i === currentIndex;
            return (
              <Pressable
                key={q.id}
                style={[
                  styles.dot,
                  isAnswered && styles.dotAnswered,
                  isCurrent && styles.dotCurrent,
                ]}
                onPress={() => {
                  setCurrentIndex(i);
                  scrollRef.current?.scrollTo({ y: 0, animated: true });
                }}
                accessibilityRole="button"
                accessibilityLabel={`Ir a pregunta ${i + 1}${isAnswered ? ', respondida' : ', sin responder'}`}
              >
                <Text
                  style={[
                    styles.dotText,
                    isAnswered && styles.dotTextAnswered,
                    isCurrent && styles.dotTextCurrent,
                  ]}
                >
                  {i + 1}
                </Text>
              </Pressable>
            );
          })}
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
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  /* Intro / Resume card */
  introCard: {
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: C.secondary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  introBody: {
    fontSize: 16,
    lineHeight: 24,
    color: C.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  infoText: {
    fontSize: 14,
    color: C.text,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerBack: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: C.secondary,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
    alignItems: 'center',
  },

  /* Progress */
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: C.secondary,
    marginBottom: 6,
  },
  progressTrack: {
    height: 8,
    backgroundColor: C.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: C.accent,
    borderRadius: 4,
  },
  progressCaption: {
    fontSize: 12,
    fontWeight: '500',
    color: C.textMuted,
    marginTop: 4,
    textAlign: 'right',
  },

  /* Scroll area */
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  /* Question */
  questionStatement: {
    fontSize: 18,
    fontWeight: '600',
    color: C.text,
    lineHeight: 26,
    marginTop: 16,
    marginBottom: 20,
  },

  /* Option card */
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    minHeight: 48,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  optionCardSelected: {
    borderColor: C.primaryDark,
    backgroundColor: C.primaryLight,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: C.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioOuterSelected: {
    borderColor: C.primaryDark,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: C.primaryDark,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: C.text,
  },
  optionTextSelected: {
    fontWeight: '600',
    color: C.secondary,
  },

  /* Buttons */
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: C.primaryDark,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginTop: 16,
    gap: 6,
  },
  primaryButtonText: {
    color: C.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
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
    marginTop: 12,
    gap: 6,
  },
  secondaryButtonText: {
    color: C.primaryDark,
    fontSize: 16,
    fontWeight: '600',
  },
  finishButton: {
    flexDirection: 'row',
    backgroundColor: C.success,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    gap: 6,
  },
  finishButtonDisabled: {
    backgroundColor: C.border,
  },
  finishButtonText: {
    color: C.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    borderColor: C.border,
  },
  textDisabled: {
    color: C.border,
  },
  backLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 4,
  },
  backLinkText: {
    fontSize: 14,
    color: C.textMuted,
  },

  /* Navigation row */
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  navButton: {
    flex: 1,
    marginTop: 0,
  },

  /* Warning */
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    gap: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: C.warning,
    lineHeight: 20,
  },

  /* Question dots */
  dotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotAnswered: {
    backgroundColor: C.primaryLight,
    borderColor: C.primary,
  },
  dotCurrent: {
    borderColor: C.primaryDark,
    borderWidth: 2,
  },
  dotText: {
    fontSize: 12,
    fontWeight: '500',
    color: C.textMuted,
  },
  dotTextAnswered: {
    color: C.primaryDark,
    fontWeight: '700',
  },
  dotTextCurrent: {
    color: C.primaryDark,
    fontWeight: '700',
  },
});
