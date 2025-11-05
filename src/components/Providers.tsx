'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';

/**
 * Providers Component
 * 
 * مدیریت تمام Context Providers برای Next.js
 * QueryClient به صورت instance ساخته می‌شود تا از memory leak جلوگیری شود
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // ساخت QueryClient به صورت state تا فقط یک‌بار ساخته شود
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 دقیقه
        gcTime: 10 * 60 * 1000, // 10 دقیقه (جایگزین cacheTime)
      },
      mutations: {
        retry: false,
      }
    }
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ChatProvider>
            <Toaster />
            <Sonner />
            {children}
          </ChatProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

