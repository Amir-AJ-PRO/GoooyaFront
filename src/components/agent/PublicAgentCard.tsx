'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, Globe, Instagram, MapPin, Award, Home as HomeIcon } from 'lucide-react';
import { getMediaUrl } from '@/lib/utils';
import type { PublicAgentListItem } from '@/services/agentsPublicApi';
import { Button } from '@/components/ui/button';

interface PublicAgentCardProps {
  agent: PublicAgentListItem;
}

export default function PublicAgentCard({ agent }: PublicAgentCardProps) {
  const name = agent.full_name || 'مشاور';
  const cityRegion = [agent.city_name, agent.region_name].filter(Boolean).join('، ');

  const specialties =
    agent.specialties
      ?.split('،')
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  return (
    <Card className="h-full">
      <CardHeader className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
            <AvatarImage src={getMediaUrl(agent.profile_image)} alt={name} />
            <AvatarFallback className="text-lg">{name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-bold text-base sm:text-lg truncate">{name}</div>
                {agent.office_name && (
                  <div className="text-xs sm:text-sm text-muted-foreground truncate mt-0.5">
                    {agent.office_name}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 justify-end">
                {agent.is_verified && (
                  <Badge variant="default" className="text-[10px] sm:text-xs">
                    تأیید شده
                  </Badge>
                )}
                {agent.is_goooya_adviser && (
                  <Badge variant="secondary" className="text-[10px] sm:text-xs">
                    مشاور گویا
                  </Badge>
                )}
              </div>
            </div>

            {cityRegion && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{cityRegion}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 flex-shrink-0" />
            <span>
              {agent.years_of_experience ? `${agent.years_of_experience} سال سابقه` : 'سابقه نامشخص'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <HomeIcon className="w-4 h-4 flex-shrink-0" />
            <span>{typeof agent.properties_count === 'number' ? `${agent.properties_count} فایل` : '—'}</span>
          </div>
        </div>

        {specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {specialties.slice(0, 4).map((s, idx) => (
              <Badge key={`${agent.id}-sp-${idx}`} variant="outline" className="text-[10px] sm:text-xs">
                {s}
              </Badge>
            ))}
            {specialties.length > 4 && (
              <Badge variant="outline" className="text-[10px] sm:text-xs">
                +{specialties.length - 4}
              </Badge>
            )}
          </div>
        )}

        {(agent.website || agent.instagram) && (
          <div className="flex items-center gap-3 pt-2 border-t">
            {agent.website && (
              <a
                href={agent.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline break-all"
              >
                <Globe className="w-3.5 h-3.5" />
                وب‌سایت
              </a>
            )}
            {agent.instagram && (
              <a
                href={agent.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-pink-600 hover:underline break-all"
              >
                <Instagram className="w-3.5 h-3.5" />
                اینستاگرام
              </a>
            )}
            {agent.office_phone && (
              <div className="mr-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Building2 className="w-3.5 h-3.5" />
                <span dir="ltr" className="break-all">
                  {agent.office_phone}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="pt-2">
          <Link href={`/agents/${agent.id}`} prefetch={true} className="block">
            <Button variant="outline" size="sm" className="w-full">
              مشاهده پروفایل مشاور
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}


