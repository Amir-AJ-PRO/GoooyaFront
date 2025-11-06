# بهبود عملکرد Next.js

## مشکل اولیه
بار اول که روی دکمه‌ها کلیک می‌شد تا صفحه عوض شود، بسیار کند عمل می‌کرد.

## تغییرات انجام شده

### 1. **انتقال Header و Footer به Layout**
- قبلاً هر صفحه مجبور بود Header و Footer را دوباره import و render کند
- حالا این کامپوننت‌ها یک‌بار در `layout.tsx` لود می‌شوند و در تمام صفحات استفاده می‌شوند
- این باعث می‌شود که Next.js نیازی به re-render کردن این کامپوننت‌ها نداشته باشد

**قبل:**
```tsx
// هر صفحه
<Header />
{children}
<Footer />
```

**بعد:**
```tsx
// فقط در layout.tsx
<Header />
<main>{children}</main>
<Footer />
```

### 2. **بهینه‌سازی next.config.ts**
اضافه شده:
- `reactStrictMode: true` - برای شناسایی مشکلات احتمالی
- `swcMinify: true` - فشرده‌سازی بهتر کد
- `optimizePackageImports` - بهینه‌سازی import های پکیج‌های بزرگ مثل Radix UI و Lucide
- `compiler.removeConsole` - حذف console.log در production
- تنظیمات بهینه برای تصاویر

### 3. **استفاده صحیح از prefetch**
- Link های Next.js به صورت پیش‌فرض prefetch دارند
- با `prefetch={true}` صریح در Header، صفحات مهم از قبل لود می‌شوند

### 4. **Dynamic Imports**
- کامپوننت‌های سنگین مثل IranMap از قبل با `dynamic import` لود می‌شدند که خوب بود
- Loading states برای بهبود تجربه کاربر

## نتیجه

✅ **بار اول کلیک:** حالا سریع‌تر است چون:
- Header و Footer دیگر دوباره render نمی‌شوند
- Code splitting بهتر انجام می‌شود
- Prefetching صفحات را از قبل آماده می‌کند

✅ **بارهای بعدی:** خیلی سریع‌تر هستند چون Next.js از cache استفاده می‌کند

## تست کردن

1. سرور را ریستارت کنید:
```bash
npm run dev
```

2. بار اول صفحه را باز کنید و روی لینک‌های مختلف کلیک کنید
3. باید متوجه شوید که navigation خیلی سریع‌تر شده است

## نکات مهم

- اگر صفحه‌ای خیلی سنگین است (مثل نقشه)، ممکن است بار اول کمی کندتر باشد
- این طبیعی است چون Next.js باید JavaScript صفحه را download کند
- بارهای بعدی از cache استفاده می‌کنند و فوری هستند

## Optimization های بیشتر (اختیاری)

اگر هنوز کندی احساس می‌کنید:

1. **استفاده از React.lazy برای کامپوننت‌های بزرگ**
2. **کاهش سایز bundle با tree shaking**
3. **استفاده از Image Optimization برای تصاویر**
4. **Pre-rendering صفحات استاتیک با SSG**
5. **استفاده از Service Worker برای caching**

## سوالات متداول

**Q: چرا بار اول هنوز کمی کند است؟**
A: Next.js باید JavaScript صفحه جدید را download کند. این فقط بار اول است.

**Q: آیا می‌توانم prefetch را disable کنم؟**
A: بله، ولی توصیه نمی‌شود. با prefetch، navigation سریع‌تر است.

**Q: آیا این تغییرات روی SEO تاثیر دارد؟**
A: خیر، بلکه بهبود می‌دهد چون سرعت صفحه یکی از عوامل SEO است.

