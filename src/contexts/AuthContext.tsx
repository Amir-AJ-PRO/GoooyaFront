'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  isSessionValid,
  getAccessToken,
  getRefreshToken,
  getRefreshDelay,
  clearTokens,
  saveTokens,
  isTokenExpired,
  getUserData,
  saveUserData,
} from '@/lib/tokenManager';
import { tokenRefreshManager } from '@/lib/tokenRefreshManager';

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
 * اطلاعات پروفایل Agent
 */
export interface AgentProfile {
  id: number;
  full_name: string;
  is_verified: boolean;
  is_goooya_adviser: boolean;
  license_number?: string;
  profile_image?: string;
  office_name?: string;
  city?: string;
}

/**
 * اطلاعات کاربر از Backend
 */
export interface BackendUserData {
  phone: string;
  date_joined: string;
  is_active: boolean;
  full_name?: string;
  email?: string;
  is_staff?: boolean;
  is_agent?: boolean;
  user_role?: string;
  agent_profile?: AgentProfile | null;
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

/**
 * AuthProvider - مدیریت احراز هویت با auto-refresh هوشمند
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [backendUser, setBackendUser] = useState<BackendUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  /**
   * Reference به timeout برای auto-refresh
   */
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  /**
   * Reference برای جلوگیری از refresh های همزمان
   */
  const isRefreshingRef = useRef<boolean>(false);

  /**
   * پاک کردن timer رفرش
   */
  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  /**
   * تنظیم timer برای رفرش خودکار
   * این timer قبل از expire شدن access token، آن را refresh می‌کند
   */
  const setupRefreshTimer = useCallback(() => {
    // پاک کردن timer قبلی
    clearRefreshTimer();

    const accessToken = getAccessToken();
    if (!accessToken || !isSessionValid()) {
      return;
    }

    // محاسبه زمان تا رفرش بعدی (5 دقیقه قبل از expire)
    const delay = getRefreshDelay(accessToken);

    if (delay > 0) {
      refreshTimerRef.current = setTimeout(async () => {
        await refreshAccessToken();
      }, delay);
    }
  }, []);

  /**
   * رفرش توکن دسترسی (Silent Refresh)
   * این تابع از TokenRefreshManager استفاده می‌کند برای رفرش امن
   */
  const refreshAccessToken = useCallback(async () => {
    // جلوگیری از refresh های همزمان
    if (isRefreshingRef.current || tokenRefreshManager.isCurrentlyRefreshing()) {
      return;
    }

    const refreshToken = getRefreshToken();
    
    // بررسی session validity
    if (!refreshToken || !isSessionValid()) {
      setUser(null);
      setBackendUser(null);
      clearTokens();
      clearRefreshTimer();
      return;
    }

    // بررسی اینکه آیا واقعاً نیاز به refresh داریم
    const accessToken = getAccessToken();
    if (accessToken && !isTokenExpired(accessToken, 5)) {
      // token هنوز معتبر است، نیازی به refresh نیست
      setupRefreshTimer();
      return;
    }

    isRefreshingRef.current = true;

    try {
      // استفاده از TokenRefreshManager برای رفرش امن
      const newAccessToken = await tokenRefreshManager.refreshAccessToken(refreshToken);
      
      // ذخیره token جدید
      saveTokens(newAccessToken, refreshToken);

      // تنظیم timer برای رفرش بعدی
      setupRefreshTimer();
    } catch (error) {
      console.error('خطا در رفرش توکن:', error);
      
      // در صورت خطا، logout کن
      setUser(null);
      setBackendUser(null);
      clearTokens();
      clearRefreshTimer();
    } finally {
      isRefreshingRef.current = false;
    }
  }, [setupRefreshTimer, clearRefreshTimer]);

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

        const accessToken = getAccessToken();
        if (!accessToken) {
          setIsLoading(false);
          return;
        }

        // بارگذاری user از localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // بارگذاری backendUser از tokenManager
        const storedBackendUser = getUserData<BackendUserData>();
        if (storedBackendUser) {
          setBackendUser(storedBackendUser);
        }

        // تنظیم timer برای auto-refresh
        setupRefreshTimer();
      } catch (error) {
        console.error('خطا در بارگذاری اطلاعات کاربر:', error);
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();

    // Cleanup: پاک کردن timer هنگام unmount
    return () => {
      clearRefreshTimer();
    };
  }, [setupRefreshTimer, clearRefreshTimer]);

  /**
   * مدیریت visibility change (وقتی کاربر به tab برمی‌گردد)
   * اگر token expire شده، refresh کن
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isSessionValid()) {
        const accessToken = getAccessToken();
        if (accessToken && isTokenExpired(accessToken, 1)) {
          // token در حال expire است، refresh کن
          refreshAccessToken();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshAccessToken]);

  /**
   * مدیریت online/offline events
   * وقتی کاربر دوباره online می‌شود، بررسی کن که token معتبر است
   */
  useEffect(() => {
    const handleOnline = () => {
      if (isSessionValid()) {
        const accessToken = getAccessToken();
        if (accessToken && isTokenExpired(accessToken, 1)) {
          refreshAccessToken();
        }
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [refreshAccessToken]);

  /**
   * ورود کاربر
   */
  const login = useCallback((userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // بارگذاری backend user data شامل agent_profile
    const storedBackendUser = getUserData<BackendUserData>();
    if (storedBackendUser) {
      setBackendUser(storedBackendUser);
    }

    // تنظیم timer برای auto-refresh
    setupRefreshTimer();
  }, [setupRefreshTimer]);

  /**
   * خروج کاربر
   */
  const logout = useCallback(() => {
    setUser(null);
    setBackendUser(null);
    clearTokens();
    clearRefreshTimer();
    tokenRefreshManager.clearQueue();
  }, [clearRefreshTimer]);

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
