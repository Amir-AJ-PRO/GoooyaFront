'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const properties = [
  {
    id: 1,
    title: 'ملک ویلایی دماوند',
    location: 'دماوند، خیابان سپاه',
    area: '۶۷۰ متر مربع',
    bedrooms: '۲ خوابه',
    price: '۱۳,۴۰۰,۰۰۰,۰۰۰',
    currency: 'تومان',
    image: 'https://via.placeholder.com/400x300?text=House+Image', 
  },
  {
    id: 2,
    title: 'ملک ویلایی دماوند',
    location: 'دماوند، خیابان سپاه',
    area: '۶۷۰ متر مربع',
    bedrooms: '۲ خوابه',
    price: '۱۳,۴۰۰,۰۰۰,۰۰۰',
    currency: 'تومان',
    image: 'https://via.placeholder.com/400x300?text=House+Image',
  },
  {
    id: 3,
    title: 'پنت هاوس الهیه',
    location: 'تهران، الهیه',
    area: '۳۵۰ متر مربع',
    bedrooms: '۴ خوابه',
    price: '۴۵,۰۰۰,۰۰۰,۰۰۰',
    currency: 'تومان',
    image: 'https://via.placeholder.com/400x300?text=House+Image',
  },
];

export default function PropertySwiperTablet() {
  return (
    // hidden on mobile, block on sm (640px+), hidden on lg (1024px+)
    <div className="hidden sm:block lg:hidden w-full bg-[#f3f4f6] py-6 px-6 font-sans" dir="rtl">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">املاک ویژه</h2>
        <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          مشاهده همه
        </button>
      </div>

      {/* Swiper Section */}
      <div className="-mx-6 px-6">
        <Swiper
          // Default for sm (640px to 767px)
          slidesPerView={2.2} 
          spaceBetween={20}
          breakpoints={{
            // When window width is >= 768px (md)
            768: {
              slidesPerView: 2.8,
              spaceBetween: 24,
            },
          }}
          className="w-full"
        >
          {properties.map((property) => (
            <SwiperSlide key={property.id} className="pb-4">
              <div className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col select-none">
                <div className="relative w-full h-48 md:h-56">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 px-2.5 py-1 rounded-md text-[11px] font-bold text-teal-600 shadow-sm">
                    LOGO
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-3 text-right">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 line-clamp-1">{property.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{property.location}</p>

                  <div className="flex items-center justify-between mt-2 text-sm text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="font-medium">{property.bedrooms}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M8 20l12-12M4 16l12-12m-4 20L20 8" />
                      </svg>
                      <span className="font-medium">{property.area}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-start gap-2 mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                      {property.price}
                    </span>
                    <span className="text-xs md:text-sm text-gray-500 font-medium">{property.currency}</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
