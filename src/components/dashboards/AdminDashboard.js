'use client';

import {
  ShieldCheck,
  Clock,
  Users,
  Activity,
  ArrowRight,
  TrendingUp,
  Globe
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import Link from 'next/link';

const AdminDashboard = ({ data }) => {
  const { stats, facultyDistribution = [] } = data || {};

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Fleet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm relative overflow-hidden">
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-3">สมาชิกทั้งหมด</p>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-4xl font-black text-foreground ">{stats?.totalUsers || 0}</span>
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Users className="text-primary" size={24} />
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/5 rounded-full blur-xl" />
        </div>

        <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm border-l-4 border-l-amber-500 relative overflow-hidden">
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-3">รอการอนุมัติ</p>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-4xl font-black text-foreground ">{stats?.pending || 0}</span>
            <div className="p-3 bg-amber-500/10 rounded-2xl">
              <Clock className="text-amber-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm border-l-4 border-l-emerald-500 relative overflow-hidden">
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-3">กำลังดำเนินการ</p>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-4xl font-black text-foreground ">{stats?.active || 0}</span>
            <div className="p-3 bg-emerald-500/10 rounded-2xl">
              <Activity className="text-emerald-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm border-l-4 border-l-indigo-500 relative overflow-hidden">
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-3">Active Faculties</p>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-4xl font-black text-foreground ">{facultyDistribution?.length || 0}</span>
            <div className="p-3 bg-indigo-500/10 rounded-2xl">
              <Globe className="text-indigo-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Faculty Distribution Chart (Visual bars) */}
        <div className="lg:col-span-2 bg-card p-8 rounded-[3rem] border border-border shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-black text-foreground tracking-tight">การกระจายตัวของกิจกรรม</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-wider">จำนวนกิจกรรมแยกตามคณะ</p>
            </div>
            <div className="p-4 bg-muted rounded-2xl text-primary rotating-icon">
              <TrendingUp size={24} />
            </div>
          </div>

          <div className="space-y-8">
            {facultyDistribution && facultyDistribution.length > 0 ? (
              facultyDistribution.map((fac, idx) => (
                <div key={idx} className="space-y-3 group">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">{fac.faculty_name}</span>
                    <span className="text-foreground font-black bg-muted px-2 py-0.5 rounded-lg">{fac.activity_count}</span>
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-primary to-indigo-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.3)]`}
                      style={{ width: `${Math.min((fac.activity_count / 20) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-16 text-center text-muted-foreground italic font-black uppercase tracking-widest opacity-30">
                ยังไม่มีข้อมูลกิจกรรมเริ่มต้น
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-primary p-8 rounded-[3rem] text-primary-foreground shadow-2xl relative shadow-primary/20 group overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-8 flex items-center uppercase tracking-widest italic">
                <ShieldCheck size={24} className="mr-3" />
                CORE CONTROL
              </h3>
              <div className="space-y-3">
                <Link href="/manage" className="flex items-center justify-between w-full p-4 bg-white/10 hover:bg-white/20 border border-white/5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest">
                  อนุมัติกิจกรรมใหม่
                  <div className="px-3 py-1 bg-amber-400 text-primary-foreground text-[10px] rounded-full font-black">
                    {stats?.pending || 0}
                  </div>
                </Link>
                <Link href="/manage" className="flex items-center justify-between w-full p-4 bg-white/10 hover:bg-white/20 border border-white/5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest">
                  จัดการผู้ใช้งาน
                  <Users size={18} />
                </Link>
                <Link href="/manage" className="flex items-center justify-between w-full p-4 bg-white/10 hover:bg-white/20 border border-white/5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest">
                  ภาพรวมทั้งมหาวิทยาลัย
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
            {/* Background glow */}
            <div className="absolute -left-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
