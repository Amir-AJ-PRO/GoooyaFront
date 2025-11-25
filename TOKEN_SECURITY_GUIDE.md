# راهنمای امنیتی مدیریت Token - پروژه گویا

## 📋 فهرست مطالب

1. [معرفی](#معرفی)
2. [معماری سیستم](#معماری-سیستم)
3. [کامپو�ت‌های اصلی](#کامپوننتهای-اصلی)
4. [نحوه استفاده](#نحوه-استفاده)
5. [ویژگی‌های امنیتی](#ویژگیهای-امنیتی)
6. [مثال‌های کاربردی](#مثالهای-کاربردی)
7. [بهترین روش‌ها (Best Practices)](#بهترین-روشها-best-practices)
8. [عیب‌یابی](#عیبیابی)

---

## معرفی

این سیستم یک راه‌حل امنیتی و کامل برای مدیریت Access Token و Refresh Token در اپلیکیشن Next.js است. سیستم طراحی شده تا از امنیت بالا، کارایی مطلوب، و تجربه کاربری بدون وقفه اطمینان حاصل کند.

### ویژگی‌های کلیدی

- ✅ **Auto-Refresh هوشمند**: رفرش خودکار token قبل از انقضا
- ✅ **Queue System**: مدیریت درخواست‌های همزمان با صف
- ✅ **Locking Mechanism**: جلوگیری از refresh های موازی
- ✅ **Encryption**: رمزنگاری token ها در localStorage
- ✅ **Rate Limiting**: محدودسازی درخواست‌ها برای جلوگیری از حملات
- ✅ **CSRF Protection**: محافظت در برابر حملات CSRF
- ✅ **XSS Protection**: محافظت در برابر حملات XSS
- ✅ **Device Fingerprinting**: شناسایی دستگاه برای امنیت بیشتر

---

## معماری سیستم

### نمودار جریان (Flow Diagram)

```
┌─────────────────┐
│   کاربر لاگین   │
│   می‌کند        │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  دریافت Access + Refresh   │
│       Token                 │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ ذخیره رمزشده در localStorage│
│  + تنظیم Auto-Refresh Timer │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│    استفاده از API با       │
│    Access Token             │
└────────┬────────────────────┘
         │
         ├──► [Token معتبر] ──► ادامه کار
         │
         └──► [Token منقضی شده یا 401]
                │
                ▼
         ┌──────────────────────┐
         │ TokenRefreshManager  │
         │  (با Lock و Queue)   │
         └──────────┬───────────┘
                    │
                    ├──► [Refresh موفق] ──► ذخیره Token جدید + ادامه
                    │
                    └──► [Refresh ناموفق] ──► Logout + Redirect به Login
```

---

## کامپونت‌های اصلی

### 1. TokenRefreshManager (`src/lib/tokenRefreshManager.ts`)

مدیریت امن و هوشمند رفرش token با الگوی Singleton.

**ویژگی‌ها:**
- 🔒 **Lock Mechanism**: فقط یک refresh request در هر زمان
- 📋 **Queue System**: صف درخواست‌های در انتظار
- 🔄 **Retry Logic**: تلاش مجدد در صورت خطا
- ⏱️ **Timeout Handling**: مدیریت timeout ها

**API:**
```typescript
// دریافت instance
const manager = tokenRefreshManager;

// رفرش token
const newAccessToken = await manager.refreshAccessToken(refreshToken);

// بررسی وضعیت
const isRefreshing = manager.isCurrentlyRefreshing();
const queueLength = manager.getQueueLength();

// پاک کردن صف (در logout)
manager.clearQueue();
```

---

### 2. tokenManager (`src/lib/tokenManager.ts`)

مدیریت ذخیره‌سازی، بازیابی، و اعتبارسنجی token ها.

**ویژگی‌ها:**
- 🔐 **Encryption**: رمزنگاری ساده token ها
- 🔍 **Validation**: اعتبارسنجی و بررسی انقضا
- 📱 **Device Fingerprint**: شناسایی دستگاه
- ⏰ **Timing Utilities**: محاسبه زمان‌های refresh

**API:**
```typescript
import {
  saveTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  isTokenExpired,
  isSessionValid,
  getRefreshDelay,
} from '@/lib/tokenManager';

// ذخیره token ها
saveTokens(accessToken, refreshToken);

// دریافت token ها
const access = getAccessToken();
const refresh = getRefreshToken();

// بررسی اعتبار
const isExpired = isTokenExpired(accessToken);
const isValid = isSessionValid();

// محاسبه زمان refresh
const delay = getRefreshDelay(accessToken); // milliseconds

// پاک کردن
clearTokens();
```

---

### 3. API Client (`src/lib/api.ts`)

Axios instance با interceptor های امنیتی.

**ویژگی‌ها:**
- 🔄 **Auto Retry**: تلاش مجدد خودکار با token جدید
- 🛡️ **Security Headers**: هدرهای امنیتی
- ⚠️ **Error Handling**: مدیریت حرفه‌ای خطاها
- 🚪 **Smart Redirect**: redirect هوشمند به login

**نحوه استفاده:**
```typescript
import apiClient from '@/lib/api';

// درخواست معمولی - Authorization header به صورت خودکار اضافه می‌شود
const response = await apiClient.get('/api/users/me');

// اگر 401 دریافت شود، به صورت خودکار refresh می‌شود
// و درخواست دوباره ارسال می‌شود
```

---

### 4. AuthContext (`src/contexts/AuthContext.tsx`)

Context مدیریت احراز هویت با auto-refresh.

**ویژگی‌ها:**
- ⏰ **Auto-Refresh Timer**: رفرش خودکار قبل از انقضا
- 👁️ **Visibility Change Handler**: refresh هنگام بازگشت به tab
- 🌐 **Online/Offline Handler**: مدیریت وضعیت آنلاین
- 💾 **Persistent State**: نگهداری state در localStorage

**نحوه استفاده:**
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout, refreshAccessToken } = useAuth();
  
  // بررسی authentication
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  // استفاده از user data
  return <div>سلام {user.name}</div>;
}
```

---

### 5. Security Utilities (`src/lib/security.ts`)

توابع امنیتی برای محافظت در برابر حملات رایج.

**ویژگی‌ها:**
- 🛡️ **XSS Prevention**: جلوگیری از حملات XSS
- 🔒 **CSRF Protection**: محافظت در برابر CSRF
- ⏱️ **Rate Limiting**: محدودسازی درخواست‌ها
- ✅ **Input Validation**: اعتبارسنجی ورودی‌ها

**API:**
```typescript
import {
  sanitizeHtml,
  getCsrfToken,
  otpRateLimiter,
  loginRateLimiter,
  validateAndSanitizeInput,
  preventClickjacking,
} from '@/lib/security';

// پاکسازی HTML
const clean = sanitizeHtml(userInput);

// CSRF Token
const token = getCsrfToken();

// Rate Limiting
const canSendOtp = otpRateLimiter.isAllowed(phoneNumber);
const remaining = otpRateLimiter.getRemainingRequests(phoneNumber);

// اعتبارسنجی
const validPhone = validateAndSanitizeInput(phone, 'phone');
```

---

## نحوه استفاده

### مرحله 1: Login

```typescript
import { useVerifyOTP } from '@/hooks/useAuthMutations';
import { useAuth } from '@/contexts/AuthContext';

function LoginForm() {
  const verifyOtpMutation = useVerifyOTP();
  const { login } = useAuth();
  
  const handleVerify = async (phone: string, code: string) => {
    try {
      // تایید OTP و دریافت token ها
      const result = await verifyOtpMutation.mutateAsync({ phone, code });
      
      // token ها به صورت خودکار ذخیره می‌شوند توسط mutation
      // فقط user را login کنید
      login({
        id: result.user.phone,
        name: result.user.full_name || result.user.phone,
        email: result.user.email || '',
        type: result.user.user_role as UserType,
        phone: result.user.phone,
      });
      
      // redirect به dashboard
      router.push('/user');
    } catch (error) {
      console.error('خطا در تایید کد:', error);
    }
  };
  
  return (
    // ... JSX
  );
}
```

### مرحله 2: استفاده از API

```typescript
import apiClient from '@/lib/api';

async function fetchUserData() {
  try {
    // درخواست با Authorization header خودکار
    const response = await apiClient.get('/api/users/me');
    return response.data;
  } catch (error) {
    // خطاها به صورت خودکار مدیریت می‌شوند
    console.error('خطا:', error);
  }
}

// یا با React Query
import { useQuery } from '@tanstack/react-query';

function useUserProfile() {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => apiClient.get('/api/users/me').then(res => res.data),
  });
}
```

### مرحله 3: Logout

```typescript
import { useAuth } from '@/contexts/AuthContext';

function LogoutButton() {
  const { logout } = useAuth();
  
  const handleLogout = () => {
    // پاک کردن token ها و state
    logout();
    
    // redirect به صفحه اصلی
    router.push('/');
  };
  
  return <button onClick={handleLogout}>خروج</button>;
}
```

---

## ویژگی‌های امنیتی

### 1. رمزنگاری Token ها

Token ها با یک لایه رمزنگاری ساده (XOR + Base64) در localStorage ذخیره می‌شوند.

```typescript
// در tokenManager.ts
const encrypted = encryptToken(token);
localStorage.setItem('access_token', encrypted);

// هنگام بازیابی
const encrypted = localStorage.getItem('access_token');
const token = decryptToken(encrypted);
```

**توجه:** این یک لایه امنیتی اضافی است و جایگزین HTTPS نیست.

### 2. Device Fingerprinting

شناسایی دستگاه برای جلوگیری از استفاده token در دستگاه دیگر.

```typescript
// fingerprint بر اساس مشخصات مرورگر
const fingerprint = [
  navigator.userAgent,
  navigator.language,
  screen.colorDepth,
  screen.width + 'x' + screen.height,
  // ...
].join('|');
```

### 3. Rate Limiting

محدودسازی درخواست‌ها برای جلوگیری از حملات Brute Force.

```typescript
// محدودیت OTP: 5 درخواست در 60 ثانیه
const canSend = otpRateLimiter.isAllowed(phoneNumber);

if (!canSend) {
  const resetTime = otpRateLimiter.getResetTime(phoneNumber);
  alert(`لطفاً ${Math.ceil(resetTime / 1000)} ثانیه صبر کنید`);
}
```

### 4. CSRF Protection

محافظت در برابر حملات Cross-Site Request Forgery.

```typescript
// دریافت CSRF token
const csrfToken = getCsrfToken();

// ارسال با درخواست
await apiClient.post('/api/sensitive-action', data, {
  headers: {
    'X-CSRF-Token': csrfToken,
  },
});
```

### 5. XSS Prevention

پاکسازی ورودی‌های کاربر برای جلوگیری از حملات XSS.

```typescript
import { sanitizeHtml } from '@/lib/security';

const userInput = '<script>alert("XSS")</script>';
const clean = sanitizeHtml(userInput);
// نتیجه: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;
```

---

## مثال‌های کاربردی

### مثال 1: ساخت Protected Route

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  if (isLoading) {
    return <div>در حال بارگذاری...</div>;
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  return <div>محتوای محافظت شده</div>;
}
```

### مثال 2: Form با Rate Limiting

```typescript
import { useState } from 'react';
import { useSecurity } from '@/hooks/useSecurity';

function OtpRequestForm() {
  const [phone, setPhone] = useState('');
  const { checkOtpRateLimit } = useSecurity();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // بررسی rate limit
    const { allowed, remaining, resetTime } = checkOtpRateLimit(phone);
    
    if (!allowed) {
      const seconds = Math.ceil(resetTime / 1000);
      alert(`لطفاً ${seconds} ثانیه صبر کنید`);
      return;
    }
    
    // ارسال درخواست OTP
    await requestOTP(phone);
    
    alert(`${remaining - 1} درخواست باقیمانده`);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="شماره موبایل"
      />
      <button type="submit">ارسال کد</button>
    </form>
  );
}
```

### مثال 3: دریافت داده با Auto-Refresh

```typescript
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';

function UserProfile() {
  // درخواست به صورت خودکار refresh می‌شود اگر token منقضی شده باشد
  const { data, error, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await apiClient.get('/api/users/me');
      return response.data;
    },
    // refetch هنگام focus
    refetchOnWindowFocus: true,
    // retry در صورت خطا
    retry: 2,
  });
  
  if (isLoading) return <div>بارگذاری...</div>;
  if (error) return <div>خطا در دریافت اطلاعات</div>;
  
  return (
    <div>
      <h1>{data.full_name}</h1>
      <p>{data.email}</p>
    </div>
  );
}
```

---

## بهترین روش‌ها (Best Practices)

### ✅ انجام دهید:

1. **همیشه از `apiClient` استفاده کنید** نه `fetch` یا `axios` مستقیم
2. **token ها را هرگز در console.log قرار ندهید**
3. **از rate limiting برای عملیات حساس استفاده کنید**
4. **input های کاربر را پاکسازی کنید**
5. **از HTTPS در production استفاده کنید**
6. **logout کنید وقتی session منقضی می‌شود**

### ❌ انجام ندهید:

1. **token ها را در query parameters قرار ندهید**
2. **token ها را به third-party services نفرستید**
3. **از setTimeout/setInterval برای refresh استفاده نکنید** (AuthContext این کار را انجام می‌دهد)
4. **refresh token را در درخواست‌های معمولی نفرستید**
5. **token ها را در sessionStorage یا cookies بدون secure flag ذخیره نکنید**

---

## عیب‌یابی

### مشکل: Token به سرعت expire می‌شود

**راه‌حل:**
```typescript
// بررسی تنظیمات backend - معمولاً access token باید 15-60 دقیقه باشد
// بررسی زمان سیستم - اختلاف زمان می‌تواند باعث مشکل شود
```

### مشکل: Refresh loop (رفرش بی‌نهایت)

**راه‌حل:**
```typescript
// بررسی کنید که refresh token معتبر است
const isValid = isRefreshTokenValid(refreshToken);

// بررسی console برای خطاهای backend
// اطمینان حاصل کنید که endpoint رفرش درست کار می‌کند
```

### مشکل: 401 errors مداوم

**راه‌حل:**
```typescript
// پاک کردن تمام token ها
clearTokens();

// logout و login مجدد
logout();

// بررسی network tab برای بررسی Authorization header
```

### مشکل: Token در localStorage نیست

**راه‌حل:**
```typescript
// بررسی کنید که saveTokens فراخوانی شده است
saveTokens(accessToken, refreshToken);

// بررسی کنید که localStorage پر نشده است
// بررسی کنید که incognito mode یا privacy mode فعال نیست
```

---

## نکات امنیتی مهم

### 1. HTTPS اجباری است

در production، **حتماً** از HTTPS استفاده کنید. بدون HTTPS، تمام token ها در معرض خطر هستند.

### 2. Secure Backend

اطمینان حاصل کنید که backend:
- JWT token ها را به درستی sign می‌کند
- از secret key قوی استفاده می‌کند
- expiry time های مناسب تنظیم شده است
- refresh token ها را در database ذخیره می‌کند
- revocation mechanism دارد

### 3. Production Settings

```typescript
// در production این تنظیمات را فعال کنید:

// 1. Disable console logs
import { secureConsole } from '@/lib/security';
secureConsole();

// 2. استفاده از Content Security Policy
// در next.config.js:
const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
];
```

### 4. Monitoring و Logging

```typescript
// لاگ کردن رویدادهای امنیتی (در backend)
- Login attempts
- Token refresh requests
- Failed authentication
- Rate limit violations
```

---

## تماس و پشتیبانی

برای سوالات یا مشکلات امنیتی، لطفاً به موارد زیر مراجعه کنید:

- 📧 ایمیل تیم توسعه
- 📚 مستندات کامل API
- 🔒 گزارش مشکلات امنیتی (Security Issues)

---

## تاریخچه تغییرات

### نسخه 1.0.0 (تاریخ فعلی)

- ✅ پیاده‌سازی TokenRefreshManager با queue و lock
- ✅ بهبود tokenManager با encryption
- ✅ بازنویسی api.ts با interceptor های امنیتی
- ✅ اضافه کردن auto-refresh timer به AuthContext
- ✅ پیاده‌سازی security utilities
- ✅ اضافه کردن rate limiting
- ✅ محافظت در برابر XSS و CSRF

---

**این سیستم طراحی شده تا بالاترین سطح امنیت را برای مدیریت token ها فراهم کند. لطفاً تمام دستورالعمل‌های امنیتی را رعایت کنید.**

🔐 **امنیت در اولویت است - Security First!**

