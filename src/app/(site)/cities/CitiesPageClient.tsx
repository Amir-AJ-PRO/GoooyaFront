'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useCities } from '@/hooks/useCities';
import { useLocations } from '@/hooks/useLocations';
import { Loader2, MapPin, Building2, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * فهرست شهرها و مناطق — برای مطالعه جزئیات هر شهر/محله
 */
export default function CitiesPageClient() {
  const { data: cities = [], isLoading: citiesLoading, error } = useCities();
  const [query, setQuery] = useState('');
  const [openCityId, setOpenCityId] = useState<number | null>(null);

  const filteredCities = useMemo(() => {
    const q = query.trim();
    if (!q) return cities;
    return cities.filter(
      (c) =>
        c.name.includes(q) ||
        (c.province ? c.province.includes(q) : false)
    );
  }, [cities, query]);

  const { data: locations = [], isLoading: locationsLoading } = useLocations(
    openCityId ?? undefined,
    { enabled: openCityId != null }
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 text-right">
        <h1 className="mb-2 text-2xl font-bold text-[#373A50] md:text-3xl">
          شهرها و مناطق
        </h1>
        <p className="text-sm leading-7 text-[#717171] md:text-base">
          شهر یا محله مورد نظرتان را انتخاب کنید و درباره آن بیشتر بخوانید.
        </p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجوی شهر یا استان..."
          className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 pr-10 pl-3 text-sm text-[#373A50] outline-none transition focus:border-[#2A86FE] focus:ring-2 focus:ring-[#2A86FE]/20"
        />
      </div>

      {citiesLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-[#2A86FE]" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
          خطا در دریافت لیست شهرها. لطفاً دوباره تلاش کنید.
        </div>
      ) : filteredCities.length === 0 ? (
        <div className="rounded-2xl bg-white px-4 py-12 text-center text-[#717171] shadow-sm">
          شهری با این عبارت پیدا نشد.
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredCities.map((city) => {
            const isOpen = openCityId === city.id;
            return (
              <li
                key={city.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="flex items-stretch">
                  <Link
                    href={`/cities/${city.id}`}
                    className="flex min-w-0 flex-1 items-center gap-3 px-4 py-4 text-right transition hover:bg-[#F8FAFC]"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2A86FE]/10 text-[#2A86FE]">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-bold text-[#373A50]">
                        {city.name}
                      </span>
                      {city.province ? (
                        <span className="mt-0.5 block text-xs text-[#717171]">
                          استان {city.province}
                        </span>
                      ) : null}
                    </span>
                  </Link>

                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-label={isOpen ? 'بستن مناطق' : 'مشاهده مناطق'}
                    onClick={() =>
                      setOpenCityId((prev) => (prev === city.id ? null : city.id))
                    }
                    className="flex items-center gap-1 border-r border-[#F3F4F6] px-4 text-xs font-medium text-[#2A86FE] transition hover:bg-[#F0F7FF]"
                  >
                    مناطق
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>
                </div>

                {isOpen ? (
                  <div className="border-t border-[#F3F4F6] bg-[#FAFBFC] px-4 py-3">
                    {locationsLoading ? (
                      <div className="flex justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-[#2A86FE]" />
                      </div>
                    ) : locations.length === 0 ? (
                      <p className="py-4 text-center text-sm text-[#717171]">
                        منطقه‌ای برای این شهر ثبت نشده است.
                      </p>
                    ) : (
                      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {locations.map((loc) => (
                          <li key={loc.id}>
                            <Link
                              href={`/locations/${loc.id}`}
                              className="flex items-center gap-2 rounded-xl border border-transparent bg-white px-3 py-2.5 text-sm text-[#373A50] shadow-sm transition hover:border-[#2A86FE]/30 hover:text-[#2A86FE]"
                            >
                              <Building2 className="h-3.5 w-3.5 shrink-0 text-[#9CA3AF]" />
                              <span className="truncate">{loc.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
