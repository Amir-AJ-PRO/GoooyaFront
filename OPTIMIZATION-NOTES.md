# نکات بهینه‌سازی Client/Server Components

## ⚠️ مشکلات فعلی که باید حل شوند

### صفحاتی که **کامل** `'use client'` هستند (نباید باشند):

این صفحات باید به Server Component تبدیل شوند و فقط بخش‌های تعاملی به Client Component جدا شوند:

#### 1. `/app/engineering/page.tsx` ❌
**مشکل**: کل صفحه client است

**راه حل**:
- بخش Hero و محتوای ثابت → Server Component
- فرم درخواست خدمات → `EngineeringFormClient.tsx`
- دکمه‌های انتخاب سرویس → `ServiceSelectorClient.tsx`

#### 2. `/app/chat/page.tsx` ❌
**مشکل**: کل صفحه client است

**راه حل**:
- Layout اصلی صفحه → Server Component  
- کامپوننت Chat با state → `ChatClientWrapper.tsx`

#### 3. `/app/support/page.tsx` ❌
**مشکل**: کل صفحه client است

**راه حل**:
- ساختار اصلی صفحه → Server Component
- فرم تیکت و لیست تیکت‌ها → `SupportClientWrapper.tsx`

#### 4. `/app/admin/page.tsx` ❌
**مشکل**: کل صفحه client است (فقط route guard)

**راه حل**:
- استفاده از middleware برای auth check
- Dashboard components → Client Components جداگانه

#### 5. `/app/login/page.tsx` ❌
**مشکل**: کل صفحه client است

**راه حل**:
- Layout اصلی → Server Component
- فرم login → `LoginFormClient.tsx`

---

## ✅ بهینه‌سازی‌های انجام شده

### کامپوننت‌های بهینه شده:

1. **PropertyCard** ✅
   - ❌ قبلاً: `'use client'`
   - ✅ حالا: Server Component (هیچ state ندارد)

2. **Footer** ✅
   - ❌ قبلاً: `'use client'` برای کل footer
   - ✅ حالا: Server Component + `FooterDevLogin` جداگانه

3. **Header** ✅ (درست است)
   - استفاده از `useState` و `useAuth`
   - نیاز به Client Component دارد

4. **Providers** ✅ (درست است)
   - Context Providers باید Client باشند

---

## 📋 اولویت‌بندی بهینه‌سازی

### 🔴 اولویت بالا (تاثیر زیاد):
1. `/app/engineering/page.tsx` - صفحه سنگین با محتوای ثابت زیاد
2. `/app/chat/page.tsx` - صفحه پرکاربرد
3. `/app/properties/page.tsx` - لیست املاک (قبلاً بهینه شده ✅)

### 🟡 اولویت متوسط:
4. `/app/support/page.tsx`
5. `/app/admin/page.tsx`  

### 🟢 اولویت پایین:
6. `/app/login/page.tsx` - صفحه کوچک

---

## 🎯 قانون کلی:

### ✅ باید Client Component باشد اگر:
- از `useState`, `useEffect`, یا hooks دیگر استفاده می‌کند
- Event handlers دارد (`onClick`, `onChange`, ...)
- از Context استفاده می‌کند (`useAuth`, `useChat`, ...)
- به Browser APIs نیاز دارد (`localStorage`, `window`, ...)

### ❌ نباید Client Component باشد اگر:
- فقط props می‌گیرد و render می‌کند
- محتوای استاتیک است
- داده‌ها از server می‌آید
- هیچ تعامل کاربری ندارد

---

## 💡 نمونه الگوی صحیح:

```tsx
// ❌ اشتباه: کل صفحه client
'use client';

export default function Page() {
  const [state, setState] = useState();
  
  return (
    <>
      <section>محتوای ثابت</section>
      <section>فرم با state</section>
    </>
  );
}
```

```tsx
// ✅ درست: Server Component + Client wrapper
// page.tsx (Server Component)
import FormClient from './FormClient';

export default function Page() {
  return (
    <>
      <section>محتوای ثابت</section>
      <FormClient />
    </>
  );
}

// FormClient.tsx
'use client';

export default function FormClient() {
  const [state, setState] = useState();
  return <form>...</form>;
}
```

---

## 📊 تاثیر بهینه‌سازی:

### قبل از بهینه‌سازی:
- JavaScript bundle بزرگ
- Hydration کامل صفحه
- Time to Interactive بالا

### بعد از بهینه‌سازی:
- ✅ JavaScript bundle کوچکتر (فقط بخش‌های تعاملی)
- ✅ Hydration جزئی (فقط Client Components)
- ✅ Time to Interactive کمتر
- ✅ SEO بهتر (محتوای server-rendered)
- ✅ Performance بهتر در دستگاه‌های ضعیف

---

## 🔧 مراحل بعدی:

1. بهینه‌سازی `/app/engineering/page.tsx`
2. بهینه‌سازی `/app/chat/page.tsx`
3. بررسی سایر صفحات و components
4. تست performance با Lighthouse
5. مقایسه bundle size قبل و بعد

---

**تاریخ:** آبان ۱۴۰۴  
**وضعیت:** در حال انجام  
**Progress:** 3/8 صفحه بهینه شده

