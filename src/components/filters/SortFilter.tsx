'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SortFilter() {
  return (
    <Select defaultValue="newest">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="مرتب‌سازی" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">جدیدترین</SelectItem>
        <SelectItem value="oldest">قدیمی‌ترین</SelectItem>
        <SelectItem value="price-low">قیمت (کم به زیاد)</SelectItem>
        <SelectItem value="price-high">قیمت (زیاد به کم)</SelectItem>
        <SelectItem value="area-low">متراژ (کم به زیاد)</SelectItem>
        <SelectItem value="area-high">متراژ (زیاد به کم)</SelectItem>
      </SelectContent>
    </Select>
  );
}

