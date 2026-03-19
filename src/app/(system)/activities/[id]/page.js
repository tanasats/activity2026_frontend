'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { activityService } from '@/services/activityService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getImageUrl } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import {
  Calendar,
  Users,
  Clock,
  MapPin,
  Building2,
  ChevronLeft,
  Share2,
  CheckCircle2,
  CalendarCheck,
  Target,
  Wallet,
  ShieldAlert,
  Star,
  FileText,
  Download,
  Lock
} from 'lucide-react';
import Link from 'next/link';

export default function ActivityDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await activityService.getActivityById(id);
        setActivity(data);
      } catch (error) {
        console.error('Failed to fetch activity details', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchActivity();
  }, [id]);

  const handleRegister = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setRegistering(true);
      await activityService.register(id);
      toast.success('ลงทะเบียนสำเร็จ!');
      // Reload or update state to show current status if needed
    } catch (error) {
      toast.error(error.response?.data?.message || 'ลงทะเบียนไม่สำเร็จ');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-muted-foreground font-black uppercase  text-xs animate-pulse">
          กำลังโหลดข้อมูลกิจกรรมที่น่าตื่นเต้น...
        </p>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">ไม่พบข้อมูลกิจกรรม</h2>
        <Link href="/activities" className="text-primary hover:underline mt-4 inline-block">
          กลับไปหน้าค้นหากิจกรรม
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      {/* Top Navigation & Actions */}
      <div className="flex justify-between items-center">
        <Link href="/activities" className="flex items-center text-muted-foreground hover:text-foreground transition-all group font-black uppercase  text-[10px]">
          <div className="p-2 bg-card border border-border rounded-xl mr-3 group-hover:bg-muted transition-colors">
            <ChevronLeft size={20} />
          </div>
          Back to Explorers
        </Link>
        <div className="flex items-center space-x-3">
          <button className="p-3 bg-card border border-border rounded-2xl text-muted-foreground hover:text-primary transition-all">
            <Share2 size={20} />
          </button>
          <button className="p-3 bg-card border border-border rounded-2xl text-muted-foreground hover:text-amber-500 transition-all">
            <Star size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-0 border-border relative overflow-hidden">
            {/* Cover Image Header */}
            <div className="w-full aspect-[21/9] overflow-hidden relative border-b border-border bg-muted">
              <img
                src={getImageUrl(activity.cover_image) || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop'}
                alt={activity.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop';
                }}
              />
              {/* <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" /> */}
            </div>

            <div className="p-10 relative z-10">
              {/* Background glow */}
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />
              <div className="flex items-center space-x-3 mb-6">
                <Badge variant="primary" className="px-4 py-1 text-[10px] font-black">{activity.activity_code}</Badge>
                <Badge variant="indigo" className="px-4 py-1 text-[10px] font-black">{activity.type_name}</Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-foreground leading-tight mb-6">
                {activity.title}
              </h1>

              <div className="flex flex-wrap gap-6 mb-10 text-muted-foreground font-bold uppercase  text-[10px]">
                <div className="flex items-center">
                  <Building2 size={16} className="mr-2 text-primary" />
                  {activity.agency_name}
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2 text-emerald-500" />
                  {activity.location}
                </div>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-black text-foreground mb-4 uppercase  italic">Description</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-lg font-medium">
                  {activity.description}
                </p>
              </div>

              {/* Skills Section */}
              {activity.skills?.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-black text-foreground mb-6 uppercase  italic flex items-center">
                    <Target size={24} className="mr-3 text-indigo-500" /> Future Skills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {activity.skills.map((skill) => (
                      <div key={skill.id} className="px-6 py-3 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all group cursor-default">
                        <p className="text-foreground font-black text-xs uppercase ">{skill.skill_name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase group-hover:text-primary transition-colors">{skill.skill_name_en}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachments Section */}
              {activity.attachments?.length > 0 && (
                <div className="mt-12 border-t border-border pt-12">
                  <h3 className="text-xl font-black text-foreground mb-6 uppercase  italic flex items-center">
                    <FileText size={24} className="mr-3 text-emerald-500" /> เอกสารแนบ (Attachments)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activity.attachments
                      .filter(att => att.is_published)
                      .map((att) => (
                        <a
                          key={att.id}
                          href={getImageUrl(att.file_path)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-5 bg-card border border-border rounded-3xl hover:border-primary/50 transition-all group overflow-hidden relative"
                        >
                          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <FileText size={80} />
                          </div>

                          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors mr-4 shrink-0">
                            <FileText size={24} />
                          </div>

                          <div className="flex-1 min-w-0 pr-4">
                            <p className="text-foreground font-black text-xs uppercase  truncate">{att.display_name}</p>
                            <div className="flex items-center mt-1 space-x-2 text-[9px] font-bold text-muted-foreground uppercase  italic">
                              <span>{(att.file_name.split('.').pop() || 'file').toUpperCase()}</span>
                            </div>
                          </div>

                          <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                            <Download size={18} />
                          </div>
                        </a>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Key Stats & Action */}
        <div className="space-y-6">
          <Card className="p-8 border-border bg-card">
            <div className="space-y-8">
              {/* Status Section */}
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Registration Window</p>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border border-border">
                  <div className="flex items-center text-foreground font-black text-xs">
                    <CalendarCheck size={18} className="mr-2 text-emerald-500" />
                    OPEN
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    Ends: {new Date(activity.registration_end).toLocaleDateString('th-TH')}
                  </span>
                </div>
              </div>

              {/* Main Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-card border border-border rounded-3xl text-center group hover:border-primary/30 transition-all">
                  <Clock size={20} className="mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                  <p className="text-2xl font-black text-foreground">{activity.hours}</p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase ">ACT Hours</p>
                </div>
                <div className="p-5 bg-card border border-border rounded-3xl text-center group hover:border-indigo-500/30 transition-all">
                  <Users size={20} className="mx-auto mb-2 text-indigo-500 group-hover:scale-110 transition-transform" />
                  <p className="text-2xl font-black text-foreground">{activity.registered_count || 0} / {activity.max_participants}</p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase ">Enrolled</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-xs font-bold uppercase ">
                  <span className="text-muted-foreground flex items-center">
                    <Wallet size={16} className="mr-2 text-emerald-500" /> Budget Source
                  </span>
                  <span className="text-foreground">{activity.budget_source_name}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold uppercase ">
                  <span className="text-muted-foreground flex items-center">
                    <ShieldAlert size={16} className="mr-2 text-amber-500" /> Loaner Hours
                  </span>
                  <span className="text-foreground">{activity.loaner_hours || 0} Hrs</span>
                </div>
              </div>

              {/* Registration Action */}
              <div className="pt-6">
                <Button
                  variant={user?.role === 'student' ? (activity.max_participants > 0 && activity.registered_count >= activity.max_participants ? 'outline' : 'primary') : 'outline'}
                  className="w-full py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  onClick={handleRegister}
                  disabled={user?.role !== 'student' || registering || (activity.max_participants > 0 && activity.registered_count >= activity.max_participants)}
                >
                  {registering ? 'Processing...' : (
                    user?.role === 'student'
                      ? (activity.max_participants > 0 && activity.registered_count >= activity.max_participants ? 'Activity Full' : 'Register Now')
                      : 'Sign in as Student'
                  )}
                </Button>
                {activity.allowed_faculties?.length > 0 && (
                  <p className="text-[9px] text-center mt-4 text-muted-foreground font-black uppercase  flex items-center justify-center italic">
                    <CheckCircle2 size={12} className="mr-2 text-primary" />
                    Restricted: {activity.allowed_faculties.map(f => f.faculty_name).join(', ')}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Quick Tip / Notice */}
          <div className="bg-primary/5 border border-primary/20 p-6 rounded-3xl">
            <div className="flex items-start space-x-3">
              <ShieldAlert className="text-primary mt-1" size={20} />
              <div>
                <p className="text-xs font-black text-foreground uppercase tracking-wider mb-1">Important Notice</p>
                <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                  กรุณามาให้ตรงตามเวลาที่นัดหมาย หากไม่สามารถเข้าร่วมได้ควรยกเลิกการลงทะเบียนล่วงหน้าอย่างน้อย 24 ชั่วโมง
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
