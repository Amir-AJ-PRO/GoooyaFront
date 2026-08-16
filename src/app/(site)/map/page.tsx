import type { Metadata } from "next";
import MapClientWrapper from "./MapClientWrapper";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "نقشه املاک شرق تهران",
  description: "جستجوی ملک روی نقشه در دماوند، پردیس و شرق تهران. انتخاب شهر و محله و مشاهده آگهی‌های خرید و اجاره.",
  path: "/map",
  image: "/assets/property-1.jpg",
  keywords: ["نقشه املاک", "جستجوی ملک روی نقشه", "املاک دماوند", "املاک پردیس"],
});

export default function Map() {
  return <MapClientWrapper />;
}
