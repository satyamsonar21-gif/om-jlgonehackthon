import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Calendar as CalendarIcon, CheckCircle2, Clock, MapPin, Sparkles, Check } from 'lucide-react';

const attendanceRecords = [
  { date: 'Today, 28 Jul 2026', checkIn: '09:12 AM', checkOut: '05:30 PM', mode: 'Remote (IP Verified)', status: 'PRESENT' },
  { date: 'Yesterday, 27 Jul 2026', checkIn: '09:05 AM', checkOut: '05:15 PM', mode: 'Office (Biometric)', status: 'PRESENT' },
  { date: '26 Jul 2026', checkIn: '09:30 AM', checkOut: '05:45 PM', mode: 'Office (Biometric)', status: 'PRESENT' },
  { date: '25 Jul 2026', checkIn: '09:00 AM', checkOut: '05:00 PM', mode: 'Remote (IP Verified)', status: 'PRESENT' },
  { date: '24 Jul 2026', checkIn: '09:15 AM', checkOut: '05:30 PM', mode: 'Office (Biometric)', status: 'PRESENT' },
];

export default function AttendancePage() {
  const [checkedIn, setCheckedIn] = useState(true);

  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="Attendance & Geolocation Clock-in" subtitle="Automated compliance tracking for industrial credits" />
      
      <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-medium">Compliance Rate</span>
            <div className="text-3xl font-extrabold font-mono text-emerald-700 mt-2">92.5%</div>
            <span className="text-[11px] text-emerald-700 font-mono font-semibold">Requirement: 75% Min</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-medium">Days Attended</span>
            <div className="text-3xl font-extrabold font-mono text-slate-900 mt-2">38 / 40</div>
            <span className="text-[11px] text-slate-500 font-mono font-medium">2 Excused Absences</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-xs text-slate-500 font-medium">Today's Check-in</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-mono font-bold text-sm text-emerald-800">Clocked In (09:12 AM)</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">TechCorp Network Verified</span>
          </div>
        </div>

        {/* Attendance Records Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Attendance Log History</h3>
            <span className="text-xs font-mono text-slate-400">Current Month</span>
          </div>

          <div className="divide-y divide-slate-100">
            {attendanceRecords.map((rec, i) => (
              <div key={i} className="py-3.5 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors px-2 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0D9488] flex items-center justify-center font-bold">
                    <CalendarIcon size={15} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{rec.date}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{rec.mode}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-slate-600 hidden sm:inline">{rec.checkIn} — {rec.checkOut}</span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {rec.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
