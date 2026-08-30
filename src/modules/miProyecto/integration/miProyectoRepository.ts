import AsyncStorage from '@react-native-async-storage/async-storage';
import { IDEA_STORAGE_KEY } from '../../miIdea/domain/types';
import { isBusinessIdeaSnapshot } from '../../miIdea/domain/validation';
import { QuizState } from '../../quiz/types';
import {
  CalculatorSnapshot,
  ChallengeId,
  ChallengesSnapshot,
  FinanceSummary,
  IdeaSummary,
  QuizSummary,
  RetoItemSummary,
  RetosSummary,
} from '../domain/types';
import {
  isCalculatorSnapshot,
  isChallengesSnapshot,
  isQuizSnapshot,
  isValidIsoDate,
} from '../domain/validation';

export const CALCULATOR_STORAGE_KEY = '@emprende_plus:calculadora';
export const QUIZ_STORAGE_KEY = '@emprende_plus:quiz';
export const RETOS_STORAGE_KEY = '@emprende_plus:retos';

const BLOCK_ERROR_MESSAGE =
  'No pudimos leer esta sección. Puedes volver a completarla sin perder los demás avances.';

export type ModuleFetchResult = {
  ideaSummary: IdeaSummary;
  financeSummary: FinanceSummary;
  quizSummary: QuizSummary;
  retosSummary: RetosSummary;
  readErrorsCount: number;
};

function createIdeaError(): IdeaSummary {
  return {
    status: 'error',
    nombreNegocio: null,
    problema: null,
    solucion: null,
    publicoObjetivo: null,
    recursosNecesarios: null,
    updatedAt: null,
    errorMessage: BLOCK_ERROR_MESSAGE,
  };
}

function createFinanceError(): FinanceSummary {
  return {
    status: 'error',
    inversionInicial: null,
    costoTotal: null,
    precioSugerido: null,
    gananciaOperativa: null,
    resultadoInicial: null,
    updatedAt: null,
    errorMessage: BLOCK_ERROR_MESSAGE,
  };
}

function createQuizError(): QuizSummary {
  return {
    status: 'error',
    isCompleted: false,
    score: null,
    approved: null,
    completedAt: null,
    updatedAt: null,
    errorMessage: BLOCK_ERROR_MESSAGE,
  };
}

function createRetosError(): RetosSummary {
  return {
    status: 'error',
    completedCount: 0,
    totalCount: 3,
    challenges: [
      { id: 'reto-1', status: 'pending', updatedAt: null },
      { id: 'reto-2', status: 'pending', updatedAt: null },
      { id: 'reto-3', status: 'pending', updatedAt: null },
    ],
    updatedAt: null,
    errorMessage: BLOCK_ERROR_MESSAGE,
  };
}

function parseIdea(rawValue: string | null): IdeaSummary {
  if (rawValue === null) {
    return {
      status: 'empty',
      nombreNegocio: null,
      problema: null,
      solucion: null,
      publicoObjetivo: null,
      recursosNecesarios: null,
      updatedAt: null,
    };
  }

  try {
    const parsed: unknown = JSON.parse(rawValue);
    if (!isBusinessIdeaSnapshot(parsed)) {
      return createIdeaError();
    }

    const snapshot = parsed as Record<string, unknown>;
    if (!isValidIsoDate(snapshot.updatedAt)) {
      return createIdeaError();
    }

    return {
      status: 'valid',
      nombreNegocio: String(snapshot.nombreNegocio),
      problema: String(snapshot.problema),
      solucion: String(snapshot.solucion),
      publicoObjetivo: String(snapshot.publicoObjetivo),
      recursosNecesarios: String(snapshot.recursosNecesarios),
      updatedAt: snapshot.updatedAt,
    };
  } catch {
    return createIdeaError();
  }
}

function parseFinance(rawValue: string | null): FinanceSummary {
  if (rawValue === null) {
    return {
      status: 'empty',
      inversionInicial: null,
      costoTotal: null,
      precioSugerido: null,
      gananciaOperativa: null,
      resultadoInicial: null,
      updatedAt: null,
    };
  }

  try {
    const parsed: unknown = JSON.parse(rawValue);
    if (!isCalculatorSnapshot(parsed) || !isValidIsoDate(parsed.updatedAt)) {
      return createFinanceError();
    }

    const calc = parsed as CalculatorSnapshot;
    return {
      status: 'valid',
      inversionInicial: calc.inputs.inversionInicial,
      costoTotal: calc.results.costoTotal,
      precioSugerido: calc.results.precioSugerido,
      gananciaOperativa: calc.results.gananciaOperativa,
      resultadoInicial: calc.results.resultadoInicial,
      updatedAt: calc.updatedAt,
    };
  } catch {
    return createFinanceError();
  }
}

function parseQuiz(rawValue: string | null): QuizSummary {
  if (rawValue === null) {
    return {
      status: 'empty',
      isCompleted: false,
      score: null,
      approved: null,
      completedAt: null,
      updatedAt: null,
    };
  }

  try {
    const parsed: unknown = JSON.parse(rawValue);
    if (!isQuizSnapshot(parsed)) {
      return createQuizError();
    }

    const quiz = parsed as QuizState;
    return {
      status: 'valid',
      isCompleted: quiz.status === 'completed',
      score: quiz.score,
      approved: quiz.approved,
      completedAt: quiz.completedAt,
      updatedAt: quiz.updatedAt,
    };
  } catch {
    return createQuizError();
  }
}

function parseRetos(rawValue: string | null): RetosSummary {
  const defaultChallenges: RetoItemSummary[] = [
    { id: 'reto-1', status: 'pending', updatedAt: null },
    { id: 'reto-2', status: 'pending', updatedAt: null },
    { id: 'reto-3', status: 'pending', updatedAt: null },
  ];

  if (rawValue === null) {
    return {
      status: 'empty',
      completedCount: 0,
      totalCount: 3,
      challenges: defaultChallenges,
      updatedAt: null,
    };
  }

  try {
    const parsed: unknown = JSON.parse(rawValue);
    if (!isChallengesSnapshot(parsed)) {
      return createRetosError();
    }

    const snapshot = parsed as ChallengesSnapshot;
    const challengeIds: ChallengeId[] = ['reto-1', 'reto-2', 'reto-3'];
    let completedCount = 0;

    const challenges: RetoItemSummary[] = challengeIds.map((id) => {
      const item = snapshot.challenges?.[id];
      const status = item?.status === 'completed' ? 'completed' : item?.status === 'started' ? 'started' : 'pending';
      if (status === 'completed') {
        completedCount++;
      }
      return {
        id,
        status,
        updatedAt: item?.updatedAt ?? null,
      };
    });

    return {
      status: 'valid',
      completedCount,
      totalCount: 3,
      challenges,
      updatedAt: snapshot.updatedAt,
    };
  } catch {
    return createRetosError();
  }
}

export async function fetchMiProyectoData(): Promise<ModuleFetchResult> {
  const [ideaResult, financeResult, quizResult, retosResult] = await Promise.allSettled([
    AsyncStorage.getItem(IDEA_STORAGE_KEY),
    AsyncStorage.getItem(CALCULATOR_STORAGE_KEY),
    AsyncStorage.getItem(QUIZ_STORAGE_KEY),
    AsyncStorage.getItem(RETOS_STORAGE_KEY),
  ]);

  let readErrorsCount = 0;

  let ideaSummary: IdeaSummary;
  if (ideaResult.status === 'rejected') {
    readErrorsCount++;
    ideaSummary = createIdeaError();
  } else {
    ideaSummary = parseIdea(ideaResult.value);
    if (ideaSummary.status === 'error') {
      readErrorsCount++;
    }
  }

  let financeSummary: FinanceSummary;
  if (financeResult.status === 'rejected') {
    readErrorsCount++;
    financeSummary = createFinanceError();
  } else {
    financeSummary = parseFinance(financeResult.value);
    if (financeSummary.status === 'error') {
      readErrorsCount++;
    }
  }

  let quizSummary: QuizSummary;
  if (quizResult.status === 'rejected') {
    readErrorsCount++;
    quizSummary = createQuizError();
  } else {
    quizSummary = parseQuiz(quizResult.value);
    if (quizSummary.status === 'error') {
      readErrorsCount++;
    }
  }

  let retosSummary: RetosSummary;
  if (retosResult.status === 'rejected') {
    readErrorsCount++;
    retosSummary = createRetosError();
  } else {
    retosSummary = parseRetos(retosResult.value);
    if (retosSummary.status === 'error') {
      readErrorsCount++;
    }
  }

  return {
    ideaSummary,
    financeSummary,
    quizSummary,
    retosSummary,
    readErrorsCount,
  };
}
