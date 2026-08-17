import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, Sparkles } from 'lucide-react';

export default function CompanyLoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex bg-[#0A192F] text-white overflow-hidden">
      {/* Left 55% - Timeline Cockpit (Deep Navy Panel) */}
      <div className="hidden lg:flex w-[55%] flex-col justify-between p-12 bg-[#0A192F] border-r border-white/10 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-[#0A192F] flex items-center justify-center shadow-md">
            <Building2 size={22} />
          </div>
          <div>
            <span className="font-bold tracking-tight text-lg text-white">ILMP</span>
            <span className="text-xs uppercase tracking-widest ml-2 text-blue-300 font-mono font-semibold">Industry Portal</span>
          </div>
        </div>

        <div className="z-10 max-w-xl my-auto py-6">
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 border border-white/20 text-xs font-mono font-semibold">
            <Sparkles size={12} />
            Industry Workspace & Mission Control
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3"
          >
            Bridge student potential with enterprise impact.
          </motion.h1>
          <p className="text-sm text-slate-300 font-medium tracking-wide mb-8">
            RECRUIT. ASSIGN. MENTOR. CONVERT.
          </p>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span className="text-xs font-mono font-bold text-blue-300 uppercase tracking-wider block">Enterprise Workspace</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Post verified internship opportunities, manage candidate pipelines, review daily technical logs, and assess sprint velocity.
            </p>
          </div>
        </div>

        <div className="z-10 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-white/10 font-mono">
          <span>Company Mentor Portal</span>
          <span>Navy & White Architecture</span>
        </div>
      </div>

      {/* Right 45% - Clean Form Panel (Pure White) */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-8 lg:p-16 relative bg-white text-[#0A192F]">
        <div className="absolute top-8 left-8">
          <Link to="/sign-in" className="flex items-center gap-2 text-slate-500 hover:text-[#0A192F] transition-colors text-xs font-mono font-semibold">
            <ArrowLeft className="w-4 h-4" />
            BACK TO PORTALS
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#0A192F]">Company Sign In</h2>
            <p className="text-xs text-slate-500 mt-1">Manage interns and evaluate candidate applications</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate('/company'); }}>
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 block">Company Work Email</label>
              <input 
                type="text" 
                defaultValue="mentor@techcorp.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0A192F] focus:outline-none focus:ring-2 focus:ring-[#0A192F] focus:border-transparent"
                placeholder="mentor@company.com"
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 block">Password</label>
                <a href="#" className="text-xs text-slate-500 hover:text-slate-800">Forgot?</a>
              </div>
              <input 
                type="password" 
                defaultValue="password123"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0A192F] focus:outline-none focus:ring-2 focus:ring-[#0A192F] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#0A192F] hover:bg-[#1E293B] text-white font-bold text-xs tracking-wider uppercase py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg mt-2 cursor-pointer"
            >
              ENTER MISSION CONTROL
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono">Demo: Click to enter</span>
            <Link to="/sign-in" className="text-[#0A192F] hover:underline font-bold">Switch role</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
