import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { FileText, Check, X, User, GraduationCap, Building2, CheckCircle2, Clock } from 'lucide-react';

export default function CompanyApplicationsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Shortlisted', 'Pending', 'Rejected'];
  
  const [apps, setApps] = useState([
    { id: 1, name: 'Rahul Sharma', roll: '20CS101', college: 'CSE Dept', cgpa: '8.5', role: 'Frontend Developer Intern', date: '2 days ago', skills: ['React', 'Next.js', 'Tailwind'], status: 'Pending' },
    { id: 2, name: 'Priya Patel', roll: '20CS102', college: 'IT Dept', cgpa: '9.1', role: 'UI/UX Design Intern', date: '3 days ago', skills: ['Figma', 'Prototyping', 'User Research'], status: 'Shortlisted' },
    { id: 3, name: 'Amit Kumar', roll: '20CS105', college: 'CSE Dept', cgpa: '7.8', role: 'Backend Developer Intern', date: '5 days ago', skills: ['Node.js', 'Express', 'PostgreSQL'], status: 'Shortlisted' },
    { id: 4, name: 'Sneha Gupta', roll: '20CS106', college: 'Data Science', cgpa: '8.2', role: 'Data Science Intern', date: '1 week ago', skills: ['Python', 'Pandas', 'Machine Learning'], status: 'Rejected' },
  ]);

  const handleAction = (id: number, newStatus: string) => {
    setApps(apps.map(app => app.id === id ? { ...app, status: newStatus } : app));
  };

  const filteredApps = apps.filter(app => activeTab === 'All' || app.status === activeTab);

  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="Candidate Application Pipeline" subtitle="Review candidate resumes, GPA, and technical portfolios" />
      
      <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => {
              const count = tab === 'All' ? apps.length : apps.filter(a => a.status === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === tab
                      ? 'bg-[#0284C7] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{tab}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            TechCorp Recruitment Pool
          </span>
        </div>

        {/* Applications List */}
        <div className="space-y-3.5">
          {filteredApps.map((app) => {
            const isPending = app.status === 'Pending';
            const isShortlisted = app.status === 'Shortlisted';
            const isRejected = app.status === 'Rejected';

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="interactive-card p-6 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-sky-50 text-[#0284C7] border border-sky-200 font-bold text-sm flex items-center justify-center">
                      {app.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900">{app.name}</h3>
                        <span className="text-xs font-mono text-slate-400">({app.roll})</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {app.role} · <span className="font-mono text-slate-700">CGPA: {app.cgpa}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400">{app.date}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                      isPending ? 'bg-amber-50 text-amber-800 border-amber-200' :
                      isShortlisted ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap gap-1.5">
                    {app.skills.map(s => (
                      <span key={s} className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleAction(app.id, 'Rejected')}
                          className="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-50 cursor-pointer"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleAction(app.id, 'Shortlisted')}
                          className="px-4 py-1.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold shadow-xs cursor-pointer"
                        >
                          Shortlist for Interview
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
    </div>
  );
}
