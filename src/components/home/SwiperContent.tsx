"use client"
import React from 'react'
import { SwiperSlide } from 'swiper/react'
import { Swiper } from 'swiper/types'


import Image from 'next/image';
import Link from 'next/link';
import { PropertyListItem } from '@/types/property';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Home,
    MapPin,
    Bed,
    Ruler,
    TrendingUp,
    User
} from 'lucide-react';
import { amountToWords } from '@/lib/numberToWords';
import { API_BASE_URL } from '@/lib/constants';

interface PropertyCardProps {
    property: PropertyListItem;
}



const SwiperContent = ({ property }: PropertyCardProps) => {
    const mainImage = property.images?.find(img => img.is_main) || property.images?.[0];
    const imageUrl = mainImage?.image
        ? (mainImage.image.startsWith('http') ? mainImage.image : `${API_BASE_URL}${mainImage.image.startsWith('/') ? mainImage.image : `/${mainImage.image}`}`)
        : '/placeholder-property.jpg';
        const locationName = typeof property.location === 'object' && property.location !== null
  ? property.location.name
  : property.location;

    return (
        <div>

            {/* Card Component */}
            <div className="bg-white rounded-[24px] overflow-hidden shadow-sm flex flex-col select-none">
                {/* Image */}
                <div className="relative w-full h-52">
                    <Image
                        src={imageUrl}
                        alt={property.title}
                        fill
                        className="object-cover "

                    />
                    {/* Watermark Badge (GOGOYA equivalent) */}
                    <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-teal-600">
                        LOGO
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-3 text-right">
                    <h3 className="text-lg font-bold text-gray-900">{property.title}</h3>
                    <p className="text-sm text-gray-500">{locationName}</p>

                    {/* Details Row */}
                    <div className="flex items-center justify-between mt-2 text-sm text-gray-700">
                        <div className="flex items-center gap-1.5">
                            {/* Bed Icon */}
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span>{property.rooms}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            {/* Ruler Icon */}
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M8 20l12-12M4 16l12-12m-4 20L20 8" />
                            </svg>
                            <span>{property.measure}</span>
                        </div>
                    </div>

                    {/* Price Row */}
                    <div className="flex items-center justify-start gap-2 mt-4">
                        <span className="text-xl font-bold text-gray-900 tracking-tight">
                            {property.price}
                        </span>
                        <span className="text-sm text-gray-600 font-medium">تومان</span>
                    </div>
                </div>
            </div>
        </div>








    )
}
export default SwiperContent