/**
 * ثوابت پروژه
 */

export const APP_NAME = "گویا";
export const APP_DESCRIPTION = "پلتفرم املاک فارسی";

/**
 * دریافت Base URL از environment variable
 * این تابع در هر دو client-side و server-side کار می‌کند
 */
export function getApiBaseUrl(): string {
  // در server-side و client-side هر دو از NEXT_PUBLIC_API_URL استفاده می‌کنیم
  return process.env.NEXT_PUBLIC_API_URL || "https://goooya.api.ir";
}

/**
 * Base URL برای API - برای استفاده مستقیم
 * @deprecated بهتر است از getApiBaseUrl() استفاده کنید
 */
export const API_BASE_URL = getApiBaseUrl();

export const PHONE_REGEX = /^09\d{9}$/;
export const OTP_LENGTH = 6;
export const OTP_EXPIRY_TIME = 120; // seconds

export const PROPERTY_TYPES = {
  APARTMENT: "apartment",
  VILLA: "villa",
  TOWNHOUSE: "townhouse",
  COMMERCIAL: "commercial",
} as const;

export const USER_TYPES = {
  USER: "user",
  AGENT: "agent",
  ADMIN: "admin",
} as const;

export const PROPERTY_STATUS = {
  ACTIVE: "active",
  PENDING: "pending",
  SOLD: "sold",
  REJECTED: "rejected",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const BRAND_COLORS = {
  PRIMARY: "#4ECDC4", // رنگ سبز-آبی لوگو
  SECONDARY: "#4A5568", // رنگ خاکستری تیره لوگو
  SUCCESS: "#4ECDC4",
  WARNING: "#F6AD55",
  ERROR: "#E53E3E",
} as const;

