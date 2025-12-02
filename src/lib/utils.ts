import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_BASE_URL } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * تبدیل مسیر نسبی به URL کامل
 * برای استفاده با تصاویر و فایل‌های backend
 * همیشه یک رشته معتبر برمی‌گرداند (در صورت نبود تصویر، placeholder)
 */
export function getMediaUrl(path: string | null | undefined): string {
  if (!path) return '/placeholder-image.jpg';

  // اگر قبلاً URL کامل است، همون رو برگردان
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // استفاده از API_BASE_URL از constants
  const baseUrl = API_BASE_URL;
  
  // اطمینان از اینکه path با / شروع می‌شود
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${normalizedPath}`;
}

/**
 * فرمت کردن قیمت به فرمت فارسی با جداکننده
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fa-IR').format(price);
}

/**
 * فرمت کردن تاریخ به شمسی
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fa-IR').format(d);
}