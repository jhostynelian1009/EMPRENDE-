import {
  calculateProgress,
  determineGlobalStatus,
  determineNextAction,
  getLatestIsoDate,
} from './projectSummary';
import {
  ChallengesProjectSummary,
  FinanceProjectSummary,
  IdeaProjectSummary,
  QuizProjectSummary,
} from './types';

const emptyIdea: IdeaProjectSummary = {
  status: 'empty',
  nombreNegocio: null,
  problema: null,
  solucion: null,
  publicoObjetivo: null,
  recursosNecesarios: null,
  updatedAt: null,
};

const validIdea: IdeaProjectSummary = {
  status: 'valid',
  nombreNegocio: 'Café App',
  problema: 'Sed',
  solucion: 'Café',
  publicoObjetivo: 'Todos',
  recursosNecesarios: 'Grano',
  updatedAt: '2026-09-01T10:00:00.000Z',
};

const errorIdea: IdeaProjectSummary = {
  ...emptyIdea,
  status: 'error',
  errorMessage: 'Error de lectura',
};

const emptyFinance: FinanceProjectSummary = {
  status: 'empty',
  inversionInicial: null,
  costoTotal: null,
  precioSugerido: null,
  gananciaOperativa: null,
  resultadoInicial: null,
  updatedAt: null,
};

const validFinance: FinanceProjectSummary = {
  status: 'valid',
  inversionInicial: 100,
  costoTotal: 50,
  precioSugerido: 10,
  gananciaOperativa: 5,
  resultadoInicial: 1,
  updatedAt: '2026-09-02T12:00:00.000Z',
};

const errorFinance: FinanceProjectSummary = {
  ...emptyFinance,
  status: 'error',
  errorMessage: 'Error de lectura',
};

const emptyQuiz: QuizProjectSummary = {
  status: 'empty',
  isCompleted: false,
  score: null,
  approved: null,
  completedAt: null,
  updatedAt: null,
};

const validQuizCompleted: QuizProjectSummary = {
  status: 'valid',
  isCompleted: true,
  score: 8,
  approved: true,
  completedAt: '2026-09-02T14:00:00.000Z',
  updatedAt: '2026-09-02T14:00:00.000Z',
};

const errorQuiz: QuizProjectSummary = {
  ...emptyQuiz,
  status: 'error',
  errorMessage: 'Error de lectura',
};

const emptyRetos: ChallengesProjectSummary = {
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

const errorRetos: ChallengesProjectSummary = {
  ...emptyRetos,
  status: 'error',
  errorMessage: 'Error de lectura',
};

export function runMiProyectoTests(): void {
  // Case 1: 4 empty modules -> 0%, empty status, next action create_idea
  const p1 = calculateProgress(emptyIdea, emptyFinance, emptyQuiz, emptyRetos);
  const s1 = determineGlobalStatus(p1.rawProgressPercentage, 0);
  const a1 = determineNextAction(
    p1.rawProgressPercentage,
    s1,
    emptyIdea,
    emptyFinance,
    emptyQuiz,
    emptyRetos
  );
  console.assert(p1.progressPercentage === 0, 'Test 1 failed: percentage');
  console.assert(s1 === 'empty', 'Test 1 failed: status');
  console.assert(a1.type === 'create_idea', 'Test 1 failed: action');

  // Case 2: Only Idea valid -> 25%
  const p2 = calculateProgress(validIdea, emptyFinance, emptyQuiz, emptyRetos);
  console.assert(p2.progressPercentage === 25, 'Test 2 failed: 25%');

  // Case 3: Idea + Calc valid -> 50%
  const p3 = calculateProgress(validIdea, validFinance, emptyQuiz, emptyRetos);
  console.assert(p3.progressPercentage === 50, 'Test 3 failed: 50%');

  // Case 4: Idea + Calc + Quiz completed -> 75%
  const p4 = calculateProgress(validIdea, validFinance, validQuizCompleted, emptyRetos);
  console.assert(p4.progressPercentage === 75, 'Test 4 failed: 75%');

  // Case 5: Idea + Calc + Quiz + 1 reto -> 83% visible (83.333...)
  const retos1: ChallengesProjectSummary = {
    ...emptyRetos,
    status: 'valid',
    completedCount: 1,
    updatedAt: '2026-09-03T01:00:00.000Z',
  };
  const p5 = calculateProgress(validIdea, validFinance, validQuizCompleted, retos1);
  console.assert(p5.progressPercentage === 83, 'Test 5 failed: 83%');

  // Case 6: Idea + Calc + Quiz + 2 retos -> 92% visible (91.666...)
  const retos2: ChallengesProjectSummary = {
    ...emptyRetos,
    status: 'valid',
    completedCount: 2,
    updatedAt: '2026-09-03T02:00:00.000Z',
  };
  const p6 = calculateProgress(validIdea, validFinance, validQuizCompleted, retos2);
  console.assert(p6.progressPercentage === 92, 'Test 6 failed: 92%');

  // Case 7: All completed -> 100%
  const retos3: ChallengesProjectSummary = {
    ...emptyRetos,
    status: 'valid',
    completedCount: 3,
    updatedAt: '2026-09-03T03:00:00.000Z',
  };
  const p7 = calculateProgress(validIdea, validFinance, validQuizCompleted, retos3);
  console.assert(p7.progressPercentage === 100, 'Test 7 failed: 100%');

  // Case 8: 1 corrupt module, others valid
  const p8 = calculateProgress(errorIdea, validFinance, validQuizCompleted, retos3);
  const s8 = determineGlobalStatus(p8.rawProgressPercentage, 1);
  console.assert(s8 === 'in_progress', 'Test 8 failed: in_progress with error');

  // Case 9: 4 error modules -> total_error
  const s9 = determineGlobalStatus(0, 4);
  const a9 = determineNextAction(0, s9, errorIdea, errorFinance, errorQuiz, errorRetos);
  console.assert(s9 === 'total_error', 'Test 9 failed: total_error');
  console.assert(a9.actionText === 'Reintentar', 'Test 9 failed: Reintentar action');

  // Case 10: Latest ISO date selection
  const latestDate = getLatestIsoDate([
    '2026-09-01T10:00:00.000Z',
    '2026-09-03T02:00:00.000Z',
    '2026-09-02T12:00:00.000Z',
    null,
    'invalid-date',
  ]);
  console.assert(
    latestDate === '2026-09-03T02:00:00.000Z',
    'Test 10 failed: date selection'
  );
}
