import apiClient from '@/lib/api';
import { API_BASE_URL } from '@/lib/constants';

const API_BASE = API_BASE_URL;

/**
 * Types برای API های احراز هویت
 */
export interface RequestOTPPayload {
  phone: string;
}

export interface RequestOTPResponse {
  detail: string;
  otp?: string; // فقط در حالت debug
}

export interface VerifyOTPPayload {
  phone: string;
  code: string;
}

export interface UserData {
  phone: string;
  full_name?: string;
  email?: string;
  date_joined: string;
  is_active: boolean;
  is_staff: boolean;
  is_agent: boolean;
  user_role: string;
  agent_profile: any | null;
}

export interface VerifyOTPResponse {
  refresh: string;
  access: string;
  user: UserData;
  created: boolean;
}

export interface RefreshTokenPayload {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
}

export interface UpdateProfilePayload {
  full_name?: string;
  email?: string;
}

export interface UpdateProfileResponse {
  detail: string;
  user: UserData;
}

/**
 * API Functions
 */

/**
 * درخواست کد OTP
 */
export const requestOTP = async (payload: RequestOTPPayload): Promise<RequestOTPResponse> => {
  const response = await fetch(`${API_BASE}/api/auth/request-otp/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'خطا در ارسال کد تایید');
  }

  return data;
};

/**
 * تایید کد OTP
 */
export const verifyOTP = async (payload: VerifyOTPPayload): Promise<VerifyOTPResponse> => {
  const response = await fetch(`${API_BASE}/api/auth/verify-otp/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'کد تایید نامعتبر است');
  }

  return data;
};

/**
 * رفرش کردن Access Token
 */
export const refreshToken = async (payload: RefreshTokenPayload): Promise<RefreshTokenResponse> => {
  const response = await fetch(`${API_BASE}/api/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'نشست شما منقضی شده است');
  }

  return data;
};

/**
 * به‌روزرسانی پروفایل کاربر
 */
export const updateProfile = async (
  payload: UpdateProfilePayload,
  token: string
): Promise<UpdateProfileResponse> => {
  const response = await fetch(`${API_BASE}/api/auth/update-profile/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'خطا در به‌روزرسانی پروفایل');
  }

  return data;
};

