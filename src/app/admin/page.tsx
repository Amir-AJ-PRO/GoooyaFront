'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import UserDashboard from '@/components/admin/UserDashboard';
import AgentDashboard from '@/components/admin/AgentDashboard';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Route based on user type
  switch (user.type) {
    case 'user':
      return <UserDashboard />;
    case 'agent':
    case 'admin':
      return <AgentDashboard />;
    default:
      router.replace('/');
      return null;
  }
}
