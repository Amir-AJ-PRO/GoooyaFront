'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function PropertyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Submit to API
    setTimeout(() => {
      toast.success("ملک با موفقیت ثبت شد");
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">عنوان ملک *</Label>
          <Input
            id="title"
            placeholder="مثال: آپارتمان مدرن در تهران"
            className="mt-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="type">نوع ملک *</Label>
          <Select required>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">آپارتمان</SelectItem>
              <SelectItem value="villa">ویلا</SelectItem>
              <SelectItem value="townhouse">تاونهاوس</SelectItem>
              <SelectItem value="commercial">تجاری</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="price">قیمت (تومان) *</Label>
          <Input
            id="price"
            type="number"
            placeholder="8000000000"
            className="mt-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="area">متراژ (متر مربع) *</Label>
          <Input
            id="area"
            type="number"
            placeholder="120"
            className="mt-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="bedrooms">تعداد اتاق خواب *</Label>
          <Input
            id="bedrooms"
            type="number"
            placeholder="3"
            className="mt-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="bathrooms">تعداد سرویس بهداشتی *</Label>
          <Input
            id="bathrooms"
            type="number"
            placeholder="2"
            className="mt-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="city">شهر *</Label>
          <Input
            id="city"
            placeholder="تهران"
            className="mt-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="location">محله *</Label>
          <Input
            id="location"
            placeholder="فرشته"
            className="mt-2"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">توضیحات *</Label>
        <Textarea
          id="description"
          placeholder="توضیحات کامل درباره ملک..."
          className="mt-2 min-h-[120px]"
          required
        />
      </div>

      <div>
        <Label htmlFor="images">تصاویر ملک</Label>
        <Input
          id="images"
          type="file"
          multiple
          accept="image/*"
          className="mt-2"
        />
        <p className="text-sm text-muted-foreground mt-1">
          حداکثر 10 تصویر، هر کدام حداکثر 5MB
        </p>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "در حال ثبت..." : "ثبت ملک"}
        </Button>
        <Button type="button" variant="outline">
          انصراف
        </Button>
      </div>
    </form>
  );
}

