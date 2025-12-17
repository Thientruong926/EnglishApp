// src/context/UserProgressContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Platform, Alert } from "react-native";
import { useAuth } from "./AuthContext"; // lấy user_id từ AuthContext

// URL backend
const BACKEND_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5001"
    : "http://localhost:5001";

// Kiểu dữ liệu UserProgress
export type UserProgress = {
  _id: string;
  user_id: string;
  lesson_id: string;
  status: "not_started" | "in_progress" | "completed";
  last_accessed: string;
};

// Kiểu context
type UserProgressContextType = {
  progresses: UserProgress[];
  fetchUserProgresses: () => Promise<void>;
  addProgress: (lesson_id: string, status?: string) => Promise<void>;
  updateProgress: (id: string, status: string) => Promise<void>;
  deleteProgress: (id: string) => Promise<void>;
};

// Tạo context
const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

// Provider
export const UserProgressProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const user_id = user?.id;

  const [progresses, setProgresses] = useState<UserProgress[]>([]);

  // Lấy danh sách tiến độ của user
  const fetchUserProgresses = async () => {
    if (!user_id) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/user-progress/user/${user_id}`);
      if (!res.ok) throw new Error("Lỗi fetch tiến độ");
      const data = await res.json();
      setProgresses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi fetch tiến độ:", err);
      Alert.alert("Lỗi", "Không thể lấy tiến độ học");
    }
  };

  // Thêm tiến độ mới
  const addProgress = async (lesson_id: string, status: string = "not_started") => {
    if (!user_id) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/user-progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, lesson_id, status }),
      });
      if (!res.ok) throw new Error("Lỗi thêm tiến độ");
      const data = await res.json();
      setProgresses(prev => [...prev, data.userProgress]);
    } catch (err) {
      console.error("Lỗi thêm tiến độ:", err);
      Alert.alert("Lỗi", "Không thể thêm tiến độ học");
    }
  };

  // Cập nhật tiến độ
  const updateProgress = async (id: string, status: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/user-progress/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Lỗi cập nhật tiến độ");
      const data = await res.json();
      setProgresses(prev => prev.map(p => (p._id === id ? data.userProgress : p)));
    } catch (err) {
      console.error("Lỗi cập nhật tiến độ:", err);
      Alert.alert("Lỗi", "Không thể cập nhật tiến độ học");
    }
  };

  // Xóa tiến độ
  const deleteProgress = async (id: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/user-progress/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Lỗi xóa tiến độ");
      setProgresses(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error("Lỗi xóa tiến độ:", err);
      Alert.alert("Lỗi", "Không thể xóa tiến độ học");
    }
  };

  // Auto-fetch khi mount hoặc user_id thay đổi
  useEffect(() => {
    fetchUserProgresses();
  }, [user_id]);

  return (
    <UserProgressContext.Provider
      value={{ progresses, fetchUserProgresses, addProgress, updateProgress, deleteProgress }}
    >
      {children}
    </UserProgressContext.Provider>
  );
};

// Hook tiện lợi
export const useUserProgress = () => {
  const context = useContext(UserProgressContext);
  if (!context) throw new Error("useUserProgress must be used within UserProgressProvider");
  return context;
};
