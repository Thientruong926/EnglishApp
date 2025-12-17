

export interface Exercise {
  _id: string;
  lesson_id: string;
  question: string;
  type: "multiple-choice" | "fill-in";
  options?: string[];
  correct_answer: string;
}

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { Platform, Alert } from "react-native";

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
  addExercise: (
    lessonId: string,
    payload: Omit<Exercise, "_id" | "lesson_id">
  ) => Promise<Exercise | null>;
  updateExercise: (
    id: string,
    payload: Partial<Exercise>
  ) => Promise<boolean>;
  deleteExercise: (id: string) => Promise<boolean>;
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
     FETCH BY LESSON
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
      Alert.alert("Lỗi", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     ADD
  ========================= */
  const addExercise = async (
    lessonId: string,
    payload: Omit<Exercise, "_id" | "lesson_id">
  ) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/exercises`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson_id: lessonId,
          ...payload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Thêm bài tập thất bại");
      }

      // Backend trả về { message, exercise }
      const exercise = data.exercise || data;
      setExercises(prev => [...prev, exercise]);
      return exercise;
    } catch (err: any) {
      Alert.alert("Lỗi", err.message);
      return null;
    }
  };

  /* =========================
     UPDATE
  ========================= */
  const updateExercise = async (
    id: string,
    payload: Partial<Exercise>
  ) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/exercises/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Cập nhật thất bại");
      }

      setExercises(prev =>
        prev.map(e => (e._id === id ? data.exercise : e))
      );
      return true;
    } catch (err: any) {
      Alert.alert("Lỗi", err.message);
      return false;
    }
  };

  /* =========================
     DELETE
  ========================= */
  const deleteExercise = async (id: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/exercises/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Xóa bài tập thất bại");
      }

      setExercises(prev => prev.filter(e => e._id !== id));
      return true;
    } catch (err: any) {
      Alert.alert("Lỗi", err.message);
      return false;
    }
  };

  return (
    <ExerciseContext.Provider
      value={{
        exercises,
        isLoading,
        fetchExercisesByLesson,
        addExercise,
        updateExercise,
        deleteExercise,
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
