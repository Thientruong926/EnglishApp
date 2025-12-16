// src/context/LessonVocabularyContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';

export interface LessonVocabulary {
  _id: string;
  lesson_id: any; // có thể là object Lesson
  vocab_id: any;  // có thể là object Vocabulary
}

interface LessonVocabularyContextType {
  lessonVocabs: LessonVocabulary[];
  isLoading: boolean;
  fetchLessonVocabs: () => Promise<void>;
  fetchVocabsByLesson: (lesson_id: string) => Promise<LessonVocabulary[]>;
  addLessonVocab: (lesson_id: string, vocab_id: string) => Promise<boolean>;
  updateLessonVocab: (id: string, lesson_id: string, vocab_id: string) => Promise<boolean>;
  deleteLessonVocab: (id: string) => Promise<boolean>;
}

const LessonVocabularyContext = createContext<LessonVocabularyContextType>({} as LessonVocabularyContextType);

export const LessonVocabularyProvider = ({ children }: { children: React.ReactNode }) => {
  const [lessonVocabs, setLessonVocabs] = useState<LessonVocabulary[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const BACKEND_URL = Platform.OS === 'android'
    ? 'http://10.0.2.2:5001'
    : 'http://localhost:5001';

  // Fetch all lesson-vocab links
  const fetchLessonVocabs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/lesson-vocabularies`);
      const data = await res.json();
      setLessonVocabs(data);
    } catch (err: any) {
      Alert.alert('Lỗi', 'Không thể tải liên kết: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch vocabs by lesson_id
  const fetchVocabsByLesson = async (lesson_id: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/lesson-vocabularies/lesson/${lesson_id}`);
      const data = await res.json();
      return data;
    } catch (err: any) {
      Alert.alert('Lỗi', 'Không thể tải từ vựng: ' + err.message);
      return [];
    }
  };

  // Add lesson-vocab link
  const addLessonVocab = async (lesson_id: string, vocab_id: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/lesson-vocabularies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson_id, vocab_id }),
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert('Lỗi', data.message || 'Thêm liên kết thất bại');
        return false;
      }
      setLessonVocabs(prev => [...prev, data.lessonVocab]);
      return true;
    } catch (err: any) {
      Alert.alert('Lỗi', 'Không thể kết nối server: ' + err.message);
      return false;
    }
  };

  // Update lesson-vocab link
  const updateLessonVocab = async (id: string, lesson_id: string, vocab_id: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/lesson-vocabularies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson_id, vocab_id }),
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert('Lỗi', data.message || 'Cập nhật thất bại');
        return false;
      }
      setLessonVocabs(prev => prev.map(lv => (lv._id === id ? data.lessonVocab : lv)));
      return true;
    } catch (err: any) {
      Alert.alert('Lỗi', 'Không thể kết nối server: ' + err.message);
      return false;
    }
  };

  // Delete lesson-vocab link
  const deleteLessonVocab = async (id: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/lesson-vocabularies/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert('Lỗi', data.message || 'Xóa thất bại');
        return false;
      }
      setLessonVocabs(prev => prev.filter(lv => lv._id !== id));
      return true;
    } catch (err: any) {
      Alert.alert('Lỗi', 'Không thể kết nối server: ' + err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchLessonVocabs();
  }, []);

  return (
    <LessonVocabularyContext.Provider
      value={{
        lessonVocabs,
        isLoading,
        fetchLessonVocabs,
        fetchVocabsByLesson,
        addLessonVocab,
        updateLessonVocab,
        deleteLessonVocab,
      }}
    >
      {children}
    </LessonVocabularyContext.Provider>
  );
};

export const useLessonVocabulary = () => useContext(LessonVocabularyContext);
