'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { User, Mail, Shield, Camera, Save, X as CloseIcon, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { userService } from '@/services/userService';
import toast from 'react-hot-toast';
import { getImageUrl } from '@/lib/utils';

export default function ProfilePage() {
  const { user, setAuth, token } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Form States
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: ''
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        username: user.username || ''
      });
      setPreviewImage(user.profile_image);
    }
  }, [user, editing]);

  const handleImageClick = () => {
    if (editing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('ไฟล์มีขนาดใหญ่เกินไป (จำกัด 2MB)');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // 1. Update Profile Image if selected
      let updatedUser = user;
      if (selectedFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', selectedFile);
        const imageRes = await userService.updateProfileImage(imageFormData);
        updatedUser = imageRes.user;
      }

      // 2. Update Profile Info
      const profileRes = await userService.updateProfile({
        firstname: formData.firstname,
        lastname: formData.lastname,
        username: formData.username
      });

      updatedUser = { ...updatedUser, ...profileRes.user };

      // 3. Update Global Store
      setAuth(updatedUser, token);

      toast.success('อัปเดตข้อมูลส่วนตัวเรียบร้อยแล้ว');
      setEditing(false);
      setSelectedFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setSelectedFile(null);
    setPreviewImage(user?.profile_image);
  };


  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="relative h-60 bg-gradient-to-br from-primary to-indigo-800 rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/20">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>

      <div className="px-4 md:px-12 -mt-24 relative z-10">
        <Card className="p-8 md:p-12 border-border shadow-2xl shadow-slate-900/5">
          <div className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-2xl group-hover:scale-110 transition-transform duration-500" />
              <img
                src={getImageUrl(previewImage)}
                alt="Profile"
                className={`w-40 h-40 rounded-[2.5rem] border-4 border-card shadow-2xl object-cover relative z-10 transition-all duration-500 ${editing ? 'cursor-pointer hover:brightness-75 scale-[1.02]' : ''}`}
                onClick={handleImageClick}
              />
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              {editing && (
                <button
                  onClick={handleImageClick}
                  className="absolute bottom-2 right-2 w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center border-4 border-card shadow-lg hover:scale-110 transition-all z-20"
                >
                  <Camera size={20} />
                </button>
              )}
            </div>

            <div className="flex-1 text-center md:text-left relative z-10 pb-2">
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-5">
                <h1 className="text-4xl font-black text-foreground tracking-tight">
                  {editing ? (formData.username || 'Username') : (user?.username || 'No Name')}
                </h1>
                <Badge variant={user?.role === 'student' ? 'primary' : 'success'} className="px-4 py-1 text-xs uppercase tracking-widest font-black">
                  {user?.role}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-3 flex items-center justify-center md:justify-start font-medium text-lg">
                <Mail size={18} className="mr-3 text-primary" />
                {user?.email}
              </p>
            </div>

            <div className="flex space-x-3 relative z-10">
              {editing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-6 rounded-2xl border-border"
                  >
                    <CloseIcon size={18} className="mr-2" /> ยกเลิก
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={loading}
                    className="px-8 rounded-2xl shadow-lg shadow-primary/20"
                  >
                    {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save size={18} className="mr-2" />}
                    บันทึกข้อมูล
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => setEditing(true)}
                  className="px-8 py-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
                >
                  EDIT PROFILE
                </Button>
              )}
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="text-xl font-black text-foreground flex items-center uppercase tracking-widest italic">
                <User size={24} className="mr-3 text-primary" />
                Personal Information
              </h3>
              <div className="space-y-5">
                {/* <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="ชื่อ (First Name)" 
                    value={formData.firstname} 
                    onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                    disabled={!editing} 
                    placeholder="ภาษาไทย/อังกฤษ"
                  />
                  <Input 
                    label="นามสกุล (Last Name)" 
                    value={formData.lastname} 
                    onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                    disabled={!editing} 
                    placeholder="ภาษาไทย/อังกฤษ"
                  />
                </div> */}
                <Input
                  label="Display Name / Nickname"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={!editing}
                  placeholder="สำหรับแสดงในระบบ"
                />
                <Input
                  label="อีเมลสถาบัน (ไม่สามารถแก้ไขได้)"
                  value={user?.email}
                  disabled
                  className="bg-muted/50 opacity-70"
                />
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-xl font-black text-foreground flex items-center uppercase tracking-widest italic">
                <Shield size={24} className="mr-3 text-indigo-500" />
                Access Control
              </h3>
              <div className="bg-muted p-8 rounded-[2.5rem] border border-border group hover:border-primary/30 transition-colors">
                <p className="text-sm font-medium text-muted-foreground mb-6 leading-relaxed">
                  สิทธิ์ปัจจุบันของคุณกำหนดการเข้าถึงส่วนต่างๆ ของระบบทรานสคลิปกิจกรรม มหาวิทยาลัยมหาสารคาม
                </p>
                <div className="flex items-center space-x-5 p-5 bg-card rounded-[1.5rem] shadow-sm border border-border group-hover:shadow-lg group-hover:shadow-primary/5 transition-all">
                  <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-xl font-black shadow-inner">
                    {user?.role?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-black text-foreground uppercase tracking-widest text-sm">{user?.role} Access</h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mt-1 items-center flex">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      Active Member
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
