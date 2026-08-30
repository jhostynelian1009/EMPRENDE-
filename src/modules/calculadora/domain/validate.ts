import { FIELD_MESSAGES } from './messages';
import { parseDecimal, parseInteger } from './parse';
import {
  CALCULATOR_FIELDS,
  type CalculatorField,
  type CalculatorFormValues,
  type CalculatorInputs,
  type FieldErrors,
  type ParseResult,
  type ValidationResult,
} from './types';

function isInRange(
  field: CalculatorField,
  value: number,
): boolean {
  switch (field) {
    case 'cantidad':
      return Number.isInteger(value) && value > 0;
    case 'margenPorcentaje':
      return value >= 0 && value <= 100;
    default:
      return value >= 0;
  }
}

function parseField(field: CalculatorField, raw: string): ParseResult {
  return field === 'cantidad' ? parseInteger(raw) : parseDecimal(raw);
}

export function validateCalculatorForm(
  values: CalculatorFormValues,
): ValidationResult {
  const errors: FieldErrors = {};
  const inputs = {} as CalculatorInputs;

  for (const field of CALCULATOR_FIELDS) {
    const parsed = parseField(field, values[field]);

    if (!parsed.ok || !isInRange(field, parsed.value)) {
      errors[field] = FIELD_MESSAGES[field];
      continue;
    }

    inputs[field] = parsed.value;
  }

  const firstField = CALCULATOR_FIELDS.find((field) => errors[field]);
  if (firstField) {
    return { ok: false, errors, firstField };
  }

  return { ok: true, inputs };
}
