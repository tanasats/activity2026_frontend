'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const userJson = searchParams.get('user');

    if (token && userJson) {
      try {
        const user = JSON.parse(decodeURIComponent(userJson));
        setAuth(user, token);
        
        // Handle returnTo redirect
        const returnTo = sessionStorage.getItem('returnTo');
        if (returnTo) {
          sessionStorage.removeItem('returnTo');
          router.push(returnTo);
        } else {
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Failed to parse user data', err);
        router.push('/login?error=invalid_data');
      }
    } else {
      router.push('/login?error=no_token');
    }
  }, [searchParams, setAuth, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">กำลังนำคุณเข้าสู่ระบบ...</p>
      </div>
    </div>
  );
}
