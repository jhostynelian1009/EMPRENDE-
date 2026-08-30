import { useCallback, useMemo, useState } from 'react';

import {
    BusinessIdeaErrors,
    BusinessIdeaForm,
    BusinessIdeaSnapshot,
    EMPTY_IDEA_FORM,
    IdeaFieldName,
} from '../domain/types';
import { normalizeIdeaForm, validateIdeaForm } from '../domain/validation';
import { readBusinessIdea, saveBusinessIdea } from '../storage/ideaStorage';

export function useMiIdea() {
  const [form, setForm] = useState<BusinessIdeaForm>(EMPTY_IDEA_FORM);
  const [errors, setErrors] = useState<BusinessIdeaErrors>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [readError, setReadError] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadIdea = useCallback(async () => {
    setIsLoading(true);
    setReadError(false);

    try {
      const snapshot = await readBusinessIdea();

      if (snapshot) {
        setForm({
          nombreNegocio: snapshot.nombreNegocio,
          problema: snapshot.problema,
          solucion: snapshot.solucion,
          publicoObjetivo: snapshot.publicoObjetivo,
          recursosNecesarios: snapshot.recursosNecesarios,
        });
        setSavedAt(snapshot.updatedAt);
        setHasChanges(false);
        return;
      }

      setForm(EMPTY_IDEA_FORM);
      setSavedAt(null);
      setHasChanges(false);
    } catch {
      setReadError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateField = useCallback((field: IdeaFieldName, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
    setSaveError(null);
    setHasChanges(true);
  }, []);

  const submit = useCallback(async (): Promise<{ ok: boolean; snapshot?: BusinessIdeaSnapshot; errors?: BusinessIdeaErrors }> => {
    const normalized = normalizeIdeaForm(form);
    const validation = validateIdeaForm(normalized);

    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return { ok: false, errors: validation, snapshot: undefined };
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const snapshot = await saveBusinessIdea(normalized);
      setForm({
        nombreNegocio: snapshot.nombreNegocio,
        problema: snapshot.problema,
        solucion: snapshot.solucion,
        publicoObjetivo: snapshot.publicoObjetivo,
        recursosNecesarios: snapshot.recursosNecesarios,
      });
      setErrors({});
      setSavedAt(snapshot.updatedAt);
      setHasChanges(false);

      return { ok: true, snapshot };
    } catch {
      setSaveError('No pudimos guardar los cambios. Reintenta sin cerrar la pantalla.');
      return { ok: false, errors: validation };
    } finally {
      setIsSaving(false);
    }
  }, [form]);

  const statusText = useMemo(() => {
    if (isLoading) {
      return 'Cargando tu idea...';
    }

    if (Object.values(form).some((value) => value.trim().length > 0)) {
      return 'Actualiza tu idea y guarda los cambios cuando termines.';
    }

    return 'Completa los datos principales de tu idea de negocio.';
  }, [form, isLoading]);

  return {
    form,
    errors,
    isLoading,
    isSaving,
    hasChanges,
    readError,
    saveError,
    savedAt,
    statusText,
    loadIdea,
    updateField,
    submit,
  };
}
