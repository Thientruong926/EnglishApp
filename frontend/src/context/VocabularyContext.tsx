// src/context/VocabularyContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';

export interface Vocabulary {
  _id: string;
  word: string;
  meaning: string;
  example_sentence?: string;
}

interface VocabularyContextType {
  vocabs: Vocabulary[];
  isLoading: boolean;
  fetchVocabs: () => Promise<void>;
  getAllVocabulary: () => Promise<Vocabulary[]>; // ✅ thêm hàm getAllVocabulary
  addVocab: (word: string, meaning: string, example?: string) => Promise<boolean>;
  updateVocab: (id: string, word?: string, meaning?: string, example?: string) => Promise<boolean>;
  deleteVocab: (id: string) => Promise<boolean>;
}

const VocabularyContext = createContext<VocabularyContextType>({} as VocabularyContextType);

export const VocabularyProvider = ({ children }: { children: React.ReactNode }) => {
  const [vocabs, setVocabs] = useState<Vocabulary[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const BACKEND_URL = Platform.OS === 'android'
    ? 'http://10.0.2.2:5001'
    : 'http://localhost:5001';

  // Fetch all vocabulary và lưu vào state
  const fetchVocabs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/vocabularies`);
      const data = await res.json();
      setVocabs(data);
    } catch (err: any) {
      Alert.alert('Lỗi', 'Không thể tải từ vựng: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm trả về tất cả vocab (dùng trực tiếp trong ReadingDetail)
  const getAllVocabulary = async (): Promise<Vocabulary[]> => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/vocabularies`);
      const data = await res.json();
      setVocabs(data);
      return data;
    } catch (err: any) {
      Alert.alert('Lỗi', 'Không thể tải từ vựng: ' + err.message);
      return [];
    }
  };

  // Add new vocabulary
  const addVocab = async (word: string, meaning: string, example?: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/vocabularies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, meaning, example_sentence: example }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Lỗi', data.message || 'Thêm từ vựng thất bại');
        return false;
      }

      setVocabs(prev => [...prev, data.vocab]);
      return true;
    } catch (err: any) {
      Alert.alert('Lỗi', 'Không thể kết nối server: ' + err.message);
      return false;
    }
  };

  // Update vocabulary
  const updateVocab = async (id: string, word?: string, meaning?: string, example?: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/vocabularies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, meaning, example_sentence: example }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Lỗi', data.message || 'Cập nhật thất bại');
        return false;
      }

      setVocabs(prev => prev.map(v => (v._id === id ? data.vocab : v)));
      return true;
    } catch (err: any) {
      Alert.alert('Lỗi', 'Không thể kết nối server: ' + err.message);
      return false;
    }
  };

  // Delete vocabulary
  const deleteVocab = async (id: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/vocabularies/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Lỗi', data.message || 'Xóa thất bại');
        return false;
      }

      setVocabs(prev => prev.filter(v => v._id !== id));
      return true;
    } catch (err: any) {
      Alert.alert('Lỗi', 'Không thể kết nối server: ' + err.message);
      return false;
    }
  };

  // Auto-fetch vocabs on mount
  useEffect(() => {
    fetchVocabs();
  }, []);

  return (
    <VocabularyContext.Provider
      value={{ vocabs, isLoading, fetchVocabs, getAllVocabulary, addVocab, updateVocab, deleteVocab }}
    >
      {children}
    </VocabularyContext.Provider>
  );
};

export const useVocabulary = () => useContext(VocabularyContext);
