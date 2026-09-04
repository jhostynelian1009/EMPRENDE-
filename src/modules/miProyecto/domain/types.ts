export type ProjectBlockStatus = 'empty' | 'valid' | 'error';

export interface IdeaProjectSummary {
  status: ProjectBlockStatus;
  nombreNegocio: string | null;
  problema: string | null;
  solucion: string | null;
  publicoObjetivo: string | null;
  recursosNecesarios: string | null;
  updatedAt: string | null;
  errorMessage?: string;
}

export interface FinanceProjectSummary {
  status: ProjectBlockStatus;
  inversionInicial: number | null;
  costoTotal: number | null;
  precioSugerido: number | null;
  gananciaOperativa: number | null;
  resultadoInicial: number | null;
  updatedAt: string | null;
  errorMessage?: string;
}

export interface QuizProjectSummary {
  status: ProjectBlockStatus;
  isCompleted: boolean;
  score: number | null;
  approved: boolean | null;
  completedAt: string | null;
  updatedAt: string | null;
  errorMessage?: string;
}

export type ChallengeId = 'reto-1' | 'reto-2' | 'reto-3';

export interface ChallengeProjectItem {
  id: ChallengeId;
  status: 'pending' | 'started' | 'completed';
  updatedAt: string | null;
}

export interface ChallengesProjectSummary {
  status: ProjectBlockStatus;
  completedCount: number;
  totalCount: 3;
  challenges: ChallengeProjectItem[];
  updatedAt: string | null;
  errorMessage?: string;
}

export type ProjectGlobalStatus =
  | 'empty'
  | 'in_progress'
  | 'completed'
  | 'total_error';

export type ProjectNextActionType =
  | 'create_idea'
  | 'calculate_finance'
  | 'start_quiz'
  | 'continue_quiz'
  | 'continue_challenges'
  | 'review_project';

export interface ProjectNextAction {
  type: ProjectNextActionType;
  title: string;
  message: string;
  actionText: string;
  route: string | null;
}

export interface MiProyectoViewModel {
  globalStatus: ProjectGlobalStatus;
  progressPercentage: number;
  rawProgressPercentage: number;
  lastUpdatedAt: string | null;
  nextAction: ProjectNextAction;
  idea: IdeaProjectSummary;
  finance: FinanceProjectSummary;
  quiz: QuizProjectSummary;
  retos: ChallengesProjectSummary;
}

export interface UseMiProyectoResult {
  isLoading: boolean;
  data: MiProyectoViewModel;
  refresh: () => Promise<void>;
}
