# 👤 مستندات ویژگی به‌روزرسانی پروفایل کاربر

تاریخ ایجاد: 2025-01-23

---

## 📋 خلاصه

این ویژگی به کاربران اجازه می‌دهد تا اطلاعات پروفایل خود (نام و ایمیل) را در صفحه تنظیمات ویرایش کنند.

---

## 🔌 API Endpoint

### به‌روزرسانی پروفایل

```http
PATCH http://10.188.103.122:8000/api/auth/update-profile/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "full_name": "علی احمدی",
  "email": "ali@example.com"
}
```

**پاسخ موفق (200 OK):**
```json
{
  "detail": "پروفایل با موفقیت به‌روزرسانی شد.",
  "user": {
    "phone": "09123456789",
    "full_name": "علی احمدی",
    "email": "ali@example.com",
    "date_joined": "2024-01-15T10:30:00Z",
    "is_active": true,
    "is_staff": false,
    "is_agent": false,
    "user_role": "user",
    "agent_profile": null
  }
}
```

**خطاهای ممکن:**
- `401 Unauthorized`: عدم احراز هویت
- `400 Bad Request`: فرمت ایمیل نامعتبر یا تکراری

---

## 📁 ساختار فایل‌ها

### 1️⃣ API Service (`src/services/authApi.ts`)

```typescript
export interface UpdateProfilePayload {
  full_name?: string;
  email?: string;
}

export interface UpdateProfileResponse {
  detail: string;
  user: UserData;
}

export const updateProfile = async (
  payload: UpdateProfilePayload,
  token: string
): Promise<UpdateProfileResponse>
```

**ویژگی‌ها:**
- ✅ استفاده از PATCH method
- ✅ Authorization header با Bearer token
- ✅ Error handling کامل

---

### 2️⃣ React Query Hook (`src/hooks/useProfileMutations.ts`)

```typescript
export const useUpdateProfile = () => {
  return useMutation<
    UpdateProfileResponse, 
    Error, 
    UpdateProfilePayload
  >({
    mutationFn: async (payload) => { ... },
    onSuccess: (data) => {
      // به‌روزرسانی localStorage
      // Invalidate queries
      // نمایش toast موفقیت
    },
    onError: (error) => {
      // نمایش toast خطا
    }
  });
}
```

**ویژگی‌ها:**
- ✅ Optimistic updates
- ✅ Cache invalidation
- ✅ Toast notifications
- ✅ localStorage sync

---

### 3️⃣ صفحه تنظیمات (`src/app/(dashboard)/user/settings/page.tsx`)

**مسیر:** `/user/settings`

**کامپوننت‌های استفاده شده:**
- `Card` - برای گروه‌بندی فرم
- `Input` - برای ورودی‌ها
- `Label` - برای برچسب‌ها
- `Button` - برای ذخیره و لغو
- `Separator` - برای جداسازی بخش‌ها

**State Management:**
```typescript
const [userData, setUserData] = useState<UserData | null>(null);
const [fullName, setFullName] = useState('');
const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');
```

---

## 🎨 UI/UX ویژگی‌ها

### فرم ویرایش پروفایل:

#### 1. شماره تلفن (غیرقابل ویرایش)
- 📱 نمایش با icon `Phone`
- 🔒 Disabled input با پس‌زمینه خاکستری
- 💬 توضیح: "شماره تلفن قابل تغییر نیست"

#### 2. نام و نام خانوادگی
- 👤 نمایش با icon `User`
- ✏️ قابل ویرایش
- 📊 شمارنده کاراکتر (0/100)
- 🔤 حداکثر 100 کاراکتر

#### 3. ایمیل
- 📧 نمایش با icon `Mail`
- ✏️ قابل ویرایش
- ✅ Validation در real-time
- ⚠️ نمایش خطا در صورت نامعتبر بودن
- 🔄 چک یکتا بودن در backend

#### 4. اطلاعات حساب (فقط نمایش)
- نوع کاربر
- تاریخ عضویت
- وضعیت حساب

---

## ✅ Validation Rules

### ایمیل:
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

**قوانین:**
1. ✅ ایمیل **اختیاری** است (می‌تواند خالی باشد)
2. ✅ اگر وارد شد، باید فرمت معتبر داشته باشد
3. ✅ باید یکتا باشد (چک در backend)

### نام:
- حداکثر 100 کاراکتر
- اختیاری

---

## 🔄 Flow عملیات

```
1. کاربر وارد صفحه /user/settings می‌شود
   ↓
2. اطلاعات از localStorage بارگذاری می‌شود
   ↓
3. کاربر فیلدها را ویرایش می‌کند
   ↓
4. Validation در client-side انجام می‌شود
   ↓
5. کاربر روی "ذخیره تغییرات" کلیک می‌کند
   ↓
6. فقط فیلدهای تغییر یافته به Backend ارسال می‌شود
   ↓
7. Backend اطلاعات را ذخیره می‌کند
   ↓
8. localStorage به‌روزرسانی می‌شود
   ↓
9. Toast موفقیت نمایش داده می‌شود
```

---

## 🚀 نحوه استفاده

### برای کاربر:

1. وارد پنل کاربری شوید: `/user`
2. روی دکمه "تنظیمات" کلیک کنید
3. اطلاعات خود را ویرایش کنید
4. روی "ذخیره تغییرات" کلیک کنید

### برای توسعه‌دهنده:

```tsx
import { useUpdateProfile } from '@/hooks/useProfileMutations';

function MyComponent() {
  const updateProfile = useUpdateProfile();

  const handleUpdate = () => {
    updateProfile.mutate({
      full_name: "علی احمدی",
      email: "ali@example.com"
    });
  };

  return (
    <button onClick={handleUpdate}>
      ذخیره
    </button>
  );
}
```

---

## 🔒 امنیت

### Authorization:
- ✅ نیاز به Access Token دارد
- ✅ Token از localStorage گرفته می‌شود
- ✅ در header `Authorization: Bearer {token}` ارسال می‌شود

### Validation:
- ✅ Client-side validation برای UX بهتر
- ✅ Server-side validation برای امنیت
- ✅ جلوگیری از ایمیل تکراری

---

## 📊 State Management

### localStorage:
```typescript
// خواندن
const user = JSON.parse(localStorage.getItem('user_data'));

// نوشتن
localStorage.setItem('user_data', JSON.stringify(userData));
```

### React Query Cache:
```typescript
queryClient.invalidateQueries({ queryKey: ['user-profile'] });
```

---

## 🎯 ویژگی‌های خاص

### 1. Smart Payload
فقط فیلدهای تغییر یافته ارسال می‌شوند:

```typescript
const payload: { full_name?: string; email?: string } = {};

if (fullName !== userData?.full_name) {
  payload.full_name = fullName;
}

if (email !== userData?.email) {
  payload.email = email;
}
```

### 2. Loading States
```typescript
{updateProfileMutation.isPending ? (
  <>
    <Loader2 className="animate-spin" />
    در حال ذخیره...
  </>
) : (
  <>
    <Save />
    ذخیره تغییرات
  </>
)}
```

### 3. Error Handling
- Network errors
- Validation errors
- Backend errors
- Toast notifications

---

## 🧪 نحوه تست

### Manual Testing:

1. **تست نام:**
   - وارد کردن نام فارسی
   - وارد کردن نام انگلیسی
   - وارد کردن 100+ کاراکتر (باید محدود بشه)

2. **تست ایمیل:**
   - ایمیل معتبر: `user@example.com` ✅
   - ایمیل نامعتبر: `invalid-email` ❌
   - ایمیل خالی: ` ` ✅ (اختیاری)
   - ایمیل تکراری: خطای 400 از backend

3. **تست ذخیره:**
   - ذخیره بدون تغییر (نباید request بره)
   - ذخیره با یک فیلد تغییر یافته
   - ذخیره با هر دو فیلد تغییر یافته

4. **تست لغو:**
   - تغییر دادن فیلدها
   - کلیک روی "لغو"
   - فیلدها باید به حالت اول برگردند

---

## 📝 TODO

- [ ] افزودن آپلود عکس پروفایل
- [ ] افزودن تغییر رمز عبور
- [ ] افزودن تایید ایمیل
- [ ] افزودن تنظیمات اعلان‌ها
- [ ] افزودن تنظیمات حریم خصوصی

---

## 🐛 مشکلات شناخته شده

هیچ مشکلی گزارش نشده است.

---

**تهیه شده برای پروژه گویا** 🏡

