export const CALCULATOR_FIELDS = [
  'inversionInicial',
  'costosFijos',
  'costoVariableUnitario',
  'cantidad',
  'margenPorcentaje',
] as const;

export type CalculatorField = (typeof CALCULATOR_FIELDS)[number];

export type CalculatorFormValues = Record<CalculatorField, string>;

export type CalculatorInputs = {
  inversionInicial: number;
  costosFijos: number;
  costoVariableUnitario: number;
  cantidad: number;
  margenPorcentaje: number;
};

export type CalculatorResults = {
  costoVariableTotal: number;
  costoTotal: number;
  costoUnitario: number;
  precioSugerido: number;
  ingresosEstimados: number;
  gananciaOperativa: number;
  resultadoInicial: number;
};

export type CalculatorSnapshot = {
  schemaVersion: 1;
  inputs: CalculatorInputs;
  results: CalculatorResults;
  updatedAt: string;
};

export type FieldErrors = Partial<Record<CalculatorField, string>>;

export type InterpretationKind = 'positive' | 'zero' | 'negative';

export type Interpretation = {
  kind: InterpretationKind;
  title: string;
  explanation: string;
};

export type ParseFailureReason = 'empty' | 'invalid';

export type ParseSuccess = { ok: true; value: number };
export type ParseFailure = { ok: false; reason: ParseFailureReason };
export type ParseResult = ParseSuccess | ParseFailure;

export type ValidationSuccess = { ok: true; inputs: CalculatorInputs };
export type ValidationFailure = {
  ok: false;
  errors: FieldErrors;
  firstField: CalculatorField;
};
export type ValidationResult = ValidationSuccess | ValidationFailure;

export function emptyFormValues(): CalculatorFormValues {
  return {
    inversionInicial: '',
    costosFijos: '',
    costoVariableUnitario: '',
    cantidad: '',
    margenPorcentaje: '',
  };
}
