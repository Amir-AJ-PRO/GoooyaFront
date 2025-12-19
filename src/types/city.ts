/**
 * انواع مربوط به شهرها (City)
 */

export interface CityDetail {
  id: number;
  name: string;
  province: string | null;
  population: number | null;
  description: string | null;
  locations_count: number;
  created_at: string;
  updated_at: string;
}

