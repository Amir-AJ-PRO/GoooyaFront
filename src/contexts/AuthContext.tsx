'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useRefreshToken } from '@/hooks/useAuthMutations';
import {
  isSessionValid,
  getAccessToken,
  getRefreshToken,
  getRefreshDelay,
  clearTokens,
  saveTokens
} from '@/lib/tokenManager';

export type UserType = 'user' | 'agent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  avatar?: string;
  phone?: string;
  company?: string;
  licenseNumber?: string;
}

/**
 * اطلاعات کاربر از Backend
 */
export interface BackendUserData {
  phone: string;
  date_joined: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  backendUser: BackendUserData | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [backendUser, setBackendUser] = useState<BackendUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTokenMutation = useRefreshToken();

  /**
   * رفرش توکن دسترسی (Silent Refresh)
   */
  const refreshAccessToken = useCallback(async () => {
    const refresh = getRefreshToken();
    
    if (!refresh || !isSessionValid()) {
      setUser(null);
      setBackendUser(null);
      clearTokens();
      return;
    }

    try {
      const result = await refreshTokenMutation.mutateAsync({ refresh });
      saveTokens(result.access, refresh);
    } catch (error) {
      setUser(null);
      setBackendUser(null);
      clearTokens();
    }
  }, [refreshTokenMutation]);

  /**
   * بارگذاری اطلاعات کاربر هنگام load شدن
   */
  useEffect(() => {
    const loadUserData = () => {
      try {
        // بررسی session validity
        if (!isSessionValid()) {
          clearTokens();
          setIsLoading(false);
          return;
        }

        const storedUser = localStorage.getItem('user');
        const storedBackendUser = localStorage.getItem('user_data');
        const accessToken = getAccessToken();

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        if (storedBackendUser && accessToken) {
          setBackendUser(JSON.parse(storedBackendUser));
        }
      } catch (error) {
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  /**
   * ورود کاربر
   */
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    const storedBackendUser = localStorage.getItem('user_data');
    if (storedBackendUser) {
      setBackendUser(JSON.parse(storedBackendUser));
    }
  };

  /**
   * خروج کاربر
   */
  const logout = () => {
    setUser(null);
    setBackendUser(null);
    clearTokens();
  };

  const value: AuthContextType = {
    user,
    backendUser,
    isAuthenticated: !!user && isSessionValid(),
    login,
    logout,
    isLoading,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
