import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Target, TrendingUp, Lightbulb, Code, Users, Brain, BookOpen, MessageSquare, Sparkles } from 'lucide-react';

const dimensions = [
  { name: 'Technical Skills', score: 82, icon: Code, color: '#0D9488' },
  { name: 'Communication', score: 74, icon: MessageSquare, color: '#4338CA' },
  { name: 'Problem Solving', score: 88, icon: Brain, color: '#0284C7' },
  { name: 'Teamwork', score: 71, icon: Users, color: '#10B981' },
  { name: 'Domain Knowledge', score: 79, icon: BookOpen, color: '#D97706' },
  { name: 'Soft Skills & Leadership', score: 70, icon: Target, color: '#BE123C' },
];

export default function PlacementScorePage() {
  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="Placement Readiness Index" subtitle="Multi-dimensional competency assessment" />
      
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Overall Circular Score */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center justify-between space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#0D9488] text-xs font-mono font-bold mb-4">
                <Sparkles size={12} />
                Calculated Score
              </div>
              <h2 className="text-xl font-bold text-slate-900">Overall Readiness</h2>
              <p className="text-xs text-slate-500 mt-1">Based on 6 verified evaluation pillars</p>
            </div>

            <div className="relative w-44 h-44 flex items-center justify-center my-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="transparent" stroke="#E2E8F0" strokeWidth="8" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="42" 
                  fill="transparent" 
                  stroke="#0D9488" 
                  strokeWidth="8" 
                  strokeDasharray="264" 
                  strokeDashoffset={264 * (1 - 0.78)} 
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-extrabold font-mono text-slate-900">78</span>
                <span className="text-xs font-mono text-slate-400">/ 100</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 w-full">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block">
                TIER 1 ELIGIBLE (STRONG)
              </span>
              <p className="text-xs text-slate-500 leading-relaxed">
                You qualify for prime Tier-1 engineering placement opportunities. Focus on Communication to reach 85%+.
              </p>
            </div>
          </div>

          {/* Right Column: 6-Dimension Breakdown */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Competency Pillar Breakdown</h3>
              <span className="text-xs font-mono text-slate-400">Weighted Average</span>
            </div>

            <div className="space-y-4">
              {dimensions.map((dim) => {
                const Icon = dim.icon;
                return (
                  <div key={dim.name} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-xs"
                          style={{ backgroundColor: dim.color }}
                        >
                          <Icon size={14} />
                        </div>
                        <span className="font-bold text-xs text-slate-900">{dim.name}</span>
                      </div>
                      <span className="font-mono font-bold text-xs" style={{ color: dim.color }}>
                        {dim.score} / 100
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ width: `${dim.score}%`, backgroundColor: dim.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
