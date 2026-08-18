import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { FileText, Plus, CheckCircle2, Clock, Upload, Send } from 'lucide-react';
import { demoReports, WeeklyReportItem } from '@/data/demo';
import { toast } from 'sonner';

export default function WeeklyReportsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [reports, setReports] = useState<WeeklyReportItem[]>(demoReports);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [weekNum, setWeekNum] = useState('5');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [hours, setHours] = useState('40');

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    const newReport: WeeklyReportItem = {
      id: String(Date.now()),
      studentId: 's1',
      studentName: 'Priya Sharma',
      studentRoll: '20CS101',
      companyName: 'TechCorp Solutions',
      weekNumber: parseInt(weekNum, 10),
      title,
      summary,
      submissionDate: 'Today, Jul 28, 2026',
      status: 'PENDING',
      hoursLogged: parseFloat(hours) || 40,
      deliverables: ['Weekly sprint technical tasks and benchmarking'],
    };

    setReports([newReport, ...reports]);
    setIsSubmitModalOpen(false);
    setTitle('');
    setSummary('');
    toast.success(`Week ${weekNum} synthesis report submitted for Faculty Review!`);
  };

  const columns = [
    {
      key: 'weekNumber',
      header: 'Week',
      render: (row: WeeklyReportItem) => (
        <span className="font-mono font-bold text-slate-900 text-xs">Week 0{row.weekNumber}</span>
      ),
    },
    {
      key: 'title',
      header: 'Synthesis Topic & Summary',
      render: (row: WeeklyReportItem) => (
        <div>
          <div className="font-bold text-slate-900 text-xs">{row.title}</div>
          <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5 line-clamp-2">{row.summary}</p>
          {row.facultyFeedback && (
            <div className="text-[11px] text-emerald-800 font-medium mt-1 bg-emerald-50 p-2 rounded border border-emerald-200">
              Faculty: "{row.facultyFeedback}"
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'hoursLogged',
      header: 'Hours',
      render: (row: WeeklyReportItem) => (
        <span className="font-mono font-bold text-slate-800">{row.hoursLogged}h</span>
      ),
    },
    {
      key: 'grade',
      header: 'Grade',
      render: (row: WeeklyReportItem) =>
        row.grade ? (
          <span className="font-mono font-bold text-emerald-700">{row.grade}</span>
        ) : (
          <span className="text-slate-400 font-mono text-xs">Pending</span>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: WeeklyReportItem) => <StatusBadge status={row.status} size="sm" />,
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Weekly Synthesis Reports"
        subtitle="Submit weekly progress syntheses for academic faculty evaluation"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Synthesis Reports Archive</h2>
            <p className="text-xs text-slate-500 font-mono">
              {reports.filter((r) => r.status === 'APPROVED').length} of {reports.length} reports approved by Dr. Rajesh Kumar
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsSubmitModalOpen(true)}
            leftIcon={<Plus size={14} />}
          >
            Submit Week 5 Report
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={reports}
          searchKey="title"
          searchPlaceholder="Search weekly report topics..."
        />
      </div>

      {/* Submit Report Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Weekly Academic Synthesis Report"
        size="md"
      >
        <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Week Number"
              type="number"
              min="1"
              max="12"
              value={weekNum}
              onChange={(e) => setWeekNum(e.target.value)}
              required
            />

            <Input
              label="Verified Hours Logged"
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              required
            />
          </div>

          <Input
            label="Synthesis Topic / Milestone Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Distributed Session Management & Redis Cluster Benchmarking"
            required
          />

          <Textarea
            label="Technical Synthesis Summary"
            rows={5}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Synthesize the architectural patterns implemented, challenges resolved, PRs merged, and outcomes..."
            required
          />

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] leading-relaxed flex items-center gap-2">
            <Upload size={14} className="text-slate-400 flex-shrink-0" />
            <span>Supporting documentation and PR links will be automatically attached from your GitHub profile.</span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsSubmitModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" leftIcon={<Send size={13} />}>
              Submit for Academic Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
