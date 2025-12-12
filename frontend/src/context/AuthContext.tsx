// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';

// 1. Định nghĩa kiểu dữ liệu cho User
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// 2. Định nghĩa Context có những hàm gì
interface AuthContextType {
  user: User | null;        // Thông tin user (null = chưa đăng nhập)
  isLoading: boolean;       // Trạng thái đang tải (xoay vòng vòng)
  signIn: (email: string, pass: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// 3. Provider bọc toàn bộ App
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- MOCK DATA LOGIN ---
  const signIn = (email: string, pass: string) => {
    setIsLoading(true);

    // Giả lập độ trễ mạng 1 giây (1000ms)
    setTimeout(() => {
      // Kiểm tra tài khoản cứng (Mock Data)
      if (email === "admin@gmail.com" && pass === "123456") {
        const mockUser: User = {
          id: "1",
          name: "Nguyễn Văn Admin",
          email: email,
          avatar: "https://i.pravatar.cc/150?img=3"
        };
        setUser(mockUser);
        
        // Đăng nhập xong thì chuyển về trang Home chính
        // Lưu ý: Ta sẽ thay 'replace' bằng logic ở _layout.tsx sau này để bảo mật hơn
        router.replace('/main'); 
      } else {
        alert("Sai email hoặc mật khẩu! (Thử: admin@gmail.com / 123456)");
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const signOut = () => {
    setUser(null);
    router.replace('/auth/login'); // Về lại màn hình Welcome
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để dùng nhanh ở các màn hình khác
export const useAuth = () => useContext(AuthContext);