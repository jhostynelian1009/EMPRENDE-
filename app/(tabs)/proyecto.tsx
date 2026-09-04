import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader, ErrorState, Screen } from '@/src/components/ui';
import {
  NextActionCard,
  ProjectProgressCard,
  ProjectSectionCard,
  useMiProyecto,
} from '@/src/modules/miProyecto';
import { colors } from '@/src/theme';

export default function MiProyectoScreen() {
  const router = useRouter();
  const { isLoading, data, refresh } = useMiProyecto();

  const handleNavigate = (route: string | null) => {
    if (route && route !== '/(tabs)/proyecto') {
      router.push(route as any);
    }
  };

  return (
    <Screen style={styles.screen}>
      <AppHeader
        title="Mi Proyecto"
        subtitle="Resumen consolidado de tu avance emprendedor."
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : data.globalStatus === 'total_error' ? (
        <View style={styles.errorContainer}>
          <ErrorState
            title="No pudimos cargar tu avance."
            description="Intenta de nuevo; no eliminaremos tu información."
            onRetry={refresh}
          />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ProjectProgressCard
            progressPercentage={data.progressPercentage}
            lastUpdatedAt={data.lastUpdatedAt}
          />

          <NextActionCard
            nextAction={data.nextAction}
            onPressAction={handleNavigate}
          />

          <ProjectSectionCard
            type="idea"
            title="1. Mi Idea de Negocio"
            idea={data.idea}
            onNavigate={handleNavigate}
          />

          <ProjectSectionCard
            type="finance"
            title="2. Calculadora Financiera"
            finance={data.finance}
            onNavigate={handleNavigate}
          />

          <ProjectSectionCard
            type="quiz"
            title="3. Quiz de Conocimientos"
            quiz={data.quiz}
            onNavigate={handleNavigate}
          />

          <ProjectSectionCard
            type="retos"
            title="4. Retos Prácticos"
            retos={data.retos}
            onNavigate={handleNavigate}
          />
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
});
