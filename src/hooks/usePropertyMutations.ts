import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  createProperty,
  getProperties,
  getPropertyBySlug,
  getPropertyTypes,
  getCities,
  getLocations,
  CreatePropertyPayload,
  Property,
  PropertyListItem,
  PropertyType,
  City,
  Location
} from '@/services/propertyApi';
import { getAccessToken } from '@/lib/tokenManager';

/**
 * Hook برای ایجاد ملک جدید
 */
export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation<Property, Error, CreatePropertyPayload>({
    mutationFn: async (payload: CreatePropertyPayload) => {
      const token = getAccessToken();
      if (!token) {
        throw new Error('لطفاً ابتدا وارد شوید');
      }
      return createProperty(payload, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-properties'] });
      toast.success('ملک با موفقیت ثبت شد', {
        description: 'ملک شما پس از تأیید نمایش داده خواهد شد'
      });
    },
    onError: (error) => {
      toast.error('خطا در ثبت ملک', {
        description: error.message
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
 * Hook برای دریافت لیست املاک
 */
export const useProperties = () => {
  return useQuery<PropertyListItem[], Error>({
    queryKey: ['properties'],
    queryFn: getProperties,
    staleTime: 1000 * 60 * 5, // 5 minutes (همانند cache backend)
  });
};

/**
 * Hook برای دریافت جزئیات یک ملک
 */
export const useProperty = (slug: string) => {
  return useQuery<Property, Error>({
    queryKey: ['property', slug],
    queryFn: () => getPropertyBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

