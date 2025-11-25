'use client';

import { useAuth } from '@/contexts/AuthContext';
import AgentDashboard from '@/components/dashboard/AgentDashboard';
import UserDashboard from '@/components/dashboard/UserDashboard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AgentPage() {
  const { user, backendUser } = useAuth();
  const router = useRouter();
  
  const isVerifiedAgent = backendUser?.agent_profile?.is_verified === true;

  useEffect(() => {
    if (user && user.type === 'user' && !isVerifiedAgent) {
      router.replace('/user');
    }
  }, [user, isVerifiedAgent, router]);

  if (!user || (user.type === 'user' && !isVerifiedAgent)) {
    return null;
  }

  // اگر agent_profile وجود داشته باشد اما is_verified = false
  if (backendUser?.agent_profile && !isVerifiedAgent) {
    return <UserDashboard />;
  }

  return <AgentDashboard />;
}

