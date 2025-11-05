'use client';

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState, memo, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";

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
  const [province, setProvince] = useState<string | undefined>(undefined);
  const [city, setCity] = useState<string | undefined>(undefined);
  const [region, setRegion] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);
  const [price, setPrice] = useState<string | undefined>(undefined);

  const submitSearch = useCallback(() => {
    const payload = { tab, province, city, region, type, price };
    console.log("search payload", payload);
    toast({ title: "جستجو ارسال شد", description: "درخواست جستجو ثبت شد (نمونه)." });
  }, [tab, province, city, region, type, price]);

  return (
    <div className="bg-card rounded-2xl shadow-large p-3 md:p-6" dir="rtl">
      {/* Tabs */}
      <div className="flex gap-2 mb-3 md:mb-4 justify-start">
        <button
          className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium ${tab === "buy" ? "bg-primary text-primary-foreground" : "bg-transparent border border-input"}`}
          onClick={() => setTab("buy")}
        >
          خرید ملک
        </button>
        <button
          className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium ${tab === "rent" ? "bg-primary text-primary-foreground" : "bg-transparent border border-input"}`}
          onClick={() => setTab("rent")}
        >
          رهن و اجاره
        </button>
      </div>

      {/* Content - Mobile: Complete */}
      <div className="md:hidden">
        <div className="grid grid-cols-2 gap-2 mb-2">
          {/* ردیف اول */}
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
                <SelectValue placeholder="منطقه" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1" onSelect={() => setRegion("1")}>منطقه 1</SelectItem>
                <SelectItem value="2" onSelect={() => setRegion("2")}>منطقه 2</SelectItem>
                <SelectItem value="3" onSelect={() => setRegion("3")}>منطقه 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ردیف دوم */}
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

          <div>
            <Select>
              <SelectTrigger dir="rtl" className="h-9 text-xs">
                <SelectValue placeholder="قیمت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low" onSelect={() => setPrice("low")}>تا ۵ میلیون</SelectItem>
                <SelectItem value="mid" onSelect={() => setPrice("mid")}>۵ تا ۲۰ میلیون</SelectItem>
                <SelectItem value="high" onSelect={() => setPrice("high")}>بیشتر از ۲۰ میلیون</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button className="w-full h-9 text-xs" onClick={submitSearch}>
          <Search className="h-3 w-3 inline-block ml-2" /> جستجو
        </Button>
      </div>

      {/* Content - Desktop: Full */}
      <div className="hidden md:block">
        <div className="grid grid-cols-5 gap-3 items-end">
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
            <label className="text-sm font-medium mb-2 block text-right">منطقه</label>
            <Select>
              <SelectTrigger dir="rtl">
                <SelectValue placeholder="انتخاب منطقه" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1" onSelect={() => setRegion("1")}>منطقه 1</SelectItem>
                <SelectItem value="2" onSelect={() => setRegion("2")}>منطقه 2</SelectItem>
                <SelectItem value="3" onSelect={() => setRegion("3")}>منطقه 3</SelectItem>
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
            <label className="text-sm font-medium mb-2 block text-right">فیلتر قیمت</label>
            <Select>
              <SelectTrigger dir="rtl">
                <SelectValue placeholder="قیمت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low" onSelect={() => setPrice("low")}>تا ۵ میلیون</SelectItem>
                <SelectItem value="mid" onSelect={() => setPrice("mid")}>۵ تا ۲۰ میلیون</SelectItem>
                <SelectItem value="high" onSelect={() => setPrice("high")}>بیشتر از ۲۰ میلیون</SelectItem>
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