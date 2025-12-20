'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowRight, Users, MapPin, Building2, Award, Globe, Instagram } from 'lucide-react';
import { useAgentPublicProfile } from '@/hooks/useAgentPublicProfile';
import { getMediaUrl, formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import PropertyCard from '@/components/cards/PropertyCard';
import Pagination from '@/components/common/Pagination';

interface AgentPublicProfileClientProps {
  agentId: number;
}

export default function AgentPublicProfileClient({ agentId }: AgentPublicProfileClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = useMemo(() => {
    const v = parseInt(searchParams.get('page') ?? '1', 10);
    return Number.isFinite(v) && v > 0 ? v : 1;
  }, [searchParams]);

  const pageSize = useMemo(() => {
    const v = parseInt(searchParams.get('page_size') ?? '12', 10);
    const safe = Number.isFinite(v) && v > 0 ? v : 12;
    return Math.min(50, safe);
  }, [searchParams]);

  const [expandedBio, setExpandedBio] = useState(false);

  const { data, isLoading, error } = useAgentPublicProfile(agentId, { page, page_size: pageSize }, true);

  const agent = data?.agent;
  const properties = data?.properties?.results ?? [];
  const pagination = data?.properties
    ? {
        currentPage: data.properties.page,
        totalPages: data.properties.total_pages,
        totalCount: data.properties.count,
        pageSize: data.properties.page_size,
      }
    : null;

  const pushPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
    params.set('page_size', String(pageSize));
    router.push(`/agents/${agentId}?${params.toString()}`);
  };

  const setPageSizeAndReset = (nextSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    params.set('page_size', String(Math.min(50, nextSize)));
    router.push(`/agents/${agentId}?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    // 404 معمولاً از طریق proxy به صورت 404 برمی‌گردد، ولی اینجا پیام کلی نمایش می‌دهیم
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Users className="h-16 w-16 mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">مشاور یافت نشد</h2>
        <p className="text-muted-foreground mb-6">{error.message}</p>
        <Link href="/agents">
          <Button variant="outline" className="gap-2">
            <ArrowRight className="h-4 w-4" />
            بازگشت به لیست مشاورین
          </Button>
        </Link>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">اطلاعاتی برای نمایش وجود ندارد</h2>
        <Link href="/agents">
          <Button variant="outline" className="gap-2 mt-6">
            <ArrowRight className="h-4 w-4" />
            بازگشت
          </Button>
        </Link>
      </div>
    );
  }

  const cityRegion = [agent.city_name, agent.region_name].filter(Boolean).join('، ');
  const locations = agent.locations_names?.filter(Boolean) ?? [];
  const specialties =
    agent.specialties
      ?.split('،')
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  const bio = agent.bio?.trim() || '';
  const bioPreview = bio.length > 220 ? bio.slice(0, 220).trimEnd() + '...' : bio;
  const canToggleBio = bio.length > 260;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/agents" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowRight className="h-4 w-4" />
          بازگشت به لیست مشاورین
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="w-20 h-20 flex-shrink-0">
            <AvatarImage src={getMediaUrl(agent.profile_image)} alt={agent.full_name} />
            <AvatarFallback className="text-2xl">{agent.full_name?.charAt(0) ?? 'م'}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <CardTitle className="text-2xl md:text-3xl break-words">{agent.full_name}</CardTitle>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {agent.is_verified && <Badge variant="default">تأیید شده</Badge>}
              {agent.is_goooya_adviser && <Badge variant="secondary">مشاور گویا</Badge>}
              {typeof agent.ranking === 'number' && (
                <Badge variant="outline">رتبه: {new Intl.NumberFormat('fa-IR').format(agent.ranking)}</Badge>
              )}
              {typeof agent.properties_count === 'number' && (
                <Badge variant="outline">فایل فعال: {new Intl.NumberFormat('fa-IR').format(agent.properties_count)}</Badge>
              )}
            </div>

            {(agent.office_name || cityRegion) && (
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                {agent.office_name && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="break-words">{agent.office_name}</span>
                  </div>
                )}
                {cityRegion && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="break-words">{cityRegion}</span>
                  </div>
                )}
                {typeof agent.years_of_experience === 'number' && agent.years_of_experience > 0 && (
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span>{agent.years_of_experience} سال سابقه</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            {agent.website && (
              <a
                href={agent.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline break-all"
              >
                <Globe className="h-4 w-4" />
                وب‌سایت
              </a>
            )}
            {agent.instagram && (
              <a
                href={agent.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-pink-600 hover:underline break-all"
              >
                <Instagram className="h-4 w-4" />
                اینستاگرام
              </a>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {(agent.office_address || locations.length > 0 || specialties.length > 0 || bio) && <Separator />}

          {agent.office_address && (
            <div className="text-sm">
              <div className="font-semibold mb-1">آدرس دفتر</div>
              <div className="text-muted-foreground break-words">{agent.office_address}</div>
            </div>
          )}

          {locations.length > 0 && (
            <div className="text-sm">
              <div className="font-semibold mb-2">محله‌های تحت پوشش</div>
              <div className="flex flex-wrap gap-2">
                {locations.slice(0, 12).map((loc, idx) => (
                  <Badge key={`${agent.id}-loc-${idx}`} variant="secondary">
                    {loc}
                  </Badge>
                ))}
                {locations.length > 12 && <Badge variant="outline">+{locations.length - 12}</Badge>}
              </div>
            </div>
          )}

          {specialties.length > 0 && (
            <div className="text-sm">
              <div className="font-semibold mb-2">تخصص‌ها</div>
              <div className="flex flex-wrap gap-2">
                {specialties.map((s, idx) => (
                  <Badge key={`${agent.id}-sp-${idx}`} variant="outline">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {bio && (
            <div className="text-sm leading-7">
              <div className="font-semibold mb-2">درباره مشاور</div>
              <div className="text-muted-foreground">
                {expandedBio || !canToggleBio ? bio : bioPreview}
              </div>
              {canToggleBio && (
                <div className="mt-3">
                  <Button variant="outline" size="sm" onClick={() => setExpandedBio((v) => !v)}>
                    {expandedBio ? 'نمایش کمتر' : 'ادامه مطلب'}
                  </Button>
                </div>
              )}
            </div>
          )}

          {(agent.created_at || agent.updated_at) && (
            <div className="text-xs text-muted-foreground">
              {agent.created_at && <span>تاریخ ایجاد: {formatDate(agent.created_at)}</span>}
              {agent.created_at && agent.updated_at && <span className="mx-2">•</span>}
              {agent.updated_at && <span>آخرین بروزرسانی: {formatDate(agent.updated_at)}</span>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Properties */}
      <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">املاک مرتبط</h2>
          {pagination && (
            <p className="text-sm text-muted-foreground mt-1">
              نمایش <span className="font-semibold text-foreground">{properties.length}</span> ملک از{' '}
              <span className="font-semibold text-foreground">{pagination.totalCount}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">تعداد در صفحه:</span>
          <div className="flex gap-1">
            {[12, 24, 36, 50].map((n) => (
              <Button
                key={n}
                variant={pageSize === n ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPageSizeAndReset(n)}
              >
                {n}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-16">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">فعلاً ملکی برای نمایش وجود ندارد.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {properties.map((p, idx) => (
              <div
                key={p.id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <PropertyCard property={p} />
              </div>
            ))}
          </div>

          {pagination && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(newPage) => {
                pushPage(newPage);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </>
      )}
    </div>
  );
}


