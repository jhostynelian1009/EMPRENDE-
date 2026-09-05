import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  hasUnknownSchemaVersion,
  isQuizSnapshot,
  QUIZ_STORAGE_KEY,
} from './guards';
import { QuizReadResult, QuizSnapshot, QuizState } from './types';

export const initialQuizState: QuizState = {
  schemaVersion: 1,
  status: 'inProgress',
  answers: {},
  score: null,
  approved: null,
  completedAt: null,
  updatedAt: null,
};

export async function loadQuizSnapshot(): Promise<QuizReadResult> {
  try {
    const raw = await AsyncStorage.getItem(QUIZ_STORAGE_KEY);
    if (raw === null || raw.trim() === '') {
      return { status: 'empty', snapshot: null };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return {
        status: 'corrupt',
        snapshot: null,
        error: 'JSON malformado en almacenamiento.',
      };
    }

    if (hasUnknownSchemaVersion(parsed)) {
      return {
        status: 'unknown_schema',
        snapshot: null,
        error: 'Versión de schema desconocida en almacenamiento.',
      };
    }

    if (isQuizSnapshot(parsed)) {
      return { status: 'valid', snapshot: parsed };
    }

    return {
      status: 'corrupt',
      snapshot: null,
      error: 'Estructura o datos de quiz inválidos en almacenamiento.',
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error de lectura en almacenamiento.';
    return { status: 'storage_error', snapshot: null, error: errorMessage };
  }
}

export async function loadQuizState(): Promise<QuizState> {
  const result = await loadQuizSnapshot();
  if (result.status === 'valid' && result.snapshot) {
    return result.snapshot;
  }
  return initialQuizState;
}

export async function saveQuizState(state: QuizState): Promise<void> {
  const snapshot: QuizSnapshot = {
    ...state,
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
  };

  if (!isQuizSnapshot(snapshot)) {
    throw new Error('Intento de guardar un estado de Quiz inválido.');
  }

  const jsonValue = JSON.stringify(snapshot);
  await AsyncStorage.setItem(QUIZ_STORAGE_KEY, jsonValue);
}

export async function clearQuizState(): Promise<void> {
  await AsyncStorage.removeItem(QUIZ_STORAGE_KEY);
}
