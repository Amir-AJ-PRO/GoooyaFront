/**
 * انواع مربوط به ملک
 */

export type PropertyType = "apartment" | "villa" | "townhouse" | "commercial";

export type PropertyStatus = "active" | "pending" | "sold" | "rejected";

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  city: string;
  location: string;
  description: string;
  features?: string[];
  images?: string[];
  status: PropertyStatus;
  agentId: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyListItem {
  id: string | number;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  area: number;
  image: string;
}

export interface PropertyFilters {
  search?: string;
  type?: PropertyType;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  page?: number;
  limit?: number;
}

export interface PropertyResponse {
  success: boolean;
  data: Property[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

