'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserType = 'user' | 'agent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  phone: string;
  company?: string;
  licenseNumber?: string;
}

export interface BackendUserData {
  id: string;
  email: string;
  phone: string;
  name: string;
  type: UserType;
  is_agent?: boolean;
  is_admin?: boolean;
  agent_profile?: {
    is_goooya_adviser?: boolean;
    office_name?: string;
    license_number?: string;
    [key: string]: any;
  };
}

interface AuthContextType {
  user: User | null;
  backendUser: BackendUserData | null;
  isAuthenticated: boolean;
  login: (userData: BackendUserData) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [backendUser, setBackendUser] = useState<BackendUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * تبدیل BackendUserData به User
   */
  const transformUser = (data: BackendUserData): User => {
    const userType: UserType = data.is_agent ? 'agent' : data.is_admin ? 'admin' : 'user';
    return {
      id: data.phone,
      name: data.name || '',
      email: data.email || '',
      type: userType,
      phone: data.phone,
      company: data.agent_profile?.office_name,
      licenseNumber: data.agent_profile?.license_number,
    };
  };

  /**
   * خواندن user data از cookie
   */
  const getUserFromCookie = (): BackendUserData | null => {
    if (typeof document === 'undefined') return null;
    
    try {
      const cookies = document.cookie.split(';');
      const userCookie = cookies.find(c => c.trim().startsWith('user_data='));
      
      if (userCookie) {
        const userData = userCookie.split('=')[1];
        return JSON.parse(decodeURIComponent(userData));
      }
    } catch (error) {
      console.error('خطا در خواندن user data از cookie:', error);
    }
    
    return null;
  };

  /**
   * دریافت اطلاعات کاربر از Server
   */
  const refreshUser = async () => {
    try {
      // اول سعی می‌کنیم از cookie بخونیم
      const userDataFromCookie = getUserFromCookie();
      
      if (userDataFromCookie) {
        console.log('✅ User data loaded from cookie');
        const userData = transformUser(userDataFromCookie);
        setUser(userData);
        setBackendUser(userDataFromCookie);
        return; // دیگه نیازی به فراخوانی API نیست
      }
      
      // اگر در cookie نبود، از API بگیریم
      console.log('🔄 Fetching user data from API...');
      const response = await fetch('/api/auth/me', {
        credentials: 'include', // ارسال cookies
      });

      if (!response.ok) {
        // فقط در صورت 401 (Unauthorized) کاربر رو logout کن
        // برای خطاهای دیگه (مثل 500, 404) کاربر رو logout نکن
        if (response.status === 401) {
          console.log('🔒 User session expired (401) - logging out');
          setUser(null);
          setBackendUser(null);
        } else {
          console.log(`⚠️ Failed to fetch user data (${response.status}) - keeping user logged in`);
        }
        return;
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        const userData = transformUser(data.user);
        setUser(userData);
        setBackendUser(data.user);
      } else if (data.success === false && data.message === 'Keeping session alive') {
        // Backend endpoint موجود نیست اما session معتبره
        // کاربر رو logout نکن
        console.log('⚠️ Backend /me endpoint not available - keeping current session');
      }
    } catch (error) {
      console.error('خطا در دریافت اطلاعات کاربر:', error);
      // فقط در صورت خطای شبکه کاربر رو logout نکن
      console.log('⚠️ Network error - keeping user logged in');
    }
  };

  /**
   * ورود کاربر (بعد از موفقیت Login API)
   */
  const login = (userData: BackendUserData) => {
    const user = transformUser(userData);
    setUser(user);
    setBackendUser(userData);
  };

  /**
   * خروج کاربر
   */
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('خطا در خروج:', error);
    } finally {
      setUser(null);
      setBackendUser(null);
      
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
  };

  /**
   * بارگذاری اولیه
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        await refreshUser();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * چک خودکار و رفرش توکن‌ها
   * هر 5 دقیقه یک بار چک می‌کنیم که کاربر هنوز لاگین هست
   * این کار باعث میشه access token به صورت خودکار رفرش بشه
   */
  useEffect(() => {
    if (!user) return;

    const CHECK_INTERVAL = 5 * 60 * 1000; // 5 دقیقه
    
    const interval = setInterval(() => {
      console.log('🔄 Auto-checking authentication status...');
      refreshUser();
    }, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [user]);

  const value: AuthContextType = {
    user,
    backendUser,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
