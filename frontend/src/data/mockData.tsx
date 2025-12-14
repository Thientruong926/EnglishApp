// src/data/mockData.ts
import { Lesson, Vocabulary, Exercise } from '../types';

export const LESSONS: Lesson[] = [
  {
    lesson_id: 1,
    title: "Financial Strategies",
    topic: "Finance",
    content: `          Investment strategies are crucial for financial growth, regardless of your current income level. Without a clear plan, saving money can feel like a guessing game, but with the right strategy, you can turn your savings into significant wealth over time.

          One of the most fundamental concepts in finance is diversification. This is often summarized by the old adage: "Don't put all your eggs in one basket." By spreading your investments across different asset classes—such as stocks, bonds, real estate, and cash—you can minimize the impact of poor performance in any single area.

          Another powerful tool is the power of compounding. Albert Einstein famously called compound interest the "eighth wonder of the world." It allows your earnings to generate their own earnings. This means that starting early, even with small amounts of money, is often more effective than waiting to invest large sums later in life.

          Furthermore, understanding your risk tolerance is vital. Younger investors might opt for aggressive strategies with higher potential returns, while those nearing retirement usually prefer conservative approaches.

          Finally, a solid financial strategy must include tax planning and an emergency fund. Efficient tax management ensures you keep more of what you earn, while an emergency fund acts as a safety net against unexpected life events.`,
    image: "https://img.freepik.com/free-vector/finance-financial-performance-concept-illustration_53876-40450.jpg"
  },
  {
    lesson_id: 2,
    title: "The Power of Habit",
    topic: "Self-help",
    content: `          Habits are the compound interest of self-improvement. The same way that money multiplies through compound interest, the effects of your habits multiply as you repeat them. They seem to make little difference on any given day, and yet the impact they deliver over the months and years can be enormous.

          It is only when looking back two, five, or perhaps ten years later that the value of good habits and the cost of bad ones becomes strikingly apparent. This concept is often difficult to appreciate in daily life. We often dismiss small changes because they don't seem to matter very much in the moment. If you save a little money now, you're still not a millionaire. If you go to the gym for three days in a row, you're still not in shape.

          However, the most effective way to change your habits is to focus not on what you want to achieve, but on who you want to become. True behavior change is identity change. You might start a habit because of motivation, but the only reason you'll stick with one is that it becomes part of your identity.

          Furthermore, building a habit often follows a simple loop: cue, craving, response, and reward. Understanding these four steps allows you to "hack" your behavior. To build a good habit, make the cue obvious and the reward satisfying. To break a bad one, do the reverse: make it invisible and unattractive.

          In conclusion, success is the product of daily habits—not once-in-a-lifetime transformations.`,
    image: "https://img.freepik.com/free-vector/business-team-brainstorming-discussing-startup-project_74855-6909.jpg"
  },
  // Bạn có thể thêm nhiều bài học khác vào đây
];

// Bài tập theo từng bài học (mock)
export const EXERCISES: Exercise[] = [
  // Lesson 1: Financial Strategies
  {
    exercise_id: 101,
    lesson_id: 1,
    question: 'What is a key purpose of investment strategies?',
    type: 'multiple-choice',
    options: [
      'To reduce daily expenses',
      'To achieve long-term financial growth',
      'To avoid paying taxes',
      'To guarantee instant profits',
    ],
    correct_answer: 1,
  },
  {
    exercise_id: 102,
    lesson_id: 1,
    question: 'Diversification mainly aims to...',
    type: 'multiple-choice',
    options: [
      'Increase fees',
      'Concentrate risk in one asset',
      'Spread risk across assets',
      'Eliminate market fluctuations',
    ],
    correct_answer: 2,
  },
  {
    exercise_id: 103,
    lesson_id: 1,
    question: 'Which asset class is generally considered higher risk?',
    type: 'multiple-choice',
    options: ['Government bonds', 'Savings account', 'Blue-chip stocks', 'Index funds'],
    correct_answer: 2,
  },
  // Lesson 2: The Power of Habit
  {
    exercise_id: 201,
    lesson_id: 2,
    question: 'Habits are described as the ____ of self-improvement.',
    type: 'multiple-choice',
    options: ['foundation', 'compound interest', 'shortcut', 'endpoint'],
    correct_answer: 1,
  },
  {
    exercise_id: 202,
    lesson_id: 2,
    question: 'To build a habit effectively, you should make it...',
    type: 'multiple-choice',
    options: ['hard and complex', 'invisible', 'easy and obvious', 'rarely repeated'],
    correct_answer: 2,
  },
  {
    exercise_id: 203,
    lesson_id: 2,
    question: 'Which cue helps trigger a habit consistently?',
    type: 'multiple-choice',
    options: ['Random timing', 'Clear context', 'No routine', 'Negative mindset'],
    correct_answer: 1,
  },
];

// Từ vựng theo từng bài học (mock)
export const VOCABULARIES: Vocabulary[] = [
  // Lesson 1: Financial Strategies
  {
    vocabulary_id: 1,
    lesson_id: 1,
    word: "diversification",
    meaning: "sự đa dạng hóa",
    ex_sentence: "Diversification reduces risk by spreading investments across different assets."
  },
  {
    vocabulary_id: 2,
    lesson_id: 1,
    word: "compound interest",
    meaning: "lãi suất kép",
    ex_sentence: "Albert Einstein called compound interest the eighth wonder of the world."
  },
  {
    vocabulary_id: 3,
    lesson_id: 1,
    word: "financial strategy",
    meaning: "chiến lược tài chính",
    ex_sentence: "A solid financial strategy includes tax planning and an emergency fund."
  },
  {
    vocabulary_id: 4,
    lesson_id: 1,
    word: "risk tolerance",
    meaning: "khả năng chịu rủi ro",
    ex_sentence: "Understanding your risk tolerance is vital for investment success."
  },
];