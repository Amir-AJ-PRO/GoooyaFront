import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  createProperty,
  getProperties,
  getPropertyBySlug,
  getPropertyTypes,
  getCities,
  getLocations,
  getHomepageProperties,
  PaginatedPropertiesResponse
} from '@/services/propertyApi';
import { 
  CreatePropertyPayload,
  Property,
  PropertyListItem,
  PropertyType,
  City,
  Location
} from '@/types/property';

/**
 * Hook برای ایجاد ملک جدید
 */
export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation<Property, Error, CreatePropertyPayload>({
    mutationFn: async (payload: CreatePropertyPayload) => {
      return await createProperty(payload);
    },
    onSuccess: (data) => {// Invalidate کردن تمام query های مربوط به املاک
      queryClient.invalidateQueries({ queryKey: ['agent-properties'] });
      queryClient.invalidateQueries({ queryKey: ['searchProperties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['homepage-properties'] });
      
      toast.success('ملک با موفقیت ثبت شد', {
        description: 'ملک شما پس از تأیید نمایش داده خواهد شد'
      });
    },
    onError: (error) => {
      // نمایش خطای serialize شده از سرور
      const errorMessage = error.message || 'خطای ناشناخته در ثبت ملک';
      
      toast.error('خطا در ثبت ملک', {
        description: errorMessage,
        duration: 6000, // 6 ثانیه برای خواندن خطاهای طولانی
      });
    }
  });
};

/**
 * Hook برای دریافت انواع املاک
 */
export const usePropertyTypes = () => {
  return useQuery<PropertyType[], Error>({
    queryKey: ['property-types'],
    queryFn: getPropertyTypes,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

/**
 * Hook برای دریافت شهرها
 */
export const useCities = () => {
  return useQuery<City[], Error>({
    queryKey: ['cities'],
    queryFn: getCities,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

/**
 * Hook برای دریافت مناطق یک شهر
 */
export const useLocations = (cityId?: number) => {
  return useQuery<Location[], Error>({
    queryKey: ['locations', cityId],
    queryFn: () => {
      if (!cityId) throw new Error('شهر انتخاب نشده');
      return getLocations(cityId);
    },
    enabled: !!cityId,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

/**
 * Hook برای دریافت لیست املاک با Pagination
 * 
 * @param page - شماره صفحه (پیش‌فرض: 1)
 * @param pageSize - تعداد نتایج در هر صفحه (پیش‌فرض: 20)
 * @param enabled - آیا query باید فعال باشد (پیش‌فرض: true)
 */
export const useProperties = (
  page: number = 1, 
  pageSize: number = 20,
  enabled: boolean = true
) => {
  return useQuery<PaginatedPropertiesResponse, Error>({
    queryKey: ['properties', page, pageSize],
    queryFn: () => getProperties(page, pageSize),
    enabled: enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes (همانند cache backend)
    placeholderData: (previousData) => previousData, // برای جلوگیری از flicker هنگام تغییر صفحه
  });
};

/**
 * Hook برای دریافت جزئیات یک ملک
 * @param slugOrId - اسلاگ یا ID ملک
 */
export const useProperty = (slugOrId: string | number) => {
  return useQuery<Property, Error>({
    queryKey: ['property', slugOrId],
    queryFn: () => getPropertyBySlug(slugOrId),
    enabled: !!slugOrId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook برای دریافت املاک صفحه اصلی
 * حداکثر 6 ملک برگشت میده
 */
  export const useHomepageProperties = () => {
    return useQuery<PropertyListItem[], Error>({
      queryKey: ['homepage-properties'],
      queryFn: getHomepageProperties,
      staleTime: 1000 * 60 * 60, // 1 hour (همانند cache backend)
      refetchOnWindowFocus: false, // چون کش شده، نیازی به refetch نیست
    });
  };

