import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Search, Filter, Eye, GraduationCap, ChevronRight } from 'lucide-react';

export default function AdminStudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const students = [
    { id: 1, name: 'Priya Sharma', roll: 'CS2026001', dept: 'Computer Science', company: 'TechCorp Solutions', attendance: 95, score: 85, status: 'Active' },
    { id: 2, name: 'Rahul Patel', roll: 'CS2026002', dept: 'Information Tech', company: 'Innovatech Labs', attendance: 88, score: 92, status: 'Active' },
    { id: 3, name: 'Amit Kumar', roll: 'CS2026003', dept: 'Computer Science', company: 'TechCorp Solutions', attendance: 95, score: 78, status: 'Active' },
    { id: 4, name: 'Sneha Reddy', roll: 'CS2026004', dept: 'Electronics & Comm', company: 'DataSystems Inc', attendance: 100, score: 95, status: 'Active' },
    { id: 5, name: 'Vikram Singh', roll: 'CS2026005', dept: 'Computer Science', company: 'DataSystems Inc', attendance: 65, score: 60, status: 'At Risk' },
    { id: 6, name: 'Anjali Desai', roll: 'CS2026006', dept: 'Computer Science', company: 'Innovatech Labs', attendance: 94, score: 88, status: 'Completed' },
    { id: 7, name: 'Rohan Mehta', roll: 'CS2026007', dept: 'Information Tech', company: 'GlobalSoft Systems', attendance: 82, score: 75, status: 'Active' },
  ];

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.roll.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="Enrolled Students Registry" subtitle="1,284 students enrolled across university departments" />
      
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search students by name, roll, company..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none input-focus-ring"
              style={{ '--primary': '#BE123C' } as React.CSSProperties}
            />
          </div>

          <div className="text-xs font-mono text-slate-400">
            Showing {filtered.length} of 1,284 Records
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="p-4 font-semibold">Student</th>
                  <th className="p-4 font-semibold">Department</th>
                  <th className="p-4 font-semibold">Host Organization</th>
                  <th className="p-4 font-semibold">Attendance</th>
                  <th className="p-4 font-semibold">Readiness</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">{s.roll}</div>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">{s.dept}</td>
                    <td className="p-4 text-slate-800 font-medium">{s.company}</td>
                    <td className="p-4 font-mono font-bold text-slate-900">{s.attendance}%</td>
                    <td className="p-4 font-mono font-bold text-[#BE123C]">{s.score}%</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        s.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        s.status === 'Completed' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                        'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        to="/admin" 
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye size={12} /> Audit Dossier
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
