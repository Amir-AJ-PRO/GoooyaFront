# سیستم بررسی و تایید/رد تیکت‌ها

## 📋 خلاصه

این سیستم امکان بررسی، تایید و رد تیکت‌های ثبت ملک توسط مشاوران گویا را فراهم می‌کند.

## 🔗 API Endpoint

```
PATCH /api/tickets/adviser/<ticket_id>/review/
```

### احراز هویت
- نیاز به `Authorization: Bearer <access_token>`
- کاربر باید **مشاور گویا** باشد (`is_goooya_adviser=true`)

## 📥 Request Payload

```typescript
interface ReviewTicketPayload {
  action: 'approve' | 'reject';  // الزامی
  agent_notes?: string;          // اختیاری
}
```

### مثال درخواست تایید:
```json
{
  "action": "approve",
  "agent_notes": "ملک در شرایط خوبی است و آماده انتشار است."
}
```

### مثال درخواست رد:
```json
{
  "action": "reject",
  "agent_notes": "اطلاعات ناقص است. لطفاً با کاربر تماس بگیرید."
}
```

## 📤 Response

### موفقیت (200 OK):
```json
{
  "detail": "تیکت با موفقیت به‌روزرسانی شد.",
  "ticket": {
    "id": 1,
    "title": "آپارتمان 120 متری در منطقه 1",
    "status": "published",
    "property_created": 100,
    "agent_notes": "ملک در شرایط خوبی است و آماده انتشار است.",
    "reviewed_at": "2024-01-15T11:00:00Z"
  }
}
```

### خطاهای ممکن:
- **400 Bad Request**: action نامعتبر یا وضعیت تیکت مناسب نیست
- **401 Unauthorized**: احراز هویت نشده
- **403 Forbidden**: کاربر مشاور گویا نیست
- **404 Not Found**: تیکت یافت نشد

## 💻 پیاده‌سازی در Frontend

### 1. Service Layer (`src/services/ticketAdviserService.ts`)

```typescript
export interface ReviewTicketPayload {
  action: 'approve' | 'reject';
  agent_notes?: string;
}

export const reviewTicket = async (
  ticketId: number,
  payload: ReviewTicketPayload
): Promise<ReviewTicketResponse> => {
  const response = await api.patch(
    `/api/tickets/adviser/${ticketId}/review/`, 
    payload
  );
  return response.data;
};
```

### 2. Hook Layer (`src/hooks/useTicketAdviser.ts`)

```typescript
export const useReviewTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, payload }) => reviewTicket(ticketId, payload),
    onSuccess: (data, variables) => {
      const action = variables.payload.action === 'approve' 
        ? 'تایید و منتشر' 
        : 'رد';
      toast.success(`✅ تیکت با موفقیت ${action} شد`);
      
      // رفرش کش‌ها
      queryClient.invalidateQueries({ queryKey: ['adviserTickets'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'خطا در بررسی تیکت');
    },
  });
};
```

### 3. UI Layer (`src/app/(dashboard)/admin/tickets/[id]/page.tsx`)

```typescript
const reviewMutation = useReviewTicket();
const [agentNotes, setAgentNotes] = useState('');

// تایید
const handleApprove = async () => {
  await reviewMutation.mutateAsync({
    ticketId,
    payload: {
      action: 'approve',
      agent_notes: agentNotes || undefined
    }
  });
  router.push('/admin/tickets');
};

// رد
const handleReject = async () => {
  await reviewMutation.mutateAsync({
    ticketId,
    payload: {
      action: 'reject',
      agent_notes: agentNotes || undefined
    }
  });
  router.push('/admin/tickets');
};
```

## 🔄 جریان کار (Workflow)

```
1. مشاور وارد صفحه جزئیات تیکت می‌شود
   ↓
2. تصاویر و اطلاعات ملک را بررسی می‌کند
   ↓
3. (اختیاری) یادداشتی در بخش "یادداشت مشاور" می‌نویسد
   ↓
4. یکی از دکمه‌های زیر را کلیک می‌کند:
   • "✅ تایید و انتشار ملک" → action: 'approve'
   • "❌ رد تیکت" → action: 'reject'
   ↓
5. دیالوگ تایید نهایی باز می‌شود
   ↓
6. پس از تایید:
   • API فراخوانی می‌شود
   • در صورت موفقیت:
     - تایید → ملک در سیستم ایجاد و منتشر می‌شود (status: published)
     - رد → تیکت بسته می‌شود (status: rejected)
   • Toast موفقیت نشان داده می‌شود
   • بازگشت به صفحه لیست تیکت‌ها
```

## ✅ تست‌ها

### تست موفق - تایید تیکت:
```typescript
const payload = {
  action: 'approve',
  agent_notes: 'ملک در شرایط خوبی است'
};

await reviewTicket(123, payload);
// انتظار: status: 'published', property_created موجود باشد
```

### تست موفق - رد تیکت:
```typescript
const payload = {
  action: 'reject',
  agent_notes: 'اطلاعات ناقص است'
};

await reviewTicket(123, payload);
// انتظار: status: 'rejected'
```

### تست خطا - action نامعتبر:
```typescript
const payload = {
  action: 'invalid',  // ❌
  agent_notes: 'test'
};

await reviewTicket(123, payload);
// انتظار: 400 Bad Request
```

## 📊 وضعیت‌های تیکت (Status Flow)

```
pending → assigned → reviewing → approved → published ✅
                              ↘ rejected ❌
```

## 🎯 نکات مهم

1. ✅ **تایید**:
   - ملک به صورت **خودکار** در سیستم `Properties` ایجاد می‌شود
   - تصاویر تیکت به ملک کپی می‌شوند
   - وضعیت به `published` تغییر می‌کند
   - `property_created` آی‌دی ملک ایجاد شده را نگه می‌دارد

2. ❌ **رد**:
   - تیکت بسته می‌شود (status: `rejected`)
   - ملکی ایجاد نمی‌شود
   - کاربر می‌تواند تیکت جدیدی ایجاد کند

3. 📝 **یادداشت مشاور**:
   - اختیاری است اما **توصیه می‌شود** (خصوصاً برای رد)
   - در `agent_notes` ذخیره می‌شود
   - در پنل مدیریت قابل مشاهده است

4. 🔒 **امنیت**:
   - فقط مشاوران گویا (`is_goooya_adviser=true`) می‌توانند تیکت را بررسی کنند
   - احراز هویت با Bearer Token الزامی است
   - تیکت باید به همان مشاور اختصاص یافته باشد

## 🐛 عیب‌یابی (Troubleshooting)

### مشکل: "403 Forbidden"
**راه‌حل**: بررسی کنید که:
- کاربر لاگین باشد
- `is_goooya_adviser=true` باشد
- `is_verified=true` باشد

### مشکل: "400 Bad Request - وضعیت تیکت مناسب نیست"
**راه‌حل**: فقط تیکت‌هایی با وضعیت `assigned` یا `reviewing` قابل بررسی هستند

### مشکل: "404 Not Found"
**راه‌حل**: بررسی کنید که:
- `ticketId` صحیح باشد
- تیکت به همین مشاور اختصاص یافته باشد

---

**آخرین بروزرسانی**: 2024-01-15
**نسخه**: 1.0.0

