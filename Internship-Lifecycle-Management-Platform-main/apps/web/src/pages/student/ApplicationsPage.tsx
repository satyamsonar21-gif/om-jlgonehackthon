import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { FileText, Building2, Clock, ChevronRight, CheckCircle, XCircle, AlertCircle, Loader2, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

const applications = [
  { id: '1', company: 'TechCorp Solutions', role: 'Software Engineering Intern', appliedDate: 'Jul 10, 2026', status: 'SELECTED', statusLabel: 'Selected & Active', mode: 'Remote', stipend: '₹15,000/mo' },
  { id: '2', company: 'Analytics Pro Labs', role: 'Data Science Intern', appliedDate: 'Jul 15, 2026', status: 'FACULTY_APPROVED', statusLabel: 'Faculty Approved', mode: 'Hybrid', stipend: '₹20,000/mo' },
  { id: '3', company: 'Creative Studio Inc', role: 'UI/UX Design Intern', appliedDate: 'Jul 18, 2026', status: 'UNDER_REVIEW', statusLabel: 'Under Review', mode: 'On-site', stipend: '₹12,000/mo' },
  { id: '4', company: 'StartupXYZ', role: 'Full Stack Developer', appliedDate: 'Jul 5, 2026', status: 'REJECTED', statusLabel: 'Not Selected', mode: 'Remote', stipend: '₹18,000/mo' },
];

const statusStyles: Record<string, { color: string; bg: string; border: string }> = {
  SELECTED: { color: 'text-emerald-800', bg: 'bg-emerald-100', border: 'border-emerald-200' },
  FACULTY_APPROVED: { color: 'text-[#4338CA]', bg: 'bg-[#EEF2FF]', border: 'border-[#C7D2FE]' },
  UNDER_REVIEW: { color: 'text-amber-800', bg: 'bg-amber-100', border: 'border-amber-200' },
  REJECTED: { color: 'text-rose-800', bg: 'bg-rose-100', border: 'border-rose-200' },
};

export default function ApplicationsPage() {
  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="My Applications" subtitle={`${applications.length} internship submissions on file`} />
      
      <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-6">
        {/* KPI Strip */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Submitted', value: applications.length, color: 'text-slate-900' },
            { label: 'Selected & Active', value: 1, color: 'text-emerald-700' },
            { label: 'Under Review', value: 2, color: 'text-amber-700' },
            { label: 'Not Selected', value: 1, color: 'text-rose-700' },
          ].map((s, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Applications List */}
        <div className="space-y-3.5">
          {applications.map((app) => {
            const style = statusStyles[app.status] || statusStyles['UNDER_REVIEW'];

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="interactive-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-teal-50 text-[#0D9488] border border-teal-200 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-slate-900">{app.role}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${style.bg} ${style.color} ${style.border}`}>
                        {app.statusLabel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{app.company}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-2">
                      <span>Applied: {app.appliedDate}</span>
                      <span>•</span>
                      <span>{app.mode}</span>
                      <span>•</span>
                      <span className="text-slate-700 font-semibold">{app.stipend}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {app.status === 'SELECTED' && (
                    <Link
                      to="/student/active"
                      className="px-4 py-2 rounded-xl bg-[#0D9488] text-white text-xs font-semibold hover:bg-[#0F766E] transition-colors shadow-xs"
                    >
                      Enter Active Hub
                    </Link>
                  )}
                  <button className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors">
                    View Application Dossier
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
