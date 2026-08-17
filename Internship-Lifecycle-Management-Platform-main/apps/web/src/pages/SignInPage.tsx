import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  Building2, 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Lock,
  Mail,
  KeyRound,
  Layers
} from 'lucide-react';
import { type RoleKey } from '@/design-system/tokens';

const roles: {
  id: RoleKey;
  label: string;
  badge: string;
  icon: React.ElementType;
  heading: string;
  subheading: string;
  identifierLabel: string;
  identifierPlaceholder: string;
  defaultEmail: string;
  actionText: string;
  targetPath: string;
}[] = [
  {
    id: 'student',
    label: 'Student',
    badge: 'Growth & Momentum',
    icon: GraduationCap,
    heading: 'Student Launchpad',
    subheading: 'Track internships, log daily progress, and view placement readiness.',
    identifierLabel: 'College Roll / Student Email',
    identifierPlaceholder: 'priya.sharma@college.edu',
    defaultEmail: 'priya.sharma@college.edu',
    actionText: 'ENTER STUDENT LAUNCHPAD',
    targetPath: '/student',
  },
  {
    id: 'faculty',
    label: 'Faculty',
    badge: 'Academic Observatory',
    icon: BookOpen,
    heading: 'Faculty Observatory',
    subheading: 'Monitor cohort telemetry, review weekly reports, and guide at-risk interns.',
    identifierLabel: 'Faculty ID / University Email',
    identifierPlaceholder: 'rajesh.kumar@university.edu',
    defaultEmail: 'rajesh.kumar@university.edu',
    actionText: 'ENTER FACULTY OBSERVATORY',
    targetPath: '/faculty',
  },
  {
    id: 'company',
    label: 'Company Mentor',
    badge: 'Mission Control',
    icon: Building2,
    heading: 'Industry Workspace',
    subheading: 'Manage intern tasks, evaluate milestone submissions, and assess candidates.',
    identifierLabel: 'Company Work Email',
    identifierPlaceholder: 'mentor@techcorp.com',
    defaultEmail: 'mentor@techcorp.com',
    actionText: 'ENTER MISSION CONTROL',
    targetPath: '/company',
  },
  {
    id: 'admin',
    label: 'Administrator',
    badge: 'System Governance',
    icon: Shield,
    heading: 'Institutional Control',
    subheading: 'Manage institution configurations, verify credentials, and view system audits.',
    identifierLabel: 'Administrator Access Key / Email',
    identifierPlaceholder: 'admin.root@institution.edu',
    defaultEmail: 'admin.root@institution.edu',
    actionText: 'ENTER COMMAND CENTER',
    targetPath: '/admin',
  },
];

export default function SignInPage() {
  const [activeRole, setActiveRole] = useState<RoleKey>('student');
  const navigate = useNavigate();

  const currentRole = roles.find((r) => r.id === activeRole) || roles[0];
  const IconComponent = currentRole.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(currentRole.targetPath);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden bg-[#0A192F] text-white">
      {/* Subtle Ambient Navy Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Brand Bar */}
      <div className="z-10 mb-8 flex flex-col items-center text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
          <div className="w-10 h-10 rounded-xl bg-white text-[#0A192F] flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
            <Sparkles size={20} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">ILMP</span>
        </Link>
        <p className="text-xs font-mono uppercase tracking-widest text-slate-300 font-semibold">
          Unified Internship Lifecycle Platform
        </p>
      </div>

      {/* Main Dynamic Morphing Card (Pure White with Deep Navy Typography) */}
      <motion.div 
        layout
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className="w-full max-w-xl bg-white text-[#0A192F] rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 z-10 relative"
      >
        {/* A. Segmented Sliding Pill Role Switcher */}
        <div className="mb-8">
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
            {roles.map((role) => {
              const isSelected = activeRole === role.id;
              const RoleIcon = role.icon;

              return (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role.id)}
                  type="button"
                  className={`relative flex-1 py-2.5 px-3 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isSelected ? 'text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeRoleIndicator"
                      className="absolute inset-0 bg-[#0A192F] rounded-lg shadow-sm"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <RoleIcon size={14} className="relative z-10" />
                  <span className="relative z-10">{role.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* B. Dynamic Container Content with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Role Header Banner */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#0A192F] text-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <IconComponent size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold tracking-tight text-[#0A192F]">
                      {currentRole.heading}
                    </h2>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-[#0A192F] border border-slate-200">
                      {currentRole.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {currentRole.subheading}
                  </p>
                </div>
              </div>
            </div>

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 block">
                  {currentRole.identifierLabel}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    defaultValue={currentRole.defaultEmail}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#0A192F] focus:outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-[#0A192F] focus:border-transparent"
                    placeholder={currentRole.identifierPlaceholder}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 block">
                    Password / Access Key
                  </label>
                  <a href="#" className="text-xs text-slate-500 hover:text-slate-800 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    defaultValue="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#0A192F] focus:outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-[#0A192F] focus:border-transparent"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              {/* Submit CTA Button (Navy + White) */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] text-white font-bold font-mono text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer mt-2"
              >
                <span>{currentRole.actionText}</span>
                <ArrowRight size={14} />
              </button>
            </form>

            {/* Quick Demo Access Bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-mono">Demo Credentials Loaded</span>
              </span>
              <Link 
                to={`/sign-in/${activeRole}`} 
                className="font-medium text-[#0A192F] hover:underline flex items-center gap-1"
              >
                <span>Split Screen Login</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Bottom Footer Navigation */}
      <div className="z-10 mt-8 flex items-center gap-6 text-xs text-slate-400 font-medium">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span>•</span>
        <Link to="/verify/ILMP-2026-001" className="hover:text-white transition-colors">Verify Certificate</Link>
        <span>•</span>
        <Link to="/sign-up" className="hover:text-white transition-colors">Create Account</Link>
      </div>
    </div>
  );
}
