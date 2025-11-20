import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  /**
   * اگر true باشد، padding پیش‌فرض اضافه نمی‌شود
   */
  noPadding?: boolean;
  /**
   * حداکثر عرض کانتینر
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full';
}

const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

/**
 * کامپوننت Container یکپارچه برای ساختار دادن به صفحات
 * 
 * این کامپوننت برای ایجاد ساختار یکنواخت در تمام صفحات استفاده می‌شود
 * 
 * @example
 * ```tsx
 * <PageContainer>
 *   <h1>عنوان صفحه</h1>
 *   <p>محتوای صفحه</p>
 * </PageContainer>
 * ```
 */
export function PageContainer({ 
  children, 
  className, 
  noPadding = false,
  maxWidth = '7xl',
}: PageContainerProps) {
  return (
    <div
      className={cn(
        'container mx-auto',
        !noPadding && 'px-4 py-8 md:py-12',
        maxWidthClasses[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
}

interface PageSectionProps {
  children: ReactNode;
  className?: string;
  /**
   * رنگ پس‌زمینه بخش
   */
  variant?: 'default' | 'secondary' | 'muted';
  /**
   * اگر true باشد، padding عمودی اضافه می‌شود
   */
  withPadding?: boolean;
  /**
   * تگ HTML که برای این section استفاده می‌شود
   */
  as?: 'section' | 'div' | 'article' | 'aside';
}

const variantClasses = {
  default: 'bg-background',
  secondary: 'bg-secondary/30',
  muted: 'bg-muted/50',
};

/**
 * کامپوننت Section برای تقسیم‌بندی منطقی صفحات
 * 
 * @example
 * ```tsx
 * <PageSection variant="secondary">
 *   <PageContainer>
 *     <h2>بخش ویژه</h2>
 *   </PageContainer>
 * </PageSection>
 * ```
 */
export function PageSection({ 
  children, 
  className, 
  variant = 'default',
  withPadding = true,
  as: Component = 'section',
}: PageSectionProps) {
  return (
    <Component
      className={cn(
        variantClasses[variant],
        withPadding && 'py-8 md:py-12 lg:py-16',
        className
      )}
    >
      {children}
    </Component>
  );
}

