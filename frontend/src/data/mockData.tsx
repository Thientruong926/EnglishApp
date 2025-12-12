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