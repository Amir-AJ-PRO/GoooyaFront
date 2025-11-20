import type { Metadata } from "next";
import { use } from 'react';
import PropertyDetailClient from "./PropertyDetailClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  // در اینجا می‌توانید داده‌های ملک را از API بگیرید
  // برای مثال: const property = await fetchProperty(id);
  
  return {
    title: `آپارتمان مدرن در تهران - کد ${id} | گویا`,
    description: "آپارتمان نوساز و مدرن با امکانات کامل در یکی از بهترین مناطق تهران. دارای نورگیری عالی، پارکینگ، انباری و آسانسور.",
    keywords: ["آپارتمان تهران", "خرید آپارتمان", "ملک تهران", "آپارتمان فرشته", "املاک لوکس"],
    openGraph: {
      title: `آپارتمان مدرن در تهران - کد ${id}`,
      description: "آپارتمان نوساز با امکانات کامل",
      images: [
        {
          url: "/assets/property-1.jpg",
          width: 1200,
          height: 630,
          alt: "آپارتمان مدرن در تهران",
        },
      ],
    },
  };
}

export default function PropertyDetail({ params }: Props) {
  return <PropertyDetailClient params={params} />;
}
