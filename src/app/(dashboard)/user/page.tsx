'use client';

import { useAuth } from '@/contexts/AuthContext';
import UserDashboard from '@/components/dashboard/UserDashboard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UserPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.type !== 'user') {
      router.replace('/agent');
    }
  }, [user, router]);

  if (!user || user.type !== 'user') {
    return null;
  }

  return <UserDashboard />;
}

