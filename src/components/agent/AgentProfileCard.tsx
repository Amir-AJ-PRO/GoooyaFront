'use client';

import { useAgentProfile } from '@/hooks/useAgentProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  MapPin, 
  Phone, 
  Building2, 
  Award, 
  Globe, 
  Instagram,
  CheckCircle2,
  XCircle,
  Settings,
  Clock
} from 'lucide-react';
import { getMediaUrl } from '@/lib/utils';
import Link from 'next/link';

/**
 * کامپوننت نمایش پروفایل agent
 * اگر is_verified = false باشد، فقط اطلاعات اولیه نمایش داده می‌شود
 */
export default function AgentProfileCard() {
  const { data: profile, isLoading, error } = useAgentProfile();

  if (isLoading) {
    return <AgentProfileSkeleton />;
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="w-5 h-5" />
            <p>خطا در دریافت اطلاعات پروفایل</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return null;
  }

  const isVerified = profile.is_verified;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-6">
        <Avatar className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
          <AvatarImage src={getMediaUrl(profile.profile_image)} />
          <AvatarFallback className="text-xl sm:text-2xl">
            {profile.full_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2">
            <CardTitle className="text-lg sm:text-xl md:text-2xl break-words">{profile.full_name}</CardTitle>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isVerified ? (
                <Badge variant="default" className="gap-1 text-xs">
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="hidden sm:inline">تأیید شده</span>
                  <span className="sm:hidden">تأیید</span>
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Clock className="w-3 h-3" />
                  <span className="hidden sm:inline">در انتظار تأیید</span>
                  <span className="sm:hidden">در انتظار</span>
                </Badge>
              )}
            </div>
          </div>
          {isVerified && profile.license_number && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
              پروانه کسب: {profile.license_number}
            </p>
          )}
        </div>
        <Link href={isVerified ? "/agent/settings" : "/user/settings"} className="w-full sm:w-auto">
          <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10">
            <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">ویرایش پروفایل</span>
            <span className="sm:hidden">ویرایش</span>
          </Button>
        </Link>
      </CardHeader>

      {/* فقط برای agent های تأیید شده اطلاعات کامل نمایش داده می‌شود */}
      {isVerified && (
        <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
          {/* اطلاعات دفتر */}
          {profile.office_name && (
          <div className="flex items-start gap-2">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm sm:text-base break-words">{profile.office_name}</p>
              {profile.office_address && (
                <p className="text-xs sm:text-sm text-muted-foreground break-words mt-1">
                  {profile.office_address}
                </p>
              )}
            </div>
          </div>
        )}

        {/* موقعیت */}
        {(profile.city || profile.region) && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
            <p className="text-xs sm:text-sm break-words">
              {[profile.city, profile.region].filter(Boolean).join('، ')}
            </p>
          </div>
        )}

        {/* تماس */}
        {(profile.phone || profile.office_phone) && (
          <div className="flex items-start sm:items-center gap-2">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0 mt-0.5 sm:mt-0" />
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-xs sm:text-sm min-w-0">
              {profile.phone && <span className="break-all">{profile.phone}</span>}
              {profile.office_phone && <span className="break-all">{profile.office_phone}</span>}
            </div>
          </div>
        )}

        {/* سابقه کار */}
        {profile.years_of_experience > 0 && (
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
            <p className="text-xs sm:text-sm">
              {profile.years_of_experience} سال سابقه کار
            </p>
          </div>
        )}

        {/* تخصص‌ها */}
        {profile.specialties && (
          <div>
            <p className="text-xs sm:text-sm font-medium mb-2">تخصص‌ها:</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {profile.specialties.split('،').map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* بیو */}
        {profile.bio && (
          <div>
            <p className="text-xs sm:text-sm font-medium mb-1">درباره:</p>
            <p className="text-xs sm:text-sm text-muted-foreground break-words">{profile.bio}</p>
          </div>
        )}

        {/* لینک‌های اجتماعی */}
        {(profile.website || profile.instagram) && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4 border-t">
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs sm:text-sm text-blue-600 hover:underline break-all"
              >
                <Globe className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>وب‌سایت</span>
              </a>
            )}
            {profile.instagram && (
              <a
                href={profile.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs sm:text-sm text-pink-600 hover:underline break-all"
              >
                <Instagram className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>اینستاگرام</span>
              </a>
            )}
          </div>
        )}
        </CardContent>
      )}
    </Card>
  );
}

/**
 * Skeleton برای حالت loading
 */
function AgentProfileSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}

