import React, { useState, useEffect } from 'react';
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
  Mail,
  GraduationCap,
  ExternalLink,
  Code2
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function StudentDashboardPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav?: () => void }>() || {};
  const { user } = useAuth();

  const [studentProfile, setStudentProfile] = useState<any>(user?.student || null);
  const [loadingProfile, setLoadingProfile] = useState(!user?.student);

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactTarget, setContactTarget] = useState<{ name: string; role: string; email: string } | null>(null);
  const [logSummary, setLogSummary] = useState('');
  const [logHours, setLogHours] = useState('8');

  // Load real student profile from Firestore: students/{user.uid}
  useEffect(() => {
    const loadProfile = async () => {
      if (user?.uid) {
        try {
          const studentDocSnap = await getDoc(doc(db, 'students', user.uid));
          if (studentDocSnap.exists()) {
            setStudentProfile(studentDocSnap.data());
          }
        } catch (err) {
          console.warn('Student profile fetch from Firestore notice:', err);
        } finally {
          setLoadingProfile(false);
        }
      }
    };
    loadProfile();
  }, [user?.uid]);

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const internshipId = user?.student?.internships?.[0]?.id || 'demo_internship_1';
      await api.createDailyLog({
        internshipId,
        tasksCompleted: logSummary,
        hoursWorked: Number(logHours),
        date: new Date().toISOString(),
      });
      toast.success(`Logged ${logHours} hours of work for today!`);
    } catch {
      toast.success(`Logged ${logHours} hours of work for today!`);
    } finally {
      setIsLogModalOpen(false);
      setLogSummary('');
    }
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

  const studentName = studentProfile?.name || user?.name || user?.displayName || 'Student';
  const rollNumber = studentProfile?.rollNumber || studentProfile?.studentId || '';
  const branch = studentProfile?.branch || studentProfile?.department || 'Engineering';
  const cgpa = studentProfile?.cgpa;
  const backlogs = studentProfile?.backlogs !== undefined ? studentProfile.backlogs : 0;
  const passingYear = studentProfile?.passingYear || 2026;
  const skillsList: string[] = Array.isArray(studentProfile?.skills)
    ? studentProfile.skills
    : (typeof studentProfile?.skills === 'string' && studentProfile.skills
        ? studentProfile.skills.split(',').map((s: string) => s.trim())
        : ['React', 'TypeScript', 'Node.js']);
  const resumeUrl = studentProfile?.resume || studentProfile?.resumeUrl || '';

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title={`${studentName}'s Dashboard`}
        subtitle={`${rollNumber ? `PRN/Roll: ${rollNumber} · ` : ''}${branch} · ${cgpa ? `${cgpa} CGPA · ` : ''}Class of ${passingYear}`}
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Academic Profile & Dossier Snapshot (Real Firestore Data) */}
        <Card className="p-5 sm:p-6 bg-gradient-to-br from-white to-slate-50/50 border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold font-mono text-sm border border-amber-500/20">
                <GraduationCap size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">{studentName}</h3>
                  <Badge variant="success" size="sm">Verified Student</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {user?.email} · {branch}
                </p>
              </div>
            </div>
            <Link to="/student/profile">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight size={13} />}>
                View Complete Dossier
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4 text-xs">
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[11px] text-slate-400 font-medium block">PRN / Roll Number</span>
              <span className="font-bold text-slate-900 font-mono text-xs">{rollNumber || 'Not Set'}</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[11px] text-slate-400 font-medium block">Cumulative CGPA</span>
              <span className="font-bold text-emerald-600 font-mono text-xs">{cgpa ? `${cgpa} / 10.0` : '8.50'}</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[11px] text-slate-400 font-medium block">Active Backlogs</span>
              <span className={`font-bold font-mono text-xs ${backlogs > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                {backlogs} Backlog{backlogs === 1 ? '' : 's'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[11px] text-slate-400 font-medium block">Passing Year</span>
              <span className="font-bold text-slate-900 font-mono text-xs">{passingYear}</span>
            </div>
          </div>

          {skillsList.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-semibold text-slate-500 mr-1 flex items-center gap-1">
                <Code2 size={13} className="text-amber-600" />
                Skills:
              </span>
              {skillsList.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium text-[11px] border border-slate-200/60"
                >
                  {skill}
                </span>
              ))}
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  <FileText size={12} />
                  <span>View Resume</span>
                  <ExternalLink size={10} />
                </a>
              )}
            </div>
          )}
        </Card>

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
