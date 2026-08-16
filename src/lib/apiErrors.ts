/**
 * پارس و نمایش خوانای خطاهای اعتبارسنجی Django REST Framework
 * فرمت‌های رایج:
 * - { "title": ["This field is required."] }
 * - { "detail": "..." }
 * - { "non_field_errors": ["..."] }
 * - { "error": "..." }
 */

const FIELD_LABELS: Record<string, string> = {
  title: 'عنوان',
  slug: 'اسلاگ (آدرس)',
  property_type: 'نوع ملک',
  city: 'شهر',
  location: 'منطقه',
  address: 'آدرس',
  measure: 'متراژ',
  rooms: 'تعداد خواب',
  year_built: 'سال ساخت',
  floor: 'طبقه',
  document_type: 'نوع سند',
  transaction_type: 'نوع معامله',
  price: 'قیمت',
  mortgage: 'رهن',
  rent: 'اجاره',
  price_per_meter: 'قیمت هر متر',
  agreed_price: 'قیمت توافقی',
  exchange: 'معاوضه',
  urgent: 'فروش فوری',
  under_price: 'زیر قیمت',
  description: 'توضیحات',
  uploaded_images: 'تصاویر',
  main_image_index: 'تصویر اصلی',
  full_name: 'نام و نام خانوادگی',
  phone: 'شماره تماس',
  national_id: 'کد ملی',
  license_number: 'شماره پروانه کسب',
  office_name: 'نام دفتر',
  office_address: 'آدرس دفتر',
  office_phone: 'تلفن دفتر',
  region: 'منطقه',
  years_of_experience: 'سال سابقه کار',
  specialties: 'تخصص‌ها',
  bio: 'توضیحات',
  user: 'کاربر',
  has_parking: 'پارکینگ',
  has_storage: 'انباری',
  has_elevator: 'آسانسور',
  has_balcony: 'بالکن',
  has_pool: 'استخر',
  has_security: 'نگهبانی',
  has_gas: 'گاز',
  has_electricity: 'برق',
  has_water: 'آب',
  has_phone: 'تلفن',
  show_status: 'وضعیت نمایش',
  non_field_errors: 'خطا',
  detail: 'جزئیات',
  error: 'خطا',
  message: 'پیام',
  raw: 'پاسخ سرور',
};

const MESSAGE_TRANSLATIONS: Array<[RegExp, string]> = [
  [/this field is required\.?/i, 'این فیلد الزامی است'],
  [/this field may not be (blank|null)\.?/i, 'این فیلد نمی‌تواند خالی باشد'],
  [/ensure this value has at most (\d+)/i, 'حداکثر طول مجاز $1 کاراکتر است'],
  [/ensure this value has at least (\d+)/i, 'حداقل طول مجاز $1 کاراکتر است'],
  [/a valid number is required\.?/i, 'یک عدد معتبر وارد کنید'],
  [/a valid integer is required\.?/i, 'یک عدد صحیح وارد کنید'],
  [/enter a valid/i, 'مقدار وارد شده معتبر نیست'],
  [/already exists/i, 'این مقدار قبلاً ثبت شده است'],
  [/invalid pk/i, 'شناسه انتخاب‌شده معتبر نیست'],
  [/object does not exist/i, 'مورد انتخاب‌شده یافت نشد'],
  [/not a valid choice/i, 'گزینه انتخاب‌شده معتبر نیست'],
  [/incorrect type/i, 'نوع داده نادرست است'],
  [/expected a list/i, 'باید به‌صورت لیست ارسال شود'],
  [/no file was submitted/i, 'فایلی ارسال نشده است'],
  [/the submitted data was not a file/i, 'داده ارسالی فایل معتبر نیست'],
  [/upload a valid image/i, 'یک تصویر معتبر آپلود کنید'],
  [/ensure that there are no more than/i, 'تعداد ارقام اعشار بیش از حد مجاز است'],
  [/بیشتر از 10 رقم/i, 'بیش از ۱۰ رقم مجاز نیست — متراژ را به متر وارد کنید، نه قیمت'],
  [/string did not match the expected pattern/i, 'فرمت وارد شده صحیح نیست'],
];

function translateMessage(message: string): string {
  const trimmed = message.trim();
  for (const [pattern, replacement] of MESSAGE_TRANSLATIONS) {
    if (pattern.test(trimmed)) {
      return trimmed.replace(pattern, replacement);
    }
  }
  return trimmed;
}

function fieldLabel(field: string): string {
  return FIELD_LABELS[field] || field;
}

function normalizeMessages(value: unknown): string[] {
  if (value === null || value === undefined) return [];
  if (typeof value === 'string') return [translateMessage(value)];
  if (typeof value === 'number' || typeof value === 'boolean') {
    return [String(value)];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => normalizeMessages(item));
  }
  if (typeof value === 'object') {
    // DRF nested: { "msg": "...", "code": "..." } یا آبجکت فیلدهای تو در تو
    const obj = value as Record<string, unknown>;
    if (typeof obj.msg === 'string') return [translateMessage(obj.msg)];
    if (typeof obj.message === 'string') return [translateMessage(obj.message)];
    if (typeof obj.detail === 'string') return [translateMessage(obj.detail)];

    const nested: string[] = [];
    for (const [key, nestedValue] of Object.entries(obj)) {
      const msgs = normalizeMessages(nestedValue);
      for (const msg of msgs) {
        nested.push(`${fieldLabel(key)}: ${msg}`);
      }
    }
    return nested;
  }
  return [String(value)];
}

/**
 * تبدیل body خطای API به متن خوانا برای کاربر
 */
export function formatApiValidationError(
  data: unknown,
  fallback = 'داده‌های وارد شده نامعتبر است'
): string {
  if (data === null || data === undefined) return fallback;

  if (typeof data === 'string') {
    const text = data.trim();
    if (!text) return fallback;
    // اگر HTML برگشته (صفحه خطای Django)
    if (text.startsWith('<!') || text.startsWith('<html')) {
      return fallback;
    }
    return translateMessage(text);
  }

  if (typeof data !== 'object') {
    return translateMessage(String(data));
  }

  const obj = data as Record<string, unknown>;
  const lines: string[] = [];

  // اولویت: detail / error / message سطح بالا
  if (obj.detail !== undefined) {
    const detailMsgs = normalizeMessages(obj.detail);
    if (detailMsgs.length === 1 && !detailMsgs[0].includes(':')) {
      lines.push(detailMsgs[0]);
    } else {
      lines.push(...detailMsgs);
    }
  }

  if (typeof obj.error === 'string') {
    lines.push(translateMessage(obj.error));
  } else if (obj.error && typeof obj.error === 'object') {
    lines.push(...normalizeMessages(obj.error));
  }

  if (typeof obj.message === 'string' && obj.message !== obj.error) {
    lines.push(translateMessage(obj.message));
  }

  if (typeof obj.details === 'string') {
    lines.push(translateMessage(obj.details));
  }

  // فیلدهای اعتبارسنجی DRF: { field: ["msg"] }
  const skipKeys = new Set([
    'detail',
    'error',
    'message',
    'details',
    'raw',
    'status',
    'statusCode',
  ]);

  for (const [field, value] of Object.entries(obj)) {
    if (skipKeys.has(field)) continue;
    const msgs = normalizeMessages(value);
    for (const msg of msgs) {
      // اگر خودش از قبل "فیلد: پیام" باشد تکراری نساز
      if (msg.startsWith(`${fieldLabel(field)}:`)) {
        lines.push(msg);
      } else {
        lines.push(`${fieldLabel(field)}: ${msg}`);
      }
    }
  }

  // حذف تکراری‌ها با حفظ ترتیب
  const unique = [...new Set(lines.map((l) => l.trim()).filter(Boolean))];
  if (unique.length === 0) return fallback;

  return unique.join('\n');
}

/**
 * نسخه تک‌خطی برای toastهایی که newline را خوب نشان نمی‌دهند
 */
export function formatApiValidationErrorInline(
  data: unknown,
  fallback = 'داده‌های وارد شده نامعتبر است'
): string {
  return formatApiValidationError(data, fallback).replace(/\n/g, ' | ');
}
