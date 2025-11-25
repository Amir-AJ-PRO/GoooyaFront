'use client';

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsRight, ChevronsLeft } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // نمایش حداکثر 5 صفحه در اطراف صفحه فعلی
  const visiblePages = pages.filter(page => {
    return Math.abs(page - currentPage) <= 2;
  });

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      {/* اطلاعات صفحه */}
      <div className="text-sm text-muted-foreground">
        صفحه <span className="font-semibold text-foreground">{currentPage}</span> از <span className="font-semibold text-foreground">{totalPages}</span>
      </div>
      
      {/* دکمه‌های Pagination */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {/* رفتن به صفحه اول */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="h-10 w-10"
          title="صفحه اول"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
        
        {/* صفحه قبلی */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-10 w-10"
          title="صفحه قبلی"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* نمایش صفحات */}
        {visiblePages[0] > 1 && (
          <>
            <Button
              variant="outline"
              onClick={() => onPageChange(1)}
              className="h-10 min-w-[2.5rem]"
            >
              1
            </Button>
            {visiblePages[0] > 2 && (
              <span className="px-2 text-muted-foreground">...</span>
            )}
          </>
        )}

        {visiblePages.map(page => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onPageChange(page)}
            className={`h-10 min-w-[2.5rem] ${
              currentPage === page 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : ''
            }`}
          >
            {page}
          </Button>
        ))}

        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="px-2 text-muted-foreground">...</span>
            )}
            <Button
              variant="outline"
              onClick={() => onPageChange(totalPages)}
              className="h-10 min-w-[2.5rem]"
            >
              {totalPages}
            </Button>
          </>
        )}

        {/* صفحه بعدی */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-10 w-10"
          title="صفحه بعدی"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {/* رفتن به صفحه آخر */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="h-10 w-10"
          title="صفحه آخر"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

