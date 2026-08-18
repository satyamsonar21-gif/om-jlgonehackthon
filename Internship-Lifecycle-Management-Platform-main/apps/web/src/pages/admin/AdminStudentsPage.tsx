import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Users, Eye, FileSpreadsheet, Plus } from 'lucide-react';
import { demoStudents, Student } from '@/data/demo';

export default function AdminStudentsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const columns = [
    {
      key: 'name',
      header: 'Student Name & PRN',
      sortable: true,
      render: (row: Student) => (
        <div>
          <div className="font-bold text-slate-900">{row.name}</div>
          <div className="text-[11px] font-mono text-slate-400">{row.roll} · {row.dept}</div>
        </div>
      ),
    },
    {
      key: 'company',
      header: 'Host Organization',
      sortable: true,
      render: (row: Student) => (
        <div>
          <div className="font-semibold text-slate-800">{row.company}</div>
          <div className="text-[11px] text-slate-500">{row.role}</div>
        </div>
      ),
    },
    {
      key: 'cgpa',
      header: 'CGPA',
      sortable: true,
      render: (row: Student) => <span className="font-mono font-bold text-slate-800">{row.cgpa}</span>,
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
            Dossier
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Student Registry"
        subtitle="Campus-wide student directory and internship compliance tracking"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Enrolled Students Database</h2>
            <p className="text-xs text-slate-500 font-mono">1,284 total registered undergraduate students</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={demoStudents}
          searchKey="name"
          searchPlaceholder="Search students by name, PRN, or organization..."
        />
      </div>
    </div>
  );
}
