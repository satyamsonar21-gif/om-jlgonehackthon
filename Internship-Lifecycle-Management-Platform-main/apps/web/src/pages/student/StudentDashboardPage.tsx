import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import LifecycleRail from '@/components/common/LifecycleRail';
import { 
  Briefcase, 
  Calendar, 
  FileText, 
  CheckSquare, 
  ChevronRight, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { Link } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
  }
};

export default function StudentDashboardPage() {
  return (
    <div className="min-h-full pb-16" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header 
        title="Student Launchpad" 
        subtitle="Priya Sharma · TechCorp Solutions · Software Engineering Intern" 
      />

      <motion.main 
        className="p-6 md:p-8 max-w-7xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 1. Signature Lifecycle Rail */}
        <motion.div variants={itemVariants}>
          <LifecycleRail currentStage={4} variant="full" showLabel={true} />
        </motion.div>

        {/* 2. Primary Metric Hero: Placement Readiness Score */}
        <motion.div 
          variants={itemVariants} 
          className="rounded-2xl border shadow-md p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-bold"
              style={{
                backgroundColor: 'var(--surface-muted)',
                color: 'var(--primary)',
                border: '1px solid var(--border)'
              }}
            >
              <Sparkles size={12} />
              AI-CALCULATED CAREER READINESS
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>
              78% Placement Readiness Index
            </h2>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Strong velocity across Technical Execution and Daily Sprint Logs. Complete Week 5 synthesis report to unlock Tier-1 placement recommendations.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <Link
              to="/student/placement"
              className="px-5 py-3 rounded-xl font-bold font-mono text-xs tracking-wider uppercase transition-all shadow-md flex items-center gap-2 hover:scale-105"
              style={{
                backgroundColor: 'var(--cta)',
                color: 'var(--cta-text)'
              }}
            >
              <span>View Full Analytics</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* 3. Quick Stats Cards Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Active Sprint', value: 'Week 4 of 12', sub: 'TechCorp Solutions', icon: Briefcase, color: 'var(--highlights)' },
            { label: 'Attendance Rate', value: '92.5%', sub: '23/25 Days Clocked', icon: Calendar, color: '#10B981' },
            { label: 'Sprint Tasks', value: '8 / 10 Done', sub: '2 Pull Requests Pending', icon: CheckSquare, color: 'var(--cta)' },
            { label: 'Weekly Reports', value: '4 Approved', sub: 'Week 5 Due Tomorrow', icon: FileText, color: 'var(--highlights)' },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="p-6 rounded-2xl border shadow-sm space-y-3"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)'
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
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
                {stat.sub}
              </span>
            </div>
          ))}
        </motion.div>

        {/* 4. Action Hub Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions Card */}
          <div 
            className="lg:col-span-2 p-6 rounded-2xl border shadow-sm space-y-4"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)'
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Active Sprint Quick Triggers</h3>
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Term Q3 2026</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Link
                to="/student/active/logs"
                className="p-4 rounded-xl border transition-all flex items-start gap-3 hover:scale-[1.01]"
                style={{
                  backgroundColor: 'var(--surface-muted)',
                  borderColor: 'var(--border)'
                }}
              >
                <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--highlights)' }} />
                <div>
                  <h4 className="font-bold text-xs" style={{ color: 'var(--text)' }}>Log Daily Deliverables</h4>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Document tasks completed today</p>
                </div>
              </Link>

              <Link
                to="/student/active/reports"
                className="p-4 rounded-xl border transition-all flex items-start gap-3 hover:scale-[1.01]"
                style={{
                  backgroundColor: 'var(--surface-muted)',
                  borderColor: 'var(--border)'
                }}
              >
                <FileText className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--cta)' }} />
                <div>
                  <h4 className="font-bold text-xs" style={{ color: 'var(--text)' }}>Submit Week 5 Synthesis</h4>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Due tomorrow 11:59 PM</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Supervisor Card */}
          <div 
            className="p-6 rounded-2xl border shadow-sm space-y-4"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)'
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Assigned Supervisors</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--surface-muted)', borderColor: 'var(--border)' }}>
                <span className="text-[10px] font-mono uppercase font-bold block" style={{ color: 'var(--highlights)' }}>Industry Guide</span>
                <span className="font-bold block text-sm" style={{ color: 'var(--text)' }}>Siddharth Nambiar</span>
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Lead Architect · TechCorp</span>
              </div>

              <div className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--surface-muted)', borderColor: 'var(--border)' }}>
                <span className="text-[10px] font-mono uppercase font-bold block" style={{ color: 'var(--cta)' }}>Faculty Advisor</span>
                <span className="font-bold block text-sm" style={{ color: 'var(--text)' }}>Dr. Rajesh Kumar</span>
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Dept. of Computer Science</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}
