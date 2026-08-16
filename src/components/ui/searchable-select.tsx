'use client';

import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export type SearchableSelectOption = {
  value: string;
  label: string;
};

type SearchableSelectProps = {
  value?: string;
  onValueChange: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  triggerClassName?: string;
  contentClassName?: string;
  dir?: 'rtl' | 'ltr';
};

function normalizeSearchText(text: string) {
  return text
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ة/g, 'ه')
    .replace(/[أإآ]/g, 'ا')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = 'انتخاب کنید',
  searchPlaceholder = 'جستجو...',
  emptyText = 'موردی یافت نشد',
  disabled = false,
  loading = false,
  loadingText = 'در حال بارگذاری...',
  triggerClassName,
  contentClassName,
  dir = 'rtl',
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        if (disabled) return;
        setOpen(nextOpen);
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          dir={dir}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            triggerClassName,
          )}
        >
          <span className={cn('line-clamp-1', !selected && 'text-muted-foreground')}>
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        dir={dir}
        align="start"
        side="bottom"
        collisionPadding={{ top: 80, bottom: 16, left: 8, right: 8 }}
        className={cn(
          'z-[110] w-[var(--radix-popover-trigger-width)] p-0',
          contentClassName,
        )}
      >
        <Command
          className="[&_[cmdk-input-wrapper]_svg]:ml-2 [&_[cmdk-input-wrapper]_svg]:mr-0"
          filter={(itemValue, search) => {
            if (!search) return 1;
            return normalizeSearchText(itemValue).includes(normalizeSearchText(search)) ? 1 : 0;
          }}
        >
          <CommandInput
            autoFocus
            placeholder={searchPlaceholder}
            className="h-9 text-right"
          />
          <CommandList>
            <CommandEmpty>{loading ? loadingText : emptyText}</CommandEmpty>
            {!loading && options.length > 0 ? (
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={`${option.label} ${option.value}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onSelect={() => {
                      onValueChange(option.value);
                      setOpen(false);
                    }}
                    className="flex cursor-pointer justify-between text-right"
                  >
                    <span>{option.label}</span>
                    <Check
                      className={cn(
                        'h-4 w-4',
                        value === option.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
