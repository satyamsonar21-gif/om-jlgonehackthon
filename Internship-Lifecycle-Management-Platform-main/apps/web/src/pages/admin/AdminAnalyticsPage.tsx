import React, { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import {
  BarChart,
  Users,
  Building2,
  Award,
  TrendingUp,
  ShieldCheck,
  Download,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Calendar,
  Clock,
  Briefcase,
  Target,
  ArrowRight,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAdminAnalytics } from '@/lib/queries';
import { toast } from 'sonner';

export default function AdminAnalyticsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const { data: serverAnalytics, isLoading: loading } = useAdminAnalytics();
  const [exporting, setExporting] = useState(false);
  const [selectedDept, setSelectedDept] = useState('ALL');

  const data = serverAnalytics;

  const handleExportCsv = async (type: string) => {
    setExporting(true);
    try {
      const res = await api.exportCsv(type);
      if (res.data?.csv) {
        const blob = new Blob([res.data.csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', res.data.filename || `${type}_report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Exported ${type} accreditation report to CSV`);
      }
    } catch {
      toast.error('Failed to export CSV report');
    } finally {
      setExporting(false);
    }
  };

  const funnel = data?.funnel || { applied: 1284, shortlisted: 642, selected: 412, joined: 386, completed: 290, ppo: 114 };
  const conversion = data?.conversionRates || { applyToSelect: 32.1, selectToJoin: 93.7, joinToComplete: 75.1, completeToPPO: 39.3 };
  const departments = data?.departmentStats || [
    { department: 'Computer Science', totalStudents: 420, activeInternships: 165, completedInternships: 120, placementRate: 68 },
    { department: 'Information Technology', totalStudents: 380, activeInternships: 140, completedInternships: 95, placementRate: 62 },
    { department: 'Electronics & Comm', totalStudents: 290, activeInternships: 55, completedInternships: 45, placementRate: 34 },
    { department: 'Mechanical Engineering', totalStudents: 194, activeInternships: 26, completedInternships: 30, placementRate: 29 },
  ];
  const companyParticipation = data?.companyParticipation || [
    { name: 'TechNova Solutions Pvt Ltd', domain: 'Full Stack & Cloud', activeInterns: 48, totalListings: 6 },
    { name: 'InfoSys Digital Labs', domain: 'Enterprise Java & DevOps', activeInterns: 36, totalListings: 4 },
    { name: 'Persistent Systems Ltd', domain: 'Data Engineering', activeInterns: 28, totalListings: 3 },
    { name: 'Tata Consultancy Services', domain: 'Software Engineering', activeInterns: 24, totalListings: 5 },
    { name: 'L&T Infotech', domain: 'Systems Engineering', activeInterns: 18, totalListings: 2 },
  ];
  const placementTrend = data?.placementTrend || [
    { month: 'Mar 2026', placed: 45, active: 30 },
    { month: 'Apr 2026', placed: 110, active: 85 },
    { month: 'May 2026', placed: 220, active: 180 },
    { month: 'Jun 2026', placed: 310, active: 270 },
    { month: 'Jul 2026', placed: 375, active: 340 },
    { month: 'Aug 2026', placed: 412, active: 386 },
  ];
  const attendanceCohorts = data?.attendanceCohorts || { above85: 320, between75and85: 58, below75AtRisk: 8 };
  const skillGaps = data?.skillGaps || [];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Institutional Placement & Accreditation Analytics"
        subtitle="Live multi-dimensional analytics: placement momentum, department benchmarks, partner hiring, attendance discipline, and industry skill gaps"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-700">Filter Department:</span>
            {['ALL', 'Computer Science', 'Information Technology', 'Electronics & Comm', 'Mechanical Engineering'].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDept(d)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedDept === d
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {d === 'ALL' ? 'All Departments' : d.replace(' Engineering', '')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleExportCsv('students')}
              disabled={exporting}
              className="text-xs gap-1.5"
            >
              <FileSpreadsheet size={14} className="text-emerald-600" />
              <span>Export Students CSV</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleExportCsv('companies')}
              disabled={exporting}
              className="text-xs gap-1.5"
            >
              <FileSpreadsheet size={14} className="text-blue-600" />
              <span>Export MoUs CSV</span>
            </Button>
          </div>
        </div>

        {/* ─── VISUALIZATION 1: PLACEMENT TREND OVER 6 MONTHS ──────────────────── */}
        <Card className="p-6 border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-600" />
                <span>1. Internship Placement & Enrollment Momentum (6-Month Trend)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Answers: <em>How is our placement conversion and active intern enrollment growing over time?</em>
              </p>
            </div>
            <Badge variant="info" size="sm">Term 2026 Progression</Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            {placementTrend.map((t: any) => (
              <div key={t.month} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">{t.month}</span>
                <span className="text-lg font-black font-mono text-slate-900 block">{t.placed}</span>
                <span className="text-[10px] text-emerald-700 font-semibold block">{t.active} Active Sprints</span>
              </div>
            ))}
          </div>
        </Card>

        {/* ─── VISUALIZATION 2 & 3: APPLICATION FUNNEL & ATTENDANCE ───────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* VISUALIZATION 2: APPLICATION FUNNEL (Span 7) */}
          <div className="lg:col-span-7">
            <Card className="h-full p-6 border-slate-200 space-y-4">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Target size={16} className="text-indigo-600" />
                  <span>2. Full Application Conversion Funnel</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Answers: <em>Where do candidate drop-offs occur across the university placement pipeline?</em>
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { label: 'Applied', count: funnel.applied, rate: 100, color: 'bg-slate-200' },
                  { label: 'Shortlisted for Interview', count: funnel.shortlisted, rate: Math.round((funnel.shortlisted / funnel.applied) * 100), color: 'bg-blue-300' },
                  { label: 'Selected & Offer Issued', count: funnel.selected, rate: Math.round((funnel.selected / funnel.applied) * 100), color: 'bg-indigo-400' },
                  { label: 'Joined Active Internship', count: funnel.joined, rate: Math.round((funnel.joined / funnel.applied) * 100), color: 'bg-emerald-500' },
                  { label: 'Completed & Certified', count: funnel.completed, rate: Math.round((funnel.completed / funnel.applied) * 100), color: 'bg-teal-600' },
                  { label: 'PPO Full-Time Conversion', count: funnel.ppo, rate: Math.round((funnel.ppo / funnel.applied) * 100), color: 'bg-purple-600' },
                ].map((step) => (
                  <div key={step.label} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">{step.label}</span>
                      <span className="font-mono text-slate-900 font-bold">{step.count} ({step.rate}%)</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${step.color} rounded-full`} style={{ width: `${Math.max(5, step.rate)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* VISUALIZATION 3: ATTENDANCE COMPLIANCE COHORTS (Span 5) */}
          <div className="lg:col-span-5">
            <Card className="h-full p-6 border-slate-200 space-y-4">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Clock size={16} className="text-emerald-600" />
                  <span>3. Campus Attendance & Compliance</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Answers: <em>What proportion of interns satisfy the mandatory 75.0% threshold?</em>
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-emerald-950 text-xs">Exemplary Presence (≥ 85%)</span>
                    <span className="text-[10px] text-emerald-800 block">High professional discipline</span>
                  </div>
                  <span className="text-base font-black font-mono text-emerald-950">{attendanceCohorts.above85} Interns</span>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-blue-950 text-xs">Compliant (75% – 84%)</span>
                    <span className="text-[10px] text-blue-800 block">Satisfies institutional criteria</span>
                  </div>
                  <span className="text-base font-black font-mono text-blue-950">{attendanceCohorts.between75and85} Interns</span>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-rose-950 text-xs">At-Risk Alert (&lt; 75%)</span>
                    <span className="text-[10px] text-rose-800 block">Requires Faculty Mentor intervention</span>
                  </div>
                  <span className="text-base font-black font-mono text-rose-950">{attendanceCohorts.below75AtRisk} Interns</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* ─── VISUALIZATION 4 & 5: DEPARTMENT BENCHMARKS & COMPANY HIRING ─────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* VISUALIZATION 4: DEPARTMENT PARTICIPATION (Span 7) */}
          <div className="lg:col-span-7">
            <Card className="h-full p-6 border-slate-200 space-y-4">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Users size={16} className="text-blue-600" />
                  <span>4. Department Participation & Placement Benchmarks</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Answers: <em>Which engineering disciplines achieve the highest industry placement rates?</em>
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-mono uppercase text-[10px]">
                      <th className="pb-2 font-bold">Department</th>
                      <th className="pb-2 font-bold text-center">Enrolled</th>
                      <th className="pb-2 font-bold text-center">Active</th>
                      <th className="pb-2 font-bold text-center">Completed</th>
                      <th className="pb-2 font-bold text-right">Placement Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {departments.map((dept: any) => (
                      <tr key={dept.department} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 font-bold text-slate-900">{dept.department}</td>
                        <td className="py-2.5 text-center font-mono text-slate-600">{dept.totalStudents}</td>
                        <td className="py-2.5 text-center font-mono text-blue-700 font-semibold">{dept.activeInternships}</td>
                        <td className="py-2.5 text-center font-mono text-emerald-700 font-semibold">{dept.completedInternships}</td>
                        <td className="py-2.5 text-right font-mono font-black text-slate-900">
                          {dept.placementRate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* VISUALIZATION 5: COMPANY PARTICIPATION (Span 5) */}
          <div className="lg:col-span-5">
            <Card className="h-full p-6 border-slate-200 space-y-4">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Building2 size={16} className="text-purple-600" />
                  <span>5. Top Corporate Hiring Partners</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Answers: <em>Which accredited industry partners hire the largest volume of university interns?</em>
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                {companyParticipation.map((comp: any) => (
                  <div key={comp.name} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="space-y-0.5 min-w-0 pr-2">
                      <span className="font-bold text-slate-900 block truncate">{comp.name}</span>
                      <span className="text-[10px] text-slate-500 block truncate">{comp.domain} · {comp.totalListings} Roles</span>
                    </div>
                    <span className="text-xs font-mono font-black text-indigo-700 flex-shrink-0">
                      {comp.activeInterns} Interns
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* ─── VISUALIZATION 6 & 7: SKILL DEMAND AUDIT & COMPLETION RATE ───────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* VISUALIZATION 6: SKILL DEMAND GAP AUDIT (Span 8) */}
          <div className="lg:col-span-8">
            <Card className="h-full p-6 border-slate-200 space-y-4">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-600" />
                  <span>6. Industry Technical Skill Demand vs Student Supply Gap</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Answers: <em>What high-demand technologies are required by corporate recruiters that students lack?</em>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {skillGaps.length > 0 ? (
                  skillGaps.map((gap: any) => (
                    <div key={gap.skill} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-slate-900 uppercase">{gap.skill}</span>
                        <span
                          className={`px-1.5 py-0.2 text-[9px] font-mono font-bold rounded ${
                            gap.gapSeverity === 'HIGH'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {gap.gapSeverity} GAP
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-500">
                          <span>Market Demand</span>
                          <span className="font-mono font-bold text-slate-700">{gap.marketDemand} Index</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500">
                          <span>Student Supply</span>
                          <span className="font-mono font-bold text-slate-700">{gap.studentSupply} Verified</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-6 text-center text-xs text-slate-400">
                    No significant curriculum skill gaps detected.
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* VISUALIZATION 7: INSTITUTIONAL COMPLETION RATE (Span 4) */}
          <div className="lg:col-span-4">
            <Card className="h-full p-6 border-slate-200 space-y-4">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Award size={16} className="text-teal-600" />
                  <span>7. Academic Completion Rate</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Answers: <em>What percentage of enrolled students successfully earn graduation credits?</em>
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-teal-50/70 border border-teal-200 text-center space-y-2">
                <span className="text-3xl font-black font-mono text-teal-950 block">
                  {data?.completionRate ?? 92}%
                </span>
                <span className="text-xs font-bold text-teal-900 block">Graduation Credit Fulfillment</span>
                <p className="text-[11px] text-teal-800 leading-relaxed">
                  Cryptographically signed certificates granted upon multi-stage faculty and admin verification.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
