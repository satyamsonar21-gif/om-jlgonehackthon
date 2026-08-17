import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, GraduationCap, CheckCircle2, Sparkles, Check } from 'lucide-react';

const STAGES = [
  { id: 'DISCOVER', label: 'Discover Opportunities' },
  { id: 'APPLY', label: 'Submit Application' },
  { id: 'SELECT', label: 'Offer & Selection' },
  { id: 'ONBOARD', label: 'Digital Onboarding' },
  { id: 'WORK', label: 'Daily Work Logs' },
  { id: 'REVIEW', label: 'Weekly Faculty Review' },
  { id: 'CERTIFY', label: 'Verified Credential' }
];

export default function StudentLoginPage() {
  const navigate = useNavigate();
  const [activeStage, setActiveStage] = useState(4); // Default to WORK stage

  return (
    <div className="min-h-screen w-full flex bg-[#F3E9DD] text-[#6B4E3D] overflow-hidden">
      {/* Left 55% - Timeline Cockpit (Warm Earthy Sand & Coffee Panel) */}
      <div className="hidden lg:flex w-[55%] flex-col justify-between p-12 bg-[#F3E9DD] border-r border-[#E6D5C1] relative overflow-hidden">
        {/* Subtle Warm Amber Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[#A67C52]/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6B4E3D] text-white flex items-center justify-center shadow-md">
            <GraduationCap size={22} />
          </div>
          <div>
            <span className="font-bold tracking-tight text-lg text-[#6B4E3D]">ILMP</span>
            <span className="text-xs uppercase tracking-widest ml-2 text-[#A67C52] font-mono font-semibold">Student Launchpad</span>
          </div>
        </div>

        <div className="z-10 max-w-xl my-auto py-6">
          <div className="mb-4 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E6D5C1] text-[#6B4E3D] border border-[#D4C2AE] text-xs font-mono font-bold">
            <Sparkles size={12} className="text-[#A67C52]" />
            Career Momentum Cockpit
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#6B4E3D] mb-3"
          >
            Your internship is more than a line on your CV.
          </motion.h1>
          <p className="text-sm text-[#8C7362] font-medium tracking-wide mb-8">
            LEARN. LOG. DEMONSTRATE. PROVE.
          </p>

          {/* Animated Vertical Lifecycle Stepper */}
          <div className="relative pl-6 border-l-2 border-[#E6D5C1] space-y-4">
            {STAGES.map((stage, index) => {
              const isPast = index < activeStage;
              const isActive = index === activeStage;
              
              return (
                <motion.div 
                  key={stage.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.06 }}
                  className="relative flex items-center"
                >
                  {/* Timeline Dot */}
                  <div 
                    className={`absolute -left-[31px] w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                      isActive 
                        ? 'bg-[#6B4E3D] ring-4 ring-[#E6D5C1] text-white' 
                        : isPast 
                        ? 'bg-[#A67C52] text-white' 
                        : 'bg-[#E6D5C1] border-2 border-white'
                    }`}
                  >
                    {isPast && <Check size={8} className="font-bold" />}
                  </div>

                  <div className={`text-xs font-mono font-medium transition-colors ${
                    isActive 
                      ? 'text-[#6B4E3D] font-bold text-sm' 
                      : isPast 
                      ? 'text-[#6B4E3D]' 
                      : 'text-[#8C7362]'
                  }`}>
                    {stage.label}
                    {isActive && (
                      <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-[#E6D5C1] text-[#6B4E3D] font-bold">
                        ACTIVE STAGE
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="z-10 flex items-center justify-between text-xs text-[#8C7362] pt-4 border-t border-[#E6D5C1] font-mono">
          <span>Student Experience Portal</span>
          <span>Earthy Sand & Coffee Edition</span>
        </div>
      </div>

      {/* Right 45% - Clean Form Panel (Pure White) */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-8 lg:p-16 relative bg-white text-[#6B4E3D]">
        <div className="absolute top-8 left-8">
          <Link to="/sign-in" className="flex items-center gap-2 text-[#8C7362] hover:text-[#6B4E3D] transition-colors text-xs font-mono font-semibold">
            <ArrowLeft className="w-4 h-4" />
            BACK TO PORTALS
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#6B4E3D]">Student Sign In</h2>
            <p className="text-xs text-[#8C7362] mt-1">Access your active work logs and placement metrics</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate('/student'); }}>
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-[#6B4E3D] block">College ID / Student Email</label>
              <input 
                type="text" 
                defaultValue="priya.sharma@college.edu"
                className="w-full bg-[#F3E9DD]/50 border border-[#E6D5C1] rounded-xl px-4 py-3 text-sm text-[#6B4E3D] focus:outline-none focus:ring-2 focus:ring-[#6B4E3D] focus:border-transparent"
                placeholder="student@college.edu"
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-[#6B4E3D] block">Password</label>
                <a href="#" className="text-xs text-[#8C7362] hover:text-[#6B4E3D]">Forgot?</a>
              </div>
              <input 
                type="password" 
                defaultValue="password123"
                className="w-full bg-[#F3E9DD]/50 border border-[#E6D5C1] rounded-xl px-4 py-3 text-sm text-[#6B4E3D] focus:outline-none focus:ring-2 focus:ring-[#6B4E3D] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#6B4E3D] hover:bg-[#523B2E] text-white font-bold text-xs tracking-wider uppercase py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg mt-2 cursor-pointer"
            >
              ENTER STUDENT LAUNCHPAD
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#E6D5C1] flex items-center justify-between text-xs text-[#8C7362]">
            <span className="font-mono">Demo: Click to enter</span>
            <Link to="/sign-in" className="text-[#A67C52] hover:underline font-bold">Switch role</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
