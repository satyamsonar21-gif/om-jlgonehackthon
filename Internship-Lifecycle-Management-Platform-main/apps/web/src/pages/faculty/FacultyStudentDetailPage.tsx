import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, GraduationCap, Building2, Calendar, FileText, CheckCircle, AlertTriangle, TrendingUp, Mail, Phone, ExternalLink } from 'lucide-react';

export default function FacultyStudentDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-full pb-16">
      <Header 
        title="Student Monitoring Dossier" 
        subtitle="Detailed academic telemetry, log history, and evaluation breakdown" 
      />
      
      <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-6 text-[#142326]">
        <Link 
          to="/faculty/students" 
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#0B525B] hover:underline"
        >
          <ChevronLeft size={14} /> Back to Supervised Students
        </Link>

        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border bg-[#FFFDF8] border-[#0B525B]/15 shadow-sm p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#0B525B]/10 border border-[#0B525B]/20 flex items-center justify-center text-xl font-bold text-[#0B525B]">
                PS
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-[#142326]">Priya Sharma</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    On Track
                  </span>
                </div>
                <p className="text-xs text-[#142326]/65 mt-1 font-medium">
                  Software Engineering Intern · <span className="text-[#0B525B] font-semibold">TechCorp Solutions</span>
                </p>
                <p className="text-[11px] text-[#142326]/45 mt-0.5 font-mono">
                  Roll: 20CS101 · B.Tech CSE (3rd Year) · CGPA: 8.7
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a 
                href="mailto:priya.sharma@college.edu" 
                className="px-3 py-2 rounded-xl bg-white border border-[#0B525B]/20 text-[#0B525B] text-xs font-medium hover:bg-[#F4F0E6] flex items-center gap-1.5 shadow-xs"
              >
                <Mail size={14} /> Contact Student
              </a>
              <button 
                className="px-4 py-2 rounded-xl bg-[#0B525B] text-white text-xs font-medium hover:bg-[#073940] transition-colors shadow-sm cursor-pointer"
              >
                Submit Evaluation
              </button>
            </div>
          </div>
        </motion.div>

        {/* 4 Quick Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border bg-[#FFFDF8] border-[#0B525B]/15 p-4 text-center shadow-sm">
            <p className="text-xs text-[#142326]/50 mb-1 font-medium">Attendance Rate</p>
            <p className="text-2xl font-bold font-mono text-emerald-700">92%</p>
            <span className="text-[10px] text-[#142326]/50">38 of 40 Days</span>
          </div>

          <div className="rounded-2xl border bg-[#FFFDF8] border-[#0B525B]/15 p-4 text-center shadow-sm">
            <p className="text-xs text-[#142326]/50 mb-1 font-medium">Daily Logs</p>
            <p className="text-2xl font-bold font-mono text-[#0B525B]">38 / 40</p>
            <span className="text-[10px] text-emerald-600 font-medium">Consistent</span>
          </div>

          <div className="rounded-2xl border bg-[#FFFDF8] border-[#0B525B]/15 p-4 text-center shadow-sm">
            <p className="text-xs text-[#142326]/50 mb-1 font-medium">Weekly Reports</p>
            <p className="text-2xl font-bold font-mono text-[#0B525B]">4 / 4</p>
            <span className="text-[10px] text-emerald-600 font-medium">All Approved</span>
          </div>

          <div className="rounded-2xl border bg-[#FFFDF8] border-[#0B525B]/15 p-4 text-center shadow-sm">
            <p className="text-xs text-[#142326]/50 mb-1 font-medium">Mentor Score</p>
            <p className="text-2xl font-bold font-mono text-emerald-700">4.8 / 5</p>
            <span className="text-[10px] text-[#142326]/50">Exceeds Expectations</span>
          </div>
        </div>

        {/* Detailed Timeline & Weekly Summary */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 rounded-2xl border bg-[#FFFDF8] border-[#0B525B]/15 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-sm text-[#142326]">Weekly Milestone Ledger</h3>
            
            <div className="space-y-3">
              {[
                { week: 'Week 4', title: 'OAuth2 Integration & CI/CD Pipeline', status: 'Approved', rating: '5/5', notes: 'Excellent execution of automated authentication workflows.' },
                { week: 'Week 3', title: 'Database Optimization & Indexing', status: 'Approved', rating: '4.8/5', notes: 'Reduced query execution time by 60% on billing reports.' },
                { week: 'Week 2', title: 'Frontend Component Library Design', status: 'Approved', rating: '4.5/5', notes: 'Followed design system guidelines accurately.' },
                { week: 'Week 1', title: 'Onboarding & Development Environment Setup', status: 'Approved', rating: '5/5', notes: 'Completed onboarding ahead of schedule.' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#FBF9F4] border border-[#0B525B]/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#0B525B]">{item.week}</span>
                      <span className="text-xs font-semibold text-[#142326]">• {item.title}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                      {item.status} ({item.rating})
                    </span>
                  </div>
                  <p className="text-xs text-[#142326]/70 italic">"{item.notes}"</p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-4 rounded-2xl border bg-[#FFFDF8] border-[#0B525B]/15 shadow-sm p-6 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-sm text-[#142326]">Industry Mentor Info</h3>
              <div className="mt-4 space-y-3">
                <div>
                  <span className="text-[11px] text-[#142326]/50 block">Company Guide</span>
                  <span className="text-xs font-semibold text-[#142326]">Siddharth Nambiar</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#142326]/50 block">Designation</span>
                  <span className="text-xs text-[#142326]">Lead Architect, TechCorp</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#142326]/50 block">Guide Email</span>
                  <span className="text-xs text-[#0B525B] font-mono">s.nambiar@techcorp.com</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#0B525B]/10">
              <span className="text-xs text-[#142326]/60 block mb-2 font-medium">Final Sign-off Status</span>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#0B525B]/10 border border-[#0B525B]/20 text-[#0B525B] text-xs font-medium">
                <CheckCircle size={14} />
                <span>Eligible for Certificate</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
