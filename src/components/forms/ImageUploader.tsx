'use client';

import { useState, useRef } from 'react';
import { X, Upload, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ImageUploaderProps {
  images: File[];
  mainImageIndex: number;
  onChange: (images: File[], mainIndex: number) => void;
  maxImages?: number;
  required?: boolean;
}

export default function ImageUploader({
  images,
  mainImageIndex,
  onChange,
  maxImages = 10,
  required = true
}: ImageUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // تولید پیش‌نمایش برای عکس‌ها
  const generatePreviews = (files: File[]) => {
    const newPreviews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // انتخاب فایل‌ها
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    // چک کردن حداکثر تعداد
    if (images.length + files.length > maxImages) {
      alert(`حداکثر ${maxImages} عکس می‌توانید آپلود کنید`);
      return;
    }
    
    // فیلتر کردن فایل‌های تصویری
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      alert('فقط فایل‌های تصویری مجاز هستند');
    }
    
    if (imageFiles.length > 0) {
      const newImages = [...images, ...imageFiles];
      onChange(newImages, mainImageIndex === -1 ? 0 : mainImageIndex);
      generatePreviews(newImages);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // حذف عکس
  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    let newMainIndex = mainImageIndex;
    
    // اگر عکس اصلی حذف شد
    if (index === mainImageIndex) {
      newMainIndex = newImages.length > 0 ? 0 : -1;
    } else if (index < mainImageIndex) {
      newMainIndex = mainImageIndex - 1;
    }
    
    onChange(newImages, newMainIndex);
    
    // به‌روزرسانی پیش‌نمایش‌ها
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };

  // تنظیم عکس اصلی
  const handleSetMain = (index: number) => {
    onChange(images, index);
  };

  return (
    <div className="space-y-4">
      {/* دکمه آپلود */}
      <div>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length >= maxImages}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          انتخاب تصاویر
          <span className="text-xs text-muted-foreground">
            ({images.length}/{maxImages})
          </span>
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        {required && images.length === 0 && (
          <p className="text-xs text-red-500 mt-1">
            حداقل یک تصویر الزامی است
          </p>
        )}
      </div>

      {/* نمایش پیش‌نمایش تصاویر */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div
              key={index}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                index === mainImageIndex
                  ? 'border-primary'
                  : 'border-gray-200'
              }`}
            >
              <Image
                src={preview}
                alt={`تصویر ${index + 1}`}
                fill
                className="object-cover"
              />
              
              {/* دکمه حذف */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              
              {/* دکمه تنظیم به عنوان اصلی */}
              <button
                type="button"
                onClick={() => handleSetMain(index)}
                className={`absolute top-2 left-2 p-1 rounded-full transition-colors ${
                  index === mainImageIndex
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-yellow-100'
                }`}
                title={index === mainImageIndex ? 'تصویر اصلی' : 'تنظیم به عنوان تصویر اصلی'}
              >
                <Star className="h-4 w-4" fill={index === mainImageIndex ? 'currentColor' : 'none'} />
              </button>
              
              {/* برچسب عکس اصلی */}
              {index === mainImageIndex && (
                <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white text-xs py-1 px-2 text-center">
                  تصویر اصلی
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* راهنما */}
      <p className="text-xs text-muted-foreground">
        💡 روی ستاره کلیک کنید تا تصویر اصلی ملک را مشخص کنید
      </p>
    </div>
  );
}

