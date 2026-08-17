import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex bg-[#FAF5FF] text-[#03071E] overflow-hidden">
      {/* Left 55% - Light Airy Lavender Cockpit Panel */}
      <div className="hidden lg:flex w-[55%] flex-col justify-between p-12 bg-[#F3E8FF]/60 border-r border-[#E9D5FF] relative overflow-hidden">
        {/* Subtle Lavender Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[#E0AAFF]/25 rounded-full blur-[120px] pointer-events-none" />

        <div className="z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3C096C] text-[#FBB02D] flex items-center justify-center shadow-md">
            <Shield size={22} />
          </div>
          <div>
            <span className="font-bold tracking-tight text-lg text-[#03071E]">ILMP</span>
            <span className="text-xs uppercase tracking-widest ml-2 text-[#7C3AED] font-mono font-semibold">Institutional Governance</span>
          </div>
        </div>

        <div className="z-10 max-w-xl my-auto py-6">
          <div className="mb-4 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ECCAFF]/50 text-[#3C096C] border border-[#E9D5FF] text-xs font-mono font-bold">
            <Sparkles size={12} className="text-[#7C3AED]" />
            Institutional Master Node
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#03071E] mb-3"
          >
            Institutional governance and cryptographic credentials.
          </motion.h1>
          <p className="text-sm text-[#6B21A8] font-medium tracking-wide mb-8">
            AUDIT. GOVERN. COMPLY. ISSUE.
          </p>

          <div className="p-6 rounded-2xl bg-white border border-[#E9D5FF] shadow-sm space-y-3">
            <span className="text-xs font-mono font-bold text-[#7C3AED] uppercase tracking-wider block">Master Control Dashboard</span>
            <p className="text-xs text-[#03071E]/80 leading-relaxed">
              Full campus oversight, access control management, institutional compliance thresholds, and Ed25519 digital signature issuance.
            </p>
          </div>
        </div>

        <div className="z-10 flex items-center justify-between text-xs text-[#6B21A8] pt-4 border-t border-[#E9D5FF] font-mono">
          <span>Administrator Command Portal</span>
          <span>Airy Lavender Edition</span>
        </div>
      </div>

      {/* Right 45% - Clean Form Panel (Pure White) */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-8 lg:p-16 relative bg-white text-[#03071E]">
        <div className="absolute top-8 left-8">
          <Link to="/sign-in" className="flex items-center gap-2 text-slate-500 hover:text-[#3C096C] transition-colors text-xs font-mono font-semibold">
            <ArrowLeft className="w-4 h-4" />
            BACK TO PORTALS
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#03071E]">Admin Sign In</h2>
            <p className="text-xs text-slate-500 mt-1">Institutional system governance and compliance control</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate('/admin'); }}>
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 block">Administrator Email / Access Key</label>
              <input 
                type="text" 
                defaultValue="admin.root@institution.edu"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#03071E] focus:outline-none focus:ring-2 focus:ring-[#3C096C] focus:border-transparent"
                placeholder="admin@institution.edu"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#03071E] focus:outline-none focus:ring-2 focus:ring-[#3C096C] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#3C096C] hover:bg-[#240046] text-white font-bold text-xs tracking-wider uppercase py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg mt-2 cursor-pointer"
            >
              ENTER COMMAND CENTER
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono">Demo: Click to enter</span>
            <Link to="/sign-in" className="text-[#7C3AED] hover:underline font-bold">Switch role</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
