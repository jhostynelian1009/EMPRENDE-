export {
  QUIZ_STORAGE_KEY,
  QUIZ_SCHEMA_VERSION,
  isQuizSnapshot,
  hasUnknownSchemaVersion,
} from './guards';

export type {
  Option,
  Question,
  QuizSnapshot,
  QuizState,
  QuizReadResultStatus,
  QuizReadResult,
} from './types';

export { QUESTION_BANK } from './data';

export { shuffleQuizOptions, calculateQuizScore } from './logic';

export {
  initialQuizState,
  loadQuizSnapshot,
  loadQuizState,
  saveQuizState,
  clearQuizState,
} from './repository';
