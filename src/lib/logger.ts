/**
 * Logger utility - فقط در development فعال است
 * در production تمام لاگ‌ها غیرفعال می‌شوند
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {}
  },
  
  error: (...args: any[]) => {
    // Errors همیشه لاگ می‌شوند
    console.error(...args);
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
};

