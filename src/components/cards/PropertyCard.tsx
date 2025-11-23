import Link from "next/link";
import Image from "next/image";
import { MapPin, Bed, Square } from "lucide-react";
import { Card } from "@/components/ui/card";
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
  const imageUrl = mainImage ? `${API_BASE_URL}${mainImage.image}` : '/assets/property-placeholder.jpg';
  
  // محاسبه قیمت برای نمایش
  let priceLabel = '';
  if (property.transaction_type === 'sale') {
    priceLabel = formatPrice(property.price);
  } else {
    priceLabel = `رهن: ${formatPrice(property.mortgage)} / اجاره: ${formatPrice(property.rent)}`;
  }
  
  return (
    <Link href={`/properties/${property.slug}`} prefetch={true}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
        <div className="relative h-56 overflow-hidden">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* بج نوع معامله */}
          <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
            {property.transaction_type === 'sale' ? 'فروش' : 'اجاره'}
          </div>
          
          {/* بج نوع ملک */}
          {typeof property.property_type === 'object' && property.property_type?.title && (
            <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
              {property.property_type.title}
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
            {property.title}
          </h3>
          
          {/* موقعیت */}
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">
              {typeof property.city === 'object' && property.city?.name 
                ? property.city.name 
                : 'نامشخص'}
              {property.location && typeof property.location === 'object' && property.location?.name 
                ? ` - ${property.location.name}` 
                : ''}
            </span>
          </div>
          
          {/* مشخصات */}
          <div className="flex items-center gap-4 text-muted-foreground text-sm mb-3">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.rooms} خواب</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{property.measure} متر</span>
            </div>
          </div>
          
          {/* قیمت */}
          <div className="pt-3 border-t">
            <div className="text-primary font-bold text-sm">
              {priceLabel}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

