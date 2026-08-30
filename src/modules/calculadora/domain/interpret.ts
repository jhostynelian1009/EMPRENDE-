import type { Interpretation } from './types';

export function interpretResultadoInicial(resultadoInicial: number): Interpretation {
  if (resultadoInicial > 0) {
    return {
      kind: 'positive',
      title: 'Ganancia estimada',
      explanation:
        'Los ingresos cubren los costos y recuperan la inversión inicial, con excedente.',
    };
  }

  if (resultadoInicial < 0) {
    return {
      kind: 'negative',
      title: 'Inversión todavía no recuperada',
      explanation:
        'La ganancia operativa aún no recupera completamente la inversión inicial.',
    };
  }

  return {
    kind: 'zero',
    title: 'Punto de equilibrio',
    explanation:
      'Se recupera exactamente la inversión inicial, sin ganancia ni pérdida estimada.',
  };
}
