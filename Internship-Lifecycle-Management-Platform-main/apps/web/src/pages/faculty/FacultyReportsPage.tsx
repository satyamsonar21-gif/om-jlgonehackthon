import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Textarea, Input } from '@/components/ui/Input';
import { FileText, Check, AlertCircle, Eye, Building2, User } from 'lucide-react';
import { demoReports, WeeklyReportItem } from '@/data/demo';
import { toast } from 'sonner';

export default function FacultyReportsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [reports, setReports] = useState<WeeklyReportItem[]>(demoReports);
  const [evaluatingReport, setEvaluatingReport] = useState<WeeklyReportItem | null>(null);
  const [grade, setGrade] = useState('5.0');
  const [feedback, setFeedback] = useState('');

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatingReport) return;

    setReports(
      reports.map((r) =>
        r.id === evaluatingReport.id
          ? { ...r, status: 'APPROVED', grade: `${grade} / 5.0`, facultyFeedback: feedback }
          : r
      )
    );

    toast.success(`Approved report for ${evaluatingReport.studentName} with Grade ${grade}/5.0`);
    setEvaluatingReport(null);
    setFeedback('');
  };

  const columns = [
    {
      key: 'studentName',
      header: 'Student & Roll',
      sortable: true,
      render: (row: WeeklyReportItem) => (
        <div>
          <div className="font-bold text-slate-900">{row.studentName}</div>
          <div className="text-[11px] font-mono text-slate-400">{row.studentRoll} · {row.companyName}</div>
        </div>
      ),
    },
    {
      key: 'weekNumber',
      header: 'Milestone & Title',
      render: (row: WeeklyReportItem) => (
        <div>
          <div className="font-semibold text-emerald-800 text-xs">Week {row.weekNumber}: {row.title}</div>
          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{row.summary}</p>
        </div>
      ),
    },
    {
      key: 'hoursLogged',
      header: 'Hours',
      render: (row: WeeklyReportItem) => (
        <span className="font-mono font-bold text-slate-900">{row.hoursLogged} hrs</span>
      ),
    },
    {
      key: 'submissionDate',
      header: 'Submitted',
      render: (row: WeeklyReportItem) => (
        <span className="font-mono text-slate-500">{row.submissionDate}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: WeeklyReportItem) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right' as const,
      render: (row: WeeklyReportItem) => (
        <Button
          variant={row.status === 'APPROVED' ? 'outline' : 'primary'}
          size="sm"
          className={row.status === 'APPROVED' ? '' : 'bg-emerald-600 hover:bg-emerald-700'}
          onClick={() => {
            setEvaluatingReport(row);
            setFeedback(row.facultyFeedback || '');
          }}
        >
          {row.status === 'APPROVED' ? 'View Grade' : 'Evaluate'}
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Weekly Synthesis Review Queue"
        subtitle="Evaluate and grade weekly progress reports submitted by supervised students"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Submissions Queue</h2>
            <p className="text-xs text-slate-500 font-mono">
              {reports.filter((r) => r.status === 'PENDING').length} submissions pending academic evaluation
            </p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={reports}
          searchKey="studentName"
          searchPlaceholder="Search reports by student name or topic..."
        />
      </div>

      {/* Evaluation Modal */}
      <Modal
        isOpen={!!evaluatingReport}
        onClose={() => setEvaluatingReport(null)}
        title="Academic Synthesis Evaluation"
        size="md"
      >
        {evaluatingReport && (
          <form onSubmit={handleApprove} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">{evaluatingReport.studentName} ({evaluatingReport.studentRoll})</div>
              <div className="text-xs text-slate-600">{evaluatingReport.companyName} · Week {evaluatingReport.weekNumber}</div>
              <div className="font-semibold text-slate-800 text-xs mt-1">{evaluatingReport.title}</div>
              <p className="text-slate-600 text-[11px] leading-relaxed mt-1">"{evaluatingReport.summary}"</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Academic Score (Out of 5.0)</label>
              <Input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Faculty Guide Feedback & Remarks</label>
              <Textarea
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter academic feedback on methodology, technical depth, and testing rigor..."
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  toast.warning(`Requested revision from ${evaluatingReport.studentName}`);
                  setEvaluatingReport(null);
                }}
              >
                Request Revision
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700" leftIcon={<Check size={14} />}>
                Approve & Sign Off
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
