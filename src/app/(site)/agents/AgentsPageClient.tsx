'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Search, Users, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Pagination from '@/components/common/Pagination';
import PublicAgentCard from '@/components/agent/PublicAgentCard';
import { useAgentsList } from '@/hooks/useAgentsList';
import { useCities, useLocations } from '@/hooks/usePropertyMutations';

function parseBooleanParam(value: string | null): boolean | undefined {
  if (!value) return undefined;
  const normalized = value.toLowerCase();
  if (['1', 'true', 'yes'].includes(normalized)) return true;
  if (['0', 'false', 'no'].includes(normalized)) return false;
  return undefined;
}

export default function AgentsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showFilters, setShowFilters] = useState(true);

  // فیلترهای فرم (Draft) - تا وقتی "اعمال فیلترها" زده نشه، روی fetch اثر نمی‌ذاره
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyGooyaAdviser, setOnlyGooyaAdviser] = useState(false);
  const [pageSize, setPageSize] = useState(20);

  const { data: cities = [], isLoading: citiesLoading } = useCities();
  const selectedCityId = cityFilter !== 'all' ? Number(cityFilter) : undefined;
  const { data: locations = [], isLoading: locationsLoading } = useLocations(selectedCityId);

  // پارامترهای اعمال‌شده (Applied) از URL - مبنای fetch
  const appliedParams = useMemo(() => {
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('page_size') ?? '20', 10) || 20));

    const search = (searchParams.get('search') ?? '').trim() || undefined;
    const city = searchParams.get('city');
    const region = searchParams.get('region');
    const isVerified = parseBooleanParam(searchParams.get('is_verified'));
    const isGooya = parseBooleanParam(searchParams.get('is_goooya_adviser'));

    return {
      page,
      page_size: pageSize,
      search,
      city: city ? Number(city) : undefined,
      region: region ? Number(region) : undefined,
      is_verified: isVerified === true ? true : undefined,
      is_goooya_adviser: isGooya === true ? true : undefined,
    };
  }, [searchParams]);

  // sync کردن Draft با URL (وقتی URL عوض می‌شه یا صفحه‌ی جدید باز می‌شه)
  useEffect(() => {
    setSearchTerm(appliedParams.search ?? '');
    setCityFilter(typeof appliedParams.city === 'number' ? String(appliedParams.city) : 'all');
    setRegionFilter(typeof appliedParams.region === 'number' ? String(appliedParams.region) : 'all');
    setOnlyVerified(appliedParams.is_verified === true);
    setOnlyGooyaAdviser(appliedParams.is_goooya_adviser === true);
    setPageSize(appliedParams.page_size);
  }, [
    appliedParams.search,
    appliedParams.city,
    appliedParams.region,
    appliedParams.is_verified,
    appliedParams.is_goooya_adviser,
    appliedParams.page_size,
  ]);

  const { data, isLoading, error } = useAgentsList(appliedParams, true);
  const agents = data?.results ?? [];

  const paginationInfo = data
    ? {
        currentPage: data.page,
        totalPages: data.total_pages,
        totalCount: data.count,
      }
    : null;

  const activeFiltersCount = [
    searchTerm.trim() && 1,
    cityFilter !== 'all' && 1,
    regionFilter !== 'all' && 1,
    onlyVerified && 1,
    onlyGooyaAdviser && 1,
  ].filter(Boolean).length;

  const pushUrlFromParams = (p: {
    page: number;
    page_size: number;
    search?: string;
    city?: number;
    region?: number;
    is_verified?: boolean;
    is_goooya_adviser?: boolean;
  }) => {
    const params = new URLSearchParams();
    if (p.search) params.set('search', p.search);
    if (typeof p.city === 'number') params.set('city', String(p.city));
    if (typeof p.region === 'number') params.set('region', String(p.region));
    if (p.is_verified) params.set('is_verified', 'true');
    if (p.is_goooya_adviser) params.set('is_goooya_adviser', 'true');
    params.set('page', String(p.page));
    params.set('page_size', String(p.page_size));
    router.push(params.toString() ? `/agents?${params.toString()}` : '/agents');
  };

  const applyDraftToUrl = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (cityFilter !== 'all') params.set('city', cityFilter);
    if (regionFilter !== 'all') params.set('region', regionFilter);
    if (onlyVerified) params.set('is_verified', 'true');
    if (onlyGooyaAdviser) params.set('is_goooya_adviser', 'true');
    params.set('page_size', String(pageSize));
    params.set('page', '1');
    router.push(params.toString() ? `/agents?${params.toString()}` : '/agents');
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Users className="h-16 w-16 mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">خطا در بارگذاری مشاورین</h2>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-1">مشاورین</h1>
            <p className="text-muted-foreground">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  در حال بارگذاری...
                </span>
              ) : paginationInfo ? (
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-primary">{paginationInfo.totalCount}</span>
                  <span>مشاور</span>
                  {paginationInfo.totalPages > 1 && (
                    <>
                      <span className="mx-2">•</span>
                      <span>
                        صفحه {paginationInfo.currentPage} از {paginationInfo.totalPages}
                      </span>
                    </>
                  )}
                </span>
              ) : (
                <span>—</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-100 p-6 mb-8 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-semibold text-lg">فیلترها و جستجو</h2>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-1 bg-primary text-white text-xs font-bold rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            {showFilters ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
          </Button>
        </div>

        <div className={`space-y-4 transition-all duration-300 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2 lg:col-span-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="جستجو در نام، نام دفتر، تخصص‌ها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 h-11 bg-white border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="پاک کردن جستجو"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* City */}
            <Select
              value={cityFilter}
              onValueChange={(value) => {
                setCityFilter(value);
                setRegionFilter('all');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="شهر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه شهرها</SelectItem>
                {citiesLoading ? (
                  <SelectItem value="loading" disabled>
                    در حال بارگذاری...
                  </SelectItem>
                ) : (
                  cities.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {/* Region */}
            <Select
              value={regionFilter}
              onValueChange={setRegionFilter}
              disabled={cityFilter === 'all' || locationsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={cityFilter === 'all' ? 'ابتدا شهر را انتخاب کنید' : 'منطقه'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه مناطق</SelectItem>
                {locationsLoading ? (
                  <SelectItem value="loading" disabled>
                    در حال بارگذاری...
                  </SelectItem>
                ) : (
                  locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id.toString()}>
                      {loc.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {/* Page size */}
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="تعداد در صفحه" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20 مشاور</SelectItem>
                <SelectItem value="40">40 مشاور</SelectItem>
                <SelectItem value="60">60 مشاور</SelectItem>
                <SelectItem value="100">100 مشاور</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Checkboxes + Apply */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={onlyVerified} onCheckedChange={(v) => setOnlyVerified(Boolean(v))} />
              فقط تأیید شده‌ها
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={onlyGooyaAdviser}
                onCheckedChange={(v) => setOnlyGooyaAdviser(Boolean(v))}
              />
              فقط مشاورین گویا
            </label>

            <Button onClick={applyDraftToUrl} disabled={isLoading} className="bg-primary hover:bg-primary-hover text-white">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <Search className="h-4 w-4 ml-2" />}
              اعمال فیلترها
            </Button>

            <div className="hidden lg:block" />
          </div>

          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setCityFilter('all');
                  setRegionFilter('all');
                  setOnlyVerified(false);
                  setOnlyGooyaAdviser(false);
                  setPageSize(20);
                  router.push('/agents');
                }}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                پاک کردن همه فیلترها
              </Button>
              <span className="text-sm text-muted-foreground">{activeFiltersCount} فیلتر فعال</span>
            </div>
          )}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-6">
            <Users className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">مشاوری یافت نشد</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            با فیلترهای انتخاب شده نتیجه‌ای پیدا نشد. لطفاً فیلترها را تغییر دهید.
          </p>
          <Button variant="outline" onClick={() => router.push('/agents')} className="gap-2">
            <X className="h-4 w-4" />
            نمایش همه مشاورین
          </Button>
        </div>
      ) : (
        <>
          {paginationInfo && (
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                نمایش <span className="font-semibold text-foreground">{agents.length}</span> مشاور از{' '}
                <span className="font-semibold text-foreground">{paginationInfo.totalCount}</span>
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {agents.map((agent, idx) => (
              <div
                key={agent.id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <PublicAgentCard agent={agent} />
              </div>
            ))}
          </div>

          {paginationInfo && (
            <div className="mt-8">
              <Pagination
                currentPage={paginationInfo.currentPage}
                totalPages={paginationInfo.totalPages}
                onPageChange={(newPage) => {
                  pushUrlFromParams({
                    ...appliedParams,
                    page: newPage,
                    page_size: appliedParams.page_size,
                  });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}


