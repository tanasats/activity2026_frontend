'use client';

import { useEffect, useState } from 'react';
import { reportService } from '@/services/reportService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileText, Download, Printer, Clock } from 'lucide-react';

export default function TranscriptPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        const transcriptData = await reportService.getTranscript();
        setData(transcriptData);
      } catch (error) {
        console.error('Failed to fetch transcript', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTranscript();
  }, []);

  const totalHours = data.reduce((acc, curr) => acc + curr.hours, 0);

  if (loading) return <div>กำลังโหลด...</div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">หนังสือรับรองการเข้าร่วมกิจกรรม</h2>
            <p className="text-gray-500 text-sm">ตรวจสอบและพิมพ์ใบทรานสคลิปกิจกรรมของคุณ</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center">
            <Download size={18} className="mr-2" /> PDF
          </Button>
          <Button onClick={() => window.print()} className="flex items-center">
            <Printer size={18} className="mr-2" /> พิมพ์
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-10">
          <h1 className="text-xl font-bold uppercase mb-1">Activity Transcript</h1>
          <p className="text-gray-500 text-sm italic">Mahasarakham University</p>
        </div>

        <table className="w-full mb-10">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="py-2 text-left font-bold text-sm uppercase">Activity Name</th>
              <th className="py-2 text-center font-bold text-sm uppercase">Date</th>
              <th className="py-2 text-right font-bold text-sm uppercase">Hours</th>
              <th className="py-2 text-right font-bold text-sm uppercase">Credits</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item, idx) => (
              <tr key={idx}>
                <td className="py-4 text-gray-900 font-medium">{item.title}</td>
                <td className="py-4 text-center text-gray-500 text-sm">
                  {new Date(item.activity_date).toLocaleDateString()}
                </td>
                <td className="py-4 text-right font-bold">{item.hours}</td>
                <td className="py-4 text-right font-bold text-blue-600">{item.credits}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-900">
              <td colSpan="2" className="py-4 font-bold text-lg uppercase">Total Hours Accumulated</td>
              <td colSpan="2" className="py-4 text-right font-bold text-2xl text-blue-600">{totalHours}</td>
            </tr>
          </tfoot>
        </table>

        {totalHours >= 100 ? (
          <div className="bg-green-50 border border-green-200 p-6 rounded-2xl flex items-center space-x-4">
            <div className="p-2 bg-green-500 text-white rounded-full">
              <Download size={20} />
            </div>
            <div>
              <p className="text-green-800 font-bold">คุณผ่านเงื่อนไขการสะสมชั่วโมงกิจกรรมครบ 100 ชั่วโมง!</p>
              <p className="text-green-600 text-sm">คุณสามารถขอรับหนังสือรับรองฉบับจริงได้ที่หน่วยกิจกรรมนิสิต</p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex items-center space-x-4">
            <div className="p-2 bg-amber-500 text-white rounded-full">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-amber-800 font-bold">ชั่วโมงกิจกรรมยังไม่ครบตามเงื่อนไข (ขาด {100 - totalHours} ชม.)</p>
              <p className="text-amber-600 text-sm">สะสมให้ครบ 100 ชั่วโมงเพื่อขอหนังสือรับรอง</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
