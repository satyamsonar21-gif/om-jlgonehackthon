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
  Clock,
  Plus,
  Calendar,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Loader2,
  BookOpen,
  Paperclip,
  ExternalLink,
  Save,
  Send,
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function DailyLogsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'SUBMITTED' | 'REVIEWED' | 'DRAFT' | 'FLAGGED'>('ALL');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  // Form Fields
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logHours, setLogHours] = useState('8.0');
  const [logTasks, setLogTasks] = useState('');
  const [logLearnings, setLogLearnings] = useState('');
  const [logChallenges, setLogChallenges] = useState('');
  const [logTomorrow, setLogTomorrow] = useState('');
  const [logAttachments, setLogAttachments] = useState('');
  const [acting, setActing] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const internshipRes = await api.getInternships();
      const myInternship = internshipRes.data?.[0];
      if (myInternship) {
        const res = await api.getDailyLogs(myInternship.id);
        setLogs(res.data || []);
      } else {
        setLogs(getDemoLogs());
      }
    } catch {
      setLogs(getDemoLogs());
    } finally {
      setLoading(false);
    }
  };

  const getDemoLogs = () => [
    {
      id: 'log-1',
      date: new Date().toISOString().split('T')[0],
      hoursWorked: 8.0,
      tasksCompleted: 'Configured Redis session cache layer and authored auth middleware tests.',
      whatILearned: 'Learned token revocation patterns using Redis key expiry TTL.',
      challengesFaced: 'Encountered race conditions during multi-instance cache invalidation.',
      plansForTomorrow: 'Optimize PostgreSQL connection pooling with pgbouncer.',
      attachments: 'https://github.com/org/repo/pull/120',
      status: 'SUBMITTED',
      reviewNotes: null,
    },
    {
      id: 'log-2',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      hoursWorked: 8.0,
      tasksCompleted: 'Implemented OAuth2 PKCE challenge generation & verifier checks in Go backend.',
      whatILearned: 'Understood crypto/sha256 hashing and URL-safe base64 encoding.',
      challengesFaced: 'None. Smooth sprint progression.',
      plansForTomorrow: 'Add Redis cache layer.',
      status: 'REVIEWED',
      reviewNotes: 'Clean, production-grade implementation. Approved by supervisor.',
    },
  ];

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleOpenAddModal = (dateStr?: string) => {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    setLogDate(targetDate);

    // Check if an existing log exists for this date
    const existing = logs.find((l) => l.date?.split('T')[0] === targetDate);
    if (existing) {
      setLogHours(String(existing.hoursWorked || 8.0));
      setLogTasks(existing.tasksCompleted || '');
      setLogLearnings(existing.whatILearned || '');
      setLogChallenges(existing.challengesFaced || '');
      setLogTomorrow(existing.plansForTomorrow || '');
      setLogAttachments(existing.attachments || '');
    } else {
      setLogHours('8.0');
      setLogTasks('');
      setLogLearnings('');
      setLogChallenges('');
      setLogTomorrow('');
      setLogAttachments('');
    }
    setIsLogModalOpen(true);
  };

  const handleSubmitLog = async (isDraft: boolean = false) => {
    if (!logTasks.trim()) {
      toast.error('Tasks completed field is required.');
      return;
    }

    setActing(true);
    try {
      const internshipRes = await api.getInternships();
      const internshipId = internshipRes.data?.[0]?.id || 'demo-internship';

      await api.createDailyLog({
        internshipId,
        date: logDate,
        hoursWorked: parseFloat(logHours) || 8.0,
        tasksCompleted: logTasks.trim(),
        whatILearned: logLearnings.trim() || undefined,
        challengesFaced: logChallenges.trim() || undefined,
        plansForTomorrow: logTomorrow.trim() || undefined,
        attachments: logAttachments.trim() || undefined,
        isDraft,
      });

      toast.success(isDraft ? 'Daily log saved as draft!' : 'Daily work log submitted successfully!');
      setIsLogModalOpen(false);
      await fetchLogs();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save daily log';
      toast.error(msg);
    } finally {
      setActing(false);
    }
  };

  const getStatusBadge = (st: string) => {
    const s = (st || 'SUBMITTED').toUpperCase();
    if (s === 'REVIEWED' || s === 'APPROVED') return <Badge variant="success">REVIEWED</Badge>;
    if (s === 'SUBMITTED') return <Badge variant="info">SUBMITTED</Badge>;
    if (s === 'DRAFT') return <Badge variant="neutral">DRAFT</Badge>;
    if (s === 'FLAGGED') return <Badge variant="danger">FLAGGED</Badge>;
    return <Badge variant="neutral">{s}</Badge>;
  };

  // Filtered Logs
  const filteredLogs = logs.filter((log) => {
    const s = (log.status || 'SUBMITTED').toUpperCase();
    if (activeFilter === 'SUBMITTED') return s === 'SUBMITTED';
    if (activeFilter === 'REVIEWED') return ['REVIEWED', 'APPROVED'].includes(s);
    if (activeFilter === 'DRAFT') return s === 'DRAFT';
    if (activeFilter === 'FLAGGED') return s === 'FLAGGED';
    return true;
  });

  const totalLoggedHours = logs.reduce((acc, l) => acc + (l.hoursWorked || 0), 0);

  const columns = [
    {
      key: 'date',
      header: 'Log Date',
      render: (row: any) => (
        <div className="font-mono text-slate-900 font-bold text-xs">
          {new Date(row.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      ),
    },
    {
      key: 'hours',
      header: 'Hours',
      render: (row: any) => (
        <span className="font-mono font-bold text-emerald-700 text-xs">{row.hoursWorked} hrs</span>
      ),
    },
    {
      key: 'tasks',
      header: 'Deliverables & Learning Outcomes',
      render: (row: any) => (
        <div className="space-y-1">
          <p className="text-slate-800 text-xs font-semibold leading-relaxed">{row.tasksCompleted}</p>
          {row.whatILearned && (
            <p className="text-[11px] text-blue-700 font-medium">
              💡 Learning: {row.whatILearned}
            </p>
          )}
          {row.reviewNotes && (
            <p className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
              Mentor: "{row.reviewNotes}"
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: any) => getStatusBadge(row.status),
    },
    {
      key: 'action',
      header: 'Action',
      render: (row: any) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedLog(row)}
          className="text-xs"
        >
          View Full Dossier
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Daily Work Activity Logs"
        subtitle="Log daily technical deliverables, document learning outcomes, and track verified working hours"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Metric Banner Card */}
        <Card className="p-5 sm:p-6 border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sprint Cumulative Hours</span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                {totalLoggedHours.toFixed(1)} Total Hours Logged Across {logs.length} Work Days
              </h2>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenAddModal()}
              leftIcon={<Plus size={14} />}
              className="bg-blue-600 hover:bg-blue-700 text-white self-start sm:self-auto"
            >
              Record Today's Log
            </Button>
          </div>
        </Card>

        {/* Status Filters */}
        <Card className="p-6 space-y-5 border-slate-200">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold overflow-x-auto">
            {[
              { id: 'ALL', label: `All Logs (${logs.length})` },
              { id: 'SUBMITTED', label: 'Submitted' },
              { id: 'REVIEWED', label: 'Reviewed & Approved' },
              { id: 'DRAFT', label: 'Drafts' },
              { id: 'FLAGGED', label: 'Flagged' },
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
            data={filteredLogs}
            loading={loading}
            emptyTitle="No Daily Logs Found"
            emptyDescription="There are no activity logs matching this filter category."
          />
        </Card>
      </div>

      {/* ─── ADD / EDIT LOG MODAL ────────────────────────────────────────────── */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Record Daily Work Activity"
        size="lg"
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Work Date"
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              required
            />

            <Input
              label="Hours Worked"
              type="number"
              step="0.5"
              min="1"
              max="16"
              value={logHours}
              onChange={(e) => setLogHours(e.target.value)}
              required
            />
          </div>

          <Textarea
            label="Tasks & Deliverables Completed"
            rows={3}
            value={logTasks}
            onChange={(e) => setLogTasks(e.target.value)}
            placeholder="Document specific PRs merged, modules built, APIs implemented..."
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Textarea
              label="What I Learned Today"
              rows={2}
              value={logLearnings}
              onChange={(e) => setLogLearnings(e.target.value)}
              placeholder="Key concepts, architecture patterns, tools..."
            />

            <Textarea
              label="Roadblocks / Challenges Faced"
              rows={2}
              value={logChallenges}
              onChange={(e) => setLogChallenges(e.target.value)}
              placeholder="Technical hurdles, build errors, dependencies..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Textarea
              label="Tomorrow's Action Plan"
              rows={2}
              value={logTomorrow}
              onChange={(e) => setLogTomorrow(e.target.value)}
              placeholder="Planned tasks and deliverables for next working session..."
            />

            <Input
              label="Attachment / Pull Request URL"
              value={logAttachments}
              onChange={(e) => setLogAttachments(e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              loading={acting}
              onClick={() => handleSubmitLog(true)}
              leftIcon={<Save size={13} />}
            >
              Save as Draft
            </Button>

            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setIsLogModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                loading={acting}
                onClick={() => handleSubmitLog(false)}
                leftIcon={<Send size={13} />}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Submit Official Log
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* ─── VIEW LOG DETAIL MODAL ─────────────────────────────────────────── */}
      {selectedLog && (
        <Modal
          isOpen={Boolean(selectedLog)}
          onClose={() => setSelectedLog(null)}
          title="Daily Work Activity Dossier"
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 text-sm">
                  {new Date(selectedLog.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="font-mono text-emerald-700 font-bold block mt-0.5">{selectedLog.hoursWorked} Hours Verified</span>
              </div>
              {getStatusBadge(selectedLog.status)}
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                Tasks & Deliverables
              </span>
              <p className="p-3 rounded-lg bg-white border border-slate-200 text-slate-800 leading-relaxed font-medium">
                {selectedLog.tasksCompleted}
              </p>
            </div>

            {selectedLog.whatILearned && (
              <div className="space-y-1">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                  Key Learnings
                </span>
                <p className="p-3 rounded-lg bg-blue-50/60 border border-blue-200 text-blue-950 leading-relaxed">
                  {selectedLog.whatILearned}
                </p>
              </div>
            )}

            {selectedLog.challengesFaced && (
              <div className="space-y-1">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                  Challenges & Roadblocks
                </span>
                <p className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-amber-950 leading-relaxed">
                  {selectedLog.challengesFaced}
                </p>
              </div>
            )}

            {selectedLog.plansForTomorrow && (
              <div className="space-y-1">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                  Next Day's Plan
                </span>
                <p className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedLog.plansForTomorrow}
                </p>
              </div>
            )}

            {selectedLog.attachments && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-blue-600 font-mono text-[11px]">
                <span className="truncate">{selectedLog.attachments}</span>
                <a href={selectedLog.attachments} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1 font-bold">
                  <span>Open</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}

            {selectedLog.reviewNotes && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                <span className="font-bold text-[11px]">Mentor Review Feedback</span>
                <p className="text-[11px]">{selectedLog.reviewNotes}</p>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button variant="secondary" size="sm" onClick={() => setSelectedLog(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
