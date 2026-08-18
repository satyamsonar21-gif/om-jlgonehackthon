import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, TrendingUp, CheckCircle2, Award, BookOpen, Clock, AlertCircle } from 'lucide-react';

export default function PlacementScorePage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const dimensions = [
    { name: 'Biometric Attendance & Punctuality', score: 95, weight: '20%', desc: '23 of 25 days recorded without absence' },
    { name: 'Weekly Synthesis Report Quality', score: 92, weight: '25%', desc: '4 of 4 reports approved with 4.8/5 avg' },
    { name: 'Sprint Task Velocity & PRs', score: 85, weight: '20%', desc: '8 of 10 deliverables merged ahead of schedule' },
    { name: 'Industry Supervisor Appraisal', score: 98, weight: '20%', desc: 'Rated 4.9/5.0 by TechCorp Lead Architect' },
    { name: 'Profile Completeness & Dossier', score: 90, weight: '15%', desc: 'Verified GitHub, skills, and academic transcripts' },
  ];

  const overallScore = 92;

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Placement Readiness Index"
        subtitle="Institutional multi-dimensional readiness benchmark for graduating students"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Main Score Hero */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
                <Sparkles size={12} />
                <span>TOP 5% IN COHORT</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Placement Readiness Score: {overallScore} / 100
              </h1>
              <p className="text-xs text-slate-600 leading-relaxed max-w-lg">
                Calculated dynamically from attendance biometric timestamps, weekly faculty grades, industry sprint velocity, and supervisor appraisals.
              </p>
            </div>

            <div className="w-24 h-24 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-700 flex flex-col items-center justify-center font-bold flex-shrink-0 shadow-sm">
              <span className="text-3xl font-black font-mono leading-none">{overallScore}</span>
              <span className="text-[10px] font-mono uppercase mt-1">Verified</span>
            </div>
          </div>

          {/* Breakdown Dimensions */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Evaluation Dimensions & Weights
            </h3>

            <div className="space-y-3.5">
              {dimensions.map((dim, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{dim.name}</span>
                      <span className="text-[11px] text-slate-500 block">{dim.desc}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-900 text-sm">{dim.score}%</span>
                      <span className="text-[10px] font-mono text-slate-400 block">Weight: {dim.weight}</span>
                    </div>
                  </div>

                  <Progress value={dim.score} size="sm" variant="success" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
