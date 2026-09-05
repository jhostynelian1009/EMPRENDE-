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

function parseField(field: CalculatorField, raw: string): ParseResult {
  return field === 'cantidad' ? parseInteger(raw) : parseDecimal(raw);
}

function getFieldError(field: CalculatorField, parsed: ParseResult): string | null {
  if (!parsed.ok) {
    if (parsed.reason === 'empty') {
      return FIELD_MESSAGES[field];
    }
    switch (field) {
      case 'inversionInicial':
        return 'Ingresa un valor numérico válido para la inversión inicial.';
      case 'costosFijos':
        return 'Ingresa un valor numérico válido para los costos fijos.';
      case 'costoVariableUnitario':
        return 'Ingresa un valor numérico válido para el costo variable por unidad.';
      case 'cantidad':
        return FIELD_MESSAGES.cantidad;
      case 'margenPorcentaje':
        return FIELD_MESSAGES.margenPorcentaje;
      default:
        return FIELD_MESSAGES[field];
    }
  }

  const val = parsed.value;

  switch (field) {
    case 'inversionInicial':
      if (val < 0) return 'La inversión inicial no puede ser negativa.';
      break;
    case 'costosFijos':
      if (val < 0) return 'Los costos fijos no pueden ser negativos.';
      break;
    case 'costoVariableUnitario':
      if (val < 0) return 'El costo variable por unidad no puede ser negativo.';
      break;
    case 'cantidad':
      if (!Number.isInteger(val)) return 'La cantidad debe ser un número entero sin decimales.';
      if (val <= 0) return FIELD_MESSAGES.cantidad;
      break;
    case 'margenPorcentaje':
      if (val < 0 || val > 100) return FIELD_MESSAGES.margenPorcentaje;
      break;
  }

  return null;
}

export function validateCalculatorForm(
  values: CalculatorFormValues,
): ValidationResult {
  const errors: FieldErrors = {};
  const inputs = {} as CalculatorInputs;

  for (const field of CALCULATOR_FIELDS) {
    const parsed = parseField(field, values[field]);
    const errorMsg = getFieldError(field, parsed);

    if (errorMsg) {
      errors[field] = errorMsg;
      continue;
    }

    if (parsed.ok) {
      inputs[field] = parsed.value;
    }
  }

  const firstField = CALCULATOR_FIELDS.find((field) => errors[field]);
  if (firstField) {
    return { ok: false, errors, firstField };
  }

  return { ok: true, inputs };
}
