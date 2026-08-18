import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { 
  FileText, 
  AlertTriangle, 
  Users, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Eye, 
  Sparkles, 
  TrendingUp, 
  Check 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ConstellationCanvas from '@/components/common/ConstellationCanvas';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { y: 16, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
  }
};

export default function FacultyDashboardPage() {
  return (
    <div className="min-h-full pb-16" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header 
        title="Faculty Observatory" 
        subtitle="Dr. Rajesh Kumar · Dept. of Computer Science & Engineering" 
      />

      <motion.main 
        className="p-6 md:p-8 max-w-7xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Observatory Radar & Cohort Overview Hero */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-2xl p-6 md:p-8 border shadow-lg"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text)'
          }}
        >
          {/* Left Column: Metrics & Breakdown */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <div 
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold mb-3 border"
                style={{
                  backgroundColor: 'rgba(3, 134, 102, 0.25)',
                  color: 'var(--highlights)',
                  borderColor: 'var(--border)'
                }}
              >
                <Sparkles size={13} />
                LIVE COHORT OBSERVATION RADAR
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>
                28 Supervised Interns
              </h2>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Active telemetry tracking for CSE Fall 2026 cohort. Real-time monitoring of weekly synthesis reports and attendance compliance.
              </p>
            </div>

            {/* Status Breakdown Pills */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border text-center" style={{ backgroundColor: 'var(--surface-muted)', borderColor: 'var(--border)' }}>
                <span className="text-xl font-extrabold font-mono text-emerald-400">22</span>
                <span className="text-[10px] font-mono uppercase block mt-1" style={{ color: 'var(--text-muted)' }}>On Track</span>
              </div>
              <div className="p-3.5 rounded-xl border text-center" style={{ backgroundColor: 'var(--surface-muted)', borderColor: 'var(--border)' }}>
                <span className="text-xl font-extrabold font-mono text-amber-400">4</span>
                <span className="text-[10px] font-mono uppercase block mt-1" style={{ color: 'var(--text-muted)' }}>Watchlist</span>
              </div>
              <div className="p-3.5 rounded-xl border text-center" style={{ backgroundColor: 'var(--surface-muted)', borderColor: 'var(--border)' }}>
                <span className="text-xl font-extrabold font-mono text-rose-400">2</span>
                <span className="text-[10px] font-mono uppercase block mt-1" style={{ color: 'var(--text-muted)' }}>At Risk</span>
              </div>
            </div>

            <div className="pt-2">
              <Link 
                to="/faculty/students"
                className="w-full py-3 rounded-xl font-bold font-mono text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.02]"
                style={{
                  backgroundColor: 'var(--cta)',
                  color: 'var(--cta-text)'
                }}
              >
                <span>View Full Supervised Cohort</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right Column: Live Constellation Canvas */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <ConstellationCanvas className="h-full min-h-[320px]" />
          </div>
        </motion.div>

        {/* 2. Review Queue & Urgent Actions */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Review Queue */}
          <div 
            className="lg:col-span-7 rounded-2xl border p-6 space-y-4 shadow-sm"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text)'
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Weekly Report Review Queue</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>5 reports awaiting academic evaluation</p>
              </div>
              <Link to="/faculty/reports" className="text-xs font-mono font-semibold hover:underline" style={{ color: 'var(--highlights)' }}>
                View All (5)
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Priya Sharma', roll: '20CS101', company: 'TechCorp Solutions', report: 'Week 4: OAuth2 PKCE & Microservices', date: 'Yesterday' },
                { name: 'Rahul Patel', roll: '20CS102', company: 'Innovatech Labs', report: 'Week 4: Real-time Caching with Redis', date: '2 days ago' },
                { name: 'Amit Kumar', roll: '20CS105', company: 'TechCorp Solutions', report: 'Week 3: Database Index Tuning', date: '3 days ago' },
              ].map((r, i) => (
                <div 
                  key={i} 
                  className="p-4 rounded-xl border flex items-center justify-between gap-4 transition-all hover:scale-[1.01]"
                  style={{ backgroundColor: 'var(--surface-muted)', borderColor: 'var(--border)' }}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs" style={{ color: 'var(--text)' }}>{r.name}</span>
                      <span className="text-[10px] font-mono opacity-60">({r.roll})</span>
                    </div>
                    <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--highlights)' }}>{r.report}</p>
                    <span className="text-[10px] font-mono opacity-50 block mt-0.5">{r.company} · {r.date}</span>
                  </div>

                  <Link 
                    to="/faculty/reports"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 transition-all"
                    style={{
                      backgroundColor: 'var(--cta)',
                      color: 'var(--cta-text)'
                    }}
                  >
                    <span>Evaluate</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* At-Risk Alerts */}
          <div 
            className="lg:col-span-5 rounded-2xl border p-6 space-y-4 shadow-sm"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text)'
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Urgent Interventions</h3>
                <p className="text-xs text-rose-400">2 students flagged by compliance rules</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-rose-300">Vikram Singh (20CS103)</span>
                  <span className="text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded">
                    65% Attendance
                  </span>
                </div>
                <p className="text-xs text-rose-200/80 leading-relaxed">
                  Below 75% institutional requirement. 3 consecutive days missing work logs.
                </p>
                <div className="pt-1 flex gap-2">
                  <button className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-semibold cursor-pointer">
                    Issue Warning
                  </button>
                  <button className="px-3 py-1 bg-white/10 text-white rounded-lg text-xs font-semibold cursor-pointer">
                    Contact Mentor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}
