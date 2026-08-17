import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Plus, ShieldCheck, ShieldAlert, Building2, Users, ChevronRight } from 'lucide-react';

export default function AdminCompaniesPage() {
  const [filter, setFilter] = useState('All');

  const companies = [
    { id: 1, name: 'TechCorp Solutions', initials: 'TC', industry: 'Enterprise Software', interns: 12, verified: true, mouSigned: 'Valid until 2028' },
    { id: 2, name: 'Innovatech Labs', initials: 'IL', industry: 'FinTech & AI', interns: 8, verified: true, mouSigned: 'Valid until 2027' },
    { id: 3, name: 'DataSystems Inc', initials: 'DS', industry: 'Cloud & Data Infrastructure', interns: 15, verified: true, mouSigned: 'Valid until 2027' },
    { id: 4, name: 'Creative Studio Inc', initials: 'CS', industry: 'UI/UX & Product Design', interns: 5, verified: true, mouSigned: 'Valid until 2026' },
    { id: 5, name: 'GlobalSoft Systems', initials: 'GS', industry: 'QA & Enterprise Automation', interns: 6, verified: true, mouSigned: 'Valid until 2028' },
    { id: 6, name: 'StartupXYZ Hub', initials: 'SX', industry: 'Web3 & Full Stack', interns: 3, verified: false, mouSigned: 'Pending Audit' },
  ];

  const filtered = companies.filter(c => {
    if (filter === 'Verified') return c.verified;
    if (filter === 'Pending') return !c.verified;
    return true;
  });

  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="Partner Organizations & MoU Registry" subtitle="142 verified industry employer partnerships" />
      
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-2">
            {['All', 'Verified', 'Pending'].map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  filter === tab 
                    ? 'bg-[#BE123C] text-white shadow-xs' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button className="px-4 py-2.5 rounded-xl bg-[#BE123C] hover:bg-[#9F1239] text-white text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-xs flex items-center gap-1.5 cursor-pointer">
            <Plus size={14} /> Onboard Partner Company
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <motion.div 
              key={c.id} 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }}
              className="interactive-card p-6 flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#BE123C] border border-rose-200 flex items-center justify-center font-bold text-base shadow-xs">
                    {c.initials}
                  </div>
                  {c.verified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full">
                      <ShieldCheck size={12} /> MoU Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
                      <ShieldAlert size={12} /> Pending Verification
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-slate-900">{c.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{c.industry}</p>
                <span className="text-[11px] font-mono text-slate-400 block mt-2">{c.mouSigned}</span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-700">{c.interns} Deployed Interns</span>
                <button className="text-xs font-semibold text-[#BE123C] hover:underline flex items-center gap-1">
                  <span>Manage</span>
                  <ChevronRight size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
