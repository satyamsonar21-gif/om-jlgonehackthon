import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
import { FileText, Check, AlertCircle, Eye, Building2, User, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function FacultyReportsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [evaluatingReport, setEvaluatingReport] = useState<any | null>(null);
  const [feedback, setFeedback] = useState('');
  const [acting, setActing] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.getPendingReports();
      setReports(res.data || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleReview = async (status: 'APPROVED' | 'REVISION_REQUESTED' | 'REJECTED') => {
    if (!evaluatingReport) return;
    setActing(true);
    try {
      await api.reviewReport(evaluatingReport.id, {
        status,
        comments: feedback || (status === 'APPROVED' ? 'Report reviewed and approved by Faculty Guide.' : 'Please add more technical specifics on benchmarking.'),
      });
      toast.success(`Report status updated to ${status}`);
      await fetchReports();
      setEvaluatingReport(null);
      setFeedback('');
    } catch (err: any) {
      toast.error('Failed to update report status');
    } finally {
      setActing(false);
    }
  };

  const columns = [
    {
      key: 'student',
      header: 'Student & Organization',
      sortable: true,
      render: (row: any) => (
        <div>
          <div className="font-bold text-slate-900">{row.internship?.student?.user?.name || 'Aarav Patil'}</div>
          <div className="text-[11px] font-mono text-slate-400">
            {row.internship?.student?.studentId} · {row.internship?.company?.name}
          </div>
        </div>
      ),
    },
    {
      key: 'weekNumber',
      header: 'Milestone & Summary',
      render: (row: any) => (
        <div>
          <div className="font-semibold text-emerald-800 text-xs">Week {row.weekNumber} Synthesis Report</div>
          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{row.summary}</p>
        </div>
      ),
    },
    {
      key: 'submittedAt',
      header: 'Submitted',
      render: (row: any) => (
        <span className="font-mono text-xs text-slate-600">
          {new Date(row.submittedAt || Date.now()).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: any) => (
        <Badge variant={row.status === 'APPROVED' ? 'success' : 'warning'}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      render: (row: any) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setEvaluatingReport(row);
            setFeedback(row.facultyComments || '');
          }}
          className="text-xs h-7 px-2.5 font-semibold"
        >
          Review & Score
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Weekly Synthesis Reports"
        subtitle="Review, critique, and sign off on weekly industrial deliverables and learning logs"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <Card className="p-4 sm:p-6 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Faculty Review Queue</h3>
              <p className="text-xs text-slate-500">Live submissions pending faculty mentor evaluation</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p className="text-xs text-slate-500 mt-2">Loading review queue...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={reports}
              searchPlaceholder="Search reports by student, company, or milestone..."
            />
          )}
        </Card>

        {/* Evaluation Modal */}
        {evaluatingReport && (
          <Modal
            isOpen={Boolean(evaluatingReport)}
            onClose={() => setEvaluatingReport(null)}
            title={`Evaluate Week ${evaluatingReport.weekNumber} Report`}
          >
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">
                    {evaluatingReport.internship?.student?.user?.name}
                  </span>
                  <Badge variant="outline">Week {evaluatingReport.weekNumber}</Badge>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Deliverables Summary:</span>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">{evaluatingReport.summary}</p>
                </div>
                {evaluatingReport.keyLearnings && (
                  <div>
                    <span className="font-semibold text-slate-700">Key Learnings:</span>
                    <p className="text-slate-600 mt-0.5">{evaluatingReport.keyLearnings}</p>
                  </div>
                )}
                {evaluatingReport.issuesFaced && (
                  <div>
                    <span className="font-semibold text-slate-700">Challenges / Blockers:</span>
                    <p className="text-slate-600 mt-0.5">{evaluatingReport.issuesFaced}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Faculty Mentor Feedback & Guidance
                </label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide technical feedback or improvement recommendations..."
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={acting}
                  onClick={() => handleReview('REVISION_REQUESTED')}
                  className="text-amber-700 border-amber-300 hover:bg-amber-50"
                >
                  Request Revision
                </Button>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEvaluatingReport(null)}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    disabled={acting}
                    onClick={() => handleReview('APPROVED')}
                    className="bg-emerald-600 hover:bg-emerald-700 font-semibold gap-1.5"
                  >
                    {acting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                    <span>Approve & Sign Off</span>
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
