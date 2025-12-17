// src/context/UserExerciseContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Platform, Alert } from "react-native";
import { useAuth } from "./AuthContext";

// URL backend
const BACKEND_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5001"
    : "http://localhost:5001";

// Kiểu dữ liệu UserExercise
export type UserExercise = {
  _id: string;
  user_id: string;
  exercise_id: string | { _id: string }; // có thể là lessonId string
  attempt: number;
  score: number;
  completed_at: string;
};

// Kiểu context
type UserExerciseContextType = {
  exercises: UserExercise[];
  fetchUserExercises: () => Promise<UserExercise[]>;
  submitExercise: (lessonId: string, score: number) => Promise<void>;
};

// Tạo context
const UserExerciseContext = createContext<UserExerciseContextType | undefined>(undefined);

// Provider
export const UserExerciseProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const user_id = user?.id;

  const [exercises, setExercises] = useState<UserExercise[]>([]);

  /* =========================
     FETCH USER EXERCISES
  ========================= */
  const fetchUserExercises = async (): Promise<UserExercise[]> => {
    if (!user_id) return [];
    try {
      const res = await fetch(`${BACKEND_URL}/api/user-exercises?user_id=${user_id}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Lỗi fetch kết quả bài tập");
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];
      setExercises(arr);
      return arr; // trả về dữ liệu để log
    } catch (err) {
      console.error("Lỗi fetch kết quả bài tập:", err);
      Alert.alert("Lỗi", "Không thể lấy kết quả bài tập");
      return [];
    }
  };

  /* =========================
     SUBMIT EXERCISE (THEO LESSON)
  ========================= */
// Nộp bài tập
const submitExercise = async (exerciseId: string, score: number) => {
  if (!user_id) return;

  try {
    // Lấy attempt mới dựa trên các lần trước của bài tập này
    const lastAttempt = exercises
      .filter(e => {
        if (!e.exercise_id) return false;
        if (typeof e.exercise_id === "string") return e.exercise_id === exerciseId;
        if (typeof e.exercise_id === "object" && "_id" in e.exercise_id) return e.exercise_id._id === exerciseId;
        return false;
      })
      .reduce((max, e) => Math.max(max, e.attempt), 0);

    const nextAttempt = lastAttempt + 1;

    const payload = { user_id, exercise_id: exerciseId, score, attempt: nextAttempt };
    console.log("Submitting payload:", payload);

    const res = await fetch(`${BACKEND_URL}/api/user-exercises`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log("Backend response text:", text);

    if (!res.ok) {
      // Nếu backend trả về message cụ thể, show nó
      let message = "Lỗi nộp bài tập";
      try {
        const json = JSON.parse(text);
        if (json?.message) message = json.message;
      } catch (_) {}
      Alert.alert("Lỗi", message);
      return;
    }

    const data = JSON.parse(text);
    setExercises(prev => [...prev, data.result]);
    Alert.alert("Thành công", "Bài tập đã được nộp");
  } catch (err: any) {
    console.error("Lỗi nộp bài tập:", err);
    Alert.alert("Lỗi", err.message || "Không thể nộp bài tập");
  }
};


  // Auto-fetch khi mount hoặc user_id thay đổi
  useEffect(() => {
    fetchUserExercises();
  }, [user_id]);

  return (
    <UserExerciseContext.Provider
      value={{ exercises, fetchUserExercises, submitExercise }}
    >
      {children}
    </UserExerciseContext.Provider>
  );
};

// Hook tiện lợi
export const useUserExercise = () => {
  const context = useContext(UserExerciseContext);
  if (!context) throw new Error("useUserExercise must be used within UserExerciseProvider");
  return context;
};
