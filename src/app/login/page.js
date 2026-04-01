'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { LogIn, Chrome, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };


  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-[1000px] bg-card rounded-[3rem] shadow-2xl shadow-primary/10 flex flex-col lg:flex-row overflow-hidden relative z-10 border border-border">
        {/* Left Side: Illustration / Promo */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-primary to-indigo-700 p-12 text-primary-foreground flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                <Sparkles size={24} />
              </div>
              <span className="text-xl font-black italic border-b-2 border-white/30">ACTIVITY MSU</span>
            </div>
            <h1 className="text-4xl font-black mb-6">
              สะสมชั่วโมง <br />
              <span className="text-primary-foreground/60 italic">BUILD YOUR FUTURE</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg font-medium max-w-sm">
              ระบบทรานสคลิปกิจกรรมนิสิต <br />มหาวิทยาลัยมหาสารคาม
            </p>
          </div>

          <div className="space-y-4 mt-12 relative z-10">
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10 hover:bg-white/20 transition-all cursor-default group">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Chrome size={24} />
              </div>
              <div>
                <h4 className="font-black uppercase text-[10px] tracking-widest text-primary-foreground/60">Fast Access</h4>
                <p className="text-sm font-bold">Google OAuth Integration</p>
              </div>
            </div>
          </div>

          {/* Background pattern */}
          <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-card">
          <div className="text-center lg:text-left mb-12">
            <h2 className="text-4xl font-black text-foreground mb-3 tracking-tight">เข้าใช้งานระบบ</h2>
            <p className="text-muted-foreground font-medium">โปรดใช้อีเมล @msu.ac.th เพื่อเริ่มต้น</p>
          </div>

          <div className="space-y-8">
            <Button
              onClick={handleGoogleLogin}
              className="w-full py-5 text-lg font-black shadow-2xl shadow-primary/20 bg-gradient-to-r from-primary to-indigo-600 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-[1.5rem]"
              disabled={loading}
            >
              <div className="flex items-center justify-center uppercase tracking-widest">
                <Chrome size={22} className="mr-3" />
                Sign in with Google
              </div>
            </Button>

            <div className="relative flex items-center justify-center py-4">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] opacity-50">University Account</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <div className="space-y-4">
              <p className="text-center text text-muted-foreground font-medium leading-relaxed italic">
                "กิจกรรมนิสิต คือส่วนหนึ่งของการเรียนรู้ที่สมบูรณ์"<br />
                - ฝ่ายพัฒนานิสิต มหาวิทยาลัยมหาสารคาม
              </p>
            </div>
          </div>

          <footer className="mt-8 pt-8 border-t border-border text-center lg:text-left text-muted-foreground text-[12px] font-black uppercase tracking-widest opacity-40">
            <p>© 2026 Activity MSU. All rights reserved.<br />
              งานพัฒนาระบบสารสนเทศ สำนักคอมพิวเตอร์</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
