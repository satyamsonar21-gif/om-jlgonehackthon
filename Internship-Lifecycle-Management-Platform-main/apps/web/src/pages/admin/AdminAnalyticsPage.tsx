import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Download, TrendingUp, BarChart2, ShieldCheck } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', applications: 85, selected: 62, completed: 45 },
  { month: 'Feb', applications: 110, selected: 78, completed: 60 },
  { month: 'Mar', applications: 145, selected: 102, completed: 82 },
  { month: 'Apr', applications: 130, selected: 95, completed: 95 },
  { month: 'May', applications: 160, selected: 115, completed: 110 },
  { month: 'Jun', applications: 175, selected: 130, completed: 130 },
  { month: 'Jul', applications: 195, selected: 142, completed: 152 },
];

const attendanceDist = [
  { range: '90-100%', count: 145, color: '#10B981' },
  { range: '80-90%', count: 210, color: '#0284C7' },
  { range: '70-80%', count: 85, color: '#F59E0B' },
  { range: '<70%', count: 32, color: '#BE123C' },
];

const deptData = [
  { dept: 'CSE', internships: 185, placed: 142 },
  { dept: 'IT', internships: 96, placed: 80 },
  { dept: 'ECE', internships: 82, placed: 60 },
  { dept: 'Mech', internships: 65, placed: 45 },
  { dept: 'Civil', internships: 42, placed: 28 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 text-xs shadow-lg text-slate-900">
      <p className="font-semibold text-slate-500 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || p.fill || '#BE123C' }} className="font-mono font-bold">
          {p.name || p.dataKey}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="Institutional Analytics & Growth Telemetry" subtitle="Campus-wide placement conversion and compliance reporting" />
      
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-medium">Placement Rate</span>
            <div className="text-3xl font-extrabold font-mono text-[#BE123C] mt-2">94.8%</div>
            <span className="text-[11px] text-emerald-700 font-mono font-semibold">+3.2% vs last term</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-medium">Active Partner Orgs</span>
            <div className="text-3xl font-extrabold font-mono text-slate-900 mt-2">142</div>
            <span className="text-[11px] text-slate-500 font-mono">12 Added This Month</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-medium">Avg Term Stipend</span>
            <div className="text-3xl font-extrabold font-mono text-slate-900 mt-2">₹16,400</div>
            <span className="text-[11px] text-emerald-700 font-mono font-semibold">+8.5% YoY Growth</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-medium">Audited Certificates</span>
            <div className="text-3xl font-extrabold font-mono text-[#BE123C] mt-2">923</div>
            <span className="text-[11px] text-slate-500 font-mono">100% Chain Validated</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Monthly Trajectory Area Chart */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Application to Placement Trajectory</h3>
                <p className="text-xs text-slate-500">Monthly conversion rate throughout academic year</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#BE123C] bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md">
                2026 Cohort
              </span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <XAxis dataKey="month" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="applications" name="Applications" stroke="#BE123C" fill="#BE123C20" strokeWidth={2} />
                  <Area type="monotone" dataKey="selected" name="Selected" stroke="#0284C7" fill="#0284C720" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendance Segmentation Donut */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Attendance Compliance</h3>
              <p className="text-xs text-slate-500">Student cohort compliance tiering</p>
            </div>

            <div className="h-52 w-full flex items-center justify-center my-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceDist}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {attendanceDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              {attendanceDist.map(item => (
                <div key={item.range} className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700">{item.range}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">{item.count} Students</span>
                </div>
              ))}
            </div>
          </div>

          {/* Department Placement Volume Bar Chart */}
          <div className="lg:col-span-12 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Placement Volume by Academic Department</h3>
                <p className="text-xs text-slate-500">Total eligible students vs verified active placements</p>
              </div>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} barGap={4}>
                  <XAxis dataKey="dept" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="internships" name="Total Eligible" fill="#BE123C" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="placed" name="Placed" fill="#0D9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
