'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";

export function FilterSidebar() {
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [areaRange, setAreaRange] = useState([0, 500]);

  const propertyTypes = [
    { id: "apartment", label: "آپارتمان" },
    { id: "villa", label: "ویلا" },
    { id: "townhouse", label: "تاونهاوس" },
    { id: "commercial", label: "تجاری" },
  ];

  const features = [
    { id: "parking", label: "پارکینگ" },
    { id: "elevator", label: "آسانسور" },
    { id: "storage", label: "انباری" },
    { id: "balcony", label: "بالکن" },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">فیلترها</CardTitle>
          <Button variant="ghost" size="sm">
            <X className="h-4 w-4 ml-2" />
            پاک کردن
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* نوع ملک */}
          <div>
            <Label className="text-base mb-3 block">نوع ملک</Label>
            <div className="space-y-2">
              {propertyTypes.map((type) => (
                <div key={type.id} className="flex items-center gap-2">
                  <Checkbox id={type.id} />
                  <Label htmlFor={type.id} className="cursor-pointer">
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* محدوده قیمت */}
          <div>
            <Label className="text-base mb-3 block">
              قیمت: {priceRange[0]} تا {priceRange[1]} میلیارد تومان
            </Label>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={0}
              max={100}
              step={5}
              className="mt-2"
            />
          </div>

          {/* محدوده متراژ */}
          <div>
            <Label className="text-base mb-3 block">
              متراژ: {areaRange[0]} تا {areaRange[1]} متر
            </Label>
            <Slider
              value={areaRange}
              onValueChange={setAreaRange}
              min={0}
              max={500}
              step={10}
              className="mt-2"
            />
          </div>

          {/* امکانات */}
          <div>
            <Label className="text-base mb-3 block">امکانات</Label>
            <div className="space-y-2">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-center gap-2">
                  <Checkbox id={feature.id} />
                  <Label htmlFor={feature.id} className="cursor-pointer">
                    {feature.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full">اعمال فیلترها</Button>
        </CardContent>
      </Card>
    </div>
  );
}

