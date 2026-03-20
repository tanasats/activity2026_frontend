'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Save,
  ChevronLeft,
  LayoutDashboard,
  Target,
  ShieldCheck,
  Calendar,
  Building2,
  Clock,
  MapPin,
  Wallet,
  Globe,
  Lock,
  Trash2,
  Plus,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { masterDataService } from '@/services/masterDataService';
import { activityService } from '@/services/activityService';
import { useAuthStore } from '@/store/useAuthStore';
import { getImageUrl } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function EditActivityPage() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [existingCoverImage, setExistingCoverImage] = useState(null);
  
  // Status Modal State
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatusPending, setNewStatusPending] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  // Master Data
  const [masterData, setMasterData] = useState({
    agencies: [],
    types: [],
    skills: [],
    budgetSources: [],
    faculties: []
  });

  // Form State
  const [formData, setFormData] = useState({
    academicYear: '',
    semester: '',
    agencyId: '',
    typeId: '',
    title: '',
    description: '',
    location: '',
    activityStart: '',
    activityEnd: '',
    registrationStart: '',
    registrationEnd: '',
    hours: 0,
    loanerHours: 0,
    credits: 0,
    maxParticipants: 0,
    budgetSourceId: '',
    budgetRequested: 0,
    skills: [],
    faculties: [], // Restrictions
    coverImage: null,
    publishStatus: 'private',
    status: 'ขออนุมัติ',
    creatorId: null,
    attachments: [], // New attachments to upload
    existingAttachments: [] // Already uploaded attachments
  });

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      // Adjust to local time and format for datetime-local
      const tzOffset = date.getTimezoneOffset() * 60000;
      const localISODate = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
      return localISODate;
    } catch (e) {
      return '';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Master Data
        const [agencies, types, skills, budgetSources, faculties, activity] = await Promise.all([
          masterDataService.getAgencies(),
          masterDataService.getActivityTypes(),
          masterDataService.getSkills(),
          masterDataService.getBudgetSources(),
          masterDataService.getFaculties(),
          activityService.getActivityById(id)
        ]);

        setMasterData({ agencies, types, skills, budgetSources, faculties });

        // 2. Pre-fill form with activity data
        if (activity) {
          // Ownership Check
          if (user?.role === 'officer' && activity.owner_faculty_code !== user.faculty_code) {
            toast.error('คุณไม่มีสิทธิ์แก้ไขกิจกรรมนี้');
            router.push('/manage');
            return;
          }

          setFormData({
            academicYear: activity.academic_year,
            semester: activity.semester,
            agencyId: activity.agency_id,
            typeId: activity.type_id,
            title: activity.title,
            description: activity.description,
            location: activity.location,
            activityStart: formatDateTime(activity.activity_start),
            activityEnd: formatDateTime(activity.activity_end),
            registrationStart: formatDateTime(activity.registration_start),
            registrationEnd: formatDateTime(activity.registration_end),
            hours: activity.hours,
            loanerHours: activity.loaner_hours,
            credits: activity.credits,
            maxParticipants: activity.max_participants,
            budgetSourceId: activity.budget_source_id,
            budgetRequested: activity.budget_requested,
            skills: activity.skills?.map(s => s.id) || [],
            faculties: activity.allowed_faculties?.map(f => f.faculty_code) || [],
            coverImage: null, // Reset to null, only set if changing
            publishStatus: activity.publish_status,
            status: activity.status,
            creatorId: activity.creator_id,
            attachments: [],
            existingAttachments: activity.attachments || []
          });

          if (activity.cover_image) {
            setExistingCoverImage(getImageUrl(activity.cover_image));
          }
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
        toast.error('ไม่สามารถโหลดข้อมูลกิจกรรมได้');
      } finally {
        setLoading(false);
      }
    };
    if (id && user) fetchData();
  }, [id, user, router]);

  const toggleSkill = (skillId) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter(id => id !== skillId)
        : [...prev.skills, skillId]
    }));
  };

  const toggleFaculty = (facultyCode) => {
    setFormData(prev => ({
      ...prev,
      faculties: prev.faculties.includes(facultyCode)
        ? prev.faculties.filter(code => code !== facultyCode)
        : [...prev.faculties, facultyCode]
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 1. Validate File Type (Images only)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('กรุณาเลือกไฟล์ภาพเท่านั้น (JPEG, PNG, WEBP)');
        return;
      }

      // 2. Validate File Size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('ไฟล์ภาพต้องมีขนาดไม่เกิน 5MB');
        return;
      }

      setFormData(prev => ({ ...prev, coverImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteExistingAttachment = async (attachmentId) => {
    try {
      if (confirm('ยืนยันระบบจะลบไฟล์ต้นฉบับออกจากระบบทันที ยืนยันการลบ?')) {
        await activityService.deleteAttachment(attachmentId);
        setFormData(prev => ({
          ...prev,
          existingAttachments: prev.existingAttachments.filter(a => a.id !== attachmentId)
        }));
        toast.success('ลบไฟล์แนบสำเร็จ');
      }
    } catch (error) {
      toast.error('ลบไฟล์ไม่สำเร็จ');
    }
  };

  const toggleExistingAttachmentVisibility = async (att) => {
    try {
      const nextStatus = !att.is_published;
      await activityService.updateAttachmentVisibility(att.id, nextStatus);
      setFormData(prev => ({
        ...prev,
        existingAttachments: prev.existingAttachments.map(a =>
          a.id === att.id ? { ...a, is_published: nextStatus } : a
        )
      }));
      toast.success(`เปลี่ยนเป็น ${nextStatus ? 'Public' : 'Private'}`);
    } catch (error) {
      toast.error('เปลี่ยนสถานะไม่สำเร็จ');
    }
  };

  const handleStatusChange = (newStatus) => {
    setNewStatusPending(newStatus);
    setIsStatusModalOpen(true);
  };

  const confirmStatusChange = async () => {
    try {
      setStatusLoading(true);
      await activityService.updateStatus(id, newStatusPending);
      setFormData(prev => ({ ...prev, status: newStatusPending }));
      toast.success(`เปลี่ยนสถานะเป็น ${newStatusPending} สำเร็จ`);
      setIsStatusModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'เปลี่ยนสถานะไม่สำเร็จ');
    } finally {
      setStatusLoading(false);
    }
  };

  const isEditable = user?.role === 'admin' || user?.role === 'superadmin' || (user?.role === 'officer' && formData.status !== 'ปิดกิจกรรม');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = new FormData();

      Object.keys(formData).forEach(key => {
        if (key === 'skills' || key === 'faculties') {
          data.append(key, JSON.stringify(formData[key]));
        } else if (key === 'coverImage') {
          if (formData[key]) data.append('coverImage', formData[key]);
        } else if (key === 'attachments') {
          formData[key].forEach(att => {
            data.append('attachments', att.file);
          });
          data.append('attachmentMetadata', JSON.stringify(formData[key].map(att => ({
            originalName: att.file.name,
            displayName: att.displayName,
            isPublished: att.isPublished
          }))));
        } else if (key === 'existingAttachments') {
          // No need to send existing attachments in the multipart data
          // unless we had some complex logic here.
        } else {
          data.append(key, formData[key]);
        }
      });

      await activityService.updateActivity(id, data);
      toast.success('อัปเดตข้อมูลกิจกรรมสำเร็จ');
      router.push('/manage');
    } catch (error) {
      toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดต');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-muted-foreground font-black uppercase  text-xs animate-pulse font-sarabun">
          กำลังโหลดข้อมูลกิจกรรม...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 font-sarabun">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/manage" className="flex items-center text-muted-foreground hover:text-foreground transition-all group font-black uppercase text-[10px] mb-2">
            <ChevronLeft size={14} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Management
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black text-foreground leading-none flex items-center">
              <Save className="mr-3 text-primary" size={32} />
              แก้ไขข้อมูลกิจกรรม
            </h1>
            <Badge className={cn(
              "rounded-lg px-3 py-1 text-[10px] font-black uppercase",
              formData.status === 'ดำเนินการ' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                formData.status === 'ปิดกิจกรรม' ? "bg-red-500/10 text-red-600 border-red-500/20" :
                  "bg-amber-500/10 text-amber-600 border-amber-500/20"
            )}>
              {formData.status}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm font-medium">แก้ไขรายละเอียดและเงื่อนไขของกิจกรรม</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Status Action Buttons */}
          {user?.role === 'officer' && 
           formData.status !== 'ปิดกิจกรรม' && 
           parseInt(formData.creatorId) === parseInt(user?.id) && (
            <Button
              variant="outline"
              onClick={() => handleStatusChange('ปิดกิจกรรม')}
              className="rounded-xl px-6 border-red-500 text-red-600 hover:bg-red-50"
            >
              ปิดกิจกรรม
            </Button>
          )}

          {(user?.role === 'admin' || user?.role === 'superadmin') && (
            <>
              {formData.status !== 'ดำเนินการ' && (
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange('ดำเนินการ')}
                  className="rounded-xl px-6 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                >
                  เปิดดำเนินการ
                </Button>
              )}
              {formData.status !== 'ปิดกิจกรรม' && (
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange('ปิดกิจกรรม')}
                  className="rounded-xl px-6 border-red-500 text-red-600 hover:bg-red-50"
                >
                  ปิดกิจกรรม
                </Button>
              )}
            </>
          )}

          <Button variant="outline" onClick={() => router.back()} className="rounded-xl px-6">ยกเลิก</Button>
          {isEditable && (
            <Button
              onClick={handleSubmit}
              disabled={saving}
              className="rounded-xl px-6 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
            >
              <Save size={18} className="mr-2 inline" />
              {saving ? 'กำลังอัปเดต...' : 'บันทึกการแก้ไข'}
            </Button>
          )}
        </div>
      </div>

      {!isEditable && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2 duration-500">
          <Lock size={20} />
          <p className="text-sm font-bold italic uppercase">
            กิจกรรมนี้ถูกปิดแล้ว ไม่สามารถทำการแก้ไขข้อมูลได้ หากต้องการแก้ไขกรุณาติดต่อ Admin
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={cn("grid grid-cols-1 lg:grid-cols-3 gap-8", !isEditable && "opacity-60 pointer-events-none select-none")}>
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Cover Image */}
          <Card className="p-8 border-border relative overflow-hidden group">
            <h3 className="text-lg font-black text-foreground mb-8 uppercase  italic flex items-center">
              <span className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center mr-3 text-sm not-italic">1</span>
              ภาพหน้าปกกิจกรรม
            </h3>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer border-2 border-dashed border-border hover:border-primary/50 rounded-3xl p-2 transition-all bg-muted/20 overflow-hidden"
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              {previewImage || existingCoverImage ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-border">
                  <img src={previewImage || existingCoverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-black uppercase  text-xs">คลิกเพื่อเปลี่ยนรูปภาพ</p>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <ImageIcon size={32} className="text-primary" />
                  <p className="text-foreground font-black uppercase  text-xs">คลิกเพื่อเลือกไฟล์ภาพ</p>
                </div>
              )}
            </div>
          </Card>

          {/* Section 2: Basic Information */}
          <Card className="p-8 border-border relative overflow-hidden group">
            <h3 className="text-lg font-black text-foreground mb-8 uppercase  italic flex items-center">
              <span className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center mr-3 text-sm not-italic">2</span>
              ข้อมูลพื้นฐานกิจกรรม
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">ชื่อกิจกรรม</label>
                <input
                  type="text" required
                  className="text-slate-900 w-full bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl px-4 py-3 transition-all outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">ปีการศึกษา</label>
                  <select
                    className="text-slate-900 w-full bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl px-4 py-3 transition-all outline-none"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  >
                    {[2567, 2568, 2569, 2570, 2571].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">ภาคเรียน</label>
                  <select
                    className="text-slate-900 w-full bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl px-4 py-3 transition-all outline-none"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  >
                    {[1, 2, 3].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">หน่วยงานที่จัด</label>
                  <select
                    required
                    className="text-slate-900 w-full bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl px-4 py-3 transition-all outline-none"
                    value={formData.agencyId}
                    onChange={(e) => setFormData({ ...formData, agencyId: e.target.value })}
                  >
                    {masterData.agencies.map(a => <option key={a.id} value={a.id}>{a.agency_name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">ประเภทกิจกรรม</label>
                  <select
                    required
                    className="text-slate-900 w-full bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl px-4 py-3 transition-all outline-none"
                    value={formData.typeId}
                    onChange={(e) => setFormData({ ...formData, typeId: e.target.value })}
                  >
                    {masterData.types.map(t => <option key={t.id} value={t.id}>{t.type_name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">รายละเอียดกิจกรรม</label>
                <textarea
                  required rows={4}
                  className="text-slate-900 w-full bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl px-4 py-3 transition-all outline-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">สถานที่จัดกิจกรรม</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="text" required
                    className="text-slate-900 w-full bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl pl-12 pr-4 py-3 transition-all outline-none"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Section 3: Skills */}
          <Card className="p-8 border-border relative overflow-hidden group">
            <h3 className="text-lg font-black text-foreground mb-8 uppercase  italic flex items-center">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center mr-3 text-sm not-italic">3</span>
              ทักษะและผลการเรียนรู้
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {masterData.skills.map(s => (
                <button
                  key={s.id} type="button" onClick={() => toggleSkill(s.id)}
                  className={cn(
                    "px-4 py-2 rounded-2xl text-left transition-all border text-sm",
                    formData.skills.includes(s.id)
                      ? "bg-primary border-primary text-primary-foreground shadow-lg"
                      : "bg-muted/30 border-border text-muted-foreground"
                  )}
                >
                  {s.skill_name}
                </button>
              ))}
            </div>
          </Card>

          {/* Section 4: Faculty Restrictions */}
          <Card className="p-8 border-border relative overflow-hidden group">
            <h3 className="text-lg font-black text-foreground mb-8 uppercase  italic flex items-center">
              <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mr-3 text-sm not-italic">4</span>
              สิทธิ์การสมัคร (คณะ)
            </h3>
            <div className="flex flex-wrap gap-2">
              {masterData.faculties.map(f => (
                <button
                  key={f.faculty_code} type="button" onClick={() => toggleFaculty(f.faculty_code)}
                  className={cn(
                    "px-4 py-2 rounded-2xl text-sm transition-all border",
                    formData.faculties.includes(f.faculty_code)
                      ? "bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/20"
                      : "bg-muted/30 border-border text-muted-foreground"
                  )}
                >
                  {f.faculty_name}
                </button>
              ))}
            </div>
            <p className="mt-4 text-[10px] text-muted-foreground italic">* หากไม่ระบุจะสมัครได้ทุกคณะ</p>
          </Card>

          {/* Section 5: Attachments */}
          <Card className="p-8 border-border relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-foreground uppercase  italic flex items-center">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center mr-3 text-sm not-italic">5</span>
                เอกสารแนบ (Attachments)
              </h3>
              <button
                type="button"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file'; input.multiple = true;
                  input.onchange = (e) => {
                    const files = Array.from(e.target.files);
                    const allowedExts = ['jpeg', 'jpg', 'png', 'webp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'];
                    const MAX_SIZE = 10 * 1024 * 1024; // 10MB

                    const validFiles = [];
                    for (const file of files) {
                      const ext = file.name.split('.').pop().toLowerCase();
                      if (!allowedExts.includes(ext)) {
                        toast.error(`ไฟล์ ${file.name} ไม่รองรับประเภทนี้`);
                        continue;
                      }
                      if (file.size > MAX_SIZE) {
                        toast.error(`ไฟล์ ${file.name} มีขนาดใหญ่เกินไป (จำกัด 10MB)`);
                        continue;
                      }
                      validFiles.push({ file, displayName: file.name, isPublished: true });
                    }
                    if (validFiles.length > 0) {
                      setFormData({ ...formData, attachments: [...formData.attachments, ...validFiles] });
                    }
                  };
                  input.click();
                }}
                className="px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
              >
                + เพิ่มไฟล์ใหม่
              </button>
            </div>

            {/* List Existing & New Attachments */}
            <div className="space-y-3">
              {formData.existingAttachments.map((att) => (
                <div key={att.id} className="flex items-center gap-4 p-4 bg-muted/20 border border-border rounded-2xl group/item">
                  <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center text-muted-foreground">
                    <Save size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-foreground truncate">{att.display_name}</p>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold italic truncate">{att.file_name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => toggleExistingAttachmentVisibility(att)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all",
                        att.is_published ? "bg-sky-500/10 text-sky-500" : "bg-slate-500/10 text-slate-500"
                      )}
                    >
                      {att.is_published ? 'Public' : 'Private'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteExistingAttachment(att.id)}
                      className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {formData.attachments.map((att, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/20 rounded-2xl group/item animate-in slide-in-from-right-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Plus size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <input
                      type="text" value={att.displayName}
                      className="w-full bg-transparent border-none p-0 text-xs font-black focus:ring-0"
                      onChange={(e) => {
                        const newAtts = [...formData.attachments];
                        newAtts[idx].displayName = e.target.value;
                        setFormData({ ...formData, attachments: newAtts });
                      }}
                    />
                    <p className="text-[9px] text-muted-foreground/60 uppercase font-bold italic truncate">{att.file.name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        const newAtts = [...formData.attachments];
                        newAtts[idx].isPublished = !newAtts[idx].isPublished;
                        setFormData({ ...formData, attachments: newAtts });
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all",
                        att.isPublished ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-500/10 text-slate-500"
                      )}
                    >
                      {att.isPublished ? 'Public' : 'Private'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newAtts = formData.attachments.filter((_, i) => i !== idx);
                        setFormData({ ...formData, attachments: newAtts });
                      }}
                      className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Timeline */}
          <Card className="p-8 border-border bg-card">
            <h3 className="text-sm font-black text-foreground mb-8 uppercase  italic flex items-center">
              <Calendar className="mr-3 text-primary" size={20} />
              กำหนดการ
            </h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted-foreground uppercase">เริ่มกิจกรรม</label>
                <input type="datetime-local" className="text-slate-900 w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm" value={formData.activityStart} onChange={(e) => setFormData({ ...formData, activityStart: e.target.value })} />
                <label className="text-[10px] font-black text-muted-foreground uppercase">สิ้นสุดกิจกรรม</label>
                <input type="datetime-local" className="text-slate-900 w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm" value={formData.activityEnd} onChange={(e) => setFormData({ ...formData, activityEnd: e.target.value })} />
              </div>
              <div className="space-y-3 pt-4 border-t border-border">
                <label className="text-[10px] font-black text-muted-foreground uppercase">เริ่มรับสมัคร</label>
                <input type="datetime-local" className="text-slate-900 w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm" value={formData.registrationStart} onChange={(e) => setFormData({ ...formData, registrationStart: e.target.value })} />
                <label className="text-[10px] font-black text-muted-foreground uppercase">ปิดรับสมัคร</label>
                <input type="datetime-local" className="text-slate-900 w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm" value={formData.registrationEnd} onChange={(e) => setFormData({ ...formData, registrationEnd: e.target.value })} />
              </div>
            </div>
          </Card>

          {/* Visibility */}
          <Card className="p-8 border-border bg-card">
            <h3 className="text-sm font-black text-foreground mb-8 uppercase  italic flex items-center">
              <Globe className="mr-3 text-sky-500" size={20} />
              การมองเห็น
            </h3>
            <div className="flex gap-2 mb-4">
              <button
                type="button" 
                disabled={formData.status === 'ขออนุมัติ'}
                onClick={() => setFormData({ ...formData, publishStatus: 'public' })}
                className={cn(
                  "flex-1 py-3 rounded-xl text-[10px] font-black border transition-all", 
                  formData.publishStatus === 'public' ? "bg-sky-500 text-white border-sky-500" : "bg-muted/30 text-muted-foreground",
                  formData.status === 'ขออนุมัติ' && "opacity-50 cursor-not-allowed"
                )}
              >PUBLIC</button>
              <button
                type="button" 
                disabled={formData.status === 'ขออนุมัติ'}
                onClick={() => setFormData({ ...formData, publishStatus: 'private' })}
                className={cn(
                  "flex-1 py-3 rounded-xl text-[10px] font-black border transition-all", 
                  formData.publishStatus === 'private' ? "bg-slate-700 text-white border-slate-700" : "bg-muted/30 text-muted-foreground",
                  formData.status === 'ขออนุมัติ' && "opacity-50 cursor-not-allowed"
                )}
              >PRIVATE</button>
            </div>
            {formData.status === 'ขออนุมัติ' && (
              <p className="text-[10px] text-amber-600 font-bold italic italic-none">
                * กิจกรรมที่รออนุมัติจะต้องเป็น Private เท่านั้น
              </p>
            )}
          </Card>

          {/* Credits */}
          <Card className="p-8 border-border bg-card">
            <h3 className="text-sm font-black text-foreground mb-8 uppercase  italic flex items-center">
              <Clock className="mr-3 text-indigo-500" size={20} />
              ชั่วโมงและเป้าหมาย
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-muted-foreground uppercase">จำนวนคนรับสมัคร</label>
                <input type="number" className="text-slate-900 w-full bg-muted/30 border-border rounded-xl px-4 py-3 text-sm" value={formData.maxParticipants} onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-muted-foreground uppercase">ชั่วโมงกิจกรรม</label>
                <input type="number" className="text-slate-900 w-full bg-muted/30 border-border rounded-xl px-4 py-3 text-sm" value={formData.hours} onChange={(e) => setFormData({ ...formData, hours: parseFloat(e.target.value) })} />
              </div>
            </div>
          </Card>
        </div>
      </form>

      {/* Status Confirmation Modal */}
      <ConfirmationModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={confirmStatusChange}
        title="ยืนยันการเปลี่ยนสถานะ"
        message={`คุณแน่ใจหรือไม่ว่าต้องการเปลี่ยนสถานะกิจกรรมเป็น "${newStatusPending}"?`}
        confirmText={newStatusPending === 'ปิดกิจกรรม' ? "ยืนยันปิดกิจกรรม" : "ยืนยันการเปลี่ยนสถานะ"}
        cancelText="ยกเลิก"
        type={newStatusPending === 'ปิดกิจกรรม' ? "warning" : "info"}
        loading={statusLoading}
      />
    </div>
  );
}
