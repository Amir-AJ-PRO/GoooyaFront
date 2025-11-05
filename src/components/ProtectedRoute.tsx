'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * کامپوننت محافظت از روت‌ها
 * اگر کاربر لاگین نکرده باشد، به صفحه ورود ریدایرکت می‌شود
 * 
 * @deprecated در Next.js بهتر است از middleware استفاده شود
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?from=${pathname}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // نمایش loading در حین بررسی وضعیت احراز هویت
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // اگر کاربر لاگین نکرده، صفحه خالی نمایش بده تا redirect بشه
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

