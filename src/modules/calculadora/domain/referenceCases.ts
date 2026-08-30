import { calculateResults } from './calculate';
import { interpretResultadoInicial } from './interpret';
import { formatMoney } from './format';
import { validateCalculatorForm } from './validate';
import { emptyFormValues, type CalculatorInputs } from './types';

export const CASE_A_INPUTS: CalculatorInputs = {
  inversionInicial: 500,
  costosFijos: 200,
  costoVariableUnitario: 5,
  cantidad: 100,
  margenPorcentaje: 30,
};

export const CASE_B_INPUTS: CalculatorInputs = {
  inversionInicial: 100,
  costosFijos: 50,
  costoVariableUnitario: 2,
  cantidad: 100,
  margenPorcentaje: 50,
};

const CASE_A_EXPECTED = {
  costoVariableTotal: 500,
  costoTotal: 700,
  costoUnitario: 7,
  precioSugerido: 9.1,
  ingresosEstimados: 910,
  gananciaOperativa: 210,
  resultadoInicial: -290,
};

const CASE_B_EXPECTED = {
  costoVariableTotal: 200,
  costoTotal: 250,
  costoUnitario: 2.5,
  precioSugerido: 3.75,
  ingresosEstimados: 375,
  gananciaOperativa: 125,
  resultadoInicial: 25,
};

function sameNumber(actual: number, expected: number): boolean {
  return Object.is(actual, expected) || actual === expected;
}

function collectMismatches(
  label: string,
  actual: Record<string, number>,
  expected: Record<string, number>,
): string[] {
  return Object.keys(expected).flatMap((key) => {
    const actualValue = actual[key];
    const expectedValue = expected[key];
    if (sameNumber(actualValue, expectedValue)) {
      return [];
    }
    return [`${label}.${key}: esperado ${expectedValue}, obtenido ${actualValue}`];
  });
}

export function assertReferenceCases(): string[] {
  const errors: string[] = [];
  const caseA = calculateResults(CASE_A_INPUTS);
  const caseB = calculateResults(CASE_B_INPUTS);

  errors.push(...collectMismatches('Caso A', caseA, CASE_A_EXPECTED));
  errors.push(...collectMismatches('Caso B', caseB, CASE_B_EXPECTED));

  if (formatMoney(caseA.precioSugerido) !== '9,10') {
    errors.push(`Caso A precio mostrado: esperado 9,10, obtenido ${formatMoney(caseA.precioSugerido)}`);
  }
  if (formatMoney(caseB.costoUnitario) !== '2,50') {
    errors.push(`Caso B unitario mostrado: esperado 2,50, obtenido ${formatMoney(caseB.costoUnitario)}`);
  }
  if (formatMoney(caseB.precioSugerido) !== '3,75') {
    errors.push(`Caso B precio mostrado: esperado 3,75, obtenido ${formatMoney(caseB.precioSugerido)}`);
  }

  if (interpretResultadoInicial(caseA.resultadoInicial).kind !== 'negative') {
    errors.push('Caso A debe interpretarse como negativo');
  }
  if (interpretResultadoInicial(caseB.resultadoInicial).kind !== 'positive') {
    errors.push('Caso B debe interpretarse como positivo');
  }
  if (interpretResultadoInicial(0).kind !== 'zero') {
    errors.push('Resultado 0 debe interpretarse como punto de equilibrio');
  }

  const invalid = validateCalculatorForm({
    ...emptyFormValues(),
    inversionInicial: '',
    costosFijos: '-50',
    costoVariableUnitario: 'cinco',
    cantidad: '0',
    margenPorcentaje: '120',
  });

  if (invalid.ok) {
    errors.push('Caso inválido no debió calcularse');
  } else {
    if (!invalid.errors.inversionInicial) {
      errors.push('Caso inválido: faltó error de inversión inicial');
    }
    if (!invalid.errors.costosFijos) {
      errors.push('Caso inválido: faltó error de costos fijos');
    }
    if (!invalid.errors.costoVariableUnitario) {
      errors.push('Caso inválido: faltó error de costo variable');
    }
    if (!invalid.errors.cantidad) {
      errors.push('Caso inválido: faltó error de cantidad');
    }
    if (!invalid.errors.margenPorcentaje) {
      errors.push('Caso inválido: faltó error de margen');
    }
  }

  const commaPoint = validateCalculatorForm({
    inversionInicial: '100,5',
    costosFijos: '50.25',
    costoVariableUnitario: '2',
    cantidad: '10',
    margenPorcentaje: '20',
  });
  if (!commaPoint.ok) {
    errors.push('CAL-02: una coma o un punto válidos debieron aceptarse');
  }

  return errors;
}
