import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight,
  Wifi,
  Building2,
  CalendarCheck2,
  Fingerprint
} from 'lucide-react';
import { toast } from 'sonner';

interface AttendanceRecord {
  dateKey: string; // YYYY-MM-DD
  formattedDate: string;
  dayName: string;
  checkIn: string;
  checkOut: string;
  hours: string;
  mode: string;
  locationDetails: string;
  ipAddress: string;
  gpsCoords: string;
  status: 'PRESENT' | 'HALF_DAY' | 'APPROVED_LEAVE' | 'ABSENT';
  verifiedBy: string;
}

const attendanceDatabase: Record<string, AttendanceRecord> = {
  '2026-07-28': { dateKey: '2026-07-28', formattedDate: '28 Jul 2026', dayName: 'Tuesday', checkIn: '09:12 AM', checkOut: '05:30 PM', hours: '8h 18m', mode: 'Remote (IP Verified)', locationDetails: 'Home Office / Authorized VPN Gateway', ipAddress: '103.21.244.112 (TechCorp Secured)', gpsCoords: '12.9716° N, 77.5946° E (Bangalore)', status: 'PRESENT', verifiedBy: 'Siddharth Nambiar' },
  '2026-07-27': { dateKey: '2026-07-27', formattedDate: '27 Jul 2026', dayName: 'Monday', checkIn: '09:05 AM', checkOut: '05:15 PM', hours: '8h 10m', mode: 'Office (Biometric)', locationDetails: 'TechCorp Tower B, 4th Floor, Electronic City', ipAddress: '172.16.4.88 (Campus Intranet)', gpsCoords: '12.8399° N, 77.6770° E (TechCorp Campus)', status: 'PRESENT', verifiedBy: 'Biometric Gate Sensor 04' },
  '2026-07-26': { dateKey: '2026-07-26', formattedDate: '26 Jul 2026', dayName: 'Sunday', checkIn: '—', checkOut: '—', hours: '0h 0m', mode: 'Weekend Off', locationDetails: 'Scheduled Institutional Holiday', ipAddress: 'N/A', gpsCoords: 'N/A', status: 'APPROVED_LEAVE', verifiedBy: 'System Calendar' },
  '2026-07-25': { dateKey: '2026-07-25', formattedDate: '25 Jul 2026', dayName: 'Saturday', checkIn: '09:30 AM', checkOut: '01:30 PM', hours: '4h 00m', mode: 'Office (Biometric)', locationDetails: 'TechCorp Hackathon & Sprint Retro Room', ipAddress: '172.16.4.88', gpsCoords: '12.8399° N, 77.6770° E', status: 'HALF_DAY', verifiedBy: 'Siddharth Nambiar' },
  '2026-07-24': { dateKey: '2026-07-24', formattedDate: '24 Jul 2026', dayName: 'Friday', checkIn: '09:00 AM', checkOut: '05:00 PM', hours: '8h 00m', mode: 'Remote (IP Verified)', locationDetails: 'Home Office / TechCorp VPN', ipAddress: '103.21.244.112', gpsCoords: '12.9716° N, 77.5946° E', status: 'PRESENT', verifiedBy: 'Siddharth Nambiar' },
  '2026-07-23': { dateKey: '2026-07-23', formattedDate: '23 Jul 2026', dayName: 'Thursday', checkIn: '09:15 AM', checkOut: '05:30 PM', hours: '8h 15m', mode: 'Office (Biometric)', locationDetails: 'TechCorp Tower B, Floor 4', ipAddress: '172.16.4.88', gpsCoords: '12.8399° N, 77.6770° E', status: 'PRESENT', verifiedBy: 'Biometric Gate Sensor 04' },
  '2026-07-22': { dateKey: '2026-07-22', formattedDate: '22 Jul 2026', dayName: 'Wednesday', checkIn: '09:10 AM', checkOut: '05:25 PM', hours: '8h 15m', mode: 'Office (Biometric)', locationDetails: 'TechCorp Tower B, Floor 4', ipAddress: '172.16.4.88', gpsCoords: '12.8399° N, 77.6770° E', status: 'PRESENT', verifiedBy: 'Biometric Gate Sensor 04' },
  '2026-07-21': { dateKey: '2026-07-21', formattedDate: '21 Jul 2026', dayName: 'Tuesday', checkIn: '09:20 AM', checkOut: '05:40 PM', hours: '8h 20m', mode: 'Remote (IP Verified)', locationDetails: 'Home Office / TechCorp VPN', ipAddress: '103.21.244.112', gpsCoords: '12.9716° N, 77.5946° E', status: 'PRESENT', verifiedBy: 'Siddharth Nambiar' },
  '2026-07-20': { dateKey: '2026-07-20', formattedDate: '20 Jul 2026', dayName: 'Monday', checkIn: '09:00 AM', checkOut: '05:10 PM', hours: '8h 10m', mode: 'Office (Biometric)', locationDetails: 'TechCorp Tower B, Floor 4', ipAddress: '172.16.4.88', gpsCoords: '12.8399° N, 77.6770° E', status: 'PRESENT', verifiedBy: 'Biometric Gate Sensor 04' },
  '2026-07-17': { dateKey: '2026-07-17', formattedDate: '17 Jul 2026', dayName: 'Friday', checkIn: '09:15 AM', checkOut: '05:30 PM', hours: '8h 15m', mode: 'Remote (IP Verified)', locationDetails: 'Home Office / TechCorp VPN', ipAddress: '103.21.244.112', gpsCoords: '12.9716° N, 77.5946° E', status: 'PRESENT', verifiedBy: 'Siddharth Nambiar' },
  '2026-07-16': { dateKey: '2026-07-16', formattedDate: '16 Jul 2026', dayName: 'Thursday', checkIn: '—', checkOut: '—', hours: '0h 0m', mode: 'Excused Medical Leave', locationDetails: 'Approved Doctor Appointment by Dr. Rajesh Kumar', ipAddress: 'N/A', gpsCoords: 'N/A', status: 'APPROVED_LEAVE', verifiedBy: 'Dr. Rajesh Kumar (Faculty)' },
  '2026-07-15': { dateKey: '2026-07-15', formattedDate: '15 Jul 2026', dayName: 'Wednesday', checkIn: '09:05 AM', checkOut: '05:15 PM', hours: '8h 10m', mode: 'Office (Biometric)', locationDetails: 'TechCorp Tower B, Floor 4', ipAddress: '172.16.4.88', gpsCoords: '12.8399° N, 77.6770° E', status: 'PRESENT', verifiedBy: 'Biometric Gate Sensor 04' },
};

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState<string>('2026-07-28');
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(true);
  const [lastActionTime, setLastActionTime] = useState<string>('09:12 AM');

  const record = attendanceDatabase[selectedDate] || {
    dateKey: selectedDate,
    formattedDate: selectedDate,
    dayName: 'Working Day',
    checkIn: '09:00 AM',
    checkOut: '05:00 PM',
    hours: '8h 00m',
    mode: 'Office (Biometric)',
    locationDetails: 'TechCorp Technology Campus',
    ipAddress: '172.16.4.88',
    gpsCoords: '12.8399° N, 77.6770° E',
    status: 'PRESENT',
    verifiedBy: 'Biometric Scanner Gate 02'
  };

  const handleToggleCheckIn = () => {
    if (isCheckedIn) {
      setIsCheckedIn(false);
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastActionTime(time);
      toast.success(`Clocked Out at ${time}. Today's work session logged!`);
    } else {
      setIsCheckedIn(true);
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastActionTime(time);
      toast.success(`Clocked In at ${time}. Geolocation and IP verified!`);
    }
  };

  // Calendar dates for July 2026 (sample selection)
  const calendarDays = [
    { day: 1, dateKey: '2026-07-01', status: 'PRESENT' },
    { day: 2, dateKey: '2026-07-02', status: 'PRESENT' },
    { day: 3, dateKey: '2026-07-03', status: 'PRESENT' },
    { day: 4, dateKey: '2026-07-04', status: 'HALF_DAY' },
    { day: 5, dateKey: '2026-07-05', status: 'WEEKEND' },
    { day: 6, dateKey: '2026-07-06', status: 'PRESENT' },
    { day: 7, dateKey: '2026-07-07', status: 'PRESENT' },
    { day: 8, dateKey: '2026-07-08', status: 'PRESENT' },
    { day: 9, dateKey: '2026-07-09', status: 'PRESENT' },
    { day: 10, dateKey: '2026-07-10', status: 'PRESENT' },
    { day: 11, dateKey: '2026-07-11', status: 'HALF_DAY' },
    { day: 12, dateKey: '2026-07-12', status: 'WEEKEND' },
    { day: 13, dateKey: '2026-07-13', status: 'PRESENT' },
    { day: 14, dateKey: '2026-07-14', status: 'PRESENT' },
    { day: 15, dateKey: '2026-07-15', status: 'PRESENT' },
    { day: 16, dateKey: '2026-07-16', status: 'APPROVED_LEAVE' },
    { day: 17, dateKey: '2026-07-17', status: 'PRESENT' },
    { day: 18, dateKey: '2026-07-18', status: 'HALF_DAY' },
    { day: 19, dateKey: '2026-07-19', status: 'WEEKEND' },
    { day: 20, dateKey: '2026-07-20', status: 'PRESENT' },
    { day: 21, dateKey: '2026-07-21', status: 'PRESENT' },
    { day: 22, dateKey: '2026-07-22', status: 'PRESENT' },
    { day: 23, dateKey: '2026-07-23', status: 'PRESENT' },
    { day: 24, dateKey: '2026-07-24', status: 'PRESENT' },
    { day: 25, dateKey: '2026-07-25', status: 'HALF_DAY' },
    { day: 26, dateKey: '2026-07-26', status: 'WEEKEND' },
    { day: 27, dateKey: '2026-07-27', status: 'PRESENT' },
    { day: 28, dateKey: '2026-07-28', status: 'PRESENT' },
  ];

  return (
    <div className="min-h-full pb-16" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header 
        title="Attendance & Geolocation Clock-in" 
        subtitle="Date-wise industrial attendance telemetry & cryptographic location proof" 
      />
      
      <main className="max-w-6xl mx-auto p-6 md:p-8 space-y-6">
        {/* Top KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl border shadow-sm space-y-2" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Compliance Rate</span>
            <div className="text-3xl font-extrabold font-mono text-emerald-600">92.5%</div>
            <span className="text-[11px] font-mono font-semibold text-emerald-700 block">Institutional Min: 75%</span>
          </div>

          <div className="p-5 rounded-2xl border shadow-sm space-y-2" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Days Clocked</span>
            <div className="text-3xl font-extrabold font-mono" style={{ color: 'var(--text)' }}>23 / 25 Days</div>
            <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>1 Excused Leave · 1 Half Day</span>
          </div>

          <div className="p-5 rounded-2xl border shadow-sm flex flex-col justify-between" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div>
              <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Today's Session</span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2.5 h-2.5 rounded-full ${isCheckedIn ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="font-mono font-bold text-sm" style={{ color: 'var(--text)' }}>
                  {isCheckedIn ? `Clocked In (${lastActionTime})` : `Clocked Out (${lastActionTime})`}
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleCheckIn}
              className={`w-full mt-3 py-2 rounded-xl text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                isCheckedIn
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Fingerprint size={14} />
              <span>{isCheckedIn ? 'Clock Out for Today' : 'Clock In Now'}</span>
            </button>
          </div>
        </div>

        {/* Date-Wise Inspector Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive Calendar Selector */}
          <div 
            className="lg:col-span-6 rounded-2xl border shadow-sm p-6 space-y-4"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Select Specific Date to Inspect</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Click any date to see exact location and check-in times</p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800" style={{ color: 'var(--text)' }}>
                July 2026
              </span>
            </div>

            {/* Date Grid */}
            <div className="grid grid-cols-7 gap-2 pt-1 text-center">
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
                <span key={d} className="text-[11px] font-mono font-bold text-slate-400 pb-1">{d}</span>
              ))}

              {calendarDays.map((item) => {
                const isSelected = selectedDate === item.dateKey;
                const isPresent = item.status === 'PRESENT';
                const isHalfDay = item.status === 'HALF_DAY';
                const isLeave = item.status === 'APPROVED_LEAVE';
                const isWeekend = item.status === 'WEEKEND';

                return (
                  <button
                    key={item.day}
                    onClick={() => {
                      setSelectedDate(item.dateKey);
                      toast.info(`Viewing attendance dossier for ${item.dateKey}`);
                    }}
                    className={`h-10 rounded-xl font-mono text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#C2410C] text-white shadow-md ring-2 ring-[#C2410C]/40'
                        : isPresent
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                        : isHalfDay
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100'
                        : isLeave
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-60'
                    }`}
                  >
                    <span>{item.day}</span>
                    {isPresent && !isSelected && <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />}
                    {isHalfDay && !isSelected && <span className="w-1 h-1 rounded-full bg-amber-500 mt-0.5" />}
                    {isLeave && !isSelected && <span className="w-1 h-1 rounded-full bg-blue-500 mt-0.5" />}
                  </button>
                );
              })}
            </div>

            {/* Status Legend */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t text-[11px] font-mono" style={{ borderColor: 'var(--border)' }}>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Present</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Half Day</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Approved Leave</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400" /> Weekend</span>
            </div>
          </div>

          {/* Right: Selected Date Dossier & Location Details */}
          <div 
            className="lg:col-span-6 rounded-2xl border shadow-sm p-6 space-y-4"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2">
                <CalendarCheck2 className="w-5 h-5 text-[#C2410C]" />
                <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>
                  Dossier for {record.formattedDate}
                </h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                record.status === 'PRESENT' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300' :
                record.status === 'HALF_DAY' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300' :
                'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300'
              }`}>
                {record.status.replace('_', ' ')}
              </span>
            </div>

            {/* Detailed Timeline Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border bg-slate-50/70 dark:bg-slate-900/60" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Check-In Timestamp</span>
                  <span className="text-sm font-mono font-bold mt-1 block text-emerald-600">{record.checkIn}</span>
                </div>
                <div className="p-3.5 rounded-xl border bg-slate-50/70 dark:bg-slate-900/60" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Check-Out Timestamp</span>
                  <span className="text-sm font-mono font-bold mt-1 block" style={{ color: 'var(--text)' }}>{record.checkOut}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border space-y-2.5 bg-slate-50/70 dark:bg-slate-900/60" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border)' }}>
                  <span className="font-mono font-bold text-slate-500">Total Hours Clocked</span>
                  <span className="font-mono font-bold text-sm text-[#C2410C]">{record.hours}</span>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <Building2 size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold block" style={{ color: 'var(--text)' }}>{record.mode}</span>
                    <span className="text-[11px] opacity-75" style={{ color: 'var(--text-muted)' }}>{record.locationDetails}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <MapPin size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold block" style={{ color: 'var(--text)' }}>Geolocation Coordinates</span>
                    <span className="text-[11px] font-mono opacity-75" style={{ color: 'var(--text-muted)' }}>{record.gpsCoords}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <Wifi size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold block" style={{ color: 'var(--text)' }}>IP Network Verification</span>
                    <span className="text-[11px] font-mono opacity-75" style={{ color: 'var(--text-muted)' }}>{record.ipAddress}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border text-[11px] font-mono bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800">
                <span className="text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  Signed by: {record.verifiedBy}
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">100% Valid</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
