import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import { FileText, CheckCircle2, Clock, AlertCircle, Building2, User, ChevronRight, Check, X, MessageSquare } from 'lucide-react';

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
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>('');

  const filteredReports = reports.filter(report => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Pending') return report.status === 'Pending';
    if (activeTab === 'Approved') return report.status === 'Approved';
    if (activeTab === 'Needs Revision') return report.status === 'Needs Revision';
    return true;
  });

  const handleStatusChange = (id: string, newStatus: 'Approved' | 'Needs Revision') => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    setReviewingId(null);
    setFeedbackText('');
  };

  return (
    <div className="min-h-full pb-16">
      <Header 
        title="Weekly Report Review Queue" 
        subtitle="Review, approve, and provide feedback on student submissions" 
      />
      
      <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-6 text-[#142326]">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#0B525B]/15 pb-3">
          <div className="flex space-x-2 overflow-x-auto">
            {['All', 'Pending', 'Approved', 'Needs Revision'].map((tab) => {
              const count = tab === 'All' 
                ? reports.length 
                : reports.filter(r => r.status === (tab === 'Needs Revision' ? 'Needs Revision' : tab)).length;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === tab
                      ? 'bg-[#0B525B] text-white shadow-sm'
                      : 'bg-[#FFFDF8] text-[#142326]/70 border border-[#0B525B]/10 hover:bg-[#F4F0E6]'
                  }`}
                >
                  <span>{tab}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    activeTab === tab ? 'bg-white/20 text-white' : 'bg-[#142326]/10 text-[#142326]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <span className="text-xs font-mono text-[#142326]/50 hidden sm:inline">
            Academic Term 2026
          </span>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const isPending = report.status === 'Pending';
            const isApproved = report.status === 'Approved';
            const isNeedsRevision = report.status === 'Needs Revision';
            const isSelected = reviewingId === report.id;

            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#FFFDF8] rounded-2xl border border-[#0B525B]/15 shadow-sm p-6 space-y-4 transition-all hover:border-[#0B525B]/30"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#0B525B]/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0B525B]/10 text-[#0B525B] font-bold text-xs flex items-center justify-center border border-[#0B525B]/20">
                      {report.student.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-[#142326]">{report.student}</h3>
                        <span className="text-xs font-mono text-[#142326]/50">({report.roll})</span>
                      </div>
                      <div className="text-xs text-[#142326]/65 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1"><Building2 size={12} /> {report.company}</span>
                        <span>•</span>
                        <span className="font-mono text-[#0B525B] font-semibold">{report.week}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#142326]/50">{report.date}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
                      isPending ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      isApproved ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                      'bg-rose-100 text-rose-900 border border-rose-300'
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
                  <span className="text-xs font-mono uppercase tracking-wider text-[#142326]/50 font-bold">Executive Summary</span>
                  <p className="text-xs md:text-sm text-[#142326]/85 leading-relaxed bg-[#FBF9F4] p-3.5 rounded-xl border border-[#0B525B]/10">
                    "{report.excerpt}"
                  </p>
                </div>

                {/* Tasks Completed */}
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#142326]/50 font-bold block mb-2">Key Deliverables</span>
                  <div className="flex flex-wrap gap-2">
                    {report.tasksCompleted.map((task, i) => (
                      <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white border border-[#0B525B]/15 text-[#142326]/80 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0B525B]" />
                        {task}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Area */}
                <div className="pt-2 flex items-center justify-between border-t border-[#0B525B]/10">
                  <button 
                    onClick={() => setReviewingId(isSelected ? null : report.id)}
                    className="text-xs font-semibold text-[#0B525B] hover:text-[#073940] flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare size={13} />
                    <span>{isSelected ? 'Close Review Panel' : 'Add Faculty Feedback'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleStatusChange(report.id, 'Needs Revision')}
                          className="px-3 py-1.5 rounded-xl bg-white border border-rose-300 text-rose-700 text-xs font-medium hover:bg-rose-50 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <X size={12} />
                          Request Revision
                        </button>
                        <button
                          onClick={() => handleStatusChange(report.id, 'Approved')}
                          className="px-4 py-1.5 rounded-xl bg-[#0B525B] text-white text-xs font-medium hover:bg-[#073940] transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
                        >
                          <Check size={12} />
                          Approve Report
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Inline Review Panel */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-4 border-t border-[#0B525B]/10 space-y-3"
                    >
                      <label className="text-xs font-mono font-semibold text-[#142326]/70 block">
                        Academic Mentor Evaluation Notes:
                      </label>
                      <textarea
                        rows={3}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Write constructive remarks or technical advice for the student..."
                        className="w-full bg-white border border-[#142326]/20 rounded-xl p-3 text-xs text-[#142326] focus:outline-none focus:border-[#0B525B] focus:ring-2 focus:ring-[#0B525B]/20"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleStatusChange(report.id, 'Approved')}
                          className="px-4 py-2 rounded-xl bg-[#0B525B] text-white text-xs font-medium hover:bg-[#073940]"
                        >
                          Save & Approve Report
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
