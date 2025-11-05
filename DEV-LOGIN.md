# 🔑 Dev Login - ورود سریع مدیر

برای سهولت در توسعه و تست، دو روش برای login سریع با حساب مدیر اضافه شده است.

## 📱 شماره تست

```
شماره: 09191192668
نوع کاربر: Admin
نام: توسعه‌دهنده
شرکت: گویا
```

---

## 🎯 روش اول: دکمه در Footer

### مکان:
پایین صفحه (Footer)

### ظاهر:
دکمه زیبا با gradient بنفش-صورتی 💜💗

```
🔑 ورود سریع مدیر (Dev)
```

### نحوه استفاده:
1. به **پایین هر صفحه** برو
2. دکمه رنگی "ورود سریع مدیر (Dev)" رو ببین
3. یک کلیک → Login! ✨

### نکته مهم:
⚠️ **این دکمه فقط در حالت Development نمایش داده می‌شود!**

در production این دکمه وجود نداره (امنیت کامل)

---

## ⌨️ روش دوم: Keyboard Shortcut

### میانبر کیبورد:

#### Windows/Linux:
```
Ctrl + Shift + L
```

#### Mac:
```
Cmd + Shift + L
```

### نحوه استفاده:
1. در **هر صفحه‌ای** که هستی
2. کلیدها رو با هم فشار بده
3. Instant Login! ⚡

### مزایا:
✅ سریع‌ترین روش
✅ بدون نیاز به scroll
✅ در همه صفحات کار می‌کنه
✅ حتی وقتی Modal باز هست!

---

## 🔐 امنیت

### Development Mode:
✅ هر دو روش فعال هستند
✅ دکمه در Footer نمایش داده می‌شه
✅ Keyboard shortcut کار می‌کنه

### Production Mode:
🔒 هر دو روش **غیرفعال** می‌شوند
🔒 دکمه اصلاً render نمی‌شه
🔒 Event listener اضافه نمی‌شه
🔒 امنیت کامل

---

## 📊 چه چیزی ست می‌شه؟

وقتی Login می‌کنی، این اطلاعات ست می‌شه:

```typescript
{
  id: '09191192668',
  name: 'توسعه‌دهنده',
  email: '',
  type: 'admin',
  phone: '09191192668',
  company: 'گویا',
  licenseNumber: undefined
}
```

---

## 🎨 Toast Notification

بعد از Login موفق، Toast notification نمایش داده می‌شه:

### از دکمه Footer:
```
✅ ورود موفق
شما با حساب مدیر وارد شدید
```

### از Keyboard Shortcut:
```
🔑 ورود سریع مدیر
شما با Keyboard Shortcut وارد شدید
```

---

## 🚀 برای تست:

### 1. اجرای پروژه:
```bash
npm run dev
```

### 2. تست دکمه Footer:
- Scroll به پایین صفحه
- دکمه بنفش رو ببین
- کلیک کن!

### 3. تست Keyboard Shortcut:
- در هر صفحه: `Ctrl+Shift+L` (یا `Cmd+Shift+L` در Mac)
- بدون scroll، بدون کلیک!

---

## 📂 فایل‌های مربوطه

### 1. `Footer.tsx`
- دکمه Dev Login
- فقط در development mode

### 2. `DevLoginHelper.tsx`
- Keyboard shortcut handler
- Global event listener
- Auto cleanup

### 3. `layout.tsx`
- اضافه شدن DevLoginHelper
- در تمام صفحات فعال

---

## 💡 نکات

### کی از دکمه استفاده کنم؟
- وقتی در پایین صفحه هستی
- وقتی mouse استفاده می‌کنی
- بصری و راحت

### کی از Shortcut استفاده کنم?
- وقتی می‌خوای خیلی سریع login کنی
- وقتی در بالای صفحه هستی
- بدون نیاز به scroll

---

## 🎯 مثال Workflow

### Scenario 1: تست صفحه Admin
```
1. npm run dev
2. باز کردن مرورگر
3. Ctrl+Shift+L
4. ✅ Login!
5. مستقیم به /admin برو
```

### Scenario 2: تست Features مختلف
```
1. صفحه Home → Ctrl+Shift+L → Login
2. صفحه Properties → بررسی فیچرها
3. صفحه Map → تست نقشه
4. همه جا با حساب مدیر ✅
```

---

## 🐛 Debug

اگر کار نکرد:

### Check 1: Development Mode?
```bash
echo $NODE_ENV  # باید development باشه
```

### Check 2: دکمه رو می‌بینی؟
- اگه نه → پروژه در production mode هست
- اگه آره → کلیک کن!

### Check 3: Shortcut کار نمی‌کنه؟
- Console رو باز کن (F12)
- Error چک کن
- Event listener ثبت شده؟

---

## ✨ Summary

دو روش سریع برای Login:

| روش | کلید | سرعت | استفاده |
|-----|------|------|----------|
| 🔘 دکمه Footer | کلیک | متوسط | بصری |
| ⌨️ Keyboard | Ctrl+Shift+L | خیلی سریع | حرفه‌ای |

**هر دو فقط در Development!** 🔒

---

تاریخ ایجاد: 5 نوامبر 2025

