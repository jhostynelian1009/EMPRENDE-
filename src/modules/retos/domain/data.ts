import type { ChallengeDefinition, ChallengeId } from './types';

export const CHALLENGES: Record<ChallengeId, ChallengeDefinition> = {
  'reto-1': {
    id: 'reto-1',
    title: 'Reto 1',
    subtitle: 'Descubre el problema y tu cliente',
    proposito:
      'Convertir una idea general en un problema concreto y un público objetivo reconocible.',
    situacion:
      'Tienes una idea que parece útil, pero aún no sabes exactamente quién la necesita ni qué problema resolverá.',
    problema:
      'Si el problema y el cliente son demasiado amplios, será difícil diseñar una solución útil.',
    pasos: [
      'Escribe una situación real que hayas observado.',
      'Define a quién afecta usando características concretas.',
      'Explica por qué vale la pena resolverla.',
      'Redacta una propuesta de valor en una sola oración.',
    ],
    campos: [
      {
        id: 'problemaObservado',
        label: 'Problema observado',
        type: 'text-long',
        placeholder: 'Describe la situación o dificultad real que observaste...',
        help: 'Mínimo 20 caracteres.',
        minLength: 20,
      },
      {
        id: 'publicoObjetivo',
        label: 'Público objetivo',
        type: 'text-short',
        placeholder: 'Ej. Estudiantes universitarios de primer año...',
        help: 'Mínimo 5 caracteres.',
        minLength: 5,
      },
      {
        id: 'evidencia',
        label: 'Evidencia o razón',
        type: 'text-long',
        placeholder: 'Explica por qué es importante o qué datos observaste...',
        help: 'Mínimo 15 caracteres.',
        minLength: 15,
      },
      {
        id: 'propuestaValor',
        label: 'Propuesta de valor',
        type: 'text-long',
        placeholder: 'En una oración, explica tu solución y beneficio principal...',
        help: 'Mínimo 20 caracteres.',
        minLength: 20,
      },
    ],
    ejemplo:
      'Estudiantes del ISTAE pierden tiempo buscando almuerzos económicos. Ofreceremos menús saludables reservados por WhatsApp y entregados cerca del instituto.',
    logro:
      'El problema, el cliente y la propuesta guardan relación directa y pueden entenderse sin información adicional.',
  },
  'reto-2': {
    id: 'reto-2',
    title: 'Reto 2',
    subtitle: 'Ponle números a tu idea',
    proposito:
      'Usar la calculadora para comprobar si el precio cubre costos y margen esperado.',
    situacion:
      'Ya tienes una solución, pero todavía no sabes cuánto cuesta ofrecerla ni qué precio sería razonable.',
    problema:
      'Vender sin calcular costos puede producir pérdidas aunque existan clientes.',
    pasos: [
      'Define una unidad de venta clara.',
      'Registra costos fijos, variable por unidad, cantidad y margen.',
      'Usa la Calculadora financiera de EMPRENDE+.',
      'Interpreta si el resultado inicial es positivo, cero o negativo.',
    ],
    campos: [
      {
        id: 'unidadVenta',
        label: 'Unidad de venta',
        type: 'text-short',
        placeholder: 'Ej. Plato de almuerzo, hora de tutoría...',
        help: 'Mínimo 3 caracteres.',
        minLength: 3,
      },
      {
        id: 'resumenCostos',
        label: 'Resumen de costos',
        type: 'text-long',
        placeholder: 'Menciona tus costos fijos y costo variable por unidad...',
        help: 'Mínimo 15 caracteres. Debe mencionar "fijo" y "variable".',
        minLength: 15,
      },
      {
        id: 'precioSugerido',
        label: 'Precio sugerido',
        type: 'decimal',
        placeholder: '0.00',
        help: 'Valor numérico mayor que 0.',
      },
      {
        id: 'interpretacion',
        label: 'Interpretación',
        type: 'text-long',
        placeholder: 'Explica si el resultado inicial recupera tu inversión...',
        help: 'Mínimo 20 caracteres.',
        minLength: 20,
      },
    ],
    ejemplo:
      'Para 100 almuerzos: costo total de 250 dólares, costo unitario de 2,50 y precio sugerido de 3,75 con margen del 50 %. El resultado inicial es positivo si se recupera la inversión.',
    logro:
      'La interpretación coincide con el resultado de la calculadora y explica si se recupera la inversión inicial.',
  },
  'reto-3': {
    id: 'reto-3',
    title: 'Reto 3',
    subtitle: 'Presenta tu proyecto en un minuto',
    proposito:
      'Construir un mensaje breve que conecte problema, solución, cliente y viabilidad.',
    situacion:
      'Debes explicar tu idea a una persona que no conoce el proyecto y solo tienes un minuto.',
    problema:
      'Una explicación extensa o desordenada puede ocultar el valor de una buena idea.',
    pasos: [
      'Menciona nombre del proyecto y problema.',
      'Explica solución y quién la necesita.',
      'Incluye un dato financiero o beneficio concreto.',
      'Cierra con una acción: probar, comprar, apoyar o dar retroalimentación.',
    ],
    campos: [
      {
        id: 'nombreProblema',
        label: 'Nombre y problema',
        type: 'text-long',
        placeholder: 'Nombre de tu emprendimiento y la dificultad que aborda...',
        help: 'Mínimo 20 caracteres.',
        minLength: 20,
      },
      {
        id: 'solucionPublico',
        label: 'Solución y público',
        type: 'text-long',
        placeholder: 'Tu solución concreta y a quiénes va dirigida...',
        help: 'Mínimo 25 caracteres.',
        minLength: 25,
      },
      {
        id: 'datoBeneficio',
        label: 'Dato o beneficio',
        type: 'text-long',
        placeholder: 'Dato clave de costos/precio o beneficio directo...',
        help: 'Mínimo 15 caracteres.',
        minLength: 15,
      },
      {
        id: 'llamadoAccion',
        label: 'Llamado a la acción',
        type: 'text-short',
        placeholder: 'Ej. Probar el prototipo, reservar un pedido...',
        help: 'Mínimo 5 caracteres.',
        minLength: 5,
      },
    ],
    ejemplo:
      'Sabores San Lorenzo ofrece almuerzos saludables y económicos para estudiantes con poco tiempo. Los pedidos se reservan por WhatsApp y el precio se calcula para cubrir costos. Buscamos cinco estudiantes que prueben el primer menú.',
    logro:
      'El mensaje contiene problema, solución, público, beneficio y acción.',
  },
};

export const CHALLENGE_LIST: ChallengeDefinition[] = [
  CHALLENGES['reto-1'],
  CHALLENGES['reto-2'],
  CHALLENGES['reto-3'],
];
