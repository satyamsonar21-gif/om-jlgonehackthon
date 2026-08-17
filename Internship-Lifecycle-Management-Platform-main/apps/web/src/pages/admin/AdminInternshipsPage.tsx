import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Search, Briefcase, Building2, GraduationCap, Calendar, CheckCircle2, Clock } from 'lucide-react';

const allInternships = [
  { id: '1', student: 'Priya Sharma', roll: '20CS101', company: 'TechCorp Solutions', role: 'Software Engineering Intern', startDate: 'Jul 1, 2026', endDate: 'Sep 30, 2026', status: 'ACTIVE', progress: 33 },
  { id: '2', student: 'Rahul Patel', roll: '20CS102', company: 'Innovatech Labs', role: 'Data Science & AI Intern', startDate: 'Jul 15, 2026', endDate: 'Oct 15, 2026', status: 'ACTIVE', progress: 25 },
  { id: '3', student: 'Meera Iyer', roll: '20CS109', company: 'CloudBase Systems', role: 'DevOps & Cloud Intern', startDate: 'Jun 15, 2026', endDate: 'Sep 15, 2026', status: 'ACTIVE', progress: 50 },
  { id: '4', student: 'Karan Mehta', roll: '20CS108', company: 'StartupXYZ', role: 'Full Stack Web Intern', startDate: 'May 1, 2026', endDate: 'Jul 31, 2026', status: 'COMPLETED', progress: 100 },
];

export default function AdminInternshipsPage() {
  const [search, setSearch] = useState('');
  const filtered = allInternships.filter(i => i.student.toLowerCase().includes(search.toLowerCase()) || i.company.toLowerCase().includes(search.toLowerCase()) || i.role.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="All Institutional Internships" subtitle="Audit all active, completed, and pending undergraduate placements" />
      
      <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Search internships by student, host company, or domain..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none input-focus-ring"
              style={{ '--primary': '#BE123C' } as React.CSSProperties}
            />
          </div>
        </div>

        <div className="space-y-3.5">
          {filtered.map((intern, i) => (
            <motion.div 
              key={intern.id} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="interactive-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#BE123C] border border-rose-200 flex items-center justify-center font-bold shadow-xs flex-shrink-0">
                  <Briefcase size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm text-slate-900">{intern.role}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      intern.status === 'COMPLETED' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : 'bg-rose-50 text-[#BE123C] border-rose-200'
                    }`}>
                      {intern.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {intern.student} ({intern.roll}) · <span className="font-bold text-slate-800">{intern.company}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                    <Calendar size={11} /> {intern.startDate} – {intern.endDate}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1.5 flex-shrink-0">
                <div className="text-xs font-mono font-bold text-slate-900">{intern.progress}% Term Progress</div>
                <div className="w-32 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-[#BE123C]" 
                    style={{ width: `${intern.progress}%` }} 
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
