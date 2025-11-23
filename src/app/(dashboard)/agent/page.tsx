'use client';

import { useAuth } from '@/contexts/AuthContext';
import AgentDashboard from '@/components/dashboard/AgentDashboard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AgentPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.type === 'user') {
      router.replace('/user');
    }
  }, [user, router]);

  if (!user || user.type === 'user') {
    return null;
  }

  return <AgentDashboard />;
}

