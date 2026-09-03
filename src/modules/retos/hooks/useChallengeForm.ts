import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import {
  loadCalculatorSnapshot,
  formatMoney,
} from '@/src/modules/calculadora';

import {
  CHALLENGES,
  isChallengeUnlocked,
  validateChallengeAnswers,
  type ChallengeAnswers,
  type ChallengeId,
  type ChallengeStatus,
  type FieldErrors,
} from '../domain';
import {
  loadChallengesSnapshot,
  updateChallengeState,
} from '../storage/retosRepository';

export function useChallengeForm(challengeId: ChallengeId) {
  const definition = CHALLENGES[challengeId];

  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [status, setStatus] = useState<ChallengeStatus>('pending');
  const [answers, setAnswers] = useState<ChallengeAnswers>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [firstErrorField, setFirstErrorField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const read = await loadChallengesSnapshot();
    const snapshot = read.snapshot;

    const isUnlockedVal = isChallengeUnlocked(challengeId, snapshot);
    setUnlocked(isUnlockedVal);

    if (snapshot && snapshot.challenges[challengeId]) {
      const item = snapshot.challenges[challengeId];
      setStatus(item.status);
      setAnswers(item.answers || {});
    } else {
      setStatus('pending');
      setAnswers({});
    }

    setLoading(false);
  }, [challengeId]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateField = useCallback((fieldId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    setErrors((prev) => {
      if (!prev[fieldId]) return prev;
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  }, []);

  const saveDraft = useCallback(async () => {
    setSaving(true);
    setSaveError(false);

    const validation = validateChallengeAnswers(challengeId, answers);
    let newStatus: ChallengeStatus = 'started';

    if (status === 'completed') {
      newStatus = validation.ok ? 'completed' : 'started';
    }

    const res = await updateChallengeState(challengeId, newStatus, answers);
    setSaving(false);

    if (res.ok) {
      setStatus(newStatus);
      return true;
    } else {
      setSaveError(true);
      return false;
    }
  }, [answers, challengeId, status]);

  const complete = useCallback(async () => {
    setSaving(true);
    setSaveError(false);

    const validation = validateChallengeAnswers(challengeId, answers);

    if (!validation.ok) {
      setSaving(false);
      setErrors(validation.errors);
      setFirstErrorField(validation.firstField || null);
      return false;
    }

    const res = await updateChallengeState(challengeId, 'completed', answers);
    setSaving(false);

    if (res.ok) {
      setStatus('completed');
      setErrors({});
      setFirstErrorField(null);
      return true;
    } else {
      setSaveError(true);
      return false;
    }
  }, [answers, challengeId]);

  const copyPriceFromCalculator = useCallback(async () => {
    try {
      const read = await loadCalculatorSnapshot();
      if (read.status !== 'ready' || !read.snapshot) {
        Alert.alert(
          'Calculadora sin datos',
          'No se encontró un cálculo guardado válido en la Calculadora financiera.',
        );
        return;
      }

      const suggestedPrice = read.snapshot.results.precioSugerido;
      const formattedPrice = suggestedPrice.toString();
      const displayPrice = formatMoney(suggestedPrice);

      const currentVal = String(answers.precioSugerido || '').trim();

      const doCopy = () => {
        updateField('precioSugerido', formattedPrice);
        Alert.alert(
          'Precio copiado',
          `Se copió el precio sugerido de $${displayPrice} desde la Calculadora.`,
        );
      };

      if (currentVal !== '') {
        Alert.alert(
          'Confirmar reemplazo',
          `Actualmente tienes un valor de "${currentVal}". ¿Deseas reemplazarlo con $${displayPrice} de la Calculadora?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Reemplazar', onPress: doCopy },
          ],
        );
      } else {
        Alert.alert(
          'Copiar precio',
          `¿Deseas copiar el precio sugerido de $${displayPrice} desde la Calculadora?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Copiar', onPress: doCopy },
          ],
        );
      }
    } catch {
      Alert.alert(
        'Error de lectura',
        'No se pudieron leer los datos de la Calculadora. Puedes ingresar el precio manualmente.',
      );
    }
  }, [answers.precioSugerido, updateField]);

  const clearFirstErrorField = useCallback(() => {
    setFirstErrorField(null);
  }, []);

  return {
    definition,
    loading,
    unlocked,
    status,
    answers,
    errors,
    firstErrorField,
    saving,
    saveError,
    updateField,
    saveDraft,
    complete,
    copyPriceFromCalculator,
    clearFirstErrorField,
  };
}
