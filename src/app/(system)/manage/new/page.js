'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  ChevronLeft,
  Save,
  Trash2,
  Calendar,
  Building2,
  Target,
  Clock,
  MapPin,
  Wallet,
  ShieldCheck,
  LayoutDashboard,
  CheckCircle2,
  Globe,
  Lock,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { masterDataService } from '@/services/masterDataService';
import { activityService } from '@/services/activityService';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function NewActivityPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

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
    academicYear: new Date().getFullYear() + 543,
    semester: 1,
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
    maxParticipants: 50,
    budgetSourceId: '',
    budgetRequested: 0,
    skills: [],
    faculties: [], // Restrictions
    coverImage: null, // Initial value for file
    publishStatus: 'private', // Default to public so it's visible once approved //'Public' : 'Private'
    attachments: [] // List of { file, displayName, isPublished }
  });

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        setLoading(true);
        const [agencies, types, skills, budgetSources, faculties] = await Promise.all([
          masterDataService.getAgencies(),
          masterDataService.getActivityTypes(),
          masterDataService.getSkills(),
          masterDataService.getBudgetSources(),
          masterDataService.getFaculties()
        ]);
        setMasterData({ agencies, types, skills, budgetSources, faculties });

        // Auto-select agency if officer
        if (user?.role === 'officer' && agencies.length > 0) {
          // Mapping would be better if we had user.agency_id. 
          // For now, let user select.
        }
      } catch (error) {
        console.error('Failed to fetch master data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMasterData();
  }, [user]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      // Use FormData for multipart upload
      const data = new FormData();

      // Append all fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'skills' || key === 'faculties') {
          // Arrays need to be stringified for multipart form data if backend expects JSON
          data.append(key, JSON.stringify(formData[key]));
        } else if (key === 'coverImage') {
          if (formData[key]) {
            data.append('coverImage', formData[key]);
          }
        } else if (key === 'attachments') {
          formData[key].forEach(att => {
            data.append('attachments', att.file);
          });
          // Correlation by originalName
          data.append('attachmentMetadata', JSON.stringify(formData[key].map(att => ({
            originalName: att.file.name,
            displayName: att.displayName,
            isPublished: att.isPublished
          }))));
        } else {
          data.append(key, formData[key]);
        }
      });

      await activityService.createActivity(data);
      toast.success('สร้างกิจกรรมสำเร็จแล้ว! กิจกรรมจะแสดงผลในหน้าหลักหลังจากได้รับการอนุมัติจาก Admin');
      router.push('/manage');
    } catch (error) {
      toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาดในการสร้างกิจกรรม');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-muted-foreground font-black uppercase  text-xs animate-pulse font-sarabun">
          กำลังเตรียมข้อมูลสำหรับการจัดการกิจกรรม...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 font-sarabun">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/manage" className="flex items-center text-muted-foreground hover:text-foreground transition-all group font-black uppercase  text-[10px] mb-2">
            <ChevronLeft size={14} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Management
          </Link>
          <h1 className="text-4xl font-black text-foreground  leading-none flex items-center">
            <Plus className="mr-3 text-primary" size={32} />
            สร้างกิจกรรมใหม่
          </h1>
          <p className="text-muted-foreground text-sm font-medium">กรอกข้อมูลให้ครบถ้วนเพื่อส่งขออนุมัติจัดกิจกรรม</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => router.back()} className="rounded-xl px-6">ยกเลิก</Button>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-xl px-6 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
          >
            <Save size={18} className="mr-2 inline" />
            {saving ? 'กำลังบันทึก...' : 'บันทึกและส่งอนุมัติ'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Basic Information */}
          <Card className="p-8 border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <LayoutDashboard size={60} />
            </div>

            <h3 className="text-lg font-black text-foreground mb-8 uppercase  italic flex items-center">
              <span className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center mr-3 text-sm not-italic">1</span>              ภาพหน้าปกกิจกรรม
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">ภาพหน้าปกกิจกรรม (JPEG, PNG, WEBP)</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group cursor-pointer border-2 border-dashed border-border hover:border-primary/50 rounded-3xl p-4 transition-all bg-muted/20"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {previewImage ? (
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
                      <img
                        src={previewImage}
                        alt="Cover Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white font-black uppercase  text-xs">เปลี่ยนรูปภาพ</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                        <ImageIcon size={32} />
                      </div>
                      <div className="text-center">
                        <p className="text-foreground font-black uppercase  text-xs">คลิกเพื่อเลือกไฟล์ภาพ</p>
                        <p className="text-muted-foreground text-[10px] mt-1 uppercase font-bold tracking-wider">Maximum file size: 5MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Section 2: Basic Information */}
          <Card className="p-8 border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <LayoutDashboard size={60} />
            </div>

            <h3 className="text-lg font-black text-foreground mb-8 uppercase  italic flex items-center">
              <span className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center mr-3 text-sm not-italic">2</span>
              ข้อมูลพื้นฐานกิจกรรม
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">ชื่อกิจกรรม</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น โครงการเสริมสร้างทักษะดิจิทัลสำหรับนิสิต..."
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
                    onChange={(e) => setFormData({ ...formData, academicYear: parseInt(e.target.value) })}
                  >
                    {[2567, 2568, 2569, 2570, 2571].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">ภาคเรียน</label>
                  <select
                    className="text-slate-900 w-full bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl px-4 py-3 transition-all outline-none"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
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
                    <option value="">เลือกหน่วยงาน</option>
                    {masterData.agencies.map(a => (
                      <option key={a.id} value={a.id}>{a.agency_name} ({a.agency_code})</option>
                    ))}
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
                    <option value="">เลือกประเภท</option>
                    {masterData.types.map(t => (
                      <option key={t.id} value={t.id}>{t.type_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">รายละเอียดกิจกรรม</label>
                <textarea
                  required
                  rows={4}
                  placeholder="เขียนรายละเอียดกิจกรรมโดยสังเขป..."
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
                    type="text"
                    required
                    placeholder="ห้องประชุม, อาคาร, หรือลิงก์การประชุมออนไลน์..."
                    className="text-slate-900 w-full bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl pl-12 pr-4 py-3 transition-all outline-none"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Section 2: Skills & Learning Outcomes */}
          <Card className="p-8 border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Target size={60} />
            </div>

            <h3 className="text-lg font-black text-foreground mb-8 uppercase  italic flex items-center">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center mr-3 text-sm not-italic">3</span>
              ทักษะและผลการเรียนรู้
            </h3>

            <div className="space-y-4">
              <p className="text-sm  text-slate-900 px-1 mb-4">เลือกทักษะที่เกี่ยวข้อง</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {masterData.skills.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSkill(s.id)}
                    className={cn(
                      "px-4 py-2 rounded-2xl text-left transition-all border group relative overflow-hidden",
                      formData.skills.includes(s.id)
                        ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-muted/30 border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="relative z-10">
                      {/* <p className="text-[10px] font-black uppercase  mb-1 opacity-70">
                        {s.skill_name_en}
                      </p> */}
                      <p className="text-xs font-bold leading-tight">
                        {s.skill_name}
                      </p>
                    </div>
                    {formData.skills.includes(s.id) && (
                      <CheckCircle2 className="hidden absolute right-2 top-2 text-primary-foreground/50" size={16} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Section 3: Faculty Restrictions */}
          <Card className="p-8 border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck size={60} />
            </div>

            <h3 className="text-lg font-black text-foreground mb-8 uppercase  italic flex items-center">
              <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mr-3 text-sm not-italic">4</span>
              ข้อกำหนดและสิทธิ์การสมัคร
            </h3>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 px-1">
                  <p className="text-sm text-slate-900">จำกัดคณะที่สมัครได้ <br />(หากไม่ระบุจะสมัครได้ทุกคณะ)</p>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, faculties: [] })}
                    className="text-sm text-primary hover:text-red-500"
                  >
                    ล้างข้อมูล
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {masterData.faculties.map(f => (
                    <button
                      key={f.faculty_code}
                      type="button"
                      onClick={() => toggleFaculty(f.faculty_code)}
                      className={cn(
                        "px-4 py-2 rounded-2xl text-xs font-black transition-all border",
                        formData.faculties.includes(f.faculty_code)
                          ? "bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/20"
                          : "bg-muted/30 border-border text-muted-foreground hover:border-amber-500/50 hover:text-foreground"
                      )}
                    >
                      {f.faculty_name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">จำนวนรับสมัครสูงสุด</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      className="text-slate-900 w-full bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl px-4 py-3 transition-all outline-none"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                    />
                    <span className="absolute right-10 top-1/2 -translate-y-1/2 text text-muted-foreground">คน</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 5: Attachments (Added) */}
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
                  input.type = 'file';
                  input.multiple = true;
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
                      validFiles.push({
                        file,
                        displayName: file.name,
                        isPublished: true
                      });
                    }
                    if (validFiles.length > 0) {
                      setFormData({ ...formData, attachments: [...formData.attachments, ...validFiles] });
                    }
                  };
                  input.click();
                }}
                className="px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
              >
                + เพิ่มไฟล์เอกสาร
              </button>

            </div>

            <div className="space-y-4">
              {formData.attachments.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-[2.5rem] bg-muted/10 group-hover:bg-muted/20 transition-all">
                  <p className="text-xs font-black text-muted-foreground uppercase  italic">ยังไม่มีเอกสารแนบในกิจกรรมนี้</p>
                  <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase tracking-wider opacity-60">คลิกที่ปุ่มด้านบนเพื่อเลือกไฟล์ (PDF, Word, Excel, ฯลฯ)</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.attachments.map((att, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center gap-4 p-5 bg-card border border-border rounded-[2rem] group/item transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                      <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors">
                        <Plus size={24} />
                      </div>

                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={att.displayName}
                          onChange={(e) => {
                            const newAtts = [...formData.attachments];
                            newAtts[idx].displayName = e.target.value;
                            setFormData({ ...formData, attachments: newAtts });
                          }}
                          className="text-slate-900 w-full bg-muted/20 border-none focus:ring-0 p-0 text-sm font-black text-foreground placeholder:text-muted-foreground/30 focus:bg-transparent transition-colors"
                          placeholder="กำหนดชื่อแสดงผลเอกสาร..."
                        />
                        <div className="flex items-center space-x-2 text-[10px] font-bold text-muted-foreground uppercase  italic">
                          <span className="truncate max-w-[200px]">{att.file.name}</span>
                          <span>•</span>
                          <span>{(att.file.size / 1024).toFixed(1)} KB</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            const newAtts = [...formData.attachments];
                            newAtts[idx].isPublished = !newAtts[idx].isPublished;
                            setFormData({ ...formData, attachments: newAtts });
                          }}
                          className={cn(
                            "px-4 py-2 rounded-2xl text-[10px] font-black uppercase transition-all flex items-center",
                            att.isPublished
                              ? "bg-sky-500/10 text-sky-500 border border-sky-500/20"
                              : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
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
                          className="p-3 text-muted-foreground hover:text-red-500 transition-colors bg-muted/20 rounded-2xl"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="mt-8 text-[12px] text-muted-foreground font-medium italic border-t border-border pt-6 leading-loose">
              * คุณสามารถแก้ไขชื่อไฟล์หลังจากอัปโหลดได้ โดยระบบจะแสดงชื่อที่คุณกำหนดแทนชื่อไฟล์จริงในการเผยแพร่ <br />
              * ไฟล์ที่ตั้งเป็น <span className="text-sky-500 font-bold">Private</span> จะ<u>ไม่แสดง</u>ให้นิสิตดาวน์โหลดได้ในหน้าหลักกิจกรรม
            </p>
          </Card>
        </div>

        {/* Sidebar Creation Info */}
        <div className="space-y-8">
          {/* Section 4: Timeline */}
          <Card className="p-8 border-border bg-card">
            <h3 className="text-sm font-black text-foreground mb-8 uppercase  italic flex items-center">
              <Calendar className="mr-3 text-primary" size={20} />
              กำหนดการจัดกิจกรรม
            </h3>

            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-slate-900">ช่วงเวลารับสมัคร</p>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">เริ่มเปิดรับ</label>
                    <input
                      type="datetime-local"
                      required
                      className="text-slate-900 w-full bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl px-4 py-3 transition-all outline-none"
                      value={formData.registrationStart}
                      onChange={(e) => setFormData({ ...formData, registrationStart: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">ปิดรับสมัคร</label>
                    <input
                      type="datetime-local"
                      required
                      className="text-slate-900 w-full bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl px-4 py-3 transition-all outline-none"
                      value={formData.registrationEnd}
                      onChange={(e) => setFormData({ ...formData, registrationEnd: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <p className="text-sm text-slate-900">ช่วงเวลาจัดกิจกรรม</p>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">วันที่เริ่ม</label>
                    <input
                      type="datetime-local"
                      required
                      className="text-slate-900 w-full bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl px-4 py-3 transition-all outline-none"
                      value={formData.activityStart}
                      onChange={(e) => setFormData({ ...formData, activityStart: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">วันที่สิ้นสุด</label>
                    <input
                      type="datetime-local"
                      required
                      className="text-slate-900 w-full bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl px-4 py-3 transition-all outline-none"
                      value={formData.activityEnd}
                      onChange={(e) => setFormData({ ...formData, activityEnd: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 6: Visibility */}
          <Card className="p-8 border-border bg-card">
            <h3 className="text-sm font-black text-foreground mb-8 uppercase  italic flex items-center">
              <Globe className="mr-3 text-sky-500" size={20} />
              การมองเห็นกลุ่มเป้าหมาย
            </h3>

            <div className="space-y-4">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, publishStatus: 'public' })}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-2xl text-xs font-black transition-all border flex items-center justify-center",
                    formData.publishStatus === 'public'
                      ? "bg-sky-500 border-sky-500 text-white shadow-md shadow-sky-500/20"
                      : "bg-muted/30 border-border text-muted-foreground hover:border-sky-500/50"
                  )}
                >
                  <Globe size={14} className="mr-2" /> PUBLIC
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, publishStatus: 'private' })}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-2xl text-xs font-black transition-all border flex items-center justify-center",
                    formData.publishStatus === 'private'
                      ? "bg-slate-700 border-slate-700 text-white shadow-md shadow-slate-700/20"
                      : "bg-muted/30 border-border text-muted-foreground hover:border-slate-700/50"
                  )}
                >
                  <Lock size={14} className="mr-2" /> PRIVATE
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium italic border-t border-border pt-3">
                * กิจกรรมที่ตั้งเป็น Public จะแสดงในหน้าหลักหลังจาก Admin อนุมัติแล้วเท่านั้น
              </p>
            </div>
          </Card>

          {/* Section 6: Credits & Hours */}
          <Card className="p-8 border-border bg-card">
            <h3 className="text-sm font-black text-foreground mb-8 uppercase  italic flex items-center">
              <Clock className="mr-3 text-indigo-500" size={20} />
              หน่วยกิตและชั่วโมง
            </h3>

            <div className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">ชั่วโมงกิจกรรม</label>
                <input
                  type="number"
                  className="text-slate-900 w-full bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl px-4 py-3 transition-all outline-none"
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">ชั่วโมง กยศ.</label>
                <input
                  type="number"
                  className="text-slate-900 w-full bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl px-4 py-3 transition-all outline-none"
                  value={formData.loanerHours}
                  onChange={(e) => setFormData({ ...formData, loanerHours: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">หน่วยกิต</label>
                <input
                  type="number"
                  step="0.1"
                  className="text-slate-900 w-full bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl px-4 py-3 transition-all outline-none"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </Card>

          {/* Section 6: Budget */}
          <Card className="p-8 border-border bg-card">
            <h3 className="text-sm font-black text-foreground mb-8 uppercase  italic flex items-center">
              <Wallet className="mr-3 text-emerald-500" size={20} />
              งบประมาณโครงการ
            </h3>

            <div className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">แหล่งที่มางบประมาณ</label>
                <select
                  className="text-slate-900 w-full bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl px-4 py-3 transition-all outline-none"
                  value={formData.budgetSourceId}
                  onChange={(e) => setFormData({ ...formData, budgetSourceId: e.target.value })}
                >
                  <option value="">เลือกงบประมาณ</option>
                  {masterData.budgetSources.map(b => (
                    <option key={b.id} value={b.id}>{b.source_name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">จำนวนที่เสนอขอ (บาท)</label>
                <input
                  type="number"
                  className="text-slate-900 w-full bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl px-4 py-3 transition-all outline-none"
                  value={formData.budgetRequested}
                  onChange={(e) => setFormData({ ...formData, budgetRequested: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
