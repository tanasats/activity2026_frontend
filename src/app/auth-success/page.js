'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

// 1. แยกส่วนที่ใช้ useSearchParams ออกมาเป็น Component ย่อย
function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const userJson = searchParams.get('user');

    if (token && userJson) {
      try {
        const user = JSON.parse(decodeURIComponent(userJson));
        setAuth(user, token, refreshToken);

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
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium animate-pulse">กำลังนำคุณเข้าสู่ระบบ...</p>
    </div>
  );
}

// 2. Main Page ที่ทำหน้าที่ครอบด้วย Suspense
export default function AuthSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Suspense จะช่วยจัดการเรื่อง Client-side Rendering 
          ทำให้ Next.js ไม่พยายาม Prerender หน้านี้แบบ Static ตอน Build 
      */}
      <Suspense fallback={
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-400 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium">กำลังเตรียมข้อมูล...</p>
        </div>
      }>
        <AuthSuccessContent />
      </Suspense>
    </div>
  );
}