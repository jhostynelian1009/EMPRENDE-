import { useCallback, useEffect, useState } from 'react';

import {
  createInitialSnapshot,
  getRetosProgress,
  isChallengeUnlocked,
  type ChallengeId,
  type ChallengesSnapshot,
} from '../domain';
import { loadChallengesSnapshot } from '../storage/retosRepository';

export type RetosNotice = 'unavailable' | 'corrupt' | 'unknown_schema' | 'error' | null;

export type UseRetosState = {
  phase: 'loading' | 'ready';
  snapshot: ChallengesSnapshot;
  notice: RetosNotice;
};

export function useRetos() {
  const [state, setState] = useState<UseRetosState>({
    phase: 'loading',
    snapshot: createInitialSnapshot(),
    notice: null,
  });

  const load = useCallback(async () => {
    setState((current) => ({ ...current, phase: 'loading' }));
    const result = await loadChallengesSnapshot();

    if (result.status === 'ready' && result.snapshot) {
      setState({
        phase: 'ready',
        snapshot: result.snapshot,
        notice: null,
      });
      return;
    }

    if (result.status === 'empty') {
      const initial = createInitialSnapshot();
      setState({
        phase: 'ready',
        snapshot: initial,
        notice: null,
      });
      return;
    }

    const fallbackSnapshot = createInitialSnapshot();

    if (result.status === 'unknown_schema') {
      setState({
        phase: 'ready',
        snapshot: fallbackSnapshot,
        notice: 'unknown_schema',
      });
      return;
    }

    if (result.status === 'corrupt') {
      setState({
        phase: 'ready',
        snapshot: fallbackSnapshot,
        notice: 'corrupt',
      });
      return;
    }

    setState({
      phase: 'ready',
      snapshot: fallbackSnapshot,
      notice: 'error',
    });
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const dismissNotice = useCallback(() => {
    setState((current) => ({ ...current, notice: null }));
  }, []);

  const isUnlocked = useCallback(
    (challengeId: ChallengeId): boolean => {
      return isChallengeUnlocked(challengeId, state.snapshot);
    },
    [state.snapshot],
  );

  const progress = getRetosProgress(state.snapshot);

  return {
    ...state,
    progress,
    load,
    dismissNotice,
    isUnlocked,
  };
}
