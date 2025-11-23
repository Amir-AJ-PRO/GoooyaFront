# معماری پیشنهادی برای گویا (تیم 3 نفره)

## 🎯 Feature-Based Architecture

ترکیبی از Clean Architecture + Feature Slicing + Next.js Best Practices

---

## 📁 ساختار پیشنهادی

```
src/
│
├── app/                              # Next.js App Router
│   ├── (public)/                     # Public routes (بدون auth)
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Home
│   │   ├── properties/
│   │   ├── about/
│   │   ├── contact/
│   │   └── login/
│   │
│   ├── (protected)/                  # Protected routes (با auth)
│   │   ├── layout.tsx               # Auth check + Header
│   │   ├── dashboard/               # Base dashboard
│   │   └── profile/
│   │
│   ├── (agent)/                     # Agent-only routes
│   │   ├── layout.tsx
│   │   ├── my-properties/
│   │   └── analytics/
│   │
│   ├── (admin)/                     # Admin-only routes
│   │   ├── layout.tsx
│   │   ├── users/
│   │   └── moderation/
│   │
│   └── api/                         # API Routes (Proxy to backend)
│       └── [...slug]/route.ts       # Catch-all proxy
│
├── features/                        # 🔥 قلب اصلی
│   │
│   ├── properties/                  # Property Feature
│   │   ├── api/
│   │   │   ├── useProperties.ts     # React Query hooks
│   │   │   ├── useProperty.ts
│   │   │   └── propertyApi.ts       # API calls
│   │   │
│   │   ├── components/
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── PropertyForm.tsx
│   │   │   ├── PropertyFilters.tsx
│   │   │   └── PropertyDetails.tsx
│   │   │
│   │   ├── types/
│   │   │   └── property.types.ts
│   │   │
│   │   ├── utils/
│   │   │   └── property.utils.ts
│   │   │
│   │   └── index.ts                 # Public exports
│   │
│   ├── auth/                        # Auth Feature
│   │   ├── api/
│   │   │   ├── useAuth.ts
│   │   │   └── authApi.ts
│   │   │
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── OTPInput.tsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useRequireAuth.ts
│   │   │
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── engineering/                 # Engineering Services Feature
│   │   ├── api/
│   │   ├── components/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── chat/                        # AI Chat Feature
│   │   ├── api/
│   │   ├── components/
│   │   ├── types/
│   │   └── index.ts
│   │
│   └── support/                     # Support/Ticketing Feature
│       ├── api/
│       ├── components/
│       ├── types/
│       └── index.ts
│
├── shared/                          # Shared resources
│   │
│   ├── components/                  # Shared UI components
│   │   ├── ui/                      # shadcn/ui
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   │
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       └── Pagination.tsx
│   │
│   ├── lib/                         # Shared utilities
│   │   ├── api-client.ts           # Axios/Fetch wrapper
│   │   ├── query-client.ts         # React Query config
│   │   ├── constants.ts
│   │   └── utils.ts
│   │
│   ├── hooks/                       # Shared hooks
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   └── useLocalStorage.ts
│   │
│   └── types/                       # Shared types
│       ├── api.types.ts
│       └── common.types.ts
│
├── config/                          # Configuration
│   ├── env.ts                       # Environment variables
│   └── routes.ts                    # Route definitions
│
└── styles/                          # Global styles
    └── globals.css
```

---

## 🔥 مزایای این معماری

### 1. **Feature-Based Organization**
همه چیز مربوط به یک feature در یک جا:
```typescript
// ✅ همه چیز property در یک جا
features/properties/
  ├── api/          → Data fetching
  ├── components/   → UI
  ├── types/        → TypeScript types
  └── utils/        → Helper functions

// استفاده:
import { PropertyCard, useProperties } from '@/features/properties';
```

### 2. **Clear Separation**
```typescript
features/     → Feature-specific code (قابل جابجایی)
shared/       → Code مشترک بین features
app/          → Routing و pages (UI wrapper)
```

### 3. **Easy to Scale**
```typescript
// اضافه کردن feature جدید:
features/
  └── messaging/     // ✅ فقط یک فولدر جدید
      ├── api/
      ├── components/
      └── types/
```

### 4. **Team Collaboration**
```typescript
// Team Member 1: روی properties کار میکنه
features/properties/

// Team Member 2: روی auth کار میکنه  
features/auth/

// Team Member 3: روی engineering کار میکنه
features/engineering/

// ❌ هیچ conflict ای نمیشه!
```

---

## 💻 مثال‌های عملی

### 1. Property Feature
```typescript
// features/properties/api/useProperties.ts
import { useQuery } from '@tanstack/react-query';
import { propertyApi } from './propertyApi';
import { PropertyFilters } from '../types/property.types';

export function useProperties(filters?: PropertyFilters) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyApi.getAll(filters),
  });
}

// features/properties/api/propertyApi.ts
import { apiClient } from '@/shared/lib/api-client';
import { Property, PropertyFilters } from '../types/property.types';

export const propertyApi = {
  getAll: async (filters?: PropertyFilters) => {
    const { data } = await apiClient.get('/properties', { params: filters });
    return data;
  },
  
  getById: async (id: string) => {
    const { data } = await apiClient.get(`/properties/${id}`);
    return data;
  },
  
  create: async (property: Partial<Property>) => {
    const { data } = await apiClient.post('/properties', property);
    return data;
  },
};

// features/properties/components/PropertyCard.tsx
import { Property } from '../types/property.types';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="card">
      <h3>{property.title}</h3>
      <p>{property.price}</p>
    </div>
  );
}

// features/properties/index.ts (Public API)
export { PropertyCard } from './components/PropertyCard';
export { PropertyForm } from './components/PropertyForm';
export { useProperties, useProperty } from './api/useProperties';
export type { Property, PropertyFilters } from './types/property.types';
```

### 2. Auth Feature
```typescript
// features/auth/api/useAuth.ts
import { useMutation } from '@tanstack/react-query';
import { authApi } from './authApi';

export function useLogin() {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
    },
  });
}

// features/auth/hooks/useRequireAuth.ts
import { useAuth } from '../api/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useRequireAuth() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  return { user, isLoading };
}

// features/auth/index.ts
export { useAuth, useLogin, useLogout } from './api/useAuth';
export { useRequireAuth } from './hooks/useRequireAuth';
export { LoginForm } from './components/LoginForm';
export { AuthProvider } from './context/AuthContext';
```

### 3. استفاده در Pages
```typescript
// app/(public)/properties/page.tsx
import { useProperties } from '@/features/properties';
import { PropertyCard } from '@/features/properties';
import { PropertyFilters } from '@/features/properties';

export default function PropertiesPage() {
  const { data, isLoading } = useProperties();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <PropertyFilters />
      {data?.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
```

---

## 🎯 چرا این معماری برای شما مناسبه؟

### ✅ برای تیم 3 نفره:
1. **واضح و قابل فهم** - هر نفر یک feature می‌گیره
2. **No Conflicts** - هر کس روی فولدر خودش کار میکنه
3. **Fast Onboarding** - نفر جدید سریع یاد میگیره

### ✅ برای پروژه شما:
1. **Scalable** - راحت feature جدید اضافه میشه
2. **Maintainable** - باگ‌ها سریع پیدا میشن
3. **Testable** - هر feature جداگانه تست میشه

### ✅ برای آینده:
1. **Easy to Refactor** - تغییر یک feature بقیه رو خراب نمیکنه
2. **Microservices Ready** - اگه خواستید feature رو جدا کنید راحته
3. **Team Growth** - وقتی تیم 10 نفر شد، همین معماری کار میکنه

---

## 🚀 مراحل مهاجرت (اختیاری)

اگه خواستی به این معماری مهاجرت کنی:

### مرحله 1: ایجاد فولدر features
```bash
mkdir -p src/features/{properties,auth,engineering,chat,support}
```

### مرحله 2: انتقال به تدریج
```
# هفته 1: Property Feature
src/components/PropertyCard.tsx → features/properties/components/
src/services/propertyService.ts → features/properties/api/

# هفته 2: Auth Feature  
src/contexts/AuthContext.tsx → features/auth/context/
src/hooks/useAuthMutations.ts → features/auth/api/

# هفته 3: بقیه features
...
```

### مرحله 3: Public API
هر feature یک `index.ts` داره که export میکنه:
```typescript
// features/properties/index.ts
export * from './components';
export * from './api';
export * from './types';
```

---

## 📊 مقایسه نهایی

| معیار | قدیمی | فعلی | پیشنهادی |
|-------|-------|------|----------|
| سادگی | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| مقیاس‌پذیری | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| تیم‌ورک | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| نگهداری | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| تست‌پذیری | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **کل** | **10/25** | **18/25** | **23/25** |

---

## 💡 نتیجه‌گیری

برای تیم 3 نفره شما:
- ❌ قدیمی: خیلی ساده
- ✅ فعلی: خوبه ولی میشه بهتر
- ⭐ **پیشنهادی: Feature-Based** → بهترین گزینه

این معماری:
- ✅ نه خیلی ساده
- ✅ نه خیلی پیچیده  
- ✅ درست برای تیم 3 نفره
- ✅ آماده برای scale شدن

