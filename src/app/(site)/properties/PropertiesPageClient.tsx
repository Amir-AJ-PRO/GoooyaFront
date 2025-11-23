'use client';

import { useState } from 'react';
import { useProperties } from '@/hooks/usePropertyMutations';
import PropertyCard from '@/components/cards/PropertyCard';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Building2, SlidersHorizontal } from 'lucide-react';
import { PropertyListItem } from '@/types/property';

export default function PropertiesPageClient() {
  const { data: properties, isLoading, error } = useProperties();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionFilter, setTransactionFilter] = useState<string>('all');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  
  // فیلتر و مرتب‌سازی املاک
  const filteredProperties = properties
    ?.filter((property) => {
      // فیلتر جستجو
      const cityName = typeof property.city === 'object' && property.city?.name ? property.city.name : '';
      const locationName = typeof property.location === 'object' && property.location?.name ? property.location.name : '';
      
      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cityName.includes(searchTerm) ||
                           locationName.includes(searchTerm);
      
      // فیلتر نوع معامله
      const matchesTransaction = transactionFilter === 'all' || 
                                 property.transaction_type === transactionFilter;
      
      // فیلتر نوع ملک
      const propertyTypeId = typeof property.property_type === 'object' && property.property_type?.id 
        ? property.property_type.id.toString() 
        : '';
      const matchesType = propertyTypeFilter === 'all' || propertyTypeId === propertyTypeFilter;
      
      return matchesSearch && matchesTransaction && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        default:
          return 0;
      }
    }) || [];
  
  // استخراج انواع املاک یکتا
  const uniquePropertyTypes = Array.from(
    new Set(
      properties
        ?.filter(p => typeof p.property_type === 'object' && p.property_type?.id)
        .map(p => JSON.stringify(p.property_type))
    )
  ).map(str => JSON.parse(str));
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Building2 className="h-16 w-16 mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">خطا در بارگذاری املاک</h2>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">املاک موجود</h1>
        <p className="text-muted-foreground">
          {isLoading ? 'در حال بارگذاری...' : `${filteredProperties.length} ملک یافت شد`}
        </p>
      </div>
      
      {/* فیلترها */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">فیلترها و جستجو</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* جستجو */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="جستجو..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          
          {/* نوع معامله */}
          <Select value={transactionFilter} onValueChange={setTransactionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="نوع معامله" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="sale">فروش</SelectItem>
              <SelectItem value="rent">اجاره</SelectItem>
            </SelectContent>
          </Select>
          
          {/* نوع ملک */}
          <Select value={propertyTypeFilter} onValueChange={setPropertyTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="نوع ملک" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              {uniquePropertyTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* مرتب‌سازی */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="مرتب‌سازی" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">جدیدترین</SelectItem>
              <SelectItem value="oldest">قدیمی‌ترین</SelectItem>
              <SelectItem value="price-high">گران‌ترین</SelectItem>
              <SelectItem value="price-low">ارزان‌ترین</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* دکمه پاک کردن فیلترها */}
        {(searchTerm || transactionFilter !== 'all' || propertyTypeFilter !== 'all' || sortBy !== 'newest') && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setTransactionFilter('all');
              setPropertyTypeFilter('all');
              setSortBy('newest');
            }}
          >
            پاک کردن فیلترها
          </Button>
        )}
      </div>
      
      {/* لیست املاک */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-20">
          <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">ملکی یافت نشد</h2>
          <p className="text-muted-foreground mb-6">
            {properties?.length === 0 
              ? 'هنوز ملکی ثبت نشده است'
              : 'با فیلترهای انتخاب شده ملکی یافت نشد'
            }
          </p>
          {properties && properties.length > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setTransactionFilter('all');
                setPropertyTypeFilter('all');
              }}
            >
              نمایش همه املاک
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}

