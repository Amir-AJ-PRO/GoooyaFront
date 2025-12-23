/**
 * انواع مربوط به مناطق/محله‌ها (Location)
 */

export interface LocationDetail {
  id: number;
  name: string;

  city: number;
  city_name: string;
  city_province: string | null;

  description: string | null;
  latitude: number | null;
  longitude: number | null;

  land_use: string | null;
  average_price: number | null;
  iframe: string | null;

  properties_count: number;

  created_at: string;
  updated_at: string;
}


