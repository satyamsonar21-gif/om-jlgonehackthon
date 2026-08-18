import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Users, CheckCircle2, XCircle, Eye, Mail, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface CandidateApplication {
  id: string;
  name: string;
  roll: string;
  dept: string;
  cgpa: number;
  role: string;
  appliedDate: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  pitch: string;
}

const initialApplications: CandidateApplication[] = [
  { id: '1', name: 'Priya Sharma', roll: '20CS101', dept: 'Computer Science', cgpa: 8.9, role: 'Full Stack Web Developer', appliedDate: 'Jun 10, 2026', status: 'ACCEPTED', pitch: 'Authored multiple fullstack React/Node.js projects with Redis and Postgres. Active contributor to open-source.' },
  { id: '2', name: 'Rahul Patel', roll: '20CS102', dept: 'Information Tech', cgpa: 8.4, role: 'Full Stack Web Developer', appliedDate: 'Jun 12, 2026', status: 'PENDING', pitch: 'Strong foundations in Go microservices and gRPC API design.' },
  { id: '3', name: 'Sneha Gupta', roll: '20CS106', dept: 'Computer Science', cgpa: 8.7, role: 'UI/UX Product Designer', appliedDate: 'Jun 14, 2026', status: 'PENDING', pitch: 'Experienced in Figma design token systems and WCAG accessibility standards.' },
  { id: '4', name: 'Amit Kumar', roll: '20CS105', dept: 'Computer Science', cgpa: 9.1, role: 'Full Stack Web Developer', appliedDate: 'Jun 15, 2026', status: 'PENDING', pitch: 'Deep expertise in database index benchmarking and PostgreSQL partition optimizations.' },
];

export default function CompanyApplicationsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [applications, setApplications] = useState<CandidateApplication[]>(initialApplications);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateApplication | null>(null);
  const [rejectTarget, setRejectTarget] = useState<CandidateApplication | null>(null);

  const handleAccept = (candidate: CandidateApplication) => {
    setApplications(
      applications.map((app) =>
        app.id === candidate.id ? { ...app, status: 'ACCEPTED' } : app
      )
    );
    setSelectedCandidate(null);
    toast.success(`Candidate ${candidate.name} accepted! Formal offer letter dispatched.`);
  };

  const handleReject = () => {
    if (!rejectTarget) return;

    setApplications(
      applications.map((app) =>
        app.id === rejectTarget.id ? { ...app, status: 'REJECTED' } : app
      )
    );
    setRejectTarget(null);
    setSelectedCandidate(null);
    toast.info(`Application for ${rejectTarget.name} updated to Rejected.`);
  };

  const columns = [
    {
      key: 'name',
      header: 'Applicant Name & PRN',
      sortable: true,
      render: (row: CandidateApplication) => (
        <div>
          <div className="font-bold text-slate-900">{row.name}</div>
          <div className="text-[11px] font-mono text-slate-400">{row.roll} · {row.dept}</div>
        </div>
      ),
    },
    {
      key: 'cgpa',
      header: 'CGPA',
      sortable: true,
      render: (row: CandidateApplication) => (
        <span className="font-mono font-bold text-slate-800">{row.cgpa}</span>
      ),
    },
    {
      key: 'role',
      header: 'Applied Position',
      render: (row: CandidateApplication) => (
        <span className="text-indigo-700 font-semibold text-xs">{row.role}</span>
      ),
    },
    {
      key: 'appliedDate',
      header: 'Applied Date',
      render: (row: CandidateApplication) => (
        <span className="font-mono text-slate-500">{row.appliedDate}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: CandidateApplication) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right' as const,
      render: (row: CandidateApplication) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedCandidate(row)}
          leftIcon={<Eye size={12} />}
        >
          Review Dossier
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Candidate Applications"
        subtitle="Review applicant dossiers and manage technical screening decisions"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Application Pipeline</h2>
            <p className="text-xs text-slate-500 font-mono">
              {applications.filter((a) => a.status === 'PENDING').length} applications awaiting decision
            </p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={applications}
          searchKey="name"
          searchPlaceholder="Search candidate by name, PRN, or role..."
        />
      </div>

      {/* Candidate Review Modal */}
      <Modal
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        title="Candidate Application Dossier"
        size="md"
      >
        {selectedCandidate && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">{selectedCandidate.name}</h3>
                <span className="font-mono font-bold text-indigo-700">CGPA: {selectedCandidate.cgpa}</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                PRN: {selectedCandidate.roll} · {selectedCandidate.dept}
              </div>
              <div className="text-xs font-semibold text-slate-800 pt-1">
                Applied For: {selectedCandidate.role}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold font-mono uppercase text-slate-500 block">Candidate Statement & Pitch</label>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white leading-relaxed text-slate-700">
                "{selectedCandidate.pitch}"
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                variant="danger"
                size="sm"
                onClick={() => setRejectTarget(selectedCandidate)}
                leftIcon={<XCircle size={14} />}
              >
                Reject
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => handleAccept(selectedCandidate)}
                leftIcon={<CheckCircle2 size={14} />}
              >
                Accept & Issue Offer
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={handleReject}
        title={`Reject application for ${rejectTarget?.name}?`}
        description={`This will notify ${rejectTarget?.name} that their application for ${rejectTarget?.role} was not selected for this batch.`}
        confirmText="Confirm Rejection"
        variant="danger"
      />
    </div>
  );
}
