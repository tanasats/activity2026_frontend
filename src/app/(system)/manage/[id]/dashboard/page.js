'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Users,
  Image as ImageIcon,
  Download,
  ChevronLeft,
  Search,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Camera,
  Trash2,
  Save,
  Loader2,
  FileSpreadsheet
} from 'lucide-react';
import { activityService } from '@/services/activityService';
import { registrationService } from '@/services/registrationService';
import { activityImageService } from '@/services/activityImageService';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function ActivityDashboardPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState('participants'); // 'participants' | 'evidence'
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Stats
  const stats = {
    total: participants.length,
    attended: participants.filter(p => p.is_attended).length,
    notAttended: participants.filter(p => !p.is_attended).length
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [activityData, participantData, imageData] = await Promise.all([
        activityService.getActivityById(id),
        registrationService.getParticipants(id),
        activityImageService.getImages(id)
      ]);
      setActivity(activityData);
      setParticipants(participantData);
      setImages(imageData);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('ไม่สามารถโหลดข้อมูลได้');
      router.push('/manage');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNote = async (registrationId, evaluationNote) => {
    try {
      await registrationService.updateParticipantStatus(registrationId, { evaluationNote });
      toast.success('บันทึกหมายเหตุเรียบร้อยแล้ว');
      // Update local state
      setParticipants(prev => prev.map(p => 
        p.id === registrationId ? { ...p, evaluation_note: evaluationNote } : p
      ));
    } catch (error) {
      toast.error('ไม่สามารถบันทึกหมายเหตุได้');
    }
  };

  const handleUpdateResult = async (registrationId, evaluationResult) => {
    try {
      await registrationService.updateParticipantStatus(registrationId, { evaluationResult });
      const statusText = evaluationResult === 'pass' ? 'ผ่าน' : evaluationResult === 'fail' ? 'ไม่ผ่าน' : 'รีเซ็ตเป็นรอผล';
      toast.success(`บันทึกผลการประเมินเป็น: ${statusText}`);
      // Update local state
      setParticipants(prev => prev.map(p => 
        p.id === registrationId ? { ...p, evaluation_result: evaluationResult } : p
      ));
    } catch (error) {
      toast.error('ไม่สามารถบันทึกผลการเข้าร่วมได้');
    }
  };

  const handleUpdateStatus = async (registrationId, data) => {
    try {
      await registrationService.updateParticipantStatus(registrationId, data);

      // Map frontend camelCase to backend snake_case for UI state consistency
      const updatedFields = {};
      if (data.isAttended !== undefined) updatedFields.is_attended = data.isAttended;
      if (data.evaluationNote !== undefined) updatedFields.evaluation_note = data.evaluationNote;

      setParticipants(prev => prev.map(p =>
        String(p.id) === String(registrationId) ? { ...p, ...updatedFields } : p
      ));

      if (data.evaluationNote !== undefined) {
        toast.success('บันทึกหมายเหตุแล้ว');
      } else {
        toast.success(data.isAttended ? 'เช็คชื่อสำเร็จ' : 'ยกเลิกการเช็คชื่อ');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('บันทึกไม่สำเร็จ');
    }
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.loading('กำลังอัปโหลด...', { id: 'uploading' });
      const newImage = await activityImageService.uploadImage(id, file);
      setImages([newImage, ...images]);
      toast.success('อัปโหลดสำเร็จ', { id: 'uploading' });
    } catch (error) {
      toast.error('อัปโหลดไม่สำเร็จ', { id: 'uploading' });
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm('ยืนยันระบบจะลบรูปภาพนี้ถาวร?')) return;
    try {
      await activityImageService.deleteImage(imageId);
      setImages(images.filter(img => img.id !== imageId));
      toast.success('ลบรูปภาพสำเร็จ');
    } catch (error) {
      toast.error('ลบไม่สำเร็จ');
    }
  };

  const handleExport = () => {
    const url = registrationService.getExportUrl(id);
    const token = localStorage.getItem('token'); // Assuming token is in localStorage

    // Using simple window.open or a hidden anchor
    // To pass token, we might need a blob approach if our API enforces it strictly on GET
    // For now, let's assume it works with a redirect or we can append token
    window.open(`${url}?token=${token}`, '_blank');
  };

  const filteredParticipants = participants.filter(p =>
    p.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.student_code.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-muted-foreground animate-pulse font-medium">กำลังเตรียมข้อมูลแดชบอร์ด...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8"> {/* -animate-in fade-in duration-500 */}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="group flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> กลับหน้าจัดการ
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
              <Users size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-foreground tracking-tight">{activity?.title}</h1>
              <p className="text-muted-foreground flex items-center mt-1">
                <span className="font-bold text-primary mr-2">#{activity?.activity_code}</span>
                | แดชบอร์ดบริหารจัดการกิจกรรม
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleExport}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg shadow-emerald-500/20 px-6 py-6"
          >
            <Download size={20} className="mr-2" /> Export รายชื่อ (Excel)
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <Users size={80} />
          </div>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">ผู้ลงทะเบียนทั้งหมด</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-foreground">{stats.total}</span>
            <span className="text-muted-foreground font-bold">คน</span>
          </div>
        </Card>

        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <CheckCircle2 size={80} className="text-emerald-500" />
          </div>
          <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">มาเข้าร่วม</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-emerald-600">{stats.attended}</span>
            <span className="text-muted-foreground font-bold">คน</span>
          </div>
        </Card>

        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <XCircle size={80} className="text-rose-500" />
          </div>
          <p className="text-xs font-black text-rose-600 uppercase tracking-widest mb-1">ยังไม่ได้เช็คชื่อ</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-rose-600">{stats.notAttended}</span>
            <span className="text-muted-foreground font-bold">คน</span>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted/30 rounded-[1.5rem] w-fit border border-border/50">
        <button
          onClick={() => setActiveTab('participants')}
          className={cn(
            "flex items-center px-6 py-2.5 rounded-2xl text-sm font-black transition-all",
            activeTab === 'participants'
              ? "bg-primary text-primary-foreground shadow-lg"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Users size={16} className="mr-2" /> รายชื่อผู้สมัคร
        </button>
        <button
          onClick={() => setActiveTab('evidence')}
          className={cn(
            "flex items-center px-6 py-2.5 rounded-2xl text-sm font-black transition-all",
            activeTab === 'evidence'
              ? "bg-primary text-primary-foreground shadow-lg"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <ImageIcon size={16} className="mr-2" /> ภาพกิจกรรม (หลักฐาน)
        </button>
      </div>

      {activeTab === 'participants' ? (
        <Card className="border-border overflow-hidden shadow-2xl shadow-primary/5 bg-card/30 backdrop-blur-md rounded-[2.5rem]">
          <div className="p-6 border-b border-border bg-card/50 flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="ค้นหาชื่อ หรือ รหัสนิสิต..."
                className="w-full pl-12 pr-4 py-2.5 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30 text-left border-b border-border">
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">นิสิต</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">คณะ</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">เช็คชื่อ</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">ผลการประเมิน</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">บันทึกเพิ่มเติม</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredParticipants.length > 0 ? filteredParticipants.map((p) => (
                  <tr key={p.id} className="hover:bg-primary/[0.02] transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{p.student_name}</span>
                        <span className="text-[10px] text-muted-foreground font-bold font-mono uppercase italic leading-none mt-0.5">{p.student_code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-muted text-muted-foreground rounded-lg text-[10px] font-black uppercase">
                        {p.faculty_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleUpdateStatus(p.id, { isAttended: !p.is_attended })}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase transition-all duration-300",
                            p.is_attended 
                              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          )}
                        >
                          <CheckCircle2 size={14} className={cn(!p.is_attended && "opacity-40")} />
                          {p.is_attended ? 'มาแล้ว' : 'ยังไม่มา'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl w-fit border border-border/50">
                           <button
                             onClick={() => handleUpdateResult(p.id, 'pass')}
                             className={cn(
                               "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all",
                               p.evaluation_result === 'pass' 
                                 ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" 
                                 : "text-muted-foreground hover:bg-white hover:text-emerald-600"
                             )}
                           >
                             ผ่าน
                           </button>
                           <button
                             onClick={() => handleUpdateResult(p.id, 'fail')}
                             className={cn(
                               "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all",
                               p.evaluation_result === 'fail' 
                                 ? "bg-rose-500 text-white shadow-md shadow-rose-500/20" 
                                 : "text-muted-foreground hover:bg-white hover:text-rose-600"
                             )}
                           >
                             ไม่ผ่าน
                           </button>
                           <button
                             onClick={() => handleUpdateResult(p.id, null)}
                             className={cn(
                               "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all",
                               !p.evaluation_result
                                 ? "bg-slate-400 text-white shadow-md" 
                                 : "text-muted-foreground hover:bg-white"
                             )}
                           >
                             รอผล
                           </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-[200px]">
                      <div className="relative group/input">
                        <input
                          type="text"
                          defaultValue={p.evaluation_note || ''}
                          placeholder="บันทึกเพิ่มเติม..."
                          className="w-full bg-muted/20 border border-transparent focus:border-primary/30 focus:bg-background rounded-xl px-4 py-2 text-xs text-foreground outline-none transition-all"
                          onBlur={(e) => handleUpdateNote(p.id, e.target.value)}
                        />
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <Search size={40} className="opacity-20" />
                        <p className="font-bold">ไม่พบข้อมูลผู้สมัคร</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-bottom-5">
          {/* Evidence / Photos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Upload Box */}
            <div className="aspect-[4/3] rounded-[2.5rem] border-2 border-dashed border-primary/20 bg-primary/[0.02] flex flex-col items-center justify-center text-primary group hover:bg-primary/[0.05] hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden shadow-inner">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleUploadImage}
              />
              <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Camera size={32} />
              </div>
              <p className="text-sm font-black uppercase tracking-widest">อัปโหลดรูปภาพ</p>
              <p className="text-[10px] text-muted-foreground mt-2 italic">ควรเป็นภาพแนวนอน (4:3)</p>
            </div>

            {images.map((img) => (
              <div key={img.id} className="aspect-[4/3] rounded-[2.5rem] border border-border bg-card relative overflow-hidden group shadow-lg hover:shadow-primary/10 transition-all">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'}${img.image_path}`}
                  alt={img.caption || 'Activity Evidence'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-colors shadow-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                  <p className="text-white text-xs font-bold leading-relaxed">{img.caption || 'กิจกรรมของเรา'}</p>
                </div>
              </div>
            ))}
          </div>

          {images.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-muted-foreground gap-4 border-2 border-dashed border-border rounded-[3rem]">
              <ImageIcon size={60} className="opacity-10" />
              <div className="text-center">
                <p className="text-lg font-black uppercase italic opacity-30">ยังไม่มีรูปภาพกิจกรรม</p>
                <p className="text-sm italic opacity-50">อัปโหลดรูปภาพเพื่อใช้เป็นหลักฐานการจัดกิจกรรม</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
