import { api } from "@/lib/fetcher";
import { API_BASE_URL } from "@/lib/constants";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * سرویس هوش مصنوعی
 */
export const aiService = {
  /**
   * ارسال پیام به AI
   */
  chat: async (message: string, history?: ChatMessage[]): Promise<ChatResponse> => {
    const url = `${API_BASE_URL}/ai/chat`;
    return api.post<ChatResponse>(url, {
      message,
      history,
    });
  },

  /**
   * پیشنهاد املاک مشابه
   */
  suggestProperties: async (propertyId: string): Promise<ChatResponse> => {
    const url = `${API_BASE_URL}/ai/suggest/${propertyId}`;
    return api.get<ChatResponse>(url);
  },

  /**
   * تخمین قیمت ملک
   */
  estimatePrice: async (data: {
    type: string;
    area: number;
    city: string;
    bedrooms: number;
  }): Promise<ChatResponse> => {
    const url = `${API_BASE_URL}/ai/estimate-price`;
    return api.post<ChatResponse>(url, data);
  },
};

