'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { 
  Trophy, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  PlusCircle,
  Layout,
  ExternalLink
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import Link from 'next/link';

const StudentDashboard = ({ data }) => {
  const { summary = {}, registrations = [], recommended = [] } = data || {};

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-[2.5rem] border border-border shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:scale-110 transition-transform">
              <Trophy size={24} />
            </div>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Count</span>
          </div>
          <p className="text-3xl font-black text-foreground">{summary.total_activities || 0}</p>
          <p className="text-sm font-medium text-muted-foreground mt-1">กิจกรรมที่เข้าร่วมแล้ว</p>
        </div>

        <div className="bg-card p-6 rounded-[2.5rem] border border-border shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl group-hover:scale-110 transition-transform">
              <Clock size={24} />
            </div>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Hours</span>
          </div>
          <p className="text-3xl font-black text-foreground">{summary.total_hours || 0}</p>
          <p className="text-sm font-medium text-muted-foreground mt-1">ชั่วโมงรวมสะสม</p>
        </div>

        <div className="bg-card p-6 rounded-[2.5rem] border border-border shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl group-hover:scale-110 transition-transform">
              <CheckCircle2 size={24} />
            </div>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Credits</span>
          </div>
          <p className="text-3xl font-black text-foreground">{summary.total_credits || 0}</p>
          <p className="text-sm font-medium text-muted-foreground mt-1">หน่วยกิตรวมที่ได้รับ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Registrations */}
        <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h3 className="font-bold text-foreground flex items-center">
              <Layout className="mr-2 text-primary" size={20} />
              รายการที่คุณลงทะเบียนแล้ว
            </h3>
            <Link href="/transcript" className="text-xs text-primary font-bold hover:underline flex items-center uppercase tracking-wider">
              ดูทั้งหมด <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {registrations && registrations.length > 0 ? (
              registrations.map((reg) => (
                <div key={reg.id} className="p-4 hover:bg-muted/50 transition-colors flex justify-between items-center group">
                  <div>
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors">{reg.title}</p>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-[10px] font-medium text-muted-foreground uppercase">{new Date(reg.activity_start).toLocaleDateString('th-TH')}</span>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <span className="text-[10px] font-medium text-muted-foreground uppercase">{reg.hours} ชั่วโมง</span>
                    </div>
                  </div>
                  <Badge variant={reg.status === 'attended' ? 'success' : 'primary'}>
                    {reg.status === 'attended' ? 'เข้าร่วมแล้ว' : 'ลงทะเบียนแล้ว'}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <p className="text-muted-foreground italic font-medium">คุณยังไม่ได้ลงทะเบียนกิจกรรมใดๆ</p>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Activities */}
        <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h3 className="font-bold text-foreground flex items-center">
              <PlusCircle className="mr-2 text-indigo-500" size={20} />
              กิจกรรมแนะนำที่น่าสนใจ
            </h3>
            <Link href="/activities" className="text-xs text-indigo-500 font-bold hover:underline flex items-center uppercase tracking-wider">
              ค้นหาเพิ่ม <ExternalLink size={14} className="ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recommended && recommended.length > 0 ? (
              recommended.map((act) => (
                <div key={act.id} className="p-4 hover:bg-muted/50 transition-colors flex justify-between items-center group">
                  <div className="max-w-[80%]">
                    <p className="font-bold text-foreground group-hover:text-indigo-500 transition-colors truncate">{act.title}</p>
                    <p className="text-[10px] font-medium text-muted-foreground mt-1 truncate">{act.description}</p>
                  </div>
                  <Link 
                    href={`/activities/${act.id}`}
                    className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
                  >
                    <ArrowRight size={18} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <p className="text-muted-foreground italic font-medium">ไม่มีกิจกรรมมาใหม่ในขณะนี้</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
