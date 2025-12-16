import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert, Platform } from "react-native";
import { useAuth } from "./AuthContext"; // chỉnh đường dẫn nếu cần

export interface UserVocabulary {
  _id: string;
  user_id: string;
  vocab_id: {
    _id: string;
    word: string;
    meaning: string;
    example_sentence?: string;
  };
  folder_id: {
    _id: string;
    name: string;
  };
  is_learned: boolean;
}

interface UserVocabularyContextType {
  userVocabs: UserVocabulary[];
  isLoading: boolean;
  fetchUserVocabs: (folder_id?: string) => Promise<void>;
  addUserVocab: (vocab_id: string, folder_id: string) => Promise<boolean>;
  markAsLearned: (id: string) => Promise<boolean>;
  deleteUserVocab: (id: string) => Promise<boolean>;
}

const UserVocabularyContext = createContext<UserVocabularyContextType>(
  {} as UserVocabularyContextType
);

export const UserVocabularyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth(); // ✅ Lấy user từ AuthContext bên trong provider
  const user_id = user?.id;

  const [userVocabs, setUserVocabs] = useState<UserVocabulary[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const BACKEND_URL =
    Platform.OS === "android"
      ? "http://10.0.2.2:5001"
      : "http://localhost:5001";

  // Fetch user vocabularies (optionally by folder)
const fetchUserVocabs = async (folder_id?: string) => {
  if (!user_id) return;
  console.log("Using user_id:", user_id);

  setIsLoading(true);
  try {
    const query = folder_id ? `?folder_id=${folder_id}&user_id=${user_id}` : `?user_id=${user_id}`;
    const res = await fetch(`${BACKEND_URL}/api/user-vocabularies${query}`, {
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    console.log("Fetched userVocabs:", data);
    setUserVocabs(data);
  } catch (err: any) {
    Alert.alert("Lỗi", "Không thể tải từ vựng người dùng: " + err.message);
  } finally {
    setIsLoading(false);
  }
};


  // Add a new vocab to user
    const addUserVocab = async (vocab_id: string, folder_id: string) => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/user-vocabularies`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vocab_id, folder_id }),
        });

        const data = await res.json();
        console.log("Fetched userVocabs:", data);
        setUserVocabs(data);

        if (!res.ok) {
          Alert.alert("Lỗi", data.message || "Thêm từ vựng thất bại");
          return false;
        }

        // ✅ Kiểm tra data.userVocab
        if (Array.isArray(data.userVocab)) {
          setUserVocabs((prev) => [...prev, ...data.userVocab]);
        } else if (data.userVocab && typeof data.userVocab === "object") {
          setUserVocabs((prev) => [...prev, data.userVocab]);
        } else {
          console.warn("Unexpected userVocab format:", data.userVocab);
        }

        return true;
      } catch (err: any) {
        Alert.alert("Lỗi", "Không thể kết nối server: " + err.message);
        return false;
      }
    };


  // Mark vocab as learned
  const markAsLearned = async (id: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/user-vocabularies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert("Lỗi", data.message || "Cập nhật thất bại");
        return false;
      }
      setUserVocabs((prev) =>
        prev.map((v) => (v._id === id ? data.updated : v))
      );
      return true;
    } catch (err: any) {
      Alert.alert("Lỗi", "Không thể kết nối server: " + err.message);
      return false;
    }
  };

  // Delete vocab from user
  const deleteUserVocab = async (id: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/user-vocabularies/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert("Lỗi", data.message || "Xóa thất bại");
        return false;
      }
      setUserVocabs((prev) => prev.filter((v) => v._id !== id));
      return true;
    } catch (err: any) {
      Alert.alert("Lỗi", "Không thể kết nối server: " + err.message);
      return false;
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchUserVocabs();
  }, [user_id]);

  return (
    <UserVocabularyContext.Provider
      value={{
        userVocabs,
        isLoading,
        fetchUserVocabs,
        addUserVocab,
        markAsLearned,
        deleteUserVocab,
      }}
    >
      {children}
    </UserVocabularyContext.Provider>
  );
};

export const useUserVocabulary = () => useContext(UserVocabularyContext);
