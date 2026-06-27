'use client';

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchSuggestions } from "@/hooks/useSearch";
import { cn } from "@/lib/utils";

export default function QuickSearch({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: suggestionsData } = useSearchSuggestions(debouncedSearchTerm, {
    enabled: debouncedSearchTerm.length >= 2,
  });
  const suggestions = suggestionsData?.suggestions || [];

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/properties?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
      setSearchTerm("");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const handleSearchInputChange = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(value.length >= 2);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm);
    }
  };

  return (
    <div className="relative w-full" dir="rtl">
      <Input
        type="text"
        aria-label="جستجو در املاک"
        placeholder={compact ? "جستجو..." : "جستجو در عنوان، شهر، منطقه..."}
        value={searchTerm}
        onChange={(e) => handleSearchInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (searchTerm.length >= 2) setShowSuggestions(true);
        }}
        onBlur={() => {
          setTimeout(() => setShowSuggestions(false), 200);
        }}
        className={cn(
          "header-search-input h-[32px] w-full rounded-[8px] border border-[#242424] bg-white py-0 pl-3 pr-9 text-right text-[13.5px] font-normal text-[#111111] shadow-none",
          "placeholder:text-right placeholder:text-[13px] placeholder:text-[#555555]",
          "focus-visible:border-[#242424] focus-visible:ring-0 focus-visible:ring-offset-0"
        )}
        dir="rtl"
      />
      <Search
        className="header-search-icon pointer-events-none absolute right-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#6B7280]"
        strokeWidth={2}
      />

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 max-h-60 overflow-y-auto rounded-xl border border-[#E8ECF2] bg-white shadow-lg">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="w-full border-b border-[#F0F2F5] px-4 py-2.5 text-right text-[13.5px] text-[#111111] transition-colors last:border-b-0 hover:bg-[#251785]/[0.06] hover:text-[#251785]"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <Search className="ml-2 inline-block h-3 w-3 text-[#9CA3AF]" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
