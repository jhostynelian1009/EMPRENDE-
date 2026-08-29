import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { useAprende } from '@/src/modules/aprende/hooks/useAprende';
import { getLessonById, getNextLesson, getPreviousLesson, isValidLessonId } from '@/src/modules/aprende/data/content';
import { LessonSection } from '@/src/modules/aprende/components/LessonSection';
import type { LessonId } from '@/src/modules/aprende/domain/types';

// ─── Pantalla de ID inválido ────────────────────────────────────────────────

function NotFoundScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundTitle}>Lección no encontrada</Text>
        <Text style={styles.notFoundBody}>La lección solicitada no está disponible.</Text>
        <Pressable
          onPress={() => router.replace('/(tabs)/aprende')}
          style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Volver a Aprende"
        >
          <Text style={styles.backButtonText}>Volver a Aprende</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function normalizeLessonParam(value: string | string[] | undefined): string | null {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value) && value.length === 1 && typeof value[0] === 'string') {
    return value[0];
  }
  return null;
}

export default function LessonDetailScreen() {
  const { lessonId: rawParam } = useLocalSearchParams<{ lessonId: string | string[] }>();

  const normalizedId = normalizeLessonParam(rawParam);

  // APR-06: validar antes de usar como LessonId.
  if (normalizedId === null || !isValidLessonId(normalizedId)) {
    return <NotFoundScreen />;
  }

  // A partir de aquí `normalizedId` es un LessonId válido; cast explícito y seguro.
  const lessonId = normalizedId as LessonId;

  return <ValidLessonScreen lessonId={lessonId} />;
}

// ─── Componente interno solo para lecciones válidas ──────────────────────────
// Separado para que los hooks de React no se llamen condicionalmente.

type ValidLessonScreenProps = { lessonId: LessonId };

function ValidLessonScreen({ lessonId }: ValidLessonScreenProps) {
  const {
    isLoading,
    isSaving,
    error,
    refreshProgress,
    recordLessonVisit,
    markLessonAsReviewed,
    isLessonCompleted,
  } = useAprende();

  // Estado local de orientación, se resetea al cambiar de lección (APR-21).
  const [showGuidance, setShowGuidance] = useState(false);

  const lesson = getLessonById(lessonId)!; // Siempre existe: ya fue validado.
  const prevLesson = getPreviousLesson(lessonId);
  const nextLesson = getNextLesson(lessonId);

  /**
   * Registra la visita una sola vez por lección (APR-05).
   * Se ejecuta al montar y al cambiar de lessonId.
   * recordLessonVisit es estable (useCallback sin deps variables), así que
   * este efecto no se dispara en cada render.
   */
  useEffect(() => {
    recordLessonVisit(lessonId).catch(() => {
      // El error ya es manejado y expuesto en la UI a través del estado `error` de useAprende.
    });
    // Resetear orientación al cambiar de lección.
    setShowGuidance(false);
  }, [lessonId, recordLessonVisit]);

  const completed = isLessonCompleted(lessonId);

  const handleMarkAsReviewed = async () => {
    try {
      await markLessonAsReviewed(lessonId);
    } catch {
      // Manejado en el hook
    }
  };

  const navigateToLesson = (id: LessonId) => {
    router.replace(`/aprende/${id}`);
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/aprende');
    }
  };

  // ── Estado de carga ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centeredContainer]}>
        <ActivityIndicator size="large" color="#F97316" />
        <Text style={styles.loadingText}>Cargando lección…</Text>
      </SafeAreaView>
    );
  }

  // ── Contenido de la lección ───────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Volver a Aprende */}
        <Pressable
          onPress={goBack}
          style={({ pressed }) => [styles.backLink, pressed && styles.buttonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Volver a Aprende"
        >
          <Text style={styles.backLinkText}>← Volver a Aprende</Text>
        </Pressable>

        {/* Encabezado: número y título */}
        <Text style={styles.lessonNumber}>
          LECCIÓN {lesson.order} DE 7
        </Text>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>

        {/* Error recuperable (no bloquea el contenido) */}
        {error !== null && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>
              No pudimos guardar tu progreso. Intenta de nuevo.
            </Text>
            <Pressable
              onPress={refreshProgress}
              style={({ pressed }) => [styles.retryButton, pressed && styles.buttonPressed]}
              accessibilityRole="button"
              accessibilityLabel="Reintentar guardar el progreso"
            >
              <Text style={styles.retryText}>Reintentar</Text>
            </Pressable>
          </View>
        )}

        {/* ── Objetivo ── */}
        <LessonSection label="Objetivo">
          <Text style={styles.bodyText}>{lesson.objective}</Text>
        </LessonSection>

        {/* ── Explicación ── */}
        <LessonSection label="Explicación">
          <Text style={styles.bodyText}>{lesson.explanation}</Text>
        </LessonSection>

        {/* ── Ejemplo ── */}
        <LessonSection label="Ejemplo">
          <View style={styles.exampleBox}>
            <Text style={styles.bodyText}>{lesson.example}</Text>
          </View>
        </LessonSection>

        {/* ── Idea clave ── */}
        <LessonSection label="Idea clave" highlighted>
          <Text style={styles.keyIdeaText}>{lesson.keyIdea}</Text>
        </LessonSection>

        {/* ── Pregunta de repaso (APR-08: reflexiva, sin calificación) ── */}
        <LessonSection label="Pregunta de repaso">
          <Text style={styles.bodyText}>{lesson.reviewQuestion}</Text>
        </LessonSection>

        {/* ── Ver orientación ── */}
        <View style={styles.guidanceBlock}>
          <Pressable
            onPress={() => setShowGuidance((prev) => !prev)}
            style={({ pressed }) => [styles.guidanceToggle, pressed && styles.buttonPressed]}
            accessibilityRole="button"
            accessibilityLabel={showGuidance ? 'Ocultar orientación' : 'Ver orientación'}
          >
            <Text style={styles.guidanceToggleText}>
              {showGuidance ? 'Ocultar orientación' : 'Ver orientación'}
            </Text>
          </Pressable>

          {showGuidance && (
            <View style={styles.guidanceContent}>
              <Text style={styles.guidanceLabel}>Orientación</Text>
              <Text style={styles.bodyText}>{lesson.expectedResponse}</Text>
            </View>
          )}
        </View>

        {/* ── Marcar como revisada ── */}
        <View style={styles.reviewBlock}>
          {completed ? (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓ Lección revisada</Text>
            </View>
          ) : isSaving ? (
            <View style={[styles.markButton, styles.buttonDisabled]}>
              <Text style={styles.markButtonText}>Guardando…</Text>
            </View>
          ) : (
            <Pressable
              onPress={handleMarkAsReviewed}
              disabled={isSaving}
              style={({ pressed }) => [styles.markButton, pressed && styles.buttonPressed]}
              accessibilityRole="button"
              accessibilityLabel="Marcar lección como revisada"
            >
              <Text style={styles.markButtonText}>Marcar como revisada</Text>
            </Pressable>
          )}
        </View>

        {/* ── Navegación anterior / siguiente (APR-05) ── */}
        <View style={styles.navRow}>
          {prevLesson ? (
            <Pressable
              onPress={() => navigateToLesson(prevLesson.id)}
              style={({ pressed }) => [styles.navButton, pressed && styles.buttonPressed]}
              accessibilityRole="button"
              accessibilityLabel={`Ir a la lección anterior: ${prevLesson.title}`}
            >
              <Text style={styles.navButtonText}>← {prevLesson.title}</Text>
            </Pressable>
          ) : (
            // Primera lección: espacio vacío para conservar layout.
            <View style={styles.navPlaceholder} />
          )}

          {nextLesson ? (
            <Pressable
              onPress={() => navigateToLesson(nextLesson.id)}
              style={({ pressed }) => [styles.navButton, styles.navButtonRight, pressed && styles.buttonPressed]}
              accessibilityRole="button"
              accessibilityLabel={`Ir a la siguiente lección: ${nextLesson.title}`}
            >
              <Text style={styles.navButtonText}>{nextLesson.title} →</Text>
            </Pressable>
          ) : (
            // Última lección.
            <View style={styles.navPlaceholder} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Estilos ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF7ED',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 48,
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },

  // Volver
  backLink: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    minHeight: 40,
    justifyContent: 'center',
  },
  backLinkText: {
    fontSize: 14,
    color: '#C2410C',
    fontWeight: '600',
  },

  // Encabezado
  lessonNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 4,
  },
  lessonTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#17365D',
    marginBottom: 24,
    lineHeight: 34,
  },

  // Error banner
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#B91C1C',
    flex: 1,
    marginRight: 8,
  },
  retryButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#B91C1C',
    borderRadius: 8,
    minHeight: 36,
    justifyContent: 'center',
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  // Cuerpo de texto
  bodyText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
  },
  keyIdeaText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
    fontWeight: '500',
  },

  // Ejemplo
  exampleBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 12,
  },

  // Orientación
  guidanceBlock: {
    marginBottom: 24,
  },
  guidanceToggle: {
    borderWidth: 1,
    borderColor: '#C2410C',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    minHeight: 44,
    justifyContent: 'center',
  },
  guidanceToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C2410C',
  },
  guidanceContent: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  guidanceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },

  // Marcar como revisada
  reviewBlock: {
    marginBottom: 32,
  },
  markButton: {
    backgroundColor: '#C2410C',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  markButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  completedBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#15803D',
    minHeight: 48,
    justifyContent: 'center',
  },
  completedText: {
    color: '#15803D',
    fontSize: 16,
    fontWeight: '600',
  },

  // Navegación anterior / siguiente
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  navButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#17365D',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minHeight: 48,
    justifyContent: 'center',
  },
  navButtonRight: {
    alignItems: 'flex-end',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#17365D',
  },
  navPlaceholder: {
    flex: 1,
  },

  // Botón deshabilitado / estado presionado
  buttonPressed: {
    opacity: 0.75,
  },
  buttonDisabled: {
    opacity: 0.5,
  },

  // NotFound
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  notFoundTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#17365D',
    textAlign: 'center',
  },
  notFoundBody: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  backButton: {
    backgroundColor: '#C2410C',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 8,
    minHeight: 48,
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
