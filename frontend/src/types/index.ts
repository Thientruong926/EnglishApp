// src/types/index.ts
export interface Lesson {
  lesson_id: number;
  title: string;
  topic: string;
  content: string;
  image: string;
}

export interface Vocabulary {
  vocabulary_id: number;
  lesson_id: number;
  word: string;
  meaning: string;
  ex_sentence: string;
}

export interface Exercise {
  exercise_id: number;
  lesson_id: number;
  question: string;
  type: 'multiple-choice' | 'fill-in' | 'listening' | 'match';
  options?: string[];
  correct_answer: string | number;
}
