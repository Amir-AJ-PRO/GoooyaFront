import { z } from "zod";

/**
 * Schema برای validation شماره تلفن
 */
export const phoneSchema = z.string()
  .regex(/^09\d{9}$/, "شماره تلفن باید به صورت 09xxxxxxxxx باشد");

/**
 * Schema برای OTP
 */
export const otpSchema = z.object({
  phone: phoneSchema,
  code: z.string()
    .length(6, "کد تایید باید 6 رقم باشد")
    .regex(/^\d+$/, "کد تایید فقط باید شامل اعداد باشد"),
});

/**
 * Schema برای بروزرسانی پروفایل
 */
export const userProfileSchema = z.object({
  name: z.string()
    .min(2, "نام باید حداقل 2 کاراکتر باشد")
    .max(100, "نام حداکثر 100 کاراکتر می‌تواند باشد")
    .optional(),
  
  email: z.string()
    .email("ایمیل معتبر نیست")
    .optional()
    .or(z.literal("")),
  
  company: z.string()
    .min(2, "نام شرکت باید حداقل 2 کاراکتر باشد")
    .max(100, "نام شرکت حداکثر 100 کاراکتر می‌تواند باشد")
    .optional(),
  
  licenseNumber: z.string()
    .min(5, "شماره پروانه باید حداقل 5 کاراکتر باشد")
    .max(50, "شماره پروانه حداکثر 50 کاراکتر می‌تواند باشد")
    .optional(),
});

export type UserProfileData = z.infer<typeof userProfileSchema>;

/**
 * Schema برای تماس
 */
export const contactSchema = z.object({
  name: z.string()
    .min(2, "نام باید حداقل 2 کاراکتر باشد")
    .max(100, "نام حداکثر 100 کاراکتر می‌تواند باشد"),
  
  phone: phoneSchema,
  
  email: z.string()
    .email("ایمیل معتبر نیست")
    .optional()
    .or(z.literal("")),
  
  subject: z.string()
    .min(5, "موضوع باید حداقل 5 کاراکتر باشد")
    .max(200, "موضوع حداکثر 200 کاراکتر می‌تواند باشد"),
  
  message: z.string()
    .min(20, "پیام باید حداقل 20 کاراکتر باشد")
    .max(2000, "پیام حداکثر 2000 کاراکتر می‌تواند باشد"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

