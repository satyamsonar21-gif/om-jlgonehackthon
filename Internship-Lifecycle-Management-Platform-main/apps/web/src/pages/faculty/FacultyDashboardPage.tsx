import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { 
  FileText, 
  AlertTriangle, 
  Users, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Eye, 
  Sparkles, 
  TrendingUp, 
  Check,
  Building2,
  Bell,
  Mail,
  ShieldAlert,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { facultyCohortStudents } from './FacultyStudentsPage';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { y: 16, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
  }
};

export default function FacultyDashboardPage() {
  const totalStudents = facultyCohortStudents.length; // 42
  const onTrackCount = facultyCohortStudents.filter(s => s.status === 'on_track').length; // 32
  const watchCount = facultyCohortStudents.filter(s => s.status === 'watch').length; // 7
  const atRiskCount = facultyCohortStudents.filter(s => s.status === 'at_risk').length; // 3

  const [urgentStudents, setUrgentStudents] = useState([
    { id: '1', name: 'Vikram Singh', roll: '20CS103', company: 'DataSystems Inc', mentor: 'Rohan Deshmukh', attendance: 65, missingLogs: 3, note: 'Below 75% institutional requirement. 3 consecutive days missing work logs.' },
    { id: '2', name: 'Neha Reddy', roll: '20CS104', company: 'GlobalSoft Systems', mentor: 'Pooja Bhatia', attendance: 70, missingLogs: 2, note: 'Attendance dipped to 70%. Sprint 3 report pending submission.' },
    { id: '3', name: 'Deepak Nair', roll: '20CS115', company: 'CyberShield Security', mentor: 'Vikram Joshi', attendance: 68, missingLogs: 4, note: 'Irregular VPN session timestamps detected during security audit.' },
  ]);

  const [evaluatingReport, setEvaluatingReport] = useState<any | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const reviewQueue = [
    { id: 'r1', name: 'Rahul Sharma', roll: '20CS101', company: 'TechCorp Solutions', report: 'Week 4: OAuth2 PKCE & Microservices Architecture', date: 'Yesterday', hours: 40 },
    { id: 'r2', name: 'Priya Patel', roll: '20CS102', company: 'Innovatech Labs', report: 'Week 4: Real-time Caching with Redis & Queries', date: '2 days ago', hours: 38 },
    { id: 'r3', name: 'Amit Kumar', roll: '20CS105', company: 'TechCorp Solutions', report: 'Week 3: Database Index Tuning & Benchmarking', date: '3 days ago', hours: 42 },
    { id: 'r4', name: 'Sneha Gupta', roll: '20CS106', company: 'DataSystems Inc', report: 'Week 5: UI/UX Component System & Accessibility', date: '3 days ago', hours: 36 },
  ];

  const handleIssueWarning = (student: typeof urgentStudents[0]) => {
    toast.success(`Formal Warning Notice dispatched to ${student.name} (${student.roll})`);
  };

  const handleContactMentor = (student: typeof urgentStudents[0]) => {
    toast.info(`Opened communication thread with Mentor ${student.mentor} at ${student.company}`);
  };

  const handleApproveReport = (report: typeof reviewQueue[0]) => {
    toast.success(`Report for ${report.name} (${report.roll}) Approved!`);
    setEvaluatingReport(null);
    setFeedbackText('');
  };

  return (
    <div className="min-h-full pb-16" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header 
        title="Faculty Observatory" 
        subtitle="Dr. Rajesh Kumar · Dept. of Computer Science & Engineering" 
      />

      <motion.main 
        className="p-6 md:p-8 max-w-7xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Observatory Live Cohort Overview Hero (Clean, Focused, Accurate Numbers) */}
        <motion.div 
          variants={itemVariants}
          className="rounded-2xl p-6 md:p-8 border shadow-lg space-y-6"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text)'
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div 
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold border"
                style={{
                  backgroundColor: 'var(--accent-soft)',
                  color: 'var(--role-accent, var(--cta))',
                  borderColor: 'var(--border)'
                }}
              >
                <Sparkles size={13} />
                <span>LIVE COHORT OBSERVATORY · CSE TERM 2026</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>
                {totalStudents} Supervised Industrial Interns
              </h2>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Active telemetry tracking for all {totalStudents} assigned students across 12 partner organizations. Dynamic monitoring of weekly synthesis reports, biometric attendance, and industry supervisor feedback.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <Link 
                to="/faculty/students"
                className="px-5 py-3 rounded-xl font-bold font-mono text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 hover:scale-105"
                style={{
                  backgroundColor: 'var(--cta)',
                  color: 'var(--cta-text)'
                }}
              >
                <span>View Supervised Cohort</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Status Breakdown Metric Cards (Dynamic & Exact) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-muted)', borderColor: 'var(--border)' }}>
              <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Total Supervised</span>
              <div className="text-2xl font-black font-mono mt-1" style={{ color: 'var(--text)' }}>{totalStudents}</div>
              <span className="text-[11px] font-mono text-slate-500">100% Student Allocation</span>
            </div>

            <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-muted)', borderColor: 'var(--border)' }}>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">On Track</span>
              <div className="text-2xl font-black font-mono text-emerald-600 mt-1">{onTrackCount}</div>
              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">Attendance &gt; 85%</span>
            </div>

            <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-muted)', borderColor: 'var(--border)' }}>
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Watchlist</span>
              <div className="text-2xl font-black font-mono text-amber-600 mt-1">{watchCount}</div>
              <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400">Attendance 75% - 85%</span>
            </div>

            <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-muted)', borderColor: 'var(--border)' }}>
              <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">Urgent Interventions</span>
              <div className="text-2xl font-black font-mono text-rose-600 mt-1">{atRiskCount}</div>
              <span className="text-[11px] font-mono text-rose-700 dark:text-rose-400">Below 75% threshold</span>
            </div>
          </div>
        </motion.div>

        {/* 2. Review Queue & Urgent Actions Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Review Queue (Fixed patterns, shapes, and clear visibility) */}
          <div 
            className="lg:col-span-7 rounded-2xl border p-6 space-y-4 shadow-sm"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text)'
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Weekly Synthesis Review Queue</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>4 submissions awaiting academic grading</p>
              </div>
              <Link to="/faculty/reports" className="text-xs font-mono font-bold hover:underline" style={{ color: 'var(--role-accent, var(--cta))' }}>
                View All Queue (5)
              </Link>
            </div>

            <div className="space-y-3">
              {reviewQueue.map((r, i) => (
                <div 
                  key={i} 
                  className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:scale-[1.01]"
                  style={{ backgroundColor: 'var(--surface-muted)', borderColor: 'var(--border)' }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs" style={{ color: 'var(--text)' }}>{r.name}</span>
                      <span className="text-[11px] font-mono text-slate-400 font-semibold">({r.roll})</span>
                    </div>
                    <p className="text-xs font-semibold leading-snug" style={{ color: 'var(--role-accent, var(--cta))' }}>
                      {r.report}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-mono opacity-75" style={{ color: 'var(--text-muted)' }}>
                      <span>{r.company}</span>
                      <span>•</span>
                      <span>{r.hours} Hours Logged</span>
                      <span>•</span>
                      <span>{r.date}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setEvaluatingReport(r);
                      toast.info(`Opening review evaluation for ${r.name}`);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wider uppercase shadow-xs flex items-center justify-center gap-1.5 transition-all hover:scale-105 cursor-pointer text-white flex-shrink-0"
                    style={{ backgroundColor: 'var(--cta)' }}
                  >
                    <span>Evaluate</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Urgent Interventions (Fixed Color Combination for high contrast & clear text visibility) */}
          <div 
            className="lg:col-span-5 rounded-2xl border p-6 space-y-4 shadow-sm"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text)'
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Urgent Compliance Interventions</h3>
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{urgentStudents.length} students flagged by compliance rules</p>
              </div>
              <ShieldAlert className="w-5 h-5 text-rose-500" />
            </div>

            <div className="space-y-3">
              {urgentStudents.map((s) => (
                <div 
                  key={s.id} 
                  className="p-4 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-900 dark:text-rose-200">{s.name} ({s.roll})</span>
                    <span className="text-[10px] font-mono font-bold bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
                      {s.attendance}% Attendance
                    </span>
                  </div>

                  <p className="text-[11px] text-rose-800 dark:text-rose-300 leading-relaxed font-medium">
                    {s.note}
                  </p>

                  <div className="text-[10px] font-mono text-rose-700 dark:text-rose-400">
                    Host: {s.company} · Lead: {s.mentor}
                  </div>

                  <div className="pt-1.5 flex flex-wrap gap-2">
                    <button 
                      onClick={() => handleIssueWarning(s)}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      Issue Warning
                    </button>
                    <button 
                      onClick={() => handleContactMentor(s)}
                      className="px-3 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Contact Mentor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Evaluation Modal */}
        {evaluatingReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div 
              className="rounded-2xl border shadow-2xl p-6 max-w-lg w-full space-y-4 animate-in fade-in zoom-in-95"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#059669]" />
                  <h3 className="font-bold text-sm">Academic Synthesis Evaluation</h3>
                </div>
                <button onClick={() => setEvaluatingReport(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-900 space-y-1 font-mono" style={{ borderColor: 'var(--border)' }}>
                  <p><strong>Student:</strong> {evaluatingReport.name} ({evaluatingReport.roll})</p>
                  <p><strong>Organization:</strong> {evaluatingReport.company}</p>
                  <p><strong>Submission:</strong> {evaluatingReport.report}</p>
                  <p><strong>Hours Logged:</strong> {evaluatingReport.hours}h Verified</p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold font-mono uppercase text-slate-500 block">Faculty Evaluator Feedback & Grade</label>
                  <textarea
                    rows={3}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Enter academic feedback, methodology assessment, and grade recommendations..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 focus:outline-none"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <button
                  type="button"
                  onClick={() => {
                    toast.warning(`Requested revision from ${evaluatingReport.name}`);
                    setEvaluatingReport(null);
                  }}
                  className="px-3 py-2 rounded-xl border border-rose-300 text-rose-700 text-xs font-semibold hover:bg-rose-50 cursor-pointer"
                >
                  Request Revision
                </button>
                <button
                  type="button"
                  onClick={() => handleApproveReport(evaluatingReport)}
                  className="px-5 py-2 rounded-xl bg-[#059669] text-white text-xs font-bold font-mono tracking-wider uppercase flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Check size={13} />
                  <span>Approve & Sign Off</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.main>
    </div>
  );
}
