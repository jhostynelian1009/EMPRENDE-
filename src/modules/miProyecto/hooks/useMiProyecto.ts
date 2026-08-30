import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { MiProyectoViewModel, UseMiProyectoResult } from '../domain/types';
import {
  calculateProgress,
  determineGlobalStatus,
  determineNextAction,
  getLatestIsoDate,
} from '../domain/validation';
import { fetchMiProyectoData } from '../integration/miProyectoRepository';

const INITIAL_VIEW_MODEL: MiProyectoViewModel = {
  globalStatus: 'empty',
  progressPercentage: 0,
  rawProgressPercentage: 0,
  lastUpdatedAt: null,
  nextAction: {
    type: 'create_idea',
    title: 'Tu proyecto todavía no tiene información.',
    message: 'Empieza por describir tu idea de negocio.',
    actionText: 'Crear mi idea',
    route: '/(tabs)/mi-idea',
  },
  idea: {
    status: 'empty',
    nombreNegocio: null,
    problema: null,
    solucion: null,
    publicoObjetivo: null,
    recursosNecesarios: null,
    updatedAt: null,
  },
  finance: {
    status: 'empty',
    inversionInicial: null,
    costoTotal: null,
    precioSugerido: null,
    gananciaOperativa: null,
    resultadoInicial: null,
    updatedAt: null,
  },
  quiz: {
    status: 'empty',
    isCompleted: false,
    score: null,
    approved: null,
    completedAt: null,
    updatedAt: null,
  },
  retos: {
    status: 'empty',
    completedCount: 0,
    totalCount: 3,
    challenges: [
      { id: 'reto-1', status: 'pending', updatedAt: null },
      { id: 'reto-2', status: 'pending', updatedAt: null },
      { id: 'reto-3', status: 'pending', updatedAt: null },
    ],
    updatedAt: null,
  },
};

export function useMiProyecto(): UseMiProyectoResult {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<MiProyectoViewModel>(INITIAL_VIEW_MODEL);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        ideaSummary,
        financeSummary,
        quizSummary,
        retosSummary,
        readErrorsCount,
      } = await fetchMiProyectoData();

      const { rawProgress, displayProgress } = calculateProgress(
        ideaSummary,
        financeSummary,
        quizSummary,
        retosSummary
      );

      const globalStatus = determineGlobalStatus(rawProgress, readErrorsCount);

      const lastUpdatedAt = getLatestIsoDate([
        ideaSummary.updatedAt,
        financeSummary.updatedAt,
        quizSummary.updatedAt,
        quizSummary.completedAt,
        retosSummary.updatedAt,
      ]);

      const nextAction = determineNextAction(
        rawProgress,
        globalStatus,
        ideaSummary,
        financeSummary,
        quizSummary,
        retosSummary
      );

      setData({
        globalStatus,
        progressPercentage: displayProgress,
        rawProgressPercentage: rawProgress,
        lastUpdatedAt,
        nextAction,
        idea: ideaSummary,
        finance: financeSummary,
        quiz: quizSummary,
        retos: retosSummary,
      });
    } catch {
      setData((prev) => ({
        ...prev,
        globalStatus: 'total_error',
      }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  return {
    isLoading,
    data,
    refresh: loadData,
  };
}
