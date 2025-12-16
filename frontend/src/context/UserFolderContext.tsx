import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Platform, Alert } from "react-native";
import { Vocabulary } from "./VocabularyContext";
import { useAuth } from "./AuthContext"; // lấy user_id từ AuthContext

// URL backend
const BACKEND_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5001"
    : "http://localhost:5001";

// Kiểu dữ liệu folder
export type UserFolder = {
  _id: string;
  name: string;
  vocabularies?: Vocabulary[];
};

// Kiểu context
type UserFolderContextType = {
  folders: UserFolder[];
  fetchFolders: () => Promise<void>;
  createFolder: (name: string) => Promise<void>;
  deleteFolder: (folder_id: string) => Promise<void>;
  addUserVocab: (folder_id: string, vocab: Vocabulary) => Promise<void>;
};

// Tạo context
const UserFolderContext = createContext<UserFolderContextType | undefined>(undefined);

// Provider
export const UserFolderProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const user_id = user?.id;

  const [folders, setFolders] = useState<UserFolder[]>([]);

  // Lấy danh sách folder của user
  const fetchFolders = async () => {
    if (!user_id) return;
    try {
      console.log("Fetching folders for user_id:", user_id);
      const res = await fetch(`${BACKEND_URL}/api/user-folders?user_id=${user_id}`);
      if (!res.ok) throw new Error("Lỗi fetch folders");
      const data = await res.json();
      setFolders(Array.isArray(data) ? data : data.folders || []);
    } catch (err) {
      console.error("Lỗi fetch folders:", err);
      Alert.alert("Lỗi", "Không thể lấy danh sách folder");
    }
  };

  // Tạo folder mới
  const createFolder = async (name: string) => {
    if (!user_id) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/user-folders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, name }),
      });

      if (res.status === 409) {
        Alert.alert("Folder đã tồn tại");
        return;
      }

      if (!res.ok) throw new Error("Lỗi khi tạo folder");
      const data = await res.json();
      setFolders(prev => [...prev, data.folder]);
    } catch (err) {
      console.error("Lỗi khi tạo folder:", err);
      Alert.alert("Lỗi", "Không thể tạo folder");
    }
  };

  // Xóa folder
  const deleteFolder = async (folder_id: string) => {
    if (!user_id) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/user-folders/${folder_id}?user_id=${user_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Lỗi xóa folder");
      setFolders(prev => prev.filter(f => f._id !== folder_id));
    } catch (err) {
      console.error("Lỗi xóa folder:", err);
      Alert.alert("Lỗi", "Không thể xóa folder");
    }
  };

  // Thêm từ vựng vào folder của user
  const addUserVocab = async (folder_id: string, vocab: Vocabulary) => {
    if (!user_id) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/user-folders/${folder_id}/vocabularies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, vocab_id: vocab._id }),
      });
      if (!res.ok) throw new Error("Không thể thêm từ vào folder");

      // Cập nhật local state, tránh trùng lặp
      setFolders(prev =>
        prev.map(f =>
          f._id === folder_id
            ? { 
                ...f, 
                vocabularies: f.vocabularies?.some(v => v._id === vocab._id)
                  ? f.vocabularies
                  : [...(f.vocabularies || []), vocab]
              }
            : f
        )
      );
    } catch (err) {
      console.error("Lỗi thêm từ vựng vào folder:", err);
      Alert.alert("Lỗi", "Không thể thêm từ vựng vào folder");
    }
  };

  // Auto-fetch khi mount
  useEffect(() => {
    fetchFolders();
  }, [user_id]);

  return (
    <UserFolderContext.Provider
      value={{ folders, fetchFolders, createFolder, deleteFolder, addUserVocab }}
    >
      {children}
    </UserFolderContext.Provider>
  );
};

// Hook tiện lợi
export const useUserFolder = () => {
  const context = useContext(UserFolderContext);
  if (!context) throw new Error("useUserFolder must be used within UserFolderProvider");
  return context;
};
