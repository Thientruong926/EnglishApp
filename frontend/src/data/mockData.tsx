// src/data/mockData.ts
import { Lesson, Vocabulary, Exercise } from '../types';

export const LESSONS: Lesson[] = [
  {
    lesson_id: 1,
    title: "Financial Strategies",
    topic: "Finance",
    content: "Investment strategies are crucial for financial growth...",
    image: "https://img.freepik.com/free-vector/finance-financial-performance-concept-illustration_53876-40450.jpg"
  },
  {
    lesson_id: 2,
    title: "The Power of Habit",
    topic: "Self-help",
    content: "Habits are the compound interest of self-improvement...",
    image: "https://img.freepik.com/free-vector/business-team-brainstorming-discussing-startup-project_74855-6909.jpg"
  },
  // Bạn có thể thêm nhiều bài học khác vào đây
];

// ... (Các mảng VOCABULARY và EXERCISES giữ nguyên như cũ)


export interface MyVocabularyItem {
  user_vocab_id: number;
  word: string;
  meaning: string;
  ex_sentence: string;
  is_learned: boolean;
}

export const MY_VOCABULARY: MyVocabularyItem[] = [
  {
    user_vocab_id: 1,
    word: 'Component',
    meaning: 'Thành phần, bộ phận',
    ex_sentence: 'A React component is a reusable piece of UI.',
    is_learned: false,
  },
  {
    user_vocab_id: 2,
    word: 'State',
    meaning: 'Trạng thái',
    ex_sentence: 'State is used to manage data that changes over time.',
    is_learned: true,
  },
  {
    user_vocab_id: 3,
    word: 'Mock',
    meaning: 'Giả lập',
    ex_sentence: 'We use mock data to develop the UI.',
    is_learned: false,
  },
  {
    user_vocab_id: 4,
    word: 'Router',
    meaning: 'Bộ định tuyến',
    ex_sentence: 'Expo Router helps manage navigation in the app.',
    is_learned: true,
  },
  {
    user_vocab_id: 5,
    word: 'Financial',
    meaning: 'Thuộc về tài chính',
    ex_sentence: 'Investment strategies are crucial for financial growth.',
    is_learned: false,
  }
];