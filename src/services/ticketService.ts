import { formatApiValidationErrorInline } from '@/lib/apiErrors';

/**
 * Types برای Ticket API
 * هم‌راستا با TicketPropertyFullRequestCreate / TicketPropertySimpleRequest
 */

export interface SimpleTicketPayload {
  full_name?: string;
  phone?: string;
  is_referral?: boolean;
}

export interface SimpleTicketResponse {
  detail: string;
  ticket: {
    id: number;
    full_name: string;
    phone: string | null;
    is_referral: boolean;
    referral_code: string | null;
    status: string;
    created_at: string;
  };
  referral_code?: string;
}

export interface FullTicketPayload {
  title: string;
  property_type: number;
  city: number;
  location?: number;
  address?: string;
  measure: number | string;
  rooms?: number;
  year_built?: number;
  floor?: string;
  document_type?: string;
  transaction_type: 'sale' | 'rent';
  price?: number;
  mortgage?: number;
  rent?: number;
  price_per_meter?: number;
  agreed_price?: boolean;
  exchange?: boolean;
  urgent?: boolean;
  under_price?: boolean;
  description?: string;
  uploaded_images?: File[];
  main_image_index?: number;
  /** فقط برای نمایش در فرم — در اسکیمای full ارسال نمی‌شود */
  full_name?: string;
  phone?: string;
  // Features (مطابق اسکیمای API)
  has_parking?: boolean;
  has_storage?: boolean;
  has_elevator?: boolean;
  has_balcony?: boolean;
  has_pool?: boolean;
  has_jacuzzi?: boolean;
  has_sauna?: boolean;
  has_security?: boolean;
  has_janitor?: boolean;
  has_conference_hall?: boolean;
  has_gas?: boolean;
  has_electricity?: boolean;
  has_water?: boolean;
  has_phone?: boolean;
  has_wastewater?: boolean;
  has_license?: boolean;
  double_glazed_windows?: boolean;
  sound_insulation?: boolean;
  has_well?: boolean;
}

export interface FullTicketResponse {
  detail: string;
  ticket: {
    id: number;
    title: string;
    status: string;
    city: number;
    city_name: string;
    location: number | null;
    location_name: string | null;
    property_type: number;
    property_type_title: string;
    measure: number;
    rooms: number;
    price: number | null;
    transaction_type: string;
    assigned_agent: number | null;
    assigned_agent_name: string | null;
    assigned_at: string | null;
    created_at: string;
  };
}

/** مطابق TicketPropertyFullRequestCreate: حداکثر ۸ رقم صحیح + ۲ رقم اعشار */
const MEASURE_API_PATTERN = /^\d{1,8}(\.\d{1,2})?$/;

export function normalizeMeasureValue(
  value: unknown
): { ok: true; value: string } | { ok: false; error: string } {
  if (value === undefined || value === null || value === '') {
    return { ok: false, error: 'متراژ الزامی است' };
  }

  const raw = String(value).trim().replace(/,/g, '');
  if (!raw) {
    return { ok: false, error: 'متراژ الزامی است' };
  }

  if (!/^\d+(\.\d+)?$/.test(raw)) {
    return { ok: false, error: 'متراژ باید عدد معتبر باشد (مثلاً 120 یا 120.5)' };
  }

  const [intPart, decPart = ''] = raw.split('.');
  if (intPart.length > 8) {
    return {
      ok: false,
      error: 'متراژ نباید بیش از ۸ رقم صحیح داشته باشد. لطفاً متراژ را به متر وارد کنید، نه قیمت.',
    };
  }
  if (decPart.length > 2) {
    return { ok: false, error: 'متراژ حداکثر ۲ رقم اعشار دارد' };
  }

  const normalized = decPart ? `${intPart}.${decPart}` : intPart;
  if (!MEASURE_API_PATTERN.test(normalized)) {
    return { ok: false, error: 'متراژ وارد شده معتبر نیست' };
  }

  return { ok: true, value: normalized };
}

export function parseOptionalIntField(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed =
    typeof value === 'number'
      ? value
      : parseInt(String(value).replace(/,/g, ''), 10);
  if (Number.isNaN(parsed)) return undefined;
  return parsed;
}

const appendField = (formData: FormData, key: string, value: unknown) => {
  if (value === undefined || value === null || value === '') return;
  if (typeof value === 'number' && Number.isNaN(value)) return;
  if (typeof value === 'boolean') {
    formData.append(key, value ? 'true' : 'false');
    return;
  }
  formData.append(key, String(value));
};

/**
 * ثبت تیکت ساده
 */
export const submitSimpleTicket = async (
  payload: SimpleTicketPayload
): Promise<SimpleTicketResponse> => {
  const response = await fetch('/api/proxy/api/tickets/simple/', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      formatApiValidationErrorInline(data, 'خطا در ثبت درخواست')
    );
  }
  return data;
};

/**
 * ساخت FormData مطابق TicketPropertyFullRequestCreate
 */
export const createFullTicketFormData = (payload: FullTicketPayload): FormData => {
  const formData = new FormData();

  const measureResult = normalizeMeasureValue(payload.measure);
  if (!measureResult.ok) {
    throw new Error(measureResult.error);
  }

  // فیلدهای اجباری (طبق docs)
  formData.append('title', payload.title.trim());
  formData.append('property_type', String(payload.property_type));
  formData.append('city', String(payload.city));
  formData.append('measure', measureResult.value);
  formData.append('transaction_type', payload.transaction_type);

  appendField(formData, 'location', payload.location);
  appendField(formData, 'address', payload.address);
  appendField(formData, 'rooms', payload.rooms ?? 0);
  appendField(formData, 'year_built', payload.year_built);
  appendField(formData, 'floor', payload.floor);
  appendField(formData, 'document_type', payload.document_type);
  appendField(formData, 'price', payload.price);
  appendField(formData, 'mortgage', payload.mortgage);
  appendField(formData, 'rent', payload.rent);
  appendField(formData, 'price_per_meter', payload.price_per_meter);
  appendField(formData, 'agreed_price', payload.agreed_price);
  appendField(formData, 'exchange', payload.exchange);
  appendField(formData, 'urgent', payload.urgent);
  appendField(formData, 'under_price', payload.under_price);
  appendField(formData, 'description', payload.description);

  const featureKeys = [
    'has_parking',
    'has_storage',
    'has_elevator',
    'has_balcony',
    'has_pool',
    'has_jacuzzi',
    'has_sauna',
    'has_security',
    'has_janitor',
    'has_conference_hall',
    'has_gas',
    'has_electricity',
    'has_water',
    'has_phone',
    'has_wastewater',
    'has_license',
    'double_glazed_windows',
    'sound_insulation',
    'has_well',
  ] as const;

  for (const key of featureKeys) {
    appendField(formData, key, payload[key]);
  }

  if (payload.uploaded_images && payload.uploaded_images.length > 0) {
    payload.uploaded_images.forEach((file) => {
      formData.append('uploaded_images', file);
    });
    formData.append(
      'main_image_index',
      String(payload.main_image_index ?? 0)
    );
  }

  return formData;
};

function parseTicketError(data: unknown, fallback: string): string {
  return formatApiValidationErrorInline(data, fallback);
}

/**
 * ثبت تیکت کامل — از route اختصاصی با فوروارد خام multipart
 */
export const submitFullTicket = async (
  payload: FullTicketPayload
): Promise<FullTicketResponse> => {
  if (!payload.title?.trim()) {
    throw new Error('عنوان ملک الزامی است');
  }
  if (!payload.property_type) {
    throw new Error('نوع ملک الزامی است');
  }
  if (!payload.city) {
    throw new Error('شهر الزامی است');
  }
  const measureResult = normalizeMeasureValue(payload.measure);
  if (!measureResult.ok) {
    throw new Error(measureResult.error);
  }
  if (!payload.transaction_type) {
    throw new Error('نوع معامله الزامی است');
  }

  const formData = createFullTicketFormData(payload);

  const response = await fetch('/api/tickets/full/', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  let data: unknown;
  try {
    data = await response.json();
  } catch (parseError) {
    console.error('❌ [submitFullTicket] Failed to parse response JSON', {
      status: response.status,
      statusText: response.statusText,
      parseError,
    });
    throw new Error(
      response.ok
        ? 'پاسخ نامعتبر از سرور'
        : `خطای سرور (${response.status}). لطفاً دوباره تلاش کنید.`
    );
  }

  if (!response.ok) {
    const message = parseTicketError(
      data,
      `خطا در ثبت درخواست (${response.status})`
    );
    console.error('❌ [submitFullTicket] API error', {
      status: response.status,
      statusText: response.statusText,
      url: '/api/tickets/full/',
      responseBody: data,
      message,
    });
    throw new Error(message);
  }

  return data as FullTicketResponse;
};

export default {
  submitSimpleTicket,
  submitFullTicket,
};
