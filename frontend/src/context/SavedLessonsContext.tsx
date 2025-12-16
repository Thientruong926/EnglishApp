import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";
import { Lesson } from "./LessonContext";
import { useAuth } from "./AuthContext";

const BACKEND_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5001"
    : "http://localhost:5001";

interface SavedLessonsContextType {
  savedLessons: Lesson[];
  fetchSavedLessons: () => Promise<void>;
  toggleSaveLesson: (lessonId: string) => Promise<void>;
  isLessonSaved: (lessonId: string) => boolean;
}

const SavedLessonsContext = createContext<SavedLessonsContextType>(
  {} as SavedLessonsContextType
);

export const SavedLessonsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [savedLessons, setSavedLessons] = useState<Lesson[]>([]);

  /* =========================
     FETCH SAVED LESSONS
  ========================= */
  const fetchSavedLessons = async () => {
    if (!user?.id) return;

    const res = await fetch(
      `${BACKEND_URL}/api/saved-lessons?user_id=${user.id}`
    );

    const data = await res.json();

    // backend: [{ lesson_id: {...lesson} }]
    const lessons = data.map((item: any) => item.lesson_id);

    setSavedLessons(lessons);
  };

  /* =========================
     TOGGLE SAVE
  ========================= */
  const toggleSaveLesson = async (lessonId: string) => {
    if (!user?.id) return;

    const isSaved = savedLessons.some(l => l._id === lessonId);

    if (isSaved) {
      await fetch(
        `${BACKEND_URL}/api/saved-lessons/${lessonId}?user_id=${user.id}`,
        { method: "DELETE" }
      );
    } else {
      await fetch(`${BACKEND_URL}/api/saved-lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          lesson_id: lessonId,
        }),
      });
    }

    fetchSavedLessons();
  };

  /* =========================
     CHECK SAVED
  ========================= */
  const isLessonSaved = (lessonId: string) =>
    savedLessons.some(l => l._id === lessonId);

  useEffect(() => {
    fetchSavedLessons();
  }, [user]);

  return (
    <SavedLessonsContext.Provider
      value={{
        savedLessons,
        fetchSavedLessons,
        toggleSaveLesson,
        isLessonSaved,
      }}
    >
      {children}
    </SavedLessonsContext.Provider>
  );
};

export const useSavedLessons = () => useContext(SavedLessonsContext);
