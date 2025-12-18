'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

/**
 * Dev Login Helper - غیرفعال شده
 * در نسخه جدید با HttpOnly cookies، نمی‌توان مستقیماً user را inject کرد
 * باید از API login استفاده شود
 */
export default function DevLoginHelper() {
  useEffect(() => {
    // فقط در development mode
    if (process.env.NODE_ENV !== 'development') return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl+Shift+L or Cmd+Shift+L
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        
        toast.info("🔧 Dev Login Disabled", {
          description: "در نسخه جدید، لطفاً از صفحه login استفاده کنید (شماره: 09191192668)",
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return null;
}
