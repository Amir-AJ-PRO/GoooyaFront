import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * تبدیل مسیر نسبی به URL کامل
 * برای استفاده با تصاویر و فایل‌های backend
 */
export function getMediaUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  
  // اگر قبلاً URL کامل است، همون رو برگردان
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // اضافه کردن BASE_URL به مسیر نسبی
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://10.188.103.122:8000';
  
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