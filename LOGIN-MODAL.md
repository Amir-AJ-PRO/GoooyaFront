# Modal ورود و ثبت‌نام 🎭

## تغییرات انجام شده

### قبل ❌
- کلیک روی "ورود / ثبت نام" → Redirect به صفحه `/login`
- تجربه کاربری با انقطاع
- از بین رفتن scroll position

### بعد ✅
- کلیک روی "ورود / ثبت نام" → باز شدن Modal
- بدون Redirect
- UX روان و مدرن
- صفحه `/login` هنوز برای دسترسی مستقیم موجود است

## فایل‌های ایجاد شده

### 1. `LoginModal.tsx`
کامپوننت Modal برای ورود و ثبت‌نام:

```typescript
<LoginModal 
  open={loginModalOpen} 
  onOpenChange={setLoginModalOpen} 
/>
```

**ویژگی‌ها:**
- ✅ دو مرحله: شماره تلفن + OTP
- ✅ انتخاب نوع کاربر (عادی/مشاور)
- ✅ تایمر برای ارسال مجدد OTP
- ✅ اعتبارسنجی شماره تلفن ایرانی
- ✅ Auto-reset وقتی Modal بسته می‌شه
- ✅ Responsive و زیبا
- ✅ RTL Support
- ✅ Toast notifications

## نحوه کار

### Desktop
```
Header → دکمه "ورود / ثبت نام" → onClick → setLoginModalOpen(true)
```

### Mobile  
```
Header → Menu → دکمه "ورود / ثبت نام" → onClick → 
  setMobileMenuOpen(false) + setLoginModalOpen(true)
```

## State Management

```typescript
const [loginModalOpen, setLoginModalOpen] = useState(false);
```

- `true`: Modal باز است
- `false`: Modal بسته است

## Integration با Header

**قبل:**
```tsx
<Link href="/login">
  <Button>ورود / ثبت نام</Button>
</Link>
```

**بعد:**
```tsx
<Button onClick={() => setLoginModalOpen(true)}>
  ورود / ثبت نام
</Button>

<LoginModal 
  open={loginModalOpen} 
  onOpenChange={setLoginModalOpen} 
/>
```

## مزایا

### 1. تجربه کاربری بهتر
- 🚀 بدون refresh صفحه
- 🎯 بدون redirect
- 💨 سریع‌تر
- 🎨 مدرن و زیبا

### 2. UX Improvements
- Modal به صورت smooth باز/بسته می‌شه
- Backdrop برای focus بهتر
- ESC key برای بستن
- Click outside برای بستن
- State reset خودکار

### 3. Performance
- Component lazy load می‌شه
- فقط وقتی باز می‌شه render می‌شه
- کد بهینه‌تر

## Component Structure

```
LoginModal
├── Dialog (shadcn/ui)
│   ├── DialogContent
│   │   ├── DialogHeader
│   │   │   ├── Logo
│   │   │   ├── DialogTitle
│   │   │   └── DialogDescription
│   │   └── Form
│   │       ├── Phone Step
│   │       │   ├── Phone Input
│   │       │   ├── User Type Select
│   │       │   └── Submit Button
│   │       └── OTP Step
│   │           ├── OTP Input
│   │           ├── Verify Button
│   │           ├── Resend Button
│   │           └── Back Button
```

## Props

### LoginModal

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `open` | `boolean` | ✅ | وضعیت باز/بسته Modal |
| `onOpenChange` | `(open: boolean) => void` | ✅ | Callback برای تغییر وضعیت |

## مثال استفاده

```tsx
'use client';

import { useState } from 'react';
import LoginModal from '@/components/LoginModal';
import { Button } from '@/components/ui/button';

export default function MyComponent() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setLoginModalOpen(true)}>
        ورود
      </Button>

      <LoginModal 
        open={loginModalOpen} 
        onOpenChange={setLoginModalOpen} 
      />
    </>
  );
}
```

## Features

### ✅ Validation
- شماره تلفن ایرانی
- کد OTP 6 رقمی
- فیلدهای الزامی

### ✅ Security
- OTP based authentication
- Phone normalization
- Persian to English digits conversion

### ✅ UX
- Loading states
- Error handling
- Success notifications
- Auto-focus on inputs
- Countdown timer
- Back navigation

### ✅ Responsive
- Desktop optimized
- Mobile friendly
- Touch optimized

## صفحه `/login`

صفحه `/login` هنوز موجود است برای:
- 🔗 Direct links
- 📱 Deep linking
- 🔍 SEO
- 📑 Bookmarks

کاربر می‌تونه هم از Modal و هم از صفحه مستقیم استفاده کنه.

## تست

برای تست Modal:

1. پروژه رو اجرا کن: `npm run dev`
2. به هر صفحه‌ای برو
3. روی "ورود / ثبت نام" کلیک کن
4. Modal باید باز بشه (بدون redirect)
5. فرم رو پر کن و تست کن

---

✨ **ایجاد شده در:** 5 نوامبر 2025  
🎨 **UI Framework:** shadcn/ui Dialog  
⚡ **Performance:** Optimized with lazy loading

