import { STORAGE_KEYS } from '@/src/storage';

export const CALCULATOR_STORAGE_KEY = STORAGE_KEYS.calculadora;

export type {
  CalculatorInputs,
  CalculatorResults,
  CalculatorSnapshot,
} from './domain/types';

export {
  isCalculatorSnapshot,
  hasUnknownSchemaVersion,
} from './domain/snapshot';

export { calculateResults } from './domain/calculate';
export { interpretResultadoInicial } from './domain/interpret';
export { formatMoney } from './domain/format';

export {
  loadCalculatorSnapshot,
  type CalculatorReadResult,
} from './storage/calculatorRepository';
