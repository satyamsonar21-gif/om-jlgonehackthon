import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { FileText, CheckCircle2, Clock, AlertCircle, Building2, ChevronRight, Check, X, SlidersHorizontal } from 'lucide-react';
import { ReviewDrawer, type StudentReviewData } from '@/components/common/ReviewDrawer';

interface ReportItem {
  id: string;
  student: string;
  roll: string;
  company: string;
  week: string;
  date: string;
  excerpt: string;
  status: 'Pending' | 'Approved' | 'Needs Revision';
  tasksCompleted: string[];
}

const initialReports: ReportItem[] = [
  { 
    id: 'r1',
    student: 'Rahul Sharma', 
    roll: '20CS101', 
    company: 'TechCorp Solutions', 
    week: 'Week 4', 
    date: 'Oct 24, 2026', 
    excerpt: 'Implemented OAuth2 PKCE login flow using React and Zustand state management. Resolved 3 latency bottlenecks in the profile picture upload CDN pipeline.', 
    status: 'Pending',
    tasksCompleted: ['Authentication token caching', 'Jest integration tests (84% coverage)', 'API endpoint documentation']
  },
  { 
    id: 'r2',
    student: 'Priya Patel', 
    roll: '20CS102', 
    company: 'Innovatech Labs', 
    week: 'Week 4', 
    date: 'Oct 23, 2026', 
    excerpt: 'Finished SQLite schema migrations for the analytics service. Created index on student_id and timestamp for 10x faster query execution.', 
    status: 'Pending',
    tasksCompleted: ['Prisma schema migration', 'Database query optimization', 'Sprint retro presentation']
  },
  { 
    id: 'r3',
    student: 'Amit Kumar', 
    roll: '20CS105', 
    company: 'TechCorp Solutions', 
    week: 'Week 3', 
    date: 'Oct 18, 2026', 
    excerpt: 'Refactored legacy billing webhooks and added idempotent Redis locks to prevent duplicate charge processing during network retries.', 
    status: 'Approved',
    tasksCompleted: ['Redis idempotency locks', 'Webhook retry backoff', 'Production deployment smoke tests']
  },
  { 
    id: 'r4',
    student: 'Sneha Gupta', 
    roll: '20CS106', 
    company: 'DataSystems Inc', 
    week: 'Week 5', 
    date: 'Oct 25, 2026', 
    excerpt: 'Designed responsive dashboard layout with Framer Motion animations. Integrated role-based theme tokens across 12 page views.', 
    status: 'Pending',
    tasksCompleted: ['Theme token system', 'Framer motion layout animations', 'Accessibility WCAG review']
  },
  { 
    id: 'r5',
    student: 'Vikram Singh', 
    roll: '20CS103', 
    company: 'DataSystems Inc', 
    week: 'Week 2', 
    date: 'Oct 10, 2026', 
    excerpt: 'Reviewed documentation on Docker and Kubernetes configurations.', 
    status: 'Needs Revision',
    tasksCompleted: ['Read internal wiki pages']
  },
];

export default function FacultyReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>(initialReports);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const filteredReports = reports.filter(report => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Pending') return report.status === 'Pending';
    if (activeTab === 'Approved') return report.status === 'Approved';
    if (activeTab === 'Needs Revision') return report.status === 'Needs Revision';
    return true;
  });

  const selectedReport = reports.find(r => r.id === selectedReportId) || null;

  const drawerData: StudentReviewData | null = selectedReport ? {
    id: selectedReport.id,
    name: selectedReport.student,
    rollNo: selectedReport.roll,
    company: selectedReport.company,
    weekNumber: parseInt(selectedReport.week.replace(/\D/g, '')) || 4,
    workSummary: `${selectedReport.excerpt}\n\nKey Deliverables:\n• ${selectedReport.tasksCompleted.join('\n• ')}`,
    hoursLogged: 40,
    riskStatus: selectedReport.status === 'Needs Revision' ? 'high' : selectedReport.status === 'Pending' ? 'medium' : 'low',
  } : null;

  const handleApprove = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    setSelectedReportId(null);
  };

  const handleRequestRevision = (id: string, _comment: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Needs Revision' } : r));
    setSelectedReportId(null);
  };

  return (
    <div className="min-h-full pb-16" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header 
        title="Weekly Report Review Queue" 
        subtitle="Review, approve, and provide feedback on student submissions" 
      />
      
      <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
          <div className="flex space-x-2 overflow-x-auto">
            {['All', 'Pending', 'Approved', 'Needs Revision'].map((tab) => {
              const count = tab === 'All' 
                ? reports.length 
                : reports.filter(r => r.status === (tab === 'Needs Revision' ? 'Needs Revision' : tab)).length;

              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'shadow-xs text-white'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  style={{
                    backgroundColor: isActive ? 'var(--role-accent, var(--cta))' : 'var(--surface)',
                    borderColor: 'var(--border)',
                    borderWidth: '1px',
                    color: isActive ? '#ffffff' : 'var(--text)'
                  }}
                >
                  <span>{tab}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <span className="text-xs font-mono opacity-60 hidden sm:inline" style={{ color: 'var(--text-muted)' }}>
            Academic Term 2026
          </span>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const isPending = report.status === 'Pending';
            const isApproved = report.status === 'Approved';
            const isNeedsRevision = report.status === 'Needs Revision';

            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-modern rounded-2xl p-6 space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center border"
                      style={{
                        backgroundColor: 'var(--accent-soft)',
                        color: 'var(--role-accent, var(--primary))',
                        borderColor: 'var(--border)'
                      }}
                    >
                      {report.student.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{report.student}</h3>
                        <span className="text-xs font-mono text-slate-400">({report.roll})</span>
                      </div>
                      <div className="text-xs flex items-center gap-2 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        <span className="flex items-center gap-1"><Building2 size={12} /> {report.company}</span>
                        <span>•</span>
                        <span className="font-mono font-semibold" style={{ color: 'var(--role-accent, var(--cta))' }}>{report.week}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400">{report.date}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
                      isPending ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800' :
                      isApproved ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800' :
                      'bg-rose-100 text-rose-900 border border-rose-300 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800'
                    }`}>
                      {isPending && <Clock size={12} />}
                      {isApproved && <CheckCircle2 size={12} />}
                      {isNeedsRevision && <AlertCircle size={12} />}
                      {report.status}
                    </span>
                  </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider font-bold" style={{ color: 'var(--text-muted)' }}>
                    Executive Summary
                  </span>
                  <p className="text-xs md:text-sm leading-relaxed p-3.5 rounded-xl border bg-slate-50/50 dark:bg-slate-800/30" style={{ borderColor: 'var(--border)' }}>
                    "{report.excerpt}"
                  </p>
                </div>

                {/* Tasks Completed */}
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider font-bold block mb-2" style={{ color: 'var(--text-muted)' }}>
                    Key Deliverables
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {report.tasksCompleted.map((task, i) => (
                      <span 
                        key={i} 
                        className="text-xs font-medium px-2.5 py-1 rounded-lg border flex items-center gap-1.5 bg-white dark:bg-slate-800"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {task}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Area */}
                <div className="pt-2 flex items-center justify-between border-t" style={{ borderColor: 'var(--border)' }}>
                  <button 
                    type="button"
                    onClick={() => setSelectedReportId(report.id)}
                    className="text-xs font-semibold hover:opacity-80 flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-lg border transition-colors bg-slate-50 dark:bg-slate-800"
                    style={{ borderColor: 'var(--border)', color: 'var(--role-accent, var(--cta))' }}
                  >
                    <SlidersHorizontal size={13} />
                    <span>Open Slide-Over Review</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {isPending && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleRequestRevision(report.id, '')}
                          className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 dark:border-rose-800 dark:text-rose-300 text-xs font-medium hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <X size={12} />
                          Request Revision
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApprove(report.id)}
                          className="px-4 py-1.5 rounded-lg text-white text-xs font-medium transition-transform active:scale-95 flex items-center gap-1 shadow-xs cursor-pointer"
                          style={{ backgroundColor: 'var(--role-accent, var(--cta))' }}
                        >
                          <Check size={12} />
                          Approve Report
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Slide-over Drawer */}
      <ReviewDrawer
        isOpen={Boolean(selectedReportId)}
        onClose={() => setSelectedReportId(null)}
        data={drawerData}
        onApprove={handleApprove}
        onRequestRevision={handleRequestRevision}
      />
    </div>
  );
}
