import type { CalculatorInputs, CalculatorResults } from './types';

export function calculateResults(inputs: CalculatorInputs): CalculatorResults {
  const {
    inversionInicial,
    costosFijos,
    costoVariableUnitario,
    cantidad,
    margenPorcentaje,
  } = inputs;

  if (cantidad <= 0) {
    throw new Error('No se puede calcular: la cantidad debe ser mayor que cero.');
  }

  const costoVariableTotal = costoVariableUnitario * cantidad;
  const costoTotal = costosFijos + costoVariableTotal;
  const costoUnitario = costoTotal / cantidad;
  const precioSugerido = costoUnitario * (1 + margenPorcentaje / 100);
  const ingresosEstimados = precioSugerido * cantidad;
  const gananciaOperativa = ingresosEstimados - costoTotal;
  const resultadoInicial = gananciaOperativa - inversionInicial;

  return {
    costoVariableTotal,
    costoTotal,
    costoUnitario,
    precioSugerido,
    ingresosEstimados,
    gananciaOperativa,
    resultadoInicial,
  };
}
