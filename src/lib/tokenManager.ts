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
 * بررسی اینکه آیا توکن منقضی شده یا نه
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000; // تبدیل به ثانیه
    
    // اگر کمتر از 5 دقیقه به expire مانده، true برگردان (برای رفرش زودتر)
    return decoded.exp < currentTime + 300; // 300 seconds = 5 minutes
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
 */
export const getRefreshDelay = (token: string): number => {
  const expiryTime = getTokenExpiryTime(token);
  
  if (!expiryTime) {
    return 0;
  }
  
  // رفرش 5 دقیقه قبل از expire (300000 ms = 5 minutes)
  const refreshBuffer = 5 * 60 * 1000;
  const delay = expiryTime - refreshBuffer;
  
  // حداقل delay = 1 دقیقه، حداکثر = زمان تا expire
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
 */
export const saveTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  
  // ذخیره timestamp برای tracking
  localStorage.setItem('token_saved_at', Date.now().toString());
};

/**
 * پاک کردن تمام توکن‌ها
 */
export const clearTokens = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_saved_at');
  localStorage.removeItem('user_data');
  localStorage.removeItem('user');
};

/**
 * دریافت access token از localStorage
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};

/**
 * دریافت refresh token از localStorage
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token');
};

/**
 * بررسی اینکه آیا session هنوز معتبر است
 */
export const isSessionValid = (): boolean => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    return false;
  }
  
  return isRefreshTokenValid(refreshToken);
};

