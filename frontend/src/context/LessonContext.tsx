import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { useAuth } from "./AuthContext";

/* =========================
   TYPES
========================= */
export interface Lesson {
  _id: string;
  title: string;
  content: string;
  topic?: string;
  image_url?: string;
  created_at?: string;
}

interface LessonContextType {
  lessons: Lesson[];
  isLoading: boolean;
  fetchLessons: () => Promise<void>;
  getLessonById: (id: string) => Promise<Lesson | null>;
  createLesson: (data: Partial<Lesson>) => Promise<boolean>;
  updateLesson: (id: string, data: Partial<Lesson>) => Promise<boolean>;
  deleteLesson: (id: string) => Promise<boolean>;
}

/* =========================
   CONTEXT
========================= */
const LessonContext = createContext<LessonContextType>(
  {} as LessonContextType
);

/* =========================
   PROVIDER
========================= */
export const LessonProvider = ({ children }: { children: React.ReactNode }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth(); // sau này nếu cần role / token

  const BACKEND_URL =
    Platform.OS === "android"
      ? "http://10.0.2.2:5001"
      : "http://localhost:5001";

  /* =========================
     GET ALL LESSONS
  ========================= */
  const fetchLessons = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/lessons`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Không tải được lesson");
      }

      setLessons(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     GET LESSON BY ID
  ========================= */
  const getLessonById = async (id: string): Promise<Lesson | null> => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/lessons/${id}`);
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Không tìm thấy lesson");
        return null;
      }

      return data;
    } catch (err) {
      alert("Lỗi khi lấy lesson");
      return null;
    }
  };

  /* =========================
     CREATE LESSON
  ========================= */
  const createLesson = async (data: Partial<Lesson>): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Tạo lesson thất bại");
        return false;
      }

      setLessons(prev => [...prev, result.lesson]);
      return true;
    } catch (err) {
      alert("Không thể tạo lesson");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     UPDATE LESSON
  ========================= */
  const updateLesson = async (
    id: string,
    data: Partial<Lesson>
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/lessons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Cập nhật thất bại");
        return false;
      }

      setLessons(prev =>
        prev.map(l => (l._id === id ? result.lesson : l))
      );

      return true;
    } catch (err) {
      alert("Lỗi cập nhật lesson");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     DELETE LESSON
  ========================= */
  const deleteLesson = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/lessons/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Xóa lesson thất bại");
        return false;
      }

      setLessons(prev => prev.filter(l => l._id !== id));
      return true;
    } catch (err) {
      alert("Lỗi khi xóa lesson");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     AUTO FETCH
  ========================= */
  useEffect(() => {
    fetchLessons();
  }, []);

  return (
    <LessonContext.Provider
      value={{
        lessons,
        isLoading,
        fetchLessons,
        getLessonById,
        createLesson,
        updateLesson,
        deleteLesson,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
};

/* =========================
   HOOK
========================= */
export const useLesson = () => useContext(LessonContext);
