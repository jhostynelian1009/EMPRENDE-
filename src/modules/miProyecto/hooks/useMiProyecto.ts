import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  calculateProgress,
  determineGlobalStatus,
  determineNextAction,
  getLatestIsoDate,
} from '../domain/projectSummary';
import { MiProyectoViewModel, UseMiProyectoResult } from '../domain/types';
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
  const isMountedRef = useRef<boolean>(true);

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

      const { rawProgressPercentage, progressPercentage } = calculateProgress(
        ideaSummary,
        financeSummary,
        quizSummary,
        retosSummary
      );

      const globalStatus = determineGlobalStatus(
        rawProgressPercentage,
        readErrorsCount
      );

      const lastUpdatedAt = getLatestIsoDate([
        ideaSummary.updatedAt,
        financeSummary.updatedAt,
        quizSummary.updatedAt,
        quizSummary.completedAt,
        retosSummary.updatedAt,
      ]);

      const nextAction = determineNextAction(
        rawProgressPercentage,
        globalStatus,
        ideaSummary,
        financeSummary,
        quizSummary,
        retosSummary
      );

      if (isMountedRef.current) {
        setData({
          globalStatus,
          progressPercentage,
          rawProgressPercentage,
          lastUpdatedAt,
          nextAction,
          idea: ideaSummary,
          finance: financeSummary,
          quiz: quizSummary,
          retos: retosSummary,
        });
      }
    } catch {
      if (isMountedRef.current) {
        setData((prev) => ({
          ...prev,
          globalStatus: 'total_error',
          nextAction: {
            type: 'create_idea',
            title: 'No pudimos cargar tu avance.',
            message: 'Intenta de nuevo; no eliminaremos tu información.',
            actionText: 'Reintentar',
            route: null,
          },
        }));
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      isMountedRef.current = true;
      loadData();
      return () => {
        isMountedRef.current = false;
      };
    }, [loadData])
  );

  return {
    isLoading,
    data,
    refresh: loadData,
  };
}
