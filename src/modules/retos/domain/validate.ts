import { CHALLENGES } from './data';
import type {
  ChallengeAnswers,
  ChallengeId,
  FieldErrors,
  ValidationResult,
} from './types';

export function validateChallengeAnswers(
  challengeId: ChallengeId,
  answers: ChallengeAnswers,
): ValidationResult {
  const definition = CHALLENGES[challengeId];
  if (!definition) {
    return { ok: false, errors: { _global: 'Reto no encontrado.' } };
  }

  const errors: FieldErrors = {};

  for (const field of definition.campos) {
    const rawValue = answers[field.id];
    const strVal =
      rawValue !== undefined && rawValue !== null ? String(rawValue).trim() : '';

    if (strVal === '') {
      errors[field.id] = `Ingresa ${field.label.toLowerCase()}.`;
      continue;
    }

    if (field.type === 'decimal') {
      const normalized = strVal.replace(',', '.');
      const numVal = Number(normalized);
      if (!Number.isFinite(numVal) || numVal <= 0) {
        errors[field.id] = `${field.label} debe ser un número mayor que 0.`;
      }
      continue;
    }

    if (field.minLength && strVal.length < field.minLength) {
      errors[field.id] = `${field.label} debe tener al menos ${field.minLength} caracteres.`;
      continue;
    }

    if (challengeId === 'reto-2' && field.id === 'resumenCostos') {
      const lower = strVal.toLowerCase();
      const hasFijo = lower.includes('fijo');
      const hasVariable = lower.includes('variable');
      if (!hasFijo || !hasVariable) {
        errors[field.id] =
          'El resumen de costos debe mencionar los términos "fijo" y "variable".';
      }
    }
  }

  const firstField = definition.campos.find((f) => errors[f.id])?.id;

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    firstField,
  };
}
