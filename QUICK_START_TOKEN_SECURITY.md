# 🚀 راهنمای سریع - سیستم امنیتی Token Management

## نصب و راه‌اندازی (5 دقیقه)

### ✅ قدم 1: بررسی فایل‌های ایجاد شده

تمام فایل‌های زیر به پروژه اضافه شده‌اند:

```
src/
├── lib/
│   ├── tokenRefreshManager.ts    ✅ مدیریت refresh با queue و lock
│   ├── tokenManager.ts            ✅ ذخیره‌سازی و encryption
│   ├── api.ts                     ✅ Axios با interceptor های امنیتی
│   └── security.ts                ✅ توابع امنیتی (XSS, CSRF, Rate Limit)
├── contexts/
│   └── AuthContext.tsx            ✅ مدیریت احراز هویت با auto-refresh
├── hooks/
│   └── useSecurity.ts             ✅ Custom hook برای security
└── services/
    └── authApi.ts                 ✅ API های احراز هویت
```

### ✅ قدم 2: استفاده در کامپوننت Login

```tsx
// src/app/(site)/login/page.tsx یا هر کامپوننت login
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequestOTP, useVerifyOTP } from '@/hooks/useAuthMutations';
import { useAuth } from '@/contexts/AuthContext';
import { useSecurity } from '@/hooks/useSecurity';
import { toast } from 'sonner';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  
  const router = useRouter();
  const { login } = useAuth();
  const { checkOtpRateLimit, validateInput } = useSecurity();
  
  const requestOtpMutation = useRequestOTP();
  const verifyOtpMutation = useVerifyOTP();

  // مرحله 1: درخواست OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // اعتبارسنجی شماره
    const validPhone = validateInput(phone, 'phone');
    if (!validPhone) {
      toast.error('شماره تلفن نامعتبر است');
      return;
    }
    
    // بررسی rate limit
    const { allowed, resetTime } = checkOtpRateLimit(validPhone);
    if (!allowed) {
      const seconds = Math.ceil(resetTime / 1000);
      toast.error(`لطفاً ${seconds} ثانیه صبر کنید`);
      return;
    }
    
    try {
      await requestOtpMutation.mutateAsync({ phone: validPhone });
      setStep('otp');
    } catch (error) {
      // خطا به صورت خودکار توسط mutation نمایش داده می‌شود
    }
  };

  // مرحله 2: تایید OTP و Login
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await verifyOtpMutation.mutateAsync({ 
        phone, 
        code 
      });
      
      // Token ها به صورت خودکار ذخیره می‌شوند
      // فقط user را login کنید
      login({
        id: result.user.phone,
        name: result.user.full_name || result.user.phone,
        email: result.user.email || '',
        type: result.user.is_staff ? 'admin' : 
              result.user.is_agent ? 'agent' : 'user',
        phone: result.user.phone,
      });
      
      // Redirect بر اساس نقش کاربر
      if (result.user.is_staff) {
        router.push('/admin');
      } else if (result.user.is_agent) {
        router.push('/agent');
      } else {
        router.push('/user');
      }
    } catch (error) {
      // خطا به صورت خودکار نمایش داده می‌شود
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {step === 'phone' ? 'ورود به حساب کاربری' : 'تایید کد'}
        </h1>
        
        {step === 'phone' ? (
          <form onSubmit={handleRequestOtp}>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09123456789"
              className="w-full p-3 border rounded mb-4"
              maxLength={11}
            />
            <button
              type="submit"
              disabled={requestOtpMutation.isPending}
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
            >
              {requestOtpMutation.isPending ? 'در حال ارسال...' : 'ارسال کد'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="کد 6 رقمی"
              className="w-full p-3 border rounded mb-4 text-center text-2xl"
              maxLength={6}
            />
            <button
              type="submit"
              disabled={verifyOtpMutation.isPending}
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
            >
              {verifyOtpMutation.isPending ? 'در حال تایید...' : 'تایید و ورود'}
            </button>
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full mt-2 text-gray-600 hover:text-gray-800"
            >
              بازگشت
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
```

### ✅ قدم 3: استفاده از API در کامپوننت‌ها

```tsx
// مثال: دریافت لیست املاک
'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';

export default function PropertiesPage() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      // Authorization header به صورت خودکار اضافه می‌شود
      // اگر token منقضی شده باشد، به صورت خودکار refresh می‌شود
      const response = await apiClient.get('/api/properties/');
      return response.data;
    },
  });

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>خطا در دریافت املاک</div>;

  return (
    <div>
      {data.results.map((property: any) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
```

### ✅ قدم 4: ساخت Protected Route

```tsx
// src/components/ProtectedRoute.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'agent' | 'admin';
}

export default function ProtectedRoute({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (requiredRole && user?.type !== requiredRole) {
        router.push('/'); // یا صفحه unauthorized
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.type !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
```

استفاده:

```tsx
// src/app/(dashboard)/user/page.tsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function UserDashboard() {
  return (
    <ProtectedRoute requiredRole="user">
      <div>
        <h1>داشبورد کاربر</h1>
        {/* محتوای محافظت شده */}
      </div>
    </ProtectedRoute>
  );
}
```

### ✅ قدم 5: اضافه کردن Logout

```tsx
// در Header یا هر کامپوننت
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header>
      <div>سلام {user?.name}</div>
      <button onClick={handleLogout}>
        خروج
      </button>
    </header>
  );
}
```

---

## 🔥 ویژگی‌های خودکار (نیازی به کد اضافی نیست!)

### ✅ Auto-Refresh هوشمند
Token ها **5 دقیقه قبل از expire** به صورت خودکار refresh می‌شوند.

### ✅ مدیریت خطای 401
اگر درخواستی **401** برگرداند، token به صورت خودکار refresh شده و درخواست دوباره ارسال می‌شود.

### ✅ Queue System
اگر چندین درخواست همزمان نیاز به refresh داشته باشند، فقط **یک refresh request** ارسال می‌شود و بقیه منتظر می‌مانند.

### ✅ Visibility Change Handling
وقتی کاربر به tab برمی‌گردد، اگر token expire شده باشد، به صورت خودکار refresh می‌شود.

### ✅ Online/Offline Handling
وقتی کاربر دوباره online می‌شود، وضعیت token بررسی می‌شود.

---

## 🛡️ امنیت به صورت پیش‌فرض

### رمزنگاری Token ها
```typescript
// Token ها با encryption ذخیره می‌شوند
// شما نیازی به کاری ندارید!
```

### Rate Limiting
```typescript
// استفاده در form
const { checkOtpRateLimit } = useSecurity();

const { allowed, resetTime } = checkOtpRateLimit(phone);
if (!allowed) {
  alert(`لطفاً ${Math.ceil(resetTime / 1000)} ثانیه صبر کنید`);
}
```

### Input Validation
```typescript
const { validateInput } = useSecurity();

const validPhone = validateInput(phone, 'phone');
const validEmail = validateInput(email, 'email');
```

---

## 📊 نظارت و Debug

### بررسی وضعیت Token
```typescript
import { getAccessToken, isTokenExpired, isSessionValid } from '@/lib/tokenManager';

// در console
const token = getAccessToken();
console.log('Is Expired:', isTokenExpired(token));
console.log('Is Session Valid:', isSessionValid());
```

### بررسی Queue
```typescript
import { tokenRefreshManager } from '@/lib/tokenRefreshManager';

console.log('Is Refreshing:', tokenRefreshManager.isCurrentlyRefreshing());
console.log('Queue Length:', tokenRefreshManager.getQueueLength());
```

---

## ⚠️ نکات مهم

### ✅ انجام دهید

1. از `apiClient` برای تمام درخواست‌های API استفاده کنید
2. از `useSecurity` برای rate limiting استفاده کنید
3. input های کاربر را با `validateInput` اعتبارسنجی کنید
4. در production از HTTPS استفاده کنید

### ❌ انجام ندهید

1. Token ها را در console.log قرار ندهید
2. Token ها را در URL قرار ندهید
3. از fetch یا axios مستقیم استفاده نکنید (از apiClient استفاده کنید)
4. دستی setTimeout برای refresh تنظیم نکنید

---

## 🔧 عیب‌یابی سریع

### مشکل: "401 Unauthorized" مداوم

**راه‌حل:**
```typescript
// پاک کردن cache و login مجدد
import { clearTokens } from '@/lib/tokenManager';
clearTokens();
// سپس login کنید
```

### مشکل: Token در localStorage نیست

**بررسی کنید:**
1. آیا `saveTokens` بعد از verify OTP فراخوانی شده؟
2. آیا localStorage در incognito mode کار می‌کند؟
3. آیا localStorage پر شده؟

### مشکل: Refresh loop

**راه‌حل:**
```typescript
// بررسی کنید که endpoint refresh درست کار می‌کند
// مطمئن شوید که backend refresh token معتبر برمی‌گرداند
```

---

## 📚 منابع بیشتر

- 📖 [مستندات کامل](./TOKEN_SECURITY_GUIDE.md)
- 🔐 [Best Practices امنیتی](./TOKEN_SECURITY_GUIDE.md#بهترین-روشها-best-practices)
- 🐛 [راهنمای عیب‌یابی](./TOKEN_SECURITY_GUIDE.md#عیبیابی)

---

## ✅ Checklist راه‌اندازی

- [ ] فایل‌های جدید را بررسی کردم
- [ ] Login page را بروزرسانی کردم
- [ ] از `apiClient` در تمام API calls استفاده می‌کنم
- [ ] Protected routes را پیاده‌سازی کردم
- [ ] Logout را اضافه کردم
- [ ] Rate limiting را در forms اضافه کردم
- [ ] Input validation را پیاده‌سازی کردم
- [ ] در production از HTTPS استفاده می‌کنم

---

**🎉 تبریک! سیستم امنیتی Token Management شما آماده است!**

برای هر سوال یا مشکلی، به [مستندات کامل](./TOKEN_SECURITY_GUIDE.md) مراجعه کنید.

