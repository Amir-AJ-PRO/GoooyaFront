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
  Settings
} from 'lucide-react';
import { getMediaUrl } from '@/lib/utils';
import Link from 'next/link';

/**
 * کامپوننت نمایش پروفایل agent
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

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={getMediaUrl(profile.profile_image)} />
          <AvatarFallback className="text-2xl">
            {profile.full_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-2xl">{profile.full_name}</CardTitle>
            {profile.is_verified && (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="w-3 h-3" />
                تأیید شده
              </Badge>
            )}
          </div>
          {profile.license_number && (
            <p className="text-sm text-muted-foreground mt-1">
              پروانه کسب: {profile.license_number}
            </p>
          )}
        </div>
        <Link href="/agent/settings">
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            ویرایش پروفایل
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* اطلاعات دفتر */}
        {profile.office_name && (
          <div className="flex items-start gap-2">
            <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">{profile.office_name}</p>
              {profile.office_address && (
                <p className="text-sm text-muted-foreground">
                  {profile.office_address}
                </p>
              )}
            </div>
          </div>
        )}

        {/* موقعیت */}
        {(profile.city || profile.region) && (
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm">
              {[profile.city, profile.region].filter(Boolean).join('، ')}
            </p>
          </div>
        )}

        {/* تماس */}
        {(profile.phone || profile.office_phone) && (
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <div className="flex gap-4 text-sm">
              {profile.phone && <span>{profile.phone}</span>}
              {profile.office_phone && <span>{profile.office_phone}</span>}
            </div>
          </div>
        )}

        {/* سابقه کار */}
        {profile.years_of_experience > 0 && (
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm">
              {profile.years_of_experience} سال سابقه کار
            </p>
          </div>
        )}

        {/* تخصص‌ها */}
        {profile.specialties && (
          <div>
            <p className="text-sm font-medium mb-2">تخصص‌ها:</p>
            <div className="flex flex-wrap gap-2">
              {profile.specialties.split('،').map((specialty, index) => (
                <Badge key={index} variant="secondary">
                  {specialty.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* بیو */}
        {profile.bio && (
          <div>
            <p className="text-sm font-medium mb-1">درباره:</p>
            <p className="text-sm text-muted-foreground">{profile.bio}</p>
          </div>
        )}

        {/* لینک‌های اجتماعی */}
        {(profile.website || profile.instagram) && (
          <div className="flex gap-4 pt-4 border-t">
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                <Globe className="w-4 h-4" />
                وب‌سایت
              </a>
            )}
            {profile.instagram && (
              <a
                href={profile.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-pink-600 hover:underline"
              >
                <Instagram className="w-4 h-4" />
                اینستاگرام
              </a>
            )}
          </div>
        )}
      </CardContent>
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

