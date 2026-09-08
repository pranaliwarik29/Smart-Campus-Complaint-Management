import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, expectedRole?: string) => Promise<User>;
  register: (payload: {
    name: string;
    email: string;
    studentId: string;
    password: string;
    confirmPassword: string;
    role?: 'student' | 'admin';
  }) => Promise<User>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('campuscare_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function verifyExistingToken() {
      const storedToken = localStorage.getItem('campuscare_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.getMe();
        setUser(response.user);
      } catch (err) {
        console.warn('Stored session is invalid or expired:', err);
        localStorage.removeItem('campuscare_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    verifyExistingToken();
  }, []);

  const login = async (email: string, password: string, expectedRole?: string): Promise<User> => {
    const res = await api.login({ email, password, expectedRole });
    localStorage.setItem('campuscare_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (payload: {
    name: string;
    email: string;
    studentId: string;
    password: string;
    confirmPassword: string;
    role?: 'student' | 'admin';
  }): Promise<User> => {
    const res = await api.register(payload);
    localStorage.setItem('campuscare_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('campuscare_token');
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    setUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
