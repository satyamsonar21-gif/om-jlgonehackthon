import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Building2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LifecycleStepper, type LifecycleStep } from '@/components/common/LifecycleStepper';

const applications = [
  { id: '1', company: 'TechCorp Solutions', role: 'Software Engineering Intern', appliedDate: 'Jul 10, 2026', status: 'SELECTED', statusLabel: 'Selected & Active', mode: 'Remote', stipend: '₹15,000/mo' },
  { id: '2', company: 'Analytics Pro Labs', role: 'Data Science Intern', appliedDate: 'Jul 15, 2026', status: 'FACULTY_APPROVED', statusLabel: 'Faculty Approved', mode: 'Hybrid', stipend: '₹20,000/mo' },
  { id: '3', company: 'Creative Studio Inc', role: 'UI/UX Design Intern', appliedDate: 'Jul 18, 2026', status: 'UNDER_REVIEW', statusLabel: 'Under Review', mode: 'On-site', stipend: '₹12,000/mo' },
  { id: '4', company: 'StartupXYZ', role: 'Full Stack Developer', appliedDate: 'Jul 5, 2026', status: 'REJECTED', statusLabel: 'Not Selected', mode: 'Remote', stipend: '₹18,000/mo' },
];

const statusStyles: Record<string, { color: string; bg: string; border: string }> = {
  SELECTED: { color: 'text-emerald-800 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-950', border: 'border-emerald-200 dark:border-emerald-800' },
  FACULTY_APPROVED: { color: 'text-indigo-800 dark:text-indigo-300', bg: 'bg-indigo-100 dark:bg-indigo-950', border: 'border-indigo-200 dark:border-indigo-800' },
  UNDER_REVIEW: { color: 'text-amber-800 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-950', border: 'border-amber-200 dark:border-amber-800' },
  REJECTED: { color: 'text-rose-800 dark:text-rose-300', bg: 'bg-rose-100 dark:bg-rose-950', border: 'border-rose-200 dark:border-rose-800' },
};

const getStepsForApp = (status: string): LifecycleStep[] => [
  { id: '1', title: 'Application Submitted', subtitle: 'Resume & portfolio screened', status: 'completed', date: 'Jul 10, 2026' },
  { id: '2', title: 'Faculty NOC Approval', subtitle: 'Academic mentor endorsement', status: 'completed', date: 'Jul 14, 2026' },
  { id: '3', title: 'Technical Evaluation', subtitle: 'Assessment & team interview', status: status === 'SELECTED' ? 'completed' : status === 'UNDER_REVIEW' ? 'current' : status === 'REJECTED' ? 'action_needed' : 'completed', date: 'Jul 22, 2026' },
  { id: '4', title: 'Offer & Onboarding', subtitle: 'Offer letter signed & active hub unlocked', status: status === 'SELECTED' ? 'completed' : 'upcoming' },
];

export default function ApplicationsPage() {
  const [expandedAppId, setExpandedAppId] = useState<string | null>('1');

  return (
    <div className="min-h-full pb-16" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header title="My Applications" subtitle={`${applications.length} internship submissions on file`} />
      
      <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-6">
        {/* KPI Strip */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Submitted', value: applications.length, color: 'text-slate-900 dark:text-slate-100' },
            { label: 'Selected & Active', value: 1, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Under Review', value: 2, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Not Selected', value: 1, color: 'text-rose-600 dark:text-rose-400' },
          ].map((s, i) => (
            <div key={i} className="card-modern p-4 text-center">
              <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.map((app) => {
            const style = statusStyles[app.status] || statusStyles['UNDER_REVIEW'];
            const isExpanded = expandedAppId === app.id;

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-modern p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 border"
                      style={{
                        backgroundColor: 'var(--accent-soft)',
                        color: 'var(--role-accent, var(--primary))',
                        borderColor: 'var(--border)'
                      }}
                    >
                      <Building2 size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>{app.role}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${style.bg} ${style.color} ${style.border}`}>
                          {app.statusLabel}
                        </span>
                      </div>
                      <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>{app.company}</p>
                      <div className="flex items-center gap-3 text-[11px] font-mono mt-2" style={{ color: 'var(--text-muted)' }}>
                        <span>Applied: {app.appliedDate}</span>
                        <span>•</span>
                        <span>{app.mode}</span>
                        <span>•</span>
                        <span className="font-semibold" style={{ color: 'var(--text)' }}>{app.stipend}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {app.status === 'SELECTED' && (
                      <Link
                        to="/student/active"
                        className="px-4 py-2 rounded-lg text-white text-xs font-semibold shadow-xs transition-transform active:scale-95"
                        style={{ backgroundColor: 'var(--role-accent, var(--cta))' }}
                      >
                        Enter Active Hub
                      </Link>
                    )}
                    <button 
                      type="button"
                      onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                      className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Lifecycle Dossier</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Lifecycle Stepper View */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-4 border-t"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <div className="bg-slate-50/70 dark:bg-slate-900/50 rounded-xl p-4 border" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                            Application Milestone Progression
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            Reference: APP-2026-{app.id}
                          </span>
                        </div>
                        <LifecycleStepper steps={getStepsForApp(app.status)} />
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
