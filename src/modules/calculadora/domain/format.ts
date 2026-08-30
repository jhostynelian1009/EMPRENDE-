import type { CalculatorFormValues, CalculatorInputs } from './types';

export function formatMoney(value: number): string {
  const [integerPart, decimalPart] = value.toFixed(2).split('.');
  return `${integerPart},${decimalPart}`;
}

export function formValuesFromInputs(inputs: CalculatorInputs): CalculatorFormValues {
  return {
    inversionInicial: String(inputs.inversionInicial),
    costosFijos: String(inputs.costosFijos),
    costoVariableUnitario: String(inputs.costoVariableUnitario),
    cantidad: String(inputs.cantidad),
    margenPorcentaje: String(inputs.margenPorcentaje),
  };
}
