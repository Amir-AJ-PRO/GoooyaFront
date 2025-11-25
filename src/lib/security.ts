/**
 * Security Utilities
 * 
 * این فایل شامل توابع امنیتی برای محافظت در برابر حملات رایج است:
 * - XSS (Cross-Site Scripting)
 * - CSRF (Cross-Site Request Forgery)
 * - Clickjacking
 * - و سایر تهدیدات امنیتی
 */

/**
 * Sanitize کردن ورودی HTML برای جلوگیری از XSS
 * 
 * @param input - متن ورودی که باید پاکسازی شود
 * @returns متن پاکسازی شده
 */
export const sanitizeHtml = (input: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  const reg = /[&<>"'/]/ig;
  return input.replace(reg, (match) => map[match] || match);
};

/**
 * Escape کردن کاراکترهای خاص برای استفاده در RegExp
 */
export const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * اعتبارسنجی URL برای جلوگیری از Open Redirect
 * 
 * @param url - URL برای اعتبارسنجی
 * @param allowedDomains - لیست دامنه‌های مجاز (اختیاری)
 * @returns آیا URL معتبر است؟
 */
export const isValidUrl = (url: string, allowedDomains?: string[]): boolean => {
  try {
    const parsedUrl = new URL(url);
    
    // فقط http و https مجاز است
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }
    
    // بررسی دامنه‌های مجاز
    if (allowedDomains && allowedDomains.length > 0) {
      return allowedDomains.some(domain => 
        parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`)
      );
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * اعتبارسنجی شماره تلفن ایرانی
 * 
 * @param phone - شماره تلفن
 * @returns آیا شماره تلفن معتبر است؟
 */
export const isValidIranianPhone = (phone: string): boolean => {
  const phoneRegex = /^09\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * اعتبارسنجی ایمیل
 * 
 * @param email - آدرس ایمیل
 * @returns آیا ایمیل معتبر است؟
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * تولید CSRF Token
 * این token باید در localStorage یا cookie ذخیره شود
 * و با هر درخواست POST/PUT/DELETE/PATCH ارسال شود
 */
export const generateCsrfToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * دریافت یا ایجاد CSRF Token
 */
export const getCsrfToken = (): string => {
  if (typeof window === 'undefined') return '';
  
  let token = sessionStorage.getItem('csrf_token');
  
  if (!token) {
    token = generateCsrfToken();
    sessionStorage.setItem('csrf_token', token);
  }
  
  return token;
};

/**
 * بررسی اینکه آیا درخواست از دامنه مجاز است (CORS check)
 * 
 * @param origin - Origin درخواست
 * @param allowedOrigins - لیست origin های مجاز
 * @returns آیا origin مجاز است؟
 */
export const isAllowedOrigin = (origin: string, allowedOrigins: string[]): boolean => {
  return allowedOrigins.includes(origin) || origin === window.location.origin;
};

/**
 * تنظیم Security Headers برای fetch requests
 */
export const getSecurityHeaders = (): Record<string, string> => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
};

/**
 * Rate Limiting - محدود کردن تعداد درخواست‌ها
 * برای جلوگیری از حملات Brute Force
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 5, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * بررسی اینکه آیا درخواست مجاز است
   * 
   * @param key - کلید شناسایی (مثلاً IP یا شماره تلفن)
   * @returns آیا درخواست مجاز است؟
   */
  public isAllowed(key: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    
    // فیلتر کردن درخواست‌های خارج از window
    const recentRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    // اضافه کردن درخواست جدید
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    
    return true;
  }

  /**
   * پاک کردن تاریخچه درخواست‌ها برای یک کلید
   */
  public reset(key: string): void {
    this.requests.delete(key);
  }

  /**
   * دریافت تعداد درخواست‌های باقیمانده
   */
  public getRemainingRequests(key: string): number {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    const recentRequests = userRequests.filter(time => now - time < this.windowMs);
    
    return Math.max(0, this.maxRequests - recentRequests.length);
  }

  /**
   * دریافت زمان باقیمانده تا reset (به میلی‌ثانیه)
   */
  public getResetTime(key: string): number {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    
    if (userRequests.length === 0) {
      return 0;
    }
    
    const oldestRequest = Math.min(...userRequests);
    const resetTime = oldestRequest + this.windowMs - now;
    
    return Math.max(0, resetTime);
  }
}

/**
 * Rate Limiter برای OTP requests (5 درخواست در 60 ثانیه)
 */
export const otpRateLimiter = new RateLimiter(5, 60000);

/**
 * Rate Limiter برای Login attempts (10 درخواست در 15 دقیقه)
 */
export const loginRateLimiter = new RateLimiter(10, 15 * 60 * 1000);

/**
 * محافظت در برابر Clickjacking
 * بررسی می‌کند که صفحه در iframe قرار نگرفته است
 */
export const preventClickjacking = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    if (window.self !== window.top) {
      // صفحه در iframe است
      console.error('Clickjacking detected!');
      window.top?.location.replace(window.self.location.href);
    }
  } catch (e) {
    // اگر به window.top دسترسی نداشتیم، احتمالاً در iframe هستیم
    document.body.innerHTML = '';
    console.error('Clickjacking detected!');
  }
};

/**
 * پاکسازی و اعتبارسنجی input های فرم
 * 
 * @param input - مقدار ورودی
 * @param type - نوع ورودی
 * @returns مقدار پاکسازی شده یا null در صورت عدم اعتبار
 */
export const validateAndSanitizeInput = (
  input: string,
  type: 'phone' | 'email' | 'text' | 'number' | 'url'
): string | null => {
  // حذف فاصله‌های اضافی
  const trimmed = input.trim();
  
  switch (type) {
    case 'phone':
      return isValidIranianPhone(trimmed) ? trimmed : null;
    
    case 'email':
      return isValidEmail(trimmed) ? trimmed.toLowerCase() : null;
    
    case 'number':
      const num = parseFloat(trimmed);
      return !isNaN(num) ? num.toString() : null;
    
    case 'url':
      return isValidUrl(trimmed) ? trimmed : null;
    
    case 'text':
    default:
      // محدود کردن طول
      const maxLength = 1000;
      const sanitized = sanitizeHtml(trimmed);
      return sanitized.length <= maxLength ? sanitized : sanitized.substring(0, maxLength);
  }
};

/**
 * تولید یک Nonce برای CSP (Content Security Policy)
 */
export const generateNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
};

/**
 * تابع برای جلوگیری از Timing Attacks
 * مقایسه دو string به صورت constant-time
 */
export const constantTimeCompare = (a: string, b: string): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
};

/**
 * بررسی قدرت رمز عبور
 * 
 * @param password - رمز عبور
 * @returns امتیاز قدرت رمز عبور (0-4)
 */
export const checkPasswordStrength = (password: string): {
  score: number;
  feedback: string[];
} => {
  let score = 0;
  const feedback: string[] = [];
  
  // حداقل طول
  if (password.length >= 8) {
    score++;
  } else {
    feedback.push('رمز عبور باید حداقل 8 کاراکتر باشد');
  }
  
  // حروف کوچک و بزرگ
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push('رمز عبور باید شامل حروف کوچک و بزرگ باشد');
  }
  
  // اعداد
  if (/\d/.test(password)) {
    score++;
  } else {
    feedback.push('رمز عبور باید شامل حداقل یک عدد باشد');
  }
  
  // کاراکترهای خاص
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score++;
  } else {
    feedback.push('رمز عبور باید شامل حداقل یک کاراکتر خاص باشد');
  }
  
  return { score, feedback };
};

/**
 * محافظت از داده‌های حساس در console
 * در production، console.log ها غیرفعال می‌شوند
 */
export const secureConsole = (): void => {
  if (typeof window === 'undefined') return;
  
  if (process.env.NODE_ENV === 'production') {
    // غیرفعال کردن console methods در production
    const noop = () => {};
    console.log = noop;
    console.warn = noop;
    console.error = noop;
    console.info = noop;
    console.debug = noop;
  }
};

/**
 * Export تمام توابع
 */
export default {
  sanitizeHtml,
  escapeRegExp,
  isValidUrl,
  isValidIranianPhone,
  isValidEmail,
  generateCsrfToken,
  getCsrfToken,
  isAllowedOrigin,
  getSecurityHeaders,
  otpRateLimiter,
  loginRateLimiter,
  preventClickjacking,
  validateAndSanitizeInput,
  generateNonce,
  constantTimeCompare,
  checkPasswordStrength,
  secureConsole,
};

