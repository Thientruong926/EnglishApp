// src/types/index.ts
export interface Lesson {
  lesson_id: number;
  title: string;
  topic: string;
  content: string;
  image: string;
}

export interface Vocabulary {
  id: number;
  word: string;
  pronunciation: string;
  meaning: string;
  example: string;
}

export interface Exercise {
  exercise_id: number;
  lesson_id: number;
  question: string;
  type: 'multiple-choice' | 'fill-in' | 'listening' | 'match';
  options?: string[];
  correct_answer: string | number;
}
