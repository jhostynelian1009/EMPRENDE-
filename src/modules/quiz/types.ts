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
  schemaVersion: 1;
  status: 'inProgress' | 'completed';
  answers: Record<string, string>;
  score: number | null;
  approved: boolean | null;
  completedAt: string | null;
  updatedAt: string | null;
}

export interface QuizSnapshot extends Omit<QuizState, 'updatedAt'> {
  updatedAt: string;
}

export type QuizReadResultStatus =
  | 'empty'
  | 'valid'
  | 'corrupt'
  | 'unknown_schema'
  | 'storage_error';

export type QuizReadResult =
  | { status: 'empty'; snapshot: null }
  | { status: 'valid'; snapshot: QuizSnapshot }
  | { status: 'corrupt'; snapshot: null; error: string }
  | { status: 'unknown_schema'; snapshot: null; error: string }
  | { status: 'storage_error'; snapshot: null; error: string };
