import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, CheckCircle, AlertTriangle, FileText, Calendar } from 'lucide-react';

const attendanceData = [
  { week: 'W1', avg: 88 }, { week: 'W2', avg: 85 }, { week: 'W3', avg: 87 },
  { week: 'W4', avg: 82 }, { week: 'W5', avg: 84 }, { week: 'W6', avg: 86 },
  { week: 'W7', avg: 83 }, { week: 'W8', avg: 84 },
];

const reportData = [
  { week: 'W1', submitted: 26, approved: 24 }, { week: 'W2', submitted: 28, approved: 25 },
  { week: 'W3', submitted: 27, approved: 26 }, { week: 'W4', submitted: 25, approved: 22 },
  { week: 'W5', submitted: 28, approved: 27 }, { week: 'W6', submitted: 28, approved: 28 },
  { week: 'W7', submitted: 27, approved: 25 }, { week: 'W8', submitted: 22, approved: 18 },
];

const riskDist = [
  { name: 'On Track', value: 18, color: '#10B981' },
  { name: 'Watch', value: 7, color: '#F59E0B' },
  { name: 'At Risk', value: 3, color: '#EF4444' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#FFFDF8] rounded-xl border border-[#0B525B]/20 p-3 text-xs shadow-lg text-[#142326]">
      <p className="font-semibold text-[#142326]/60 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || '#0B525B' }} className="font-mono font-bold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function FacultyAnalyticsPage() {
  return (
    <div className="min-h-full pb-16">
      <Header 
        title="Cohort Batch Analytics" 
        subtitle="Comprehensive telemetry and performance overview of assigned students" 
      />
      
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 text-[#142326]">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#0B525B]/15 shadow-sm">
            <span className="text-xs text-[#142326]/60 font-medium">Batch Placement Rate</span>
            <div className="text-3xl font-bold text-[#0B525B] mt-2">100%</div>
            <span className="text-[11px] text-emerald-700 font-medium font-mono">28 of 28 Placed</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#0B525B]/15 shadow-sm">
            <span className="text-xs text-[#142326]/60 font-medium">Average Attendance</span>
            <div className="text-3xl font-bold text-[#142326] mt-2">84.2%</div>
            <span className="text-[11px] text-emerald-700 font-medium font-mono">+1.8% vs last month</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#0B525B]/15 shadow-sm">
            <span className="text-xs text-[#142326]/60 font-medium">Report Compliance Rate</span>
            <div className="text-3xl font-bold text-[#142326] mt-2">91.4%</div>
            <span className="text-[11px] text-[#0B525B] font-medium font-mono">208 Total Reports</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#0B525B]/15 shadow-sm">
            <span className="text-xs text-[#142326]/60 font-medium">Active Partner Orgs</span>
            <div className="text-3xl font-bold text-[#0B525B] mt-2">12</div>
            <span className="text-[11px] text-[#142326]/50 font-mono">Verified Employers</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Attendance Trend Line Chart */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-[#FFFDF8] border border-[#0B525B]/15 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-[#142326]">Weekly Average Attendance Trend</h3>
                <p className="text-xs text-[#142326]/50 mt-0.5">Aggregated weekly percentage across all 28 students</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#0B525B] bg-[#0B525B]/10 px-2.5 py-1 rounded-md">
                Min Req: 75%
              </span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceData}>
                  <XAxis dataKey="week" stroke="#142326" opacity={0.3} tick={{ fontSize: 11 }} />
                  <YAxis domain={[70, 100]} stroke="#142326" opacity={0.3} tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="avg" 
                    name="Attendance %" 
                    stroke="#0B525B" 
                    strokeWidth={3} 
                    dot={{ fill: '#0B525B', r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Distribution Donut Chart */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-[#FFFDF8] border border-[#0B525B]/15 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-sm text-[#142326]">Cohort Status Distribution</h3>
              <p className="text-xs text-[#142326]/50 mt-0.5">Real-time risk segmentation</p>
            </div>

            <div className="h-52 w-full flex items-center justify-center my-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDist}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#0B525B]/10">
              {riskDist.map(item => (
                <div key={item.name} className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-mono font-bold">{item.value} ({Math.round((item.value / 28) * 100)}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Report Submission Compliance Bar Chart */}
          <div className="lg:col-span-12 p-6 rounded-2xl bg-[#FFFDF8] border border-[#0B525B]/15 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-[#142326]">Weekly Report Submission & Approval Volume</h3>
                <p className="text-xs text-[#142326]/50 mt-0.5">Submitted reports vs faculty signoffs per term week</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-[#0B525B]" />
                  <span>Submitted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  <span>Approved</span>
                </div>
              </div>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData} barGap={4}>
                  <XAxis dataKey="week" stroke="#142326" opacity={0.3} tick={{ fontSize: 11 }} />
                  <YAxis stroke="#142326" opacity={0.3} tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="submitted" name="Submitted" fill="#0B525B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="approved" name="Approved" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
