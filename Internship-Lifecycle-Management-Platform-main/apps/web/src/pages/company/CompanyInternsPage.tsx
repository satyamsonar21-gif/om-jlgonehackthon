import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Users, Eye, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';
import { demoStudents, Student } from '@/data/demo';

export const activeCompanyInternsData = demoStudents.map((s, idx) => ({
  ...s,
  projectTeam: idx % 2 === 0 ? 'Cloud Architecture Team' : 'Core Platform API Team',
  tasksCompleted: 8,
  totalTasks: 10,
  lastLog: s.lastLogDate,
}));

export default function CompanyInternsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const columns = [
    {
      key: 'name',
      header: 'Intern Name & PRN',
      sortable: true,
      render: (row: typeof activeCompanyInternsData[0]) => (
        <div>
          <div className="font-bold text-slate-900">{row.name}</div>
          <div className="text-[11px] font-mono text-slate-400">{row.roll} · {row.dept.split('&')[0]}</div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role & Project Team',
      sortable: true,
      render: (row: typeof activeCompanyInternsData[0]) => (
        <div>
          <div className="font-semibold text-slate-800">{row.role}</div>
          <div className="text-[11px] text-indigo-700 font-medium">{row.projectTeam}</div>
        </div>
      ),
    },
    {
      key: 'attendance',
      header: 'Attendance',
      sortable: true,
      render: (row: typeof activeCompanyInternsData[0]) => (
        <span className={`font-mono font-bold ${row.attendance < 75 ? 'text-rose-600' : 'text-slate-900'}`}>
          {row.attendance}%
        </span>
      ),
    },
    {
      key: 'tasksCompleted',
      header: 'Sprint Velocity',
      render: (row: typeof activeCompanyInternsData[0]) => (
        <div className="space-y-1 w-32">
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>{row.tasksCompleted}/{row.totalTasks} Tasks</span>
            <span className="font-bold">80%</span>
          </div>
          <Progress value={80} size="sm" variant={row.status === 'at_risk' ? 'danger' : 'primary'} />
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: typeof activeCompanyInternsData[0]) => <StatusBadge status={row.status === 'at_risk' ? 'AT_RISK' : 'ACTIVE'} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right' as const,
      render: (row: typeof activeCompanyInternsData[0]) => (
        <Link to={`/company/interns/${row.id}`}>
          <Button variant="outline" size="sm" leftIcon={<Eye size={12} />}>
            Evaluate
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Active Supervised Interns"
        subtitle="16 active interns allocated across 7 engineering project teams"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Intern Roster</h2>
            <p className="text-xs text-slate-500 font-mono">16 total active interns in Fall 2026 Batch</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={activeCompanyInternsData}
          searchKey="name"
          searchPlaceholder="Search interns by name, role, or team..."
        />
      </div>
    </div>
  );
}
