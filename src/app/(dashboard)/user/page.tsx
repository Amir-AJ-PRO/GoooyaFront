'use client';

import { useAuth } from '@/contexts/AuthContext';
import UserDashboard from '@/components/dashboard/UserDashboard';
import AgentDashboard from '@/components/dashboard/AgentDashboard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UserPage() {
  const { user, backendUser } = useAuth();
  const router = useRouter();
  
  const isVerifiedAgent = backendUser?.agent_profile?.is_verified === true;

  useEffect(() => {
    if (user && user.type !== 'user' && isVerifiedAgent) {
      router.replace('/agent');
    }
  }, [user, isVerifiedAgent, router]);

  if (!user) {
    return null;
  }
  
  // اگر user.type !== 'user' باشد و is_verified = true، به agent redirect میشه
  if (user.type !== 'user' && isVerifiedAgent) {
    return null;
  }

  // اگر agent_profile وجود داشته باشد و is_verified = true
  if (isVerifiedAgent) {
    return <AgentDashboard />;
  }

  return <UserDashboard />;
}

