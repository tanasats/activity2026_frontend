import { AlertCircle, Lock } from 'lucide-react';
import { Button } from './ui/Button';
import { useRouter } from 'next/navigation';

export const RoleRestricted = ({ role }) => {
  const router = useRouter();

  const messages = {
    staff: "คุณเข้าสู่ระบบในฐานะเจ้าหน้าที่ (Staff) แต่ยังไม่ได้รับสิทธิ์ในการเข้าถึงส่วนการทำงานของระบบ โปรดติดต่อผู้ดูแลระบบเพื่อขออนุมัติสิทธิ์",
    guest: "คุณเข้าสู่ระบบในฐานะผู้มาเยือน (Guest) โปรดลงทะเบียนด้วยอีเมลมหาวิทยาลัย (@msu.ac.th) เพื่อใช้งานระบบในฐานะนิสิต หรือติดต่อเจ้าหน้าที่",
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <Lock size={40} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">ยังไม่ได้รับสิทธิ์เข้าใช้งาน</h3>
      <p className="max-w-md text-gray-500 mb-8 leading-relaxed">
        {messages[role] || "คุณยังไม่ได้รับสิทธิ์ในการเข้าถึงหน้านี้"}
      </p>
      <div className="flex space-x-4">
        <Button variant="outline" onClick={() => router.push('/profile')}>
          ดูโปรไฟล์ของคุณ
        </Button>
      </div>
    </div>
  );
};
