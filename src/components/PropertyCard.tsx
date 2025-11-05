'use client';

import Link from "next/link";
import Image from "next/image";
import { MapPin, Bed, Square } from "lucide-react";
import { Card } from "@/components/ui/card";
import { memo } from "react";

interface PropertyCardProps {
  id: number;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  area: number;
  image: string;
}

const PropertyCard = memo(({ id, title, price, location, bedrooms, area, image }: PropertyCardProps) => {
  return (
    <Link href={`/property/${id}`} prefetch={true}>
      <Card className="overflow-hidden hover:shadow-large transition-smooth cursor-pointer group">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={image}
            alt={title}
            width={400}
            height={300}
            className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q=="
          />
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm font-semibold">
            {price}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{title}</h3>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{bedrooms} خواب</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{area} متر</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
});

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;
