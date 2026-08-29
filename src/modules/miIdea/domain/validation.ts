import {
    BusinessIdeaErrors,
    BusinessIdeaForm,
    EMPTY_IDEA_FORM,
    IdeaFieldName,
} from './types';

const FIELD_RULES: Record<
  IdeaFieldName,
  { minLength: number; maxLength?: number; message: string; label: string }
> = {
  nombreNegocio: {
    minLength: 3,
    maxLength: 50,
    message: 'El nombre debe tener entre 3 y 50 caracteres.',
    label: 'nombre',
  },
  problema: {
    minLength: 10,
    message: 'Describe el problema con al menos 10 caracteres.',
    label: 'problema',
  },
  solucion: {
    minLength: 10,
    message: 'Describe la solución con al menos 10 caracteres.',
    label: 'solución',
  },
  publicoObjetivo: {
    minLength: 3,
    message: 'Indica un público objetivo de al menos 3 caracteres.',
    label: 'público objetivo',
  },
  recursosNecesarios: {
    minLength: 5,
    message: 'Describe los recursos con al menos 5 caracteres.',
    label: 'recursos',
  },
};

export function normalizeIdeaForm(form: Partial<BusinessIdeaForm>): BusinessIdeaForm {
  return {
    nombreNegocio: (form.nombreNegocio ?? '').trim(),
    problema: (form.problema ?? '').trim(),
    solucion: (form.solucion ?? '').trim(),
    publicoObjetivo: (form.publicoObjetivo ?? '').trim(),
    recursosNecesarios: (form.recursosNecesarios ?? '').trim(),
  };
}

export function validateIdeaForm(form: Partial<BusinessIdeaForm>): BusinessIdeaErrors {
  const normalized = normalizeIdeaForm(form);
  const errors: BusinessIdeaErrors = {};

  (Object.keys(FIELD_RULES) as IdeaFieldName[]).forEach((field) => {
    const value = normalized[field];
    const rule = FIELD_RULES[field];

    if (!value || value.length < rule.minLength || (rule.maxLength && value.length > rule.maxLength)) {
      errors[field] = rule.message;
    }
  });

  return errors;
}

export function getFirstInvalidField(errors: BusinessIdeaErrors): IdeaFieldName | null {
  const order: IdeaFieldName[] = [
    'nombreNegocio',
    'problema',
    'solucion',
    'publicoObjetivo',
    'recursosNecesarios',
  ];

  return order.find((field) => Boolean(errors[field])) ?? null;
}

export function isBusinessIdeaSnapshot(value: unknown): value is BusinessIdeaForm {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.nombreNegocio === 'string' &&
    typeof candidate.problema === 'string' &&
    typeof candidate.solucion === 'string' &&
    typeof candidate.publicoObjetivo === 'string' &&
    typeof candidate.recursosNecesarios === 'string' &&
    typeof candidate.schemaVersion === 'number' &&
    candidate.schemaVersion === 1
  );
}

export const EMPTY_FORM = EMPTY_IDEA_FORM;
