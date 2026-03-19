import { Sarabun } from "next/font/google";
import "./globals.css";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-sarabun",
});

import { Toaster } from 'react-hot-toast';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const metadata = {
  title: "Activity Transcript System - MSU",
  description: "ระบบระบบบันทึกกิจกรรมและทรานสคลิปกิจกรรม มหาวิทยาลัยมหาสารคาม",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body
        className={`${sarabun.variable} font-sans antialiased`}
      >
        {children}
        <Toaster
          //position="top-right"
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Premium styling for all toasts
            className: 'font-sans',
            duration: 3000,
            style: {
              background: '#fff',
              color: '#0f172a',
              padding: '16px 24px',
              borderRadius: '12px',
              fontSize: '16px',
              //fontWeight: '600',
              boxShadow: '0 5px 10px -5px rgba(0, 0, 0, 0.30)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              maxWidth: '450px',
            },

            // Success Toast Style
            success: {
              icon: <CheckCircle2 size={20} className="text-blue-900" />,
              style: {
                borderLeft: '4px solid #10b981',
              },
            },

            // Error Toast Style
            error: {
              icon: <AlertCircle size={20} className="text-rose-500" />,
              style: {
                borderLeft: '4px solid #f43f5e',
              },
            },

            // Loading Toast Style
            loading: {
              style: {
                borderLeft: '4px solid #2563eb',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
