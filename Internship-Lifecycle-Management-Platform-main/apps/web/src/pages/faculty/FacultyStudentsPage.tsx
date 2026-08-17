import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Search, Filter, AlertTriangle, CheckCircle, Clock, Building2, User, ChevronRight, Sparkles } from 'lucide-react';

const studentsData = [
  { id: '1', name: 'Rahul Sharma', roll: '20CS101', company: 'TechCorp Solutions', role: 'Full Stack Engineering', attendance: 92, reports: '4/4 Submitted', status: 'on_track', mentor: 'Dr. Rajesh Kumar' },
  { id: '2', name: 'Priya Patel', roll: '20CS102', company: 'Innovatech Labs', role: 'Frontend React Dev', attendance: 88, reports: '4/4 Submitted', status: 'on_track', mentor: 'Dr. Rajesh Kumar' },
  { id: '3', name: 'Vikram Singh', roll: '20CS103', company: 'DataSystems Inc', role: 'Data Engineering Intern', attendance: 65, reports: '2/4 Submitted', status: 'at_risk', mentor: 'Dr. Rajesh Kumar' },
  { id: '4', name: 'Neha Reddy', roll: '20CS104', company: 'GlobalSoft Systems', role: 'Backend API Developer', attendance: 70, reports: '2/4 Submitted', status: 'at_risk', mentor: 'Dr. Rajesh Kumar' },
  { id: '5', name: 'Amit Kumar', roll: '20CS105', company: 'TechCorp Solutions', role: 'DevOps & Cloud', attendance: 95, reports: '3/3 Approved', status: 'on_track', mentor: 'Dr. Rajesh Kumar' },
  { id: '6', name: 'Sneha Gupta', roll: '20CS106', company: 'DataSystems Inc', role: 'UI/UX & Product Design', attendance: 89, reports: '5/5 Submitted', status: 'on_track', mentor: 'Dr. Rajesh Kumar' },
  { id: '7', name: 'Anjali Desai', roll: '20CS107', company: 'Innovatech Labs', role: 'Machine Learning Intern', attendance: 94, reports: '4/4 Approved', status: 'on_track', mentor: 'Dr. Rajesh Kumar' },
  { id: '8', name: 'Rohan Mehta', roll: '20CS108', company: 'GlobalSoft Systems', role: 'QA & Test Automation', attendance: 82, reports: '3/4 Submitted', status: 'watch', mentor: 'Dr. Rajesh Kumar' },
  { id: '9', name: 'Divya Iyer', roll: '20CS109', company: 'TechCorp Solutions', role: 'Cloud Infrastructure', attendance: 87, reports: '4/4 Approved', status: 'on_track', mentor: 'Dr. Rajesh Kumar' },
  { id: '10', name: 'Karan Joshi', roll: '20CS110', company: 'CloudWorks AI', role: 'Embedded Systems', attendance: 76, reports: '3/4 Submitted', status: 'watch', mentor: 'Dr. Rajesh Kumar' },
  { id: '11', name: 'Pooja Verma', roll: '20CS111', company: 'DataSystems Inc', role: 'Data Analyst', attendance: 91, reports: '4/4 Submitted', status: 'on_track', mentor: 'Dr. Rajesh Kumar' },
  { id: '12', name: 'Aditya Rao', roll: '20CS112', company: 'NextGen AI', role: 'NLP Specialist Intern', attendance: 80, reports: '3/4 Submitted', status: 'watch', mentor: 'Dr. Rajesh Kumar' },
];

export default function FacultyStudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredStudents = studentsData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.roll.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-full pb-16">
      <Header 
        title="Supervised Students Directory" 
        subtitle="28 students enrolled in industrial internship program" 
      />
      
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-6 text-[#142326]">
        {/* Top Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-[#FFFDF8] p-4 rounded-2xl border border-[#0B525B]/15 shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#142326]/40" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, roll number, or company..." 
              className="w-full bg-white border border-[#142326]/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#142326] focus:outline-none focus:border-[#0B525B] focus:ring-2 focus:ring-[#0B525B]/20 transition-all placeholder:text-[#142326]/40"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All (28)' },
              { id: 'on_track', label: 'On Track (18)' },
              { id: 'watch', label: 'Watch (7)' },
              { id: 'at_risk', label: 'At Risk (3)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === tab.id
                    ? 'bg-[#0B525B] text-white shadow-sm'
                    : 'bg-[#F4F0E6]/60 text-[#142326]/70 hover:bg-[#F4F0E6] hover:text-[#142326]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.map((student, idx) => {
            const isAtRisk = student.status === 'at_risk';
            const isWatch = student.status === 'watch';
            
            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className={`rounded-2xl p-5 border bg-[#FFFDF8] shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${
                  isAtRisk 
                    ? 'border-rose-300 ring-1 ring-rose-200/50' 
                    : isWatch 
                    ? 'border-amber-300 ring-1 ring-amber-200/40' 
                    : 'border-[#0B525B]/15 hover:border-[#0B525B]/40'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm border shadow-xs ${
                        isAtRisk 
                          ? 'bg-rose-50 text-rose-700 border-rose-200' 
                          : isWatch 
                          ? 'bg-amber-50 text-amber-800 border-amber-200' 
                          : 'bg-[#0B525B]/10 text-[#0B525B] border-[#0B525B]/20'
                      }`}>
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-[#142326]">{student.name}</h3>
                        <span className="text-[11px] font-mono text-[#142326]/55 font-medium">{student.roll}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                      isAtRisk 
                        ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                        : isWatch 
                        ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {student.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Company & Role */}
                  <div className="p-3 rounded-xl bg-[#FBF9F4] border border-[#0B525B]/10 space-y-1 mb-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#142326]">
                      <Building2 size={13} className="text-[#0B525B]" />
                      <span>{student.company}</span>
                    </div>
                    <div className="text-[11px] text-[#142326]/60 pl-4">
                      {student.role}
                    </div>
                  </div>

                  {/* Progress Metrics */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-medium">
                        <span className="text-[#142326]/60">Attendance Rate</span>
                        <span className={`font-mono font-semibold ${
                          student.attendance < 75 ? 'text-rose-600' : student.attendance < 85 ? 'text-amber-600' : 'text-emerald-700'
                        }`}>
                          {student.attendance}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#142326]/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            student.attendance < 75 ? 'bg-rose-500' : student.attendance < 85 ? 'bg-amber-500' : 'bg-emerald-600'
                          }`}
                          style={{ width: `${student.attendance}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-[#0B525B]/10">
                      <span className="text-[#142326]/60">Weekly Reports</span>
                      <span className="font-mono font-medium text-[#142326]">{student.reports}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-[#0B525B]/10 flex items-center justify-between">
                  <span className="text-[11px] text-[#142326]/50">Faculty Guide: Dr. Kumar</span>
                  <Link 
                    to={`/faculty/students/${student.id}`} 
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B525B] hover:text-[#073940] hover:underline"
                  >
                    <span>Full Profile</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
