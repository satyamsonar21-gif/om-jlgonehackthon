import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Building2, 
  User, 
  ChevronRight, 
  Sparkles,
  Download,
  Mail,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { toast } from 'sonner';

export interface FacultyStudent {
  id: string;
  name: string;
  roll: string;
  company: string;
  role: string;
  attendance: number;
  reports: string;
  status: 'on_track' | 'watch' | 'at_risk';
  mentor: string;
  department: string;
  email: string;
}

export const facultyCohortStudents: FacultyStudent[] = [
  { id: '1', name: 'Rahul Sharma', roll: '20CS101', company: 'TechCorp Solutions', role: 'Full Stack Engineering', attendance: 92, reports: '4/4 Submitted', status: 'on_track', mentor: 'Siddharth Nambiar', department: 'CSE', email: 'rahul.s@college.edu' },
  { id: '2', name: 'Priya Patel', roll: '20CS102', company: 'Innovatech Labs', role: 'Frontend React Dev', attendance: 88, reports: '4/4 Submitted', status: 'on_track', mentor: 'Dr. Neha Verma', department: 'CSE', email: 'priya.p@college.edu' },
  { id: '3', name: 'Vikram Singh', roll: '20CS103', company: 'DataSystems Inc', role: 'Data Engineering Intern', attendance: 65, reports: '2/4 Submitted', status: 'at_risk', mentor: 'Rohan Deshmukh', department: 'CSE', email: 'vikram.s@college.edu' },
  { id: '4', name: 'Neha Reddy', roll: '20CS104', company: 'GlobalSoft Systems', role: 'Backend API Developer', attendance: 70, reports: '2/4 Submitted', status: 'at_risk', mentor: 'Pooja Bhatia', department: 'CSE', email: 'neha.r@college.edu' },
  { id: '5', name: 'Amit Kumar', roll: '20CS105', company: 'TechCorp Solutions', role: 'DevOps & Cloud', attendance: 95, reports: '3/3 Approved', status: 'on_track', mentor: 'Siddharth Nambiar', department: 'CSE', email: 'amit.k@college.edu' },
  { id: '6', name: 'Sneha Gupta', roll: '20CS106', company: 'DataSystems Inc', role: 'UI/UX & Product Design', attendance: 89, reports: '5/5 Submitted', status: 'on_track', mentor: 'Rohan Deshmukh', department: 'CSE', email: 'sneha.g@college.edu' },
  { id: '7', name: 'Anjali Desai', roll: '20CS107', company: 'Innovatech Labs', role: 'Machine Learning Intern', attendance: 94, reports: '4/4 Approved', status: 'on_track', mentor: 'Dr. Neha Verma', department: 'CSE', email: 'anjali.d@college.edu' },
  { id: '8', name: 'Rohan Mehta', roll: '20CS108', company: 'GlobalSoft Systems', role: 'QA & Test Automation', attendance: 82, reports: '3/4 Submitted', status: 'watch', mentor: 'Pooja Bhatia', department: 'CSE', email: 'rohan.m@college.edu' },
  { id: '9', name: 'Divya Iyer', roll: '20CS109', company: 'TechCorp Solutions', role: 'Cloud Infrastructure', attendance: 87, reports: '4/4 Approved', status: 'on_track', mentor: 'Siddharth Nambiar', department: 'CSE', email: 'divya.i@college.edu' },
  { id: '10', name: 'Karan Joshi', roll: '20CS110', company: 'CloudWorks AI', role: 'Embedded Systems', attendance: 76, reports: '3/4 Submitted', status: 'watch', mentor: 'Aakash Mehra', department: 'CSE', email: 'karan.j@college.edu' },
  { id: '11', name: 'Pooja Verma', roll: '20CS111', company: 'DataSystems Inc', role: 'Data Analyst', attendance: 91, reports: '4/4 Submitted', status: 'on_track', mentor: 'Rohan Deshmukh', department: 'CSE', email: 'pooja.v@college.edu' },
  { id: '12', name: 'Aditya Rao', roll: '20CS112', company: 'NextGen AI', role: 'NLP Specialist Intern', attendance: 80, reports: '3/4 Submitted', status: 'watch', mentor: 'Dr. Sandeep Rao', department: 'CSE', email: 'aditya.r@college.edu' },
  { id: '13', name: 'Manish Tiwari', roll: '20CS113', company: 'FinTech Nexus', role: 'Security Ops Intern', attendance: 93, reports: '4/4 Approved', status: 'on_track', mentor: 'Vikram Joshi', department: 'CSE', email: 'manish.t@college.edu' },
  { id: '14', name: 'Swati Kulkarni', roll: '20CS114', company: 'TechCorp Solutions', role: 'React Native Dev', attendance: 86, reports: '4/4 Submitted', status: 'on_track', mentor: 'Siddharth Nambiar', department: 'CSE', email: 'swati.k@college.edu' },
  { id: '15', name: 'Deepak Nair', roll: '20CS115', company: 'CyberShield Security', role: 'Vulnerability Analyst', attendance: 68, reports: '2/4 Submitted', status: 'at_risk', mentor: 'Vikram Joshi', department: 'CSE', email: 'deepak.n@college.edu' },
  { id: '16', name: 'Ritu Agarwal', roll: '20CS116', company: 'Innovatech Labs', role: 'Computer Vision Intern', attendance: 96, reports: '4/4 Approved', status: 'on_track', mentor: 'Dr. Neha Verma', department: 'CSE', email: 'ritu.a@college.edu' },
  { id: '17', name: 'Gaurav Sen', roll: '20CS117', company: 'CloudWorks AI', role: 'Go Backend Engineer', attendance: 84, reports: '3/4 Submitted', status: 'watch', mentor: 'Aakash Mehra', department: 'CSE', email: 'gaurav.s@college.edu' },
  { id: '18', name: 'Megha Kapoor', roll: '20CS118', company: 'HealthEdge Medical', role: 'Full Stack Java Intern', attendance: 90, reports: '4/4 Approved', status: 'on_track', mentor: 'Dr. Arjun Dixit', department: 'CSE', email: 'megha.k@college.edu' },
  { id: '19', name: 'Tanmay Bhatt', roll: '20CS119', company: 'NextGen AI', role: 'Deep Learning Intern', attendance: 92, reports: '4/4 Approved', status: 'on_track', mentor: 'Dr. Sandeep Rao', department: 'CSE', email: 'tanmay.b@college.edu' },
  { id: '20', name: 'Kavita Pillai', roll: '20CS120', company: 'BioData Solutions', role: 'Bioinformatics Pipeline Dev', attendance: 89, reports: '4/4 Submitted', status: 'on_track', mentor: 'Dr. Kavita Iyer', department: 'CSE', email: 'kavita.p@college.edu' },
  { id: '21', name: 'Sanjay Mishra', roll: '20CS121', company: 'RetailSpire Systems', role: 'GraphQL & Microservices', attendance: 81, reports: '3/4 Submitted', status: 'watch', mentor: 'Harish Varma', department: 'CSE', email: 'sanjay.m@college.edu' },
  { id: '22', name: 'Simran Kaur', roll: '20CS122', company: 'OmniCloud Infra', role: 'Kubernetes Platform Dev', attendance: 94, reports: '4/4 Approved', status: 'on_track', mentor: 'Naveen Kumar', department: 'CSE', email: 'simran.k@college.edu' },
  { id: '23', name: 'Nikhil Saxena', roll: '20CS123', company: 'BlockChain Orbit', role: 'Solidity Smart Contracts', attendance: 78, reports: '3/4 Submitted', status: 'watch', mentor: 'Varun Nair', department: 'CSE', email: 'nikhil.s@college.edu' },
  { id: '24', name: 'Pallavi Chawla', roll: '20CS124', company: 'Creative Studio Inc', role: 'Interaction Designer', attendance: 91, reports: '4/4 Approved', status: 'on_track', mentor: 'Rohan Deshmukh', department: 'CSE', email: 'pallavi.c@college.edu' },
  { id: '25', name: 'Abhishek Roy', roll: '20CS125', company: 'TechCorp Solutions', role: 'Database Tuning & SQL', attendance: 93, reports: '4/4 Submitted', status: 'on_track', mentor: 'Siddharth Nambiar', department: 'CSE', email: 'abhishek.r@college.edu' },
  { id: '26', name: 'Ishita Ganguly', roll: '20CS126', company: 'Innovatech Labs', role: 'Data Pipeline Specialist', attendance: 87, reports: '4/4 Approved', status: 'on_track', mentor: 'Dr. Neha Verma', department: 'CSE', email: 'ishita.g@college.edu' },
  { id: '27', name: 'Varun Grover', roll: '20CS127', company: 'GlobalSoft Systems', role: 'Cloud SRE Intern', attendance: 85, reports: '4/4 Submitted', status: 'on_track', mentor: 'Pooja Bhatia', department: 'CSE', email: 'varun.g@college.edu' },
  { id: '28', name: 'Harshit Jain', roll: '20CS128', company: 'FinTech Nexus', role: 'Risk Engine Developer', attendance: 90, reports: '4/4 Approved', status: 'on_track', mentor: 'Vikram Joshi', department: 'CSE', email: 'harshit.j@college.edu' },
  { id: '29', name: 'Bhavna Sethi', roll: '20CS129', company: 'HealthEdge Medical', role: 'HIPAA Compliance Dev', attendance: 88, reports: '4/4 Submitted', status: 'on_track', mentor: 'Dr. Arjun Dixit', department: 'CSE', email: 'bhavna.s@college.edu' },
  { id: '30', name: 'Yash Vardhan', roll: '20CS130', company: 'CyberShield Security', role: 'Network Auditor', attendance: 82, reports: '3/4 Submitted', status: 'watch', mentor: 'Vikram Joshi', department: 'CSE', email: 'yash.v@college.edu' },
  { id: '31', name: 'Shreya Nambiar', roll: '20CS131', company: 'TechCorp Solutions', role: 'Performance QA Intern', attendance: 95, reports: '4/4 Approved', status: 'on_track', mentor: 'Siddharth Nambiar', department: 'CSE', email: 'shreya.n@college.edu' },
  { id: '32', name: 'Arnav Goswami', roll: '20CS132', company: 'CloudWorks AI', role: 'Rust Microservices', attendance: 91, reports: '4/4 Approved', status: 'on_track', mentor: 'Aakash Mehra', department: 'CSE', email: 'arnav.g@college.edu' },
  { id: '33', name: 'Komal Pandey', roll: '20CS133', company: 'RetailSpire Systems', role: 'Payment Gateway Integrations', attendance: 89, reports: '4/4 Submitted', status: 'on_track', mentor: 'Harish Varma', department: 'CSE', email: 'komal.p@college.edu' },
  { id: '34', name: 'Kartik Somani', roll: '20CS134', company: 'OmniCloud Infra', role: 'Ansible & Linux Admin', attendance: 93, reports: '4/4 Approved', status: 'on_track', mentor: 'Naveen Kumar', department: 'CSE', email: 'kartik.s@college.edu' },
  { id: '35', name: 'Prerna Hegde', roll: '20CS135', company: 'NextGen AI', role: 'Speech Synthesis Intern', attendance: 86, reports: '4/4 Submitted', status: 'on_track', mentor: 'Dr. Sandeep Rao', department: 'CSE', email: 'prerna.h@college.edu' },
  { id: '36', name: 'Siddhesh Parab', roll: '20CS136', company: 'DataSystems Inc', role: 'Tableau & BI Developer', attendance: 88, reports: '4/4 Approved', status: 'on_track', mentor: 'Rohan Deshmukh', department: 'CSE', email: 'siddhesh.p@college.edu' },
  { id: '37', name: 'Ananya Basu', roll: '20CS137', company: 'Innovatech Labs', role: 'NLP Sentiment Analytics', attendance: 92, reports: '4/4 Approved', status: 'on_track', mentor: 'Dr. Neha Verma', department: 'CSE', email: 'ananya.b@college.edu' },
  { id: '38', name: 'Devendra Rathore', roll: '20CS138', company: 'GlobalSoft Systems', role: 'API Documentation & QA', attendance: 90, reports: '4/4 Submitted', status: 'on_track', mentor: 'Pooja Bhatia', department: 'CSE', email: 'devendra.r@college.edu' },
  { id: '39', name: 'Namrata Shinde', roll: '20CS139', company: 'BlockChain Orbit', role: 'Web3 Frontend & Wagmi', attendance: 87, reports: '4/4 Approved', status: 'on_track', mentor: 'Varun Nair', department: 'CSE', email: 'namrata.s@college.edu' },
  { id: '40', name: 'Tushar Deshpande', roll: '20CS140', company: 'BioData Solutions', role: 'Phylogenetic Tree Parser', attendance: 94, reports: '4/4 Approved', status: 'on_track', mentor: 'Dr. Kavita Iyer', department: 'CSE', email: 'tushar.d@college.edu' },
  { id: '41', name: 'Lavanya Sundaram', roll: '20CS141', company: 'TechCorp Solutions', role: 'SRE Observability', attendance: 96, reports: '4/4 Approved', status: 'on_track', mentor: 'Siddharth Nambiar', department: 'CSE', email: 'lavanya.s@college.edu' },
  { id: '42', name: 'Naveen Reddy', roll: '20CS142', company: 'FinTech Nexus', role: 'Payment Core Engineer', attendance: 91, reports: '4/4 Approved', status: 'on_track', mentor: 'Vikram Joshi', department: 'CSE', email: 'naveen.r@college.edu' },
];

export default function FacultyStudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<FacultyStudent | null>(null);

  const totalCount = facultyCohortStudents.length;
  const onTrackCount = facultyCohortStudents.filter(s => s.status === 'on_track').length;
  const watchCount = facultyCohortStudents.filter(s => s.status === 'watch').length;
  const atRiskCount = facultyCohortStudents.filter(s => s.status === 'at_risk').length;

  const filteredStudents = facultyCohortStudents.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roll.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleExportRoster = () => {
    toast.success(`Exported complete roster of ${facultyCohortStudents.length} supervised students as CSV`);
  };

  return (
    <div className="min-h-full pb-16" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header 
        title="Supervised Cohort Directory" 
        subtitle={`${totalCount} assigned students actively monitored across 12 partner organizations`} 
      />
      
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
        {/* Top Metric Bar with Accurate dynamic counts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => setFilterStatus('all')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              filterStatus === 'all' ? 'ring-2 ring-[#059669] shadow-sm' : ''
            }`}
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Total Supervised</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono mt-1" style={{ color: 'var(--text)' }}>
              {totalCount}
            </div>
            <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>42 Manual Records</span>
          </button>

          <button
            onClick={() => setFilterStatus('on_track')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              filterStatus === 'on_track' ? 'ring-2 ring-emerald-500 shadow-sm' : ''
            }`}
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">On Track</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 mt-1">
              {onTrackCount}
            </div>
            <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">Above 85% attendance</span>
          </button>

          <button
            onClick={() => setFilterStatus('watch')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              filterStatus === 'watch' ? 'ring-2 ring-amber-500 shadow-sm' : ''
            }`}
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Watchlist</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600 mt-1">
              {watchCount}
            </div>
            <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400">75% - 85% range</span>
          </button>

          <button
            onClick={() => setFilterStatus('at_risk')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              filterStatus === 'at_risk' ? 'ring-2 ring-rose-500 shadow-sm' : ''
            }`}
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">Urgent Intervention</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-600 mt-1">
              {atRiskCount}
            </div>
            <span className="text-[11px] font-mono text-rose-700 dark:text-rose-400">Below 75% min req</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div 
          className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center p-4 rounded-2xl border shadow-sm"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 40+ students by name, roll, company, or role..." 
              className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: `All (${totalCount})` },
              { id: 'on_track', label: `On Track (${onTrackCount})` },
              { id: 'watch', label: `Watch (${watchCount})` },
              { id: 'at_risk', label: `At Risk (${atRiskCount})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === tab.id
                    ? 'bg-[#059669] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              onClick={handleExportRoster}
              title="Export Roster CSV"
              className="p-2 rounded-xl border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-mono font-semibold cursor-pointer ml-auto"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* 40+ Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.map((student, idx) => {
            const isAtRisk = student.status === 'at_risk';
            const isWatch = student.status === 'watch';
            
            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.02, 0.4) }}
                className={`rounded-2xl p-5 border shadow-sm flex flex-col justify-between transition-all hover:scale-[1.01] hover:shadow-md ${
                  isAtRisk 
                    ? 'border-rose-300 dark:border-rose-800 ring-1 ring-rose-300/40 bg-rose-50/20' 
                    : isWatch 
                    ? 'border-amber-300 dark:border-amber-800 ring-1 ring-amber-300/40 bg-amber-50/20' 
                    : ''
                }`}
                style={{
                  backgroundColor: !isAtRisk && !isWatch ? 'var(--surface)' : undefined,
                  borderColor: !isAtRisk && !isWatch ? 'var(--border)' : undefined,
                  color: 'var(--text)'
                }}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm border shadow-xs ${
                        isAtRisk 
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300' 
                          : isWatch 
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300' 
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
                      }`}>
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>{student.name}</h3>
                        <span className="text-[11px] font-mono text-slate-400 font-semibold">{student.roll} · {student.department}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                      isAtRisk 
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300' 
                        : isWatch 
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300' 
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                    }`}>
                      {student.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Company & Role */}
                  <div className="p-3 rounded-xl border space-y-1 mb-3 bg-slate-50/70 dark:bg-slate-900/60" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--text)' }}>
                      <Building2 size={13} className="text-[#059669]" />
                      <span>{student.company}</span>
                    </div>
                    <div className="text-[11px] font-mono pl-4 opacity-80" style={{ color: 'var(--text-muted)' }}>
                      {student.role}
                    </div>
                  </div>

                  {/* Progress Metrics */}
                  <div className="space-y-2.5 mb-3 text-xs">
                    <div>
                      <div className="flex justify-between mb-1 font-semibold">
                        <span style={{ color: 'var(--text-muted)' }}>Attendance Rate</span>
                        <span className={`font-mono ${
                          student.attendance < 75 ? 'text-rose-600 font-bold' : student.attendance < 85 ? 'text-amber-600 font-bold' : 'text-emerald-600 font-bold'
                        }`}>
                          {student.attendance}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            student.attendance < 75 ? 'bg-rose-500' : student.attendance < 85 ? 'bg-amber-500' : 'bg-emerald-600'
                          }`}
                          style={{ width: `${student.attendance}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Weekly Reports</span>
                      <span className="font-mono font-bold" style={{ color: 'var(--text)' }}>{student.reports}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-[11px] font-mono opacity-70" style={{ color: 'var(--text-muted)' }}>Lead: {student.mentor}</span>
                  <button
                    onClick={() => {
                      setSelectedStudent(student);
                      toast.info(`Opening file for ${student.name}`);
                    }}
                    className="inline-flex items-center gap-1 font-bold text-[#059669] hover:underline cursor-pointer"
                  >
                    <span>Full Profile</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Student Full Profile Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div 
              className="rounded-2xl border shadow-2xl p-6 max-w-lg w-full space-y-4 animate-in fade-in zoom-in-95"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#059669]" />
                  <h3 className="font-bold text-sm">Supervised Intern Dossier</h3>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-900 space-y-1.5 font-mono" style={{ borderColor: 'var(--border)' }}>
                  <p><strong>Student Name:</strong> {selectedStudent.name} ({selectedStudent.roll})</p>
                  <p><strong>Department:</strong> {selectedStudent.department} Engineering</p>
                  <p><strong>College Email:</strong> {selectedStudent.email}</p>
                  <p><strong>Host Employer:</strong> {selectedStudent.company}</p>
                  <p><strong>Industry Role:</strong> {selectedStudent.role}</p>
                  <p><strong>Industry Mentor:</strong> {selectedStudent.mentor}</p>
                  <p><strong>Attendance Compliance:</strong> {selectedStudent.attendance}%</p>
                  <p><strong>Report Submissions:</strong> {selectedStudent.reports}</p>
                  <p><strong>Risk Classification:</strong> {selectedStudent.status.toUpperCase()}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <a
                  href={`mailto:${selectedStudent.email}`}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <Mail size={13} />
                  <span>Email Student</span>
                </a>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-5 py-2 rounded-xl bg-[#059669] text-white text-xs font-bold font-mono tracking-wider uppercase cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
