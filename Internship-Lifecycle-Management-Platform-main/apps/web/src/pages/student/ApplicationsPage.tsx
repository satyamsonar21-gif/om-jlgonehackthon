import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Building2, X, ChevronDown, ChevronUp, CheckCircle2, Clock, AlertCircle, Eye, Download, FileText, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LifecycleStepper, type LifecycleStep } from '@/components/common/LifecycleStepper';
import { toast } from 'sonner';

interface ApplicationItem {
  id: string;
  company: string;
  role: string;
  appliedDate: string;
  status: 'SELECTED' | 'FACULTY_APPROVED' | 'UNDER_REVIEW' | 'REJECTED';
  statusLabel: string;
  mode: string;
  stipend: string;
  location: string;
  mentor: string;
}

const initialApplications: ApplicationItem[] = [
  { id: '1', company: 'TechCorp Solutions', role: 'Software Engineering Intern', appliedDate: 'Jul 10, 2026', status: 'SELECTED', statusLabel: 'Selected & Active', mode: 'Remote (IP Verified)', stipend: '₹15,000/mo', location: 'Bangalore, India', mentor: 'Siddharth Nambiar' },
  { id: '2', company: 'Analytics Pro Labs', role: 'Data Science & AI Intern', appliedDate: 'Jul 15, 2026', status: 'FACULTY_APPROVED', statusLabel: 'Faculty Approved', mode: 'Hybrid', stipend: '₹20,000/mo', location: 'Hyderabad, India', mentor: 'Dr. Neha Verma' },
  { id: '3', company: 'Creative Studio Inc', role: 'UI/UX & Product Design Intern', appliedDate: 'Jul 18, 2026', status: 'UNDER_REVIEW', statusLabel: 'Under Review', mode: 'On-site', stipend: '₹12,000/mo', location: 'Mumbai, India', mentor: 'Rohan Deshmukh' },
  { id: '4', company: 'CloudBase Systems', role: 'DevOps & Cloud Intern', appliedDate: 'Jul 05, 2026', status: 'REJECTED', statusLabel: 'Not Selected', mode: 'Remote', stipend: '₹18,000/mo', location: 'Pune, India', mentor: 'Aakash Mehra' },
  { id: '5', company: 'FinTech Nexus Global', role: 'Backend API Developer', appliedDate: 'Jul 22, 2026', status: 'UNDER_REVIEW', statusLabel: 'Under Review', mode: 'Hybrid', stipend: '₹22,000/mo', location: 'Gurgaon, India', mentor: 'Pooja Bhatia' },
  { id: '6', company: 'NextGen AI Labs', role: 'NLP Research Intern', appliedDate: 'Jul 20, 2026', status: 'FACULTY_APPROVED', statusLabel: 'Faculty Approved', mode: 'Remote', stipend: '₹25,000/mo', location: 'Delhi, India', mentor: 'Dr. Sandeep Rao' },
];

const getStepsForApp = (status: string): LifecycleStep[] => [
  { id: '1', title: 'Application Submitted', subtitle: 'Resume & portfolio screened', status: 'completed', date: 'Jul 10, 2026' },
  { id: '2', title: 'Faculty NOC Approval', subtitle: 'Academic mentor endorsement', status: 'completed', date: 'Jul 14, 2026' },
  { id: '3', title: 'Technical Evaluation', subtitle: 'Assessment & team interview', status: status === 'SELECTED' ? 'completed' : status === 'UNDER_REVIEW' ? 'current' : status === 'REJECTED' ? 'action_needed' : 'completed', date: 'Jul 22, 2026' },
  { id: '4', title: 'Offer & Onboarding', subtitle: 'Offer letter signed & active hub unlocked', status: status === 'SELECTED' ? 'completed' : 'upcoming' },
];

export default function ApplicationsPage() {
  const [apps, setApps] = useState<ApplicationItem[]>(initialApplications);
  const [expandedAppId, setExpandedAppId] = useState<string | null>('1');
  const [filterTab, setFilterTab] = useState<string>('ALL');
  const [viewingOffer, setViewingOffer] = useState<ApplicationItem | null>(null);

  const filteredApps = apps.filter(app => {
    if (filterTab === 'ALL') return true;
    return app.status === filterTab;
  });

  const handleWithdraw = (id: string, company: string) => {
    setApps(prev => prev.filter(a => a.id !== id));
    toast.success(`Application for ${company} withdrawn`);
  };

  return (
    <div className="min-h-full pb-16" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header title="My Internship Applications" subtitle={`${apps.length} candidate submissions tracked across university-partner employers`} />
      
      <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-6">
        {/* KPI Strip */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Submitted', value: apps.length, color: 'text-slate-900 dark:text-slate-100', tab: 'ALL' },
            { label: 'Selected & Active', value: apps.filter(a => a.status === 'SELECTED').length, color: 'text-emerald-600 dark:text-emerald-400', tab: 'SELECTED' },
            { label: 'Under Review', value: apps.filter(a => a.status === 'UNDER_REVIEW' || a.status === 'FACULTY_APPROVED').length, color: 'text-amber-600 dark:text-amber-400', tab: 'UNDER_REVIEW' },
            { label: 'Not Selected', value: apps.filter(a => a.status === 'REJECTED').length, color: 'text-rose-600 dark:text-rose-400', tab: 'REJECTED' },
          ].map((s, i) => (
            <button
              key={i}
              onClick={() => setFilterTab(s.tab)}
              className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                filterTab === s.tab ? 'ring-2 ring-[#C2410C] shadow-sm' : 'hover:scale-[1.02]'
              }`}
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text)'
              }}
            >
              <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
              <p className="text-xs mt-1 font-medium" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </button>
          ))}
        </motion.div>

        {/* Filter Pills Bar */}
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'ALL', label: `All Applications (${apps.length})` },
              { id: 'SELECTED', label: 'Selected' },
              { id: 'FACULTY_APPROVED', label: 'Faculty Approved' },
              { id: 'UNDER_REVIEW', label: 'Under Review' },
              { id: 'REJECTED', label: 'Not Selected' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                  filterTab === tab.id
                    ? 'bg-[#C2410C] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono hidden sm:inline" style={{ color: 'var(--text-muted)' }}>
            Batch Fall 2026
          </span>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const isSelected = app.status === 'SELECTED';
            const isFacultyApproved = app.status === 'FACULTY_APPROVED';
            const isUnderReview = app.status === 'UNDER_REVIEW';
            const isRejected = app.status === 'REJECTED';
            const isExpanded = expandedAppId === app.id;

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border p-5 sm:p-6 space-y-4 shadow-sm transition-all"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)'
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base flex-shrink-0 border shadow-xs"
                      style={{
                        backgroundColor: 'var(--accent-soft)',
                        color: 'var(--role-accent, var(--cta))',
                        borderColor: 'var(--border)'
                      }}
                    >
                      <Building2 size={22} />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-bold text-sm sm:text-base leading-tight" style={{ color: 'var(--text)' }}>
                          {app.role}
                        </h3>
                        
                        {/* High-Contrast Status Badges */}
                        {isSelected && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            Selected & Active
                          </span>
                        )}
                        {isFacultyApproved && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 flex items-center gap-1">
                            <Sparkles size={12} />
                            Faculty Endorsed
                          </span>
                        )}
                        {isUnderReview && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                            <Clock size={12} />
                            Under Review
                          </span>
                        )}
                        {isRejected && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1">
                            <AlertCircle size={12} />
                            Not Selected
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold" style={{ color: 'var(--role-accent, var(--cta))' }}>
                        {app.company} · <span className="font-normal opacity-80" style={{ color: 'var(--text-muted)' }}>{app.location}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono pt-1" style={{ color: 'var(--text-muted)' }}>
                        <span>Applied: {app.appliedDate}</span>
                        <span>•</span>
                        <span>{app.mode}</span>
                        <span>•</span>
                        <span className="font-bold font-mono" style={{ color: 'var(--text)' }}>{app.stipend}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div className="flex flex-wrap items-center gap-2">
                    {isSelected && (
                      <Link
                        to="/student/active"
                        className="px-4 py-2 rounded-xl text-white text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-xs flex items-center gap-1.5 hover:scale-105"
                        style={{ backgroundColor: 'var(--cta)' }}
                      >
                        <span>Active Hub</span>
                      </Link>
                    )}

                    {isSelected && (
                      <button
                        onClick={() => {
                          setViewingOffer(app);
                          toast.success('Offer Letter Dossier Loaded');
                        }}
                        className="px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                      >
                        <FileText size={13} />
                        <span>Offer Letter</span>
                      </button>
                    )}

                    {!isSelected && isUnderReview && (
                      <button
                        onClick={() => handleWithdraw(app.id, app.company)}
                        className="px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer"
                      >
                        Withdraw
                      </button>
                    )}

                    <button 
                      type="button"
                      onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                      className="px-3.5 py-2 rounded-xl border text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                      style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
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
                      <div 
                        className="rounded-2xl p-4 sm:p-5 border space-y-3"
                        style={{
                          backgroundColor: 'var(--surface-muted)',
                          borderColor: 'var(--border)'
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                            Milestone Verification & Progression
                          </span>
                          <span className="text-[11px] font-mono opacity-60">
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

        {/* Offer Letter Modal */}
        {viewingOffer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div 
              className="rounded-2xl border shadow-2xl p-6 max-w-lg w-full space-y-5 animate-in fade-in zoom-in-95"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#C2410C]" />
                  <h3 className="font-bold text-sm">Industrial Offer Letter Dossier</h3>
                </div>
                <button onClick={() => setViewingOffer(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-4 rounded-xl border bg-slate-50/70 dark:bg-slate-900/60 space-y-2 font-mono" style={{ borderColor: 'var(--border)' }}>
                  <p><strong>Candidate:</strong> Priya Sharma (20CS101)</p>
                  <p><strong>Employer:</strong> {viewingOffer.company}</p>
                  <p><strong>Assigned Role:</strong> {viewingOffer.role}</p>
                  <p><strong>Stipend:</strong> {viewingOffer.stipend}</p>
                  <p><strong>Start Date:</strong> Aug 01, 2026 (12 Weeks)</p>
                  <p><strong>Mentor:</strong> {viewingOffer.mentor}</p>
                </div>
                <p className="text-[11px] opacity-75">
                  This electronic offer letter is cryptographically backed and registered with the university academic council.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <button
                  onClick={() => {
                    toast.success('Offer Letter Downloaded');
                    setViewingOffer(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#C2410C] text-white text-xs font-bold font-mono tracking-wider uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download Signed PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
