'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Upload, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  // پیش‌نمایش با data URL تا با CSP (بدون نیاز به blob:) سازگار باشد
  const generatePreviews = (files: File[]) => {
    if (files.length === 0) {
      setPreviews([]);
      return;
    }

    const newPreviews: string[] = new Array(files.length);
    let loaded = 0;

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews[index] = reader.result as string;
        loaded += 1;
        if (loaded === files.length) {
          setPreviews([...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    generatePreviews(images);
  }, [images]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      alert(`حداکثر ${maxImages} عکس می‌توانید آپلود کنید`);
      return;
    }

    const imageFiles = files.filter((file) => file.type.startsWith('image/'));

    if (imageFiles.length !== files.length) {
      alert('فقط فایل‌های تصویری مجاز هستند');
    }

    if (imageFiles.length > 0) {
      const newImages = [...images, ...imageFiles];
      onChange(newImages, mainImageIndex === -1 ? 0 : mainImageIndex);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    let newMainIndex = mainImageIndex;

    if (index === mainImageIndex) {
      newMainIndex = newImages.length > 0 ? 0 : -1;
    } else if (index < mainImageIndex) {
      newMainIndex = mainImageIndex - 1;
    }

    onChange(newImages, newMainIndex);
  };

  const handleSetMain = (index: number) => {
    onChange(images, index);
  };

  return (
    <div className="space-y-4">
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

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div
              key={`${images[index]?.name ?? index}-${images[index]?.lastModified ?? index}`}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                index === mainImageIndex
                  ? 'border-primary'
                  : 'border-gray-200'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt={`تصویر ${index + 1}`}
                className="object-cover w-full h-full"
              />

              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => handleSetMain(index)}
                className={`absolute top-2 left-2 p-1 rounded-full transition-colors ${
                  index === mainImageIndex
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-yellow-100'
                }`}
                title={
                  index === mainImageIndex
                    ? 'تصویر اصلی'
                    : 'تنظیم به عنوان تصویر اصلی'
                }
              >
                <Star
                  className="h-4 w-4"
                  fill={index === mainImageIndex ? 'currentColor' : 'none'}
                />
              </button>

              {index === mainImageIndex && (
                <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white text-xs py-1 px-2 text-center">
                  تصویر اصلی
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        💡 روی ستاره کلیک کنید تا تصویر اصلی ملک را مشخص کنید
      </p>
    </div>
  );
}
