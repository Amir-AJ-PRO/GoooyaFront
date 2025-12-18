'use client';

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchSuggestions } from "@/hooks/useSearch";

/**
 * کامپوننت جستجوی سریع برای Header
 * فقط شامل فیلد جستجو می‌شود
 */
export default function QuickSearch() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // دریافت پیشنهادات
  const { data: suggestionsData } = useSearchSuggestions(debouncedSearchTerm, {
    enabled: debouncedSearchTerm.length >= 2
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
    <div className="relative w-full max-w-md" dir="rtl">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        placeholder="جستجوی ملک، منطقه، آدرس..."
        value={searchTerm}
        onChange={(e) => handleSearchInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        className="pr-10 h-9 text-sm"
        dir="rtl"
      />
      
      {/* پیشنهادات */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 bg-background border border-border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="w-full text-right px-4 py-2.5 text-sm hover:bg-secondary border-b border-border last:border-b-0 transition-colors"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <Search className="h-3 w-3 inline-block ml-2 text-muted-foreground" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

