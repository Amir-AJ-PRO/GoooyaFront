/**
 * سرویس جستجوی پیشرفته با Elasticsearch و fallback به database
 */

import { 
  SearchParams, 
  SearchResult, 
  PropertySearchItem, 
  ElasticsearchQuery 
} from '@/types/search';
import { 
  isElasticsearchAvailable, 
  searchInElasticsearch 
} from '@/lib/elasticsearch';
import { apiClient } from '@/lib/api';

/**
 * جستجوی پیشرفته املاک
 */
export const searchProperties = async (params: SearchParams): Promise<SearchResult> => {
  try {
    // بررسی در دسترس بودن Elasticsearch
    const isESAvailable = await isElasticsearchAvailable();
    
    if (isESAvailable) {
      return await searchWithElasticsearch(params);
    } else {
      // Fallback به database
      return await searchWithDatabase(params);
    }
  } catch (error) {
    console.error('خطا در جستجو:', error);
    
    // در صورت خطا، fallback به database
    try {
      const result = await searchWithDatabase(params);
      result.warning = 'جستجو با استفاده از پایگاه داده انجام شد (Elasticsearch در دسترس نیست)';
      return result;
    } catch (dbError) {
      console.error('خطا در fallback به database:', dbError);
      throw new Error('خطا در انجام جستجو');
    }
  }
};

/**
 * جستجو با Elasticsearch
 */
const searchWithElasticsearch = async (params: SearchParams): Promise<SearchResult> => {
  const query = buildElasticsearchQuery(params);
  
  try {
    const response = await searchInElasticsearch(query);
    
    return {
      count: response.hits.total.value,
      page: params.page || 1,
      page_size: params.page_size || 20,
      total_pages: Math.ceil(response.hits.total.value / (params.page_size || 20)),
      results: response.hits.hits.map(hit => mapElasticsearchResult(hit._source))
    };
  } catch (error) {
    console.error('خطا در جستجوی Elasticsearch:', error);
    throw error;
  }
};

/**
 * ساخت Query برای Elasticsearch
 */
const buildElasticsearchQuery = (params: SearchParams): ElasticsearchQuery => {
  const must: any[] = [];
  const filter: any[] = [];
  
  // فقط املاک با وضعیت ok نمایش داده شوند
  filter.push({
    term: { show_status: 'ok' }
  });
  
  // جستجوی متنی
  if (params.q) {
    must.push({
      multi_match: {
        query: params.q,
        fields: [
          'title^3',      // وزن 3 برای عنوان
          'address^2',    // وزن 2 برای آدرس
          'description',  // وزن 1 برای توضیحات
          'city_name',    // نام شهر
          'location_name' // نام منطقه
        ],
        type: 'best_fields',
        fuzziness: 'AUTO', // fuzzy matching برای نتایج بهتر
        operator: 'and'
      }
    });
  }
  
  // فیلترهای مکانی
  if (params.city) {
    filter.push({ term: { city_id: params.city } });
  }
  
  if (params.location) {
    filter.push({ term: { location_id: params.location } });
  }
  
  // فیلتر نوع ملک
  if (params.property_type) {
    filter.push({ term: { property_type_id: params.property_type } });
  }
  
  // فیلتر نوع معامله
  if (params.transaction_type) {
    filter.push({ term: { transaction_type: params.transaction_type } });
  }
  
  // فیلترهای قیمت
  if (params.min_price || params.max_price) {
    const priceRange: any = {};
    if (params.min_price) priceRange.gte = params.min_price;
    if (params.max_price) priceRange.lte = params.max_price;
    
    filter.push({ range: { price: priceRange } });
  }
  
  // فیلترهای متراژ
  if (params.min_measure || params.max_measure) {
    const measureRange: any = {};
    if (params.min_measure) measureRange.gte = params.min_measure;
    if (params.max_measure) measureRange.lte = params.max_measure;
    
    filter.push({ range: { measure: measureRange } });
  }
  
  // فیلترهای اتاق
  if (params.rooms) {
    filter.push({ term: { rooms: params.rooms } });
  } else if (params.min_rooms) {
    filter.push({ range: { rooms: { gte: params.min_rooms } } });
  }
  
  // فیلترهای سال ساخت
  if (params.min_year_built || params.max_year_built) {
    const yearRange: any = {};
    if (params.min_year_built) yearRange.gte = params.min_year_built;
    if (params.max_year_built) yearRange.lte = params.max_year_built;
    
    filter.push({ range: { year_built: yearRange } });
  }
  
  // فیلترهای امکانات
  const booleanFilters = [
    'has_parking', 'has_storage', 'has_elevator', 'has_balcony',
    'has_pool', 'has_security', 'urgent', 'under_price', 'exchange'
  ];
  
  booleanFilters.forEach(field => {
    if (params[field as keyof SearchParams] === true) {
      filter.push({ term: { [field]: true } });
    }
  });
  
  // مرتب‌سازی
  const sort = buildSortQuery(params.sort_by);
  
  // Pagination
  const page = params.page || 1;
  const pageSize = Math.min(params.page_size || 20, 100); // حداکثر 100
  const from = (page - 1) * pageSize;
  
  const query: ElasticsearchQuery = {
    query: {
      bool: {
        must: must.length > 0 ? must : undefined,
        filter: filter.length > 0 ? filter : undefined,
      }
    },
    sort,
    from,
    size: pageSize
  };
  
  // اگر هیچ must query نداریم، از match_all استفاده کن
  if (!must.length && !filter.length) {
    query.query = { bool: { must: [{ match_all: {} }] } };
  }
  
  return query;
};

/**
 * ساخت Sort Query
 */
const buildSortQuery = (sortBy?: string): any[] => {
  switch (sortBy) {
    case 'created_at':
      return [{ created_at: { order: 'asc' } }];
    case '-created_at':
    default:
      return [{ created_at: { order: 'desc' } }];
    case 'price':
      return [{ price: { order: 'asc' } }];
    case '-price':
      return [{ price: { order: 'desc' } }];
    case 'measure':
      return [{ measure: { order: 'asc' } }];
    case '-measure':
      return [{ measure: { order: 'desc' } }];
    case '_score':
      return [{ _score: { order: 'desc' } }];
  }
};

/**
 * تبدیل نتیجه Elasticsearch به PropertySearchItem
 */
const mapElasticsearchResult = (source: any): PropertySearchItem => {
  return {
    id: source.id,
    title: source.title,
    slug: source.slug,
    address: source.address || '',
    measure: source.measure?.toString() || '0',
    rooms: source.rooms || 0,
    price: source.price || 0,
    transaction_type: source.transaction_type,
    city: source.city_name || '',
    location: source.location_name || '',
    property_type: source.property_type_name || '',
    images: source.images || [],
    created_at: source.created_at,
    updated_at: source.updated_at,
  };
};

/**
 * Fallback جستجو با Database (از طریق Django API)
 */
const searchWithDatabase = async (params: SearchParams): Promise<SearchResult> => {
  try {
    // ساخت query parameters برای Django API
    const queryParams = new URLSearchParams();
    
    // اضافه کردن پارامترها
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    // درخواست به Django backend
    const response = await apiClient.get(`/v1/properties/search/?${queryParams.toString()}`);
    
    return response.data;
  } catch (error) {
    console.error('خطا در جستجوی database:', error);
    throw error;
  }
};

/**
 * دریافت پیشنهادات جستجو (autocomplete)
 */
export const getSearchSuggestions = async (query: string): Promise<string[]> => {
  try {
    const isESAvailable = await isElasticsearchAvailable();
    
    if (isESAvailable) {
      return await getElasticsearchSuggestions(query);
    } else {
      return await getDatabaseSuggestions(query);
    }
  } catch (error) {
    console.error('خطا در دریافت پیشنهادات:', error);
    return [];
  }
};

/**
 * پیشنهادات از Elasticsearch
 */
const getElasticsearchSuggestions = async (query: string): Promise<string[]> => {
  try {
    const esQuery: ElasticsearchQuery = {
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query,
                fields: ['title^3', 'address^2', 'city_name', 'location_name'],
                type: 'phrase_prefix'
              }
            }
          ],
          filter: [
            { term: { show_status: 'ok' } }
          ]
        }
      },
      size: 10,
      sort: [{ _score: { order: 'desc' } }]
    };
    
    const response = await searchInElasticsearch(esQuery);
    
    return response.hits.hits.map(hit => hit._source.title);
  } catch (error) {
    console.error('خطا در پیشنهادات Elasticsearch:', error);
    return [];
  }
};

/**
 * پیشنهادات از Database
 */
const getDatabaseSuggestions = async (query: string): Promise<string[]> => {
  try {
    const response = await apiClient.get(`/v1/properties/suggestions/?q=${encodeURIComponent(query)}`);
    return response.data.suggestions || [];
  } catch (error) {
    console.error('خطا در پیشنهادات database:', error);
    return [];
  }
};
