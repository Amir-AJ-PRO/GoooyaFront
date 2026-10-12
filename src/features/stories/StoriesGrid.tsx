'use client';

import { Play } from 'lucide-react';
import type { StoryItem } from '@/types/story';
import { cn } from '@/lib/utils';
import { StoryCoverImage } from './StoryCoverImage';

type StoriesGridProps = {
  stories: StoryItem[];
  seenSlugs: ReadonlySet<string>;
  onSelect: (index: number) => void;
};

/**
 * شبکه ریلزمانند — کلیک = باز شدن مدال پخش
 */
export function StoriesGrid({ stories, seenSlugs, onSelect }: StoriesGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {stories.map((story, index) => {
        const seen = seenSlugs.has(story.slug);
        return (
          <li key={story.id}>
            <button
              type="button"
              onClick={() => onSelect(index)}
              className={cn(
                'group relative block aspect-[9/16] w-full overflow-hidden rounded-2xl bg-[#1a1a1a] text-right shadow-soft',
                'transition-[transform,box-shadow] duration-300 ease-out',
                'motion-safe:hover:scale-[1.02] hover:shadow-[0_12px_28px_rgba(42,134,254,0.18)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A86FE] focus-visible:ring-offset-2'
              )}
              aria-label={`پخش ${story.title}`}
            >
              <StoryCoverImage
                src={story.cover}
                alt=""
                className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

              <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white ring-1 ring-white/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                <Play className="mr-[-2px] h-5 w-5 fill-white" aria-hidden="true" />
              </span>

              {seen ? (
                <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white/90 backdrop-blur-sm">
                  دیده‌شده
                </span>
              ) : (
                <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-[#2A86FE] px-2 py-0.5 text-[10px] font-medium text-white">
                  ریلز
                </span>
              )}

              <span className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-4">
                <span className="line-clamp-2 text-sm font-bold leading-snug text-white sm:text-[15px]">
                  {story.title}
                </span>
                {story.description ? (
                  <span className="mt-1 line-clamp-1 text-[11px] text-white/75">
                    {story.description}
                  </span>
                ) : null}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
