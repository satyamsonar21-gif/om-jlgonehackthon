import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { BarChart, Users, Building2, Award, TrendingUp, ShieldCheck } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const departmentBenchmarks = [
    { dept: 'Computer Science & Engineering', placed: 312, total: 320, pct: 98 },
    { dept: 'Information Technology', placed: 245, total: 260, pct: 94 },
    { dept: 'Electronics & Communication', placed: 180, total: 210, pct: 86 },
    { dept: 'Data Science & AI', placed: 140, total: 145, pct: 97 },
    { dept: 'Mechanical Engineering', placed: 110, total: 150, pct: 73 },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Campus Placement Analytics"
        subtitle="Institutional placement metrics, department comparisons, and compensation benchmarks"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Placement Rate"
            value="92.4%"
            change="+4.2% YoY"
            trend="up"
            sublabel="987 of 1,085 eligible students"
            icon={TrendingUp}
            iconColor="#16A34A"
          />
          <StatCard
            label="Average Monthly Stipend"
            value="₹21,500"
            sublabel="Across 142 Partners"
            icon={Building2}
            iconColor="#0284C7"
          />
          <StatCard
            label="Accredited MoUs"
            value="142 Companies"
            sublabel="100% University Verified"
            icon={ShieldCheck}
            iconColor="#4F46E5"
          />
          <StatCard
            label="Issued Certificates"
            value="923 Issued"
            sublabel="Ed25519 Cryptographic Signatures"
            icon={Award}
            iconColor="#D97706"
          />
        </div>

        {/* Department Benchmarks */}
        <Card>
          <CardHeader>
            <CardTitle>Department Placement Performance Benchmarks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentBenchmarks.map((dept, i) => (
                <div key={i} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-900 font-bold">{dept.dept}</span>
                    <span className="font-mono text-slate-600">
                      {dept.placed} / {dept.total} Students ({dept.pct}%)
                    </span>
                  </div>
                  <Progress
                    value={dept.pct}
                    size="sm"
                    variant={dept.pct >= 90 ? 'success' : dept.pct >= 80 ? 'primary' : 'warning'}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
