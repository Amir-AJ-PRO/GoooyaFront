import { z } from "zod";

/**
 * Schema برای validation ملک
 */
export const propertySchema = z.object({
  title: z.string()
    .min(5, "عنوان باید حداقل 5 کاراکتر باشد")
    .max(200, "عنوان حداکثر 200 کاراکتر می‌تواند باشد"),
  
  type: z.enum(["apartment", "villa", "townhouse", "commercial"], {
    required_error: "نوع ملک الزامی است",
  }),
  
  price: z.number()
    .positive("قیمت باید مثبت باشد")
    .min(1000000, "قیمت حداقل 1 میلیون تومان است"),
  
  area: z.number()
    .positive("متراژ باید مثبت باشد")
    .min(10, "متراژ حداقل 10 متر مربع است"),
  
  bedrooms: z.number()
    .int("تعداد اتاق باید عدد صحیح باشد")
    .nonnegative("تعداد اتاق نمی‌تواند منفی باشد")
    .max(20, "تعداد اتاق حداکثر 20 است"),
  
  bathrooms: z.number()
    .int("تعداد سرویس باید عدد صحیح باشد")
    .positive("تعداد سرویس باید حداقل 1 باشد")
    .max(10, "تعداد سرویس حداکثر 10 است"),
  
  city: z.string()
    .min(2, "نام شهر باید حداقل 2 کاراکتر باشد"),
  
  location: z.string()
    .min(2, "آدرس باید حداقل 2 کاراکتر باشد"),
  
  description: z.string()
    .min(20, "توضیحات باید حداقل 20 کاراکتر باشد")
    .max(5000, "توضیحات حداکثر 5000 کاراکتر می‌تواند باشد"),
  
  features: z.array(z.string()).optional(),
  
  images: z.array(z.string()).optional(),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

/**
 * Schema برای فیلتر املاک
 */
export const propertyFilterSchema = z.object({
  search: z.string().optional(),
  type: z.enum(["apartment", "villa", "townhouse", "commercial"]).optional(),
  city: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minArea: z.number().optional(),
  maxArea: z.number().optional(),
  bedrooms: z.number().optional(),
  page: z.number().default(1),
  limit: z.number().default(10),
});

export type PropertyFilterData = z.infer<typeof propertyFilterSchema>;

