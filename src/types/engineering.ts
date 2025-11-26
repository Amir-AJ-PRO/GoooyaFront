/**
 * انواع و interfaces مربوط به خدمات مهندسی
 */

/**
 * انواع خدمات مهندسی (کدهای API)
 */
export type EngineeringServiceType = 
  | 'design'        // طراحی نقشه
  | 'surveying'     // نقشه برداری
  | 'registration'  // کارهای ثبتی
  | 'renovation'    // بازسازی
  | 'construction'  // اجرا و ساخت
  | 'no_violation'  // عدم خلافی
  | 'completion'    // پایان کار
  | 'permit';       // جواز

/**
 * وضعیت‌های درخواست خدمات مهندسی
 */
export type EngineeringTicketStatus = 
  | 'pending'       // در انتظار بررسی
  | 'reviewing'     // در حال بررسی
  | 'contacted'     // تماس گرفته شده
  | 'in_progress'   // در حال انجام
  | 'completed'     // تکمیل شده
  | 'cancelled';    // لغو شده

/**
 * نقشه نام فارسی به کد انگلیسی خدمات
 */
export const SERVICE_NAME_TO_CODE: Record<string, EngineeringServiceType> = {
  'طراحی نقشه': 'design',
  'نقشه برداری': 'surveying',
  'کارهای ثبتی': 'registration',
  'بازسازی': 'renovation',
  'اجرا و ساخت': 'construction',
  'عدم خلافی': 'no_violation',
  'پایان کار': 'completion',
  'جواز': 'permit'
};

/**
 * نقشه کد انگلیسی به نام فارسی خدمات
 */
export const SERVICE_CODE_TO_NAME: Record<EngineeringServiceType, string> = {
  'design': 'طراحی نقشه',
  'surveying': 'نقشه برداری',
  'registration': 'کارهای ثبتی',
  'renovation': 'بازسازی',
  'construction': 'اجرا و ساخت',
  'no_violation': 'عدم خلافی',
  'completion': 'پایان کار',
  'permit': 'جواز'
};

/**
 * نقشه وضعیت‌ها به فارسی
 */
export const STATUS_DISPLAY: Record<EngineeringTicketStatus, string> = {
  'pending': 'در انتظار بررسی',
  'reviewing': 'در حال بررسی',
  'contacted': 'تماس گرفته شده',
  'in_progress': 'در حال انجام',
  'completed': 'تکمیل شده',
  'cancelled': 'لغو شده'
};

/**
 * درخواست ثبت خدمات مهندسی
 */
export interface CreateEngineeringTicketRequest {
  full_name: string;
  phone: string;
  service_type: EngineeringServiceType;
}

/**
 * پاسخ ثبت خدمات مهندسی
 */
export interface CreateEngineeringTicketResponse {
  detail: string;
  ticket: EngineeringTicket;
}

/**
 * تیکت خدمات مهندسی
 */
export interface EngineeringTicket {
  id: number;
  full_name: string;
  phone: string;
  service_type: EngineeringServiceType;
  service_type_display: string;
  status: EngineeringTicketStatus;
  status_display: string;
  user_phone?: string | null;
  created_at: string;
}

/**
 * خطای درخواست تکراری
 */
export interface DuplicateEngineeringTicketError extends Error {
  message: string;
  service_type: EngineeringServiceType;
  service_type_display: string;
}

/**
 * خطای اعتبارسنجی
 */
export interface ValidationError {
  field: string;
  message: string;
}
