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

// Módulos e integración con APIs públicas de datos
import { useAprende } from '@/src/modules/aprende/hooks/useAprende';
import { LESSONS } from '@/src/modules/aprende/data/content';
import {
  fetchMiProyectoData,
  calculateProgress,
} from '@/src/modules/miProyecto';
import type {
  IdeaProjectSummary,
  FinanceProjectSummary,
  QuizProjectSummary,
  ChallengesProjectSummary,
} from '@/src/modules/miProyecto';

interface DashboardState {
  ideaSummary: IdeaProjectSummary;
  financeSummary: FinanceProjectSummary;
  quizSummary: QuizProjectSummary;
  retosSummary: ChallengesProjectSummary;
}

const INITIAL_DASHBOARD_STATE: DashboardState = {
  ideaSummary: {
    status: 'empty',
    nombreNegocio: null,
    problema: null,
    solucion: null,
    publicoObjetivo: null,
    recursosNecesarios: null,
    updatedAt: null,
  },
  financeSummary: {
    status: 'empty',
    inversionInicial: null,
    costoTotal: null,
    precioSugerido: null,
    gananciaOperativa: null,
    resultadoInicial: null,
    updatedAt: null,
  },
  quizSummary: {
    status: 'empty',
    isCompleted: false,
    score: null,
    approved: null,
    completedAt: null,
    updatedAt: null,
  },
  retosSummary: {
    status: 'empty',
    completedCount: 0,
    totalCount: 3,
    challenges: [],
    updatedAt: null,
  },
};

export default function HomeScreen() {
  const {
    completedCount,
    totalLessons,
    progress,
    refreshProgress,
    isLessonCompleted,
  } = useAprende();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] =
    useState<DashboardState>(INITIAL_DASHBOARD_STATE);

  // Carga asíncrona de estados locales consumiendo APIs públicas mediante la capa de agregación de Mi Proyecto
  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    refreshProgress();
    try {
      const data = await fetchMiProyectoData();
      setDashboardData({
        ideaSummary: data.ideaSummary,
        financeSummary: data.financeSummary,
        quizSummary: data.quizSummary,
        retosSummary: data.retosSummary,
      });
    } catch {
      // Ante un fallo imprevisto, se conserva el estado seguro por defecto
    } finally {
      setIsLoading(false);
    }
  }, [refreshProgress]);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [loadDashboardData])
  );

  const { ideaSummary, financeSummary, quizSummary, retosSummary } =
    dashboardData;

  const ideaSaved = ideaSummary.status === 'valid';
  const calcSaved = financeSummary.status === 'valid';

  const quizCompleted =
    quizSummary.status === 'valid' && quizSummary.isCompleted;
  const quizApproved = quizCompleted && quizSummary.approved === true;

  const retosCompletedCount =
    retosSummary.status === 'valid' ? retosSummary.completedCount : 0;

  const { progressPercentage } = calculateProgress(
    ideaSummary,
    financeSummary,
    quizSummary,
    retosSummary
  );

  // Lección recomendada para "Continúa aprendiendo"
  const pendingLesson =
    LESSONS.find((l) => !isLessonCompleted(l.id as any)) || LESSONS[0];

  // Algoritmo de "Siguiente paso" según especificación educativa
  const getNextStep = () => {
    // 1. Si no existe Mi Idea válida
    if (!ideaSaved) {
      return {
        title: 'Describe tu idea de negocio',
        description:
          'Define la necesidad, la solución y el público objetivo de tu propuesta.',
        actionTitle: 'Ir a Mi Idea',
        onPress: () => router.push('/(tabs)/mi-idea'),
        iconName: 'lightbulb.fill' as const,
      };
    }
    // 2. Si quedan lecciones pendientes en Aprende
    if (completedCount < totalLessons) {
      return {
        title:
          completedCount === 0
            ? 'Comienza con la lección Emprendimiento'
            : 'Continúa aprendiendo',
        description:
          'Aprende los conceptos clave para iniciar tu negocio con bases sólidas.',
        actionTitle: 'Ir a Aprende',
        onPress: () => router.push('/(tabs)/aprende'),
        iconName: 'book.fill' as const,
      };
    }
    // 3. Si no existe cálculo válido en Calculadora
    if (!calcSaved) {
      return {
        title: 'Ponle números a tu idea',
        description:
          'Calcula la inversión inicial, los costos y el precio sugerido para tu producto o servicio.',
        actionTitle: 'Ir a Calculadora',
        onPress: () => router.push('/calculadora'),
        iconName: 'number.circle.fill' as const,
      };
    }
    // 4. Si el Quiz no está completado o aprobado
    if (!quizCompleted || !quizApproved) {
      return {
        title: 'Comprueba lo aprendido',
        description:
          'Ponte a prueba con el cuestionario interactivo de 10 preguntas.',
        actionTitle: 'Ir al Quiz',
        onPress: () => router.push('/quiz'),
        iconName: 'checkmark.seal.fill' as const,
      };
    }
    // 5. Si quedan Retos sin completar
    if (retosCompletedCount < 3) {
      return {
        title: 'Continúa tus retos',
        description:
          'Completa los 3 desafíos prácticos para fortalecer tu plan de negocio.',
        actionTitle: 'Ir a Retos',
        onPress: () => router.push('/(tabs)/retos'),
        iconName: 'flag.fill' as const,
      };
    }
    // 6. Cuando los módulos anteriores estén completos
    return {
      title: 'Revisa tu proyecto antes de presentarlo',
      description:
        '¡Felicitaciones! Has completado todos los módulos. Revisa el resumen consolidado de tu proyecto.',
      actionTitle: 'Ver Mi Proyecto',
      onPress: () => router.push('/(tabs)/proyecto'),
      iconName: 'folder.fill' as const,
    };
  };

  const nextStep = getNextStep();

  // Estados visuales específicos para la tarjeta de Quiz
  const getQuizCardStatus = () => {
    if (quizSummary.status === 'valid') {
      if (quizSummary.isCompleted) {
        return quizSummary.approved ? 'approved' : 'failed';
      }
      return 'started';
    }
    return 'pending';
  };

  const getQuizCardLabel = () => {
    if (quizSummary.status === 'valid') {
      if (quizSummary.isCompleted) {
        return quizSummary.approved ? 'Aprobado' : 'No aprobado';
      }
      return 'En progreso';
    }
    return 'Pendiente';
  };

  return (
    <Screen scrollable accessibilityLabel="Pantalla de Inicio de EMPRENDE+">
      {/* 1. Header con marca tipográfica y bienvenida */}
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
          snapToInterval={262}
          decelerationRate="fast"
        >
          {/* 1. Aprende */}
          <ModuleCard
            title="Aprende"
            description="Conceptos esenciales para tu emprendimiento"
            iconName="book.fill"
            status={
              completedCount === totalLessons
                ? 'completed'
                : completedCount > 0
                ? 'started'
                : 'pending'
            }
            statusLabel={`${completedCount} de ${totalLessons} lecciones`}
            actionTitle={completedCount > 0 ? 'Continuar' : 'Ver lecciones'}
            onPress={() => router.push('/(tabs)/aprende')}
          />

          {/* 2. Mi Idea */}
          <ModuleCard
            title="Mi Idea"
            description="Estructura y define tu propuesta de negocio"
            iconName="lightbulb.fill"
            status={ideaSaved ? 'completed' : 'pending'}
            statusLabel={ideaSaved ? 'Idea guardada' : 'Sin iniciar'}
            actionTitle={ideaSaved ? 'Editar idea' : 'Crear idea'}
            onPress={() => router.push('/(tabs)/mi-idea')}
          />

          {/* 3. Calculadora */}
          <ModuleCard
            title="Calculadora"
            description="Calcula costos, margen y precio sugerido"
            iconName="number.circle.fill"
            status={calcSaved ? 'completed' : 'pending'}
            statusLabel={calcSaved ? 'Cálculo guardado' : 'Sin calcular'}
            actionTitle={calcSaved ? 'Revisar' : 'Calcular'}
            onPress={() => router.push('/calculadora')}
          />

          {/* 4. Quiz */}
          <ModuleCard
            title="Quiz"
            description="Cuestionario de 10 preguntas con retroalimentación"
            iconName="checkmark.seal.fill"
            status={getQuizCardStatus()}
            statusLabel={getQuizCardLabel()}
            actionTitle={
              quizSummary.status === 'valid' && quizSummary.isCompleted
                ? 'Repetir quiz'
                : 'Realizar quiz'
            }
            onPress={() => router.push('/quiz')}
          />

          {/* 5. Retos */}
          <ModuleCard
            title="Retos"
            description="3 desafíos prácticos para tu proyecto"
            iconName="flag.fill"
            status={
              retosCompletedCount === 3
                ? 'completed'
                : retosCompletedCount > 0
                ? 'started'
                : 'pending'
            }
            statusLabel={`${retosCompletedCount} de 3 retos`}
            actionTitle={retosCompletedCount > 0 ? 'Continuar' : 'Comenzar'}
            onPress={() => router.push('/(tabs)/retos')}
          />

          {/* 6. Mi Proyecto */}
          <ModuleCard
            title="Mi Proyecto"
            description="Resumen consolidado de tu progreso general"
            iconName="folder.fill"
            status={
              progressPercentage === 100
                ? 'completed'
                : progressPercentage > 0
                ? 'started'
                : 'pending'
            }
            statusLabel={
              isLoading ? 'Ver resumen' : `${progressPercentage}% completado`
            }
            actionTitle="Ver proyecto"
            onPress={() => router.push('/(tabs)/proyecto')}
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

          <PrimaryButton
            title={nextStep.actionTitle}
            onPress={nextStep.onPress}
            style={styles.nextStepButton}
          />
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
