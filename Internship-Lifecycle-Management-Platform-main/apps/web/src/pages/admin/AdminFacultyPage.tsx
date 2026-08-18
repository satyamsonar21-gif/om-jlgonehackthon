import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { BookOpen, Users, Mail, Eye } from 'lucide-react';

interface FacultyMember {
  id: string;
  name: string;
  dept: string;
  email: string;
  assignedCohort: number;
  atRiskCount: number;
  designation: string;
}

const facultyData: FacultyMember[] = [
  { id: '1', name: 'Dr. Rajesh Kumar', dept: 'Computer Science & Engineering', email: 'rajesh.kumar@university.edu', assignedCohort: 42, atRiskCount: 3, designation: 'Associate Professor' },
  { id: '2', name: 'Dr. Sunita Rao', dept: 'Information Technology', email: 'sunita.rao@university.edu', assignedCohort: 38, atRiskCount: 1, designation: 'Professor & HOD' },
  { id: '3', name: 'Prof. Anand Joshi', dept: 'Electronics & Communication', email: 'anand.joshi@university.edu', assignedCohort: 35, atRiskCount: 0, designation: 'Assistant Professor' },
  { id: '4', name: 'Dr. Meera Nambiar', dept: 'Data Science & AI', email: 'meera.n@university.edu', assignedCohort: 30, atRiskCount: 2, designation: 'Associate Professor' },
];

export default function AdminFacultyPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const columns = [
    {
      key: 'name',
      header: 'Faculty Guide Name',
      sortable: true,
      render: (row: FacultyMember) => (
        <div>
          <div className="font-bold text-slate-900">{row.name}</div>
          <div className="text-[11px] font-mono text-slate-400">{row.designation}</div>
        </div>
      ),
    },
    {
      key: 'dept',
      header: 'Department',
      render: (row: FacultyMember) => <span className="text-slate-700 font-medium">{row.dept}</span>,
    },
    {
      key: 'email',
      header: 'Email',
      render: (row: FacultyMember) => <span className="font-mono text-slate-500">{row.email}</span>,
    },
    {
      key: 'assignedCohort',
      header: 'Supervised Cohort',
      sortable: true,
      render: (row: FacultyMember) => (
        <span className="font-mono font-bold text-slate-900">{row.assignedCohort} Students</span>
      ),
    },
    {
      key: 'atRiskCount',
      header: 'Exceptions',
      render: (row: FacultyMember) =>
        row.atRiskCount > 0 ? (
          <Badge variant="danger" size="sm">
            {row.atRiskCount} Flagged
          </Badge>
        ) : (
          <Badge variant="success" size="sm">
            All On Track
          </Badge>
        ),
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Faculty Guides Registry"
        subtitle="Supervising academic guides and department cohort assignments"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Academic Faculty Directory</h2>
            <p className="text-xs text-slate-500 font-mono">28 total verified academic guides</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={facultyData}
          searchKey="name"
          searchPlaceholder="Search faculty by name or department..."
        />
      </div>
    </div>
  );
}
