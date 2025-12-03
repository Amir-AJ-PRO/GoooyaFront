import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="flex-1 min-w-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 break-words">{title}</h1>
        {description && (
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground break-words">{description}</p>
        )}
      </div>
      {children && <div className="w-full sm:w-auto flex-shrink-0">{children}</div>}
    </div>
  );
}

