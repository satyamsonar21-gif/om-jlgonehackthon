import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/Badge';
import { Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  totalHours: string;
  status: 'PRESENT' | 'HALF_DAY' | 'LEAVE';
  verificationMethod: string;
}

const attendanceData: AttendanceRecord[] = [
  { id: '1', date: 'Jul 28, 2026', checkIn: '09:12 AM', checkOut: '05:30 PM', totalHours: '8.3 hrs', status: 'PRESENT', verificationMethod: 'Biometric Scanner #04' },
  { id: '2', date: 'Jul 27, 2026', checkIn: '09:05 AM', checkOut: '05:45 PM', totalHours: '8.6 hrs', status: 'PRESENT', verificationMethod: 'Biometric Scanner #04' },
  { id: '3', date: 'Jul 26, 2026', checkIn: '09:20 AM', checkOut: '05:30 PM', totalHours: '8.1 hrs', status: 'PRESENT', verificationMethod: 'Biometric Scanner #04' },
  { id: '4', date: 'Jul 25, 2026', checkIn: '09:30 AM', checkOut: '01:30 PM', totalHours: '4.0 hrs', status: 'HALF_DAY', verificationMethod: 'Biometric Scanner #04' },
  { id: '5', date: 'Jul 24, 2026', checkIn: '09:10 AM', checkOut: '05:30 PM', totalHours: '8.3 hrs', status: 'PRESENT', verificationMethod: 'Biometric Scanner #04' },
  { id: '6', date: 'Jul 23, 2026', checkIn: '09:15 AM', checkOut: '05:30 PM', totalHours: '8.2 hrs', status: 'PRESENT', verificationMethod: 'Biometric Scanner #04' },
];

export default function AttendancePage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};
  const [isCheckedIn, setIsCheckedIn] = useState(true);

  const handleClockToggle = () => {
    if (isCheckedIn) {
      setIsCheckedIn(false);
      toast.success('Clocked out at 05:30 PM. Total shift recorded: 8.3 hours.');
    } else {
      setIsCheckedIn(true);
      toast.success('Biometric Clock-In verified for today at 09:12 AM.');
    }
  };

  const columns = [
    {
      key: 'date',
      header: 'Date',
      render: (row: AttendanceRecord) => (
        <span className="font-mono font-semibold text-slate-800">{row.date}</span>
      ),
    },
    {
      key: 'checkIn',
      header: 'Check In',
      render: (row: AttendanceRecord) => <span className="font-mono text-slate-600">{row.checkIn}</span>,
    },
    {
      key: 'checkOut',
      header: 'Check Out',
      render: (row: AttendanceRecord) => <span className="font-mono text-slate-600">{row.checkOut}</span>,
    },
    {
      key: 'totalHours',
      header: 'Total Hours',
      render: (row: AttendanceRecord) => (
        <span className="font-mono font-bold text-slate-900">{row.totalHours}</span>
      ),
    },
    {
      key: 'verificationMethod',
      header: 'Method',
      render: (row: AttendanceRecord) => (
        <span className="text-slate-500 text-xs">{row.verificationMethod}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: AttendanceRecord) => <StatusBadge status={row.status} size="sm" />,
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Biometric Attendance"
        subtitle="Track presence compliance and verified daily clock-in timestamps"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Attendance Rate"
            value="95.0%"
            change="+2.4% vs last week"
            trend="up"
            sublabel="Above 75% requirement"
            icon={Calendar}
            iconColor="#16A34A"
          />
          <StatCard
            label="Days Present"
            value="23 / 25 Days"
            sublabel="Active Placement"
            icon={CheckCircle2}
            iconColor="#059669"
          />
          <StatCard
            label="Leaves Taken"
            value="1 Day"
            sublabel="Authorized by Mentor"
            icon={Clock}
            iconColor="#D97706"
          />
          <StatCard
            label="Compliance Status"
            value="Compliant"
            sublabel="No exceptions flagged"
            icon={CheckCircle2}
            iconColor="#16A34A"
          />
        </div>

        {/* Clock In / Out Banner */}
        <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center flex-shrink-0 font-bold">
              <Clock size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Today's Session Active</div>
              <div className="text-[11px] text-slate-500 font-mono">Clocked in today at 09:12 AM via Biometric terminal #04</div>
            </div>
          </div>

          <Button
            variant={isCheckedIn ? 'outline' : 'primary'}
            size="sm"
            onClick={handleClockToggle}
          >
            {isCheckedIn ? 'Clock Out for Today' : 'Clock In Now'}
          </Button>
        </Card>

        {/* Attendance Log Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Attendance Register</h3>
            <span className="text-xs font-mono text-slate-500">Academic Term 2026</span>
          </div>

          <DataTable
            columns={columns}
            data={attendanceData}
            searchKey="date"
            searchPlaceholder="Search dates..."
          />
        </div>
      </div>
    </div>
  );
}
