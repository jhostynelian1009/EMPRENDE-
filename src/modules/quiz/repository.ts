import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuizState } from './types';

const QUIZ_STORAGE_KEY = '@emprende_plus:quiz';

export const initialQuizState: QuizState = {
  schemaVersion: 1,
  status: 'inProgress',
  answers: {},
  score: null,
  approved: null,
  completedAt: null,
  updatedAt: null,
};

/**
 * Guarda el estado actual del Quiz en AsyncStorage.
 */
export async function saveQuizState(state: QuizState): Promise<void> {
  try {
    const toSave: QuizState = { ...state, updatedAt: new Date().toISOString() };
    const jsonValue = JSON.stringify(toSave);
    await AsyncStorage.setItem(QUIZ_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Error al guardar el estado del quiz', e);
  }
}

/**
 * Recupera el estado del Quiz desde AsyncStorage.
 * Si no existe, retorna el estado inicial.
 */
export async function loadQuizState(): Promise<QuizState> {
  try {
    const jsonValue = await AsyncStorage.getItem(QUIZ_STORAGE_KEY);
    if (jsonValue != null) {
      return JSON.parse(jsonValue) as QuizState;
    }
  } catch (e) {
    console.error('Error al cargar el estado del quiz', e);
  }
  return initialQuizState;
}

/**
 * Reinicia completamente el intento de Quiz.
 */
export async function clearQuizState(): Promise<void> {
  try {
    await saveQuizState(initialQuizState);
  } catch (e) {
    console.error('Error al reiniciar el estado del quiz', e);
  }
}
