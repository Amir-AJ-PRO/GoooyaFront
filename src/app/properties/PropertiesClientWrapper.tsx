'use client';

import { useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  area: number;
  image: string;
}

interface PropertiesClientWrapperProps {
  properties: Property[];
}

export default function PropertiesClientWrapper({ properties }: PropertiesClientWrapperProps) {
  const [sortBy, setSortBy] = useState("newest");

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <Card className="p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">فیلترها</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">نوع معامله</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">خرید</SelectItem>
                      <SelectItem value="rent">اجاره</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">تعداد اتاق</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">۱</SelectItem>
                      <SelectItem value="2">۲</SelectItem>
                      <SelectItem value="3">۳</SelectItem>
                      <SelectItem value="4">۴+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">متراژ</label>
                  <Slider defaultValue={[100]} max={500} step={10} />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>۰</span>
                    <span>۵۰۰+ متر</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">قیمت (میلیارد تومان)</label>
                  <Slider defaultValue={[5]} max={30} step={1} />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>۰</span>
                    <span>۳۰+</span>
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* Properties List */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{properties.length} ملک یافت شد</h2>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">جدیدترین</SelectItem>
                  <SelectItem value="price-low">قیمت: کم به زیاد</SelectItem>
                  <SelectItem value="price-high">قیمت: زیاد به کم</SelectItem>
                  <SelectItem value="area">متراژ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

