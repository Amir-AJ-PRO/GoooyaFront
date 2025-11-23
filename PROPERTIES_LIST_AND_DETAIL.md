# 🏠 مستندات صفحات لیست و جزئیات املاک

تاریخ ایجاد: 2025-01-23

---

## 📋 خلاصه

دو صفحه اصلی برای نمایش املاک:
1. **صفحه لیست املاک** (`/properties`) - لیست همه املاک با فیلتر و جستجو
2. **صفحه جزئیات ملک** (`/properties/[slug]`) - جزئیات کامل یک ملک

---

## 🔌 API Endpoints

### 1️⃣ دریافت لیست املاک

```http
GET /api/properties/list/
```

**پاسخ:**
```json
[
  {
    "id": 1,
    "title": "آپارتمان 120 متری در منطقه 1",
    "slug": "apartment-120-meter-region-1",
    "address": "تهران، منطقه 1، خیابان ولیعصر",
    "measure": "120.00",
    "rooms": 3,
    "price": 5000000000,
    "transaction_type": "sale",
    "city": {
      "id": 1,
      "name": "تهران"
    },
    "location": {
      "id": 1,
      "name": "منطقه 1"
    },
    "property_type": {
      "id": 1,
      "title": "آپارتمان"
    },
    "images": [
      {
        "id": 1,
        "image": "/media/property_images/image1.jpg",
        "is_main": true
      }
    ],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

**نکات:**
- ✅ Cache: 5 دقیقه
- ✅ فقط املاک با `show_status='ok'`
- ✅ مرتب شده بر اساس `created_at` (جدیدترین اول)
- ✅ Public (بدون نیاز به احراز هویت)

---

### 2️⃣ دریافت جزئیات ملک

```http
GET /api/properties/{slug}/
```

**مثال:**
```http
GET /api/properties/apartment-120-meter-region-1/
```

**پاسخ:**
```json
{
  "id": 1,
  "title": "آپارتمان 120 متری در منطقه 1",
  "slug": "apartment-120-meter-region-1",
  "address": "تهران، منطقه 1، خیابان ولیعصر",
  "measure": "120.00",
  "year_built": 1400,
  "floor": "3",
  "rooms": 3,
  "document_type": "سند رسمی",
  "transaction_type": "sale",
  "price": 5000000000,
  "price_per_meter": 41666666,
  "has_parking": true,
  "has_storage": true,
  "has_elevator": true,
  "description": "<div>توضیحات کامل ملک...</div>",
  "images": [...],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**خطاها:**
- `404 Not Found`: ملک یافت نشد یا `show_status != 'ok'`

---

## 📁 ساختار فایل‌ها

### 1️⃣ Types (`src/types/property.ts`)

```typescript
// برای لیست املاک
export interface PropertyListItem {
  id: number;
  title: string;
  slug: string;
  // ... فیلدهای خلاصه
  city: { id: number; name: string; };
  property_type: { id: number; title: string; };
  images: PropertyImage[];
}

// برای جزئیات کامل
export interface Property {
  id: number;
  title: string;
  // ... همه فیلدها
  price_per_meter?: number;
  agreed_price?: boolean;
  has_balcony?: boolean;
  description?: string;
}
```

---

### 2️⃣ API Service (`src/services/propertyApi.ts`)

```typescript
// دریافت لیست املاک
export const getProperties = async (): Promise<PropertyListItem[]> => {
  const response = await fetch(`${API_BASE_URL}/api/properties/list/`);
  if (!response.ok) throw new Error('خطا در دریافت لیست املاک');
  return response.json();
};

// دریافت جزئیات ملک
export const getPropertyBySlug = async (slug: string): Promise<Property> => {
  const response = await fetch(`${API_BASE_URL}/api/properties/${slug}/`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('ملک مورد نظر یافت نشد');
    }
    throw new Error('خطا در دریافت جزئیات ملک');
  }
  return response.json();
};
```

---

### 3️⃣ React Query Hooks (`src/hooks/usePropertyMutations.ts`)

```typescript
// Hook برای لیست املاک
export const useProperties = () => {
  return useQuery<PropertyListItem[], Error>({
    queryKey: ['properties'],
    queryFn: getProperties,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook برای جزئیات ملک
export const useProperty = (slug: string) => {
  return useQuery<Property, Error>({
    queryKey: ['property', slug],
    queryFn: () => getPropertyBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
```

---

### 4️⃣ PropertyCard Component (`src/components/cards/PropertyCard.tsx`)

**ویژگی‌ها:**
- ✅ نمایش تصویر اصلی
- ✅ بج نوع معامله (فروش/اجاره)
- ✅ بج نوع ملک
- ✅ نمایش موقعیت، متراژ، تعداد خواب
- ✅ فرمت قیمت (میلیارد/میلیون)
- ✅ Hover effect
- ✅ لینک به صفحه جزئیات با slug

```typescript
<PropertyCard property={property} />
```

---

### 5️⃣ صفحه لیست املاک (`/properties`)

**مسیر:** `/properties`

#### ویژگی‌های صفحه:

##### 1. **فیلترها:**
- 🔍 جستجو در عنوان، شهر، منطقه
- 🏷️ فیلتر نوع معامله (همه/فروش/اجاره)
- 🏠 فیلتر نوع ملک (آپارتمان، ویلا، ...)
- 📊 مرتب‌سازی (جدیدترین، قدیمی‌ترین، گران‌ترین، ارزان‌ترین)
- 🗑️ دکمه پاک کردن فیلترها

##### 2. **Grid املاک:**
- Responsive: 1 ستون (موبایل) → 2 ستون (تبلت) → 3 ستون (دسکتاپ)
- PropertyCard برای هر ملک
- Loading state با spinner
- Empty state اگر ملکی نبود

##### 3. **States:**
```typescript
const [searchTerm, setSearchTerm] = useState('');
const [transactionFilter, setTransactionFilter] = useState('all');
const [propertyTypeFilter, setPropertyTypeFilter] = useState('all');
const [sortBy, setSortBy] = useState('newest');
```

##### 4. **فیلتر Logic:**
```typescript
const filteredProperties = properties
  ?.filter((property) => {
    const matchesSearch = /* جستجو در عنوان، شهر، منطقه */;
    const matchesTransaction = /* فیلتر نوع معامله */;
    const matchesType = /* فیلتر نوع ملک */;
    return matchesSearch && matchesTransaction && matchesType;
  })
  .sort((a, b) => { /* مرتب‌سازی */ });
```

---

### 6️⃣ صفحه جزئیات ملک (`/properties/[slug]`)

**مسیر:** `/properties/apartment-120-meter`

#### Layout:

```
┌──────────────────────────┬──────────┐
│                          │  قیمت    │
│  تصویر اصلی + گالری      │  تماس    │
│                          │          │
├──────────────────────────┤  اطلاعات │
│  عنوان و موقعیت          │ تکمیلی   │
├──────────────────────────┤          │
│  مشخصات                  │          │
├──────────────────────────┤          │
│  امکانات                 │          │
├──────────────────────────┤          │
│  توضیحات                 │          │
└──────────────────────────┴──────────┘
```

#### بخش‌ها:

##### 1. **گالری تصاویر:**
- تصویر اصلی بزرگ
- Thumbnails کلیک‌پذیر در پایین
- تصویر انتخاب شده با border primary
- بج‌های نوع معامله و نوع ملک
- دکمه‌های علاقه‌مندی و اشتراک‌گذاری

##### 2. **عنوان و موقعیت:**
- عنوان H1 بزرگ
- آیکون MapPin + شهر + منطقه
- آدرس کامل (اگر موجود باشد)

##### 3. **مشخصات:**
```
┌────────┬────────┬────────┐
│ متراژ  │ خواب   │ سال    │
│ 120 متر│   3    │ 1400   │
├────────┼────────┼────────┤
│ طبقه   │ سند   │قیمت/متر│
│   3    │ ملکی  │41میلیون│
└────────┴────────┴────────┘
```

##### 4. **امکانات:**
- ✅ پارکینگ (سبز اگر دارد)
- ✅ انباری (سبز اگر دارد)
- ✅ آسانسور (سبز اگر دارد)
- ✅ بالکن (سبز اگر دارد)

##### 5. **توضیحات:**
- HTML content (از CKEditor)
- `dangerouslySetInnerHTML`
- Prose styling

##### 6. **کارت قیمت (Sticky):**

**فروش:**
```
┌─────────────────┐
│ قیمت کل        │
│ 5 میلیارد تومان│
├─────────────────┤
│ [تماس با مشاور]│
│ [درخواست بازدید]│
└─────────────────┘
```

**اجاره:**
```
┌─────────────────┐
│ رهن             │
│ 500 میلیون     │
├─────────────────┤
│ اجاره (ماهانه) │
│ 10 میلیون      │
├─────────────────┤
│ [تماس با مشاور]│
│ [درخواست بازدید]│
└─────────────────┘
```

##### 7. **اطلاعات تکمیلی:**
- شناسه ملک
- تاریخ ثبت
- آخرین به‌روزرسانی

---

## 🎨 Helper Functions

### فرمت قیمت:

```typescript
const formatPrice = (price?: number): string => {
  if (!price) return 'توافقی';
  
  if (price >= 1000000000) {
    return `${(price / 1000000000).toFixed(2)} میلیارد تومان`;
  } else if (price >= 1000000) {
    return `${(price / 1000000).toFixed(0)} میلیون تومان`;
  }
  return `${price.toLocaleString('fa-IR')} تومان`;
};
```

### تصویر URL:

```typescript
const mainImage = property.images.find(img => img.is_main) || property.images[0];
const imageUrl = mainImage 
  ? `${API_BASE_URL}${mainImage.image}` 
  : '/assets/property-placeholder.jpg';
```

---

## 🔄 Flow کاربر

### لیست املاک:

```
1. کاربر وارد /properties می‌شود
   ↓
2. لیست املاک از API بارگذاری می‌شود
   ↓
3. کاربر می‌تواند فیلتر/جستجو بزند
   ↓
4. نتایج به‌روزرسانی می‌شوند (client-side)
   ↓
5. کلیک روی PropertyCard
   ↓
6. رفتن به /properties/{slug}
```

### جزئیات ملک:

```
1. کاربر وارد /properties/{slug} می‌شود
   ↓
2. جزئیات ملک از API بارگذاری می‌شود
   ↓
3. نمایش تصاویر، مشخصات، امکانات
   ↓
4. کاربر می‌تواند:
   - تصاویر را مشاهده کند
   - تماس با مشاور بگیرد
   - درخواست بازدید کند
   - ملک را علاقه‌مندی/اشتراک کند
```

---

## 📊 Performance

### Caching:

```typescript
// Backend: 5 minutes
// Frontend: همانند backend
staleTime: 1000 * 60 * 5
```

### Image Optimization:

```typescript
<Image
  src={imageUrl}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover"
/>
```

### Prefetch:

```typescript
<Link href={`/properties/${property.slug}`} prefetch={true}>
```

---

## ✅ Features

### صفحه لیست:
- ✅ فیلتر real-time (client-side)
- ✅ جستجو در چند فیلد
- ✅ مرتب‌سازی dynamic
- ✅ Responsive grid
- ✅ Loading states
- ✅ Empty states
- ✅ Cache 5 دقیقه

### صفحه جزئیات:
- ✅ گالری تصاویر interactive
- ✅ نمایش کامل مشخصات
- ✅ Sticky sidebar (قیمت)
- ✅ HTML content (توضیحات)
- ✅ Back button
- ✅ Error handling (404)
- ✅ SEO friendly (metadata)

---

## 🧪 نحوه تست

### تست لیست املاک:

1. **بارگذاری:**
   - برو به `/properties`
   - چک کن لیست لود شد

2. **فیلترها:**
   - جستجو کن: "تهران"
   - فیلتر کن: فروش
   - مرتب کن: گران‌ترین

3. **PropertyCard:**
   - کلیک کن روی یک ملک
   - باید بره به صفحه جزئیات

### تست جزئیات ملک:

1. **بارگذاری:**
   - برو به `/properties/{slug}`
   - چک کن جزئیات لود شد

2. **گالری:**
   - کلیک کن روی thumbnails
   - چک کن تصویر اصلی عوض می‌شه

3. **404:**
   - برو به slug نامعتبر
   - باید پیغام 404 نشون بده

---

## 🐛 Troubleshooting

### مشکل: تصاویر لود نمی‌شن

**راه حل:**
- چک کن `API_BASE_URL` درسته
- چک کن `image` path از backend درست اومده
- fallback به placeholder اگر نبود

### مشکل: فیلترها کار نمی‌کنن

**راه حل:**
- Console log کن `filteredProperties`
- چک کن state های filter درست set می‌شن

---

## 📝 TODO / بهبودهای آینده

- [ ] Pagination برای لیست املاک
- [ ] Infinite scroll
- [ ] فیلتر محدوده قیمت (slider)
- [ ] نقشه برای موقعیت ملک
- [ ] املاک مشابه
- [ ] Lightbox برای تصاویر
- [ ] دکمه تماس واقعی (با شماره مشاور)
- [ ] فرم درخواست بازدید
- [ ] علاقه‌مندی‌ها (Wishlist)
- [ ] اشتراک‌گذاری در شبکه‌های اجتماعی
- [ ] مقایسه املاک
- [ ] چاپ صفحه جزئیات

---

**تهیه شده برای پروژه گویا** 🏡  
**نسخه:** 1.0.0  
**تاریخ:** 2025-01-23

