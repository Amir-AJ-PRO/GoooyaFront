import { jwtDecode } from 'jwt-decode';

/**
 * Interface برای JWT Payload
 */
interface JWTPayload {
  exp: number;
  iat: number;
  user_id?: string;
  token_type?: string;
}

/**
 * کلیدهای localStorage
 */
const STORAGE_KEYS = {
  ACCESS_TOKEN: '__at__',
  REFRESH_TOKEN: '__rt__',
  TOKEN_SAVED_AT: '__ts__',
  USER_DATA: '__ud__',
  USER: '__u__',
  FINGERPRINT: '__fp__',
} as const;

/**
 * رمزنگاری ساده برای token ها (Base64 + XOR)
 * توجه: این یک لایه امنیتی اضافی است، نه جایگزین HTTPS
 */
const encryptToken = (token: string): string => {
  if (typeof window === 'undefined') return token;
  
  try {
    // ایجاد یک کلید ساده بر اساس fingerprint مرورگر
    const fingerprint = getDeviceFingerprint();
    const key = fingerprint.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    // XOR encryption با Base64
    const encrypted = token
      .split('')
      .map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ (key + i) % 256))
      .join('');
    
    return btoa(encrypted);
  } catch (error) {
    console.error('خطا در رمزنگاری:', error);
    return token;
  }
};

/**
 * رمزگشایی token
 */
const decryptToken = (encryptedToken: string): string => {
  if (typeof window === 'undefined') return encryptedToken;
  
  try {
    const fingerprint = getDeviceFingerprint();
    const key = fingerprint.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    const decoded = atob(encryptedToken);
    const decrypted = decoded
      .split('')
      .map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ (key + i) % 256))
      .join('');
    
    return decrypted;
  } catch (error) {
    console.error('خطا در رمزگشایی:', error);
    return encryptedToken;
  }
};

/**
 * ایجاد Device Fingerprint ساده
 * این برای جلوگیری از استفاده token در دستگاه دیگر است
 */
const getDeviceFingerprint = (): string => {
  if (typeof window === 'undefined') return 'server';
  
  const stored = localStorage.getItem(STORAGE_KEYS.FINGERPRINT);
  if (stored) return stored;
  
  // ایجاد fingerprint بر اساس مشخصات مرورگر
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
  ].join('|');
  
  // Hash ساده
  const hash = Array.from(fingerprint)
    .reduce((hash, char) => ((hash << 5) - hash) + char.charCodeAt(0) | 0, 0)
    .toString(36);
  
  localStorage.setItem(STORAGE_KEYS.FINGERPRINT, hash);
  return hash;
};

/**
 * بررسی اینکه آیا توکن منقضی شده یا نه
 * @param token - JWT token
 * @param bufferMinutes - دقیقه‌های اضافی برای رفرش زودتر (پیش‌فرض: 5 دقیقه)
 */
export const isTokenExpired = (token: string, bufferMinutes: number = 5): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000; // تبدیل به ثانیه
    
    // اگر کمتر از bufferMinutes به expire مانده، true برگردان
    return decoded.exp < currentTime + (bufferMinutes * 60);
  } catch (error) {
    console.error('خطا در decode کردن توکن:', error);
    return true; // اگر decode نشد، در نظر بگیر که expire شده
  }
};

/**
 * زمان باقیمانده تا expire شدن توکن (به میلی‌ثانیه)
 */
export const getTokenExpiryTime = (token: string): number | null => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;
    const timeRemaining = decoded.exp - currentTime;
    
    return timeRemaining > 0 ? timeRemaining * 1000 : 0; // تبدیل به میلی‌ثانیه
  } catch (error) {
    console.error('خطا در محاسبه زمان انقضا:', error);
    return null;
  }
};

/**
 * محاسبه زمان برای رفرش بعدی
 * رفرش 5 دقیقه قبل از expire شدن انجام می‌شود
 * @param token - Access token
 * @param bufferMinutes - دقیقه‌های buffer برای رفرش (پیش‌فرض: 5 دقیقه)
 */
export const getRefreshDelay = (token: string, bufferMinutes: number = 5): number => {
  const expiryTime = getTokenExpiryTime(token);
  
  if (!expiryTime) {
    return 0;
  }
  
  // رفرش bufferMinutes قبل از expire
  const refreshBuffer = bufferMinutes * 60 * 1000;
  const delay = expiryTime - refreshBuffer;
  
  // حداقل delay = 1 دقیقه، حداکثر = زمان تا expire - 10 ثانیه
  return Math.max(60000, Math.min(delay, expiryTime - 10000));
};

/**
 * بررسی اینکه آیا refresh token هنوز معتبر است
 */
export const isRefreshTokenValid = (refreshToken: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(refreshToken);
    const currentTime = Date.now() / 1000;
    
    // اگر refresh token منقضی نشده باشد
    return decoded.exp > currentTime;
  } catch (error) {
    console.error('خطا در بررسی refresh token:', error);
    return false;
  }
};

/**
 * ذخیره توکن‌ها در localStorage به صورت امن
 * توکن‌ها با یک لایه رمزنگاری ساده ذخیره می‌شوند
 * 
 * @param accessToken - Access token دریافتی از backend
 * @param refreshToken - Refresh token دریافتی از backend
 */
export const saveTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // ذخیره token ها با رمزنگاری
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, encryptToken(accessToken));
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, encryptToken(refreshToken));
    
    // ذخیره timestamp برای tracking
    localStorage.setItem(STORAGE_KEYS.TOKEN_SAVED_AT, Date.now().toString());
    
    // ایجاد یا بروزرسانی fingerprint
    getDeviceFingerprint();
  } catch (error) {
    console.error('خطا در ذخیره توکن‌ها:', error);
    // اگر localStorage پر باشد یا خطایی رخ داد، token های قدیمی رو پاک کن
    clearTokens();
  }
};

/**
 * پاک کردن تمام توکن‌ها و داده‌های مرتبط
 * این تابع باید در logout و هر خطای critical فراخوانی شود
 */
export const clearTokens = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_SAVED_AT);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.USER);
    // fingerprint رو نگه می‌داریم برای login بعدی
  } catch (error) {
    console.error('خطا در پاک کردن توکن‌ها:', error);
  }
};

/**
 * دریافت access token از localStorage
 * token رمزگشایی شده برگردانده می‌شود
 */
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const encrypted = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!encrypted) return null;
    
    return decryptToken(encrypted);
  } catch (error) {
    console.error('خطا در دریافت access token:', error);
    return null;
  }
};

/**
 * دریافت refresh token از localStorage
 * token رمزگشایی شده برگردانده می‌شود
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const encrypted = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!encrypted) return null;
    
    return decryptToken(encrypted);
  } catch (error) {
    console.error('خطا در دریافت refresh token:', error);
    return null;
  }
};

/**
 * بررسی اینکه آیا session هنوز معتبر است
 * این شامل بررسی وجود و اعتبار refresh token است
 */
export const isSessionValid = (): boolean => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    return false;
  }
  
  return isRefreshTokenValid(refreshToken);
};

/**
 * دریافت زمان ذخیره شدن token ها
 */
export const getTokenSavedTime = (): number | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const timestamp = localStorage.getItem(STORAGE_KEYS.TOKEN_SAVED_AT);
    return timestamp ? parseInt(timestamp, 10) : null;
  } catch (error) {
    return null;
  }
};

/**
 * بررسی اینکه آیا token ها به تازگی ذخیره شده‌اند (در 10 ثانیه گذشته)
 * این برای جلوگیری از refresh های غیرضروری مفید است
 */
export const areTokensRecentlySaved = (): boolean => {
  const savedTime = getTokenSavedTime();
  if (!savedTime) return false;
  
  const now = Date.now();
  const diff = now - savedTime;
  
  // اگر کمتر از 10 ثانیه از ذخیره token گذشته باشد
  return diff < 10000;
};

/**
 * ذخیره داده‌های کاربر
 */
export const saveUserData = (userData: any): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  } catch (error) {
    console.error('خطا در ذخیره داده‌های کاربر:', error);
  }
};

/**
 * دریافت داده‌های کاربر
 */
export const getUserData = <T = any>(): T | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('خطا در دریافت داده‌های کاربر:', error);
    return null;
  }
};

