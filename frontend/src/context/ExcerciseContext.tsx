export interface Exercise {
  _id: string;
  lesson_id: string;
  question: string;
  type: "multiple_choice" | "true_false" | "fill_blank";
  options?: string[];
  correct_answer: string;
}
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Platform } from "react-native";

const BACKEND_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5001"
    : "http://localhost:5001";

/* =========================
   CONTEXT TYPE
========================= */
interface ExerciseContextType {
  exercises: Exercise[];
  isLoading: boolean;
  fetchExercisesByLesson: (lessonId: string) => Promise<void>;
}

const ExerciseContext = createContext<ExerciseContextType>(
  {} as ExerciseContextType
);

/* =========================
   PROVIDER
========================= */
export const ExerciseProvider = ({ children }: { children: ReactNode }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /* =========================
     FETCH BY LESSON ID
  ========================= */
  const fetchExercisesByLesson = async (lessonId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/exercises/lesson/${lessonId}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Không tải được bài tập");
      }

      setExercises(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ExerciseContext.Provider
      value={{
        exercises,
        isLoading,
        fetchExercisesByLesson,
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
};

/* =========================
   HOOK
========================= */
export const useExercise = () => useContext(ExerciseContext);
