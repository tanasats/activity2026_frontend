'use client';

import {
  ShieldCheck,
  Clock,
  Users,
  Activity,
  ArrowRight,
  TrendingUp,
  Globe,
  Database,
  UserCheck,
  Layout
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import Link from 'next/link';

const SuperAdminDashboard = ({ data }) => {
  const { stats, facultyDistribution = [], roleDistribution = [] } = data || {};

  const getRoleLabel = (role) => {
    switch (role) {
      case 'student': return 'นิสิต';
      case 'officer': return 'เจ้าหน้าที่';
      case 'admin': return 'ผู้ดูแลระบบ';
      case 'superadmin': return 'Super Admin';
      case 'staff': return 'บุคลากร';
      default: return role;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* System Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-3">ผู้ใช้งานทั้งหมด</p>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-4xl font-black text-foreground">{stats?.totalUsers || 0}</span>
            <div className="p-3 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
              <Users className="text-primary" size={24} />
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/5 rounded-full blur-xl" />
        </div>

        <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm relative overflow-hidden group hover:border-amber-500/50 transition-colors">
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-3">คำขอรออนุมัติ</p>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-4xl font-black text-foreground">{stats?.pending || 0}</span>
            <div className="p-3 bg-amber-500/10 rounded-2xl group-hover:scale-110 transition-transform">
              <Clock className="text-amber-500" size={24} />
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-amber-500/5 rounded-full blur-xl" />
        </div>

        <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-3">กิจกรรมที่เปิดอยู่</p>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-4xl font-black text-foreground">{stats?.active || 0}</span>
            <div className="p-3 bg-emerald-500/10 rounded-2xl group-hover:scale-110 transition-transform">
              <Activity className="text-emerald-500" size={24} />
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl" />
        </div>

        <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-3">การลงทะเบียนรวม</p>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-4xl font-black text-foreground">{stats?.totalRegistrations || 0}</span>
            <div className="p-3 bg-indigo-500/10 rounded-2xl group-hover:scale-110 transition-transform">
              <UserCheck className="text-indigo-500" size={24} />
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Charts Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Faculty Distribution */}
          <div className="bg-card p-8 rounded-[3rem] border border-border shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-2xl font-black text-foreground tracking-tight uppercase italic">University Wide Distribution</h3>
                <p className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-wider">การกระจายตัวกิจกรรมแยกตามคณะ</p>
              </div>
              <div className="p-4 bg-muted rounded-2xl text-primary rotating-icon">
                <Globe size={24} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {facultyDistribution.map((fac, idx) => (
                <div key={idx} className="space-y-3 group">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[200px]">{fac.faculty_name}</span>
                    <span className="text-primary">{fac.activity_count}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                      style={{ width: `${Math.min((fac.activity_count / 15) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Role Composition */}
          <div className="bg-card p-8 rounded-[3rem] border border-border shadow-sm">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500">
                <Database size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-foreground tracking-tight uppercase">User Role Composition</h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">สัดส่วนประเภทผู้ใช้งานในระบบ</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {roleDistribution.map((role, idx) => (
                <div key={idx} className="flex-1 min-w-[150px] bg-muted/30 p-4 rounded-3xl border border-border/50 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-foreground">{role.count}</span>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter mt-1">{getRoleLabel(role.role)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[3rem] text-foreground  relative group overflow-hidden border border-border">
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-8 flex items-center uppercase tracking-widest italic text-primary">
                <ShieldCheck size={24} className="mr-3" />
                SYSTEM ROOT
              </h3>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">Management Modules</p>

                <Link href="/manage" className="flex items-center justify-between w-full p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[2rem] transition-all group/item">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-amber-500/20 rounded-xl text-amber-500">
                      <Layout size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest">จัดการกิจกรรม</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-white/20 group-hover/item:translate-x-1 transition-transform" />
                </Link>


                <Link href="/manage" className="flex items-center justify-between w-full p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[2rem] transition-all group/item">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-amber-500/20 rounded-xl text-amber-500">
                      <Layout size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest">Approve Activities</p>
                      <p className="text-[10px] font-bold uppercase mt-0.5">{stats?.pending} Pending</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-white/20 group-hover/item:translate-x-1 transition-transform" />
                </Link>

                <Link href="/users" className="flex items-center justify-between w-full p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[2rem] transition-all group/item">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-500">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest">User Directory</p>
                      <p className="text-[10px] font-bold uppercase mt-0.5">{stats?.totalUsers} Accounts</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-white/20 group-hover/item:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* <div className="mt-8 pt-8 border-t border-white/10">
                <button className="w-full py-4 bg-primary text-primary-foreground rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all">
                  System Configuration
                </button>
              </div> */}
            </div>

            {/* Design accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[100px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ChevronRight = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default SuperAdminDashboard;
