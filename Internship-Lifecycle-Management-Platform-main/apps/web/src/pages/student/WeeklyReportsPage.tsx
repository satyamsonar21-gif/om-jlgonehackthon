import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { FileText, CheckCircle2, Clock, Upload, Send, Check, AlertCircle } from 'lucide-react';

const reports = [
  { week: 'Week 4', title: 'OAuth2 PKCE Flow & Performance Optimization', date: 'Jul 24, 2026', status: 'APPROVED', grade: '5 / 5', remarks: 'Superb architecture overview and clean diagramming.', mentor: 'Dr. Rajesh Kumar' },
  { week: 'Week 3', title: 'PostgreSQL Connection Pooling & Microservices', date: 'Jul 17, 2026', status: 'APPROVED', grade: '4.8 / 5', remarks: 'Good analytical breakdown of query throughput.', mentor: 'Dr. Rajesh Kumar' },
  { week: 'Week 2', title: 'Component Library Migration & State Machine', date: 'Jul 10, 2026', status: 'APPROVED', grade: '4.5 / 5', remarks: 'Solid test coverage documented.', mentor: 'Dr. Rajesh Kumar' },
  { week: 'Week 1', title: 'Onboarding, Repository Setup & Architecture Review', date: 'Jul 3, 2026', status: 'APPROVED', grade: '5 / 5', remarks: 'Completed onboarding sprint milestones ahead of schedule.', mentor: 'Dr. Rajesh Kumar' },
];

export default function WeeklyReportsPage() {
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="Weekly Technical Reports" subtitle="Synthesized progress reports evaluated by faculty guide" />
      
      <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-6">
        {/* Next Due Report Card */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono font-bold mb-2">
              <Clock size={12} />
              DUE TOMORROW 11:59 PM
            </div>
            <h2 className="text-xl font-bold text-slate-900">Week 5 Technical Synthesis Report</h2>
            <p className="text-xs text-slate-500 mt-1">
              Synthesize daily logs from Jul 24 - Jul 31 · Attach pull requests and sprint demos.
            </p>
          </div>

          <button 
            onClick={() => setShowSubmitModal(true)}
            className="px-5 py-3 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-xs flex items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <Upload size={14} /> Submit Week 5 Report
          </button>
        </motion.div>

        {/* Historical Reports Ledger */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Submitted Reports History</h3>
            <span className="text-xs font-mono text-slate-400">4 Approved · 0 Overdue</span>
          </div>

          <div className="space-y-3.5">
            {reports.map((report, idx) => (
              <div key={idx} className="interactive-card p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0D9488] border border-teal-200 font-mono font-bold text-xs flex items-center justify-center">
                      W{4 - idx}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{report.title}</h4>
                      <span className="text-[11px] text-slate-400 font-mono">{report.date} · Evaluator: {report.mentor}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#0D9488] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                      Grade: {report.grade}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {report.status}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-600">
                  <span className="font-mono font-semibold text-slate-700 block mb-0.5">Faculty Feedback:</span>
                  "{report.remarks}"
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
