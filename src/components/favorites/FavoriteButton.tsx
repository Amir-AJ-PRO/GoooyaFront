'use client';

import React, { useEffect, useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FAVORITES_QUERY_KEYS, useToggleFavorite } from '@/hooks/useFavorites';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  propertyId: number;
  isFavorite: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  className?: string;
  showText?: boolean;
  disabled?: boolean;
}

/**
 * کامپوننت دکمه علاقه‌مندی (قلب)
 * برای toggle کردن وضعیت علاقه‌مندی املاک
 */
export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  propertyId,
  isFavorite,
  size = 'md',
  variant = 'ghost',
  className,
  showText = false,
  disabled = false,
}) => {
  const queryClient = useQueryClient();
  const toggleFavoriteMutation = useToggleFavorite();
  const [favorited, setFavorited] = useState(isFavorite);

  useEffect(() => {
    const cached = queryClient.getQueryData<{ is_favorite: boolean }>(
      FAVORITES_QUERY_KEYS.status(propertyId)
    );
    setFavorited(cached?.is_favorite ?? isFavorite);
  }, [isFavorite, propertyId, queryClient]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled || toggleFavoriteMutation.isPending) return;

    const next = !favorited;
    setFavorited(next);
    toggleFavoriteMutation.mutate(propertyId, {
      onError: () => setFavorited(!next),
    });
  };

  const isLoading = toggleFavoriteMutation.isPending;

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={showText ? 'default' : 'icon'}
      className={cn(
        !showText && sizeClasses[size],
        'relative transition-all duration-200 hover:scale-105',
        favorited && variant === 'ghost' && 'text-red-500 hover:text-red-600',
        !favorited && variant === 'ghost' && 'text-gray-400 hover:text-red-500',
        favorited &&
          variant === 'outline' &&
          'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-600',
        !favorited &&
          variant === 'outline' &&
          'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-600',
        className
      )}
      onClick={handleToggle}
      disabled={disabled || isLoading}
      title={favorited ? 'حذف از علاقه‌مندی‌ها' : 'اضافه به علاقه‌مندی‌ها'}
    >
      {isLoading ? (
        <Loader2 
          size={iconSizes[size]} 
          className="animate-spin text-gray-400" 
        />
      ) : (
        <Heart
          size={iconSizes[size]}
          className={cn(
            'transition-all duration-200',
            favorited ? 'fill-current text-red-500' : 'text-gray-400'
          )}
        />
      )}
      
      {showText && (
        <span className="mr-2 text-sm">
          {favorited ? 'علاقه‌مند' : 'علاقه‌مندی'}
        </span>
      )}
    </Button>
  );
};

/**
 * نسخه کوچک دکمه علاقه‌مندی برای استفاده در کارت‌های ملک
 */
export const FavoriteButtonSmall: React.FC<{
  propertyId: number;
  isFavorite: boolean;
  className?: string;
}> = ({ propertyId, isFavorite, className }) => {
  return (
    <FavoriteButton
      propertyId={propertyId}
      isFavorite={isFavorite}
      size="sm"
      variant="ghost"
      className={cn(
        'absolute z-10 bg-white/80 backdrop-blur-sm hover:bg-white/90',
        'shadow-sm border border-gray-200/50',
        className
      )}
    />
  );
};

/**
 * نسخه بزرگ دکمه علاقه‌مندی با متن برای صفحه جزئیات ملک
 */
export const FavoriteButtonLarge: React.FC<{
  propertyId: number;
  isFavorite: boolean;
  className?: string;
}> = ({ propertyId, isFavorite, className }) => {
  return (
    <FavoriteButton
      propertyId={propertyId}
      isFavorite={isFavorite}
      size="lg"
      variant="outline"
      showText={true}
      className={cn('px-6 py-3 h-auto w-auto', className)}
    />
  );
};
