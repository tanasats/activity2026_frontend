'use client';

import { useAuthStore } from '@/store/useAuthStore';
import Sidebar from '@/components/Sidebar';
import MobileHeader from '@/components/MobileHeader';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

export default function SystemLayout({ children }) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
    router.push('/login');
  };

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <MobileHeader onMenuClick={() => setIsDrawerOpen(true)} />
      <Sidebar
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onLogoutClick={() => setShowLogoutModal(true)}
      />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 min-h-screen overflow-x-hidden">
        {/* Header (Desktop Only) */}
        <header className="hidden md:flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">สวัสดี, {user.username}</h2>
            <p className="text-muted-foreground text-sm font-medium">ยินดีต้อนรับกลับสู่ระบบ</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="block px-3 py-1 bg-primary/10 text-primary text-sm font-black rounded-full uppercase tracking-wider">
                {user.role}
              </span>
              {user.faculty_name && (
                <p className="text-sm text-muted-foreground uppercase leading-none">
                  {user.faculty_name}
                </p>
              )}
            </div>
            <img
              src={user.profile_image || "https://i.pravatar.cc/150"}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-card shadow-sm"
            />
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="ยืนยันการออกจากระบบ"
        message="คุณต้องการออกจากระบบใช่หรือไม่? ข้อมูลที่ยังไม่ได้บันทึกอาจสูญหายได้"
        confirmText="ออกจากระบบ"
        cancelText="ยกเลิก"
        type="warning"
      />
    </div>
  );
}
