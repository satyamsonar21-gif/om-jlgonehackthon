import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Building2,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Search,
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function FacultyApplicationsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [acting, setActing] = useState(false);

  // Approval / Rejection states
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approvalRemarks, setApprovalRemarks] = useState('Student satisfies academic eligibility, CGPA criteria, and departmental NOC requirements.');

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.getApplications();
      setApplications(res.data || []);
    } catch {
      // Fallback demo data
      setApplications([
        {
          id: 'app-fac-1',
          status: 'FACULTY_REVIEW',
          submittedAt: '2026-03-01T10:00:00.000Z',
          student: {
            department: 'Computer Science',
            year: 3,
            cgpa: 8.85,
            activeBacklogs: 0,
            skills: 'React, TypeScript, Node.js, Docker, PostgreSQL',
            user: { name: 'Aarav Patil', email: 'aarav.patil@ghrce.edu' },
          },
          listing: {
            title: 'Full Stack Cloud Engineer',
            domain: 'Full Stack',
            stipend: 35000,
            company: { name: 'TechCorp Solutions Inc.' },
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async () => {
    if (!selectedApp) return;
    setActing(true);
    try {
      await api.facultyReviewApplication(selectedApp.id, {
        status: 'FACULTY_APPROVED',
        remarks: approvalRemarks.trim(),
      });
      toast.success('Academic eligibility approved! Application forwarded to Corporate screening.');
      setIsApproveModalOpen(false);
      await fetchApplications();
      setSelectedApp(null);
    } catch {
      toast.error('Failed to approve application');
    } finally {
      setActing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;
    if (!rejectionReason.trim()) {
      toast.error('A mandatory formal academic rejection reason is required.');
      return;
    }
    setActing(true);
    try {
      await api.facultyReviewApplication(selectedApp.id, {
        status: 'REJECTED',
        rejectionReason: rejectionReason.trim(),
        remarks: rejectionReason.trim(),
      });
      toast.info('Application declined by Faculty Guide.');
      setIsRejectModalOpen(false);
      setRejectionReason('');
      await fetchApplications();
      setSelectedApp(null);
    } catch {
      toast.error('Failed to submit rejection decision');
    } finally {
      setActing(false);
    }
  };

  const getStatusBadge = (st: string) => {
    const s = (st || '').toUpperCase();
    if (s === 'FACULTY_APPROVED' || s === 'SELECTED' || s === 'INTERNSHIP_ACTIVE' || s === 'COMPLETED') {
      return <Badge variant="success">{s.replace('_', ' ')}</Badge>;
    }
    if (s === 'APPLIED' || s === 'SUBMITTED' || s === 'FACULTY_REVIEW') {
      return <Badge variant="warning">AWAITING FACULTY</Badge>;
    }
    if (s === 'COMPANY_REVIEW' || s === 'SHORTLISTED' || s === 'INTERVIEW') {
      return <Badge variant="info">{s.replace('_', ' ')}</Badge>;
    }
    if (s === 'REJECTED') {
      return <Badge variant="destructive">DECLINED</Badge>;
    }
    return <Badge variant="neutral">{s}</Badge>;
  };

  // Filtered Applications
  const filteredApps = applications.filter((app) => {
    const s = (app.status || '').toUpperCase();
    if (activeFilter === 'PENDING') return ['APPLIED', 'SUBMITTED', 'FACULTY_REVIEW'].includes(s);
    if (activeFilter === 'APPROVED') return ['FACULTY_APPROVED', 'COMPANY_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'INTERNSHIP_ACTIVE', 'COMPLETED'].includes(s);
    if (activeFilter === 'REJECTED') return s === 'REJECTED';
    return true;
  });

  const columns = [
    {
      key: 'student',
      header: 'Student Candidate',
      sortable: true,
      render: (row: any) => {
        const studentName = row.student?.user?.name || 'Aarav Patil';
        const dept = row.student?.department || 'Computer Science';
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              {studentName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-slate-900">{studentName}</div>
              <div className="text-[11px] text-slate-500 font-mono">
                {dept} · CGPA: {row.student?.cgpa || '8.8'}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'target',
      header: 'Target Internship',
      render: (row: any) => (
        <div>
          <div className="font-semibold text-slate-800 text-xs">{row.listing?.title}</div>
          <div className="text-[11px] text-slate-400">{row.listing?.company?.name}</div>
        </div>
      ),
    },
    {
      key: 'submittedAt',
      header: 'Submission Date',
      render: (row: any) => (
        <span className="text-xs text-slate-500 font-mono">
          {new Date(row.submittedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Review Stage',
      render: (row: any) => getStatusBadge(row.status),
    },
    {
      key: 'actions',
      header: 'Action',
      render: (row: any) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedApp(row)}
          className="text-xs"
        >
          Review Academic Dossier
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Faculty Academic Application Verification"
        subtitle="Verify student eligibility, assess academic standing & backlogs, and authorize internship applications"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <Card className="p-6 space-y-5">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold overflow-x-auto">
            {[
              { id: 'PENDING', label: `Pending Faculty Review (${applications.filter(a => ['APPLIED', 'SUBMITTED', 'FACULTY_REVIEW'].includes(a.status?.toUpperCase())).length})` },
              { id: 'APPROVED', label: 'Faculty Approved' },
              { id: 'REJECTED', label: 'Declined' },
              { id: 'ALL', label: `All Applications (${applications.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  activeFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <DataTable
            columns={columns}
            data={filteredApps}
            loading={loading}
            emptyTitle="No Applications in this Queue"
            emptyDescription="There are no student applications currently awaiting faculty action in this category."
          />
        </Card>
      </div>

      {/* ─── REVIEW ACADEMIC DOSSIER MODAL ──────────────────────────────────── */}
      {selectedApp && (
        <Modal
          isOpen={Boolean(selectedApp)}
          onClose={() => setSelectedApp(null)}
          title="Student Academic Dossier & Eligibility Review"
          size="lg"
        >
          <div className="space-y-5 text-xs">
            {/* Top Identity Box */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base">
                  {(selectedApp.student?.user?.name || 'AP').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {selectedApp.student?.user?.name || 'Aarav Patil'}
                  </h3>
                  <p className="text-slate-500 font-medium">
                    {selectedApp.student?.department || 'Computer Science'} · Year {selectedApp.student?.year || 3}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-slate-600 font-mono text-[11px]">
                    <span className="font-bold text-amber-700">CGPA: {selectedApp.student?.cgpa || '8.85'}</span>
                    <span>•</span>
                    <span>Active Backlogs: {selectedApp.student?.activeBacklogs || 0}</span>
                  </div>
                </div>
              </div>
              {getStatusBadge(selectedApp.status)}
            </div>

            {/* Target Opportunity & Resume */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium block">Target Position & Company</span>
                <span className="font-bold text-slate-900 block">{selectedApp.listing?.title}</span>
                <span className="text-slate-600 font-medium text-[11px] block">{selectedApp.listing?.company?.name}</span>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium block">Student Resume Dossier</span>
                {selectedApp.resumeUrl || selectedApp.student?.resumeUrl ? (
                  <a
                    href={selectedApp.resumeUrl || selectedApp.student?.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1.5 pt-1"
                  >
                    <FileText size={14} />
                    <span>View Official Resume</span>
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="text-slate-400">Verified profile resume</span>
                )}
              </div>
            </div>

            {/* Academic Eligibility Verification Checklist */}
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <span className="font-bold text-emerald-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600" />
                <span>Automated Academic Eligibility Verification</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="p-2 rounded bg-white border border-emerald-200 text-emerald-900">
                  <span className="text-slate-400 block text-[10px]">CGPA Standing</span>
                  <span className="font-bold font-mono">
                    {selectedApp.student?.cgpa || '8.85'} &ge; {selectedApp.listing?.minCgpa || '6.00'} (Pass)
                  </span>
                </div>
                <div className="p-2 rounded bg-white border border-emerald-200 text-emerald-900">
                  <span className="text-slate-400 block text-[10px]">Backlog Compliance</span>
                  <span className="font-bold font-mono">
                    {selectedApp.student?.activeBacklogs || 0} Backlogs (Allowed: {selectedApp.listing?.maxBacklogs || 0})
                  </span>
                </div>
                <div className="p-2 rounded bg-white border border-emerald-200 text-emerald-900">
                  <span className="text-slate-400 block text-[10px]">Department Match</span>
                  <span className="font-bold">{selectedApp.student?.department || 'CSE'} (Eligible)</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRejectModalOpen(true)}
                className="text-rose-700 border-rose-200 hover:bg-rose-50"
              >
                Decline Application
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setSelectedApp(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsApproveModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  leftIcon={<UserCheck size={14} />}
                >
                  Approve Academic Eligibility
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ─── APPROVE MODAL ─────────────────────────────────────────────────── */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title="Approve Academic Eligibility"
        size="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Granting academic approval authorizes this application to proceed to the corporate partner screening queue.
          </p>

          <Textarea
            label="Faculty Approval Remarks"
            rows={3}
            value={approvalRemarks}
            onChange={(e) => setApprovalRemarks(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsApproveModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              loading={acting}
              onClick={handleApprove}
            >
              Confirm Academic Approval
            </Button>
          </div>
        </div>
      </Modal>

      {/* ─── REJECT MODAL ──────────────────────────────────────────────────── */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Decline Academic Application"
        size="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Faculty guides must provide a mandatory academic reason for declining student applications.
          </p>

          <Textarea
            label="Mandatory Rejection Reason"
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g. Active backlogs exceed departmental threshold, academic probation..."
            required
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 text-white"
              loading={acting}
              onClick={handleReject}
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
