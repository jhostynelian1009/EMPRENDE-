export type ChallengeId = 'reto-1' | 'reto-2' | 'reto-3';

export type ChallengeStatus = 'pending' | 'started' | 'completed';

export type ChallengeAnswers = Record<string, string | number>;

export type ChallengeProgressItem = {
  status: ChallengeStatus;
  answers: ChallengeAnswers;
  updatedAt: string | null;
};

export type ChallengesSnapshot = {
  schemaVersion: 1;
  challenges: Record<string, ChallengeProgressItem>;
  updatedAt: string | null;
};

export type ChallengeFieldType = 'text-short' | 'text-long' | 'decimal';

export type ChallengeFieldSpec = {
  id: string;
  label: string;
  type: ChallengeFieldType;
  placeholder?: string;
  help?: string;
  minLength?: number;
};

export type ChallengeDefinition = {
  id: ChallengeId;
  title: string;
  subtitle: string;
  proposito: string;
  situacion: string;
  problema: string;
  pasos: string[];
  campos: ChallengeFieldSpec[];
  ejemplo: string;
  logro: string;
};

export type FieldErrors = Record<string, string>;

export type ValidationResult = {
  ok: boolean;
  errors: FieldErrors;
  firstField?: string;
};

export type RetosReadResultStatus =
  | 'ready'
  | 'empty'
  | 'corrupt'
  | 'unknown_schema'
  | 'error';

export type RetosReadResult = {
  status: RetosReadResultStatus;
  snapshot: ChallengesSnapshot | null;
  errorMessage?: string;
};
