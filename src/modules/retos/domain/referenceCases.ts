import {
  createInitialSnapshot,
  getRetosProgress,
  hasUnknownSchemaVersion,
  isChallengeUnlocked,
  isChallengesSnapshot,
} from './snapshot';
import type { ChallengesSnapshot } from './types';
import { validateChallengeAnswers } from './validate';

export function assertRetosReferenceCases(): string[] {
  const errors: string[] = [];

  const initial = createInitialSnapshot();

  if (!isChallengesSnapshot(initial)) {
    errors.push('El snapshot inicial no pasó la guarda isChallengesSnapshot');
  }

  if (!isChallengeUnlocked('reto-1', initial)) {
    errors.push('reto-1 debe estar desbloqueado inicialmente');
  }

  if (isChallengeUnlocked('reto-2', initial)) {
    errors.push('reto-2 debe estar bloqueado inicialmente');
  }

  if (isChallengeUnlocked('reto-3', initial)) {
    errors.push('reto-3 debe estar bloqueado inicialmente');
  }

  const p0 = getRetosProgress(initial);
  if (p0.completedCount !== 0 || p0.percentage !== 0) {
    errors.push(`Progreso inicial esperado 0%, obtenido ${p0.percentage}%`);
  }

  const r1Invalid = validateChallengeAnswers('reto-1', {
    problemaObservado: 'corto',
    publicoObjetivo: '123',
    evidencia: 'abc',
    propuestaValor: 'xyz',
  });
  if (r1Invalid.ok) {
    errors.push('reto-1 con campos cortos no debió ser válido');
  }

  const r1ValidAnswers = {
    problemaObservado: 'Los estudiantes pierden mucho tiempo buscando almuerzos.',
    publicoObjetivo: 'Estudiantes de primer año del instituto ISTAE.',
    evidencia: 'Observamos filas largas y demoras de más de 45 minutos.',
    propuestaValor: 'Ofrecemos menús saludables reservados con anticipación.',
  };
  const r1Valid = validateChallengeAnswers('reto-1', r1ValidAnswers);
  if (!r1Valid.ok) {
    errors.push('reto-1 con campos válidos debió retornar ok');
  }

  const snapshotR1Completed: ChallengesSnapshot = {
    ...initial,
    challenges: {
      ...initial.challenges,
      'reto-1': {
        status: 'completed',
        answers: r1ValidAnswers,
        updatedAt: new Date().toISOString(),
      },
    },
  };

  if (!isChallengeUnlocked('reto-2', snapshotR1Completed)) {
    errors.push('reto-2 debió desbloquearse tras completar reto-1');
  }

  const r2InvalidCostos = validateChallengeAnswers('reto-2', {
    unidadVenta: 'Plato',
    resumenCostos: 'Costo de insumos y transporte diario.',
    precioSugerido: '3.50',
    interpretacion: 'El precio propuesto cubre el costo y deja margen aceptable.',
  });
  if (r2InvalidCostos.ok) {
    errors.push(
      'reto-2 debió exigir mencionar los términos "fijo" y "variable" en resumenCostos',
    );
  }

  const r2ValidAnswers = {
    unidadVenta: 'Plato de almuerzo',
    resumenCostos:
      'Incluye costos fijos mensuales y costo variable por cada unidad.',
    precioSugerido: '3.75',
    interpretacion:
      'El resultado de la calculadora es positivo y recupera la inversión.',
  };
  const r2Valid = validateChallengeAnswers('reto-2', r2ValidAnswers);
  if (!r2Valid.ok) {
    errors.push('reto-2 con entradas válidas debió ser aceptado');
  }

  const snapshotAllCompleted: ChallengesSnapshot = {
    schemaVersion: 1,
    challenges: {
      'reto-1': {
        status: 'completed',
        answers: r1ValidAnswers,
        updatedAt: new Date().toISOString(),
      },
      'reto-2': {
        status: 'completed',
        answers: r2ValidAnswers,
        updatedAt: new Date().toISOString(),
      },
      'reto-3': {
        status: 'completed',
        answers: {
          nombreProblema:
            'Sabores San Lorenzo atiende la falta de almuerzos rápidos.',
          solucionPublico:
            'Ofrecemos menús saludables y económicos para estudiantes del ISTAE.',
          datoBeneficio:
            'Precio de 3,75 con margen suficiente para cubrir costos.',
          llamadoAccion: 'Reservar el primer menú',
        },
        updatedAt: new Date().toISOString(),
      },
    },
    updatedAt: new Date().toISOString(),
  };

  const p100 = getRetosProgress(snapshotAllCompleted);
  if (p100.completedCount !== 3 || p100.percentage !== 100) {
    errors.push(`Progreso total esperado 100%, obtenido ${p100.percentage}%`);
  }

  const unknownSchemaObj = { schemaVersion: 99, challenges: {} };
  if (!hasUnknownSchemaVersion(unknownSchemaObj)) {
    errors.push('hasUnknownSchemaVersion debió detectar schemaVersion desconocido');
  }
  if (isChallengesSnapshot(unknownSchemaObj)) {
    errors.push('isChallengesSnapshot debió rechazar schemaVersion desconocido');
  }

  return errors;
}
