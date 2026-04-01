'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { getImageUrl } from '@/lib/utils';
import { LayoutGrid, LogIn, Sparkles, User } from 'lucide-react';

export default function PublicNavbar() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
              <Sparkles size={20} />
            </div>
            <span className="text-lg font-black italic bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              ACTIVITY MSU
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/activities" className="text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
              Explorers
            </Link>
            {/* Add more links here if needed */}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link href="/dashboard" className="flex items-center space-x-3 p-1.5 pr-4 bg-muted/50 rounded-full border border-border hover:bg-muted transition-all group">
                <img
                  src={getImageUrl(user?.profile_image)}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-card group-hover:scale-105 transition-transform"
                />
                <span className="text-xs font-black uppercase tracking-wider text-foreground">
                  Dashboard
                </span>
              </Link>
            ) : (
              <Link href="/login">
                <Button className="rounded-full px-6 py-2 py-4 bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20">
                  <LogIn size={18} className="mr-2 inline-block" />
                  <span className="font-black uppercase tracking-widest text-xs">Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
