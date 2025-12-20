# تنظیمات Environment

برای تنظیم base URL ها، یک فایل `.env` در ریشه پروژه بسازید (کنار `package.json`) و این متغیرها را قرار دهید:

```env
# API عمومی پروژه (پروکسی /api/proxy از همین استفاده می‌کند)
NEXT_PUBLIC_API_URL=https://api.goooya.ir

# اگر API پشتیبانی روی دامنه/پورت دیگری است:
VITE_SUPPORT_API_BASE_URL=https://support-api.example.com

# نکته: این مقدار در `next.config.js` به `NEXT_PUBLIC_SUPPORT_API_BASE_URL` مپ می‌شود
# تا در سمت کلاینت (SupportChatClient) هم قابل استفاده باشد.
# (اختیاری) اگر جای دیگری از پروژه لازم داشتید:
NEXT_PUBLIC_SUPPORT_API_URL=https://support-api.example.com

# (اختیاری - فقط برای Development)
# اگر بک‌اند پشتیبانی روی https://localhost است و Node/Next به dev certificate اعتماد نمی‌کند:
SUPPORT_ALLOW_INSECURE_TLS=1
```

## توضیحات

- صفحه پشتیبانی به جای ساختار «تیکت/چت‌های متعدد» تبدیل شده به **یک چت واحد**.
- درخواست چت از طریق route داخلی Next.js (`/api/support/chat`) ارسال می‌شود تا:
  - از CORS و مشکلات cross-origin دوری کنیم
  - کوکی `support_session` را **سروری و HttpOnly** ست کنیم

## نکته درباره Secure/SameSite

طبق داکیومنت بک‌اند شما، کوکی با `Secure=true` و `SameSite=None` ست می‌شود.  
این ترکیب در **HTTP لوکال** معمولاً ذخیره نمی‌شود. در این پروژه:

- در production: `SameSite=None` + `Secure=true`
- در development: `SameSite=Lax` + `Secure=false` (برای اینکه لوکال هم کار کند)


