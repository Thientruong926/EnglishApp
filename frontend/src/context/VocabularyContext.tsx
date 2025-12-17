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
  addVocab: (
    word: string,
    meaning: string,
    example?: string
  ) => Promise<Vocabulary | null>;
  updateVocab: (
    id: string,
    word?: string,
    meaning?: string,
    example?: string
  ) => Promise<boolean>;
  deleteVocab: (id: string) => Promise<boolean>;
}

const VocabularyContext = createContext<VocabularyContextType>(
  {} as VocabularyContextType
);

export const VocabularyProvider = ({ children }: { children: React.ReactNode }) => {
  const [vocabs, setVocabs] = useState<Vocabulary[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const BACKEND_URL =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:5001'
      : 'http://localhost:5001';

  const fetchVocabs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/vocabularies`);
      const data = await res.json();
      setVocabs(data);
    } catch (err: any) {
      Alert.alert('Lỗi', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ QUAN TRỌNG: TRẢ VỀ Vocabulary
  const addVocab = async (
    word: string,
    meaning: string,
    example?: string
  ): Promise<Vocabulary | null> => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/vocabularies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word,
          meaning,
          example_sentence: example,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Lỗi', data.message || 'Thêm thất bại');
        return null;
      }

      setVocabs(prev => [...prev, data.vocab]);
      return data.vocab; // 🔥 QUAN TRỌNG
    } catch (err: any) {
      Alert.alert('Lỗi', err.message);
      return null;
    }
  };

  const updateVocab = async (
    id: string,
    word?: string,
    meaning?: string,
    example?: string
  ) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/vocabularies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word,
          meaning,
          example_sentence: example,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        Alert.alert('Lỗi', data.message);
        return false;
      }

      setVocabs(prev =>
        prev.map(v => (v._id === id ? data.vocab : v))
      );
      return true;
    } catch {
      return false;
    }
  };

  const deleteVocab = async (id: string) => {
    try {
      await fetch(`${BACKEND_URL}/api/vocabularies/${id}`, {
        method: 'DELETE',
      });
      setVocabs(prev => prev.filter(v => v._id !== id));
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    fetchVocabs();
  }, []);

  return (
    <VocabularyContext.Provider
      value={{
        vocabs,
        isLoading,
        fetchVocabs,
        addVocab,
        updateVocab,
        deleteVocab,
      }}
    >
      {children}
    </VocabularyContext.Provider>
  );
};

export const useVocabulary = () => useContext(VocabularyContext);
