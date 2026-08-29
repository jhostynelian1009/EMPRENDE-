import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { useAprende } from '@/src/modules/aprende/hooks/useAprende';
import { LESSONS } from '@/src/modules/aprende/data/content';
import { LessonCard } from '@/src/modules/aprende/components/LessonCard';
import { AprendeProgressBar } from '@/src/modules/aprende/components/AprendeProgressBar';
import type { LessonStatus } from '@/src/modules/aprende/components/LessonCard';

export default function AprendeScreen() {
  const {
    progress,
    isLoading,
    error,
    refreshProgress,
    completedCount,
    totalLessons,
    progressPercentage,
    isLessonCompleted,
  } = useAprende();

  /**
   * Refresca el progreso cada vez que el usuario vuelve a esta pantalla.
   * Esto garantiza que el catálogo refleje los cambios hechos en la pantalla
   * de detalle (ej. marcar una lección como revisada) sin necesidad de
   * estado global ni contexto compartido.
   *
   * useFocusEffect ejecuta el callback cada vez que la pantalla recibe foco,
   * incluyendo el regreso de una ruta hija en Expo Router.
   */
  useFocusEffect(
    useCallback(() => {
      refreshProgress();
    }, [refreshProgress]),
  );

  /**
   * Determina el estado de una lección según las reglas de la spec:
   * - 'completed': su ID está en completedLessonIds
   * - 'inProgress': es la última visitada y no está completada
   * - 'pending': ninguno de los anteriores
   */
  const getLessonStatus = (lessonId: string): LessonStatus => {
    if (isLessonCompleted(lessonId as any)) return 'completed';
    if (progress.lastLessonId === lessonId) return 'inProgress';
    return 'pending';
  };

  const handleLessonPress = (lessonId: string) => {
    // La ruta usa el ID oficial, nunca el título ni el índice.
    router.push(`/aprende/${lessonId}` as any);
  };

  // ─── Estado de carga ─────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#F97316" />
        <Text style={styles.loadingText}>Cargando tu progreso…</Text>
      </SafeAreaView>
    );
  }

  // ─── Pantalla principal ───────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Aprende</Text>
          <Text style={styles.screenSubtitle}>
            Conceptos esenciales para comenzar tu emprendimiento
          </Text>
        </View>

        {/* Aviso de error recuperable (no oculta el contenido) */}
        {error !== null && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>
              No pudimos guardar tu progreso. Intenta de nuevo.
            </Text>
            <Pressable
              onPress={refreshProgress}
              style={styles.retryButton}
              accessibilityRole="button"
              accessibilityLabel="Reintentar carga del progreso"
            >
              <Text style={styles.retryText}>Reintentar</Text>
            </Pressable>
          </View>
        )}

        {/* Progreso general */}
        <AprendeProgressBar
          completedCount={completedCount}
          totalLessons={totalLessons}
          progressPercentage={progressPercentage}
        />

        {/* Catálogo: exactamente 7 lecciones en el orden oficial de LESSONS */}
        <View style={styles.catalog}>
          {LESSONS.map((lesson) => {
            const status = getLessonStatus(lesson.id);
            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                status={status}
                onPress={() => handleLessonPress(lesson.id)}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    paddingTop: 24,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF7ED',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  header: {
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#17365D',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
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
  catalog: {
    gap: 0, // El margen inferior está en LessonCard
  },
});
