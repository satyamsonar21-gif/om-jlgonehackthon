import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { Building2, Calendar, Clock, ArrowRight, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface ApplicationItem {
  id: string;
  company: string;
  role: string;
  appliedDate: string;
  stipend: string;
  status: 'APPROVED' | 'UNDER_REVIEW' | 'REJECTED' | 'SELECTED';
  stage: string;
  feedback?: string;
}

const applicationsData: ApplicationItem[] = [
  {
    id: 'app-1',
    company: 'TechCorp Solutions',
    role: 'Full Stack Web Developer',
    appliedDate: 'Jun 10, 2026',
    stipend: '₹18,000/mo',
    status: 'SELECTED',
    stage: 'Stage 5 · Active Placement',
    feedback: 'Selected after technical interview round. Active internship in progress.',
  },
  {
    id: 'app-2',
    company: 'Innovatech Labs',
    role: 'Backend API Developer',
    appliedDate: 'Jun 12, 2026',
    stipend: '₹20,000/mo',
    status: 'APPROVED',
    stage: 'Faculty Clearance Granted',
    feedback: 'Academic department approved application dossier.',
  },
  {
    id: 'app-3',
    company: 'Analytics Pro Labs',
    role: 'Data Science & AI Intern',
    appliedDate: 'Jun 15, 2026',
    stipend: '₹20,000/mo',
    status: 'UNDER_REVIEW',
    stage: 'Candidate Screening',
    feedback: 'Dossier currently under review by hiring supervisor.',
  },
  {
    id: 'app-4',
    company: 'Creative Studio Inc',
    role: 'UI/UX Product Designer',
    appliedDate: 'Jun 05, 2026',
    stipend: '₹15,000/mo',
    status: 'REJECTED',
    stage: 'Positions Filled',
    feedback: 'Cohort openings reached capacity for Fall 2026 batch.',
  },
];

export default function ApplicationsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const columns = [
    {
      key: 'role',
      header: 'Role & Organization',
      render: (row: ApplicationItem) => (
        <div>
          <div className="font-bold text-slate-900">{row.role}</div>
          <div className="text-[11px] text-amber-700 font-semibold">{row.company}</div>
        </div>
      ),
    },
    {
      key: 'appliedDate',
      header: 'Applied Date',
      render: (row: ApplicationItem) => (
        <span className="font-mono text-slate-500">{row.appliedDate}</span>
      ),
    },
    {
      key: 'stipend',
      header: 'Stipend',
      render: (row: ApplicationItem) => (
        <span className="font-mono font-bold text-slate-800">{row.stipend}</span>
      ),
    },
    {
      key: 'stage',
      header: 'Lifecycle Stage',
      render: (row: ApplicationItem) => (
        <span className="text-slate-600 font-medium">{row.stage}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: ApplicationItem) => <StatusBadge status={row.status} size="sm" />,
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="My Applications"
        subtitle="Track submitted internship application dossiers and approval statuses"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Application History</h2>
            <p className="text-xs text-slate-500">4 total applications submitted this academic term</p>
          </div>

          <Link to="/student/internships">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight size={14} />}>
              Find More Internships
            </Button>
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={applicationsData}
          searchKey="company"
          searchPlaceholder="Search applications by company or role..."
        />
      </div>
    </div>
  );
}
