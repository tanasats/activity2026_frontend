'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Menu } from 'lucide-react';
import Image from 'next/image';


const MobileHeader = ({ onMenuClick }) => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-16 glass border-b border-border px-4 flex justify-between items-center z-40">
      <button
        onClick={onMenuClick}
        className="p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors"
      >
        <Menu size={24} />
      </button>

      <div className="flex flex-col items-center">
        <h1 className="text-sm font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
          ACTIVITY MSU
        </h1>
        <div className="h-0.5 w-8 bg-primary rounded-full mt-0.5" />
      </div>

      <div className="flex items-center space-x-3">
        {user.faculty_name && (
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right leading-tight max-w-[100px] truncate">
            {user.faculty_name}
          </p>
        )}
        <div className="relative w-9 h-9">
          <Image
            src={user.profile_image || "https://i.pravatar.cc/150"}
            alt="Profile"
            fill
            sizes="36px"
            className="rounded-full border-2 border-card shadow-sm object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
