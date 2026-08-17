import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Link } from 'react-router-dom';
import { PenLine, FileText, Calendar, CheckSquare, MessageSquare, ChevronRight, Building2, User, Clock, TrendingUp, Sparkles } from 'lucide-react';

const internshipInfo = {
  company: 'TechCorp Solutions', 
  role: 'Software Engineering Intern',
  mentor: 'Siddharth Nambiar (Tech Lead)', 
  startDate: 'Jul 1, 2026', 
  endDate: 'Sep 30, 2026',
  mode: 'Hybrid (Bangalore)', 
  week: 4,
};

const hubs = [
  { title: 'Daily Work Log', desc: "Document daily achievements & commit hashes", href: '/student/active/logs', icon: PenLine, badge: "Today's Log Pending", color: '#0D9488', bg: '#F0FDFA' },
  { title: 'Weekly Reports', desc: 'Submit synthesized weekly technical reports', href: '/student/active/reports', icon: FileText, badge: 'Week 5 Due Tomorrow', color: '#4338CA', bg: '#EEF2FF' },
  { title: 'Attendance Ledger', desc: 'Biometric geolocation and clock-in records', href: '/student/active/attendance', icon: Calendar, badge: '92% Compliance', color: '#10B981', bg: '#ECFDF5' },
  { title: 'Assigned Tasks', desc: 'Sprint board tasks and pull request reviews', href: '/student/active/tasks', icon: CheckSquare, badge: '3 In Progress', color: '#0284C7', bg: '#F0F9FF' },
  { title: 'Mentor Feedback', desc: 'Formal reviews & technical advice from supervisor', href: '/student/active/feedback', icon: MessageSquare, badge: '1 New Review', color: '#D97706', bg: '#FFFBEB' },
  { title: 'Placement Score', desc: 'Competency index across 6 performance pillars', href: '/student/placement', icon: TrendingUp, badge: '78% Readiness', color: '#BE123C', bg: '#FFF1F2' },
];

export default function ActiveInternshipPage() {
  const progress = Math.round((4 / 12) * 100);

  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="Active Internship Hub" subtitle="TechCorp Solutions · Software Engineering" />
      
      <main className="max-w-6xl mx-auto p-6 md:p-8 space-y-6">
        {/* Placement Hero Card */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-[#0D9488] flex items-center justify-center font-bold text-xl shadow-xs">
                TC
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{internshipInfo.role}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    ACTIVE SPRINT
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{internshipInfo.company}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-600 font-mono">
                  <span className="flex items-center gap-1.5"><User size={12} className="text-[#0D9488]" /> {internshipInfo.mentor}</span>
                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#0D9488]" /> {internshipInfo.startDate} – {internshipInfo.endDate}</span>
                  <span className="flex items-center gap-1.5"><Building2 size={12} className="text-[#0D9488]" /> {internshipInfo.mode}</span>
                </div>
              </div>
            </div>

            <div className="text-left md:text-right bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-500 font-mono block">Sprint Timeline</span>
              <span className="text-2xl font-bold font-mono text-[#0D9488]">Week 4 of 12</span>
              <span className="text-[11px] text-slate-500 font-medium block mt-0.5">{progress}% Term Completed</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }} 
                animate={{ width: `${progress}%` }} 
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-full rounded-full bg-[#0D9488]"
              />
            </div>
          </div>
        </motion.div>

        {/* Action Hub Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hubs.map((hub, i) => (
            <Link
              key={i}
              to={hub.href}
              className="interactive-card p-6 flex flex-col justify-between space-y-4 group cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div 
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105"
                    style={{ backgroundColor: hub.color }}
                  >
                    <hub.icon size={20} />
                  </div>
                  <span 
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border"
                    style={{ color: hub.color, backgroundColor: hub.bg, borderColor: `${hub.color}30` }}
                  >
                    {hub.badge}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 mt-3">{hub.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{hub.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold" style={{ color: hub.color }}>
                <span>Open Module</span>
                <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
