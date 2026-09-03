import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { colors, spacing, typography } from '@/src/theme';
import {
  Screen,
  ModuleCard,
  ContentCard,
  PrimaryButton,
  StatusBadge,
} from '@/src/components/ui';
import { IconSymbol } from '@/components/ui/icon-symbol';

// Módulos existentes con exportaciones públicas
import { useAprende } from '@/src/modules/aprende/hooks/useAprende';
import { LESSONS } from '@/src/modules/aprende/data/content';
import { getBusinessIdea } from '@/src/modules/miIdea/data/repository';
import { loadQuizState } from '@/src/modules/quiz/repository';
import type { QuizState } from '@/src/modules/quiz/types';

export default function HomeScreen() {
  const {
    completedCount,
    totalLessons,
    progress,
    refreshProgress,
    isLessonCompleted,
  } = useAprende();

  const [ideaSaved, setIdeaSaved] = useState(false);
  const [quizState, setQuizState] = useState<QuizState | null>(null);

  // Carga de estados locales de los otros módulos existentes
  const loadDashboardData = useCallback(async () => {
    refreshProgress();
    try {
      const idea = await getBusinessIdea();
      setIdeaSaved(
        !!(
          idea &&
          idea.nombreNegocio.trim() &&
          idea.problema.trim() &&
          idea.solucion.trim()
        )
      );
    } catch {
      setIdeaSaved(false);
    }

    try {
      const quiz = await loadQuizState();
      setQuizState(quiz);
    } catch {
      setQuizState(null);
    }
  }, [refreshProgress]);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [loadDashboardData])
  );

  // Lección recomendada para "Continúa aprendiendo"
  const pendingLesson =
    LESSONS.find((l) => !isLessonCompleted(l.id as any)) || LESSONS[0];

  // Algoritmo de "Siguiente paso" según spec/01-design/02-navigation-home.md
  const quizCompleted = quizState?.status === 'completed';

  const getNextStep = () => {
    // 1. Si Mi Idea está vacía
    if (!ideaSaved) {
      return {
        title: 'Describe tu idea de negocio',
        description:
          'Define la necesidad, la solución y el público objetivo de tu propuesta.',
        actionTitle: 'Ir a Mi Idea',
        onPress: () => router.push('/mi-idea'),
        iconName: 'lightbulb.fill' as const,
        disabled: false,
      };
    }
    // 2. Si Mi Idea existe y Aprende tiene contenido pendiente
    if (completedCount < totalLessons) {
      return {
        title: completedCount === 0 ? 'Comienza con la lección Emprendimiento' : 'Continúa aprendiendo',
        description:
          'Aprende los conceptos clave para iniciar tu negocio con bases sólidas.',
        actionTitle: 'Ir a Aprende',
        onPress: () => router.push('/aprende'),
        iconName: 'book.fill' as const,
        disabled: false,
      };
    }
    // 3. Si corresponde completar el Quiz y su estado está disponible
    if (quizState && (!quizCompleted || !quizState.approved)) {
      return {
        title: 'Comprueba lo aprendido',
        description:
          'Ponte a prueba con el cuestionario interactivo de 10 preguntas.',
        actionTitle: 'Ir al Quiz',
        onPress: () => router.push('/quiz'),
        iconName: 'checkmark.seal.fill' as const,
        disabled: false,
      };
    }
    // 4. Módulos faltantes (Calculadora, Retos, Proyecto no integrados)
    return {
      title: 'Módulos pendientes de integración',
      description:
        'Has completado los módulos actuales. Los siguientes estarán disponibles pronto.',
      actionTitle: 'Próximamente',
      onPress: () => {},
      iconName: 'clock.fill' as const,
      disabled: true,
    };
  };

  const nextStep = getNextStep();

  return (
    <Screen scrollable accessibilityLabel="Pantalla de Inicio de EMPRENDE+">
      {/* 1. Header con marca tipográfica temporal y bienvenida */}
      <View style={styles.headerContainer}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandNavy}>EMPRENDE</Text>
          <Text style={styles.brandOrange}>+</Text>
        </View>

        <Text style={styles.greetingTitle}>Hola, emprendedor</Text>
        <Text style={styles.greetingSubtitle}>
          Convierte tu idea en proyecto
        </Text>
      </View>

      {/* 2. Sección: Tu recorrido (Carrusel Horizontal) */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Tu recorrido</Text>
          <Text style={styles.carouselHint}>Desliza para ver más</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
          snapToInterval={262} // Ancho tarjeta + gap
          decelerationRate="fast"
        >
          {/* 1. Aprende */}
          <ModuleCard
            title="Aprende"
            description="Conceptos esenciales para tu emprendimiento"
            iconName="book.fill"
            status={completedCount > 0 ? 'started' : 'pending'}
            statusLabel={`${completedCount} de ${totalLessons} lecciones`}
            actionTitle="Ver lecciones"
            onPress={() => router.push('/aprende')}
          />

          {/* 2. Mi Idea */}
          <ModuleCard
            title="Mi Idea"
            description="Estructura y define tu propuesta de negocio"
            iconName="lightbulb.fill"
            status={ideaSaved ? 'completed' : 'pending'}
            statusLabel={ideaSaved ? 'Idea guardada' : 'Sin iniciar'}
            actionTitle={ideaSaved ? 'Editar idea' : 'Crear idea'}
            onPress={() => router.push('/mi-idea')}
          />

          {/* 3. Calculadora (Pendiente de integración) */}
          <ModuleCard
            title="Calculadora"
            description="Calcula costos, margen y precio sugerido"
            iconName="number.circle.fill"
            status="pending_integration"
            statusLabel="Pendiente de integración"
            actionTitle="No disponible"
            onPress={() => {}}
            disabled
          />

          {/* 4. Quiz */}
          <ModuleCard
            title="Quiz"
            description="Cuestionario de 10 preguntas con retroalimentación"
            iconName="checkmark.seal.fill"
            status={
              quizState?.status === 'completed'
                ? quizState.approved
                  ? 'approved'
                  : 'completed'
                : 'pending'
            }
            statusLabel={
              quizState?.status === 'completed'
                ? quizState.approved
                  ? 'Aprobado'
                  : 'Completado'
                : 'Pendiente'
            }
            actionTitle={
              quizState?.status === 'completed'
                ? 'Repetir quiz'
                : 'Realizar quiz'
            }
            onPress={() => router.push('/quiz')}
          />

          {/* 5. Retos (Pendiente de integración) */}
          <ModuleCard
            title="Retos"
            description="3 desafíos prácticos para tu proyecto"
            iconName="flag.fill"
            status="pending_integration"
            statusLabel="Pendiente de integración"
            actionTitle="No disponible"
            onPress={() => {}}
            disabled
          />

          {/* 6. Mi Proyecto (Pendiente de integración) */}
          <ModuleCard
            title="Mi Proyecto"
            description="Resumen consolidado de tu progreso general"
            iconName="folder.fill"
            status="pending_integration"
            statusLabel="Pendiente de integración"
            actionTitle="No disponible"
            onPress={() => {}}
            disabled
          />
        </ScrollView>
      </View>

      {/* 3. Sección: Continúa aprendiendo */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Continúa aprendiendo</Text>

        <ContentCard style={styles.lessonCard}>
          <View style={styles.lessonCardHeader}>
            <View style={styles.lessonBadgeRow}>
              <StatusBadge
                status={
                  isLessonCompleted(pendingLesson.id as any)
                    ? 'completed'
                    : progress.lastLessonId === pendingLesson.id
                    ? 'started'
                    : 'pending'
                }
              />
              <Text style={styles.lessonModuleTag}>Módulo 1: Lecciones</Text>
            </View>
          </View>

          <Text style={styles.lessonTitle}>{pendingLesson.title}</Text>
          <Text style={styles.lessonSummary} numberOfLines={2}>
            {pendingLesson.objective}
          </Text>

          <Pressable
            onPress={() => router.push(`/aprende/${pendingLesson.id}` as any)}
            style={({ pressed }) => [
              styles.continueButton,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Continuar lección: ${pendingLesson.title}`}
          >
            <Text style={styles.continueButtonText}>Continuar lección</Text>
            <IconSymbol
              name="chevron.right"
              size={16}
              color={colors.primaryDark}
            />
          </Pressable>
        </ContentCard>
      </View>

      {/* 4. Sección: Siguiente paso */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Siguiente paso</Text>

        <ContentCard style={styles.nextStepCard}>
          <View style={styles.nextStepHeader}>
            <View style={styles.nextStepIconContainer}>
              <IconSymbol
                name={nextStep.iconName}
                size={24}
                color={colors.primary}
              />
            </View>
            <View style={styles.nextStepTextContainer}>
              <Text style={styles.nextStepTitle}>{nextStep.title}</Text>
              <Text style={styles.nextStepDescription}>
                {nextStep.description}
              </Text>
            </View>
          </View>

          {!nextStep.disabled && (
            <PrimaryButton
              title={nextStep.actionTitle}
              onPress={nextStep.onPress}
              style={styles.nextStepButton}
            />
          )}
        </ContentCard>
      </View>

      {/* Espacio final inferior para evitar superposición con Bottom Navigation */}
      <View style={styles.bottomSpacer} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: Platform.OS === 'android' ? spacing.md : spacing.xs,
    marginBottom: spacing.xl,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  brandNavy: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.secondary,
    letterSpacing: 0.5,
  },
  brandOrange: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
    marginLeft: 2,
  },
  greetingTitle: {
    ...typography.display,
    color: colors.secondary,
    marginBottom: spacing.xs,
  },
  greetingSubtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  sectionContainer: {
    marginBottom: spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.secondary,
    marginBottom: spacing.md,
  },
  carouselHint: {
    ...typography.caption,
    color: colors.textMuted,
  },
  carouselContent: {
    paddingRight: spacing.lg,
    gap: spacing.md,
  },
  lessonCard: {
    gap: spacing.sm,
  },
  lessonCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  lessonModuleTag: {
    ...typography.caption,
    color: colors.textMuted,
  },
  lessonTitle: {
    ...typography.h3,
    color: colors.secondary,
    marginTop: spacing.xs,
  },
  lessonSummary: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: 12,
    marginTop: spacing.sm,
    minHeight: 44,
  },
  continueButtonText: {
    ...typography.label,
    color: colors.primaryDark,
  },
  pressed: {
    opacity: 0.8,
  },
  nextStepCard: {
    backgroundColor: colors.surface,
    borderColor: colors.primaryLight,
    borderWidth: 1.5,
  },
  nextStepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  nextStepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextStepTextContainer: {
    flex: 1,
  },
  nextStepTitle: {
    ...typography.h3,
    color: colors.secondary,
    marginBottom: spacing.xs,
  },
  nextStepDescription: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  nextStepButton: {
    marginTop: spacing.xs,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});
