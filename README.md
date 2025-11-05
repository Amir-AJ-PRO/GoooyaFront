# گویا - Next.js

این پروژه نسخه Next.js پلتفرم املاک گویا است که از React + Vite به Next.js مهاجرت یافته است.

## 🚀 تغییرات اصلی

### 1. **Framework**
- ❌ React + Vite
- ✅ Next.js 15 + App Router

### 2. **Routing**
- ❌ React Router DOM
- ✅ Next.js App Router با File-based Routing

### 3. **Components**
- ✅ تمام UI Components از shadcn/ui حفظ شده
- ✅ Header, Footer, PropertyCard به Next.js تبدیل شدند
- ✅ Context Providers به Client Components تبدیل شدند

### 4. **Images**
- ❌ `<img>` tags
- ✅ Next.js `<Image>` component با بهینه‌سازی خودکار

### 5. **Links**
- ❌ React Router `<Link to="...">`
- ✅ Next.js `<Link href="...">`

## 📁 ساختار پروژه

```
gooya-nextjs/
├── public/
│   └── assets/          # تصاویر و فایل‌های استاتیک
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── layout.tsx  # Layout اصلی
│   │   ├── page.tsx    # صفحه اصلی (Home)
│   │   ├── about/
│   │   ├── properties/
│   │   ├── property/[id]/  # Dynamic route
│   │   ├── login/
│   │   ├── map/
│   │   ├── chat/
│   │   ├── support/
│   │   ├── admin/
│   │   └── engineering/
│   ├── components/     # React Components
│   │   ├── Providers.tsx  # Context Providers Wrapper
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ui/         # shadcn/ui components
│   ├── contexts/       # React Contexts (Client Components)
│   │   ├── AuthContext.tsx
│   │   └── ChatContext.tsx
│   ├── hooks/          # Custom Hooks
│   ├── lib/            # Utility functions
│   └── services/       # API Services
├── tailwind.config.ts
├── next.config.js
└── package.json
```

## 🛠️ نصب و اجرا

### نصب Dependencies

```bash
cd gooya-nextjs
npm install
```

### اجرای Development Server

```bash
npm run dev
```

پروژه در آدرس `http://localhost:3000` اجرا می‌شود.

### Build برای Production

```bash
npm run build
npm start
```

## 🔧 تنظیمات

### Environment Variables

فایل `.env.local` ایجاد کنید:

```env
API_BASE=http://127.0.0.1:9000
NEXT_PUBLIC_API_BASE=http://127.0.0.1:9000
```

### Next.js Config

تنظیمات `next.config.js` شامل:
- Image optimization برای domain های API
- Environment variables

## 📝 نکات مهم

### Client Components

Components زیر باید `'use client'` داشته باشند:
- Components که از useState, useEffect استفاده می‌کنند
- Components که از Context استفاده می‌کنند
- Event handlers (onClick, onChange, ...)
- Browser APIs (localStorage, window, ...)

### Server Components (پیش‌فرض)

Components زیر می‌توانند Server Component باشند:
- Static content
- Data fetching از API
- Components بدون state

### Dynamic Routes

```
/property/[id]/page.tsx → /property/123
```

Parameters از طریق props دریافت می‌شود:

```typescript
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  // ...
}
```

## 🔄 تفاوت‌های کلیدی با React Router

| React Router | Next.js |
|-------------|---------|
| `<Link to="/about">` | `<Link href="/about">` |
| `useNavigate()` | `useRouter()` from `next/navigation` |
| `useLocation()` | `usePathname()` from `next/navigation` |
| `<Routes><Route path="...">` | File-based routing in `/app` |

## 🎨 Styling

- ✅ Tailwind CSS
- ✅ CSS Variables for theming
- ✅ Vazirmatn Font برای فارسی
- ✅ RTL Support

## 📦 Dependencies اصلی

```json
{
  "next": "^15.0.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "@tanstack/react-query": "^5.90.5",
  "axios": "^1.12.2",
  "tailwindcss": "^3.4.17"
}
```

## 🚧 کارهای باقی‌مانده

برای تکمیل کامل پروژه، موارد زیر نیاز به توجه دارند:

### 1. API Integration
- [ ] تست API calls در SSR environment
- [ ] اضافه کردن Error boundaries
- [ ] اضافه کردن Loading states

### 2. SEO
- [ ] اضافه کردن Metadata به هر صفحه
- [ ] اضافه کردن Open Graph tags
- [ ] اضافه کردن JSON-LD structured data

### 3. Performance
- [ ] اضافه کردن Image blur placeholders
- [ ] Lazy loading برای components سنگین
- [ ] Code splitting optimization

### 4. Components نیمه‌کاره
صفحات زیر فقط placeholder دارند و نیاز به تکمیل دارند:
- [ ] Map page (نقشه تعاملی)
- [ ] Chat page (چت AI)
- [ ] Support page (سیستم تیکتینگ)
- [ ] Admin Dashboard (پنل مدیریت)
- [ ] Engineering Services page

### 5. Authentication
- [ ] اتصال به Backend API واقعی
- [ ] Middleware برای Protected routes
- [ ] Token refresh logic

## 📚 منابع

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

## 🤝 مشارکت

برای تکمیل بخش‌های باقی‌مانده:

1. یک feature branch ایجاد کنید
2. تغییرات را commit کنید
3. Pull Request ارسال کنید

## 📄 License

همان لایسنس پروژه اصلی

---

**نکته:** این پروژه در حال توسعه است. برای گزارش مشکلات یا پیشنهادات، Issue ایجاد کنید.
