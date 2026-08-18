import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Users, Eye, AlertTriangle, ShieldCheck, Mail, Phone } from 'lucide-react';
import { demoStudents, Student } from '@/data/demo';

export const facultyCohortStudents = demoStudents;

export default function FacultyStudentsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [statusFilter, setStatusFilter] = useState<'all' | 'on_track' | 'watch' | 'at_risk'>('all');

  const filtered = statusFilter === 'all'
    ? demoStudents
    : demoStudents.filter((s) => s.status === statusFilter);

  const columns = [
    {
      key: 'name',
      header: 'Student Name & Roll',
      sortable: true,
      render: (row: Student) => (
        <div>
          <div className="font-bold text-slate-900">{row.name}</div>
          <div className="text-[11px] font-mono text-slate-400">{row.roll} · {row.dept.split('&')[0]}</div>
        </div>
      ),
    },
    {
      key: 'company',
      header: 'Host Organization & Role',
      sortable: true,
      render: (row: Student) => (
        <div>
          <div className="font-semibold text-slate-800">{row.company}</div>
          <div className="text-[11px] text-slate-500">{row.role}</div>
        </div>
      ),
    },
    {
      key: 'attendance',
      header: 'Attendance',
      sortable: true,
      render: (row: Student) => (
        <span
          className={`font-mono font-bold ${
            row.attendance < 75 ? 'text-rose-600' : row.attendance < 85 ? 'text-amber-600' : 'text-emerald-600'
          }`}
        >
          {row.attendance}%
        </span>
      ),
    },
    {
      key: 'score',
      header: 'Readiness Index',
      sortable: true,
      render: (row: Student) => (
        <span className="font-mono font-bold text-slate-900">{row.score} / 100</span>
      ),
    },
    {
      key: 'status',
      header: 'Compliance Status',
      render: (row: Student) => {
        const variant = row.status === 'at_risk' ? 'danger' : row.status === 'watch' ? 'warning' : 'success';
        const label = row.status === 'at_risk' ? 'At Risk' : row.status === 'watch' ? 'Watchlist' : 'On Track';
        return <Badge variant={variant} size="sm">{label}</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right' as const,
      render: (row: Student) => (
        <Link to={`/faculty/students/${row.id}`}>
          <Button variant="outline" size="sm" leftIcon={<Eye size={12} />}>
            View Dossier
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Supervised Student Cohort"
        subtitle="42 allocated students across accredited industry partner organizations"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Filter Pills Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Cohort ({demoStudents.length})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('on_track')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'on_track'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              On Track ({demoStudents.filter((s) => s.status === 'on_track').length})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('watch')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'watch'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Watchlist ({demoStudents.filter((s) => s.status === 'watch').length})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('at_risk')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'at_risk'
                  ? 'bg-rose-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              At Risk ({demoStudents.filter((s) => s.status === 'at_risk').length})
            </button>
          </div>

          <span className="text-xs font-mono text-slate-500">
            Showing {filtered.length} of {demoStudents.length} student records
          </span>
        </div>

        {/* Cohort Table */}
        <DataTable
          columns={columns}
          data={filtered}
          searchKey="name"
          searchPlaceholder="Search student by name, roll, company..."
        />
      </div>
    </div>
  );
}
