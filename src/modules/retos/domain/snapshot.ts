import type {
  ChallengeId,
  ChallengeStatus,
  ChallengesSnapshot,
} from './types';

const VALID_STATUSES: ChallengeStatus[] = ['pending', 'started', 'completed'];

export function createInitialSnapshot(): ChallengesSnapshot {
  return {
    schemaVersion: 1,
    challenges: {
      'reto-1': { status: 'pending', answers: {}, updatedAt: null },
      'reto-2': { status: 'pending', answers: {}, updatedAt: null },
      'reto-3': { status: 'pending', answers: {}, updatedAt: null },
    },
    updatedAt: null,
  };
}

export function isChallengesSnapshot(
  data: unknown,
): data is ChallengesSnapshot {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const candidate = data as Record<string, unknown>;

  if (candidate.schemaVersion !== 1) {
    return false;
  }

  if (typeof candidate.challenges !== 'object' || candidate.challenges === null) {
    return false;
  }

  const challenges = candidate.challenges as Record<string, unknown>;
  const requiredKeys: ChallengeId[] = ['reto-1', 'reto-2', 'reto-3'];

  for (const key of requiredKeys) {
    const item = challenges[key];
    if (typeof item !== 'object' || item === null) {
      return false;
    }

    const challengeObj = item as Record<string, unknown>;
    if (!VALID_STATUSES.includes(challengeObj.status as ChallengeStatus)) {
      return false;
    }

    if (
      typeof challengeObj.answers !== 'object' ||
      challengeObj.answers === null
    ) {
      return false;
    }

    if (
      challengeObj.updatedAt !== null &&
      typeof challengeObj.updatedAt !== 'string'
    ) {
      return false;
    }
  }

  if (
    candidate.updatedAt !== null &&
    typeof candidate.updatedAt !== 'string'
  ) {
    return false;
  }

  return true;
}

export function hasUnknownSchemaVersion(data: unknown): boolean {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  const candidate = data as Record<string, unknown>;
  return (
    typeof candidate.schemaVersion === 'number' && candidate.schemaVersion !== 1
  );
}

export function isChallengeUnlocked(
  challengeId: ChallengeId,
  snapshot: ChallengesSnapshot | null,
): boolean {
  if (challengeId === 'reto-1') {
    return true;
  }
  if (!snapshot) {
    return false;
  }

  if (challengeId === 'reto-2') {
    return snapshot.challenges['reto-1']?.status === 'completed';
  }

  if (challengeId === 'reto-3') {
    return snapshot.challenges['reto-2']?.status === 'completed';
  }

  return false;
}

export function getRetosProgress(snapshot: ChallengesSnapshot | null): {
  completedCount: number;
  total: number;
  percentage: number;
} {
  if (!snapshot) {
    return { completedCount: 0, total: 3, percentage: 0 };
  }

  let completedCount = 0;
  const ids: ChallengeId[] = ['reto-1', 'reto-2', 'reto-3'];

  for (const id of ids) {
    if (snapshot.challenges[id]?.status === 'completed') {
      completedCount += 1;
    }
  }

  const percentage = Math.round((completedCount / 3) * 100);

  return { completedCount, total: 3, percentage };
}
