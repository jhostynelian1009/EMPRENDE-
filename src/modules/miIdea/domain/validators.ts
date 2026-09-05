import { MiIdeaErrors } from './BusinessIdea';

export function normalizeText(text: string): string {
  return text.trim();
}

export function validateMiIdea(
  nombreNegocio: string,
  problema: string,
  solucion: string,
  publicoObjetivo: string,
  recursosNecesarios: string
): MiIdeaErrors {
  const errors: MiIdeaErrors = {};

  const nombreNorm = normalizeText(nombreNegocio);
  if (nombreNorm.length < 3 || nombreNorm.length > 50) {
    errors.nombreNegocio = 'El nombre debe tener entre 3 y 50 caracteres.';
  }

  const problemaNorm = normalizeText(problema);
  if (problemaNorm.length < 10) {
    errors.problema = 'Describe el problema con al menos 10 caracteres.';
  }

  const solucionNorm = normalizeText(solucion);
  if (solucionNorm.length < 10) {
    errors.solucion = 'Describe la solución con al menos 10 caracteres.';
  }

  const publicoNorm = normalizeText(publicoObjetivo);
  if (publicoNorm.length < 3) {
    errors.publicoObjetivo = 'Indica un público objetivo de al menos 3 caracteres.';
  }

  const recursosNorm = normalizeText(recursosNecesarios);
  if (recursosNorm.length < 5) {
    errors.recursosNecesarios = 'Describe los recursos con al menos 5 caracteres.';
  }

  return errors;
}

export function validateSingleField(field: keyof MiIdeaErrors, value: string): string | undefined {
  const norm = normalizeText(value);
  switch (field) {
    case 'nombreNegocio':
      return (norm.length < 3 || norm.length > 50) ? 'El nombre debe tener entre 3 y 50 caracteres.' : undefined;
    case 'problema':
      return (norm.length < 10) ? 'Describe el problema con al menos 10 caracteres.' : undefined;
    case 'solucion':
      return (norm.length < 10) ? 'Describe la solución con al menos 10 caracteres.' : undefined;
    case 'publicoObjetivo':
      return (norm.length < 3) ? 'Indica un público objetivo de al menos 3 caracteres.' : undefined;
    case 'recursosNecesarios':
      return (norm.length < 5) ? 'Describe los recursos con al menos 5 caracteres.' : undefined;
    default:
      return undefined;
  }
}
