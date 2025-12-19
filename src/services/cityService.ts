/**
 * سرویس API برای دریافت اطلاعات شهر
 * Endpoint: GET /api/properties/cities/<id>/
 */

import { API_BASE_URL } from '@/lib/constants';
import type { CityDetail } from '@/types/city';

export async function getCityById(id: number): Promise<CityDetail> {
  const response = await fetch(`${API_BASE_URL}/api/properties/cities/${id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`خطا در دریافت اطلاعات شهر (${response.status})`);
  }

  return response.json();
}

