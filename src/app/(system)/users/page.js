'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import Image from 'next/image';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { userService } from '@/services/userService';
import { masterDataService } from '@/services/masterDataService';
import { getImageUrl } from '@/lib/utils';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  Shield,
  Building2,
  Calendar,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('');

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    role: '',
    faculty_code: '',
    username: '',
    firstname: '',
    lastname: ''
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers({
        search,
        role: roleFilter,
        facultyCode: facultyFilter,
        page: currentPage,
        limit: pageSize
      });
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      toast.error('ไม่สามารถโหลดข้อมูลผู้ใช้งานได้');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, facultyFilter, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const data = await masterDataService.getFaculties();
        setFaculties(data);
      } catch (err) {
        console.error('Failed to fetch faculties:', err);
      }
    };
    fetchFaculties();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleFacultyFilter = (e) => {
    setFacultyFilter(e.target.value);
    setCurrentPage(1);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditFormData({
      role: user.role || '',
      faculty_code: user.faculty_code || '',
      username: user.username || '',
      firstname: user.firstname || '',
      lastname: user.lastname || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.adminUpdateUser(selectedUser.id, editFormData);
      toast.success('อัปเดตข้อมูลผู้ใช้งานเรียบร้อยแล้ว');
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error('Failed to update user:', err);
      toast.error('ไม่สามารถอัปเดตข้อมูลผู้ใช้งานได้');
    }
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await userService.adminDeleteUser(selectedUser.id);
      toast.success('ลบผู้ใช้งานเรียบร้อยแล้ว');
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
      toast.error('ไม่สามารถลบผู้ใช้งานได้');
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'superadmin': return <Badge variant="danger">SUPER ADMIN</Badge>;
      case 'admin': return <Badge variant="primary">ADMIN</Badge>;
      case 'officer': return <Badge variant="success">OFFICER</Badge>;
      case 'student': return <Badge variant="indigo">STUDENT</Badge>;
      case 'staff': return <Badge variant="warning">STAFF</Badge>;
      default: return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + 4);
      
      if (end === totalPages) start = Math.max(1, end - 4);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center uppercase italic">
            <span className="w-2 h-8 bg-primary mr-3 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
            User Management
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-1 uppercase tracking-widest pl-5">
            จัดการข้อมูลผู้ใช้งานและกำหนดสิทธิ์ในระบบ (ทั้งหมด {totalCount} บัญชี)
          </p>
        </div>
      </div>

      <Card className="p-6 border-border/40 shadow-sm overflow-visible bg-card/50 backdrop-blur-sm rounded-[2rem]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="ค้นหาด้วยชื่อ, นามสกุล, อีเมล หรือ Username..."
              value={search}
              onChange={handleSearch}
              className="pl-12 bg-muted/50 border-none ring-1 ring-border focus:ring-2 focus:ring-primary/20 rounded-xl"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <select
              value={roleFilter}
              onChange={handleRoleFilter}
              className="w-full pl-12 pr-4 py-2.5 bg-muted/50 border-none ring-1 ring-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 appearance-none outline-none text-sm font-bold"
            >
              <option value="">ทุกบทบาท (Roles)</option>
              <option value="student">นิสิต (Student)</option>
              <option value="officer">เจ้าหน้าที่ (Officer)</option>
              <option value="admin">ผู้ดูแลระบบ (Admin)</option>
              <option value="superadmin">ผู้ดูแลระบบสูงสุด (Super Admin)</option>
              <option value="staff">บุคลากร (Staff)</option>
            </select>
          </div>

          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <select
              value={facultyFilter}
              onChange={handleFacultyFilter}
              className="w-full pl-12 pr-4 py-2.5 bg-muted/50 border-none ring-1 ring-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 appearance-none outline-none text-sm font-bold"
            >
              <option value="">ทุกหน่วยงาน/คณะ</option>
              {faculties.map(fac => (
                <option key={fac.faculty_code} value={fac.faculty_code}>{fac.faculty_name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-[1.5rem] border border-border shadow-inner bg-card mb-6">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">ผู้ใช้งาน</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">อีเมล</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">บทบาท</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">หน่วยงาน/คณะ</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      <span className="text-xs font-black uppercase tracking-tighter text-muted-foreground">กำลังโหลดข้อมูล...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-all duration-200 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden border border-primary/20">
                          {u.profile_image ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={getImageUrl(u.profile_image)}
                                alt={u.username}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <Users size={18} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-foreground leading-tight">
                            {u.firstname} {u.lastname}
                          </p>
                          <p className="text-[10px] font-medium text-muted-foreground uppercase opacity-70 tracking-tighter">@{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm font-medium text-muted-foreground">
                        <Mail size={14} className="mr-2 opacity-50" />
                        {u.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(u.role)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-xs font-bold text-foreground/80 uppercase tracking-tight">
                        <Building2 size={14} className="mr-2 text-indigo-500 opacity-70" />
                        {u.faculty_name || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-2 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-xl transition-all"
                          title="แก้ไขรายละเอียด"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(u)}
                          className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-xl transition-all"
                          title="ลบผู้ใช้งาน"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center italic text-muted-foreground">
                    ไม่พบข้อมูลผู้ใช้งานที่ตรงกับเงื่อนไข
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Rows per page */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">แสดง</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-muted/50 border border-border rounded-lg text-xs font-bold py-1 px-2 outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">รายการต่อหน้า</span>
            </div>
            <div className="h-4 w-px bg-border mx-2 hidden md:block" />
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
               กำลังแสดง {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalCount)} จากทั้งหมด {totalCount} รายการ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
              className="rounded-xl px-3 py-5 border-border/60 hover:bg-muted transition-all"
            >
              <ChevronLeft size={16} />
            </Button>
            
            <div className="flex items-center gap-1">
              {getPageNumbers().map((p, idx) => (
                p === '...' ? (
                  <span key={`ellipsis-${idx}`} className="w-9 text-center text-muted-foreground font-black">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${currentPage === p
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'border border-border/40 text-muted-foreground hover:bg-muted font-black'
                      }`}
                  >
                    {p}
                  </button>
                )
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || loading}
              className="rounded-xl px-3 py-5 border-border/60 hover:bg-muted transition-all"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </Card>

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <Card className="relative z-10 w-full max-w-lg p-0 border-none shadow-2xl overflow-hidden rounded-[2.5rem] animate-in zoom-in-95 duration-300">
            <div className="bg-primary p-8 text-primary-foreground flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black italic flex items-center uppercase tracking-tighter">
                  <Edit2 className="mr-3" size={24} /> Edit User Permissions
                </h3>
                <p className="text-primary-foreground/70 text-[10px] font-black uppercase tracking-widest mt-1">ID: #{selectedUser?.id} | {selectedUser?.email}</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-2xl transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">ชื่อ (First Name)</label>
                  <Input
                    value={editFormData.firstname}
                    onChange={(e) => setEditFormData({ ...editFormData, firstname: e.target.value })}
                    className="bg-muted/30 border-none ring-1 ring-border rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">นามสกุล (Last Name)</label>
                  <Input
                    value={editFormData.lastname}
                    onChange={(e) => setEditFormData({ ...editFormData, lastname: e.target.value })}
                    className="bg-muted/30 border-none ring-1 ring-border rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Display Name / Username</label>
                <Input
                  value={editFormData.username}
                  onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                  className="bg-muted/30 border-none ring-1 ring-border rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center ml-1">
                  <Shield size={14} className="mr-2" /> กำหนดบทบาทในระบบ
                </label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  className="w-full px-4 py-3 bg-muted/50 border-none ring-1 ring-border rounded-2xl font-bold text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
                  required
                >
                  <option value="student">นิสิต (Student)</option>
                  <option value="officer">เจ้าหน้าที่ (Officer)</option>
                  <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                  <option value="superadmin">Super Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center ml-1">
                  <Building2 size={14} className="mr-2" /> สังกัดหน่วยงาน/คณะ
                </label>
                <select
                  value={editFormData.faculty_code}
                  onChange={(e) => setEditFormData({ ...editFormData, faculty_code: e.target.value })}
                  className="w-full px-4 py-3 bg-muted/50 border-none ring-1 ring-border rounded-2xl font-bold text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="">ไม่ระบุสังกัด</option>
                  {faculties.map(fac => (
                    <option key={fac.faculty_code} value={fac.faculty_code}>{fac.faculty_name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
                >
                  บันทึกการเปลี่ยนแปลง
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="ลบผู้ใช้งาน?"
        message={`คุณแน่ใจหรือไม่ที่จะลบบัญชีผู้ใช้ ${selectedUser?.email}? การดำเนินการนี้ไม่สามารถย้อนกลับได้`}
        type="danger"
      />
    </div>
  );
}
