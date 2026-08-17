import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex bg-[#F2F7FB] text-[#0F2942] overflow-hidden">
      {/* Left 55% - Frost Blue Cockpit Panel */}
      <div className="hidden lg:flex w-[55%] flex-col justify-between p-12 bg-[#F2F7FB] border-r border-[#D6E6F2] relative overflow-hidden">
        {/* Subtle Frost Blue Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[#8DB4D6]/25 rounded-full blur-[120px] pointer-events-none" />

        <div className="z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1E3A5F] text-[#8DB4D6] flex items-center justify-center shadow-md">
            <Shield size={22} />
          </div>
          <div>
            <span className="font-bold tracking-tight text-lg text-[#0F2942]">ILMP</span>
            <span className="text-xs uppercase tracking-widest ml-2 text-[#1E3A5F] font-mono font-semibold">Institutional Governance</span>
          </div>
        </div>

        <div className="z-10 max-w-xl my-auto py-6">
          <div className="mb-4 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D6E6F2] text-[#0F2942] border border-[#8DB4D6]/40 text-xs font-mono font-bold">
            <Sparkles size={12} className="text-[#1E3A5F]" />
            Institutional Master Node
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F2942] mb-3"
          >
            Institutional governance and cryptographic credentials.
          </motion.h1>
          <p className="text-sm text-[#486581] font-medium tracking-wide mb-8">
            AUDIT. GOVERN. COMPLY. ISSUE.
          </p>

          <div className="p-6 rounded-2xl bg-white border border-[#D6E6F2] shadow-sm space-y-3">
            <span className="text-xs font-mono font-bold text-[#1E3A5F] uppercase tracking-wider block">Master Control Dashboard</span>
            <p className="text-xs text-[#486581] leading-relaxed">
              Full campus oversight, access control management, institutional compliance thresholds, and Ed25519 digital signature issuance.
            </p>
          </div>
        </div>

        <div className="z-10 flex items-center justify-between text-xs text-[#486581] pt-4 border-t border-[#D6E6F2] font-mono">
          <span>Administrator Command Portal</span>
          <span>Frost & Steel Blue Edition</span>
        </div>
      </div>

      {/* Right 45% - Clean Form Panel (Pure White) */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-8 lg:p-16 relative bg-white text-[#0F2942]">
        <div className="absolute top-8 left-8">
          <Link to="/sign-in" className="flex items-center gap-2 text-slate-500 hover:text-[#1E3A5F] transition-colors text-xs font-mono font-semibold">
            <ArrowLeft className="w-4 h-4" />
            BACK TO PORTALS
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#0F2942]">Admin Sign In</h2>
            <p className="text-xs text-slate-500 mt-1">Institutional system governance and compliance control</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate('/admin'); }}>
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 block">Administrator Email / Access Key</label>
              <input 
                type="text" 
                defaultValue="admin.root@institution.edu"
                className="w-full bg-[#F2F7FB] border border-[#D6E6F2] rounded-xl px-4 py-3 text-sm text-[#0F2942] focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
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
                className="w-full bg-[#F2F7FB] border border-[#D6E6F2] rounded-xl px-4 py-3 text-sm text-[#0F2942] focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#1E3A5F] hover:bg-[#132742] text-white font-bold text-xs tracking-wider uppercase py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg mt-2 cursor-pointer"
            >
              ENTER COMMAND CENTER
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#D6E6F2] flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono">Demo: Click to enter</span>
            <Link to="/sign-in" className="text-[#1E3A5F] hover:underline font-bold">Switch role</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
