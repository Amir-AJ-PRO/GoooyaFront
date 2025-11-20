import { useState, useEffect } from 'react';

/**
 * Custom hook برای debounce کردن یک مقدار
 * 
 * @param value - مقداری که می‌خواهیم debounce کنیم
 * @param delay - تاخیر به میلی‌ثانیه (پیش‌فرض: 500ms)
 * @returns مقدار debounced شده
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     // اینجا API call یا هر عمل دیگری انجام می‌شود
 *     fetchSearchResults(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // تنظیم تایمر برای به‌روزرسانی مقدار debounced شده
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // پاک کردن تایمر در صورت تغییر value یا unmount شدن کامپوننت
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

