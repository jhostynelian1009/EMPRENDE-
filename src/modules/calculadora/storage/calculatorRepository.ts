import { STORAGE_KEYS, readJson, removeJson, writeJson } from '@/src/storage';

import {
  hasUnknownSchemaVersion,
  isCalculatorSnapshot,
  type CalculatorSnapshot,
} from '../domain';

export type CalculatorReadResult =
  | { status: 'empty' }
  | { status: 'ready'; snapshot: CalculatorSnapshot }
  | { status: 'unavailable' }
  | { status: 'unreadable' };

export async function loadCalculatorSnapshot(): Promise<CalculatorReadResult> {
  try {
    const value = await readJson(STORAGE_KEYS.calculadora);

    if (value === null) {
      return { status: 'empty' };
    }

    if (hasUnknownSchemaVersion(value)) {
      if (__DEV__) {
        console.warn('Calculadora: schemaVersion desconocida; se conserva el valor original.');
      }
      return { status: 'unavailable' };
    }

    if (!isCalculatorSnapshot(value)) {
      if (__DEV__) {
        console.warn('Calculadora: snapshot ilegible; no se borra la clave.');
      }
      return { status: 'unreadable' };
    }

    return { status: 'ready', snapshot: value };
  } catch (error) {
    if (__DEV__) {
      console.warn('Calculadora: fallo al leer el snapshot.', error);
    }
    return { status: 'unreadable' };
  }
}

export async function saveCalculatorSnapshot(
  snapshot: CalculatorSnapshot,
): Promise<void> {
  await writeJson(STORAGE_KEYS.calculadora, snapshot);
}

export async function clearCalculatorSnapshot(): Promise<void> {
  await removeJson(STORAGE_KEYS.calculadora);
}
