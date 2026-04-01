'use client';

import { useEffect, useState } from 'react';
import { activityService } from '@/services/activityService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getImageUrl } from '@/lib/utils';
import PublicNavbar from '@/components/PublicNavbar';
import {
  ArrowRight,
  Calendar,
  Clock,
  Users,
  Sparkles,
  Target,
  ChevronRight,
  Search,
  Building2,
  MapPin,
  LogIn,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await activityService.getAllPublic({ limit: 6 });
        setActivities(data.rows || []);
      } catch (error) {
        console.error('Failed to fetch activities', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary animate-in fade-in slide-in-from-top-4 duration-1000">
            <Sparkles size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Activity Transcript System</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
            สะสมชั่วโมงกิจกรรม <br />
            <span className="text-4xl md:text-6xl bg-gradient-to-r from-primary via-blue-600 to-blue-800 bg-clip-text text-transparent italic">
              BUILD YOUR FUTURE
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-muted-foreground text-lg md:text-xl  animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            ยกระดับทักษะนอกห้องเรียน บันทึกทุกความสำเร็จ และสร้างโปรไฟล์ที่โดดเด่น <br className="hidden md:block" />
            ผ่านระบบกิจกรรมนิสิต มหาวิทยาลัยมหาสารคาม
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <Link href="/activities">
              <Button className="w-full sm:w-auto px-10 py-4 rounded-[2rem] bg-primary text-white font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                สำรวจกิจกรรม
                <ArrowRight size={20} className="ml-3 inline-block" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full sm:w-auto px-10 py-4 rounded-[2rem] border-border bg-background/50 backdrop-blur-sm font-black uppercase tracking-widest text-sm hover:bg-muted transition-all">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 border-y border-border/50 py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center space-y-1">
            <h3 className="text-3xl font-black text-foreground">500+</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Annual Activities</p>
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-3xl font-black text-foreground">20,000+</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Students</p>
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-3xl font-black text-foreground">1M+</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Hours</p>
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-3xl font-black text-foreground">100%</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Digital Transcript</p>
          </div>
        </div>
      </section>

      {/* Featured Activities */}
      <section className="py-32 px-4 max-w-7xl mx-auto space-y-20">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6">
          <div className="space-y-4">
            <Badge variant="indigo" className="px-4 py-1 text-[10px] font-black uppercase tracking-widest">Ongoing</Badge>
            <h2 className="text-4xl font-black tracking-tight text-foreground">กิจกรรมที่กำลังเปิดอยู่</h2>
            <p className="text-muted-foreground text-lg font-medium">เริ่มต้นสะสมชั่วโมงและเรียนรู้ทักษะใหม่ๆ ได้เลยวันนี้</p>
          </div>
          <Link href="/activities" className="text-primary font-black uppercase tracking-widest text-xs flex items-center group">
            View All Activities
            <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[450px] bg-muted rounded-[3rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity) => (
              <Card key={activity.id} className="flex flex-col h-full group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-border hover:border-primary/30 relative overflow-hidden rounded-[3rem]">
                <div
                  className="w-full aspect-[16/10] overflow-hidden bg-muted relative cursor-zoom-in"
                  onClick={() => setSelectedImage(getImageUrl(activity.cover_image, 'cover'))}
                >
                  <img
                    src={getImageUrl(activity.cover_image, 'cover')}
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 pointer-events-none" />
                  <Badge
                    variant="indigo"
                    className="absolute top-6 left-6 shadow-lg backdrop-blur-md bg-indigo-500/80 text-white border-none text-[10px] font-black"
                  >
                    {activity.type_name}
                  </Badge>
                </div>

                <div className="p-8 flex-1 relative z-10 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{activity.activity_code}</p>
                    </div>

                    <h3 className="text-xl font-black text-foreground mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {activity.title}
                    </h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-muted-foreground text-[11px] font-bold uppercase">
                        <Building2 size={16} className="mr-3 text-indigo-500" />
                        {activity.agency_name}
                      </div>
                      <div className="flex items-center text-muted-foreground text-[11px] font-bold uppercase">
                        <MapPin size={16} className="mr-3 text-emerald-500" />
                        {activity.location || 'มหาวิทยาลัยมหาสารคาม'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 mt-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border border-border/50">
                      <div className="text-center">
                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Hours</p>
                        <p className="text-md font-black text-foreground">{activity.hours}</p>
                      </div>
                      <div className="w-[1px] h-6 bg-border" />
                      <div className="text-center">
                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Slots</p>
                        <p className="text-md font-black text-foreground">{activity.max_participants}</p>
                      </div>
                      <div className="w-[1px] h-6 bg-border" />
                      <div className="text-center">
                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Status</p>
                        <span className="text-[9px] font-black text-emerald-500 uppercase">Open</span>
                      </div>
                    </div>

                    <Link href={`/activities/${activity.id}`}>
                      <Button className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center group/btn">
                        View Details
                        <ArrowRight size={14} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Steps Section */}
      <section className="py-32 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center space-y-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">ขั้นตอนการใช้งาน</h2>
            <p className="text-primary-foreground/70 text-lg font-medium">เริ่มต้นสร้างความสำเร็จได้ใน 3 ขั้นตอนง่ายๆ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Search size={32} />,
                title: "Choose Activity",
                desc: "เลือกกิจกรรมที่สนใจจากรายการที่เปิดรับสมัครมากมาย"
              },
              {
                icon: <LogIn size={32} />,
                title: "Login & Register",
                desc: "เข้าสู่ระบบด้วยอีเมล MSU และกดลงทะเบียนเข้าร่วม"
              },
              {
                icon: <Target size={32} />,
                title: "Get Transcript",
                desc: "ร่วมกิจกรรมและได้รับชั่วโมงกิจกรรมลงในทรานสคลิปทันที"
              }
            ].map((step, i) => (
              <div key={i} className="text-center space-y-6 group">
                <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto border border-white/20 group-hover:bg-white group-hover:text-primary transition-all shadow-2xl">
                  {step.icon}
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest">{step.title}</h3>
                <p className="text-primary-foreground/60 text-sm font-bold leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left space-y-4">
            <Link href="/" className="flex items-center justify-center md:justify-start space-x-3">
              <span className="text-xl font-black italic bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                ACTIVITY MSU
              </span>
            </Link>
            <p className="text-xs font-black text-muted-foreground uppercase opacity-60 tracking-widest leading-relaxed">
              งานพัฒนานิสิต มหาวิทยาลัยมหาสารคาม <br />
              Digital Activity Transcript Platform © 2026
            </p>
          </div>
          <div className="flex space-x-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
            <a href="#" className="hover:text-primary transition-colors">About MSU</a>
          </div>
        </div>
      </footer>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors bg-white/10 p-2 rounded-full">
            <X size={32} />
          </button>
          <img
            src={selectedImage}
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300"
            alt="Preview"
          />
        </div>
      )}
    </div>
  );
}
