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
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
