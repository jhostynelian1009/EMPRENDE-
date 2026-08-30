export type BusinessIdea = {
  schemaVersion: 1;
  nombreNegocio: string;
  problema: string;
  solucion: string;
  publicoObjetivo: string;
  recursosNecesarios: string;
  updatedAt: string;
};

export type MiIdeaErrors = Partial<
  Record<
    'nombreNegocio' |
    'problema' |
    'solucion' |
    'publicoObjetivo' |
    'recursosNecesarios',
    string
  >
>;
