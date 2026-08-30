import {
  CalculatorSnapshot,
  ChallengesSnapshot,
  FinanceSummary,
  GlobalStatus,
  IdeaSummary,
  NextAction,
  QuizSummary,
  RetosSummary,
} from './types';

const ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;

export function isValidIsoDate(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }
  if (!ISO_8601_REGEX.test(value)) {
    return false;
  }
  const timestamp = Date.parse(value);
  return !isNaN(timestamp);
}

export function isCalculatorSnapshot(value: unknown): value is CalculatorSnapshot {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  if (candidate.schemaVersion !== 1 || !isValidIsoDate(candidate.updatedAt)) {
    return false;
  }

  if (!candidate.inputs || typeof candidate.inputs !== 'object') {
    return false;
  }
  const inputs = candidate.inputs as Record<string, unknown>;
  const validInputs =
    typeof inputs.inversionInicial === 'number' &&
    typeof inputs.costosFijos === 'number' &&
    typeof inputs.costoVariableUnitario === 'number' &&
    typeof inputs.cantidad === 'number' &&
    typeof inputs.margenPorcentaje === 'number';

  if (!validInputs) {
    return false;
  }

  if (!candidate.results || typeof candidate.results !== 'object') {
    return false;
  }
  const results = candidate.results as Record<string, unknown>;
  const validResults =
    typeof results.costoVariableTotal === 'number' &&
    typeof results.costoTotal === 'number' &&
    typeof results.costoUnitario === 'number' &&
    typeof results.precioSugerido === 'number' &&
    typeof results.ingresosEstimados === 'number' &&
    typeof results.gananciaOperativa === 'number' &&
    typeof results.resultadoInicial === 'number';

  return validResults;
}

export function isQuizSnapshot(value: unknown): boolean {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  if (candidate.schemaVersion !== 1) {
    return false;
  }

  if (candidate.status !== 'inProgress' && candidate.status !== 'completed') {
    return false;
  }

  if (!candidate.answers || typeof candidate.answers !== 'object') {
    return false;
  }

  if (typeof candidate.updatedAt !== 'string' || !isValidIsoDate(candidate.updatedAt)) {
    return false;
  }

  if (candidate.completedAt !== null && !isValidIsoDate(candidate.completedAt)) {
    return false;
  }

  if (candidate.score !== null && typeof candidate.score !== 'number') {
    return false;
  }

  if (candidate.approved !== null && typeof candidate.approved !== 'boolean') {
    return false;
  }

  return true;
}

export function isChallengesSnapshot(value: unknown): value is ChallengesSnapshot {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  if (candidate.schemaVersion !== 1) {
    return false;
  }

  if (candidate.updatedAt !== null && !isValidIsoDate(candidate.updatedAt)) {
    return false;
  }

  if (!candidate.challenges || typeof candidate.challenges !== 'object') {
    return false;
  }

  const challenges = candidate.challenges as Record<string, unknown>;
  for (const challengeKey of Object.keys(challenges)) {
    const item = challenges[challengeKey];
    if (!item || typeof item !== 'object') {
      return false;
    }
    const itemObj = item as Record<string, unknown>;
    if (
      itemObj.status !== 'pending' &&
      itemObj.status !== 'started' &&
      itemObj.status !== 'completed'
    ) {
      return false;
    }
    if (itemObj.updatedAt !== null && !isValidIsoDate(itemObj.updatedAt)) {
      return false;
    }
  }

  return true;
}

export function calculateProgress(
  idea: IdeaSummary,
  finance: FinanceSummary,
  quiz: QuizSummary,
  retos: RetosSummary
): { rawProgress: number; displayProgress: number } {
  const ideaCompleta = idea.status === 'valid' ? 1 : 0;
  const calculadoraCompleta = finance.status === 'valid' ? 1 : 0;
  const quizCompletado = quiz.status === 'valid' && quiz.isCompleted ? 1 : 0;
  const retosCompletados = retos.status === 'valid' ? Math.min(3, Math.max(0, retos.completedCount)) : 0;

  const rawProgress =
    25 * ideaCompleta +
    25 * calculadoraCompleta +
    25 * quizCompletado +
    25 * (retosCompletados / 3);

  const clampedRaw = Math.min(100, Math.max(0, rawProgress));
  const displayProgress = Math.round(clampedRaw);

  return { rawProgress: clampedRaw, displayProgress };
}

export function determineGlobalStatus(
  rawProgress: number,
  readErrorsCount: number
): GlobalStatus {
  if (readErrorsCount === 4) {
    return 'total_error';
  }
  if (rawProgress === 0) {
    return 'empty';
  }
  if (rawProgress === 100) {
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
  rawProgress: number,
  globalStatus: GlobalStatus,
  idea: IdeaSummary,
  finance: FinanceSummary,
  quiz: QuizSummary,
  retos: RetosSummary
): NextAction {
  if (globalStatus === 'total_error') {
    return {
      type: 'create_idea',
      title: 'No pudimos cargar tu avance.',
      message: 'Intenta de nuevo; no eliminaremos tu información.',
      actionText: 'Reintentar',
      route: '/(tabs)/proyecto',
    };
  }

  if (idea.status !== 'valid') {
    return {
      type: 'create_idea',
      title: rawProgress === 0 ? 'Tu proyecto todavía no tiene información.' : 'Completa tu idea de negocio',
      message: rawProgress === 0 ? 'Empieza por describir tu idea de negocio.' : 'Completa los datos de tu idea.',
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
      type: 'continue_retos',
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
    route: '/(tabs)/proyecto',
  };
}
