export const IDEA_STORAGE_KEY = '@emprende_plus:idea';
export const IDEA_SCHEMA_VERSION = 1;

export type IdeaFieldName =
  | 'nombreNegocio'
  | 'problema'
  | 'solucion'
  | 'publicoObjetivo'
  | 'recursosNecesarios';

export type BusinessIdeaForm = Record<IdeaFieldName, string>;

export type BusinessIdeaSnapshot = BusinessIdeaForm & {
  schemaVersion: typeof IDEA_SCHEMA_VERSION;
  updatedAt: string;
};

export type BusinessIdeaErrors = Partial<Record<IdeaFieldName, string>>;

export const EMPTY_IDEA_FORM: BusinessIdeaForm = {
  nombreNegocio: '',
  problema: '',
  solucion: '',
  publicoObjetivo: '',
  recursosNecesarios: '',
};
