import { useState, useEffect, useCallback, useRef } from 'react';
import { AprendeProgress, LessonId } from '../domain/types';
import { loadAprendeProgress, saveAprendeProgress, INITIAL_PROGRESS } from '../storage/aprendeStorage';
import { LESSONS } from '../data/content';

export const useAprende = () => {
  const [progress, setProgress] = useState<AprendeProgress>(INITIAL_PROGRESS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Referencia al último progreso confirmado (persistido exitosamente).
   * Es la base para calcular el siguiente estado en cada operación de escritura.
   * No se confunde con el estado React (progress), que puede estar desactualizado
   * durante la espera de operaciones anteriores en la cola.
   */
  const confirmedProgressRef = useRef<AprendeProgress>(INITIAL_PROGRESS);

  /**
   * Cola de promesas que serializa todas las escrituras.
   * Cada operación espera a que la anterior complete antes de ejecutarse,
   * y lee `confirmedProgressRef.current` como base, garantizando que dos
   * llamadas consecutivas no partan del mismo estado obsoleto.
   */
  const saveQueue = useRef<Promise<void>>(Promise.resolve());

  /**
   * Contador de operaciones de escritura activas.
   * isSaving solo pasa a false cuando el contador llega a 0,
   * evitando deshabilitación prematura si hay varias operaciones en cola.
   */
  const savingCountRef = useRef<number>(0);

  // ──────────────────────────────────────────────────────────────────────────
  // Carga
  // ──────────────────────────────────────────────────────────────────────────

  const refreshProgress = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await loadAprendeProgress();
      confirmedProgressRef.current = data;
      setProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar el progreso'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  // ──────────────────────────────────────────────────────────────────────────
  // Motor de escritura serializada
  //
  // Flujo por operación:
  //   1. Tomar el último estado confirmado de `confirmedProgressRef`.
  //   2. Calcular el siguiente estado mediante la función pura `nextStateFn`.
  //   3. Persistir en AsyncStorage.
  //   4. Si persiste: actualizar `confirmedProgressRef` y el estado React,
  //      limpiar error.
  //   5. Si falla: establecer error; el estado React conserva el último
  //      valor confirmado. El botón vuelve a estar disponible.
  // ──────────────────────────────────────────────────────────────────────────

  const enqueueWrite = useCallback(
    (nextStateFn: (confirmed: AprendeProgress) => AprendeProgress): Promise<void> => {
      savingCountRef.current += 1;
      setIsSaving(true);

      const writePromise = saveQueue.current.then(async () => {
        const current = confirmedProgressRef.current;
        const nextProgress = nextStateFn(current);
        await saveAprendeProgress(nextProgress);
        // Solo después de una escritura exitosa actualizamos el estado visible.
        confirmedProgressRef.current = nextProgress;
        setProgress(nextProgress);
        setError(null);
      });

      // El saveQueue nunca debe quedar en estado rejected para no romper la cola
      saveQueue.current = writePromise.catch((err) => {
        console.error('Error al persistir progreso de Aprende:', err);
        setError(err instanceof Error ? err : new Error('Error al guardar el progreso'));
        // No revertimos progress: conserva el último valor confirmado.
      });

      // Aseguramos decremento del contador al final (éxito o fallo)
      saveQueue.current = saveQueue.current.finally(() => {
        savingCountRef.current -= 1;
        if (savingCountRef.current === 0) {
          setIsSaving(false);
        }
      });

      // Devolvemos writePromise al llamador para que sepa si su operación falló
      return writePromise;
    },
    [],
  );

  // ──────────────────────────────────────────────────────────────────────────
  // API pública
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Registra que el usuario abrió una lección.
   * Actualiza lastLessonId y updatedAt. NO añade a completedLessonIds.
   * Precondición: lessonId debe ser un LessonId válido (validado por la ruta).
   */
  const recordLessonVisit = useCallback(
    (lessonId: LessonId): Promise<void> => {
      return enqueueWrite((confirmed) => ({
        ...confirmed,
        lastLessonId: lessonId,
        updatedAt: new Date().toISOString(),
      }));
    },
    [enqueueWrite],
  );

  /**
   * Marca una lección como revisada.
   * Añade el ID a completedLessonIds sin duplicados, en orden oficial.
   * Solo muestra "revisada" en UI tras confirmación de AsyncStorage.
   * Es idempotente: llamar dos veces no genera duplicados.
   * Precondición: lessonId debe ser un LessonId válido (validado por la ruta).
   */
  const markLessonAsReviewed = useCallback(
    (lessonId: LessonId): Promise<void> => {
      return enqueueWrite((confirmed) => {
        const idSet = new Set<LessonId>(confirmed.completedLessonIds);
        idSet.add(lessonId);
        const newIds = Array.from(idSet).sort((a, b) => {
          const indexA = LESSONS.findIndex((l) => l.id === a);
          const indexB = LESSONS.findIndex((l) => l.id === b);
          return indexA - indexB;
        });
        return {
          ...confirmed,
          completedLessonIds: newIds,
          lastLessonId: lessonId,
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [enqueueWrite],
  );

  const isLessonCompleted = useCallback(
    (lessonId: LessonId): boolean => {
      return progress.completedLessonIds.includes(lessonId);
    },
    [progress.completedLessonIds],
  );

  const totalLessons = 7;
  const completedCount = progress.completedLessonIds.length;
  // Valor derivado; nunca se persiste.
  const progressPercentage = completedCount > 0 ? (completedCount / totalLessons) * 100 : 0;

  return {
    progress,
    isLoading,
    isSaving,
    error,
    refreshProgress,
    recordLessonVisit,
    markLessonAsReviewed,
    isLessonCompleted,
    totalLessons,
    completedCount,
    progressPercentage,
  };
};
