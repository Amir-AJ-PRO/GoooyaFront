# 🐳 راهنمای Docker برای پروژه Gooya

این راهنما نحوه Dockerize کردن و اجرای پروژه Next.js را توضیح می‌دهد.

## 📋 پیش‌نیازها

- Docker (نسخه 20.10 یا بالاتر)
- Docker Compose (نسخه 2.0 یا بالاتر)

## 🔐 ویژگی‌های جدید Authentication System

این نسخه شامل سیستم احراز هویت بهبود یافته با ویژگی‌های زیر است:

- ✅ **HttpOnly Cookies**: توکن‌ها به صورت امن در HttpOnly cookies ذخیره می‌شوند
- ✅ **Auto Token Refresh**: توکن‌ها به صورت خودکار هر 5 دقیقه رفرش می‌شوند
- ✅ **Persistent Login**: کاربران تا 30 روز لاگین باقی می‌مانند
- ✅ **Smart Token Management**: 
  - Access Token: 15 دقیقه
  - Refresh Token: 30 روز
- ✅ **User Data Caching**: اطلاعات کاربر در cookie ذخیره می‌شود
- ✅ **No /me Endpoint Required**: نیازی به endpoint `/me` در backend نیست

## ساخت و اجرای Docker Image

### روش 1: استفاده از Docker Compose (پیشنهادی)

```bash
# ساخت و اجرای container
docker-compose up -d --build

# مشاهده لاگ‌ها
docker-compose logs -f

# توقف container
docker-compose down
```

### روش 2: استفاده مستقیم از Docker

```bash
# ساخت image
docker build -t gooya-nextjs:latest .

# اجرای container
docker run -d \
  --name gooya-nextjs \
  -p 8030:8030 \
  -e NODE_ENV=production \
  gooya-nextjs:latest

# مشاهده لاگ‌ها
docker logs -f gooya-nextjs

# توقف container
docker stop gooya-nextjs
docker rm gooya-nextjs
```

## ⚙️ تنظیم متغیرهای محیطی

برای تنظیم متغیرهای محیطی، می‌توانید:

### 1. استفاده از .env file (پیشنهادی)

فایل `.env` را در root پروژه ایجاد کنید یا ویرایش کنید:

محتوای نمونه (متغیرهای مهم برای Production):

```env
# ==================================
# Environment Variables - Production
# ==================================

# Node Environment
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Server Configuration
PORT=8030
HOSTNAME=0.0.0.0

# ==================================
# Backend API Configuration
# ==================================

# URL اصلی Backend API (Django)
NEXT_PUBLIC_API_URL=https://api.goooya.ir

# ==================================
# Authentication & Session
# ==================================

# توکن‌ها به صورت خودکار مدیریت می‌شوند:
# - Access Token: 15 دقیقه (در HttpOnly Cookie)
# - Refresh Token: 30 روز (در HttpOnly Cookie)
# - User Data: 30 روز (در readable Cookie)

# ==================================
# Security
# ==================================

# در production باید true باشه
SECURE_COOKIES=true

# ==================================
# Elasticsearch (اختیاری)
# ==================================

# ELASTICSEARCH_HOST=elasticsearch:9200
# ELASTICSEARCH_INDEX=properties
```

### 2. در docker-compose.yml

متغیرها را در بخش `environment` اضافه کنید. docker-compose.yml به صورت خودکار فایل `.env` را load می‌کند.

## دسترسی به اپلیکیشن

بعد از اجرای container، اپلیکیشن در آدرس زیر در دسترس است:
- http://localhost:8030

## مدیریت Container

```bash
# مشاهده container های در حال اجرا
docker ps

# مشاهده لاگ‌های container
docker-compose logs -f gooya-nextjs

# ورود به container (برای debugging)
docker exec -it gooya-nextjs sh

# راه‌اندازی مجدد container
docker-compose restart

# مشاهده استفاده از منابع
docker stats gooya-nextjs
```

## به‌روزرسانی

برای به‌روزرسانی اپلیکیشن:

```bash
# Pull آخرین تغییرات
git pull

# ساخت مجدد image
docker-compose up -d --build

# یا با Docker مستقیم
docker build -t gooya-nextjs:latest .
docker stop gooya-nextjs
docker rm gooya-nextjs
docker run -d --name gooya-nextjs -p 8030:8030 gooya-nextjs:latest
```

## عیب‌یابی

### مشکل: Container فوراً متوقف می‌شود

```bash
# بررسی لاگ‌ها
docker logs gooya-nextjs

# بررسی وضعیت container
docker ps -a
```

### مشکل: پورت در حال استفاده است

```bash
# تغییر پورت در docker-compose.yml
ports:
  - "8031:8030"  # پورت جدید:پورت داخل container
```

### مشکل: Build با خطا مواجه می‌شود

```bash
# پاک کردن cache و ساخت مجدد
docker-compose build --no-cache
```

## 🔒 نحوه کار Authentication در Production

### Cookie Management

1. **Access Token** (HttpOnly):
   - عمر: 15 دقیقه
   - ذخیره: HttpOnly Cookie (امن در برابر XSS)
   - به صورت خودکار با هر درخواست ارسال می‌شود

2. **Refresh Token** (HttpOnly):
   - عمر: 30 روز
   - ذخیره: HttpOnly Cookie
   - برای رفرش کردن Access Token استفاده می‌شود

3. **User Data** (Readable):
   - عمر: 30 روز
   - ذخیره: Cookie معمولی (قابل خواندن توسط JavaScript)
   - برای نمایش اطلاعات کاربر بعد از refresh صفحه

### Auto Refresh Flow

```
کاربر لاگین می‌کنه
    ↓
توکن‌ها در Cookie ذخیره می‌شن
    ↓
هر 5 دقیقه یک بار AuthContext چک می‌کنه
    ↓
اگر Access Token منقضی شده → با Refresh Token رفرش می‌کنه
    ↓
کاربر تا 30 روز لاگین می‌مونه
```

### مزایا

✅ **امنیت بالا**: توکن‌ها در JavaScript قابل دسترسی نیستند  
✅ **تجربه کاربری عالی**: کاربر تا 30 روز لاگین باقی می‌مونه  
✅ **رفرش خودکار**: نیازی به دخالت کاربر نیست  
✅ **Stateless**: نیازی به ذخیره session در server نیست

## 💡 نکات مهم

1. **Standalone Output**: Next.js در حالت standalone build می‌شود که برای Docker بهینه است (تنظیم در `next.config.ts`)
2. **Security**: 
   - Container با user غیر root اجرا می‌شود (nextjs:nodejs)
   - `npm audit fix` قبل از build اجرا می‌شود
   - HttpOnly Cookies برای توکن‌های احراز هویت
3. **Health Check**: Container دارای health check است که هر 30 ثانیه بررسی می‌شود
4. **Optimized Build**: 
   - Multi-stage build برای کاهش حجم image (از ~1.5GB به ~150MB)
   - فقط dependencies ضروری در image نهایی
5. **Cookie Security**: در production همه cookies با flag `Secure` ست می‌شوند
6. **Auto Token Management**: 
   - Access Token: 15 دقیقه
   - Refresh Token: 30 روز
   - رفرش خودکار هر 5 دقیقه

## Production Deployment

برای استقرار در production:

1. متغیرهای محیطی را تنظیم کنید
2. از reverse proxy (مثل Nginx) استفاده کنید
3. SSL/TLS را با Let's Encrypt تنظیم کنید
4. Monitoring و logging را اضافه کنید

مثال Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8030;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

