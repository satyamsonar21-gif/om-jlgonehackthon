import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { 
  Users, 
  Briefcase, 
  FileText, 
  Star, 
  Plus, 
  Download, 
  ClipboardList, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  Building2
} from 'lucide-react';
import { activeCompanyInternsData } from './CompanyInternsPage';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export default function CompanyDashboardPage() {
  const activeCount = activeCompanyInternsData.length; // 16

  const stats = [
    { label: 'Active Supervised Interns', value: String(activeCount), icon: Users, desc: 'Across 7 project teams', color: '#4F46E5' },
    { label: 'Candidate Pipeline', value: '52', icon: FileText, desc: 'Applications received', color: 'var(--secondary)' },
    { label: 'Open Positions', value: '6', icon: Briefcase, desc: 'Fall 2026 Batch', color: '#0284C7' },
    { label: 'Mentor Rating', value: '4.8 / 5', icon: Star, desc: '98% Satisfaction', color: '#10B981' },
  ];

  const featuredInterns = activeCompanyInternsData.slice(0, 6);

  return (
    <div className="min-h-full pb-16" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header title="Company Mission Control" subtitle="TechCorp Solutions · Industry Supervisor & Mentorship Hub" />
      
      <motion.main 
        className="max-w-7xl mx-auto p-6 md:p-8 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Hero & Action Toolbar */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border shadow-md p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text)'
          }}
        >
          <div className="space-y-2 max-w-xl">
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold border"
              style={{
                backgroundColor: 'var(--accent-soft)',
                borderColor: 'var(--border)',
                color: 'var(--role-accent, var(--primary))'
              }}
            >
              <Sparkles size={13} />
              <span>VERIFIED ENTERPRISE WORKSPACE · #TC-2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>
              Engineering Mentorship & Cohort Velocity
            </h1>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Coordinate technical deliverables for {activeCount} active interns, evaluate weekly progress reports, and screen candidate pipelines in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
            <Link
              to="/company/listings/new"
              className="px-5 py-3 rounded-xl font-bold font-mono text-xs tracking-wider uppercase transition-all shadow-md flex items-center gap-2 hover:scale-105"
              style={{
                backgroundColor: 'var(--cta)',
                color: 'var(--cta-text)'
              }}
            >
              <Plus size={15} />
              <span>Post New Listing</span>
            </Link>

            <Link
              to="/company/applications"
              className="px-4 py-3 rounded-xl font-bold font-mono text-xs tracking-wider uppercase transition-all border flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text)'
              }}
            >
              <span>52 Applications</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* 4 Stat Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="p-6 rounded-2xl border shadow-xs space-y-3"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)'
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: 'var(--surface-muted)', color: stat.color }}
                >
                  <stat.icon size={16} />
                </div>
              </div>
              <div className="text-2xl font-black font-mono" style={{ color: 'var(--text)' }}>
                {stat.value}
              </div>
              <span className="text-[11px] font-mono block" style={{ color: 'var(--text-muted)' }}>
                {stat.desc}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Active Supervised Interns Grid */}
        <motion.div 
          variants={itemVariants} 
          className="rounded-2xl border shadow-sm p-6 space-y-4"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)'
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Active Supervised Interns ({activeCount})</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Live sprint execution across 7 project teams</p>
            </div>
            <Link to="/company/interns" className="text-xs font-mono font-bold hover:underline" style={{ color: 'var(--role-accent, var(--cta))' }}>
              View Complete Roster ({activeCount})
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredInterns.map((intern) => {
              const taskProgress = Math.round((intern.tasksCompleted / intern.totalTasks) * 100);

              return (
                <div 
                  key={intern.id} 
                  className="p-5 rounded-2xl border flex flex-col justify-between space-y-3 transition-all hover:scale-[1.01]"
                  style={{
                    backgroundColor: 'var(--surface-muted)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm" style={{ color: 'var(--text)' }}>{intern.name}</h4>
                      <span className="text-xs font-semibold" style={{ color: 'var(--role-accent, var(--cta))' }}>{intern.role}</span>
                      <span className="text-[11px] font-mono block text-slate-400 font-semibold">{intern.projectTeam}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {intern.attendance}% Attendance
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                      <span>Sprint Velocity ({intern.tasksCompleted}/{intern.totalTasks})</span>
                      <span>{taskProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ width: `${taskProgress}%`, backgroundColor: 'var(--role-accent, var(--cta))' }} 
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t flex items-center justify-between text-[11px] font-mono" style={{ borderColor: 'var(--border)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{intern.lastLog}</span>
                    <Link to="/company/interns" className="font-bold flex items-center gap-1 hover:underline" style={{ color: 'var(--role-accent, var(--cta))' }}>
                      <span>Evaluate</span>
                      <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}
