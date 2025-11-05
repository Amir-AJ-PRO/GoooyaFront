'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function DevLoginHelper() {
  const { login } = useAuth();

  useEffect(() => {
    // فقط در development mode
    if (process.env.NODE_ENV !== 'development') return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl+Shift+L or Cmd+Shift+L
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        
        const devUser = {
          id: '09191192668',
          name: 'توسعه‌دهنده',
          email: '',
          type: 'admin' as const,
          phone: '09191192668',
          company: 'گویا',
          licenseNumber: undefined,
        };
        
        login(devUser);
        
        toast.success("🔑 ورود سریع مدیر", {
          description: "شما با Keyboard Shortcut وارد شدید",
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [login]);

  // این component چیزی render نمی‌کنه
  return null;
}

