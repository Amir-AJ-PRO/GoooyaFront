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
  full_name?: string;
  type: UserType;
  is_agent?: boolean;
  is_admin?: boolean;
  agent_profile?: {
    is_goooya_adviser?: boolean;
    office_name?: string;
    license_number?: string;
    full_name?: string;
    [key: string]: any;
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function firstNonEmpty(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
}

/** Backend stores the name as `full_name`; some payloads also send `name`. */
export function pickDisplayName(data: unknown): string {
  const record = asRecord(data);
  const agent = asRecord(record.agent_profile);
  return firstNonEmpty(record.full_name, record.name, agent.full_name);
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
      name: pickDisplayName(data),
      email: data.email || '',
      type: userType,
      phone: data.phone,
      company: data.agent_profile?.office_name,
      licenseNumber: data.agent_profile?.license_number,
    };
  };

  const normalizeBackendUser = (data: unknown): BackendUserData => {
    const record = asRecord(data);
    const name = pickDisplayName(record);
    return {
      ...(record as BackendUserData),
      id: String(record.id ?? record.phone ?? ''),
      email: typeof record.email === 'string' ? record.email : '',
      phone: typeof record.phone === 'string' ? record.phone : '',
      name,
      full_name: firstNonEmpty(record.full_name, name),
    };
  };

  /**
   * دریافت اطلاعات کاربر از Server
   * user_data HttpOnly است و از document.cookie قابل خواندن نیست
   */
  const refreshUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (!response.ok) {
        // فقط در صورت 401 (Unauthorized) کاربر رو logout کن
        // برای خطاهای دیگه (مثل 500, 404) کاربر رو logout نکن
        if (response.status === 401) {
          setUser(null);
          setBackendUser(null);
        } else {
        }
        return;
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        const normalized = normalizeBackendUser(data.user);
        setUser(transformUser(normalized));
        setBackendUser(normalized);
      } else if (data.success === false && data.message === 'Keeping session alive') {
        // Backend endpoint موجود نیست اما session معتبره
        // کاربر رو logout نکن
      }
    } catch {
      // خطای شبکه - کاربر را logout نکن
    }
  };

  /**
   * ورود کاربر (بعد از موفقیت Login API)
   */
  const login = (userData: BackendUserData) => {
    const normalized = normalizeBackendUser(userData);
    setUser(transformUser(normalized));
    setBackendUser(normalized);
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
    } catch {
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
