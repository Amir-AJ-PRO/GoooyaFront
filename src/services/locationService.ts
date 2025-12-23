/**
 * سرویس API برای دریافت اطلاعات منطقه
 * Endpoint: GET /api/properties/locations/<id>/
 */

import { API_BASE_URL } from '@/lib/constants';
import type { LocationDetail } from '@/types/location';

export async function getLocationById(id: number): Promise<LocationDetail> {
  const response = await fetch(`${API_BASE_URL}/api/properties/locations/${id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`خطا در دریافت اطلاعات منطقه (${response.status})`);
  }

  return response.json();
}


