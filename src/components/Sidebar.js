'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
  LayoutDashboard,
  Calendar,
  Settings,
  LogOut,
  FileText,
  ShieldCheck,
  User,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const Sidebar = ({ isOpen, onClose, onLogoutClick }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const navItems = [
    { name: 'แดชบอร์ด', href: '/dashboard', icon: LayoutDashboard, roles: ['student', 'officer', 'admin', 'superadmin', 'staff', 'guest'] },
    { name: 'กิจกรรมทั้งหมด', href: '/activities', icon: Calendar, roles: ['student', 'officer', 'admin', 'superadmin'] },
    { name: 'หน่วยงาน/จัดการ', href: '/manage', icon: ShieldCheck, roles: ['officer', 'admin', 'superadmin'] },
    { name: 'ทรานสคลิป', href: '/transcript', icon: FileText, roles: ['student'] },
    { name: 'โปรไฟล์', href: '/profile', icon: User, roles: ['student', 'officer', 'admin', 'superadmin', 'staff', 'guest'] },
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed md:sticky left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col z-50 transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">Activity MSU</h1>
          <button
            onClick={onClose}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose?.()}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon size={20} className={cn(isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={onLogoutClick}
            className={cn(
              "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group text-muted-foreground hover:bg-muted hover:text-foreground w-full"
            )}
          >
            <LogOut size={20} />
            <span className="font-medium">ออกจากระบบ</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
