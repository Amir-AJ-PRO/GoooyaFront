import { api } from "@/lib/fetcher";
import { API_BASE_URL } from "@/lib/constants";
import type { Property, PropertyFilters, PropertyResponse } from "@/types/property";

/**
 * سرویس مدیریت املاک
 */
export const propertyService = {
  /**
   * دریافت لیست املاک
   */
  getAll: async (filters?: PropertyFilters): Promise<PropertyResponse> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const url = `${API_BASE_URL}/properties?${params.toString()}`;
    return api.get<PropertyResponse>(url);
  },

  /**
   * دریافت یک ملک
   */
  getById: async (id: string): Promise<Property> => {
    const url = `${API_BASE_URL}/properties/${id}`;
    const response = await api.get<{ success: boolean; data: Property }>(url);
    return response.data;
  },

  /**
   * ایجاد ملک جدید
   */
  create: async (data: Partial<Property>): Promise<Property> => {
    const url = `${API_BASE_URL}/properties`;
    const response = await api.post<{ success: boolean; data: Property }>(url, data);
    return response.data;
  },

  /**
   * بروزرسانی ملک
   */
  update: async (id: string, data: Partial<Property>): Promise<Property> => {
    const url = `${API_BASE_URL}/properties/${id}`;
    const response = await api.patch<{ success: boolean; data: Property }>(url, data);
    return response.data;
  },

  /**
   * حذف ملک
   */
  delete: async (id: string): Promise<void> => {
    const url = `${API_BASE_URL}/properties/${id}`;
    await api.delete(url);
  },
};

