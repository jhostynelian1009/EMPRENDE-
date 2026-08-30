export type BlockStatus = 'empty' | 'valid' | 'error';

export type ChallengeId = 'reto-1' | 'reto-2' | 'reto-3';

export type IdeaSummary = {
  status: BlockStatus;
  nombreNegocio: string | null;
  problema: string | null;
  solucion: string | null;
  publicoObjetivo: string | null;
  recursosNecesarios: string | null;
  updatedAt: string | null;
  errorMessage?: string;
};

export type FinanceSummary = {
  status: BlockStatus;
  inversionInicial: number | null;
  costoTotal: number | null;
  precioSugerido: number | null;
  gananciaOperativa: number | null;
  resultadoInicial: number | null;
  updatedAt: string | null;
  errorMessage?: string;
};

export type QuizSummary = {
  status: BlockStatus;
  isCompleted: boolean;
  score: number | null;
  approved: boolean | null;
  completedAt: string | null;
  updatedAt: string | null;
  errorMessage?: string;
};

export type RetoItemSummary = {
  id: ChallengeId;
  status: 'pending' | 'started' | 'completed';
  updatedAt: string | null;
};

export type RetosSummary = {
  status: BlockStatus;
  completedCount: number;
  totalCount: number;
  challenges: RetoItemSummary[];
  updatedAt: string | null;
  errorMessage?: string;
};

export type NextActionType =
  | 'create_idea'
  | 'calculate_finance'
  | 'start_quiz'
  | 'continue_quiz'
  | 'continue_retos'
  | 'review_project';

export type NextAction = {
  type: NextActionType;
  title: string;
  message: string;
  actionText: string;
  route: string;
};

export type GlobalStatus = 'empty' | 'in_progress' | 'completed' | 'total_error';

export type MiProyectoViewModel = {
  globalStatus: GlobalStatus;
  progressPercentage: number;
  rawProgressPercentage: number;
  lastUpdatedAt: string | null;
  nextAction: NextAction;
  idea: IdeaSummary;
  finance: FinanceSummary;
  quiz: QuizSummary;
  retos: RetosSummary;
};

export type UseMiProyectoResult = {
  isLoading: boolean;
  data: MiProyectoViewModel;
  refresh: () => Promise<void>;
};

export type CalculatorSnapshotInput = {
  inversionInicial: number;
  costosFijos: number;
  costoVariableUnitario: number;
  cantidad: number;
  margenPorcentaje: number;
};

export type CalculatorSnapshotResults = {
  costoVariableTotal: number;
  costoTotal: number;
  costoUnitario: number;
  precioSugerido: number;
  ingresosEstimados: number;
  gananciaOperativa: number;
  resultadoInicial: number;
};

export type CalculatorSnapshot = {
  schemaVersion: 1;
  inputs: CalculatorSnapshotInput;
  results: CalculatorSnapshotResults;
  updatedAt: string;
};

export type ChallengeStatus = 'pending' | 'started' | 'completed';

export type ChallengeDetail = {
  status: ChallengeStatus;
  answers: Record<string, string | number>;
  updatedAt: string | null;
};

export type ChallengesSnapshot = {
  schemaVersion: 1;
  challenges: Record<string, ChallengeDetail>;
  updatedAt: string | null;
};
