import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, User, Building2, Calendar, CheckSquare, FileText, Award, Star, Clock, Send } from 'lucide-react';

export default function CompanyInternDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="Intern Dossier & Evaluation" subtitle="Priya Sharma · Software Engineering Track" />
      
      <main className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
        <Link 
          to="/company/interns" 
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#0284C7] hover:underline"
        >
          <ChevronLeft size={14} /> Back to Active Interns
        </Link>

        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-[#0284C7] border border-sky-200 flex items-center justify-center text-xl font-bold">
              PS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">Priya Sharma</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  ACTIVE · WEEK 4
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Software Engineering Intern · TechCorp Solutions</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">Computer Science & Engineering · Roll: 20CS101</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold shadow-xs cursor-pointer">
              Assign Sprint Task
            </button>
          </div>
        </motion.div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
            <p className="text-xs text-slate-500 mb-1">Attendance Rate</p>
            <p className="text-2xl font-bold font-mono text-emerald-700">92%</p>
            <span className="text-[10px] text-slate-400">23 / 25 Days Present</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
            <p className="text-xs text-slate-500 mb-1">Sprint Tasks</p>
            <p className="text-2xl font-bold font-mono text-[#0284C7]">8 / 10</p>
            <span className="text-[10px] text-slate-400">2 In Progress</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
            <p className="text-xs text-slate-500 mb-1">Weekly Reports</p>
            <p className="text-2xl font-bold font-mono text-[#4338CA]">4 / 4</p>
            <span className="text-[10px] text-slate-400">All Approved</span>
          </div>
        </div>

        {/* Milestone Evaluation Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Sprint Performance Appraisal</h3>
            <span className="text-xs font-mono text-slate-400">Term Rating: 4.8 / 5.0</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <span className="font-mono font-bold text-slate-700 block">Supervisor Appraisal Remarks:</span>
            <p className="text-slate-600 leading-relaxed italic">
              "Priya has demonstrated exceptional autonomy in building out the frontend authentication flows. Her pull requests are well-commented and include unit tests."
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
