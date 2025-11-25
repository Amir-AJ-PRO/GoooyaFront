import Link from "next/link";
import Image from "next/image";
import { MapPin, Bed, Square, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PropertyListItem } from "@/types/property";
import { API_BASE_URL } from "@/lib/constants";

interface PropertyCardProps {
  property: PropertyListItem;
}

// فرمت قیمت به تومان
const formatPrice = (price?: number): string => {
  if (!price) return 'توافقی';
  
  if (price >= 1000000000) {
    return `${(price / 1000000000).toFixed(1)} میلیارد`;
  } else if (price >= 1000000) {
    return `${(price / 1000000).toFixed(0)} میلیون`;
  }
  return price.toLocaleString('fa-IR');
};

export default function PropertyCard({ property }: PropertyCardProps) {
  // چک کردن وجود property
  if (!property) {
    return null;
  }
  
  const mainImage = property.images?.find(img => img.is_main) || property.images?.[0];
  
  // ساخت URL تصویر - اگر URL کامل است (شروع با http/https)، از همان استفاده می‌کنیم
  // در غیر این صورت، API_BASE_URL را اضافه می‌کنیم
  let imageUrl = '/assets/property-placeholder.jpg';
  if (mainImage?.image) {
    if (mainImage.image.startsWith('http://') || mainImage.image.startsWith('https://')) {
      imageUrl = mainImage.image;
    } else {
      // اگر URL نسبی است، باید با / شروع شود
      const imagePath = mainImage.image.startsWith('/') ? mainImage.image : `/${mainImage.image}`;
      imageUrl = `${API_BASE_URL}${imagePath}`;
    }
  }
  
  // محاسبه قیمت برای نمایش
  let priceLabel = '';
  if (property.transaction_type === 'sale') {
    priceLabel = formatPrice(property.price);
  } else {
    priceLabel = `رهن: ${formatPrice(property.mortgage)} / اجاره: ${formatPrice(property.rent)}`;
  }
  
  return (
    <Link href={`/properties/${property.slug}`} prefetch={true}>
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 hover:border-primary/50 h-full flex flex-col">
        {/* تصویر */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* بج نوع معامله */}
          <Badge 
            className={`absolute top-3 left-3 px-3 py-1.5 text-xs font-bold shadow-lg ${
              property.transaction_type === 'sale' 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {property.transaction_type === 'sale' ? '💰 فروش' : '🏠 اجاره'}
          </Badge>
          
          {/* تعداد تصاویر */}
          {property.images && property.images.length > 1 && (
            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-full">
              {property.images.length} تصویر
            </div>
          )}
        </div>
        
        {/* محتوا */}
        <div className="p-5 flex-1 flex flex-col">
          {/* عنوان */}
          <h3 className="font-bold text-lg mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          
          {/* موقعیت */}
          <div className="flex items-start gap-2 text-muted-foreground text-sm mb-4">
            <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
            <span className="line-clamp-2 flex-1">
              {typeof property.city === 'string' 
                ? property.city 
                : (typeof property.city === 'object' && property.city?.name 
                  ? property.city.name 
                  : 'نامشخص')}
              {property.location && (typeof property.location === 'string' 
                ? `، ${property.location}` 
                : (typeof property.location === 'object' && property.location?.name
                  ? `، ${property.location.name}` 
                  : ''))}
            </span>
          </div>
          
          {/* مشخصات */}
          <div className="flex items-center gap-4 text-muted-foreground text-sm mb-4 pb-4 border-b">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Bed className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">{property.rooms} خواب</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Square className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">{property.measure} متر</span>
            </div>
          </div>
          
          {/* قیمت */}
          <div className="mt-auto pt-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">قیمت</p>
                <p className="text-lg font-bold text-primary">
                  {priceLabel}
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

