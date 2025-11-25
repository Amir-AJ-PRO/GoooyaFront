import axios from 'axios';
import { API_BASE_URL } from './constants';

/**
 * نوع callback برای درخواست‌های در صف
 */
type QueuedRequest = {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
};

/**
 * TokenRefreshManager - مدیریت امن refresh token با قفل و صف
 * 
 * این کلاس از الگوی Singleton استفاده می‌کند تا اطمینان حاصل شود که
 * فقط یک instance از refresh manager در تمام اپلیکیشن وجود دارد.
 * 
 * ویژگی‌های اصلی:
 * - قفل (Lock) برای جلوگیری از refresh های همزمان
 * - صف (Queue) برای مدیریت درخواست‌های معلق
 * - مدیریت خودکار خطاها
 * - پشتیبانی از retry logic
 */
class TokenRefreshManager {
  private static instance: TokenRefreshManager;
  
  /**
   * آیا در حال حاضر یک refresh در حال انجام است؟
   */
  private isRefreshing: boolean = false;
  
  /**
   * صف درخواست‌هایی که منتظر refresh هستند
   */
  private refreshQueue: QueuedRequest[] = [];
  
  /**
   * Promise فعلی refresh (برای جلوگیری از refresh های مکرر)
   */
  private currentRefreshPromise: Promise<string> | null = null;

  /**
   * تعداد دفعات تلاش برای refresh
   */
  private retryCount: number = 0;
  
  /**
   * حداکثر تعداد retry
   */
  private readonly MAX_RETRY = 2;

  private constructor() {}

  /**
   * دریافت instance واحد TokenRefreshManager (Singleton Pattern)
   */
  public static getInstance(): TokenRefreshManager {
    if (!TokenRefreshManager.instance) {
      TokenRefreshManager.instance = new TokenRefreshManager();
    }
    return TokenRefreshManager.instance;
  }

  /**
   * اضافه کردن یک درخواست به صف
   */
  private enqueueRequest(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.refreshQueue.push({ resolve, reject });
    });
  }

  /**
   * پردازش صف و resolve کردن تمام درخواست‌های در انتظار
   */
  private processQueue(error: Error | null, token: string | null = null): void {
    this.refreshQueue.forEach((request) => {
      if (error) {
        request.reject(error);
      } else if (token) {
        request.resolve(token);
      }
    });
    
    // پاک کردن صف
    this.refreshQueue = [];
  }

  /**
   * رفرش کردن access token با استفاده از refresh token
   * 
   * این متد اطمینان می‌دهد که فقط یک refresh request در یک زمان ارسال می‌شود.
   * تمام درخواست‌های همزمان در صف قرار می‌گیرند و منتظر نتیجه می‌مانند.
   * 
   * @param refreshToken - Refresh token برای دریافت access token جدید
   * @returns Promise<string> - Access token جدید
   * @throws Error - در صورت شکست refresh
   */
  public async refreshAccessToken(refreshToken: string): Promise<string> {
    // اگر قبلاً در حال refresh هستیم، درخواست را به صف اضافه کن
    if (this.isRefreshing && this.currentRefreshPromise) {
      return this.enqueueRequest();
    }

    // قفل کردن برای جلوگیری از refresh های همزمان
    this.isRefreshing = true;

    // ایجاد یک promise جدید برای refresh
    this.currentRefreshPromise = new Promise<string>(async (resolve, reject) => {
      try {
        // ارسال درخواست refresh به backend
        const response = await axios.post(
          `${API_BASE_URL}/api/token/refresh/`,
          { refresh: refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 10000, // 10 seconds timeout
          }
        );

        const newAccessToken = response.data.access;

        // Reset retry counter on success
        this.retryCount = 0;

        // ذخیره token جدید
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', newAccessToken);
        }

        // پردازش صف و resolve کردن تمام درخواست‌ها
        this.processQueue(null, newAccessToken);
        
        resolve(newAccessToken);
      } catch (error) {
        // مدیریت خطا
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.detail || error.message
          : 'خطای ناشناخته در رفرش توکن';

        const refreshError = new Error(errorMessage);

        // بررسی امکان retry
        if (this.retryCount < this.MAX_RETRY && axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
          this.retryCount++;
          this.isRefreshing = false;
          this.currentRefreshPromise = null;
          
          // تلاش مجدد با تاخیر
          await new Promise(r => setTimeout(r, 1000 * this.retryCount));
          return this.refreshAccessToken(refreshToken);
        }

        // Reset state
        this.retryCount = 0;
        
        // پردازش صف با خطا
        this.processQueue(refreshError, null);
        
        reject(refreshError);
      } finally {
        // آزاد کردن قفل
        this.isRefreshing = false;
        this.currentRefreshPromise = null;
      }
    });

    return this.currentRefreshPromise;
  }

  /**
   * پاک کردن صف و state (برای logout یا خطاهای critical)
   */
  public clearQueue(): void {
    this.processQueue(new Error('عملیات لغو شد'), null);
    this.isRefreshing = false;
    this.currentRefreshPromise = null;
    this.retryCount = 0;
  }

  /**
   * بررسی اینکه آیا در حال refresh هستیم
   */
  public isCurrentlyRefreshing(): boolean {
    return this.isRefreshing;
  }

  /**
   * دریافت تعداد درخواست‌های در صف
   */
  public getQueueLength(): number {
    return this.refreshQueue.length;
  }
}

/**
 * Export instance واحد برای استفاده در سراسر اپلیکیشن
 */
export const tokenRefreshManager = TokenRefreshManager.getInstance();

/**
 * Export کلاس برای تست‌ها (اختیاری)
 */
export default TokenRefreshManager;

