'use client';

import {
  PlusCircle,
  Users,
  Briefcase,
  BarChart3,
  ArrowRight,
  Shield
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import Link from 'next/link';

const OfficerDashboard = ({ data }) => {
  const { myStats, facultyStats, myActivities = [], facultyActivities = [] } = data || {};

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* My Performance */}
        <div className="bg-gradient-to-br from-primary to-indigo-700 p-8 rounded-[2.5rem] text-primary-foreground shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <h4 className="text-primary-foreground/80 font-bold uppercase tracking-widest text-[10px] mb-2">กิจกรรมของฉัน</h4>
            <div className="flex items-end space-x-4">
              <span className="text-6xl font-black">{myStats?.activity_count || 0}</span>
              <span className="text-primary-foreground/70 mb-2 font-bold uppercase text-xs">โครงการ</span>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
              <div className="flex items-center">
                <Users size={18} className="mr-2 text-primary-foreground/60" />
                <span className="text-sm text-primary-foreground font-bold italic">
                  {myStats?.participant_count || 0} นิสิตที่ลงทะเบียน
                </span>
              </div>
              <Link href="/manage" className="px-6 py-2.5 bg-white/20 hover:bg-white/30 rounded-2xl text-xs font-black transition-all backdrop-blur-md uppercase tracking-wider">
                จัดการกิจกรรม
              </Link>
            </div>
          </div>
          {/* Decorative background circle */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
        </div>

        {/* Faculty Overview */}
        <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <h4 className="text-muted-foreground font-black uppercase tracking-widest text-[10px] mb-2 flex items-center">
              <Shield size={14} className="mr-2 text-indigo-500" /> สรุปกิจกรรมของคณะ
            </h4>
            <div className="flex items-end space-x-4">
              <span className="text-6xl font-black text-foreground">{facultyStats?.activity_count || 0}</span>
              <span className="text-muted-foreground mb-2 font-bold italic text-xs">โครงการทั้งหมด</span>
            </div>
            <div className="mt-8 pt-6 border-t border-border flex justify-between items-center text-sm font-black uppercase ">
              <div className="flex items-center text-muted-foreground">
                <Users size={18} className="mr-2 text-indigo-500" />
                {facultyStats?.participant_count || 0} Participants
              </div>
              <span className="text-primary">FACULTY OVERVIEW</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tables/Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent My Activities */}
        <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h3 className="text-foreground flex items-center uppercase tracking-wider">
              <Briefcase className="mr-2 text-primary" size={18} />
              กิจกรรมของฉัน
            </h3>
            <Link href="/manage" className="text-[10px] text-primary font-black hover:bg-primary/5 px-4 py-2 rounded-xl transition-all border border-primary/10 uppercase">
              จัดการทั้งหมด
            </Link>
          </div>
          <div className="divide-y divide-border">
            {myActivities && myActivities.length > 0 ? (
              myActivities.map((act) => (
                <div key={act.id} className="p-4 hover:bg-muted/50 transition-colors flex justify-between items-center group">
                  <div>
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors">{act.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={act.status === 'ดำเนินการ' ? 'success' : 'warning'}>{act.status}</Badge>
                      <span className="text-[10px] font-medium text-muted-foreground uppercase">{new Date(act.activity_start).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                    <ArrowRight size={18} className="text-primary" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-muted-foreground italic font-medium">ไม่มีข้อมูลกิจกรรม</div>
            )}
          </div>
        </div>

        {/* Recently Added in Faculty */}
        <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-foreground flex items-center uppercase tracking-wider">
              <BarChart3 className="mr-2 text-indigo-500" size={18} />
              กิจกรรมของคณะ
            </h3>
          </div>
          <div className="divide-y divide-border">
            {facultyActivities && facultyActivities.length > 0 ? (
              facultyActivities.map((act) => (
                <div key={act.id} className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground">{act.title}</p>
                    <div className="flex items-center space-x-2 mt-1 text-[10px] font-medium text-muted-foreground uppercase">
                      <span className="text-primary font-black">{act.creator_name}</span>
                      <span>•</span>
                      <span>{new Date(act.created_at).toLocaleDateString('th-TH')}</span>
                    </div>
                  </div>
                  <Badge variant="indigo">{act.status}</Badge>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-muted-foreground italic font-medium">ไม่มีข้อมูลความเคลื่อนไหว</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;
