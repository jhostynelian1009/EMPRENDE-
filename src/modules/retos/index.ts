export { RETOS_STORAGE_KEY } from './storage/retosRepository';
export const RETOS_SCHEMA_VERSION = 1;

export type {
  ChallengeId,
  ChallengeStatus,
  ChallengeAnswers,
  ChallengeProgressItem,
  ChallengesSnapshot,
  RetosReadResult,
  RetosReadResultStatus,
} from './domain/types';

export {
  isChallengesSnapshot,
  hasUnknownSchemaVersion,
  isChallengeUnlocked,
  getRetosProgress,
} from './domain/snapshot';

export {
  loadChallengesSnapshot,
  saveChallengesSnapshot,
  clearChallengesSnapshot,
} from './storage/retosRepository';

export { useRetos } from './hooks/useRetos';
