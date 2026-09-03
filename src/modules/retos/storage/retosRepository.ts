import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  createInitialSnapshot,
  hasUnknownSchemaVersion,
  isChallengesSnapshot,
  type ChallengeAnswers,
  type ChallengeId,
  type ChallengeStatus,
  type ChallengesSnapshot,
  type RetosReadResult,
} from '../domain';

export const RETOS_STORAGE_KEY = '@emprende_plus:retos';

export async function loadChallengesSnapshot(): Promise<RetosReadResult> {
  try {
    const raw = await AsyncStorage.getItem(RETOS_STORAGE_KEY);
    if (raw === null || raw.trim() === '') {
      return { status: 'empty', snapshot: createInitialSnapshot() };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { status: 'corrupt', snapshot: null };
    }

    if (hasUnknownSchemaVersion(parsed)) {
      return { status: 'unknown_schema', snapshot: null };
    }

    if (isChallengesSnapshot(parsed)) {
      return { status: 'ready', snapshot: parsed };
    }

    return { status: 'corrupt', snapshot: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error de lectura en almacenamiento.';
    return { status: 'error', snapshot: null, errorMessage };
  }
}

export async function saveChallengesSnapshot(
  snapshot: ChallengesSnapshot,
): Promise<boolean> {
  try {
    const jsonStr = JSON.stringify(snapshot);
    await AsyncStorage.setItem(RETOS_STORAGE_KEY, jsonStr);
    return true;
  } catch {
    return false;
  }
}

export async function updateChallengeState(
  challengeId: ChallengeId,
  status: ChallengeStatus,
  answers: ChallengeAnswers,
): Promise<{ ok: boolean; snapshot: ChallengesSnapshot }> {
  const read = await loadChallengesSnapshot();
  const baseSnapshot =
    read.status === 'ready' && read.snapshot
      ? read.snapshot
      : createInitialSnapshot();

  const nowIso = new Date().toISOString();

  const updatedSnapshot: ChallengesSnapshot = {
    ...baseSnapshot,
    schemaVersion: 1,
    challenges: {
      ...baseSnapshot.challenges,
      [challengeId]: {
        status,
        answers,
        updatedAt: nowIso,
      },
    },
    updatedAt: nowIso,
  };

  const saved = await saveChallengesSnapshot(updatedSnapshot);
  return { ok: saved, snapshot: updatedSnapshot };
}

export async function clearChallengesSnapshot(): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(RETOS_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
