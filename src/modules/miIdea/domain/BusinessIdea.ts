import { STORAGE_KEYS } from '@/src/storage';

export const IDEA_STORAGE_KEY = STORAGE_KEYS.idea;
export const IDEA_SCHEMA_VERSION = 1;

export type BusinessIdea = {
  schemaVersion: 1;
  nombreNegocio: string;
  problema: string;
  solucion: string;
  publicoObjetivo: string;
  recursosNecesarios: string;
  updatedAt: string;
};

export type MiIdeaErrors = Partial<
  Record<
    'nombreNegocio' |
    'problema' |
    'solucion' |
    'publicoObjetivo' |
    'recursosNecesarios',
    string
  >
>;

export type MiIdeaReadResultStatus =
  | 'empty'
  | 'valid'
  | 'corrupt'
  | 'unknown_schema'
  | 'storage_error';

export type MiIdeaReadResult =
  | { status: 'empty'; data: null }
  | { status: 'valid'; data: BusinessIdea }
  | { status: 'corrupt'; data: null; error: string }
  | { status: 'unknown_schema'; data: null; error: string }
  | { status: 'storage_error'; data: null; error: string };

function isValidIsoDate(dateString: string): boolean {
  if (typeof dateString !== 'string' || dateString.trim() === '') {
    return false;
  }
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function isBusinessIdea(data: unknown): data is BusinessIdea {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  return (
    obj.schemaVersion === 1 &&
    typeof obj.nombreNegocio === 'string' &&
    typeof obj.problema === 'string' &&
    typeof obj.solucion === 'string' &&
    typeof obj.publicoObjetivo === 'string' &&
    typeof obj.recursosNecesarios === 'string' &&
    isValidIsoDate(obj.updatedAt as string)
  );
}

export function hasUnknownSchemaVersion(data: unknown): boolean {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  const obj = data as Record<string, unknown>;
  return typeof obj.schemaVersion === 'number' && obj.schemaVersion !== 1;
}
