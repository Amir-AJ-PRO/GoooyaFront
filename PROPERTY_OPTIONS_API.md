# 📋 مستندات API های Options ملک

تاریخ ایجاد: 2025-01-23

---

## 📌 خلاصه

این APIها برای دریافت داده‌های مرجع (Reference Data) مورد نیاز در فرم ثبت ملک استفاده می‌شوند. این endpoint ها:

- ✅ **Public** هستند (نیاز به احراز هویت ندارند)
- ✅ از **Cache** استفاده می‌کنند (1 ساعت)
- ✅ نتایج **مرتب‌شده** برمی‌گردانند

---

## 🔌 Endpoints

### 1️⃣ دریافت انواع ملک

```http
GET /api/properties/options/property-types/
```

**توضیحات:**  
دریافت لیست تمام انواع ملک (آپارتمان، ویلا، زمین، مغازه و ...) برای استفاده در dropdown.

**پارامترها:**  
این endpoint پارامتری ندارد.

**نمونه درخواست:**

```bash
curl -X GET http://10.188.103.122:8000/api/properties/options/property-types/
```

**نمونه پاسخ موفق (200 OK):**

```json
[
  {
    "id": 1,
    "title": "آپارتمان"
  },
  {
    "id": 2,
    "title": "ویلا"
  },
  {
    "id": 3,
    "title": "زمین"
  },
  {
    "id": 4,
    "title": "مغازه"
  }
]
```

**توضیحات فیلدها:**

| فیلد | نوع | توضیحات |
|------|-----|---------|
| `id` | integer | شناسه یکتای نوع ملک (برای استفاده در فیلد `property_type`) |
| `title` | string | عنوان نوع ملک (برای نمایش در UI) |

**نکات مهم:**
- ✅ Cache: 1 ساعت
- ✅ مرتب‌سازی: بر اساس `title`
- ✅ Public endpoint (بدون نیاز به token)

---

### 2️⃣ دریافت لیست شهرها

```http
GET /api/properties/options/cities/
```

**توضیحات:**  
دریافت لیست تمام شهرها برای استفاده در dropdown انتخاب شهر.

**پارامترها:**  
این endpoint پارامتری ندارد.

**نمونه درخواست:**

```bash
curl -X GET http://10.188.103.122:8000/api/properties/options/cities/
```

**نمونه پاسخ موفق (200 OK):**

```json
[
  {
    "id": 1,
    "name": "تهران",
    "province": "تهران"
  },
  {
    "id": 2,
    "name": "اصفهان",
    "province": "اصفهان"
  },
  {
    "id": 3,
    "name": "شیراز",
    "province": "فارس"
  },
  {
    "id": 4,
    "name": "مشهد",
    "province": "خراسان رضوی"
  }
]
```

**توضیحات فیلدها:**

| فیلد | نوع | توضیحات |
|------|-----|---------|
| `id` | integer | شناسه یکتای شهر (برای استفاده در فیلد `city`) |
| `name` | string | نام شهر |
| `province` | string | نام استان (اختیاری) |

**نکات مهم:**
- ✅ Cache: 1 ساعت
- ✅ مرتب‌سازی: بر اساس `name`
- ✅ Public endpoint (بدون نیاز به token)

---

### 3️⃣ دریافت لیست مناطق

```http
GET /api/properties/options/locations/
GET /api/properties/options/locations/?city=1
```

**توضیحات:**  
دریافت لیست مناطق/محله‌ها. می‌توانید نتایج را با استفاده از پارامتر `city` فیلتر کنید.

**پارامترهای Query String:**

| پارامتر | نوع | اجباری | توضیحات |
|---------|-----|--------|---------|
| `city` | integer | ✗ | ID شهر برای فیلتر کردن مناطق |

**نمونه درخواست (همه مناطق):**

```bash
curl -X GET http://10.188.103.122:8000/api/properties/options/locations/
```

**نمونه درخواست (فیلتر بر اساس شهر):**

```bash
curl -X GET "http://10.188.103.122:8000/api/properties/options/locations/?city=1"
```

**نمونه پاسخ موفق (200 OK) - بدون فیلتر:**

```json
[
  {
    "id": 1,
    "name": "منطقه 1",
    "city": 1,
    "city_name": "تهران"
  },
  {
    "id": 2,
    "name": "منطقه 2",
    "city": 1,
    "city_name": "تهران"
  },
  {
    "id": 3,
    "name": "منطقه 1",
    "city": 2,
    "city_name": "اصفهان"
  }
]
```

**نمونه پاسخ موفق (200 OK) - با فیلتر شهر:**

```json
[
  {
    "id": 1,
    "name": "منطقه 1",
    "city": 1,
    "city_name": "تهران"
  },
  {
    "id": 2,
    "name": "منطقه 2",
    "city": 1,
    "city_name": "تهران"
  }
]
```

**توضیحات فیلدها:**

| فیلد | نوع | توضیحات |
|------|-----|---------|
| `id` | integer | شناسه یکتای منطقه (برای استفاده در فیلد `location`) |
| `name` | string | نام منطقه یا محله |
| `city` | integer | ID شهر مربوطه |
| `city_name` | string | نام شهر (برای نمایش در UI) |

**نکات مهم:**
- ✅ Cache: 1 ساعت
- ✅ مرتب‌سازی: بر اساس `city__name` و سپس `name`
- ✅ Public endpoint (بدون نیاز به token)
- 💡 **توصیه UX**: ابتدا شهر را انتخاب کنید و سپس مناطق آن شهر را فیلتر کنید

---

## 🎯 نحوه استفاده در Frontend

### TypeScript Interfaces:

```typescript
export interface PropertyType {
  id: number;
  title: string;
}

export interface City {
  id: number;
  name: string;
  province?: string;
}

export interface Location {
  id: number;
  name: string;
  city: number;
  city_name: string;
}
```

### API Service Functions:

```typescript
// دریافت انواع املاک
export const getPropertyTypes = async (): Promise<PropertyType[]> => {
  const response = await fetch(
    `${API_BASE_URL}/api/properties/options/property-types/`
  );
  if (!response.ok) throw new Error('خطا در دریافت انواع املاک');
  return response.json();
};

// دریافت شهرها
export const getCities = async (): Promise<City[]> => {
  const response = await fetch(
    `${API_BASE_URL}/api/properties/options/cities/`
  );
  if (!response.ok) throw new Error('خطا در دریافت شهرها');
  return response.json();
};

// دریافت مناطق (با فیلتر اختیاری)
export const getLocations = async (cityId?: number): Promise<Location[]> => {
  const url = cityId 
    ? `${API_BASE_URL}/api/properties/options/locations/?city=${cityId}`
    : `${API_BASE_URL}/api/properties/options/locations/`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('خطا در دریافت مناطق');
  return response.json();
};
```

### React Query Hooks:

```typescript
// Hook برای دریافت انواع املاک
export const usePropertyTypes = () => {
  return useQuery<PropertyType[], Error>({
    queryKey: ['property-types'],
    queryFn: getPropertyTypes,
    staleTime: 1000 * 60 * 60, // 1 hour (همانند cache backend)
  });
};

// Hook برای دریافت شهرها
export const useCities = () => {
  return useQuery<City[], Error>({
    queryKey: ['cities'],
    queryFn: getCities,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

// Hook برای دریافت مناطق (با فیلتر)
export const useLocations = (cityId?: number) => {
  return useQuery<Location[], Error>({
    queryKey: ['locations', cityId],
    queryFn: () => getLocations(cityId),
    enabled: !!cityId, // فقط وقتی شهر انتخاب شده
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};
```

### استفاده در Component:

```typescript
function PropertyForm() {
  const [selectedCity, setSelectedCity] = useState<number | undefined>();
  
  const { data: propertyTypes, isLoading: loadingTypes } = usePropertyTypes();
  const { data: cities, isLoading: loadingCities } = useCities();
  const { data: locations, isLoading: loadingLocations } = useLocations(selectedCity);
  
  return (
    <form>
      {/* نوع ملک */}
      <Select>
        {propertyTypes?.map((type) => (
          <option key={type.id} value={type.id}>
            {type.title}
          </option>
        ))}
      </Select>
      
      {/* شهر */}
      <Select onChange={(e) => setSelectedCity(Number(e.target.value))}>
        {cities?.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name} - {city.province}
          </option>
        ))}
      </Select>
      
      {/* منطقه (فقط اگر شهر انتخاب شده) */}
      {selectedCity && (
        <Select disabled={loadingLocations}>
          {locations?.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </Select>
      )}
    </form>
  );
}
```

---

## 🔄 Flow استفاده

```
1. بارگذاری صفحه
   ↓
2. دریافت انواع املاک (همزمان)
   ↓
3. دریافت شهرها (همزمان)
   ↓
4. کاربر شهر را انتخاب می‌کند
   ↓
5. دریافت مناطق آن شهر (با فیلتر city={id})
   ↓
6. کاربر منطقه را انتخاب می‌کند
   ↓
7. ارسال فرم با property_type, city, location
```

---

## ⚡ بهینه‌سازی Performance

### 1. Caching Strategy:

```typescript
// Backend: 1 hour cache
// Frontend: همانند backend

staleTime: 1000 * 60 * 60 // 1 hour
```

### 2. Conditional Fetching:

```typescript
// فقط وقتی شهر انتخاب شده، مناطق را بگیر
enabled: !!cityId
```

### 3. Parallel Requests:

```typescript
// انواع املاک و شهرها را همزمان بگیر
const propertyTypes = usePropertyTypes();
const cities = useCities();
```

---

## 🧪 نحوه تست

### Test 1: دریافت انواع املاک

```bash
curl -X GET http://10.188.103.122:8000/api/properties/options/property-types/
```

**انتظار:**
- Status: 200 OK
- Array از PropertyType ها
- مرتب شده بر اساس title

### Test 2: دریافت شهرها

```bash
curl -X GET http://10.188.103.122:8000/api/properties/options/cities/
```

**انتظار:**
- Status: 200 OK
- Array از City ها با province
- مرتب شده بر اساس name

### Test 3: دریافت مناطق (بدون فیلتر)

```bash
curl -X GET http://10.188.103.122:8000/api/properties/options/locations/
```

**انتظار:**
- Status: 200 OK
- Array از تمام مناطق

### Test 4: دریافت مناطق (با فیلتر)

```bash
curl -X GET "http://10.188.103.122:8000/api/properties/options/locations/?city=1"
```

**انتظار:**
- Status: 200 OK
- Array از مناطق فقط برای شهر 1

---

## 🐛 Troubleshooting

### مشکل: داده‌ها خالی برمی‌گردن

**راه حل:**
1. بررسی کنید endpoint صحیح هست
2. بررسی کنید backend داده دارد
3. Console log کنید response را

### مشکل: مناطق بارگذاری نمی‌شن

**راه حل:**
1. بررسی کنید `enabled: !!cityId` درست کار می‌کنه
2. بررسی کنید شهر انتخاب شده
3. بررسی کنید query string درست ساخته شده: `?city=1`

### مشکل: Cache زیادی هست

**راه حل:**
برای force refresh:
```typescript
queryClient.invalidateQueries({ queryKey: ['property-types'] });
```

---

## 📝 نکات مهم

1. ✅ **Public Endpoints**: نیاز به token ندارند
2. ✅ **Cached**: برای 1 ساعت cache می‌شوند
3. ✅ **Sorted**: نتایج مرتب شده برمی‌گردند
4. 💡 **UX**: ابتدا شهر را بگیرید، سپس مناطق را فیلتر کنید
5. ⚡ **Performance**: از React Query cache استفاده کنید

---

**تهیه شده برای پروژه گویا** 🏡

