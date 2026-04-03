'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Calendar,
  MapPin,
  Clock,
  User,
  Award,
  Loader2,
  Download,
  Printer,
  CheckCircle2,
  X,
  Camera,
  Globe
} from 'lucide-react';
import { registrationService } from '@/services/registrationService';
import { activityService } from '@/services/activityService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function RegistrationDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [registration, setRegistration] = useState(null);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selfieUploading, setSelfieUploading] = useState(false);

  const handleSelfieUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (e.g., 8MB)
    if (file.size > 8 * 1024 * 1024) {
      toast.error('ไฟล์ภาพต้องมีขนาดไม่เกิน 8MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setSelfieUploading(true);
      const res = await activityService.selfieCheckin(registration.activity_id, formData);
      toast.success(res.message || 'เช็คอินสำเร็จ');
      fetchData(); // Refresh to show "Attended" status
    } catch (error) {
      console.error('Selfie Check-in Error:', error);
      toast.error(error.response?.data?.message || 'เช็คอินไม่สำเร็จ กรุณาตรวจสอบพิกัดและข้อมูลภาพ');
    } finally {
      setSelfieUploading(false);
      e.target.value = '';
    }
  };

  useEffect(() => {
    fetchData();
    fetchImages();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await registrationService.getRegistrationById(id);
      setRegistration(data);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('ไม่สามารถโหลดข้อมูลการลงทะเบียนได้');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    try {
      const data = await registrationService.getImages(id);
      setImages(data);
    } catch (error) {
      console.error('Fetch images error:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (images.length >= 5) {
      toast.error('คุณสามารถอัปโหลดภาพได้สูงสุด 5 ภาพ');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      await registrationService.uploadImage(id, formData);
      toast.success('อัปโหลดรูปภาพสำเร็จ');
      fetchImages();
    } catch (error) {
      toast.error(error.response?.data?.message || 'อัปโหลดไม่สำเร็จ');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm('คุณต้องการลบรูปภาพนี้ใช่หรือไม่?')) return;

    try {
      await registrationService.deleteImage(imageId);
      toast.success('ลบรูปภาพสำเร็จ');
      fetchImages();
    } catch (error) {
      toast.error('ลบไม่สำเร็จ');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-muted-foreground animate-pulse font-medium">กำลังโหลดข้อมูลการลงทะเบียน...</p>
      </div>
    );
  }

  if (!registration) return null;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(registration.qr_code_hash)}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> กลับหน้าแดชบอร์ด
        </button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()} className="rounded-xl">
            <Printer size={16} className="mr-2" /> พิมพ์
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: QR Code & Status */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 border-primary/20 bg-primary/[0.02] flex flex-col items-center justify-center shadow-2xl shadow-primary/5 rounded-[3rem]">
            <div className="bg-white p-4 rounded-3xl shadow-inner border border-primary/10 mb-6">
              <img
                src={qrImageUrl}
                alt="Registration QR Code"
                className="w-full aspect-square max-w-[200px]"
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">QR Code สำหรับลงทะเบียนเข้าร่วม</p>
              <p className="text-[10px] text-muted-foreground font-medium max-w-[180px] leading-relaxed">
                กรุณาแสดง QR Code นี้ต่อผู้จัดกิจกรรมที่หน้างานเพื่อลงทะเบียนเข้าร่วม
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-primary/10 w-full text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1">เลขที่ใบลงทะเบียน</p>
              <p className="text-lg font-black text-foreground">REG-{String(registration.id).padStart(6, '0')}</p>
            </div>
          </Card>

          {/* Selfie Check-in Section (Student Only) */}
          {registration.allow_selfie_checkin && !registration.is_attended && (
            <Card className="p-8 border-indigo-500/20 bg-indigo-500/[0.02] rounded-[3rem] space-y-6 shadow-xl shadow-indigo-500/5 animate-in fade-in zoom-in duration-500">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                  <Camera size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground">ลงทะเบียนเข้าร่วม (Selfie)</h3>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">ลงทะเบียนเข้าร่วมด้วยภาพถ่ายและพิกัด GPS</p>
                </div>
              </div>

              <div className="bg-white/50 backdrop-blur-sm border border-indigo-100 rounded-3xl p-6 text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-wider">
                  <Globe size={12} /> ข้อมูลพิกัดและที่ตั้ง
                </div>
                <p className="text-xs text-muted-foreground px-4 leading-relaxed">
                  กรุณาถ่ายรูป Selfie ของคุณในพื้นที่จัดกิจกรรม ระบบจะตรวจสอบ **พิกัด GPS** และ **เวลา** จากภาพถ่ายโดยอัตโนมัติเพื่อลงทะเบียนเข้าร่วม
                </p>
              </div>

              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleSelfieUpload}
                  disabled={selfieUploading}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <Button
                  className="w-full h-16 rounded-2xl text-[16px] font-black bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 group-hover:scale-[1.02] transition-all"
                  disabled={selfieUploading}
                >
                  {selfieUploading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 text-white" size={20} />
                      กำลังตรวจสอบข้อมูล...
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2" size={24} />
                      ถ่ายภาพ Selfie เพื่อลงทะเบียนเข้าร่วม
                    </>
                  )}
                </Button>
              </div>

              <p className="text-[9px] text-center text-muted-foreground italic leading-tight">
                * โปรดมั่นใจว่าคุณได้เปิดสิทธิ์ "Location Access" สำหรับแอพกล้องถ่ายรูปของคุณ และไฟล์ภาพมีข้อมูล GPS (EXIF)
              </p>
            </Card>
          )}

          {/* Evidence Upload Section - Only visible if attended */}
          {registration.is_attended && (
            <Card className="p-8 border-emerald-500/20 bg-emerald-500/[0.02] rounded-[3rem] space-y-6 shadow-xl shadow-emerald-500/5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-foreground">ภาพกิจกรรมของฉัน</h3>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">อัปโหลดภาพถ่ายกิจกรรม (สูงสุด 5 ภาพ)</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-emerald-600">{images.length}/5</p>
                </div>
              </div>

              {/* Upload Box */}
              {images.length < 5 && (
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="border-2 border-dashed border-emerald-500/30 rounded-3xl p-8 flex flex-col items-center justify-center bg-white group-hover:border-emerald-500/60 transition-all group-hover:bg-emerald-500/[0.02]">
                    {uploading ? (
                      <Loader2 className="animate-spin text-emerald-500 mb-2" size={32} />
                    ) : (
                      <Download className="text-emerald-500/40 mb-2 group-hover:scale-110 transition-transform" size={32} />
                    )}
                    <p className="text-xs font-black text-muted-foreground">คลิกหรือลากไฟล์ภาพมาที่นี่</p>
                  </div>
                </div>
              )}

              {/* Image Grid */}
              <div className="grid grid-cols-3 gap-3">
                {images.map((img) => (
                  <div key={img.id} className="relative group aspect-square rounded-2xl overflow-hidden border border-border shadow-sm">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'}${img.image_path}`}
                      alt="Evidence"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="p-2 bg-rose-500 text-white rounded-xl shadow-lg hover:scale-110 transition-transform"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Activity Details */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-8 border-border overflow-hidden rounded-[3rem] relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
              <Calendar size={120} />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="primary" className="uppercase tracking-widest text-[9px]">สมัครเข้าร่วมแล้ว</Badge>
              {registration.is_attended && (
                <Badge variant="success" className="uppercase tracking-widest text-[9px]">เข้าร่วมแล้ว</Badge>
              )}
              {registration.evaluation_result === 'pass' && (
                <Badge variant="success" className="bg-emerald-600 text-white border-none uppercase tracking-widest text-[9px] shadow-sm">ผ่าน (Pass)</Badge>
              )}
              {registration.evaluation_result === 'fail' && (
                <Badge variant="danger" className="uppercase tracking-widest text-[9px]">ไม่ผ่าน (Fail)</Badge>
              )}
              {registration.is_attended && (
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 size={14} />
                  <span className="text-[10px] font-black uppercase tracking-tighter">Verified Participation</span>
                </div>
              )}
            </div>

            <h1 className="text-2xl font-black text-foreground mb-6 leading-tight">
              {registration.activity_title}
            </h1>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">วันที่จัดกิจกรรม</p>
                  <p className="font-bold text-foreground">
                    {new Date(registration.activity_start).toLocaleDateString('th-TH', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">เวลาที่จัดกิจกรรม</p>
                  <p className="font-bold text-foreground">
                    {new Date(registration.activity_start).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} -
                    {new Date(registration.activity_end).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">สถานที่</p>
                  <p className="font-bold text-foreground">{registration.location || 'ไม่ได้ระบุสถานที่'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                <div className="bg-muted/30 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock size={14} className="text-primary" />
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">ชั่วโมง</span>
                  </div>
                  <p className="text-xl font-black text-foreground">{registration.hours} ชม.</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Award size={14} className="text-primary" />
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">หน่วยกิต</span>
                  </div>
                  <p className="text-xl font-black text-foreground">{registration.credits} หน่วย</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border rounded-[2.5rem] bg-muted/10">
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center">
              <User size={14} className="mr-2" /> ข้อมูลผู้ลงทะเบียน
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
                {registration.student_name?.charAt(0)}
              </div>
              <div>
                <p className="font-black text-foreground">{registration.student_name}</p>
                <p className="text-[10px] text-muted-foreground font-bold">
                  รหัส: {registration.student_code} | {registration.faculty_name}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border/50 text-[10px] text-muted-foreground italic">
              สมัครเข้าร่วมเมื่อ: {new Date(registration.registered_at).toLocaleString('th-TH')}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
