/**
 * داده‌های ساختگی برای تست
 */

import { PropertyListItem } from "@/types/property";

export const mockProperties: PropertyListItem[] = [
  {
    id: 1,
    title: "آپارتمان مدرن در تهران",
    price: "۸ میلیارد تومان",
    location: "تهران، فرشته",
    bedrooms: 3,
    area: 120,
    image: "/assets/property-1.jpg",
  },
  {
    id: 2,
    title: "ویلا لوکس با باغ",
    price: "۱۵ میلیارد تومان",
    location: "تهران، لواسان",
    bedrooms: 4,
    area: 300,
    image: "/assets/property-2.jpg",
  },
  {
    id: 3,
    title: "تاون‌هاوس مدرن",
    price: "۶ میلیارد تومان",
    location: "تهران، پونک",
    bedrooms: 2,
    area: 150,
    image: "/assets/property-3.jpg",
  },
];

