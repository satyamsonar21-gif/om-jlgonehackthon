import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { BarChart, Users, CheckCircle2, AlertTriangle, TrendingUp, Award, Building2 } from 'lucide-react';
import { demoStudents } from '@/data/demo';

export default function FacultyAnalyticsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const total = demoStudents.length;
  const onTrack = demoStudents.filter((s) => s.status === 'on_track').length;
  const watch = demoStudents.filter((s) => s.status === 'watch').length;
  const atRisk = demoStudents.filter((s) => s.status === 'at_risk').length;

  const domainDistribution = [
    { domain: 'Software & Cloud Engineering', count: 18, pct: 43 },
    { domain: 'Data Science & Generative AI', count: 12, pct: 28 },
    { domain: 'DevOps & Cyber Security', count: 7, pct: 17 },
    { domain: 'UI/UX Product Design', count: 5, pct: 12 },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Cohort Analytics"
        subtitle="Departmental compliance distributions, attendance benchmarks, and domain trends"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Supervised Students"
            value="42 Enrolled"
            sublabel="Dept. of CSE"
            icon={Users}
            iconColor="#059669"
          />
          <StatCard
            label="Average Attendance"
            value="89.4%"
            change="+1.8% vs last month"
            trend="up"
            sublabel="Above 75% requirement"
            icon={CheckCircle2}
            iconColor="#16A34A"
          />
          <StatCard
            label="Average Synthesis Grade"
            value="4.7 / 5.0"
            sublabel="42 Submissions Graded"
            icon={Award}
            iconColor="#D97706"
          />
          <StatCard
            label="Partner Organizations"
            value="12 Companies"
            sublabel="100% MoU Accredited"
            icon={Building2}
            iconColor="#4F46E5"
          />
        </div>

        {/* Analytics Distribution Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compliance & Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Cohort Compliance Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-emerald-700 font-semibold">On Track (Attendance &gt; 85%)</span>
                    <span className="font-mono font-bold text-slate-800">32 Students (76%)</span>
                  </div>
                  <Progress value={76} size="sm" variant="success" />
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-amber-700 font-semibold">Watchlist (Attendance 75% - 85%)</span>
                    <span className="font-mono font-bold text-slate-800">7 Students (17%)</span>
                  </div>
                  <Progress value={17} size="sm" variant="warning" />
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-rose-700 font-semibold">Urgent Interventions (Attendance below 75%)</span>
                    <span className="font-mono font-bold text-slate-800">3 Students (7%)</span>
                  </div>
                  <Progress value={7} size="sm" variant="danger" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Domain Specialization Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Industry Specialization Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3.5">
                {domainDistribution.map((item, i) => (
                  <div key={i} className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-800 font-semibold">{item.domain}</span>
                      <span className="font-mono text-slate-600">{item.count} Interns ({item.pct}%)</span>
                    </div>
                    <Progress value={item.pct} size="sm" variant="primary" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
