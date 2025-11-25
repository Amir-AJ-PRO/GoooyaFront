'use client';

import { useAuth } from '@/contexts/AuthContext';
import { getUserData } from '@/lib/tokenManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

/**
 * صفحه دیباگ - برای بررسی localStorage و backendUser
 */
export default function DebugPage() {
  const { user, backendUser } = useAuth();
  const [localStorageData, setLocalStorageData] = useState<any>(null);
  
  useEffect(() => {
    const data = getUserData();
    setLocalStorageData(data);
  }, []);
  
  const refreshData = () => {
    const data = getUserData();
    setLocalStorageData(data);
  };
  
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
        
        {/* localStorage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>💾 localStorage (__ud__)</CardTitle>
            <Button onClick={refreshData} size="sm">تازه‌سازی</Button>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-left" dir="ltr">
              {JSON.stringify(localStorageData, null, 2)}
            </pre>
            
            {localStorageData?.agent_profile && (
              <div className="mt-4 p-4 bg-green-50 rounded">
                <h3 className="font-bold mb-2">✅ agent_profile در localStorage:</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>id:</strong> {localStorageData.agent_profile.id}</p>
                  <p><strong>full_name:</strong> {localStorageData.agent_profile.full_name}</p>
                  <p><strong>is_verified:</strong> {String(localStorageData.agent_profile.is_verified)}</p>
                  <p className="text-lg font-bold text-red-600">
                    <strong>🔥 is_goooya_adviser:</strong> {String(localStorageData.agent_profile.is_goooya_adviser)}
                  </p>
                </div>
              </div>
            )}
            
            {!localStorageData?.agent_profile && (
              <div className="mt-4 p-4 bg-red-50 rounded text-red-600">
                <p className="font-bold">❌ agent_profile در localStorage موجود نیست!</p>
              </div>
            )}
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
                <p><strong>is_agent:</strong> {String(backendUser?.is_agent)}</p>
                <p><strong>user_role:</strong> {backendUser?.user_role || 'N/A'}</p>
                <p><strong>agent_profile exists:</strong> {String(!!backendUser?.agent_profile)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

