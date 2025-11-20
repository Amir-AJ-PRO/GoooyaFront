import type { Metadata } from "next";
import MapClientWrapper from "./MapClientWrapper";

export const metadata: Metadata = {
  title: "نقشه ایران - جستجوی املاک بر اساس موقعیت | گویا",
  description: "با استفاده از نقشه تعاملی ایران، استان و شهر مورد نظر خود را انتخاب کنید و املاک آن منطقه را مشاهده کنید.",
  keywords: ["نقشه املاک", "جستجو بر اساس موقعیت", "املاک استان", "املاک شهر", "نقشه تعاملی"],
  openGraph: {
    title: "نقشه ایران - جستجوی املاک بر اساس موقعیت",
    description: "انتخاب استان و شهر از روی نقشه برای مشاهده املاک",
    images: [
      {
        url: "/assets/property-1.jpg",
        width: 1200,
        height: 630,
        alt: "نقشه املاک ایران",
      },
    ],
  },
};

export default function Map() {
  return <MapClientWrapper />;
}
