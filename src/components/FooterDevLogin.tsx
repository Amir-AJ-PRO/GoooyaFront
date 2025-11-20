'use client';

import { Key } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

/**
 * FooterDevLogin - Client Component
 * فقط دکمه Dev Login که نیاز به state و interaction دارد
 */
export default function FooterDevLogin() {
  const { login } = useAuth();

  // فقط در development نمایش داده شود
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleDevLogin = () => {
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
    
    toast.success("ورود موفق", {
      description: "شما با حساب مدیر وارد شدید"
    });
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleDevLogin}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
        title="ورود سریع به حساب مدیر (فقط در Development)"
      >
        <Key className="h-3 w-3" />
        <span>ورود سریع مدیر (Dev)</span>
      </button>
      <p className="text-xs text-muted-foreground mt-2">
        این دکمه فقط در حالت Development نمایش داده می‌شود
      </p>
    </div>
  );
}

