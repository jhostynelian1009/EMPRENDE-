import {
  ChallengesProjectSummary,
  FinanceProjectSummary,
  IdeaProjectSummary,
  ProjectGlobalStatus,
  ProjectNextAction,
  QuizProjectSummary,
} from './types';

const ISO_8601_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;

export function isValidIsoDate(value: unknown): value is string {
  if (typeof value !== 'string' || value.trim() === '') {
    return false;
  }
  if (!ISO_8601_REGEX.test(value)) {
    return false;
  }
  const timestamp = Date.parse(value);
  return !isNaN(timestamp);
}

export function calculateProgress(
  idea: IdeaProjectSummary,
  finance: FinanceProjectSummary,
  quiz: QuizProjectSummary,
  retos: ChallengesProjectSummary
): { rawProgressPercentage: number; progressPercentage: number } {
  const ideaComplete = idea.status === 'valid' ? 1 : 0;
  const calculatorComplete = finance.status === 'valid' ? 1 : 0;
  const quizComplete = quiz.status === 'valid' && quiz.isCompleted ? 1 : 0;
  const completedChallenges =
    retos.status === 'valid'
      ? Math.min(3, Math.max(0, retos.completedCount))
      : 0;

  const rawProgress =
    25 * ideaComplete +
    25 * calculatorComplete +
    25 * quizComplete +
    25 * (completedChallenges / 3);

  const clampedRaw = Math.min(100, Math.max(0, rawProgress));
  const displayProgress = Math.round(clampedRaw);

  return {
    rawProgressPercentage: clampedRaw,
    progressPercentage: displayProgress,
  };
}

export function determineGlobalStatus(
  rawProgressPercentage: number,
  readErrorsCount: number
): ProjectGlobalStatus {
  if (readErrorsCount === 4) {
    return 'total_error';
  }
  if (rawProgressPercentage === 0) {
    return 'empty';
  }
  if (rawProgressPercentage === 100) {
    return 'completed';
  }
  return 'in_progress';
}

export function getLatestIsoDate(dates: (string | null)[]): string | null {
  const validDates = dates.filter((d): d is string => isValidIsoDate(d));
  if (validDates.length === 0) {
    return null;
  }

  validDates.sort((a, b) => Date.parse(b) - Date.parse(a));
  return validDates[0];
}

export function determineNextAction(
  rawProgressPercentage: number,
  globalStatus: ProjectGlobalStatus,
  idea: IdeaProjectSummary,
  finance: FinanceProjectSummary,
  quiz: QuizProjectSummary,
  retos: ChallengesProjectSummary
): ProjectNextAction {
  if (globalStatus === 'total_error') {
    return {
      type: 'create_idea',
      title: 'No pudimos cargar tu avance.',
      message: 'Intenta de nuevo; no eliminaremos tu información.',
      actionText: 'Reintentar',
      route: null,
    };
  }

  if (idea.status !== 'valid') {
    return {
      type: 'create_idea',
      title:
        rawProgressPercentage === 0
          ? 'Tu proyecto todavía no tiene información.'
          : 'Completa tu idea de negocio',
      message:
        rawProgressPercentage === 0
          ? 'Empieza por describir tu idea de negocio.'
          : 'Completa los datos de tu idea.',
      actionText: 'Crear mi idea',
      route: '/(tabs)/mi-idea',
    };
  }

  if (finance.status !== 'valid') {
    return {
      type: 'calculate_finance',
      title: 'Calcula las finanzas de tu proyecto',
      message: 'Ingresa los costos y márgenes en la Calculadora.',
      actionText: 'Calcular finanzas',
      route: '/calculadora',
    };
  }

  if (!quiz.isCompleted) {
    const isStarted = quiz.status === 'valid' && !quiz.isCompleted;
    return {
      type: isStarted ? 'continue_quiz' : 'start_quiz',
      title: isStarted ? 'Continúa tu Quiz' : 'Pon a prueba tus conocimientos',
      message: 'Responde las preguntas para evaluar tu avance.',
      actionText: isStarted ? 'Continuar quiz' : 'Realizar quiz',
      route: '/quiz',
    };
  }

  if (retos.completedCount < 3) {
    return {
      type: 'continue_challenges',
      title: 'Avanza en tus Retos',
      message: 'Completa los retos prácticos pendientes.',
      actionText: 'Continuar retos',
      route: '/(tabs)/retos',
    };
  }

  return {
    type: 'review_project',
    title: '¡Tu proyecto está listo para presentar!',
    message: 'Revisa los datos antes de compartirlo.',
    actionText: 'Revisar proyecto',
    route: null,
  };
}
