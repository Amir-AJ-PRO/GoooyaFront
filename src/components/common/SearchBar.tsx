'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState, memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchSuggestions } from "@/hooks/useSearch";
import { useCities } from "@/hooks/useCities";


const propertyTypes = [
  { value: "apartment", label: "آپارتمان" },
  { value: "villa", label: "ویلا" },
  { value: "townhouse", label: "تاونهاوس" },
  { value: "commercial", label: "تجاری" },
];

const SearchBar = memo(() => {
  const router = useRouter();
  const [tab, setTab] = useState<"buy" | "rent">("buy");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [city, setCity] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);
  const [price, setPrice] = useState<string | undefined>(undefined);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // دریافت شهرها
  const { data: cities = [], isLoading: citiesLoading } = useCities();

  // دریافت پیشنهادات
  const { data: suggestionsData } = useSearchSuggestions(debouncedSearchTerm, {
    enabled: debouncedSearchTerm.length >= 2
  });
  const suggestions = suggestionsData?.suggestions || [];

  const submitSearch = useCallback(() => {
    // ساخت پارامترهای جستجو
    const searchParams = new URLSearchParams();
    
    if (searchTerm.trim()) {
      searchParams.set('q', searchTerm.trim());
    }
    
    searchParams.set('transaction_type', tab === 'buy' ? 'sale' : 'rent');
    
    if (city) {
      searchParams.set('city', city);
    }
    
    if (type) {
      // تبدیل نوع ملک به ID
      const typeMap: Record<string, string> = {
        'apartment': '1',
        'villa': '2',
        'townhouse': '3', 
        'commercial': '4'
      };
      if (typeMap[type]) {
        searchParams.set('property_type', typeMap[type]);
      }
    }
    
    if (price) {
      // تبدیل محدوده قیمت
      const priceRanges: Record<string, { min: string, max: string }> = {
        'low': { min: '0', max: '5000000000' },
        'mid': { min: '5000000000', max: '20000000000' },
        'high': { min: '20000000000', max: '100000000000' }
      };
      if (priceRanges[price]) {
        searchParams.set('min_price', priceRanges[price].min);
        searchParams.set('max_price', priceRanges[price].max);
      }
    }
    
    // انتقال به صفحه املاک
    router.push(`/properties?${searchParams.toString()}`);
    setShowSuggestions(false);
  }, [router, searchTerm, tab, city, type, price]);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  const handleSearchInputChange = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(value.length >= 2);
  };

  return (
    <div className="bg-card rounded-2xl shadow-large p-3 md:p-6" dir="rtl">
      {/* Tabs */}
      <div className="flex gap-2 mb-3 md:mb-4 justify-start">
        <button
          className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
            tab === "buy" 
              ? "bg-primary text-primary-foreground" 
              : "bg-transparent border border-input hover:bg-secondary"
          }`}
          onClick={() => setTab("buy")}
        >
          خرید ملک
        </button>
        <button
          className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
            tab === "rent" 
              ? "bg-primary text-primary-foreground" 
              : "bg-transparent border border-input hover:bg-secondary"
          }`}
          onClick={() => setTab("rent")}
        >
          رهن و اجاره
        </button>
      </div>

      {/* Content - Mobile */}
      <div className="md:hidden space-y-2">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="جستجوی ملک، منطقه، آدرس..."
            value={searchTerm}
            onChange={(e) => handleSearchInputChange(e.target.value)}
            className="pr-10 h-9 text-xs"
            dir="rtl"
          />
          
          {/* پیشنهادات موبایل */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full text-right px-3 py-2 text-xs hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger dir="rtl" className="h-9 text-xs">
                <SelectValue placeholder="شهر" />
              </SelectTrigger>
              <SelectContent>
                {citiesLoading ? (
                  <SelectItem value="loading" disabled>در حال بارگذاری...</SelectItem>
                ) : (
                  cities.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger dir="rtl" className="h-9 text-xs">
                <SelectValue placeholder="نوع ملک" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button className="w-full h-9 text-xs" onClick={submitSearch}>
          <Search className="h-3 w-3 inline-block ml-2" /> جستجو
        </Button>
      </div>

      {/* Content - Desktop */}
      <div className="hidden md:block">
        <div className="grid grid-cols-6 gap-3 items-end">
          <div className="col-span-2">
            <label className="text-sm font-medium mb-2 block text-right">جستجوی سریع</label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="جستجوی ملک، منطقه، آدرس..."
                value={searchTerm}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                className="pr-10"
                dir="rtl"
              />
              
              {/* پیشنهادات دسکتاپ */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full text-right px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-right">شهر</label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger dir="rtl">
                <SelectValue placeholder="انتخاب شهر" />
              </SelectTrigger>
              <SelectContent>
                {citiesLoading ? (
                  <SelectItem value="loading" disabled>در حال بارگذاری...</SelectItem>
                ) : (
                  cities.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-right">نوع ملک</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger dir="rtl">
                <SelectValue placeholder="نوع ملک" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-right">قیمت</label>
            <Select value={price} onValueChange={setPrice}>
              <SelectTrigger dir="rtl">
                <SelectValue placeholder="قیمت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">تا ۵ میلیارد</SelectItem>
                <SelectItem value="mid">۵ تا ۲۰ میلیارد</SelectItem>
                <SelectItem value="high">بیشتر از ۲۰ میلیارد</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-right opacity-0 pointer-events-none">جستجو</label>
            <Button className="w-full" onClick={submitSearch}>
              <Search className="h-4 w-4 inline-block ml-2" /> جستجو
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;

