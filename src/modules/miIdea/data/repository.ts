import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BusinessIdea,
  hasUnknownSchemaVersion,
  IDEA_STORAGE_KEY,
  isBusinessIdea,
  MiIdeaReadResult,
} from '../domain/BusinessIdea';

export async function loadBusinessIdea(): Promise<MiIdeaReadResult> {
  try {
    const raw = await AsyncStorage.getItem(IDEA_STORAGE_KEY);
    if (raw === null || raw.trim() === '') {
      return { status: 'empty', data: null };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return {
        status: 'corrupt',
        data: null,
        error: 'JSON malformado en almacenamiento.',
      };
    }

    if (hasUnknownSchemaVersion(parsed)) {
      return {
        status: 'unknown_schema',
        data: null,
        error: 'Versión de schema desconocida en almacenamiento.',
      };
    }

    if (isBusinessIdea(parsed)) {
      return { status: 'valid', data: parsed };
    }

    return {
      status: 'corrupt',
      data: null,
      error: 'Estructura o tipos de datos de idea inválidos.',
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error de lectura en almacenamiento.';
    return { status: 'storage_error', data: null, error: errorMessage };
  }
}

export async function getBusinessIdea(): Promise<BusinessIdea | null> {
  const result = await loadBusinessIdea();
  if (result.status === 'valid') {
    return result.data;
  }
  return null;
}

export async function saveBusinessIdea(idea: BusinessIdea): Promise<void> {
  const jsonValue = JSON.stringify(idea);
  await AsyncStorage.setItem(IDEA_STORAGE_KEY, jsonValue);
}
