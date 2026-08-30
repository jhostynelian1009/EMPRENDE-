import type { CalculatorField } from './types';

export const FIELD_MESSAGES: Record<CalculatorField, string> = {
  inversionInicial: 'Ingresa la inversión inicial.',
  costosFijos: 'Ingresa los costos fijos.',
  costoVariableUnitario: 'Ingresa el costo variable por unidad.',
  cantidad: 'La cantidad debe ser un entero mayor que cero.',
  margenPorcentaje: 'El margen debe estar entre 0 % y 100 %.',
};

export const FIELD_LABELS: Record<CalculatorField, string> = {
  inversionInicial: 'Inversión inicial',
  costosFijos: 'Costos fijos',
  costoVariableUnitario: 'Costo variable por unidad',
  cantidad: 'Cantidad de productos',
  margenPorcentaje: 'Margen de ganancia',
};

export const RESULT_LABELS = {
  costoVariableTotal: 'Costo variable total',
  costoTotal: 'Costo total',
  costoUnitario: 'Costo unitario',
  precioSugerido: 'Precio sugerido',
  ingresosEstimados: 'Ingresos estimados',
  gananciaOperativa: 'Ganancia operativa',
  resultadoInicial: 'Resultado inicial',
} as const;

export const EDUCATIONAL_NOTICE =
  'Esta es una herramienta educativa. Los resultados son estimaciones y no constituyen asesoría financiera.';

export const SCREEN_INTRO =
  'Estima costos, precio sugerido, ingresos, ganancia operativa y si recuperas la inversión inicial.';
