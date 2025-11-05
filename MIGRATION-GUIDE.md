# راهنمای مهاجرت از React + Vite به Next.js

این راهنما مراحل دقیق مهاجرت پروژه گویا از React + Vite به Next.js را شرح می‌دهد.

## ✅ کارهای انجام شده

### 1. Setup اولیه
- [x] ایجاد پروژه Next.js با `create-next-app`
- [x] نصب تمام dependencies مورد نیاز
- [x] تنظیم `tailwind.config.ts`
- [x] تنظیم `next.config.js`
- [x] کپی `globals.css` و CSS variables

### 2. Structure
- [x] ایجاد `src/app/layout.tsx` (Root Layout)
- [x] ایجاد `src/components/Providers.tsx`
- [x] کپی تمام فولدرهای `lib/`, `hooks/`, `types/`, `services/`, `data/`
- [x] کپی تمام `components/` و `components/ui/`

### 3. Context Providers
- [x] اضافه کردن `'use client'` به `AuthContext.tsx`
- [x] اضافه کردن `'use client'` به `ChatContext.tsx`
- [x] ایجاد Providers wrapper component

### 4. Components
- [x] تبدیل `Header.tsx` به Next.js:
  - `import { Link } from 'react-router-dom'` → `import Link from 'next/link'`
  - `useLocation()` → `usePathname()`
  - `to=` → `href=`
  - اضافه کردن `'use client'`
  
- [x] تبدیل `Footer.tsx` به Next.js
- [x] تبدیل `PropertyCard.tsx` به Next.js (با Next Image)
- [x] تبدیل `SearchBar.tsx` به Client Component

### 5. Pages (App Router)
- [x] `/` → `src/app/page.tsx`
- [x] `/about` → `src/app/about/page.tsx`
- [x] `/properties` → `src/app/properties/page.tsx`
- [x] `/login` → `src/app/login/page.tsx`
- [x] `/property/:id` → `src/app/property/[id]/page.tsx`
- [x] `/map` → `src/app/map/page.tsx`
- [x] `/chat` → `src/app/chat/page.tsx`
- [x] `/support` → `src/app/support/page.tsx`
- [x] `/admin` → `src/app/admin/page.tsx`
- [x] `/engineering` → `src/app/engineering/page.tsx`

### 6. Assets
- [x] انتقال تصاویر از `src/assets/` به `public/assets/`
- [x] تبدیل `import image from '@/assets/...'` به `/assets/...`
- [x] استفاده از Next.js Image component

### 7. Configuration
- [x] تنظیم `components.json` برای shadcn/ui
- [x] تنظیم Image domains در `next.config.js`
- [x] تنظیم Environment variables

## 🔄 تغییرات کلیدی انجام شده

### تغییرات Import

```typescript
// قبل
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

// بعد
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
```

### تغییرات Component

```typescript
// قبل
import heroImage from "@/assets/hero.jpg";
<img src={heroImage} alt="..." />

// بعد
import Image from "next/image";
<Image src="/assets/hero.jpg" alt="..." width={800} height={600} />
```

### تغییرات Routing

```typescript
// قبل
<Link to="/about">About</Link>
const navigate = useNavigate();
navigate('/properties');

// بعد
<Link href="/about">About</Link>
const router = useRouter();
router.push('/properties');
```

### Dynamic Routes

```typescript
// قبل: src/pages/PropertyDetails.tsx
// Route: /property/:id

// بعد: src/app/property/[id]/page.tsx
export default function PropertyDetail({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
}
```

## 🔍 نکات مهم مهاجرت

### 1. Client Components vs Server Components

**باید `'use client'` داشته باشند:**
- Components با useState, useEffect
- Components با event handlers
- Components که از Context استفاده می‌کنند
- Components که از browser APIs استفاده می‌کنند

```typescript
'use client';

import { useState } from 'react';

export default function MyComponent() {
  const [state, setState] = useState();
  // ...
}
```

### 2. localStorage و SSR

localStorage در server-side rendering کار نمی‌کند. باید چک کنید:

```typescript
// قبل
const token = localStorage.getItem('token');

// بعد
const token = typeof window !== 'undefined' 
  ? localStorage.getItem('token') 
  : null;
```

یا در useEffect استفاده کنید که فقط client-side اجرا می‌شود.

### 3. Image Optimization

```typescript
// استفاده از Next Image
<Image
  src="/assets/property.jpg"
  alt="Property"
  width={600}
  height={400}
  priority // برای images بالای صفحه
/>

// برای external images، در next.config.js اضافه کنید:
images: {
  remotePatterns: [{
    protocol: 'http',
    hostname: 'api.example.com'
  }]
}
```

### 4. Metadata و SEO

در هر page می‌توانید metadata اضافه کنید:

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'املاک - گویا',
  description: 'بهترین املاک در سراسر کشور',
};

export default function Properties() {
  // ...
}
```

### 5. API Calls

برای API calls می‌توانید:
- در Client Components: همان axios/fetch قبلی
- در Server Components: fetch با caching

```typescript
// Server Component (پیش‌فرض)
async function getData() {
  const res = await fetch('http://api.example.com/data', {
    next: { revalidate: 3600 } // cache for 1 hour
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{/* ... */}</div>;
}
```

## 📋 Checklist برای تکمیل مهاجرت

### کارهای باقی‌مانده

#### UI Components
بسیاری از UI components در `src/components/ui/` نیاز به `'use client'` دارند:

```bash
# اضافه کردن 'use client' به ابتدای فایل‌های زیر:
- [ ] accordion.tsx
- [ ] alert-dialog.tsx
- [ ] button.tsx
- [ ] calendar.tsx
- [ ] checkbox.tsx
- [ ] command.tsx
- [ ] dialog.tsx
- [ ] dropdown-menu.tsx
- [ ] form.tsx
- [ ] input.tsx
- [ ] select.tsx
- [ ] tabs.tsx
- [ ] toast.tsx
- و بقیه components که از React hooks استفاده می‌کنند
```

#### API Integration
- [ ] تست کردن API calls در محیط SSR
- [ ] اضافه کردن error handling مناسب
- [ ] اضافه کردن loading states

#### Authentication
- [ ] بازنگری auth flow برای SSR
- [ ] ایجاد middleware برای protected routes
- [ ] Token management در SSR

#### Pages نیمه‌کاره
- [ ] Map page: اضافه کردن Leaflet map (client-side)
- [ ] Chat page: پیاده‌سازی رابط چت
- [ ] Support page: سیستم تیکتینگ
- [ ] Admin Dashboard: پنل کامل مدیریت
- [ ] Engineering Services: صفحه خدمات

## 🚀 اجرا و تست

### Development

```bash
cd gooya-nextjs
npm install
npm run dev
```

### Build

```bash
npm run build
npm start
```

### مشکلات رایج

#### 1. Error: useRouter/usePathname must be used in Client Component

**راه حل:** اضافه کردن `'use client'` به ابتدای component

#### 2. Error: localStorage is not defined

**راه حل:** چک کردن `typeof window !== 'undefined'` یا استفاده در useEffect

#### 3. Error: Image with src ... must use "width" and "height" properties

**راه حل:** اضافه کردن width و height به Image component یا استفاده از `fill` prop

#### 4. Warning: Cannot update a component while rendering a different component

**راه حل:** استفاده از useEffect برای side effects

## 📚 منابع مفید

- [Next.js Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Client and Server Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Routing](https://nextjs.org/docs/app/building-your-application/routing)

---

## 🎯 نتیجه

مهاجرت اصلی انجام شده و پروژه آماده اجرا است! 

برای تکمیل:
1. تست کنید: `npm run dev`
2. مشکلات را یادداشت کنید
3. به تدریج components نیمه‌کاره را تکمیل کنید
4. SEO و Performance را بهینه کنید

موفق باشید! 🚀

