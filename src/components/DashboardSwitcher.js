'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { reportService } from '@/services/reportService';
import StudentDashboard from './dashboards/StudentDashboard';
import OfficerDashboard from './dashboards/OfficerDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/Button';

const DashboardSwitcher = () => {
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const dashboardData = await reportService.getDashboardData();
        setData(dashboardData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('ไม่สามารถโหลดข้อมูลแดชบอร์ดได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse rounded-full" />
        </div>
        <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px] animate-pulse">
           กำลังเตรียมข้อมูลส่วนตัวของคุณ...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 p-12 rounded-[2.5rem] border border-destructive/20 text-center animate-in zoom-in-95 duration-500">
        <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-6 text-destructive">
             <span className="text-2xl font-black">!</span>
        </div>
        <p className="text-foreground font-black uppercase tracking-widest mb-2">ขออภัย เกิดข้อผิดพลาด</p>
        <p className="text-muted-foreground text-sm font-medium">{error}</p>
        <Button 
          variant="danger"
          onClick={() => window.location.reload()}
          className="mt-8 px-10"
        >
          ลองใหม่อีกครั้ง
        </Button>
      </div>
    );
  }

  // Switch based on user role
  switch (user?.role) {
    case 'student':
      return <StudentDashboard data={data} />;
    case 'officer':
      return <OfficerDashboard data={data} />;
    case 'admin':
    case 'superadmin':
      return <AdminDashboard data={data} />;
    case 'staff':
    case 'guest':
    default:
      return (
        <div className="bg-card p-16 rounded-[3rem] border border-border text-center shadow-sm relative overflow-hidden group">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-8 text-5xl group-hover:scale-110 transition-transform duration-500">
            👋
          </div>
          <h2 className="text-3xl font-black text-foreground mb-4 tracking-tight">สวัสดี ยินดีต้อนรับ</h2>
          <p className="text-muted-foreground max-w-md mx-auto font-medium leading-relaxed">
            บัญชีของคุณ ({user?.email}) เข้าสู่ระบบสำเร็จแล้ว แต่คุณยังไม่มีสิทธิ์เข้าถึงฟังก์ชันหลักของระบบกิจกรรมในขณะนี้ 
            กรุณารอดำเนินการปรับปรุงสิทธิ์โดยติดต่อผู้ดูแลระบบ
          </p>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
        </div>
      );
  }
};

export default DashboardSwitcher;
