"use client"
import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { activityService } from '@/services/activityService';
import { adminService } from '@/services/adminService';
import { masterDataService } from '@/services/masterDataService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import {
  Plus,
  Check,
  X,
  AlertCircle,
  Layout,
  ShieldCheck,
  Settings2,
  Calendar,
  Clock,
  Briefcase,
  Users,
  LayoutGrid,
  Search,
  Filter,
  RotateCcw,
  InfoIcon,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

export default function ManagementPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuthStore();

  // Deletion State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterYear, setFilterYear] = useState('2569');
  const [filterSemester, setFilterSemester] = useState('1');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  // Master Data States
  const [agencies, setAgencies] = useState([]);
  const [types, setTypes] = useState([]);
  const [skills, setSkills] = useState([]);
  const [budgetSources, setBudgetSources] = useState([]);
  const [faculties, setFaculties] = useState([]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const response = await activityService.getManageActivities({
        page,
        limit,
        search: debouncedSearch,
        academicYear: filterYear,
        semester: filterSemester,
        status: filterStatus
      });
      setActivities(response.rows || []);
      setTotalItems(response.total || 0);
    } catch (error) {
      console.error('Failed to fetch activities', error);
      toast.error('โหลดข้อมูลกิจกรรมไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filterYear, filterSemester, filterStatus]);

  const fetchMasterData = async () => {
    try {
      const [agenciesData, typesData, skillsData, budgetSourcesData, facultiesData] = await Promise.all([
        masterDataService.getAgencies(),
        masterDataService.getActivityTypes(),
        masterDataService.getSkills(),
        masterDataService.getBudgetSources(),
        masterDataService.getFaculties()
      ]);
      setAgencies(agenciesData);
      setTypes(typesData);
      setSkills(skillsData);
      setBudgetSources(budgetSourcesData);
      setFaculties(facultiesData);
    } catch (error) {
      console.error('Failed to fetch master data', error);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleApprove = async (id) => {
    try {
      await adminService.approveActivity(id);
      fetchActivities();
      toast.success('อนุมัติกิจกรรมสำเร็จ');
    } catch (error) {
      toast.error('อนุมัติไม่สำเร็จ');
    }
  };

  const handleToggleVisibility = async (id, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'public' ? 'private' : 'public';
      await activityService.updateVisibility(id, nextStatus);
      fetchActivities();
      toast(`เปลี่ยนสถานะเป็น ${nextStatus === 'public' ? 'Public' : 'Private'} สำเร็จ`, {
        icon: <InfoIcon size={18} />,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'เปลี่ยนสถานะไม่สำเร็จ');
    }
  };

  const handleDelete = (id) => {
    setActivityToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!activityToDelete) return;
    try {
      setDeleting(true);
      await activityService.deleteActivity(activityToDelete);
      toast.success('ลบกิจกรรมสำเร็จ');
      fetchActivities();
      setIsDeleteModalOpen(false);
      setActivityToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'ไม่สามารถลบกิจกรรมได้');
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterYear('2569');
    setFilterSemester('1');
    setFilterStatus('all');
    setPage(1);
  };

  const totalPages = Math.ceil(totalItems / limit);

  if (loading && activities.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-muted-foreground font-black text-[10px] uppercase tracking-widest">กำลังเชื่อมต่อระบบจัดการ...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Badge variant="success" className="mb-2">OFFICER HUB</Badge>
          <h2 className="text-3xl font-black text-foreground tracking-tight">จัดการข้อมูลกิจกรรม</h2>
          <p className="text-muted-foreground">ควบคุม ตรวจสอบ และอนุมัติโครงการเพื่อนิสิต</p>
        </div>
        {user?.role === 'officer' && (
          <Link href="/manage/new">
            <Button className="py-2 px-4 rounded-[1.5rem] shadow-xl shadow-primary/20 flex items-center bg-primary text">
              <Plus size={18} className="mr-2" /> เพิ่มกิจกรรมใหม่
            </Button>
          </Link>
        )}
      </div>

      {/* Filters Section */}
      <Card className="p-6 border-border bg-card/50 backdrop-blur-sm shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 text-slate-900">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="ค้นหาชื่อกิจกรรม หรือรหัสกิจกรรม..."
              className="w-full bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl pl-12 pr-4 py-2.5 text-sm transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              className="w-full bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-sm transition-all outline-none appearance-none cursor-pointer"
              value={filterYear}
              onChange={(e) => { setFilterYear(e.target.value); setPage(1); }}
            >
              <option value="all">ทุกปีการศึกษา</option>
              <option value="2567">2567</option>
              <option value="2568">2568</option>
              <option value="2569">2569</option>
              <option value="2570">2570</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              <Calendar size={14} />
            </div>
          </div>

          <div className="relative">
            <select
              className="w-full bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-sm transition-all outline-none appearance-none cursor-pointer"
              value={filterSemester}
              onChange={(e) => { setFilterSemester(e.target.value); setPage(1); }}
            >
              <option value="all">ทุกภาคเรียน</option>
              <option value="1">ภาคเรียนที่ 1</option>
              <option value="2">ภาคเรียนที่ 2</option>
              <option value="3">ภาคเรียนที่ 3</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              <Clock size={14} />
            </div>
          </div>

          <div className="flex gap-2 lg:col-span-2">
            <div className="relative flex-1">
              <select
                className="w-full bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-sm transition-all outline-none appearance-none cursor-pointer"
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              >
                <option value="all">ทุกสถานะ</option>
                <option value="ขออนุมัติ">ขออนุมัติ</option>
                <option value="ดำเนินการ">ดำเนินการ</option>
                <option value="เสร็จสิ้น">เสร็จสิ้น</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <ShieldCheck size={14} />
              </div>
            </div>

            <Button
              variant="outline"
              onClick={clearFilters}
              className="p-2.5 rounded-xl hover:bg-muted transition-colors border-border shrink-0"
              title="ล้างตัวกรอง (ค่าเริ่มต้น: 2569/1)"
            >
              <RotateCcw size={18} />
            </Button>
          </div>
        </div>
      </Card>

      <Card className="border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-wider">ID / Code</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-wider">Activity Description</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-wider text-center">Hours</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-wider text-center">Enrollment</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-wider">Visibility</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="font-black uppercase tracking-widest text-xs italic opacity-40">กำลังโหลด...</p>
                    </div>
                  </td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 opacity-40">
                      <Search size={40} />
                      <p className="font-black uppercase tracking-widest text-xs italic">ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา</p>
                    </div>
                  </td>
                </tr>
              ) : activities.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-black text-primary text-xs">{item.activity_code || 'PENDING'}</p>
                    <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase italic">{item.owner_faculty_name}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                      <Link href={`/activities/${item.id}`}>{item.title}</Link>
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-[10px] font-medium text-muted-foreground uppercase">{item.agency_name}</span>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <span className="text-[10px] font-medium text-muted-foreground uppercase">{item.type_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center text-foreground">{item.hours}</td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center">
                      <span className={cn(
                        "text-sm tracking-tight",
                        item.registered_count >= item.max_participants && item.max_participants > 0 ? "text-red-500" : "text-foreground"
                      )}>
                        {item.registered_count || 0} / {item.max_participants || 0}
                      </span>
                      {item.max_participants > 0 && (
                        <div className="w-16 h-1 bg-muted rounded-full mt-1 overflow-hidden">
                          <div
                            className={cn(
                              "h-full transition-all duration-500",
                              item.registered_count >= item.max_participants ? "bg-red-500" : "bg-primary"
                            )}
                            style={{ width: `${Math.min(100, ((item.registered_count || 0) / item.max_participants) * 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <button
                      disabled={!(user?.role === 'admin' || user?.role === 'superadmin' || (user?.role === 'officer' && item.owner_faculty_code === user.faculty_code))}
                      onClick={() => handleToggleVisibility(item.id, item.publish_status)}
                      className={cn(
                        "transition-all active:scale-95 disabled:opacity-100 disabled:cursor-default",
                        (user?.role === 'admin' || user?.role === 'superadmin' || (user?.role === 'officer' && item.owner_faculty_code === user.faculty_code)) && "hover:opacity-80"
                      )}
                    >
                      <Badge variant={item.publish_status === 'public' ? 'indigo' : 'slate'} className="text-[9px] uppercase cursor-pointer">
                        {item.publish_status}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant={item.status === 'ขออนุมัติ' ? 'warning' : 'success'}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <div className='flex flex-between'>
                      {user?.role !== 'student' && item.status === 'ขออนุมัติ' && (user?.role === 'admin' || user?.role === 'superadmin') && (
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                        >
                          Approve
                        </button>
                      )}

                      {(user?.role === 'admin' || user?.role === 'superadmin' || (user?.role === 'officer' && item.owner_faculty_code === user.faculty_code)) && (
                        <Link href={`/manage/${item.id}/edit`}>
                          <button className="p-2 text-muted-foreground hover:text-primary transition-colors" title="แก้ไขกิจกรรม">
                            <Edit2 size={18} />
                          </button>
                        </Link>
                      )}

                      {(user?.role === 'admin' || user?.role === 'superadmin' || (user?.role === 'officer' && parseInt(item.creator_id) === parseInt(user?.id))) && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                          title="ลบกิจกรรม"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}

                      {/* <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                      <Settings2 size={18} />
                    </button> */}

                    </div>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination UI */}
        {totalItems > 0 && (
          <div className="px-8 py-6 border-t border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              แสดง {activities.length} จากทั้งหมด {totalItems} รายการ
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1 || loading}
                className="h-8 w-8 p-0 rounded-lg"
              >
                <ChevronLeft size={16} />
              </Button>

              <div className="flex items-center space-x-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  // Show current page, first, last, and pages around current
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= page - 1 && pageNum <= page + 1)
                  ) {
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        disabled={loading}
                        className={cn(
                          "h-8 w-8 p-0 rounded-lg text-[10px] font-bold",
                          page === pageNum ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-muted"
                        )}
                      >
                        {pageNum}
                      </Button>
                    );
                  } else if (
                    pageNum === page - 2 ||
                    pageNum === page + 2
                  ) {
                    return <span key={pageNum} className="text-muted-foreground text-xs px-1">...</span>;
                  }
                  return null;
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages || loading}
                className="h-8 w-8 p-0 rounded-lg"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Custom Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="ยืนยันการลบกิจกรรม"
        message="คุณต้องการลบกิจกรรมนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้และข้อมูลที่เกี่ยวข้องทั้งหมดจะถูกลบออกจากระบบ"
        confirmText="ยืนยันการลบ"
        cancelText="ยกเลิก"
        type="warning"
        loading={deleting}
      />
    </div>
  );
}
