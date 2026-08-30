import AsyncStorage from '@react-native-async-storage/async-storage';
import { AprendeProgress, LessonId } from '../domain/types';
import { LESSONS, isValidLessonId } from '../data/content';

export const APRENDE_STORAGE_KEY = '@emprende_plus:aprende';

export const INITIAL_PROGRESS: AprendeProgress = {
  schemaVersion: 1,
  completedLessonIds: [],
  lastLessonId: null,
  updatedAt: null,
};

/**
 * Ordena un array de LessonIds según el orden oficial definido en LESSONS.
 * Elimina duplicados en el proceso.
 */
const sanitizeCompletedLessonIds = (ids: unknown[]): LessonId[] => {
  if (!Array.isArray(ids)) return [];
  
  const validIds = ids.filter((id): id is LessonId => typeof id === 'string' && isValidLessonId(id));
  const uniqueIds = Array.from(new Set(validIds));
  
  // Ordenar según el orden oficial
  return uniqueIds.sort((a, b) => {
    const indexA = LESSONS.findIndex((l) => l.id === a);
    const indexB = LESSONS.findIndex((l) => l.id === b);
    return indexA - indexB;
  });
};

/**
 * Lee el progreso desde AsyncStorage.
 *
 * Distingue tres situaciones:
 *   A. No existen datos aún   → devuelve INITIAL_PROGRESS sin establecer error.
 *   B. JSON corrupto o esquema incompatible → devuelve INITIAL_PROGRESS sin
 *      sobrescribir el almacenamiento. El problema se registra en consola.
 *   C. Error real de AsyncStorage (p. ej. I/O) → relanza la excepción para que
 *      el llamador (refreshProgress) la capture y establezca error en el hook.
 */
export const loadAprendeProgress = async (): Promise<AprendeProgress> => {
  let jsonString: string | null;

  // Caso C: error real de AsyncStorage — se relanza para que el hook lo capture.
  try {
    jsonString = await AsyncStorage.getItem(APRENDE_STORAGE_KEY);
  } catch (storageError) {
    console.error('Error leyendo AsyncStorage para AprendeProgress:', storageError);
    throw storageError;
  }

  // Caso A: no existen datos todavía.
  if (!jsonString) {
    return { ...INITIAL_PROGRESS };
  }

  // Caso B-1: JSON corrupto.
  let data: unknown;
  try {
    data = JSON.parse(jsonString);
  } catch (parseError) {
    console.warn(
      'AprendeStorage: JSON corrupto en almacenamiento. Se usa estado inicial. No se sobrescribe.',
      parseError,
    );
    return { ...INITIAL_PROGRESS };
  }

  // Caso B-2: esquema desconocido o estructura inválida.
  if (!data || typeof data !== 'object' || (data as Record<string, unknown>).schemaVersion !== 1) {
    console.warn(
      'AprendeStorage: esquema inválido o incompatible. Se usa estado inicial. No se sobrescribe.',
    );
    return { ...INITIAL_PROGRESS };
  }

  const raw = data as Record<string, unknown>;
  const sanitizedIds = sanitizeCompletedLessonIds(
    Array.isArray(raw.completedLessonIds) ? raw.completedLessonIds : [],
  );
  const lastLessonId =
    typeof raw.lastLessonId === 'string' && isValidLessonId(raw.lastLessonId)
      ? raw.lastLessonId
      : null;
  const updatedAt = typeof raw.updatedAt === 'string' ? raw.updatedAt : null;

  return {
    schemaVersion: 1,
    completedLessonIds: sanitizedIds,
    lastLessonId,
    updatedAt,
  };
};

/**
 * Guarda el progreso en AsyncStorage.
 */
export const saveAprendeProgress = async (progress: AprendeProgress): Promise<void> => {
  try {
    const jsonString = JSON.stringify(progress);
    await AsyncStorage.setItem(APRENDE_STORAGE_KEY, jsonString);
  } catch (error) {
    console.error('Error escribiendo AsyncStorage para AprendeProgress:', error);
    throw error;
  }
};
