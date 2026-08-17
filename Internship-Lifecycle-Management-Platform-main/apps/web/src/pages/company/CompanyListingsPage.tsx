import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Link } from 'react-router-dom';
import { Plus, Briefcase, Users, Calendar, Eye, IndianRupee, ChevronRight } from 'lucide-react';

const listings = [
  { id: '1', title: 'Software Engineering Intern', domain: 'Engineering', mode: 'Remote', stipend: '₹15,000/mo', openings: 3, applications: 12, deadline: 'Aug 15, 2026', status: 'OPEN' },
  { id: '2', title: 'Data Analyst & ML Intern', domain: 'Data Science', mode: 'Hybrid (Bangalore)', stipend: '₹18,000/mo', openings: 2, applications: 8, deadline: 'Aug 20, 2026', status: 'OPEN' },
  { id: '3', title: 'DevOps & Cloud Engineer', domain: 'Engineering', mode: 'On-site', stipend: '₹20,000/mo', openings: 1, applications: 5, deadline: 'Jul 31, 2026', status: 'CLOSED' },
];

export default function CompanyListingsPage() {
  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="Company Listings & Open Roles" subtitle="Manage active recruitment postings for university interns" />
      
      <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono text-slate-500 font-bold uppercase">{listings.length} Active Postings</span>
          <Link 
            to="/company/listings/new" 
            className="px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus size={14} /> Post New Listing
          </Link>
        </div>

        <div className="space-y-4">
          {listings.map((l, i) => (
            <motion.div 
              key={l.id} 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.06 }}
              className="interactive-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0284C7] border border-sky-200 flex items-center justify-center font-bold shadow-xs flex-shrink-0">
                  <Briefcase size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-slate-900">{l.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      l.status === 'OPEN' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {l.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-mono mt-2">
                    <span className="flex items-center gap-1 font-semibold text-slate-900"><IndianRupee size={12} />{l.stipend}</span>
                    <span className="flex items-center gap-1"><Users size={12} />{l.openings} openings · {l.applications} applied</span>
                    <span className="flex items-center gap-1"><Calendar size={12} />Deadline: {l.deadline}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/company/applications"
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Eye size={13} /> View Candidates ({l.applications})
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
