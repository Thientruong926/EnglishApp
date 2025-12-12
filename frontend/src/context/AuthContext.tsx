// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { router } from 'expo-router';
import { Platform } from 'react-native';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<boolean>;
  signUp: (full_name: string, email: string, pass: string, role?: string) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const BACKEND_URL = Platform.OS === 'android'
    ? 'http://10.0.2.2:5001'
    : 'http://localhost:5001';

  // ================================================
  // LOGIN
  // ================================================
  const signIn = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Đăng nhập thất bại');
        return false;
      }

      const u = data.user;
      const loggedUser: User = {
        id: u.id,
        name: u.full_name || u.name || '',
        email: u.email,
        avatar: u.avatar,
        role: u.role || 'user',
      };

      setUser(loggedUser);
      router.replace('/main');
      return true;

    } catch (err: any) {
      alert('Không thể kết nối server: ' + err.message);
      return false;

    } finally {
      setIsLoading(false);
    }
  };

  // ================================================
  // SIGN UP
  // ================================================
  const signUp = async (
    full_name: string,
    email: string,
    pass: string,
    role: string = "user"
  ): Promise<boolean> => {

    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, email, password: pass, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Đăng ký thất bại");
        return false;
      }

      // Backend trả user luôn
      const u = data.user;
      const newUser: User = {
        id: u.id,
        name: u.full_name,
        email: u.email,
        avatar: u.avatar,
        role: u.role || "user",
      };

      setUser(newUser);
      router.replace('/main');
      return true;

    } catch (err) {
      alert("Không thể kết nối server khi đăng ký");
      return false;

    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    router.replace('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
