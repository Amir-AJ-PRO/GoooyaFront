import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar, 
  Heart, 
  Share2,
  Phone,
  MessageSquare,
  Building2,
  Maximize
} from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
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

export default async function PropertyDetail({ params }: Props) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Mock data - باید از API بیاد
  const property = {
    id,
    title: "آپارتمان مدرن در تهران",
    price: "۸ میلیارد تومان",
    location: "تهران، فرشته",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    yearBuilt: 1402,
    images: [
      "/assets/property-1.jpg",
      "/assets/property-2.jpg",
      "/assets/property-3.jpg",
    ],
    description: "آپارتمان نوساز و مدرن با امکانات کامل در یکی از بهترین مناطق تهران. دارای نورگیری عالی، پارکینگ، انباری و آسانسور. ساختمان دارای لابی مجلل و نگهبانی 24 ساعته می‌باشد.",
    features: [
      "آسانسور",
      "پارکینگ",
      "انباری",
      "بالکن",
      "لابی",
      "نگهبانی 24 ساعته",
      "سیستم گرمایش مرکزی",
      "کولر گازی",
    ],
    agent: {
      name: "محمد رضایی",
      phone: "09123456789",
      image: "/assets/picnew.png",
    },
  };

  return (
    <>
      {/* Hero Images Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[500px]">
          <div className="relative h-[300px] lg:h-full rounded-xl overflow-hidden">
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-[145px] lg:h-full rounded-xl overflow-hidden">
              <Image
                src={property.images[1]}
                alt={property.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-[145px] lg:h-full rounded-xl overflow-hidden">
              <Image
                src={property.images[2]}
                alt={property.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 justify-end">
          <Button variant="outline" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Property Details */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {property.price}
                </Badge>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Bed className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{property.bedrooms}</p>
                    <p className="text-sm text-muted-foreground">اتاق خواب</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Bath className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{property.bathrooms}</p>
                    <p className="text-sm text-muted-foreground">سرویس بهداشتی</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Square className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{property.area}</p>
                    <p className="text-sm text-muted-foreground">متر مربع</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{property.yearBuilt}</p>
                    <p className="text-sm text-muted-foreground">سال ساخت</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">توضیحات</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">امکانات</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Agent Contact */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">تماس با مشاور</h2>
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden bg-secondary">
                    <Building2 className="h-8 w-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">{property.agent.name}</p>
                    <p className="text-sm text-muted-foreground">مشاور املاک</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <Phone className="h-5 w-5 ml-2" />
                    تماس تلفنی
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <MessageSquare className="h-5 w-5 ml-2" />
                    ارسال پیام
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    کد ملک: {property.id}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-6">املاک مشابه</h2>
        <div className="text-center text-muted-foreground py-8">
          <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>املاک مشابه به زودی نمایش داده می‌شود</p>
        </div>
      </section>
    </>
  );
}

