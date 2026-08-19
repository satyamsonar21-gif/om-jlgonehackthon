import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  FileText,
  Plus,
  CheckCircle2,
  Clock,
  Upload,
  Send,
  AlertTriangle,
  Loader2,
  Save,
  RotateCcw,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { uploadDocument, StoragePaths, validateDocumentFile } from '@/lib/storage';
import { toast } from 'sonner';

export default function WeeklyReportsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};
  const { user } = useAuth();

  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'APPROVED' | 'REVIEW' | 'CHANGES' | 'DRAFT'>('ALL');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  // Form states
  const [weekNumber, setWeekNumber] = useState('1');
  const [summary, setSummary] = useState('');
  const [keyLearnings, setKeyLearnings] = useState('');
  const [issuesFaced, setIssuesFaced] = useState('');
  const [nextWeekGoals, setNextWeekGoals] = useState('');
  const [hoursWorked, setHoursWorked] = useState('40');
  const [fileUrl, setFileUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [isRevisionMode, setIsRevisionMode] = useState(false);
  const [acting, setActing] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const internshipRes = await api.getInternships();
      const myInternship = internshipRes.data?.[0];
      if (myInternship) {
        const res = await api.getWeeklyReports(myInternship.id);
        setReports(res.data || []);
      } else {
        setReports(getDemoReports());
      }
    } catch {
      setReports(getDemoReports());
    } finally {
      setLoading(false);
    }
  };

  const getDemoReports = () => [
    {
      id: 'rep-1',
      weekNumber: 1,
      summary: 'Architecture onboarding, Git workflows, and OAuth2 PKCE security flow implementation.',
      keyLearnings: 'PKCE challenge verification algorithms and Redis caching TTL patterns.',
      issuesFaced: 'Initial CORS policy restrictions during local multi-tenant testing.',
      nextWeekGoals: 'Author end-to-end integration tests and load test database connection pools.',
      hoursWorked: 40,
      fileUrl: 'https://storage.ilmp.edu/reports/week_01_report.pdf',
      status: 'APPROVED',
      facultyComments: 'Comprehensive report. Strong technical deliverables and clean architectural reasoning.',
      submittedAt: '2026-02-15T18:00:00.000Z',
    },
    {
      id: 'rep-2',
      weekNumber: 2,
      summary: 'Database connection pool optimization with PgBouncer and indexing strategy.',
      keyLearnings: 'PostgreSQL execution explain plans and vacuum parameters.',
      issuesFaced: 'High connection overhead during synthetic 10k concurrent query benchmarks.',
      nextWeekGoals: 'Build asynchronous background jobs queue with BullMQ.',
      hoursWorked: 42,
      fileUrl: 'https://storage.ilmp.edu/reports/week_02_report.pdf',
      status: 'REVISION_REQUESTED',
      facultyComments: 'Please add specific benchmark latency percentiles (p95 and p99 metrics) and link PR diffs.',
      submittedAt: '2026-02-22T18:00:00.000Z',
    },
  ];

  useEffect(() => {
    fetchReports();
  }, []);

  const handleOpenCreateModal = (existing?: any) => {
    if (existing) {
      setIsRevisionMode(existing.status === 'REVISION_REQUESTED');
      setWeekNumber(String(existing.weekNumber));
      setSummary(existing.summary || '');
      setKeyLearnings(existing.keyLearnings || '');
      setIssuesFaced(existing.issuesFaced || '');
      setNextWeekGoals(existing.nextWeekGoals || '');
      setHoursWorked(String(existing.hoursWorked || 40));
      setFileUrl(existing.fileUrl || '');
      setRevisionNotes(existing.revisionNotes || '');
    } else {
      setIsRevisionMode(false);
      const nextWeek = reports.length > 0 ? Math.max(...reports.map((r) => r.weekNumber)) + 1 : 1;
      setWeekNumber(String(nextWeek));
      setSummary('');
      setKeyLearnings('');
      setIssuesFaced('');
      setNextWeekGoals('');
      setHoursWorked('40');
      setFileUrl('');
      setRevisionNotes('');
    }
    setIsSubmitModalOpen(true);
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    if (!summary.trim() || !keyLearnings.trim() || !nextWeekGoals.trim()) {
      toast.error('Please fill in all mandatory report sections.');
      return;
    }

    setActing(true);
    try {
      const internshipRes = await api.getInternships();
      const internshipId = internshipRes.data?.[0]?.id || 'demo-internship';

      await api.createWeeklyReport({
        internshipId,
        weekNumber: parseInt(weekNumber, 10),
        summary: summary.trim(),
        keyLearnings: keyLearnings.trim(),
        issuesFaced: issuesFaced.trim() || undefined,
        nextWeekGoals: nextWeekGoals.trim(),
        hoursWorked: parseFloat(hoursWorked) || 40,
        fileUrl: fileUrl.trim() || undefined,
        isDraft,
        revisionNotes: isRevisionMode ? revisionNotes.trim() : undefined,
      });

      toast.success(
        isDraft
          ? 'Weekly report saved as draft!'
          : isRevisionMode
          ? `Week ${weekNumber} revised report resubmitted for Faculty Guide review!`
          : `Week ${weekNumber} synthesis report submitted for Faculty Guide review!`
      );
      setIsSubmitModalOpen(false);
      await fetchReports();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit weekly report');
    } finally {
      setActing(false);
    }
  };

  const getStatusBadge = (st: string) => {
    const s = (st || 'SUBMITTED').toUpperCase();
    if (s === 'APPROVED' || s === 'FINAL_APPROVED') return <Badge variant="success">APPROVED</Badge>;
    if (s === 'SUBMITTED') return <Badge variant="info">SUBMITTED</Badge>;
    if (s === 'REVISION_REQUESTED') return <Badge variant="warning">CHANGES REQUESTED</Badge>;
    if (s === 'DRAFT') return <Badge variant="neutral">DRAFT</Badge>;
    return <Badge variant="neutral">{s}</Badge>;
  };

  // Filtered Reports
  const filteredReports = reports.filter((rep) => {
    const s = (rep.status || 'SUBMITTED').toUpperCase();
    if (activeFilter === 'APPROVED') return ['APPROVED', 'FINAL_APPROVED'].includes(s);
    if (activeFilter === 'REVIEW') return s === 'SUBMITTED';
    if (activeFilter === 'CHANGES') return s === 'REVISION_REQUESTED';
    if (activeFilter === 'DRAFT') return s === 'DRAFT';
    return true;
  });

  const columns = [
    {
      key: 'weekNumber',
      header: 'Week',
      render: (row: any) => (
        <span className="font-mono font-bold text-slate-900 text-xs">
          Week {String(row.weekNumber).padStart(2, '0')}
        </span>
      ),
    },
    {
      key: 'summary',
      header: 'Executive Summary & Learning Outcomes',
      render: (row: any) => (
        <div className="space-y-1">
          <div className="font-bold text-slate-900 text-xs">{row.summary}</div>
          <p className="text-[11px] text-blue-700 font-medium line-clamp-2">
            💡 Key Learning: {row.keyLearnings}
          </p>
          {row.facultyComments && (
            <div className={`text-[11px] p-2 rounded border mt-1 ${
              row.status === 'REVISION_REQUESTED'
                ? 'bg-amber-50 border-amber-200 text-amber-950 font-semibold'
                : 'bg-emerald-50 border-emerald-200 text-emerald-950 font-medium'
            }`}>
              Faculty Guide: "{row.facultyComments}"
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'hoursWorked',
      header: 'Hours',
      render: (row: any) => (
        <span className="font-mono font-bold text-slate-800 text-xs">{row.hoursWorked}h</span>
      ),
    },
    {
      key: 'status',
      header: 'Review Status',
      render: (row: any) => getStatusBadge(row.status),
    },
    {
      key: 'actions',
      header: 'Action',
      render: (row: any) => (
        <div className="flex items-center gap-1.5">
          {row.status === 'REVISION_REQUESTED' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenCreateModal(row)}
              className="text-xs bg-amber-600 hover:bg-amber-700 text-white"
              leftIcon={<RotateCcw size={12} />}
            >
              Revise & Resubmit
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedReport(row)}
            className="text-xs"
          >
            View Dossier
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Weekly Synthesis Reports"
        subtitle="Author periodic synthesis reports, document milestones, and incorporate faculty guide feedback"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Action Header Card */}
        <Card className="p-5 sm:p-6 border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Academic Synthesis</span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                {reports.filter(r => ['APPROVED', 'FINAL_APPROVED'].includes(r.status)).length} of {reports.length} Reports Approved by Faculty Guide
              </h2>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenCreateModal()}
              leftIcon={<Plus size={14} />}
              className="bg-blue-600 hover:bg-blue-700 text-white self-start sm:self-auto"
            >
              Author Weekly Report
            </Button>
          </div>
        </Card>

        {/* Filter Navigation Tabs */}
        <Card className="p-6 space-y-5 border-slate-200">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold overflow-x-auto">
            {[
              { id: 'ALL', label: `All Reports (${reports.length})` },
              { id: 'APPROVED', label: 'Faculty Approved' },
              { id: 'REVIEW', label: 'Under Review' },
              { id: 'CHANGES', label: `Changes Requested (${reports.filter(r => r.status === 'REVISION_REQUESTED').length})` },
              { id: 'DRAFT', label: 'Drafts' },
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
            data={filteredReports}
            loading={loading}
            emptyTitle="No Weekly Reports Found"
            emptyDescription="There are no synthesis reports matching this filter category."
          />
        </Card>
      </div>

      {/* ─── CREATE / REVISE REPORT MODAL ───────────────────────────────────── */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title={isRevisionMode ? `Revise & Resubmit Week ${weekNumber} Report` : `Author Week ${weekNumber} Synthesis Report`}
        size="lg"
      >
        <div className="space-y-4 text-xs">
          {isRevisionMode && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-xs text-amber-900">
                <AlertTriangle size={15} />
                <span>Faculty Feedback Received</span>
              </span>
              <p className="text-[11px] leading-relaxed">
                Faculty requested revisions before granting academic credit. Please address the feedback and document your changes.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Week Number"
              type="number"
              min="1"
              max="52"
              value={weekNumber}
              onChange={(e) => setWeekNumber(e.target.value)}
              required
              disabled={isRevisionMode}
            />

            <Input
              label="Hours Worked This Week"
              type="number"
              step="1"
              min="1"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(e.target.value)}
              required
            />
          </div>

          <Textarea
            label="Weekly Executive Summary"
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="High-level synthesis of features delivered, bugs resolved, architectural changes..."
            required
          />

          <Textarea
            label="Key Technical Learnings"
            rows={2}
            value={keyLearnings}
            onChange={(e) => setKeyLearnings(e.target.value)}
            placeholder="New technologies, design patterns, protocols, tools mastered..."
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Textarea
              label="Roadblocks / Issues Faced"
              rows={2}
              value={issuesFaced}
              onChange={(e) => setIssuesFaced(e.target.value)}
              placeholder="Technical debt, performance bottlenecks, dependencies..."
            />

            <Textarea
              label="Next Week's Learning Goals"
              rows={2}
              value={nextWeekGoals}
              onChange={(e) => setNextWeekGoals(e.target.value)}
              placeholder="Planned sprint deliverables and focus areas..."
              required
            />
          </div>

          {isRevisionMode && (
            <Textarea
              label="Revision Response Notes (Explaining Changes Made)"
              rows={2}
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              placeholder="e.g. Added latency benchmark metrics p95/p99 and attached updated schema design..."
              required
            />
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Attached Report Document (PDF / Word · Max 10MB)
            </label>
            <div className="flex gap-2 items-center">
              <Input
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="Upload file or enter document URL"
                className="flex-1"
              />
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const validation = validateDocumentFile(file);
                    if (!validation.valid) {
                      toast.error(validation.error || 'Invalid file');
                      return;
                    }
                    try {
                      setUploadProgress(0);
                      const studentUid = user?.uid || 'student';
                      const path = StoragePaths.internshipReport(selectedReport?.internshipId || 'active', `week_${weekNumber}`, file.name);
                      const result = await uploadDocument(file, path, (pct) => setUploadProgress(pct));
                      setFileUrl(result.downloadUrl);
                      setUploadProgress(null);
                      toast.success(`Report file "${file.name}" uploaded to Firebase Storage!`);
                    } catch (err: any) {
                      setUploadProgress(null);
                      toast.error(err.message || 'Failed to upload report file');
                    }
                  }}
                  className="hidden"
                />
                <Button type="button" variant="outline" size="sm" leftIcon={<Upload size={13} />}>
                  Upload File
                </Button>
              </label>
            </div>

            {uploadProgress !== null && (
              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-xs space-y-1 animate-in fade-in">
                <div className="flex justify-between font-bold text-blue-900 text-[11px]">
                  <span>Uploading document to Firebase Storage...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              loading={acting}
              onClick={() => handleSubmit(true)}
              leftIcon={<Save size={13} />}
            >
              Save as Draft
            </Button>

            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setIsSubmitModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                loading={acting}
                onClick={() => handleSubmit(false)}
                leftIcon={<Send size={13} />}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isRevisionMode ? 'Resubmit to Faculty' : 'Submit for Review'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* ─── VIEW DOSSIER MODAL ─────────────────────────────────────────────── */}
      {selectedReport && (
        <Modal
          isOpen={Boolean(selectedReport)}
          onClose={() => setSelectedReport(null)}
          title={`Week ${String(selectedReport.weekNumber).padStart(2, '0')} Synthesis Dossier`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 text-sm">Week {selectedReport.weekNumber} Synthesis Report</span>
                <span className="font-mono text-emerald-700 font-bold block mt-0.5">{selectedReport.hoursWorked} Hours Logged</span>
              </div>
              {getStatusBadge(selectedReport.status)}
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                Executive Summary
              </span>
              <p className="p-3 rounded-lg bg-white border border-slate-200 text-slate-800 leading-relaxed font-medium">
                {selectedReport.summary}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                Technical Learnings
              </span>
              <p className="p-3 rounded-lg bg-blue-50/60 border border-blue-200 text-blue-950 leading-relaxed">
                {selectedReport.keyLearnings}
              </p>
            </div>

            {selectedReport.issuesFaced && (
              <div className="space-y-1">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                  Issues Encountered
                </span>
                <p className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-amber-950 leading-relaxed">
                  {selectedReport.issuesFaced}
                </p>
              </div>
            )}

            <div className="space-y-1">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                Next Week Goals
              </span>
              <p className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                {selectedReport.nextWeekGoals}
              </p>
            </div>

            {selectedReport.facultyComments && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                <span className="font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-700" />
                  <span>Faculty Mentor Review</span>
                </span>
                <p className="text-[11px] leading-relaxed">{selectedReport.facultyComments}</p>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button variant="secondary" size="sm" onClick={() => setSelectedReport(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
