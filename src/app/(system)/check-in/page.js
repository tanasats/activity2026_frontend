'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  QrCode,
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  UserCheck,
  History
} from 'lucide-react';
import { activityService } from '@/services/activityService';
import { registrationService } from '@/services/registrationService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function CheckInPage() {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [history, setHistory] = useState([]);

  const scannerRef = useRef(null);
  const isProcessing = useRef(false);

  useEffect(() => {
    fetchActivities();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await activityService.getManageActivities();
      // Only active activities or ones that are open/approved
      const activeActivities = (data.rows || []).filter(a => a.status !== 'ยกเลิก' && a.status !== 'รออนุมัติ');
      setActivities(activeActivities);
    } catch (error) {
      toast.error('ไม่สามารถโหลดข้อมูลกิจกรรมได้');
    } finally {
      setLoading(false);
    }
  };

  const startScanner = () => {
    if (!selectedActivity) {
      toast.error('กรุณาเลือกกิจกรรมก่อนเริ่มสแกน');
      return;
    }

    setScanning(true);
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      }, false);

      scanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = scanner;
    }, 100);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().then(() => {
        setScanning(false);
        scannerRef.current = null;
      }).catch(err => {
        console.error("Failed to stop scanner", err);
        setScanning(false);
      });
    }
  };

  async function onScanSuccess(decodedText) {
    if (isProcessing.current) return;

    isProcessing.current = true;
    // Play a subtle beep if possible, or just visual feedback

    try {
      const result = await registrationService.checkIn(selectedActivity.id, decodedText);

      const checkInData = {
        name: result.studentName,
        code: result.studentCode,
        faculty: result.facultyName,
        time: new Date().toLocaleTimeString('th-TH'),
        success: true
      };

      setLastCheckIn(checkInData);
      setHistory(prev => [checkInData, ...prev].slice(0, 5));
      toast.success(`สำเร็จ: ${result.studentName}`);

      // Pause briefly before next scan
      setTimeout(() => {
        isProcessing.current = false;
        setLastCheckIn(null);
      }, 3000);

    } catch (error) {
      const msg = error.response?.data?.message || 'สแกนล้มเหลว';
      const studentName = error.response?.data?.studentName;

      setLastCheckIn({
        name: studentName || 'ไม่พบนิสิต',
        message: msg,
        success: false,
        time: new Date().toLocaleTimeString('th-TH')
      });

      toast.error(msg);

      setTimeout(() => {
        isProcessing.current = false;
        setLastCheckIn(null);
      }, 3000);
    }
  }

  function onScanFailure(error) {
    // Silent failure for QR scanning (it triggers constantly while looking for a code)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-muted-foreground animate-pulse font-medium">กำลังเตรียมระบบลงทะเบียนเข้าร่วม...</p>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center">
            <QrCode className="mr-3 text-primary" size={32} /> ลงทะเบียนเข้าร่วม (Scan QR)
          </h1>
          <p className="text-muted-foreground font-medium mt-1 italic">ใช้กล้องเว็บแคมสแกน QR Code ของนิสิตเพื่อลงทะเบียนเข้าร่วม</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Setup & Scanner */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border-border rounded-[2.5rem] bg-card/50 backdrop-blur-sm shadow-sm">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block ml-2">1. เลือกกิจกรรมที่ต้องการลงทะเบียนเข้าร่วม</label>
              <div className="relative group">
                <select
                  className="w-full pl-6 pr-12 py-4 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none appearance-none transition-all font-bold cursor-pointer hover:border-primary/50"
                  onChange={(e) => {
                    const act = activities.find(a => String(a.id) === e.target.value);
                    setSelectedActivity(act);
                    if (scanning) stopScanner();
                  }}
                  value={selectedActivity?.id || ''}
                >
                  <option value="" disabled>--- โปรดเลือกกิจกรรมที่รับผิดชอบ ---</option>
                  {activities.map(a => (
                    <option key={a.id} value={a.id}>{a.title} ({a.academic_year}/{a.semester})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-hover:text-primary transition-colors" size={20} />
              </div>
            </div>

            {selectedActivity && (
              <div className="mt-8 space-y-6 animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                      <Camera size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest">สถานะปัจจุบัน</p>
                      <p className="text-sm font-bold text-foreground">
                        {scanning ? 'เครื่องสแกนกำลังทำงาน...' : 'พร้อมเริ่มการสแกน'}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={scanning ? stopScanner : startScanner}
                    variant={scanning ? 'outline' : 'primary'}
                    className="rounded-xl px-6"
                  >
                    {scanning ? 'หยุดสแกน' : 'เริ่มสแกน QR'}
                  </Button>
                </div>

                <div
                  id="reader"
                  className={cn(
                    "w-full rounded-[2.5rem] overflow-hidden border-4 transition-all duration-300 relative",
                    scanning ? "border-primary shadow-2xl shadow-primary/10 opacity-100" : "border-muted bg-muted/20 opacity-50 pointer-events-none grayscale grayscale-0"
                  )}
                  style={{ minHeight: '300px' }}
                >
                  {!scanning && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-4">
                      <QrCode size={60} className="opacity-20 translate-y-2" />
                      <p className="font-black uppercase tracking-widest text-xs opacity-40 italic">กดปุ่ม "เริ่มสแกน QR" เพื่อเปิดกล้อง</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right: Feedback & History */}
        <div className="space-y-6">
          {/* Current Scan Result */}
          <div className="h-[280px]">
            {lastCheckIn ? (
              <Card className={cn(
                "h-full p-8 border-2 flex flex-col items-center justify-center text-center animate-in zoom-in-95 rounded-[3rem] transition-all duration-500",
                lastCheckIn.success
                  ? "border-emerald-500/50 bg-emerald-500/[0.03] shadow-2xl shadow-emerald-500/10"
                  : "border-rose-500/50 bg-rose-500/[0.03] shadow-2xl shadow-rose-500/10"
              )}>
                <div className={cn(
                  "w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl animate-bounce",
                  lastCheckIn.success ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                )}>
                  {lastCheckIn.success ? <CheckCircle2 size={40} /> : <AlertCircle size={40} />}
                </div>
                {lastCheckIn.success ? (
                  <>
                    <h3 className="text-xl font-black text-foreground mb-1">{lastCheckIn.name}</h3>
                    <p className="text-xs font-bold text-muted-foreground font-mono uppercase italic mb-4">{lastCheckIn.code}</p>
                    <div className="px-4 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                      ลงทะเบียนเข้าร่วมสำเร็จที่ {lastCheckIn.time}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-black text-rose-600 mb-2">ล้มเหลว</h3>
                    <p className="text-sm font-bold text-muted-foreground max-w-[200px] leading-relaxed italic">{lastCheckIn.message}</p>
                  </>
                )}
              </Card>
            ) : (
              <Card className="h-full border-dashed border-border p-8 flex flex-col items-center justify-center text-center rounded-[3rem] opacity-40 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-pulse" />
                <UserCheck size={48} className="text-muted-foreground mb-4 opacity-20" />
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest leading-relaxed">
                  รอรับข้อมูล<br />จากการสแกน...
                </p>
              </Card>
            )}
          </div>

          {/* History List */}
          <Card className="p-6 border-border rounded-[2.5rem]">
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-6 flex items-center">
              <History size={14} className="mr-2" /> ประวัติการสแกนล่าสุด
            </h3>
            <div className="space-y-4">
              {history.length > 0 ? history.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-2xl animate-in slide-in-from-right-4 duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0",
                      h.success ? "bg-emerald-500" : "bg-rose-500"
                    )}>
                      {h.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    </div>
                    <div>
                      <p className="text-xs font-black text-foreground truncate max-w-[120px]">{h.name}</p>
                      <p className="text-[9px] text-muted-foreground font-bold">{h.time}</p>
                    </div>
                  </div>
                  {h.success && (
                    <div className="text-[9px] font-black text-emerald-600 italic">SUCCESS</div>
                  )}
                </div>
              )) : (
                <div className="py-8 text-center text-muted-foreground italic text-xs opacity-50">
                  ยังไม่มีประวัติการสแกน
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
