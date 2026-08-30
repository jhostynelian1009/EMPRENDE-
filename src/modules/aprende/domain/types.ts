export type LessonId =
  | 'emprendimiento'
  | 'idea-de-negocio'
  | 'innovacion'
  | 'mercado'
  | 'modelo-de-negocio'
  | 'marketing-digital'
  | 'costos-y-precios';

export type Lesson = {
  id: LessonId;
  order: number;
  title: string;
  objective: string;
  explanation: string;
  example: string;
  keyIdea: string;
  reviewQuestion: string;
  expectedResponse: string;
};

export type AprendeProgress = {
  schemaVersion: 1;
  completedLessonIds: LessonId[];
  lastLessonId: LessonId | null;
  updatedAt: string | null;
};
