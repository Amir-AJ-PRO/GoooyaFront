import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  /**
   * عنوان اصلی صفحه (h1)
   */
  title: string;
  /**
   * توضیحات کوتاه زیر عنوان
   */
  description?: string;
  /**
   * آیکون یا محتوای اضافی در کنار عنوان
   */
  icon?: ReactNode;
  /**
   * دکمه‌ها یا actions در سمت راست
   */
  actions?: ReactNode;
  /**
   * رنگ پس‌زمینه
   */
  variant?: 'default' | 'primary' | 'gradient';
  /**
   * اندازه متن عنوان
   */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantClasses = {
  default: 'bg-background',
  primary: 'bg-primary text-primary-foreground',
  gradient: 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground',
};

const sizeClasses = {
  sm: 'text-2xl md:text-3xl',
  md: 'text-3xl md:text-4xl',
  lg: 'text-4xl md:text-5xl lg:text-6xl',
};

/**
 * کامپوننت Header استاندارد برای صفحات
 * 
 * این کامپوننت تضمین می‌کند که هر صفحه فقط یک h1 دارد
 * و ساختار یکسانی برای headerها وجود دارد
 * 
 * @example
 * ```tsx
 * <PageHeader
 *   title="درباره ما"
 *   description="آشنایی با تیم و مأموریت گویا"
 *   icon={<InfoIcon />}
 * />
 * ```
 */
export function PageHeader({
  title,
  description,
  icon,
  actions,
  variant = 'default',
  size = 'md',
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'py-8 md:py-12',
        variantClasses[variant],
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="flex-shrink-0">
                  {icon}
                </div>
              )}
              <h1 className={cn('font-bold', sizeClasses[size])}>
                {title}
              </h1>
            </div>
            {actions && (
              <div className="flex-shrink-0">
                {actions}
              </div>
            )}
          </div>
          {description && (
            <p className={cn(
              'text-lg md:text-xl leading-relaxed',
              variant === 'default' ? 'text-muted-foreground' : 'opacity-90'
            )}>
              {description}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}

