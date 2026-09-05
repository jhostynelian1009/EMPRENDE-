import { Question } from './types';

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 */
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Returns a new array of questions with their options shuffled.
 * The order of the questions themselves remains exactly the same.
 */
export function shuffleQuizOptions(questions: Question[]): Question[] {
  return questions.map(q => ({
    ...q,
    options: shuffleArray(q.options),
  }));
}

/**
 * Calculates the score by comparing the chosen option IDs against the correct ones.
 * @param questions The question bank
 * @param answers A record mapping questionId to selected optionId
 * @returns A number between 0 and the total amount of questions
 */
export function calculateQuizScore(questions: Question[], answers: Record<string, string>): number {
  let score = 0;
  
  for (const question of questions) {
    const userAnswer = answers[question.id];
    if (userAnswer === question.correctOptionId) {
      score++;
    }
  }
  
  return score;
}
