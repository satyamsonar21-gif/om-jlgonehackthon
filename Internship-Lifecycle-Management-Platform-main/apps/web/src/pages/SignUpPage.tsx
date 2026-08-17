import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Building2, Shield, ArrowRight, Sparkles } from 'lucide-react';

const portals = [
  {
    role: 'Student',
    href: '/sign-in/student',
    icon: GraduationCap,
    tagline: 'Growth & Momentum',
    description: 'Track your active internship lifecycle, submit daily logs, view reports, and calculate placement readiness.',
  },
  {
    role: 'Faculty',
    href: '/sign-in/faculty',
    icon: BookOpen,
    tagline: 'Academic Observatory',
    description: 'Supervise enrolled cohort telemetry, evaluate weekly synthesis reports, and guide at-risk students.',
  },
  {
    role: 'Company Mentor',
    href: '/sign-in/company',
    icon: Building2,
    tagline: 'Mission Control',
    description: 'Manage active intern technical tasks, review milestone deliverables, and evaluate student applications.',
  },
  {
    role: 'Administrator',
    href: '/sign-in/admin',
    icon: Shield,
    tagline: 'Institutional Governance',
    description: 'Full system oversight, institutional compliance analytics, access control, and certificate registries.',
  },
];

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-10 h-10 rounded-xl bg-white text-[#0A192F] flex items-center justify-center shadow-md">
              <Sparkles size={20} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">ILMP</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Select Your Role
          </h1>
          <p className="text-xs text-slate-300 font-mono mt-1 uppercase tracking-wider">
            Choose your institutional identity to begin
          </p>
        </motion.div>

        <div className="space-y-3.5">
          {portals.map((portal, i) => (
            <motion.div 
              key={portal.role} 
              initial={{ opacity: 0, x: -15 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to={portal.href}
                className="p-5 flex items-start gap-4 cursor-pointer group rounded-2xl bg-white text-[#0A192F] border border-slate-200 transition-all hover:scale-[1.01] shadow-xl"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0A192F] text-white flex items-center justify-center shadow-xs flex-shrink-0 transition-transform group-hover:scale-105">
                  <portal.icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-[#0A192F]">{portal.role}</h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-[#0A192F]">
                      {portal.tagline}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{portal.description}</p>
                </div>
                <ArrowRight 
                  size={16} 
                  className="text-slate-400 group-hover:translate-x-1 group-hover:text-[#0A192F] transition-all flex-shrink-0 mt-1" 
                />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-medium">
          <Link to="/sign-in" className="hover:text-white">Already have an account? Sign In</Link>
          <Link to="/" className="hover:text-white">Platform Home</Link>
        </div>
      </div>
    </div>
  );
}
