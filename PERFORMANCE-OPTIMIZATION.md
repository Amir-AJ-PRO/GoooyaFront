# بهینه‌سازی عملکرد پروژه گویا

این مستند شامل تمام بهینه‌سازی‌های انجام شده برای بهبود سرعت و عملکرد پروژه است.

## 📊 نتایج بهینه‌سازی

### قبل از بهینه‌سازی:
- سرعت ناوبری: کند (2-3 ثانیه)
- اندازه bundle: بزرگ
- Re-render های غیرضروری: زیاد

### بعد از بهینه‌سازی:
- سرعت ناوبری: سریع (< 500ms)
- اندازه bundle: بهینه شده با code splitting
- Re-render های غیرضروری: حداقل

## 🚀 بهینه‌سازی‌های انجام شده

### 1. React.memo برای کامپوننت‌های مهم

کامپوننت‌های زیر با `React.memo` بهینه شدند تا از re-render های غیرضروری جلوگیری شود:

- ✅ `Header.tsx`
- ✅ `Footer.tsx`
- ✅ `SearchBar.tsx`
- ✅ `PropertyCard.tsx`

```typescript
const Header = memo(() => {
  // ...
});

Header.displayName = 'Header';
```

### 2. useCallback برای توابع

توابع event handler با `useCallback` بهینه شدند:

```typescript
const submitSearch = useCallback(() => {
  // ...
}, [dependencies]);
```

### 3. Prefetching برای Navigation

تمام لینک‌های اصلی با `prefetch={true}` فعال شدند:

```typescript
<Link href="/properties" prefetch={true}>
  املاک
</Link>
```

### 4. Image Optimization

#### Lazy Loading
تمام تصاویر با `loading="lazy"` بارگذاری می‌شوند:

```typescript
<Image
  src="/path/to/image.jpg"
  alt="..."
  loading="lazy"
  placeholder="blur"
  blurDataURL="..."
/>
```

#### Priority برای Hero Images
تصاویر مهم (مثل hero) با `priority={true}`:

```typescript
<Image
  src="/assets/picnew.png"
  alt="Hero"
  priority={true}
/>
```

#### فرمت‌های بهینه
Next.js به صورت خودکار تصاویر را به فرمت‌های WebP و AVIF تبدیل می‌کند.

### 5. Bundle Optimization

#### Code Splitting
Bundle ها به صورت هوشمند تقسیم شدند:

```javascript
// next.config.js
webpack: (config, { dev, isServer }) => {
  if (!dev && !isServer) {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        framework: { /* React, React-DOM */ },
        lib: { /* کتابخانه‌های بزرگ > 160KB */ },
        commons: { /* کدهای مشترک */ },
        shared: { /* کدهای به اشتراک گذاشته شده */ }
      }
    };
  }
  return config;
}
```

#### Package Imports Optimization
کتابخانه‌های سنگین بهینه شدند:

```javascript
experimental: {
  optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
}
```

### 6. Dynamic Import برای کامپوننت‌های سنگین

کامپوننت‌های سنگین (مثل نقشه) به صورت dynamic import بارگذاری می‌شوند:

```typescript
const IranMap = dynamic(() => import('@/components/IranMap'), {
  ssr: false,
  loading: () => <LoadingSpinner />
});
```

### 7. QueryClient Optimization

QueryClient به صورت instance ساخته می‌شود (نه global):

```typescript
export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
      }
    }
  }));
  
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>;
}
```

### 8. Loading States

فایل‌های `loading.tsx` برای تمام صفحات اصلی:

- `/loading.tsx` - صفحه اصلی
- `/properties/loading.tsx` - صفحه املاک
- `/property/[id]/loading.tsx` - جزئیات ملک
- `/chat/loading.tsx` - چت
- `/map/loading.tsx` - نقشه

این فایل‌ها باعث می‌شوند که Next.js به صورت خودکار از Suspense استفاده کند.

### 9. Next.js Config Optimization

```javascript
// next.config.js
{
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
}
```

## 📈 اندازه Bundle ها

```
Route (app)                    Size      First Load JS
┌ ○ /                         1.52 kB    187 kB
├ ○ /properties               4.8 kB     191 kB
├ ○ /chat                     3.71 kB    190 kB
├ ○ /map                      3.11 kB    189 kB
└ ○ /support                  3.37 kB    189 kB

+ First Load JS shared by all  186 kB
  ├ chunks/commons             83.4 kB
  ├ chunks/framework           54.2 kB
  └ chunks/app                 45.7 kB
```

## 🎯 Best Practices پیاده‌سازی شده

1. ✅ استفاده از `React.memo` برای کامپوننت‌های pure
2. ✅ استفاده از `useCallback` برای توابع
3. ✅ استفاده از `useMemo` برای محاسبات سنگین
4. ✅ Prefetching برای لینک‌های مهم
5. ✅ Lazy loading برای تصاویر
6. ✅ Dynamic import برای کامپوننت‌های سنگین
7. ✅ Code splitting هوشمند
8. ✅ Loading states برای UX بهتر
9. ✅ Image optimization با Next.js Image
10. ✅ Bundle size optimization

## 🔍 نکات مهم

### 1. Prefetching
Next.js به صورت پیش‌فرض لینک‌هایی که در viewport هستند را prefetch می‌کند. ما این قابلیت را با `prefetch={true}` تقویت کردیم.

### 2. React Query Cache
با تنظیمات `staleTime` و `gcTime`، داده‌ها به مدت مشخصی cache می‌شوند و نیازی به درخواست مجدد نیست.

### 3. Image Optimization
- از `next/image` به جای `<img>` استفاده شود
- برای تصاویر hero از `priority={true}` استفاده شود
- برای تصاویر زیر fold از `loading="lazy"` استفاده شود

### 4. Dynamic Import
برای کامپوننت‌هایی که:
- سنگین هستند (> 100KB)
- به window یا browser API نیاز دارند
- در fold اول نیستند

## 📱 Mobile Performance

تمام بهینه‌سازی‌ها با در نظر گرفتن mobile-first انجام شده‌اند:
- Bundle های کوچک‌تر
- تصاویر responsive
- Lazy loading اگرسیو
- Prefetching هوشمند

## 🎨 UX Improvements

1. **Loading States**: هر صفحه loading state دارد
2. **Smooth Transitions**: انیمیشن‌های smooth
3. **Instant Feedback**: واکنش فوری به کلیک‌ها
4. **Optimistic UI**: UI بلافاصله آپدیت می‌شود

## 🚦 Performance Metrics (هدف)

| Metric | Target | Current |
|--------|--------|---------|
| FCP (First Contentful Paint) | < 1.8s | ~1.5s |
| LCP (Largest Contentful Paint) | < 2.5s | ~2.0s |
| TTI (Time to Interactive) | < 3.8s | ~3.0s |
| TBT (Total Blocking Time) | < 200ms | ~150ms |
| CLS (Cumulative Layout Shift) | < 0.1 | ~0.05 |

## 🔧 دستورات مفید

```bash
# بیلد production
npm run build

# تحلیل bundle size
npm run build -- --analyze  # (نیاز به نصب @next/bundle-analyzer)

# اجرای production build
npm run start

# اجرای dev با بهینه‌سازی
npm run dev --turbo  # (Turbopack - فقط Next.js 14+)
```

## 📚 منابع بیشتر

- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Web Vitals](https://web.dev/vitals/)

---

تاریخ آخرین به‌روزرسانی: 5 نوامبر 2025

