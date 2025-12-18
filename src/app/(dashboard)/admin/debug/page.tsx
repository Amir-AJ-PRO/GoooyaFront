'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

/**
 * صفحه دیباگ - برای بررسی session و backendUser
 */
export default function DebugPage() {
  const { user, backendUser } = useAuth();
  
  return (
    <div className="container mx-auto py-8 px-4" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">🔍 صفحه دیباگ</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {/* User از AuthContext */}
        <Card>
          <CardHeader>
            <CardTitle>👤 user از AuthContext</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-left" dir="ltr">
              {JSON.stringify(user, null, 2)}
            </pre>
          </CardContent>
        </Card>
        
        {/* BackendUser از AuthContext */}
        <Card>
          <CardHeader>
            <CardTitle>🔐 backendUser از AuthContext</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-left" dir="ltr">
              {JSON.stringify(backendUser, null, 2)}
            </pre>
            
            {backendUser?.agent_profile && (
              <div className="mt-4 p-4 bg-blue-50 rounded">
                <h3 className="font-bold mb-2">🏢 agent_profile:</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>id:</strong> {backendUser.agent_profile.id}</p>
                  <p><strong>full_name:</strong> {backendUser.agent_profile.full_name}</p>
                  <p><strong>is_verified:</strong> {String(backendUser.agent_profile.is_verified)}</p>
                  <p className="text-lg font-bold text-red-600">
                    <strong>🔥 is_goooya_adviser:</strong> {String(backendUser.agent_profile.is_goooya_adviser)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Session Info */}
        <Card>
          <CardHeader>
            <CardTitle>🔐 اطلاعات Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Session Status:</strong> {user ? '✅ فعال' : '❌ غیرفعال'}</p>
              <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
              <p><strong>User Type:</strong> {user?.type || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>
        
        {/* نتیجه */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 نتیجه بررسی</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className={`p-4 rounded ${backendUser?.agent_profile?.is_goooya_adviser ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className="font-bold text-lg">
                  {backendUser?.agent_profile?.is_goooya_adviser 
                    ? '✅ شما مشاور گویا هستید!'
                    : '❌ شما مشاور گویا نیستید!'}
                </p>
                <p className="text-sm mt-2">
                  backendUser?.agent_profile?.is_goooya_adviser = {String(backendUser?.agent_profile?.is_goooya_adviser)}
                </p>
              </div>
              
              <div className="text-sm space-y-2">
                <p><strong>user type:</strong> {user?.type || 'N/A'}</p>
                <p><strong>agent_profile exists:</strong> {String(!!backendUser?.agent_profile)}</p>
                <p><strong>is_verified:</strong> {String(backendUser?.agent_profile?.is_verified)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

