# راهنمای Docker برای پروژه Gooya

این راهنما نحوه Dockerize کردن و اجرای پروژه Next.js را توضیح می‌دهد.

## پیش‌نیازها

- Docker (نسخه 20.10 یا بالاتر)
- Docker Compose (نسخه 2.0 یا بالاتر)

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

## تنظیم متغیرهای محیطی

برای تنظیم متغیرهای محیطی، می‌توانید:

1. **استفاده از .env file (پیشنهادی)**: فایل `.env` را در root پروژه ایجاد کنید:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://goooya.api.ir
API_BASE=https://goooya.api.ir

# Elasticsearch Configuration (اختیاری)
ELASTICSEARCH_HOST=localhost:9200
ELASTICSEARCH_INDEX=properties

# Node Environment
NODE_ENV=production

# Next.js Telemetry
NEXT_TELEMETRY_DISABLED=1

# Port
PORT=8030
```

2. **در docker-compose.yml**: متغیرها را در بخش `environment` اضافه کنید

docker-compose.yml به صورت خودکار فایل `.env` را load می‌کند.

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

## نکات مهم

1. **Postinstall Script**: اسکریپت `fix-quill.js` به صورت خودکار در مرحله build اجرا می‌شود
2. **Standalone Output**: Next.js در حالت standalone build می‌شود که برای Docker بهینه است
3. **Security**: Container با user غیر root اجرا می‌شود (nextjs:nodejs)
4. **Health Check**: Container دارای health check است که هر 30 ثانیه بررسی می‌شود

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

