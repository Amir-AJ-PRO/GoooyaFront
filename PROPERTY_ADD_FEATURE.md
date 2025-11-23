# 🏠 مستندات ویژگی ثبت ملک جدید

تاریخ ایجاد: 2025-01-23

---

## 📋 خلاصه

این ویژگی به مشاورین املاک (Agent) اجازه می‌دهد تا املاک جدید را با یک فرم چند مرحله‌ای (Multi-Step Form) ثبت کنند. فرم شامل 3 مرحله است:

1. **مرحله 1 (اجباری)**: اطلاعات اصلی + تصاویر
2. **مرحله 2 (اختیاری)**: اطلاعات تکمیلی
3. **مرحله 3 (اختیاری)**: امکانات و ویژگی‌ها

---

## 🔌 API Endpoint

### ایجاد ملک جدید

```http
POST http://10.188.103.122:8000/api/properties/add/
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**نکته مهم**: این endpoint از `multipart/form-data` استفاده می‌کند چون فایل (عکس) آپلود می‌شود.

---

## 📊 پارامترهای درخواست

### فیلدهای اجباری (مرحله 1):

| پارامتر | نوع | توضیحات |
|---------|-----|---------|
| `title` | string | عنوان ملک (حداکثر 200 کاراکتر) |
| `slug` | string | اسلاگ یکتا برای URL (حداکثر 250 کاراکتر) |
| `property_type` | integer | ID نوع ملک |
| `city` | integer | ID شهر |
| `measure` | decimal | متراژ (مثال: 120.50) |
| `rooms` | integer | تعداد خواب |
| `transaction_type` | string | `sale` یا `rent` |
| `price` | integer | قیمت کل (برای فروش) |
| `mortgage` | integer | رهن (برای رهن/اجاره) |
| `rent` | integer | اجاره (برای رهن/اجاره) |
| `uploaded_images` | array[file] | لیست تصاویر (حداقل 1 تصویر) |
| `main_image_index` | integer | اندیس تصویر اصلی (از 0 شروع) |

### فیلدهای اختیاری (مراحل 2 و 3):

| پارامتر | نوع | توضیحات |
|---------|-----|---------|
| `location` | integer | ID منطقه/محله |
| `address` | string | آدرس کامل |
| `description` | string | توضیحات ملک (HTML) |
| `year_built` | integer | سال ساخت |
| `floor` | string | طبقه ملک |
| `document_type` | string | نوع سند |
| `has_parking` | boolean | پارکینگ (پیش‌فرض: false) |
| `has_storage` | boolean | انباری (پیش‌فرض: false) |
| `has_elevator` | boolean | آسانسور (پیش‌فرض: false) |

---

## 📁 ساختار فایل‌ها

### 1️⃣ Types & Interfaces (`src/types/property.ts`)

```typescript
export interface CreatePropertyPayload {
  // فیلدهای اجباری
  title: string;
  slug: string;
  property_type: number;
  city: number;
  measure: string | number;
  rooms: number;
  transaction_type: TransactionType;
  uploaded_images: File[];
  main_image_index: number;
  
  // فیلدهای اختیاری
  location?: number;
  address?: string;
  price?: number;
  mortgage?: number;
  rent?: number;
  description?: string;
  year_built?: number;
  floor?: string;
  document_type?: string;
  has_parking?: boolean;
  has_storage?: boolean;
  has_elevator?: boolean;
}
```

**ویژگی‌ها:**
- ✅ Type-safe interfaces
- ✅ جداسازی فیلدهای اجباری و اختیاری
- ✅ Type unions برای transaction_type

---

### 2️⃣ API Service (`src/services/propertyApi.ts`)

```typescript
export const createProperty = async (
  payload: CreatePropertyPayload,
  token: string
): Promise<Property>

export const createPropertyFormData = (
  payload: CreatePropertyPayload
): FormData

export const generateSlug = (title: string): string
```

**ویژگی‌ها:**
- ✅ تبدیل خودکار payload به FormData
- ✅ تولید خودکار slug از عنوان فارسی
- ✅ Authorization با Bearer token
- ✅ Error handling

**توابع کمکی:**
- `getPropertyTypes()`: دریافت لیست انواع املاک از `/api/properties/options/property-types/`
- `getCities()`: دریافت لیست شهرها از `/api/properties/options/cities/`
- `getLocations(cityId?)`: دریافت لیست مناطق از `/api/properties/options/locations/?city={cityId}`

---

### 3️⃣ React Query Hooks (`src/hooks/usePropertyMutations.ts`)

```typescript
export const useCreateProperty = () => {
  return useMutation<Property, Error, CreatePropertyPayload>({
    mutationFn: async (payload) => { ... },
    onSuccess: () => {
      // Invalidate queries
      // Toast notification
    }
  });
}

export const usePropertyTypes = () => { ... }
export const useCities = () => { ... }
export const useLocations = (cityId?: number) => { ... }
```

**ویژگی‌ها:**
- ✅ Mutation با React Query
- ✅ Cache invalidation
- ✅ Toast notifications
- ✅ Loading states
- ✅ Hooks برای دریافت داده‌های مرجع (شهرها، انواع ملک)

---

### 4️⃣ کامپوننت آپلود تصویر (`src/components/forms/ImageUploader.tsx`)

```typescript
<ImageUploader
  images={files}
  mainImageIndex={mainIndex}
  onChange={(images, mainIndex) => { ... }}
  maxImages={10}
  required={true}
/>
```

**ویژگی‌ها:**
- ✅ پیش‌نمایش تصاویر
- ✅ Drag & Drop (آماده برای اضافه کردن)
- ✅ انتخاب تصویر اصلی با ستاره
- ✅ حذف تصویر
- ✅ محدودیت تعداد تصاویر
- ✅ فیلتر فایل‌های تصویری
- ✅ شمارنده تصاویر

---

### 5️⃣ صفحه ثبت ملک (`src/app/(dashboard)/agent/properties/new/page.tsx`)

**مسیر:** `/agent/properties/new`

#### مرحله 1: اطلاعات اصلی (اجباری) ✅

```
┌─────────────────────────────────────┐
│  [1] ● 2  ○ 3                       │
├─────────────────────────────────────┤
│  عنوان: [________________]          │
│  اسلاگ: [________________]          │
│  نوع ملک: [▼]  شهر: [▼]            │
│  متراژ: [___]  خواب: [___]         │
│  نوع معامله: ⦿ فروش  ○ اجاره      │
│  قیمت: [________________]           │
│                                      │
│  📸 تصاویر:                         │
│  [عکس1*] [عکس2] [عکس3]            │
│                                      │
│  [قبلی]              [مرحله بعد →] │
└─────────────────────────────────────┘
```

#### مرحله 2: اطلاعات تکمیلی (اختیاری)

```
┌─────────────────────────────────────┐
│  ○ 1  [2] ● 3                       │
├─────────────────────────────────────┤
│  منطقه: [▼]                         │
│  آدرس: [__________________]         │
│  توضیحات:                           │
│  [_____________________________]    │
│  [_____________________________]    │
│                                      │
│  سال ساخت: [____]                  │
│  طبقه: [____]                       │
│  نوع سند: [▼]                       │
│                                      │
│  [← قبلی]  [ثبت سریع] [مرحله بعد →]│
└─────────────────────────────────────┘
```

#### مرحله 3: امکانات (اختیاری)

```
┌─────────────────────────────────────┐
│  ○ 1  ○ 2  [3] ●                    │
├─────────────────────────────────────┤
│  امکانات و ویژگی‌ها:               │
│                                      │
│  ☑ پارکینگ                          │
│  ☑ انباری                           │
│  ☑ آسانسور                          │
│                                      │
│  [← قبلی]              [💾 ثبت ملک] │
└─────────────────────────────────────┘
```

---

## ✅ Validation Rules

### مرحله 1 (اجباری):

```typescript
1. عنوان: نباید خالی باشد (حداکثر 200 کاراکتر)
2. اسلاگ: نباید خالی باشد (حداکثر 250 کاراکتر، یکتا)
3. نوع ملک: باید انتخاب شود
4. شهر: باید انتخاب شود
5. متراژ: باید عدد مثبت باشد
6. تعداد خواب: باید عدد غیرمنفی باشد
7. نوع معامله: sale یا rent
8. قیمت:
   - اگر فروش: قیمت الزامی
   - اگر اجاره: رهن و اجاره الزامی
9. تصاویر: حداقل 1 تصویر الزامی
10. تصویر اصلی: باید مشخص شود
```

### مراحل 2 و 3 (اختیاری):

همه فیلدها اختیاری هستند و می‌توان آن‌ها را خالی گذاشت.

---

## 🔄 Flow عملیات

```
کاربر وارد /agent/properties/new می‌شود
    ↓
مرحله 1: پر کردن اطلاعات اجباری
    ↓
[کلیک: مرحله بعد]
    ↓
Validation مرحله 1 ✅ / ❌
    ↓ (اگر valid)
مرحله 2: اطلاعات تکمیلی (اختیاری)
    ├─→ [ثبت سریع] (بدون مرحله 3)
    └─→ [مرحله بعد]
         ↓
    مرحله 3: امکانات (اختیاری)
         ↓
    [ثبت ملک]
         ↓
    تبدیل به FormData
         ↓
    POST /api/properties/add/
         ↓
    [موفق] → رفتن به /agent/properties
    [ناموفق] → نمایش خطا (Toast)
```

---

## 🎯 ویژگی‌های کلیدی

### 1. Multi-Step Form:
- ✅ 3 مرحله با پیشرفت بصری
- ✅ امکان رفت و برگشت بین مراحل
- ✅ ثبت سریع (بدون مرحله 3)
- ✅ Validation فقط برای مرحله 1

### 2. Image Upload:
- ✅ پیش‌نمایش تصاویر
- ✅ انتخاب تصویر اصلی
- ✅ حذف تصویر
- ✅ محدودیت 10 تصویر
- ✅ فیلتر فایل‌های تصویری

### 3. Smart Slug Generation:
- ✅ تولید خودکار از عنوان
- ✅ حذف کاراکترهای نامعتبر
- ✅ تبدیل فاصله به dash
- ✅ پشتیبانی از فارسی و انگلیسی

### 4. Dynamic Fields:
- ✅ نمایش قیمت برای فروش
- ✅ نمایش رهن/اجاره برای اجاره
- ✅ بارگذاری مناطق بر اساس شهر انتخابی

### 5. UX:
- ✅ Loading states
- ✅ Toast notifications
- ✅ Progress indicator
- ✅ Form persistence (State)
- ✅ Responsive design

---

## 🚀 نحوه استفاده

### برای مشاور املاک:

1. وارد پنل مشاور شوید: `/agent`
2. روی "ثبت ملک جدید" کلیک کنید
3. مرحله 1: اطلاعات اصلی را پر کنید + عکس‌ها را آپلود کنید
4. مرحله 2 (اختیاری): اطلاعات تکمیلی
5. مرحله 3 (اختیاری): امکانات
6. روی "ثبت ملک" کلیک کنید

### دسترسی مستقیم:

- `/agent` - پنل مشاور
- `/agent/properties` - لیست املاک
- `/agent/properties/new` - ثبت ملک جدید

---

## 🔒 امنیت

### Authorization:
- ✅ نیاز به Access Token دارد
- ✅ فقط کاربران با نقش Agent می‌توانند استفاده کنند
- ✅ Token در header `Authorization: Bearer {token}` ارسال می‌شود

### Validation:
- ✅ Client-side validation
- ✅ Server-side validation
- ✅ File type check (فقط تصاویر)
- ✅ اسلاگ یکتا

---

## 📦 Dependencies جدید

این ویژگی از کامپوننت‌های موجود shadcn/ui استفاده می‌کند:

- ✅ `Card`, `CardContent`, `CardHeader`
- ✅ `Button`
- ✅ `Input`
- ✅ `Label`
- ✅ `Select`
- ✅ `Textarea`
- ✅ `Checkbox`
- ✅ `Separator`

همه این کامپوننت‌ها از قبل در پروژه موجود بودند.

---

## 🧪 نحوه تست

### Manual Testing:

#### تست مرحله 1:

1. **تست عنوان:**
   - خالی بگذار → باید خطا بده
   - بیش از 200 کاراکتر → باید محدود بشه

2. **تست اسلاگ:**
   - عنوان فارسی بنویس → اسلاگ خودکار تولید بشه
   - کاراکتر خاص بزار → باید حذف بشه

3. **تست قیمت:**
   - فروش انتخاب کن → قیمت الزامی
   - اجاره انتخاب کن → رهن و اجاره الزامی

4. **تست تصاویر:**
   - بدون عکس ثبت کن → باید خطا بده
   - عکس اصلی انتخاب نکن → اولین عکس اصلی می‌شه
   - بیش از 10 عکس آپلود کن → باید جلوگیری بشه

#### تست مراحل 2 و 3:

1. **تست ثبت سریع:**
   - مرحله 1 رو پر کن
   - مرحله 2 رو رد کن
   - باید مستقیماً ثبت بشه

2. **تست مناطق:**
   - شهر انتخاب کن → مناطق بارگذاری بشن
   - شهر عوض کن → مناطق جدید بیان

#### تست API:

1. بدون token → 401 Unauthorized
2. کاربر عادی (نه agent) → 403 Forbidden
3. اسلاگ تکراری → 400 Bad Request

---

## 🐛 Troubleshooting

### مشکل: تصاویر آپلود نمی‌شن

**راه حل:**
1. چک کن `Content-Type: multipart/form-data` ست شده؟
2. چک کن فایل‌ها به درستی به FormData اضافه شدن؟
3. بررسی کن حجم فایل‌ها بیش از حد مجاز نباشه

### مشکل: اسلاگ یکتا نیست

**راه حل:**
- اسلاگ رو دستی ویرایش کن
- یا timestamp اضافه کن: `apartment-120-meter-1234567890`

### مشکل: مناطق بارگذاری نمی‌شن

**راه حل:**
1. چک کن endpoint مناطق درست هست؟
2. بررسی کن شهر انتخاب شده؟
3. Console رو برای error چک کن

---

## 📝 TODO / بهبودهای آینده

- [ ] افزودن Drag & Drop برای تصاویر
- [ ] افزودن ویرایش ملک موجود
- [ ] افزودن پیش‌نمایش ملک قبل از ثبت
- [ ] افزودن نقشه برای انتخاب موقعیت
- [ ] افزودن CKEditor برای توضیحات HTML
- [ ] افزودن دسته‌بندی املاک (آپارتمان، ویلا، زمین، ...)
- [ ] افزودن امکانات بیشتر (تلفن، اینترنت، گاز، ...)
- [ ] افزودن Draft (ذخیره پیش‌نویس)
- [ ] افزودن یادآوری برای تکمیل اطلاعات ناقص

---

## 📈 آمار پیاده‌سازی

- **تعداد فایل‌های ایجاد شده:** 6
- **تعداد خطوط کد:** ~1000+
- **زمان پیاده‌سازی:** 2 ساعت
- **تعداد مراحل فرم:** 3
- **تعداد فیلد:** 20+
- **تعداد کامپوننت UI:** 10+

---

**تهیه شده برای پروژه گویا** 🏡  
**نسخه:** 1.0.0  
**تاریخ:** 2025-01-23

