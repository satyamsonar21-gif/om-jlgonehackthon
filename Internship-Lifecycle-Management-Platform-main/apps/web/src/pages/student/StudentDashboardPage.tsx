import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { PriorityBanner } from '@/components/common/PriorityBanner';
import { StatCard, Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { 
  Briefcase, 
  Calendar, 
  FileText, 
  CheckSquare, 
  Clock, 
  Sparkles, 
  Building2, 
  User, 
  Award,
  ArrowRight,
  Send,
  Plus,
  CheckCircle2,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';

export default function StudentDashboardPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactTarget, setContactTarget] = useState<{ name: string; role: string; email: string } | null>(null);
  const [logSummary, setLogSummary] = useState('');
  const [logHours, setLogHours] = useState('8');

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Logged ${logHours} hours of work for today!`);
    setIsLogModalOpen(false);
    setLogSummary('');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Message dispatched to ${contactTarget?.name}`);
    setIsContactModalOpen(false);
  };

  const tasks = [
    { id: 't1', title: 'Implement OAuth2 PKCE challenge validation in Go backend', done: true, due: 'Done today' },
    { id: 't2', title: 'Author Jest unit tests for token expiration refresh flow', done: true, due: 'Done yesterday' },
    { id: 't3', title: 'Benchmark PostgreSQL query throughput with 50k concurrent sessions', done: false, due: 'Due Friday' },
    { id: 't4', title: 'Author Week 5 Synthesis Report and link merged pull requests', done: false, due: 'Due Tomorrow' },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Student Dashboard"
        subtitle="Priya Sharma · TechCorp Solutions · Software Engineering Intern"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* 1. Next Action / Priority Banner ("What Should I Do Next?") */}
        <PriorityBanner
          badgeText="NEXT ACTION REQUIRED"
          title="Week 5 Technical Synthesis Report is Due Tomorrow"
          description="Synthesize your Sprint 4 deliverables, documented pull requests, and Redis session benchmarks for Faculty Guide Dr. Rajesh Kumar."
          deadline="Due Tomorrow at 11:59 PM"
          actionText="Continue Report"
          actionHref="/student/active/reports"
          actionIcon={<FileText size={15} />}
          secondaryText="Log Today's Work"
          onSecondaryClick={() => setIsLogModalOpen(true)}
        />

        {/* 2. Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            label="Active Placement"
            value="Week 4 of 12"
            sublabel="TechCorp Solutions"
            icon={Briefcase}
            iconColor="#D97706"
          />
          <StatCard
            label="Attendance Rate"
            value="95.0%"
            change="+2.5% this week"
            trend="up"
            sublabel="23 of 25 days clocked"
            icon={Calendar}
            iconColor="#16A34A"
          />
          <StatCard
            label="Sprint Deliverables"
            value="8 / 10 Done"
            sublabel="2 Pull Requests Under Review"
            icon={CheckSquare}
            iconColor="#2563EB"
          />
          <StatCard
            label="Synthesis Reports"
            value="4 Approved"
            sublabel="1 Pending Submission"
            icon={FileText}
            iconColor="#D97706"
          />
        </div>

        {/* 3. Main Split Content (Active Internship & Sprint Tasks) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Internship Snapshot & Tasks (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Placement Card */}
            <Card>
              <CardHeader>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle>Distributed OAuth2 & Cloud Architecture</CardTitle>
                    <StatusBadge status="ACTIVE" size="sm" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    TechCorp Solutions Pvt. Ltd. · Bangalore (Hybrid)
                  </p>
                </div>
                <Link to="/student/active">
                  <Button variant="outline" size="sm">
                    View Internship
                  </Button>
                </Link>
              </CardHeader>

              <CardContent>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You are currently 4 weeks into your 12-week industrial placement. Focus areas include microservice authentication, Redis session stores, and PostgreSQL query tuning.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Stipend</span>
                    <span className="font-bold text-slate-900 font-mono">₹18,000 / month</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Term Duration</span>
                    <span className="font-bold text-slate-900 font-mono">Jun 2026 – Sep 2026</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Hours Completed</span>
                    <span className="font-bold text-slate-900 font-mono">160 Hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sprint Deliverables & Tasks */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Sprint 4 Tasks & Deliverables</CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">Tasks assigned by Industry Mentor Siddharth Nambiar</p>
                </div>
                <Link to="/student/active/tasks">
                  <Button variant="ghost" size="sm">
                    All Tasks
                  </Button>
                </Link>
              </CardHeader>

              <CardContent>
                <div className="space-y-2.5">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CheckCircle2
                          size={16}
                          className={task.done ? 'text-emerald-600 flex-shrink-0' : 'text-slate-300 flex-shrink-0'}
                        />
                        <span className={`truncate ${task.done ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                          {task.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-medium text-slate-400 flex-shrink-0">
                        {task.due}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Area: Assigned Supervisors & Quick Actions */}
          <div className="space-y-6">
            {/* Supervisors Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Assigned Mentors</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-3 text-xs">
                  {/* Company Mentor */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        Industry Supervisor
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Siddharth Nambiar</div>
                      <div className="text-[11px] text-slate-500">Lead Architect · TechCorp Solutions</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      leftIcon={<Mail size={13} />}
                      onClick={() => {
                        setContactTarget({
                          name: 'Siddharth Nambiar',
                          role: 'Industry Supervisor',
                          email: 'siddharth@techcorp.com',
                        });
                        setIsContactModalOpen(true);
                      }}
                    >
                      Message Supervisor
                    </Button>
                  </div>

                  {/* Faculty Advisor */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Faculty Advisor
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Dr. Rajesh Kumar</div>
                      <div className="text-[11px] text-slate-500">Dept. of Computer Science & Engineering</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      leftIcon={<Mail size={13} />}
                      onClick={() => {
                        setContactTarget({
                          name: 'Dr. Rajesh Kumar',
                          role: 'Faculty Advisor',
                          email: 'rajesh.kumar@university.edu',
                        });
                        setIsContactModalOpen(true);
                      }}
                    >
                      Message Faculty Guide
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Trigger Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Triggers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  <Link
                    to="/student/active/attendance"
                    className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-between transition-colors block"
                  >
                    <div className="flex items-center gap-2.5">
                      <Calendar size={15} className="text-emerald-600" />
                      <span className="font-medium text-slate-800">Biometric Attendance</span>
                    </div>
                    <ArrowRight size={13} className="text-slate-400" />
                  </Link>

                  <Link
                    to="/student/active/logs"
                    className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-between transition-colors block"
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock size={15} className="text-amber-600" />
                      <span className="font-medium text-slate-800">Daily Work Log History</span>
                    </div>
                    <ArrowRight size={13} className="text-slate-400" />
                  </Link>

                  <Link
                    to="/student/certificates"
                    className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-between transition-colors block"
                  >
                    <div className="flex items-center gap-2.5">
                      <Award size={15} className="text-blue-600" />
                      <span className="font-medium text-slate-800">Completion Certificate</span>
                    </div>
                    <ArrowRight size={13} className="text-slate-400" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Log Work Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log Today's Work Deliverables"
        size="md"
      >
        <form onSubmit={handleLogSubmit} className="space-y-4 text-xs">
          <Input
            label="Hours Clocked Today"
            type="number"
            min="1"
            max="12"
            value={logHours}
            onChange={(e) => setLogHours(e.target.value)}
            required
          />

          <Textarea
            label="Deliverables & Technical Summary"
            rows={4}
            value={logSummary}
            onChange={(e) => setLogSummary(e.target.value)}
            placeholder="Describe the tasks completed, pull requests authored, and algorithms benchmarked today..."
            required
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsLogModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" leftIcon={<Clock size={13} />}>
              Save Log
            </Button>
          </div>
        </form>
      </Modal>

      {/* Contact Mentor Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title={`Contact ${contactTarget?.name}`}
        size="md"
      >
        <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 space-y-0.5">
            <div className="font-bold">{contactTarget?.name}</div>
            <div className="text-[11px] text-slate-500 font-mono">{contactTarget?.role} · {contactTarget?.email}</div>
          </div>

          <Input label="Subject / Topic" placeholder="e.g. Midterm synthesis report query" required />

          <Textarea label="Message" rows={4} placeholder="Type your academic or technical inquiry..." required />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsContactModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" leftIcon={<Send size={13} />}>
              Send Message
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
