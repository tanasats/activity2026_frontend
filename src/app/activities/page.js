'use client';

import { useEffect, useState } from 'react';
import { activityService } from '@/services/activityService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getImageUrl } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { Badge } from '@/components/ui/Badge';
import { 
  Calendar, 
  Users, 
  Clock, 
  Search, 
  Filter, 
  ArrowRight,
  MapPin,
  Building2,
  Bookmark,
  X
} from 'lucide-react';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await activityService.getAllPublic();
        setActivities(data.rows || []);
      } catch (error) {
        console.error('Failed to fetch activities', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const filteredActivities = activities.filter(act => 
    act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    act.activity_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px] animate-pulse">
           กำลังค้นหากิจกรรมที่น่าสนใจ...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <PublicNavbar />
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 pt-32 px-4 md:px-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Badge variant="primary" className="mb-2">DISCOVER</Badge>
          <h2 className="text-4xl font-black text-foreground tracking-tight">กิจกรรมที่เปิดรับสมัคร</h2>
          <p className="text-muted-foreground font-medium">ค้นหาและลงทะเบียนกิจกรรมเพื่อสะสมชั่วโมงและทักษะ</p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อกิจกรรม หรือ รหัส..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm shadow-sm"
            />
          </div>
          <Button variant="outline" className="p-3 rounded-2xl">
            <Filter size={20} />
          </Button>
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredActivities.map((activity) => (
          <Card key={activity.id} className="flex flex-col h-full group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-border hover:border-primary/30 relative overflow-hidden">
             {/* Cover Image */}
             <div 
               className="w-full aspect-[16/9] overflow-hidden bg-muted relative cursor-zoom-in"
               onClick={() => setSelectedImage(getImageUrl(activity.cover_image, 'cover'))}
             >
                <img 
                  src={getImageUrl(activity.cover_image, 'cover')} 
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = '/images/cover-image.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60" />
                <Badge 
                  variant="indigo" 
                  className="absolute top-4 left-4 shadow-lg backdrop-blur-md bg-indigo-500/80 text-white border-none text-[10px]"
                >
                  {activity.type_name}
                </Badge>
             </div>

             {/* Dynamic background glow */}
             <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
             
            <div className="p-8 flex-1 relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{activity.activity_code}</p>
                </div>
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  <Bookmark size={20} />
                </button>
              </div>
              
              <h3 className="text-xl font-black text-foreground mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                {activity.title}
              </h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-muted-foreground text-xs font-bold uppercase tracking-wider">
                  <Building2 size={16} className="mr-3 text-indigo-500" />
                  {activity.agency_name}
                </div>
                <div className="flex items-center text-muted-foreground text-xs font-bold uppercase tracking-wider">
                  <MapPin size={16} className="mr-3 text-emerald-500" />
                  {activity.location || 'มหาวิทยาลัยมหาสารคาม'}
                </div>
                <div className="flex items-center text-muted-foreground text-xs font-bold uppercase tracking-wider">
                  <Calendar size={16} className="mr-3 text-amber-500" />
                  {new Date(activity.activity_start).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border border-border/50">
                <div className="text-center">
                   <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Hours</p>
                   <p className="text-lg font-black text-foreground">{activity.hours}</p>
                </div>
                <div className="w-[1px] h-8 bg-border" />
                <div className="text-center">
                   <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Slots</p>
                   <p className="text-lg font-black text-foreground">{activity.max_participants}</p>
                </div>
                <div className="w-[1px] h-8 bg-border" />
                <div className="text-center">
                   <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Status</p>
                   <span className="text-[10px] font-black text-emerald-500 uppercase">Open</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 pt-0 mt-auto relative z-10">
              <Link href={`/activities/${activity.id}`}>
                <Button 
                  className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center group/btn"
                >
                  View Details
                  <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}

        {filteredActivities.length === 0 && (
          <div className="col-span-full py-32 text-center bg-card rounded-[3rem] border border-dashed border-border">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              🔍
            </div>
            <h3 className="text-xl font-black text-foreground mb-2">ไม่พบกิจกรรมที่ค้นหา</h3>
            <p className="text-muted-foreground font-medium">ลองค้นหาด้วยคำสำคัญอื่น หรือตรวจสอบตัวสะกดอีกครั้ง</p>
          </div>
        )}
      </div>
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
    </div>
  );
}
