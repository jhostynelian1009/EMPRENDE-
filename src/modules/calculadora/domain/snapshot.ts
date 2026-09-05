import type {
  CalculatorInputs,
  CalculatorResults,
  CalculatorSnapshot,
} from './types';

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isInputs(value: unknown): value is CalculatorInputs {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const inputs = value as Record<string, unknown>;
  return (
    isFiniteNumber(inputs.inversionInicial) &&
    isFiniteNumber(inputs.costosFijos) &&
    isFiniteNumber(inputs.costoVariableUnitario) &&
    isFiniteNumber(inputs.cantidad) &&
    isFiniteNumber(inputs.margenPorcentaje)
  );
}

function isResults(value: unknown): value is CalculatorResults {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const results = value as Record<string, unknown>;
  return (
    isFiniteNumber(results.costoVariableTotal) &&
    isFiniteNumber(results.costoTotal) &&
    isFiniteNumber(results.costoUnitario) &&
    isFiniteNumber(results.precioSugerido) &&
    isFiniteNumber(results.ingresosEstimados) &&
    isFiniteNumber(results.gananciaOperativa) &&
    isFiniteNumber(results.resultadoInicial)
  );
}

export function isCalculatorSnapshot(value: unknown): value is CalculatorSnapshot {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const snapshot = value as Record<string, unknown>;
  return (
    snapshot.schemaVersion === 1 &&
    typeof snapshot.updatedAt === 'string' &&
    snapshot.updatedAt.trim() !== '' &&
    isInputs(snapshot.inputs) &&
    isResults(snapshot.results)
  );
}

export function hasUnknownSchemaVersion(value: unknown): boolean {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const snapshot = value as { schemaVersion?: unknown };
  return (
    typeof snapshot.schemaVersion === 'number' && snapshot.schemaVersion !== 1
  );
}

export function createSnapshot(
  inputs: CalculatorInputs,
  results: CalculatorResults,
  updatedAt = new Date().toISOString(),
): CalculatorSnapshot {
  return {
    schemaVersion: 1,
    inputs,
    results,
    updatedAt,
  };
}
