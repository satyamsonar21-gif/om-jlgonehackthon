import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import { FileText, CheckCircle2, Clock, Upload, Send, Check, AlertCircle, X, Download } from 'lucide-react';
import { toast } from 'sonner';

interface WeeklyReport {
  week: string;
  title: string;
  date: string;
  status: 'APPROVED' | 'SUBMITTED' | 'NEEDS_REVISION';
  grade: string;
  remarks: string;
  mentor: string;
}

const initialReports: WeeklyReport[] = [
  { week: 'Week 4', title: 'OAuth2 PKCE Flow & Performance Optimization', date: 'Jul 24, 2026', status: 'APPROVED', grade: '5 / 5', remarks: 'Superb architecture overview and clean diagramming.', mentor: 'Dr. Rajesh Kumar' },
  { week: 'Week 3', title: 'PostgreSQL Connection Pooling & Microservices', date: 'Jul 17, 2026', status: 'APPROVED', grade: '4.8 / 5', remarks: 'Good analytical breakdown of query throughput.', mentor: 'Dr. Rajesh Kumar' },
  { week: 'Week 2', title: 'Component Library Migration & State Machine', date: 'Jul 10, 2026', status: 'APPROVED', grade: '4.5 / 5', remarks: 'Solid test coverage documented.', mentor: 'Dr. Rajesh Kumar' },
  { week: 'Week 1', title: 'Onboarding, Repository Setup & Architecture Review', date: 'Jul 3, 2026', status: 'APPROVED', grade: '5 / 5', remarks: 'Completed onboarding sprint milestones ahead of schedule.', mentor: 'Dr. Rajesh Kumar' },
];

export default function WeeklyReportsPage() {
  const [reports, setReports] = useState<WeeklyReport[]>(initialReports);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportSummary, setReportSummary] = useState('');
  const [deliverables, setDeliverables] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) return;

    const newReport: WeeklyReport = {
      week: 'Week 5',
      title: reportTitle,
      date: 'Today, Jul 28, 2026',
      status: 'SUBMITTED',
      grade: 'Pending Evaluation',
      remarks: 'Awaiting academic assessment from Dr. Rajesh Kumar.',
      mentor: 'Dr. Rajesh Kumar'
    };

    setReports([newReport, ...reports]);
    setShowSubmitModal(false);
    toast.success('Week 5 Synthesis Report Submitted for Faculty Evaluation!');
    setReportTitle('');
    setReportSummary('');
    setDeliverables('');
  };

  return (
    <div className="min-h-full pb-16" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header title="Weekly Technical Reports" subtitle="Synthesized progress reports evaluated by faculty academic guide" />
      
      <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-6">
        {/* Next Due Report Card */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-mono font-bold mb-2">
              <Clock size={12} />
              DUE TOMORROW 11:59 PM
            </div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Week 5 Technical Synthesis Report</h2>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Synthesize daily logs from Jul 24 - Jul 31 · Attach pull requests and sprint demos.
            </p>
          </div>

          <button 
            onClick={() => setShowSubmitModal(true)}
            className="px-5 py-3 rounded-xl text-white text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer flex-shrink-0 hover:scale-105"
            style={{ backgroundColor: 'var(--cta)' }}
          >
            <Upload size={14} /> Submit Week 5 Report
          </button>
        </motion.div>

        {/* Historical Reports Ledger */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Submitted Reports History</h3>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{reports.length} Total Submissions</span>
          </div>

          <div className="space-y-3.5">
            {reports.map((report, idx) => (
              <div 
                key={idx} 
                className="rounded-2xl border p-5 space-y-3 shadow-xs transition-all"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl font-mono font-bold text-xs flex items-center justify-center border"
                      style={{
                        backgroundColor: 'var(--accent-soft)',
                        color: 'var(--role-accent, var(--cta))',
                        borderColor: 'var(--border)'
                      }}
                    >
                      {report.week}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm" style={{ color: 'var(--text)' }}>{report.title}</h4>
                      <span className="text-[11px] font-mono opacity-70" style={{ color: 'var(--text-muted)' }}>{report.date} · Evaluator: {report.mentor}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span 
                      className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg border"
                      style={{
                        backgroundColor: 'var(--accent-soft)',
                        color: 'var(--role-accent, var(--cta))',
                        borderColor: 'var(--border)'
                      }}
                    >
                      Grade: {report.grade}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                      {report.status}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border text-xs leading-relaxed bg-slate-50/70 dark:bg-slate-900/60" style={{ borderColor: 'var(--border)' }}>
                  <span className="font-mono font-semibold block mb-0.5" style={{ color: 'var(--role-accent, var(--cta))' }}>Faculty Academic Feedback:</span>
                  <span style={{ color: 'var(--text)' }}>"{report.remarks}"</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Report Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div 
              className="rounded-2xl border shadow-2xl p-6 max-w-lg w-full space-y-4 animate-in fade-in zoom-in-95"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#C2410C]" />
                  <h3 className="font-bold text-sm">Submit Week 5 Technical Synthesis Report</h3>
                </div>
                <button onClick={() => setShowSubmitModal(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold font-mono uppercase text-slate-500 block">Report Title / Milestone Focus</label>
                  <input
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="e.g. Distributed Database Sharding & OAuth2 Security Hardening"
                    className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 focus:outline-none"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold font-mono uppercase text-slate-500 block">Technical Synthesis & Learnings</label>
                  <textarea
                    rows={4}
                    value={reportSummary}
                    onChange={(e) => setReportSummary(e.target.value)}
                    placeholder="Summarize the core technical challenges, algorithms implemented, pull requests submitted, and mentor evaluations..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 focus:outline-none"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 rounded-xl border text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#C2410C] text-white text-xs font-bold font-mono tracking-wider uppercase flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Send size={13} />
                    <span>Submit to Advisor</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
