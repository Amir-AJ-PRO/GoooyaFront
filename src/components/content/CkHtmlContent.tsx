'use client';

import { cn } from '@/lib/utils';

interface CkHtmlContentProps {
  html: string;
  className?: string;
}

/**
 * رندر HTML خروجی CKEditor 5 با استایل خوانا
 */
export function CkHtmlContent({ html, className }: CkHtmlContentProps) {
  if (!html.trim()) return null;

  return (
    <div
      className={cn(
        'ck-html-content prose prose-sm md:prose-base max-w-none text-right',
        'prose-headings:text-[#373A50] prose-p:text-[#373A50] prose-p:leading-8',
        'prose-a:text-[#2A86FE] prose-strong:text-[#373A50]',
        'prose-img:rounded-xl prose-img:shadow-sm',
        'prose-li:marker:text-[#2A86FE]',
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
