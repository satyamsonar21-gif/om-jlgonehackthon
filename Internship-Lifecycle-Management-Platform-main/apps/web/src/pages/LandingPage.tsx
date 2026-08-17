import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Search, 
  FileText, 
  BarChart, 
  CheckCircle, 
  Users, 
  Cpu, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck,
  Building2,
  BookOpen,
  Sparkles,
  ChevronRight,
  Shield,
  Activity,
  Award,
  Clock,
  TrendingUp,
  Lock,
  Layers,
  Check
} from 'lucide-react';

const steps = [
  {
    step: 1,
    title: "Discover & Match",
    role: "Student",
    desc: "Browse AI-vetted verified listings from verified industry partners. Filter by domain, tech stack, and location.",
    icon: Search
  },
  {
    step: 2,
    title: "Apply & Faculty Clearance",
    role: "Faculty Guide",
    desc: "Submit application dossiers for instant institutional validation and formal academic department clearance.",
    icon: CheckCircle
  },
  {
    step: 3,
    title: "Work, Log & Coordinate",
    role: "Company Mentor",
    desc: "Clock in daily attendance, document technical deliverables, and collaborate with designated industry supervisors.",
    icon: Briefcase
  },
  {
    step: 4,
    title: "Synthesized Weekly Reviews",
    role: "Faculty & Mentor",
    desc: "Submit structured weekly synthesis reports. Mentors evaluate deliverables while faculty track compliance telemetry.",
    icon: FileText
  },
  {
    step: 5,
    title: "Tamper-Proof Credential",
    role: "Administrator",
    desc: "Generate digitally signed, QR-verifiable certificates accredited by the university institution.",
    icon: ShieldCheck
  }
];

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <div className="min-h-screen bg-[#0A192F] text-white font-sans selection:bg-[#3B82F6]/30">
      {/* 1. Header Navigation (Sticky + Backdrop Blur + 8px Grid) */}
      <header className="sticky top-0 z-50 bg-[#0A192F]/85 backdrop-blur-md border-b border-white/10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-[#0A192F] flex items-center justify-center font-bold shadow-xs">
              <Sparkles size={18} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">ILMP</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#ecosystem" className="hover:text-white transition-colors">Bento Architecture</a>
            <Link to="/verify/ILMP-2026-001" className="hover:text-white transition-colors">Verify Credential</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              to="/sign-in" 
              className="text-xs font-semibold px-4 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/sign-in" 
              className="text-xs font-bold font-mono px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#0A192F] shadow-xs transition-all hover:scale-105"
            >
              Launch Portal
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* 2. Hero Section (Strict Typography Scale & Centered Bounded Container) */}
        <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center overflow-hidden">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/20 bg-white/5 text-slate-200 text-xs font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Institutional Internship Lifecycle Engine</span>
            </div>

            {/* Display / Hero: 36px–48px, Tight Tracking -0.02em, Line Height 1.15 */}
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-[-0.02em] leading-[1.15]">
              Unified Career Cockpit & Governance Platform
            </h1>

            {/* Body Text: 15px, Line Height 1.6, Slate-300 */}
            <p className="text-sm sm:text-base text-slate-300 leading-[1.6] max-w-2xl mx-auto font-normal">
              A single institutional architecture connecting Students, Faculty Guides, Industry Mentors, and Administrators with live telemetry and tamper-proof credentials.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/sign-in" 
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-[#0A192F] text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-105 cursor-pointer"
              >
                <span>Enter Unified Hub</span>
                <ArrowRight size={16} />
              </Link>
              <a 
                href="#how-it-works" 
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 text-white text-xs font-semibold transition-all flex items-center justify-center cursor-pointer"
              >
                Explore 7-Stage Stepper
              </a>
            </div>
          </div>
        </section>

        {/* 3. Asymmetric Bento Grid Architecture */}
        <section id="ecosystem" className="py-20 border-t border-white/10 bg-[#0F223D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <span className="text-xs font-mono uppercase tracking-[0.025em] text-blue-300 font-bold">
                Bento Grid Layout
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-[-0.015em]">
                Four Specialized Operational Worlds
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-[1.6]">
                Asymmetric role workspaces designed for high operational throughput.
              </p>
            </div>

            {/* Asymmetric Bento Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Spotlight Card 1: Student Career Cockpit (Span 7) */}
              <div className="md:col-span-7 bg-white text-[#0A192F] rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0A192F] text-white flex items-center justify-center shadow-xs">
                      <GraduationCap size={24} />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-[#0A192F]">
                      Spotlight 01 · Student Launchpad
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0A192F] tracking-tight mb-2">
                    Continuous Career Momentum & Readiness
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-[1.6] mb-6">
                    Track your 7-stage active internship lifecycle, clock daily sprint deliverables, log weekly reflections, and monitor real-time AI placement scores.
                  </p>

                  {/* Micro-Dashboard Preview */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 mb-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono text-slate-500">Placement Readiness Index</span>
                      <span className="font-mono font-bold text-emerald-700">78% Verified</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-[#0A192F] rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">Earthy Sand & Coffee Engine</span>
                  <Link 
                    to="/sign-in/student"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A192F] hover:underline"
                  >
                    <span>Launch Cockpit</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Spotlight Card 2: Faculty Observatory (Span 5) */}
              <div className="md:col-span-5 bg-white text-[#0A192F] rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0A192F] text-white flex items-center justify-center shadow-xs">
                      <BookOpen size={24} />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-[#0A192F]">
                      Academic Radar
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0A192F] tracking-tight mb-2">
                    Faculty Star-Map Observatory
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-[1.6] mb-4">
                    Live telemetry tracking across 28 supervised interns with compliance alerts and report evaluations.
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-slate-50 border border-slate-200/80 mb-4">
                    <div>
                      <span className="font-mono font-bold text-sm text-emerald-700">22</span>
                      <span className="text-[9px] font-mono text-slate-500 block">On Track</span>
                    </div>
                    <div>
                      <span className="font-mono font-bold text-sm text-amber-700">4</span>
                      <span className="text-[9px] font-mono text-slate-500 block">Watchlist</span>
                    </div>
                    <div>
                      <span className="font-mono font-bold text-sm text-rose-700">2</span>
                      <span className="text-[9px] font-mono text-slate-500 block">At Risk</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">28 Supervised</span>
                  <Link 
                    to="/sign-in/faculty"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A192F] hover:underline"
                  >
                    <span>Enter Observatory</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Compact Card 3: Company Mission Control (Span 6) */}
              <div className="md:col-span-6 bg-white text-[#0A192F] rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0A192F] text-white flex items-center justify-center shadow-xs">
                      <Building2 size={24} />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-[#0A192F]">
                      Enterprise Workspace
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0A192F] tracking-tight mb-2">
                    Industry Supervisor Mission Control
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-[1.6] mb-4">
                    Post verified listings, manage technical sprint tasks, evaluate milestone submissions, and assess candidates.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">5 Active Interns</span>
                  <Link 
                    to="/sign-in/company"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A192F] hover:underline"
                  >
                    <span>Manage Team</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Compact Card 4: Administrator Governance (Span 6) */}
              <div className="md:col-span-6 bg-white text-[#0A192F] rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0A192F] text-white flex items-center justify-center shadow-xs">
                      <Shield size={24} />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-[#0A192F]">
                      Institutional Node
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0A192F] tracking-tight mb-2">
                    Campus Compliance & Cryptographic Signoff
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-[1.6] mb-4">
                    Master event ledger, system configurations, multi-department analytics, and Ed25519 tamper-proof certificate issuance.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">Master Key Active</span>
                  <Link 
                    to="/sign-in/admin"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A192F] hover:underline"
                  >
                    <span>System Control</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Interactive "How It Works" 5-Stage Stepper */}
        <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-mono uppercase tracking-[0.025em] text-blue-300 font-bold">
              End-to-End Lifecycle
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-[-0.015em]">
              Interactive Milestone Progression
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-[1.6]">
              Hover over each milestone to observe stage synchronization across the entire lifecycle.
            </p>
          </div>

          {/* Stepper Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {steps.map((item, idx) => {
              const isActive = activeStep === idx;
              const StepIcon = item.icon;

              return (
                <motion.div
                  key={item.step}
                  onMouseEnter={() => setActiveStep(idx)}
                  onClick={() => setActiveStep(idx)}
                  className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-white text-[#0A192F] border-white shadow-2xl scale-[1.03] z-10'
                      : 'bg-white/5 text-white border-white/10 opacity-75 hover:opacity-100 hover:bg-white/10'
                  }`}
                  layout
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div 
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${
                          isActive ? 'bg-[#0A192F] text-white' : 'bg-white/10 text-white'
                        }`}
                      >
                        <StepIcon size={18} />
                      </div>
                      <span className={`text-xs font-mono font-bold ${isActive ? 'text-slate-400' : 'text-slate-400'}`}>
                        0{item.step}
                      </span>
                    </div>

                    <span 
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isActive ? 'bg-slate-100 text-[#0A192F]' : 'bg-white/10 text-slate-200'
                      }`}
                    >
                      {item.role}
                    </span>

                    <h3 className={`text-sm font-bold mt-2 mb-1.5 ${isActive ? 'text-[#0A192F]' : 'text-white'}`}>
                      {item.title}
                    </h3>
                    <p className={`text-xs leading-relaxed ${isActive ? 'text-slate-600' : 'text-slate-300'}`}>
                      {item.desc}
                    </p>
                  </div>

                  <div className={`pt-4 mt-4 border-t flex items-center justify-between text-[11px] font-mono ${
                    isActive ? 'border-slate-100 text-slate-500' : 'border-white/10 text-slate-400'
                  }`}>
                    <span>Stage 0{item.step}</span>
                    <span>Ready</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>

      {/* 5. Footer */}
      <footer className="border-t border-white/10 bg-[#060F1E] py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-white text-[#0A192F] flex items-center justify-center font-bold text-xs">
              I
            </div>
            <span className="font-bold text-white">ILMP</span>
            <span className="text-slate-500">· Internship Lifecycle Management Platform</span>
          </div>
          <p>© 2026 ILMP. Clean Navy & White Edition.</p>
        </div>
      </footer>
    </div>
  );
}
