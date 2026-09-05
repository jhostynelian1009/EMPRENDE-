import { loadCalculatorSnapshot } from '@/src/modules/calculadora';
import { loadBusinessIdea } from '@/src/modules/miIdea';
import { loadQuizSnapshot } from '@/src/modules/quiz';
import { loadChallengesSnapshot } from '@/src/modules/retos';
import {
  ChallengeProjectItem,
  ChallengesProjectSummary,
  FinanceProjectSummary,
  IdeaProjectSummary,
  QuizProjectSummary,
} from '../domain/types';

const BLOCK_ERROR_MESSAGE =
  'No pudimos leer esta sección. Puedes volver a completarla sin perder los demás avances.';

export type ModuleFetchResult = {
  ideaSummary: IdeaProjectSummary;
  financeSummary: FinanceProjectSummary;
  quizSummary: QuizProjectSummary;
  retosSummary: ChallengesProjectSummary;
  readErrorsCount: number;
};

function createIdeaError(): IdeaProjectSummary {
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

function createFinanceError(): FinanceProjectSummary {
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

function createQuizError(): QuizProjectSummary {
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

function createRetosError(): ChallengesProjectSummary {
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

export async function fetchMiProyectoData(): Promise<ModuleFetchResult> {
  const [ideaRes, calcRes, quizRes, retosRes] = await Promise.allSettled([
    loadBusinessIdea(),
    loadCalculatorSnapshot(),
    loadQuizSnapshot(),
    loadChallengesSnapshot(),
  ]);

  let ideaSummary: IdeaProjectSummary;
  if (ideaRes.status === 'fulfilled') {
    const res = ideaRes.value;
    if (res.status === 'valid') {
      ideaSummary = {
        status: 'valid',
        nombreNegocio: res.data.nombreNegocio,
        problema: res.data.problema,
        solucion: res.data.solucion,
        publicoObjetivo: res.data.publicoObjetivo,
        recursosNecesarios: res.data.recursosNecesarios,
        updatedAt: res.data.updatedAt,
      };
    } else if (res.status === 'empty') {
      ideaSummary = {
        status: 'empty',
        nombreNegocio: null,
        problema: null,
        solucion: null,
        publicoObjetivo: null,
        recursosNecesarios: null,
        updatedAt: null,
      };
    } else {
      ideaSummary = createIdeaError();
    }
  } else {
    ideaSummary = createIdeaError();
  }

  let financeSummary: FinanceProjectSummary;
  if (calcRes.status === 'fulfilled') {
    const res = calcRes.value;
    if (res.status === 'ready') {
      financeSummary = {
        status: 'valid',
        inversionInicial: res.snapshot.inputs.inversionInicial,
        costoTotal: res.snapshot.results.costoTotal,
        precioSugerido: res.snapshot.results.precioSugerido,
        gananciaOperativa: res.snapshot.results.gananciaOperativa,
        resultadoInicial: res.snapshot.results.resultadoInicial,
        updatedAt: res.snapshot.updatedAt,
      };
    } else if (res.status === 'empty') {
      financeSummary = {
        status: 'empty',
        inversionInicial: null,
        costoTotal: null,
        precioSugerido: null,
        gananciaOperativa: null,
        resultadoInicial: null,
        updatedAt: null,
      };
    } else {
      financeSummary = createFinanceError();
    }
  } else {
    financeSummary = createFinanceError();
  }

  let quizSummary: QuizProjectSummary;
  if (quizRes.status === 'fulfilled') {
    const res = quizRes.value;
    if (res.status === 'valid') {
      quizSummary = {
        status: 'valid',
        isCompleted: res.snapshot.status === 'completed',
        score: res.snapshot.score,
        approved: res.snapshot.approved,
        completedAt: res.snapshot.completedAt,
        updatedAt: res.snapshot.updatedAt,
      };
    } else if (res.status === 'empty') {
      quizSummary = {
        status: 'empty',
        isCompleted: false,
        score: null,
        approved: null,
        completedAt: null,
        updatedAt: null,
      };
    } else {
      quizSummary = createQuizError();
    }
  } else {
    quizSummary = createQuizError();
  }

  let retosSummary: ChallengesProjectSummary;
  if (retosRes.status === 'fulfilled') {
    const res = retosRes.value;
    if (res.status === 'ready' && res.snapshot) {
      const snapshot = res.snapshot;
      const items: ChallengeProjectItem[] = [
        {
          id: 'reto-1',
          status: snapshot.challenges['reto-1']?.status ?? 'pending',
          updatedAt: snapshot.challenges['reto-1']?.updatedAt ?? null,
        },
        {
          id: 'reto-2',
          status: snapshot.challenges['reto-2']?.status ?? 'pending',
          updatedAt: snapshot.challenges['reto-2']?.updatedAt ?? null,
        },
        {
          id: 'reto-3',
          status: snapshot.challenges['reto-3']?.status ?? 'pending',
          updatedAt: snapshot.challenges['reto-3']?.updatedAt ?? null,
        },
      ];
      const completedCount = items.filter((i) => i.status === 'completed').length;
      retosSummary = {
        status: 'valid',
        completedCount,
        totalCount: 3,
        challenges: items,
        updatedAt: snapshot.updatedAt,
      };
    } else if (res.status === 'empty') {
      retosSummary = {
        status: 'empty',
        completedCount: 0,
        totalCount: 3,
        challenges: [
          { id: 'reto-1', status: 'pending', updatedAt: null },
          { id: 'reto-2', status: 'pending', updatedAt: null },
          { id: 'reto-3', status: 'pending', updatedAt: null },
        ],
        updatedAt: null,
      };
    } else {
      retosSummary = createRetosError();
    }
  } else {
    retosSummary = createRetosError();
  }

  let readErrorsCount = 0;
  if (ideaSummary.status === 'error') readErrorsCount++;
  if (financeSummary.status === 'error') readErrorsCount++;
  if (quizSummary.status === 'error') readErrorsCount++;
  if (retosSummary.status === 'error') readErrorsCount++;

  return {
    ideaSummary,
    financeSummary,
    quizSummary,
    retosSummary,
    readErrorsCount,
  };
}
