import { STORAGE_KEYS } from '@/src/storage';
import { QUESTION_BANK } from './data';
import { QuizSnapshot } from './types';

export const QUIZ_STORAGE_KEY = STORAGE_KEYS.quiz;
export const QUIZ_SCHEMA_VERSION = 1;

const validQuestionsMap = new Map<string, Set<string>>(
  QUESTION_BANK.map((q) => [q.id, new Set(q.options.map((o) => o.id))])
);

function isValidIsoDate(dateString: unknown): boolean {
  if (typeof dateString !== 'string' || dateString.trim() === '') {
    return false;
  }
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function isQuizSnapshot(data: unknown): data is QuizSnapshot {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  if (obj.schemaVersion !== 1) {
    return false;
  }

  if (obj.status !== 'inProgress' && obj.status !== 'completed') {
    return false;
  }

  if (typeof obj.answers !== 'object' || obj.answers === null) {
    return false;
  }

  const answers = obj.answers as Record<string, unknown>;
  for (const [qId, optId] of Object.entries(answers)) {
    const validOpts = validQuestionsMap.get(qId);
    if (!validOpts) {
      return false;
    }
    if (typeof optId !== 'string' || !validOpts.has(optId)) {
      return false;
    }
  }

  if (!isValidIsoDate(obj.updatedAt)) {
    return false;
  }

  if (obj.status === 'inProgress') {
    if (
      obj.score !== null &&
      (typeof obj.score !== 'number' ||
        !Number.isFinite(obj.score) ||
        obj.score < 0 ||
        obj.score > 10)
    ) {
      return false;
    }

    if (obj.approved !== null && typeof obj.approved !== 'boolean') {
      return false;
    }

    if (obj.completedAt !== null && !isValidIsoDate(obj.completedAt)) {
      return false;
    }
  }

  if (obj.status === 'completed') {
    if (
      typeof obj.score !== 'number' ||
      !Number.isFinite(obj.score) ||
      obj.score < 0 ||
      obj.score > 10
    ) {
      return false;
    }

    if (typeof obj.approved !== 'boolean') {
      return false;
    }

    if (!isValidIsoDate(obj.completedAt)) {
      return false;
    }
  }

  return true;
}

export function hasUnknownSchemaVersion(data: unknown): boolean {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  const obj = data as Record<string, unknown>;
  return typeof obj.schemaVersion === 'number' && obj.schemaVersion !== 1;
}
