# معماری Frontend با Backend جدا (API-First)

## 🎯 فلسفه

**Frontend = UI Layer + API Client**

Backend (NestJS):
- ✅ Business Logic
- ✅ Data Validation  
- ✅ Database Access
- ✅ Security

Frontend (Next.js):
- ✅ UI Components
- ✅ User Experience
- ✅ API Communication
- ✅ Client-side State
- ✅ Basic UX Validation (فقط برای UX، نه Security)

---

## 📁 ساختار پیشنهادی (Optimized)

```
src/
│
├── app/                              # Next.js App Router
│   ├── (public)/                     # Public pages
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── properties/
│   │   ├── about/
│   │   └── login/
│   │
│   ├── (dashboard)/                  # Protected pages
│   │   ├── layout.tsx
│   │   ├── user/
│   │   ├── agent/
│   │   └── admin/
│   │
│   └── api/                          # Optional: API Proxy (اگه نیاز باشه)
│       └── proxy/[...path]/route.ts
│
├── features/                         # 🔥 Feature-based organization
│   │
│   ├── properties/
│   │   ├── api/                      # API Integration
│   │   │   ├── properties.api.ts    # API calls به Backend
│   │   │   ├── properties.hooks.ts  # React Query hooks
│   │   │   └── properties.types.ts  # TypeScript types (از Backend)
│   │   │
│   │   ├── components/               # UI Components
│   │   │   ├── PropertyCard/
│   │   │   │   ├── PropertyCard.tsx
│   │   │   │   ├── PropertyCard.test.tsx
│   │   │   │   └── PropertyCard.stories.tsx
│   │   │   │
│   │   │   ├── PropertyList/
│   │   │   ├── PropertyForm/
│   │   │   └── PropertyFilters/
│   │   │
│   │   └── index.ts                  # Public exports
│   │
│   ├── auth/
│   │   ├── api/
│   │   │   ├── auth.api.ts
│   │   │   └── auth.hooks.ts
│   │   │
│   │   ├── components/
│   │   │   ├── LoginForm/
│   │   │   └── OTPInput/
│   │   │
│   │   ├── store/                    # State (اگه نیاز باشه)
│   │   │   └── authStore.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── engineering/
│   ├── chat/
│   └── support/
│
├── shared/                           # Shared resources
│   │
│   ├── api/                          # API Layer
│   │   ├── client.ts                # Axios/Fetch config با interceptors
│   │   ├── endpoints.ts             # API endpoints constants
│   │   └── types.ts                 # Generic API types
│   │
│   ├── components/                   # Shared UI
│   │   ├── ui/                      # shadcn/ui components
│   │   ├── layouts/
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   └── Sidebar/
│   │   │
│   │   └── common/
│   │       ├── Button/
│   │       ├── Modal/
│   │       └── Pagination/
│   │
│   ├── hooks/                        # Shared hooks
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── lib/                          # Utilities
│   │   ├── formatters.ts            # Date, Number, Currency formatters
│   │   ├── validators.ts            # Client-side validation (فقط UX)
│   │   ├── constants.ts
│   │   └── utils.ts
│   │
│   └── types/                        # Shared TypeScript types
│       ├── api.types.ts
│       └── common.types.ts
│
├── config/                           # Configuration
│   ├── env.ts                       # Environment variables
│   ├── api.config.ts                # API configuration
│   └── routes.ts                    # Frontend routes
│
└── styles/
    └── globals.css
```

---

## 🔥 مثال‌های عملی

### 1. API Client Layer

```typescript
// shared/api/client.ts
import axios, { AxiosInstance } from 'axios';
import { env } from '@/config/env';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.BACKEND_URL, // http://localhost:3001/v1
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor: Add token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, try refresh
          const refreshed = await this.refreshToken();
          if (refreshed) {
            return this.client.request(error.config);
          }
          // Redirect to login
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      const { data } = await axios.post(`${env.BACKEND_URL}/auth/refresh`, {
        refreshToken,
      });
      localStorage.setItem('access_token', data.accessToken);
      return true;
    } catch {
      return false;
    }
  }

  // Generic methods
  async get<T>(url: string, config = {}) {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config = {}) {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config = {}) {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config = {}) {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
```

```typescript
// shared/api/endpoints.ts
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REQUEST_OTP: '/auth/otp/request',
    VERIFY_OTP: '/auth/otp/verify',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },

  // Properties
  PROPERTIES: {
    LIST: '/properties',
    DETAIL: (id: string) => `/properties/${id}`,
    CREATE: '/properties',
    UPDATE: (id: string) => `/properties/${id}`,
    DELETE: (id: string) => `/properties/${id}`,
  },

  // Users
  USERS: {
    ME: '/users/me',
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
  },
} as const;
```

---

### 2. Feature API Layer

```typescript
// features/properties/api/properties.types.ts
// این types باید با Backend DTO هاتون match کنه

export interface Property {
  id: string;
  title: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  type: 'apartment' | 'villa' | 'townhouse' | 'commercial';
  status: 'active' | 'pending' | 'sold' | 'rejected';
  location: {
    city: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  agentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  search?: string;
  type?: Property['type'];
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  status?: Property['status'];
  page?: number;
  limit?: number;
}

export interface PropertyListResponse {
  data: Property[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreatePropertyDto {
  title: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  type: Property['type'];
  location: {
    city: string;
    address: string;
  };
  description: string;
  features?: string[];
  images?: string[];
}
```

```typescript
// features/properties/api/properties.api.ts
import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import {
  Property,
  PropertyFilters,
  PropertyListResponse,
  CreatePropertyDto,
} from './properties.types';

export const propertiesApi = {
  // GET /v1/properties
  getAll: async (filters?: PropertyFilters): Promise<PropertyListResponse> => {
    return apiClient.get(API_ENDPOINTS.PROPERTIES.LIST, {
      params: filters,
    });
  },

  // GET /v1/properties/:id
  getById: async (id: string): Promise<Property> => {
    return apiClient.get(API_ENDPOINTS.PROPERTIES.DETAIL(id));
  },

  // POST /v1/properties
  create: async (data: CreatePropertyDto): Promise<Property> => {
    return apiClient.post(API_ENDPOINTS.PROPERTIES.CREATE, data);
  },

  // PATCH /v1/properties/:id
  update: async (id: string, data: Partial<CreatePropertyDto>): Promise<Property> => {
    return apiClient.patch(API_ENDPOINTS.PROPERTIES.UPDATE(id), data);
  },

  // DELETE /v1/properties/:id
  delete: async (id: string): Promise<void> => {
    return apiClient.delete(API_ENDPOINTS.PROPERTIES.DELETE(id));
  },

  // POST /v1/properties/:id/images
  uploadImages: async (id: string, images: File[]): Promise<string[]> => {
    const formData = new FormData();
    images.forEach((image) => formData.append('images', image));
    
    return apiClient.post(`/properties/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
```

```typescript
// features/properties/api/properties.hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertiesApi } from './properties.api';
import { PropertyFilters, CreatePropertyDto } from './properties.types';
import { toast } from 'sonner';

// Query keys
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters?: PropertyFilters) => [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
};

// GET list
export function useProperties(filters?: PropertyFilters) {
  return useQuery({
    queryKey: propertyKeys.list(filters),
    queryFn: () => propertiesApi.getAll(filters),
    staleTime: 30000, // 30 seconds
  });
}

// GET by id
export function useProperty(id: string) {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => propertiesApi.getById(id),
    enabled: !!id,
  });
}

// CREATE
export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePropertyDto) => propertiesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      toast.success('ملک با موفقیت ایجاد شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در ایجاد ملک');
    },
  });
}

// UPDATE
export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePropertyDto> }) =>
      propertiesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      toast.success('ملک با موفقیت بروزرسانی شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در بروزرسانی ملک');
    },
  });
}

// DELETE
export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => propertiesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      toast.success('ملک با موفقیت حذف شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در حذف ملک');
    },
  });
}
```

---

### 3. Feature Components

```typescript
// features/properties/components/PropertyCard/PropertyCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bed, Square } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { Property } from '../../api/properties.types';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          <Image
            src={property.images[0] || '/placeholder.jpg'}
            alt={property.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-lg">
            {property.price.toLocaleString('fa-IR')} تومان
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
          
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
            <MapPin className="h-4 w-4" />
            <span>{property.location.city}</span>
          </div>
          
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms} خواب</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{property.area} متر</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
```

```typescript
// features/properties/components/PropertyList/PropertyList.tsx
'use client';

import { useState } from 'react';
import { useProperties } from '../../api/properties.hooks';
import { PropertyCard } from '../PropertyCard/PropertyCard';
import { PropertyFilters } from '../PropertyFilters/PropertyFilters';
import { Pagination } from '@/shared/components/common/Pagination';
import { PropertyFilters as PropertyFiltersType } from '../../api/properties.types';

export function PropertyList() {
  const [filters, setFilters] = useState<PropertyFiltersType>({
    page: 1,
    limit: 12,
  });

  const { data, isLoading, error } = useProperties(filters);

  if (isLoading) {
    return <div>در حال بارگذاری...</div>;
  }

  if (error) {
    return <div>خطا در دریافت املاک</div>;
  }

  return (
    <div>
      <PropertyFilters onFiltersChange={setFilters} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {data && (
        <Pagination
          currentPage={data.pagination.page}
          totalPages={data.pagination.totalPages}
          onPageChange={(page) => setFilters({ ...filters, page })}
        />
      )}
    </div>
  );
}
```

---

### 4. استفاده در Pages

```typescript
// app/(public)/properties/page.tsx
import { PropertyList } from '@/features/properties';

export default function PropertiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">املاک</h1>
      <PropertyList />
    </div>
  );
}
```

```typescript
// app/(public)/properties/[id]/page.tsx
import { PropertyDetail } from '@/features/properties';

export default function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <PropertyDetail propertyId={params.id} />;
}
```

---

## 🎯 مزایای این معماری

### 1. **Clear Separation**
```
Frontend (Next.js):  UI + API Client
Backend (NestJS):    Business Logic + Data
```

### 2. **Type Safety**
```typescript
// Types از Backend → Frontend
// همیشه sync هستند
interface Property {
  // این با Backend DTO match میکنه
}
```

### 3. **Easy Testing**
```typescript
// Mock کردن API calls راحته
jest.mock('@/features/properties/api/properties.api');
```

### 4. **Team Collaboration**
```
Frontend Dev 1:  features/properties/
Frontend Dev 2:  features/auth/
Backend Dev:     NestJS Controllers
```

---

## 📊 این چیزها رو نداریم (چون Backend داریم)

❌ Domain Entities
❌ Use Cases
❌ Repository Pattern
❌ Business Logic
❌ Data Validation (فقط UX validation)

---

## ✅ این چیزها رو داریم

✅ API Client Layer
✅ React Query (Cache + State)
✅ UI Components
✅ Feature-based Organization
✅ TypeScript Types (mirror از Backend)

---

## 🚀 Type Sync با Backend

برای sync کردن types:

### روش 1: Manual (فعلی)
```typescript
// Backend: property.dto.ts
export class PropertyDto {
  id: string;
  title: string;
  // ...
}

// Frontend: properties.types.ts
export interface Property {
  id: string;
  title: string;
  // ... (copy از Backend)
}
```

### روش 2: Auto-generated (پیشنهادی آینده)
```bash
# با swagger/openapi
npm run generate:types
# → auto generate types از Backend API
```

---

## 💡 نتیجه‌گیری

برای Frontend با Backend جدا:

**این معماری = UI Client + API Layer**

- ✅ ساده
- ✅ واضح
- ✅ مقیاس‌پذیر
- ✅ تیم‌ورک راحت
- ✅ مناسب تیم 3 نفره
- ✅ آماده برای scale شدن

**این معماری برای شماست!** 🎯

