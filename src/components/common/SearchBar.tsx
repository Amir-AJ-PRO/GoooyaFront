'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState, memo, useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useDebounce } from "@/hooks/useDebounce";

const provinces = [
  { value: "tehran", label: "تهران" },
  { value: "mashhad", label: "مشهد" },
  { value: "isfahan", label: "اصفهان" },
  { value: "shiraz", label: "شیراز" },
  { value: "tabriz", label: "تبریز" },
];

const propertyTypes = [
  { value: "apartment", label: "آپارتمان" },
  { value: "villa", label: "ویلا" },
  { value: "townhouse", label: "تاونهاوس" },
  { value: "commercial", label: "تجاری" },
];

const SearchBar = memo(() => {
  const [tab, setTab] = useState<"buy" | "rent">("buy");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [province, setProvince] = useState<string | undefined>(undefined);
  const [city, setCity] = useState<string | undefined>(undefined);
  const [region, setRegion] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);
  const [price, setPrice] = useState<string | undefined>(undefined);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      console.log("جستجو برای:", debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const submitSearch = useCallback(() => {
    const payload = { 
      tab, 
      searchTerm: debouncedSearchTerm, 
      province, 
      city, 
      region, 
      type, 
      price 
    };
    console.log("search payload", payload);
    toast({ 
      title: "جستجو ارسال شد", 
      description: debouncedSearchTerm 
        ? `جستجو برای "${debouncedSearchTerm}" انجام شد.`
        : "درخواست جستجو ثبت شد." 
    });
  }, [tab, debouncedSearchTerm, province, city, region, type, price]);

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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 h-9 text-xs"
            dir="rtl"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Select>
              <SelectTrigger dir="rtl" className="h-9 text-xs">
                <SelectValue placeholder="شهر" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((p) => (
                  <SelectItem key={p.value} value={p.value} onSelect={() => setCity(p.value)}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select>
              <SelectTrigger dir="rtl" className="h-9 text-xs">
                <SelectValue placeholder="نوع ملک" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value} onSelect={() => setType(t.value)}>
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
                dir="rtl"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-right">شهر</label>
            <Select>
              <SelectTrigger dir="rtl">
                <SelectValue placeholder="انتخاب شهر" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((p) => (
                  <SelectItem key={p.value} value={p.value} onSelect={() => setCity(p.value)}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-right">نوع ملک</label>
            <Select>
              <SelectTrigger dir="rtl">
                <SelectValue placeholder="نوع ملک" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value} onSelect={() => setType(t.value)}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-right">قیمت</label>
            <Select>
              <SelectTrigger dir="rtl">
                <SelectValue placeholder="قیمت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low" onSelect={() => setPrice("low")}>تا ۵ میلیارد</SelectItem>
                <SelectItem value="mid" onSelect={() => setPrice("mid")}>۵ تا ۲۰ میلیارد</SelectItem>
                <SelectItem value="high" onSelect={() => setPrice("high")}>بیشتر از ۲۰ میلیارد</SelectItem>
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

