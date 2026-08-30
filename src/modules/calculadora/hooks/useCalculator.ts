import { useCallback, useEffect, useState } from 'react';

import {
  calculateResults,
  createSnapshot,
  emptyFormValues,
  formValuesFromInputs,
  validateCalculatorForm,
  type CalculatorField,
  type CalculatorFormValues,
  type CalculatorSnapshot,
  type FieldErrors,
} from '../domain';
import {
  clearCalculatorSnapshot,
  loadCalculatorSnapshot,
  saveCalculatorSnapshot,
} from '../storage/calculatorRepository';

export type CalculatorPhase = 'loading' | 'form' | 'result';
export type CalculatorNotice = 'unavailable' | 'unreadable' | null;

type CalculatorState = {
  phase: CalculatorPhase;
  values: CalculatorFormValues;
  errors: FieldErrors;
  firstErrorField: CalculatorField | null;
  snapshot: CalculatorSnapshot | null;
  persisted: boolean;
  saveError: boolean;
  notice: CalculatorNotice;
  saving: boolean;
};

const initialState: CalculatorState = {
  phase: 'loading',
  values: emptyFormValues(),
  errors: {},
  firstErrorField: null,
  snapshot: null,
  persisted: false,
  saveError: false,
  notice: null,
  saving: false,
};

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>(initialState);

  const load = useCallback(async () => {
    setState((current) => ({ ...current, phase: 'loading' }));
    const result = await loadCalculatorSnapshot();

    if (result.status === 'ready') {
      setState({
        ...initialState,
        phase: 'result',
        values: formValuesFromInputs(result.snapshot.inputs),
        snapshot: result.snapshot,
        persisted: true,
      });
      return;
    }

    setState({
      ...initialState,
      phase: 'form',
      notice: result.status === 'empty' ? null : result.status,
    });
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const updateField = useCallback((field: CalculatorField, value: string) => {
    setState((current) => ({
      ...current,
      values: { ...current.values, [field]: value },
      errors: { ...current.errors, [field]: undefined },
      firstErrorField: null,
    }));
  }, []);

  const persistSnapshot = useCallback(async (snapshot: CalculatorSnapshot) => {
    setState((current) => ({ ...current, saving: true, saveError: false }));
    try {
      await saveCalculatorSnapshot(snapshot);
      setState((current) => ({
        ...current,
        snapshot,
        persisted: true,
        saveError: false,
        saving: false,
        phase: 'result',
        errors: {},
        firstErrorField: null,
      }));
    } catch {
      setState((current) => ({
        ...current,
        snapshot,
        persisted: false,
        saveError: true,
        saving: false,
        phase: 'result',
        errors: {},
        firstErrorField: null,
      }));
    }
  }, []);

  const calculate = useCallback(() => {
    const validation = validateCalculatorForm(state.values);
    if (!validation.ok) {
      setState((current) => ({
        ...current,
        phase: 'form',
        errors: validation.errors,
        firstErrorField: validation.firstField,
      }));
      return;
    }

    const results = calculateResults(validation.inputs);
    const snapshot = createSnapshot(validation.inputs, results);
    void persistSnapshot(snapshot);
  }, [persistSnapshot, state.values]);

  const retrySave = useCallback(() => {
    if (!state.snapshot) {
      return;
    }
    void persistSnapshot(state.snapshot);
  }, [persistSnapshot, state.snapshot]);

  const modify = useCallback(() => {
    setState((current) => ({
      ...current,
      phase: 'form',
      errors: {},
      firstErrorField: null,
      values: current.snapshot
        ? formValuesFromInputs(current.snapshot.inputs)
        : current.values,
    }));
  }, []);

  const applyClear = useCallback(() => {
    setState({
      ...initialState,
      phase: 'form',
    });
  }, []);

  const clearLocal = useCallback(() => {
    applyClear();
  }, [applyClear]);

  const clearPersisted = useCallback(async () => {
    await clearCalculatorSnapshot();
    applyClear();
  }, [applyClear]);

  const dismissNotice = useCallback(() => {
    setState((current) => ({ ...current, notice: null }));
  }, []);

  const clearFirstErrorField = useCallback(() => {
    setState((current) => ({ ...current, firstErrorField: null }));
  }, []);

  return {
    ...state,
    load,
    updateField,
    calculate,
    retrySave,
    modify,
    clearLocal,
    clearPersisted,
    dismissNotice,
    clearFirstErrorField,
  };
}
