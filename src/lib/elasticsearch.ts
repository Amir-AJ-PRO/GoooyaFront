/**
 * Elasticsearch Client Configuration
 */

import { Client } from '@elastic/elasticsearch';
import { ElasticsearchConfig, ElasticsearchQuery, ElasticsearchResponse } from '@/types/search';

/**
 * پیکربندی پیش‌فرض Elasticsearch
 */
const defaultConfig: ElasticsearchConfig = {
  host: process.env.ELASTICSEARCH_HOST || 'localhost:9200',
  index: process.env.ELASTICSEARCH_INDEX || 'properties',
  timeout: 30000,
};

/**
 * Elasticsearch Client
 */
let esClient: Client | null = null;

/**
 * ایجاد و پیکربندی Elasticsearch Client
 */
export const getElasticsearchClient = (): Client => {
  if (!esClient) {
    esClient = new Client({
      node: `http://${defaultConfig.host}`,
      requestTimeout: defaultConfig.timeout,
      pingTimeout: 3000,
      maxRetries: 3,
    });
  }
  return esClient;
};

/**
 * بررسی در دسترس بودن Elasticsearch
 */
export const isElasticsearchAvailable = async (): Promise<boolean> => {
  try {
    const client = getElasticsearchClient();
    await client.ping();
    return true;
  } catch (error) {
    console.warn('Elasticsearch در دسترس نیست:', error);
    return false;
  }
};

/**
 * جستجو در Elasticsearch
 */
export const searchInElasticsearch = async (
  query: ElasticsearchQuery
): Promise<ElasticsearchResponse> => {
  try {
    const client = getElasticsearchClient();

    // در نسخه‌های جدید Elasticsearch JS client، پارامترهای جستجو به صورت مستقیم ارسال می‌شوند
    const response = await client.search({
      index: defaultConfig.index,
      ...(query as any),
    } as any);

    return response as unknown as ElasticsearchResponse;
  } catch (error) {
    console.error('خطا در جستجوی Elasticsearch:', error);
    throw error;
  }
};

/**
 * ایجاد Index در Elasticsearch
 */
export const createIndex = async (): Promise<void> => {
  try {
    const client = getElasticsearchClient();
    
    const indexExists = await client.indices.exists({
      index: defaultConfig.index,
    });

    if (!indexExists) {
      await client.indices.create({
        index: defaultConfig.index,
        body: {
          mappings: {
            properties: {
              id: { type: 'integer' },
              title: { 
                type: 'text', 
                analyzer: 'standard',
                boost: 3.0 // وزن بیشتر برای عنوان
              },
              slug: { type: 'keyword' },
              address: { 
                type: 'text', 
                analyzer: 'standard',
                boost: 2.0 // وزن متوسط برای آدرس
              },
              description: { 
                type: 'text', 
                analyzer: 'standard' 
              },
              measure: { type: 'float' },
              rooms: { type: 'integer' },
              price: { type: 'long' },
              transaction_type: { type: 'keyword' },
              year_built: { type: 'integer' },
              floor: { type: 'keyword' },
              
              // Relations
              city_id: { type: 'integer' },
              city_name: { 
                type: 'text', 
                analyzer: 'standard' 
              },
              location_id: { type: 'integer' },
              location_name: { 
                type: 'text', 
                analyzer: 'standard' 
              },
              property_type_id: { type: 'integer' },
              property_type_name: { type: 'keyword' },
              
              // Boolean fields
              has_parking: { type: 'boolean' },
              has_storage: { type: 'boolean' },
              has_elevator: { type: 'boolean' },
              has_balcony: { type: 'boolean' },
              has_pool: { type: 'boolean' },
              has_security: { type: 'boolean' },
              urgent: { type: 'boolean' },
              under_price: { type: 'boolean' },
              exchange: { type: 'boolean' },
              
              // Status
              show_status: { type: 'keyword' },
              
              // Timestamps
              created_at: { type: 'date' },
              updated_at: { type: 'date' },
            }
          },
          settings: {
            analysis: {
              analyzer: {
                persian_analyzer: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'persian_normalization']
                }
              },
              filter: {
                persian_normalization: {
                  type: 'persian_normalization'
                }
              }
            }
          }
        }
      } as any);}
  } catch (error) {
    console.error('خطا در ایجاد Index:', error);
    throw error;
  }
};

/**
 * اضافه کردن سند به Index
 */
export const indexDocument = async (id: number, document: any): Promise<void> => {
  try {
    const client = getElasticsearchClient();
    
    await client.index({
      index: defaultConfig.index,
      id: id.toString(),
      body: document,
      refresh: 'wait_for', // منتظر refresh بمان
    });
  } catch (error) {
    console.error('خطا در index کردن سند:', error);
    throw error;
  }
};

/**
 * به‌روزرسانی سند در Index
 */
export const updateDocument = async (id: number, document: any): Promise<void> => {
  try {
    const client = getElasticsearchClient();
    
    await client.update({
      index: defaultConfig.index,
      id: id.toString(),
      body: {
        doc: document,
      },
      refresh: 'wait_for',
    });
  } catch (error) {
    console.error('خطا در به‌روزرسانی سند:', error);
    throw error;
  }
};

/**
 * حذف سند از Index
 */
export const deleteDocument = async (id: number): Promise<void> => {
  try {
    const client = getElasticsearchClient();
    
    await client.delete({
      index: defaultConfig.index,
      id: id.toString(),
      refresh: 'wait_for',
    });
  } catch (error) {
    console.error('خطا در حذف سند:', error);
    // اگر سند وجود نداشت، خطا نده
    const err = error as any;
    if (err?.meta?.statusCode !== 404) {
      throw error;
    }
  }
};

export { defaultConfig as elasticsearchConfig };
