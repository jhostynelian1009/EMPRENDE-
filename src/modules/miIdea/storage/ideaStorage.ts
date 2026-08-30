import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    BusinessIdeaForm,
    BusinessIdeaSnapshot,
    IDEA_SCHEMA_VERSION,
    IDEA_STORAGE_KEY,
} from '../domain/types';
import { isBusinessIdeaSnapshot, normalizeIdeaForm, validateIdeaForm } from '../domain/validation';

export async function readBusinessIdea(): Promise<BusinessIdeaSnapshot | null> {
  try {
    const rawValue = await AsyncStorage.getItem(IDEA_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsed: unknown = JSON.parse(rawValue);

    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const candidate = parsed as Record<string, unknown>;

    if (!isBusinessIdeaSnapshot(candidate)) {
      return null;
    }

    const snapshot: BusinessIdeaSnapshot = {
      schemaVersion: IDEA_SCHEMA_VERSION,
      nombreNegocio: String(candidate.nombreNegocio).trim(),
      problema: String(candidate.problema).trim(),
      solucion: String(candidate.solucion).trim(),
      publicoObjetivo: String(candidate.publicoObjetivo).trim(),
      recursosNecesarios: String(candidate.recursosNecesarios).trim(),
      updatedAt: typeof candidate.updatedAt === 'string' ? candidate.updatedAt : new Date().toISOString(),
    };

    if (!snapshot.updatedAt) {
      return null;
    }

    return snapshot;
  } catch (error) {
    console.warn('No se pudo leer la idea de negocio.', error);
    return null;
  }
}

export async function saveBusinessIdea(form: BusinessIdeaForm): Promise<BusinessIdeaSnapshot> {
  const normalized = normalizeIdeaForm(form);
  const errors = validateIdeaForm(normalized);

  if (Object.keys(errors).length > 0) {
    throw new Error('La idea no cumple las validaciones requeridas.');
  }

  const snapshot: BusinessIdeaSnapshot = {
    schemaVersion: IDEA_SCHEMA_VERSION,
    nombreNegocio: normalized.nombreNegocio,
    problema: normalized.problema,
    solucion: normalized.solucion,
    publicoObjetivo: normalized.publicoObjetivo,
    recursosNecesarios: normalized.recursosNecesarios,
    updatedAt: new Date().toISOString(),
  };

  await AsyncStorage.setItem(IDEA_STORAGE_KEY, JSON.stringify(snapshot));

  return snapshot;
}
