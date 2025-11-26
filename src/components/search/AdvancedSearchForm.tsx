'use client';

/**
 * فرم جستجوی پیشرفته املاک
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Filter, X, MapPin, Home, DollarSign, Ruler, Bed } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

import { SearchParams } from '@/types/search';
import { useSearchSuggestions } from '@/hooks/useSearch';

// Schema اعتبارسنجی
const searchSchema = z.object({
  q: z.string().optional(),
  city: z.number().optional(),
  location: z.number().optional(),
  property_type: z.number().optional(),
  transaction_type: z.enum(['sale', 'rent']).optional(),
  min_price: z.number().min(0).optional(),
  max_price: z.number().min(0).optional(),
  min_measure: z.number().min(0).optional(),
  max_measure: z.number().min(0).optional(),
  rooms: z.number().min(0).optional(),
  min_rooms: z.number().min(0).optional(),
  min_year_built: z.number().min(1300).max(new Date().getFullYear()).optional(),
  max_year_built: z.number().min(1300).max(new Date().getFullYear()).optional(),
  has_parking: z.boolean().optional(),
  has_storage: z.boolean().optional(),
  has_elevator: z.boolean().optional(),
  has_balcony: z.boolean().optional(),
  has_pool: z.boolean().optional(),
  has_security: z.boolean().optional(),
  urgent: z.boolean().optional(),
  under_price: z.boolean().optional(),
  exchange: z.boolean().optional(),
});

type SearchFormData = z.infer<typeof searchSchema>;

interface AdvancedSearchFormProps {
  onSearch: (params: SearchParams) => void;
  initialValues?: Partial<SearchParams>;
  isLoading?: boolean;
}

export const AdvancedSearchForm: React.FC<AdvancedSearchFormProps> = ({
  onSearch,
  initialValues = {},
  isLoading = false
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: initialValues,
  });

  // Hook برای پیشنهادات جستجو
  const { data: suggestionsData, isLoading: suggestionsLoading } = useSearchSuggestions(
    searchQuery,
    { enabled: searchQuery.length >= 2 }
  );

  const suggestions = suggestionsData?.suggestions || [];

  // مدیریت تغییرات فیلد جستجو
  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    form.setValue('q', value);
    setShowSuggestions(value.length >= 2);
  };

  // انتخاب پیشنهاد
  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    form.setValue('q', suggestion);
    setShowSuggestions(false);
  };

  // ارسال فرم
  const onSubmit = (data: SearchFormData) => {
    // حذف مقادیر خالی
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined && value !== null && value !== '')
    );
    
    onSearch(cleanedData as SearchParams);
    setShowSuggestions(false);
  };

  // پاک کردن فیلترها
  const clearFilters = () => {
    form.reset();
    setSearchQuery('');
    onSearch({});
  };

  // شمارش فیلترهای فعال
  const activeFiltersCount = Object.values(form.watch()).filter(
    value => value !== undefined && value !== null && value !== ''
  ).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          جستجوی پیشرفته املاک
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* جستجوی متنی */}
          <div className="relative">
            <Label htmlFor="search-input">جستجو در املاک</Label>
            <div className="relative">
              <Input
                id="search-input"
                type="text"
                placeholder="جستجو در عنوان، آدرس و توضیحات..."
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              
              {/* پیشنهادات جستجو */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full text-right px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* فیلترهای سریع */}
          <div className="flex flex-wrap gap-2">
            <Select onValueChange={(value) => form.setValue('transaction_type', value as 'sale' | 'rent')}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="نوع معامله" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">فروش</SelectItem>
                <SelectItem value="rent">اجاره</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => form.setValue('city', parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="شهر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">تهران</SelectItem>
                <SelectItem value="2">اصفهان</SelectItem>
                <SelectItem value="3">مشهد</SelectItem>
                {/* TODO: دریافت از API */}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => form.setValue('property_type', parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="نوع ملک" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">آپارتمان</SelectItem>
                <SelectItem value="2">ویلا</SelectItem>
                <SelectItem value="3">زمین</SelectItem>
                {/* TODO: دریافت از API */}
              </SelectContent>
            </Select>
          </div>

          {/* فیلترهای پیشرفته */}
          <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" type="button" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                فیلترهای پیشرفته
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="mr-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-6 mt-4">
              {/* فیلترهای قیمت */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    حداقل قیمت (تومان)
                  </Label>
                  <Input
                    type="number"
                    placeholder="مثال: 1000000000"
                    {...form.register('min_price', { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label>حداکثر قیمت (تومان)</Label>
                  <Input
                    type="number"
                    placeholder="مثال: 5000000000"
                    {...form.register('max_price', { valueAsNumber: true })}
                  />
                </div>
              </div>

              {/* فیلترهای متراژ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    حداقل متراژ (متر مربع)
                  </Label>
                  <Input
                    type="number"
                    placeholder="مثال: 100"
                    {...form.register('min_measure', { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label>حداکثر متراژ (متر مربع)</Label>
                  <Input
                    type="number"
                    placeholder="مثال: 200"
                    {...form.register('max_measure', { valueAsNumber: true })}
                  />
                </div>
              </div>

              {/* فیلترهای اتاق */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <Bed className="h-4 w-4" />
                    تعداد خواب (دقیق)
                  </Label>
                  <Select onValueChange={(value) => form.setValue('rooms', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">بدون خواب</SelectItem>
                      <SelectItem value="1">1 خواب</SelectItem>
                      <SelectItem value="2">2 خواب</SelectItem>
                      <SelectItem value="3">3 خواب</SelectItem>
                      <SelectItem value="4">4 خواب</SelectItem>
                      <SelectItem value="5">5+ خواب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>حداقل تعداد خواب</Label>
                  <Select onValueChange={(value) => form.setValue('min_rooms', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">حداقل 1 خواب</SelectItem>
                      <SelectItem value="2">حداقل 2 خواب</SelectItem>
                      <SelectItem value="3">حداقل 3 خواب</SelectItem>
                      <SelectItem value="4">حداقل 4 خواب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* فیلترهای سال ساخت */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>حداقل سال ساخت</Label>
                  <Input
                    type="number"
                    placeholder="مثال: 1390"
                    {...form.register('min_year_built', { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label>حداکثر سال ساخت</Label>
                  <Input
                    type="number"
                    placeholder="مثال: 1403"
                    {...form.register('max_year_built', { valueAsNumber: true })}
                  />
                </div>
              </div>

              {/* امکانات */}
              <div>
                <Label className="text-base font-semibold">امکانات</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {[
                    { key: 'has_parking', label: 'پارکینگ' },
                    { key: 'has_storage', label: 'انباری' },
                    { key: 'has_elevator', label: 'آسانسور' },
                    { key: 'has_balcony', label: 'بالکن' },
                    { key: 'has_pool', label: 'استخر' },
                    { key: 'has_security', label: 'نگهبانی' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id={key}
                        onCheckedChange={(checked) => 
                          form.setValue(key as keyof SearchFormData, checked as boolean)
                        }
                      />
                      <Label htmlFor={key}>{label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* ویژگی‌های خاص */}
              <div>
                <Label className="text-base font-semibold">ویژگی‌های خاص</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {[
                    { key: 'urgent', label: 'فوری' },
                    { key: 'under_price', label: 'زیر قیمت' },
                    { key: 'exchange', label: 'قابل معاوضه' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id={key}
                        onCheckedChange={(checked) => 
                          form.setValue(key as keyof SearchFormData, checked as boolean)
                        }
                      />
                      <Label htmlFor={key}>{label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* دکمه‌های عمل */}
          <div className="flex gap-4">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'در حال جستجو...' : 'جستجو'}
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              onClick={clearFilters}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              پاک کردن
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
