/**
 * مثال‌هایی از نحوه استفاده از کامپوننت‌های علاقه‌مندی‌ها
 * این فایل فقط برای مرجع است و در production استفاده نمی‌شود
 */

import React from 'react';
import {
  FavoriteButton,
  FavoriteButtonSmall,
  FavoriteButtonLarge,
  FavoritePropertyCard,
  FavoritesStats,
  FavoritesPage
} from './index';

// مثال استفاده از دکمه‌های مختلف علاقه‌مندی
export const FavoriteButtonExamples = () => {
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">دکمه‌های علاقه‌مندی</h2>
      
      {/* دکمه کوچک */}
      <div>
        <h3 className="font-semibold mb-2">دکمه کوچک (برای کارت‌ها)</h3>
        <FavoriteButtonSmall propertyId={123} isFavorite={false} />
      </div>
      
      {/* دکمه متوسط */}
      <div>
        <h3 className="font-semibold mb-2">دکمه متوسط</h3>
        <FavoriteButton 
          propertyId={123} 
          isFavorite={true} 
          size="md" 
          variant="outline" 
        />
      </div>
      
      {/* دکمه بزرگ با متن */}
      <div>
        <h3 className="font-semibold mb-2">دکمه بزرگ (برای صفحه جزئیات)</h3>
        <FavoriteButtonLarge propertyId={123} isFavorite={false} />
      </div>
      
      {/* دکمه قابل تنظیم */}
      <div>
        <h3 className="font-semibold mb-2">دکمه قابل تنظیم</h3>
        <FavoriteButton
          propertyId={123}
          isFavorite={true}
          size="lg"
          variant="default"
          showText={true}
          className="bg-red-500 hover:bg-red-600"
        />
      </div>
    </div>
  );
};

// مثال استفاده از کارت ملک در علاقه‌مندی‌ها
export const FavoritePropertyCardExample = () => {
  const sampleFavorite = {
    id: 1,
    property_id: 123,
    property_title: "آپارتمان 120 متری در تهران",
    property_price: 5500000000,
    property_address: "تهران، ولنجک، خیابان فردوسی",
    property_city: "تهران",
    property_type: "آپارتمان",
    main_image: "/assets/property-1.jpg",
    created_at: "2024-01-15T10:30:00Z"
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">کارت ملک در علاقه‌مندی‌ها</h2>
      <FavoritePropertyCard favorite={sampleFavorite} />
    </div>
  );
};

// مثال استفاده از آمار علاقه‌مندی‌ها
export const FavoritesStatsExample = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">آمار علاقه‌مندی‌ها</h2>
      <FavoritesStats />
    </div>
  );
};

// مثال صفحه کامل علاقه‌مندی‌ها
export const FavoritesPageExample = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">صفحه کامل علاقه‌مندی‌ها</h2>
      <FavoritesPage />
    </div>
  );
};

// مثال استفاده در کامپوننت دیگر
export const PropertyCardWithFavorite = () => {
  const sampleProperty = {
    id: 123,
    title: "آپارتمان 120 متری در تهران",
    slug: "apartment-120-tehran",
    measure: "120",
    rooms: 3,
    price: 5500000000,
    transaction_type: "sale" as const,
    city: "تهران",
    location: "ولنجک",
    property_type: "آپارتمان",
    images: [
      {
        id: 1,
        image: "/assets/property-1.jpg",
        is_main: true
      }
    ],
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
    is_favorite: false // این فیلد مهم است
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">کارت ملک با دکمه علاقه‌مندی</h2>
      <div className="relative">
        {/* کارت ملک */}
        <div className="border rounded-lg p-4">
          <h3 className="font-bold">{sampleProperty.title}</h3>
          <p className="text-gray-600">{sampleProperty.city}</p>
          
          {/* دکمه علاقه‌مندی در گوشه */}
          <FavoriteButtonSmall 
            propertyId={sampleProperty.id} 
            isFavorite={sampleProperty.is_favorite}
            className="absolute top-2 left-2"
          />
        </div>
      </div>
    </div>
  );
};

// مثال استفاده از hooks
export const FavoritesHooksExample = () => {
  // این کد فقط برای نمایش است - در کامپوننت واقعی استفاده کنید
  
  /*
  import { useFavorites, useToggleFavorite, useFavoritesStats } from '@/hooks/useFavorites';
  
  const MyComponent = () => {
    // دریافت لیست علاقه‌مندی‌ها
    const { data: favorites, isLoading } = useFavorites({
      page: 1,
      page_size: 12
    });
    
    // toggle کردن علاقه‌مندی
    const toggleFavorite = useToggleFavorite();
    
    // دریافت آمار
    const { data: stats } = useFavoritesStats();
    
    const handleToggle = (propertyId: number) => {
      toggleFavorite.mutate(propertyId);
    };
    
    return (
      <div>
        {favorites?.results.map(favorite => (
          <div key={favorite.id}>
            {favorite.property_title}
            <button onClick={() => handleToggle(favorite.property_id)}>
              Toggle
            </button>
          </div>
        ))}
      </div>
    );
  };
  */
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">نحوه استفاده از Hooks</h2>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
        {`
// دریافت لیست علاقه‌مندی‌ها
const { data: favorites, isLoading } = useFavorites({
  page: 1,
  page_size: 12,
  property_type: 'آپارتمان'
});

// toggle کردن علاقه‌مندی
const toggleFavorite = useToggleFavorite();

// دریافت آمار
const { data: stats } = useFavoritesStats();

const handleToggle = (propertyId: number) => {
  toggleFavorite.mutate(propertyId);
};
        `}
      </pre>
    </div>
  );
};
