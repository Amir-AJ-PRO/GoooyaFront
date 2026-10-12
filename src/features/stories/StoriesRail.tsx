'use client';

import type { StoryItem } from '@/types/story';
import { cn } from '@/lib/utils';
import { StoryCoverImage } from './StoryCoverImage';

type StoriesRailProps = {
  stories: StoryItem[];
  seenSlugs: ReadonlySet<string>;
  onSelect: (index: number) => void;
};

/**
 * نوار افقی استوری با حلقه گرادیان و اسکرول نرم
 */
export function StoriesRail({ stories, seenSlugs, onSelect }: StoriesRailProps) {
  if (stories.length === 0) return null;

  return (
    <div className="-mx-1 overflow-x-auto pb-2 pt-1 hide-scrollbar">
      <ul className="flex snap-x snap-mandatory gap-4 px-1">
        {stories.map((story, index) => {
          const seen = seenSlugs.has(story.slug);
          return (
            <li key={story.id} className="w-[76px] shrink-0 snap-start">
              <button
                type="button"
                onClick={() => onSelect(index)}
                className="group flex w-full flex-col items-center gap-2 text-center focus-visible:outline-none"
                aria-label={`پخش ${story.title}`}
              >
                <span
                  className={cn(
                    'pointer-events-none relative block rounded-full p-[2.5px] transition-transform duration-[400ms] ease-out',
                    'motion-safe:group-hover:scale-[1.04]',
                    seen
                      ? 'bg-[#D1D5DB]'
                      : 'bg-[conic-gradient(from_200deg,#2A86FE_0%,#D4AF37_55%,#2A86FE_100%)]'
                  )}
                >
                  <span className="block rounded-full bg-white p-[2px]">
                    <StoryCoverImage
                      src={story.cover}
                      alt=""
                      className="h-[68px] w-[68px] rounded-full object-cover"
                    />
                  </span>
                </span>
                <span className="pointer-events-none line-clamp-2 min-h-[2.5rem] text-[11px] leading-tight text-[#373A50]">
                  {story.title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
