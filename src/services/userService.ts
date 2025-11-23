import { api } from "@/lib/fetcher";
import { API_BASE_URL } from "@/lib/constants";
import type { User } from "@/types/user";
import type { PaginatedResponse } from "@/types/api";

/**
 * سرویس مدیریت کاربران
 */
export const userService = {
  /**
   * دریافت لیست کاربران (فقط برای ادمین)
   */
  getAll: async (page = 1, limit = 10): Promise<PaginatedResponse<User>> => {
    const url = `${API_BASE_URL}/users?page=${page}&limit=${limit}`;
    return api.get<PaginatedResponse<User>>(url);
  },

  /**
   * دریافت اطلاعات یک کاربر
   */
  getById: async (id: string): Promise<User> => {
    const url = `${API_BASE_URL}/users/${id}`;
    const response = await api.get<{ success: boolean; data: User }>(url);
    return response.data;
  },

  /**
   * بروزرسانی پروفایل کاربر
   */
  update: async (id: string, data: Partial<User>): Promise<User> => {
    const url = `${API_BASE_URL}/users/${id}`;
    const response = await api.patch<{ success: boolean; data: User }>(url, data);
    return response.data;
  },

  /**
   * حذف کاربر (فقط برای ادمین)
   */
  delete: async (id: string): Promise<void> => {
    const url = `${API_BASE_URL}/users/${id}`;
    await api.delete(url);
  },

  /**
   * دریافت پروفایل کاربر جاری
   */
  getProfile: async (): Promise<User> => {
    const url = `${API_BASE_URL}/users/me`;
    const response = await api.get<{ success: boolean; data: User }>(url);
    return response.data;
  },

  /**
   * بروزرسانی پروفایل کاربر جاری
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const url = `${API_BASE_URL}/users/me`;
    const response = await api.patch<{ success: boolean; data: User }>(url, data);
    return response.data;
  },
};

