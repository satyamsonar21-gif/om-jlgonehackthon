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
  Users,
  CheckCircle2,
  XCircle,
  Eye,
  Mail,
  FileText,
  Loader2,
  Award,
  PhoneCall,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function CompanyApplicationsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'REVIEW' | 'SHORTLISTED' | 'INTERVIEW' | 'SELECTED' | 'REJECTED'>('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);

  // Rejection modal
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Interview modal
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');

  // Offer modal
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerStipend, setOfferStipend] = useState('35000');
  const [offerDesignation, setOfferDesignation] = useState('Full Stack Cloud Intern');

  // Internal private note
  const [privateNote, setPrivateNote] = useState('');
  const [acting, setActing] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.getApplications();
      setApplications(res.data || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleShortlist = async (appId: string) => {
    setActing(true);
    try {
      await api.companyReviewApplication(appId, {
        status: 'SHORTLISTED',
        remarks: 'Candidate shortlisted for technical screening round.',
      });
      toast.success('Candidate shortlisted successfully!');
      await fetchApplications();
      if (selectedCandidate?.id === appId) {
        setSelectedCandidate({ ...selectedCandidate, status: 'SHORTLISTED' });
      }
    } catch {
      toast.error('Failed to shortlist candidate');
    } finally {
      setActing(false);
    }
  };

  const handleMoveToInterview = async () => {
    if (!selectedCandidate) return;
    setActing(true);
    try {
      await api.companyReviewApplication(selectedCandidate.id, {
        status: 'INTERVIEW',
        interviewDate: interviewDate ? new Date(interviewDate).toISOString() : undefined,
        remarks: interviewNotes || 'Candidate scheduled for technical interview round.',
      });
      toast.success('Candidate moved to Interview stage!');
      setIsInterviewModalOpen(false);
      await fetchApplications();
      setSelectedCandidate({ ...selectedCandidate, status: 'INTERVIEW' });
    } catch {
      toast.error('Failed to schedule interview stage');
    } finally {
      setActing(false);
    }
  };

  const handleIssueOffer = async () => {
    if (!selectedCandidate) return;
    setActing(true);
    try {
      await api.companyReviewApplication(selectedCandidate.id, {
        status: 'SELECTED',
        stipend: Number(offerStipend),
        designation: offerDesignation,
        remarks: `Formal offer issued for ${offerDesignation} at ₹${offerStipend}/mo`,
      });
      toast.success('Candidate selected & binding offer letter dispatched!');
      setIsOfferModalOpen(false);
      await fetchApplications();
      setSelectedCandidate(null);
    } catch {
      toast.error('Failed to issue corporate offer');
    } finally {
      setActing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedCandidate) return;
    if (!rejectionReason.trim()) {
      toast.error('A formal rejection reason is mandatory.');
      return;
    }
    setActing(true);
    try {
      await api.companyReviewApplication(selectedCandidate.id, {
        status: 'REJECTED',
        rejectionReason: rejectionReason.trim(),
        remarks: rejectionReason.trim(),
      });
      toast.info('Application declined.');
      setIsRejectModalOpen(false);
      setRejectionReason('');
      await fetchApplications();
      setSelectedCandidate(null);
    } catch {
      toast.error('Failed to submit rejection decision');
    } finally {
      setActing(false);
    }
  };

  const handleSavePrivateNote = async () => {
    if (!selectedCandidate || !privateNote.trim()) return;
    setActing(true);
    try {
      await api.companyReviewApplication(selectedCandidate.id, {
        status: selectedCandidate.status,
        remarks: privateNote.trim(),
      });
      toast.success('Private review notes saved!');
      await fetchApplications();
      setSelectedCandidate({ ...selectedCandidate, companyRemarks: privateNote.trim() });
    } catch {
      toast.error('Failed to save private review notes');
    } finally {
      setActing(false);
    }
  };

  const getStatusBadge = (st: string) => {
    const s = (st || '').toUpperCase();
    if (s === 'SELECTED' || s === 'OFFER_ACCEPTED' || s === 'INTERNSHIP_ACTIVE' || s === 'COMPLETED') {
      return <Badge variant="success">{s.replace('_', ' ')}</Badge>;
    }
    if (s === 'SHORTLISTED' || s === 'INTERVIEW' || s === 'OFFER_ISSUED') {
      return <Badge variant="info">{s.replace('_', ' ')}</Badge>;
    }
    if (s === 'FACULTY_APPROVED' || s === 'COMPANY_REVIEW' || s === 'UNDER_REVIEW' || s === 'APPLIED') {
      return <Badge variant="warning">{s.replace('_', ' ')}</Badge>;
    }
    if (s === 'REJECTED') {
      return <Badge variant="destructive">DECLINED</Badge>;
    }
    return <Badge variant="neutral">{s}</Badge>;
  };

  // Filtered List
  const filteredApps = applications.filter((app) => {
    const s = (app.status || '').toUpperCase();
    if (activeFilter === 'REVIEW') return ['APPLIED', 'SUBMITTED', 'FACULTY_APPROVED', 'COMPANY_REVIEW', 'UNDER_REVIEW'].includes(s);
    if (activeFilter === 'SHORTLISTED') return s === 'SHORTLISTED';
    if (activeFilter === 'INTERVIEW') return s === 'INTERVIEW';
    if (activeFilter === 'SELECTED') return ['SELECTED', 'OFFER_ISSUED', 'OFFER_ACCEPTED', 'INTERNSHIP_ACTIVE', 'COMPLETED'].includes(s);
    if (activeFilter === 'REJECTED') return s === 'REJECTED';
    return true;
  });

  const columns = [
    {
      key: 'name',
      header: 'Applicant Dossier',
      sortable: true,
      render: (row: any) => {
        const studentName = row.student?.user?.name || 'Aarav Patil';
        const dept = row.student?.department || 'Computer Science';
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
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
      key: 'listing',
      header: 'Applied Position',
      render: (row: any) => (
        <div>
          <div className="font-semibold text-slate-800 text-xs">{row.listing?.title}</div>
          <div className="text-[11px] text-slate-400 font-mono">₹{(row.listing?.stipend || 0).toLocaleString()}/mo</div>
        </div>
      ),
    },
    {
      key: 'submittedAt',
      header: 'Applied Date',
      render: (row: any) => (
        <span className="text-xs text-slate-500 font-mono">
          {new Date(row.submittedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Pipeline Stage',
      render: (row: any) => getStatusBadge(row.status),
    },
    {
      key: 'actions',
      header: 'Action',
      render: (row: any) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedCandidate(row);
            setPrivateNote(row.companyRemarks || '');
          }}
          className="text-xs"
        >
          Review Candidate
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Corporate Candidate Review & Selection"
        subtitle="Screen candidate dossiers, compare technical competencies, record private evaluation notes, and issue binding offers"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <Card className="p-6 space-y-5">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold overflow-x-auto">
            {[
              { id: 'ALL', label: `All Candidates (${applications.length})` },
              { id: 'REVIEW', label: 'Under Screening' },
              { id: 'SHORTLISTED', label: 'Shortlisted' },
              { id: 'INTERVIEW', label: 'Interview Stage' },
              { id: 'SELECTED', label: 'Selected & Offers' },
              { id: 'REJECTED', label: 'Declined' },
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
            emptyTitle="No Candidates in this Pipeline Stage"
            emptyDescription="There are no candidate applications matching your active stage filter."
          />
        </Card>
      </div>

      {/* ─── CANDIDATE REVIEW MODAL ─────────────────────────────────────────── */}
      {selectedCandidate && (
        <Modal
          isOpen={Boolean(selectedCandidate)}
          onClose={() => setSelectedCandidate(null)}
          title="Candidate Evaluation Dossier"
          size="lg"
        >
          <div className="space-y-5 text-xs">
            {/* Top Identity Box */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base">
                  {(selectedCandidate.student?.user?.name || 'AP').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {selectedCandidate.student?.user?.name || 'Aarav Patil'}
                  </h3>
                  <p className="text-slate-500 font-medium">
                    {selectedCandidate.student?.department || 'Computer Science'} · Year {selectedCandidate.student?.year || 3}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-slate-600 font-mono text-[11px]">
                    <span className="font-bold text-amber-700">CGPA: {selectedCandidate.student?.cgpa || '8.8'}</span>
                    <span>•</span>
                    <span>Backlogs: {selectedCandidate.student?.activeBacklogs || 0}</span>
                  </div>
                </div>
              </div>
              {getStatusBadge(selectedCandidate.status)}
            </div>

            {/* Position and Resume Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium block">Target Internship Listing</span>
                <span className="font-bold text-slate-900 block">{selectedCandidate.listing?.title}</span>
                <span className="text-slate-500 font-mono text-[11px] block">
                  Stipend: ₹{(selectedCandidate.listing?.stipend || 0).toLocaleString()}/mo
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium block">Official Student Resume</span>
                {selectedCandidate.resumeUrl || selectedCandidate.student?.resumeUrl ? (
                  <a
                    href={selectedCandidate.resumeUrl || selectedCandidate.student?.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1.5 pt-1"
                  >
                    <FileText size={14} />
                    <span>Download / Preview Resume File</span>
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="text-slate-400">Resume on profile</span>
                )}
              </div>
            </div>

            {/* Technical Skills Overview */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                Technical Stack & Skills
              </span>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-wrap gap-1.5">
                {(selectedCandidate.student?.skills || 'React, TypeScript, Node.js, Docker, PostgreSQL')
                  .split(',')
                  .map((sk: string) => (
                    <span key={sk} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 font-mono text-[11px]">
                      {sk.trim()}
                    </span>
                  ))}
              </div>
            </div>

            {/* Private Internal Notes Box */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                Private Evaluation & Interview Notes
              </span>
              <div className="flex gap-2">
                <Textarea
                  rows={2}
                  value={privateNote}
                  onChange={(e) => setPrivateNote(e.target.value)}
                  placeholder="Add internal feedback, assessment scores, or interview notes..."
                  className="text-xs"
                />
                <Button
                  variant="outline"
                  size="sm"
                  loading={acting}
                  onClick={handleSavePrivateNote}
                  className="self-end"
                >
                  Save Note
                </Button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRejectModalOpen(true)}
                className="text-rose-700 border-rose-200 hover:bg-rose-50"
              >
                Decline Candidate
              </Button>

              <div className="flex items-center gap-2">
                {selectedCandidate.status !== 'SHORTLISTED' && (
                  <Button
                    variant="outline"
                    size="sm"
                    loading={acting}
                    onClick={() => handleShortlist(selectedCandidate.id)}
                  >
                    Shortlist
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsInterviewModalOpen(true)}
                  className="text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                  leftIcon={<PhoneCall size={13} />}
                >
                  Move to Interview
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsOfferModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  leftIcon={<Award size={13} />}
                >
                  Select & Issue Offer
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ─── REJECT MODAL ──────────────────────────────────────────────────── */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Decline Candidate Application"
        size="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Institutional policy requires a mandatory formal reason when declining a student application.
          </p>

          <Textarea
            label="Mandatory Rejection Reason"
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g. Position filled for this cycle, required specific Docker/Kubernetes production experience..."
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

      {/* ─── INTERVIEW STAGE MODAL ─────────────────────────────────────────── */}
      <Modal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        title="Move Candidate to Interview Stage"
        size="sm"
      >
        <div className="space-y-4 text-xs">
          <Input
            label="Target Interview Date & Time"
            type="datetime-local"
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
          />

          <Textarea
            label="Interview Instructions / Meeting Link"
            rows={3}
            value={interviewNotes}
            onChange={(e) => setInterviewNotes(e.target.value)}
            placeholder="e.g. Google Meet link or system design discussion agenda..."
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsInterviewModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={acting}
              onClick={handleMoveToInterview}
            >
              Confirm Stage Update
            </Button>
          </div>
        </div>
      </Modal>

      {/* ─── ISSUE OFFER MODAL ─────────────────────────────────────────────── */}
      <Modal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        title="Issue Corporate Offer Letter"
        size="sm"
      >
        <div className="space-y-4 text-xs">
          <Input
            label="Internship Designation"
            value={offerDesignation}
            onChange={(e) => setOfferDesignation(e.target.value)}
            required
          />

          <Input
            label="Monthly Stipend (INR)"
            type="number"
            value={offerStipend}
            onChange={(e) => setOfferStipend(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsOfferModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              loading={acting}
              onClick={handleIssueOffer}
            >
              Dispatch Offer Letter
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
