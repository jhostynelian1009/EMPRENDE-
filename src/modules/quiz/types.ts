export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  statement: string;
  options: Option[];
  correctOptionId: string;
  feedback: string;
}

export interface QuizState {
  status: 'inProgress' | 'completed';
  answers: Record<string, string>; // questionId -> optionId
  score: number | null;
  approved: boolean | null;
  completedAt: string | null;
}
