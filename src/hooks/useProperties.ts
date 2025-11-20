import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Types برای Properties
 */
export interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  area: number;
  image: string;
  description?: string;
  type?: 'apartment' | 'villa' | 'townhouse' | 'commercial';
  status?: 'buy' | 'rent';
}

export interface PropertyFilters {
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  page?: number;
  limit?: number;
}

/**
 * Hook برای دریافت لیست املاک با فیلتر
 * 
 * این hook از React Query استفاده می‌کند برای:
 * - Cache کردن داده‌ها
 * - Auto refetch در صورت نیاز
 * - Optimistic updates
 * 
 * @param filters - فیلترهای جستجو
 * @returns نتایج query شامل data, loading, error
 * 
 * @example
 * ```tsx
 * const { data: properties, isLoading, error } = useProperties({ city: 'tehran' });
 * ```
 */
export function useProperties(filters?: PropertyFilters) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/properties?${new URLSearchParams(filters)}`);
      // const data = await response.json();
      // return data;
      
      // داده‌های نمونه برای توسعه
      await new Promise(resolve => setTimeout(resolve, 500)); // شبیه‌سازی تاخیر شبکه
      
      const mockProperties: Property[] = [
        {
          id: 1,
          title: "آپارتمان مدرن در تهران",
          price: "۸ میلیارد تومان",
          location: "تهران، فرشته",
          bedrooms: 3,
          area: 120,
          image: "/assets/property-1.jpg",
          type: 'apartment',
          status: 'buy',
        },
        {
          id: 2,
          title: "ویلا لوکس با باغ",
          price: "۱۵ میلیارد تومان",
          location: "تهران، لواسان",
          bedrooms: 4,
          area: 300,
          image: "/assets/property-2.jpg",
          type: 'villa',
          status: 'buy',
        },
        {
          id: 3,
          title: "تاون‌هاوس مدرن",
          price: "۶ میلیارد تومان",
          location: "تهران، پونک",
          bedrooms: 2,
          area: 150,
          image: "/assets/property-3.jpg",
          type: 'townhouse',
          status: 'buy',
        },
      ];
      
      // فیلتر کردن بر اساس filters
      let filtered = mockProperties;
      if (filters?.type) {
        filtered = filtered.filter(p => p.type === filters.type);
      }
      
      return {
        data: filtered,
        total: filtered.length,
        page: filters?.page || 1,
        limit: filters?.limit || 10,
      };
    },
    // تنظیمات cache و refetch
    staleTime: 5 * 60 * 1000, // 5 دقیقه
    gcTime: 10 * 60 * 1000, // 10 دقیقه (قبلاً cacheTime بود)
  });
}

/**
 * Hook برای دریافت اطلاعات یک ملک خاص
 * 
 * @param id - شناسه ملک
 * @returns اطلاعات ملک
 * 
 * @example
 * ```tsx
 * const { data: property, isLoading } = useProperty(1);
 * ```
 */
export function useProperty(id: number | string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/properties/${id}`);
      // const data = await response.json();
      // return data;
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        id,
        title: "آپارتمان مدرن در تهران",
        price: "۸ میلیارد تومان",
        location: "تهران، فرشته",
        bedrooms: 3,
        area: 120,
        image: "/assets/property-1.jpg",
        description: "آپارتمان نوساز و مدرن با امکانات کامل",
      };
    },
    staleTime: 10 * 60 * 1000, // 10 دقیقه
    enabled: !!id, // فقط اگر id موجود باشد query اجرا شود
  });
}

/**
 * Hook برای اضافه کردن ملک جدید
 * 
 * @returns mutation object با متد mutate
 * 
 * @example
 * ```tsx
 * const createProperty = useCreateProperty();
 * createProperty.mutate(newPropertyData, {
 *   onSuccess: () => console.log('Success!')
 * });
 * ```
 */
export function useCreateProperty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (property: Partial<Property>) => {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/properties', {
      //   method: 'POST',
      //   body: JSON.stringify(property),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // return response.json();
      
      await new Promise(resolve => setTimeout(resolve, 500));
      return { ...property, id: Date.now() };
    },
    onSuccess: () => {
      // Invalidate کردن cache برای refetch اتوماتیک
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

/**
 * Hook برای به‌روزرسانی ملک
 * 
 * @returns mutation object
 * 
 * @example
 * ```tsx
 * const updateProperty = useUpdateProperty();
 * updateProperty.mutate({ id: 1, title: 'New Title' });
 * ```
 */
export function useUpdateProperty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (property: Partial<Property> & { id: number }) => {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return property;
    },
    onSuccess: (data) => {
      // Update کردن cache مستقیم (Optimistic Update)
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', data.id] });
    },
  });
}

/**
 * Hook برای حذف ملک
 * 
 * @returns mutation object
 * 
 * @example
 * ```tsx
 * const deleteProperty = useDeleteProperty();
 * deleteProperty.mutate(1);
 * ```
 */
export function useDeleteProperty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

