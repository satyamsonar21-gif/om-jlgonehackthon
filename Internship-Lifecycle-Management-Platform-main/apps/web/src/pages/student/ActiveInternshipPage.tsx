import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { 
  Briefcase, 
  Calendar, 
  Clock, 
  FileText, 
  CheckSquare, 
  Award, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  User, 
  MapPin
} from 'lucide-react';

const stages = [
  { step: 1, label: 'Discover', done: true },
  { step: 2, label: 'Apply', done: true },
  { step: 3, label: 'Select', done: true },
  { step: 4, label: 'Onboard', done: true },
  { step: 5, label: 'Work', current: true },
  { step: 6, label: 'Review', upcoming: true },
  { step: 7, label: 'Certify', upcoming: true },
];

export default function ActiveInternshipPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="My Active Internship"
        subtitle="TechCorp Solutions · Distributed OAuth2 & Cloud Architecture"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Placement Overview Hero */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <StatusBadge status="ACTIVE" size="sm" />
                <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  SPRINT 4 OF 12
                </span>
              </div>

              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Full Stack Web & Distributed Systems Intern
              </h1>

              <p className="text-xs text-slate-600 leading-relaxed">
                Host Organization: <strong>TechCorp Solutions Pvt. Ltd.</strong> · Dept. of Computer Science & Engineering accredited placement.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <Link to="/student/active/logs">
                <Button variant="primary" size="md" leftIcon={<Clock size={15} />}>
                  Log Today's Work
                </Button>
              </Link>
              <Link to="/student/active/reports">
                <Button variant="secondary" size="md">
                  Submit Report
                </Button>
              </Link>
            </div>
          </div>

          {/* 7-Stage Progress Stepper */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 font-semibold">Lifecycle Progression</span>
              <span className="font-bold text-amber-700">Stage 05: Active Work Logs</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
              {stages.map((st) => (
                <div
                  key={st.step}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    st.current
                      ? 'bg-amber-50 border-amber-300 shadow-xs'
                      : st.done
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <span
                    className={`text-[10px] font-mono font-bold block ${
                      st.current ? 'text-amber-800' : st.done ? 'text-emerald-800' : 'text-slate-400'
                    }`}
                  >
                    0{st.step}
                  </span>
                  <span
                    className={`text-xs font-semibold block mt-0.5 ${
                      st.current ? 'text-amber-900 font-bold' : st.done ? 'text-emerald-900' : 'text-slate-500'
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Stipend</span>
              <span className="font-bold font-mono text-slate-900 mt-0.5 block">₹18,000 / month</span>
            </div>
            <div>
              <span className="text-slate-500 block">Location</span>
              <span className="font-bold text-slate-900 mt-0.5 block">Bangalore (Hybrid)</span>
            </div>
            <div>
              <span className="text-slate-500 block">Biometric Attendance</span>
              <span className="font-bold font-mono text-emerald-700 mt-0.5 block">95.0% (23/25 days)</span>
            </div>
            <div>
              <span className="text-slate-500 block">Academic Credits</span>
              <span className="font-bold font-mono text-slate-900 mt-0.5 block">4.0 Credits</span>
            </div>
          </div>
        </Card>

        {/* Quick Module Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/student/active/logs" className="block">
            <Card hover={true} className="p-5 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Clock size={18} />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Work Logs</h3>
              <p className="text-xs text-slate-500">Document daily tasks and hours clocked</p>
            </Card>
          </Link>

          <Link to="/student/active/reports" className="block">
            <Card hover={true} className="p-5 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <FileText size={18} />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Weekly Reports</h3>
              <p className="text-xs text-slate-500">Synthesize weekly sprint milestones</p>
            </Card>
          </Link>

          <Link to="/student/active/attendance" className="block">
            <Card hover={true} className="p-5 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Calendar size={18} />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Attendance</h3>
              <p className="text-xs text-slate-500">View check-in timestamps and calendar</p>
            </Card>
          </Link>

          <Link to="/student/active/tasks" className="block">
            <Card hover={true} className="p-5 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <CheckSquare size={18} />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Sprint Tasks</h3>
              <p className="text-xs text-slate-500">Track assigned technical deliverables</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
