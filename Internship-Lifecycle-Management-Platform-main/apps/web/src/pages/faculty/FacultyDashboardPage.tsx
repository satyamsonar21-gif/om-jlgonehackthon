import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { PriorityBanner } from '@/components/common/PriorityBanner';
import { StatCard, Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Textarea, Input } from '@/components/ui/Input';
import { 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Mail, 
  ShieldAlert, 
  Check, 
  Building2, 
  Clock, 
  Eye
} from 'lucide-react';
import { demoStudents, demoReports, Student, WeeklyReportItem } from '@/data/demo';
import { toast } from 'sonner';

export default function FacultyDashboardPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const totalStudents = demoStudents.length; // 8 in demo slice
  const onTrackCount = demoStudents.filter((s) => s.status === 'on_track').length;
  const watchCount = demoStudents.filter((s) => s.status === 'watch').length;
  const atRiskCount = demoStudents.filter((s) => s.status === 'at_risk').length;

  const urgentStudents = demoStudents.filter((s) => s.status === 'at_risk' || s.status === 'watch');

  // Modal states
  const [evaluatingReport, setEvaluatingReport] = useState<WeeklyReportItem | null>(null);
  const [evaluationGrade, setEvaluationGrade] = useState('5.0');
  const [evaluationFeedback, setEvaluationFeedback] = useState('');
  const [warningTarget, setWarningTarget] = useState<Student | null>(null);
  const [contactTarget, setContactTarget] = useState<Student | null>(null);

  const handleApproveReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatingReport) return;
    toast.success(`Approved report for ${evaluatingReport.studentName} with Grade ${evaluationGrade}/5.0`);
    setEvaluatingReport(null);
    setEvaluationFeedback('');
  };

  const handleSendWarning = () => {
    if (!warningTarget) return;
    toast.success(`Official academic warning notice sent to ${warningTarget.name} (${warningTarget.roll})`);
    setWarningTarget(null);
  };

  const handleContactMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactTarget) return;
    toast.success(`Dispatched formal inquiry to Industry Supervisor ${contactTarget.mentor} at ${contactTarget.company}`);
    setContactTarget(null);
  };

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Faculty Guide Dashboard"
        subtitle="Dr. Rajesh Kumar · Department of Computer Science & Engineering"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* 1. Next Action / Priority Banner */}
        <PriorityBanner
          type="urgent"
          badgeText="ACADEMIC ATTENTION REQUIRED"
          title="3 Supervised Students Flagged For Attendance & Overdue Submissions"
          description="Vikram Singh (64% attendance) and Deepak Nair (missing logs) have fallen below the mandatory 75% institutional compliance threshold."
          actionText="Review At-Risk Students"
          actionHref="/faculty/students"
          actionIcon={<AlertTriangle size={15} />}
          secondaryText="Review Submissions Queue (4)"
          secondaryHref="/faculty/reports"
        />

        {/* 2. Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            label="Supervised Cohort"
            value="42 Enrolled"
            sublabel="100% Assigned to Faculty"
            icon={Users}
            iconColor="#059669"
          />
          <StatCard
            label="On Track"
            value="32 Students"
            sublabel="Attendance > 85%"
            icon={CheckCircle2}
            iconColor="#16A34A"
          />
          <StatCard
            label="Watchlist"
            value="7 Students"
            sublabel="Attendance 75% - 85%"
            icon={Clock}
            iconColor="#D97706"
          />
          <StatCard
            label="At Risk"
            value="3 Students"
            sublabel="Immediate Intervention"
            icon={AlertTriangle}
            iconColor="#DC2626"
          />
        </div>

        {/* 3. Main Split Grid: Needs Attention vs Review Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Urgent Interventions Section (Span 6) */}
          <div className="lg:col-span-6 space-y-4">
            <Card>
              <CardHeader>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle>Students Needing Immediate Attention</CardTitle>
                    <Badge variant="danger" size="sm">
                      {urgentStudents.length} Flagged
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Compliance exceptions triggered by institutional attendance and log rules
                  </p>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {urgentStudents.map((student) => (
                    <div
                      key={student.id}
                      className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2.5 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-slate-900">
                            {student.name}{' '}
                            <span className="font-mono text-slate-500 font-normal">
                              ({student.roll})
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {student.company} · Mentor: {student.mentor}
                          </div>
                        </div>

                        <Badge variant="danger" size="sm">
                          {student.attendance}% Attendance
                        </Badge>
                      </div>

                      {student.flagReason && (
                        <p className="text-[11px] text-rose-800 leading-relaxed font-medium bg-white/80 p-2 rounded-lg border border-rose-100">
                          {student.flagReason}
                        </p>
                      )}

                      <div className="pt-2 flex items-center gap-2 border-t border-rose-100">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setWarningTarget(student)}
                        >
                          Issue Warning Notice
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setContactTarget(student)}
                        >
                          Contact Mentor
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Synthesis Review Queue (Span 6) */}
          <div className="lg:col-span-6 space-y-4">
            <Card>
              <CardHeader>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle>Synthesis Review Queue</CardTitle>
                    <Badge variant="warning" size="sm">
                      {demoReports.length} Pending
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Student submissions awaiting academic evaluation and grading
                  </p>
                </div>
                <Link to="/faculty/reports">
                  <Button variant="ghost" size="sm">
                    All Reports
                  </Button>
                </Link>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {demoReports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">
                            {report.studentName}{' '}
                            <span className="font-mono text-slate-400 font-normal">
                              ({report.studentRoll})
                            </span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {report.submissionDate}
                          </span>
                        </div>

                        <h4 className="font-semibold text-emerald-800 mt-1 text-xs">
                          Week {report.weekNumber}: {report.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {report.summary}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-500">
                          {report.companyName} · {report.hoursLogged}h Logged
                        </span>
                        <Button
                          variant="primary"
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => {
                            setEvaluatingReport(report);
                            setEvaluationFeedback(report.facultyFeedback || '');
                          }}
                        >
                          Evaluate Submission
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Academic Synthesis Evaluation Modal */}
      <Modal
        isOpen={!!evaluatingReport}
        onClose={() => setEvaluatingReport(null)}
        title="Academic Synthesis Evaluation"
        size="md"
      >
        {evaluatingReport && (
          <form onSubmit={handleApproveReport} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">
                {evaluatingReport.studentName} ({evaluatingReport.studentRoll})
              </div>
              <div className="text-[11px] text-slate-600">
                Host Organization: {evaluatingReport.companyName} · Week {evaluatingReport.weekNumber}
              </div>
              <div className="text-[11px] font-semibold text-slate-800 mt-1">
                {evaluatingReport.title}
              </div>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                "{evaluatingReport.summary}"
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Academic Score (Out of 5.0)</label>
              <Input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={evaluationGrade}
                onChange={(e) => setEvaluationGrade(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Faculty Guide Feedback & Remarks</label>
              <Textarea
                rows={3}
                value={evaluationFeedback}
                onChange={(e) => setEvaluationFeedback(e.target.value)}
                placeholder="Enter feedback on student methodology, test coverage, and documentation..."
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  toast.warning(`Requested revision from ${evaluatingReport.studentName}`);
                  setEvaluatingReport(null);
                }}
              >
                Request Revision
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700" leftIcon={<Check size={14} />}>
                Approve & Sign Off
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Warning Notice Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!warningTarget}
        onClose={() => setWarningTarget(null)}
        onConfirm={handleSendWarning}
        title={`Issue Formal Warning to ${warningTarget?.name}?`}
        description={`This will dispatch an official university warning notice to ${warningTarget?.name} (${warningTarget?.roll}) regarding their attendance below institutional requirements.`}
        confirmText="Dispatch Warning Notice"
        variant="danger"
      />

      {/* Contact Mentor Modal */}
      <Modal
        isOpen={!!contactTarget}
        onClose={() => setContactTarget(null)}
        title={`Contact Supervisor: ${contactTarget?.mentor}`}
        size="md"
      >
        {contactTarget && (
          <form onSubmit={handleContactMentor} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900">{contactTarget.mentor}</div>
              <div className="text-[11px] text-slate-500">
                Industry Supervisor at {contactTarget.company} ({contactTarget.mentorEmail})
              </div>
              <div className="text-[11px] text-slate-700 mt-1">
                Student in focus: <strong>{contactTarget.name}</strong> ({contactTarget.roll})
              </div>
            </div>

            <Input
              label="Subject"
              defaultValue={`Inquiry regarding ${contactTarget.name}'s internship attendance & deliverables`}
              required
            />

            <Textarea
              label="Message"
              rows={4}
              defaultValue={`Dear ${contactTarget.mentor},\n\nI am writing to check in on ${contactTarget.name}'s current progress and attendance on your team. Please let us know if any academic interventions are needed.\n\nBest regards,\nDr. Rajesh Kumar`}
              required
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="secondary" size="sm" onClick={() => setContactTarget(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" leftIcon={<Mail size={13} />}>
                Send Inquiry
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
