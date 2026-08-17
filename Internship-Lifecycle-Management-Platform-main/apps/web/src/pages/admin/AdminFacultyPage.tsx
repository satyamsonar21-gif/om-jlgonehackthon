import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Search, BookOpen, Users, Mail, Building2, Plus, ChevronRight } from 'lucide-react';

const facultyList = [
  { id: '1', name: 'Dr. Rajesh Kumar', dept: 'Computer Science & Eng', college: 'Dept. of CSE', assignedStudents: 28, email: 'rkumar@university.edu' },
  { id: '2', name: 'Prof. Anitha Sharma', dept: 'Information Technology', college: 'Dept. of IT', assignedStudents: 22, email: 'anitha@university.edu' },
  { id: '3', name: 'Dr. Vikram Shah', dept: 'Electronics & Comm', college: 'Dept. of ECE', assignedStudents: 18, email: 'vshah@university.edu' },
  { id: '4', name: 'Dr. Meenakshi Sundaram', dept: 'Electrical Engineering', college: 'Dept. of EE', assignedStudents: 15, email: 'meenakshi@university.edu' },
];

export default function AdminFacultyPage() {
  const [search, setSearch] = useState('');
  const filtered = facultyList.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.dept.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="Faculty Guides Registry" subtitle="Academic supervisors managing undergraduate internship cohorts" />
      
      <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Search faculty by name or department..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none input-focus-ring"
              style={{ '--primary': '#BE123C' } as React.CSSProperties}
            />
          </div>

          <button className="px-4 py-2.5 rounded-xl bg-[#BE123C] hover:bg-[#9F1239] text-white text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-xs flex items-center gap-1.5 cursor-pointer">
            <Plus size={14} /> Register Faculty Guide
          </button>
        </div>

        <div className="space-y-3.5">
          {filtered.map((f) => (
            <motion.div 
              key={f.id} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="interactive-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-[#4338CA] border border-indigo-200 flex items-center justify-center font-bold text-sm">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{f.name}</h3>
                  <p className="text-xs text-slate-500">{f.dept} · <span className="font-semibold text-slate-700">{f.college}</span></p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{f.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-[#4338CA] block">{f.assignedStudents}</span>
                  <span className="text-[10px] uppercase font-mono text-slate-400">Supervised Interns</span>
                </div>
                <button className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold">
                  Manage Cohort
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
