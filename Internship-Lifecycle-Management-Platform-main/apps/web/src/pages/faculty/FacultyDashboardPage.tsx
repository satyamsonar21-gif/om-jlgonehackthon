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
  Mail, 
  ShieldAlert, 
  Check, 
  Clock, 
} from 'lucide-react';
import { demoStudents, demoReports, Student, WeeklyReportItem } from '@/data/demo';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export default function FacultyDashboardPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};
  const { user } = useAuth();

  const facultyName = user?.name || user?.displayName || 'Faculty Guide';
  const facultyDept = user?.department || user?.faculty?.department || 'Computer Science & Engineering';
  const collegeName = user?.collegeName || user?.faculty?.collegeName || 'G.H. Raisoni College of Engineering';

  const totalStudents = demoStudents.length;
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
        subtitle={`${facultyName} · Dept. of ${facultyDept} (${collegeName})`}
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
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{student.name}</span>
                          <span className="text-[11px] font-mono text-slate-500">({student.roll})</span>
                          <StatusBadge status={student.status} size="sm" />
                        </div>
                        <div className="text-[11px] text-slate-600 flex items-center gap-2">
                          <span>{student.company}</span>
                          <span>•</span>
                          <span className="font-mono font-medium text-rose-600">
                            {student.attendance}% Attendance
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs h-7 px-2"
                          onClick={() => setWarningTarget(student)}
                          leftIcon={<ShieldAlert size={12} />}
                        >
                          Warning
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-xs h-7 px-2"
                          onClick={() => setContactTarget(student)}
                          leftIcon={<Mail size={12} />}
                        >
                          Mentor
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Weekly Reports Review (Span 6) */}
          <div className="lg:col-span-6 space-y-4">
            <Card>
              <CardHeader>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle>Pending Weekly Synthesis Reports</CardTitle>
                    <Badge variant="warning" size="sm">
                      4 Pending
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Student milestone submissions awaiting guide evaluation and grade assignment
                  </p>
                </div>
                <Link to="/faculty/reports">
                  <Button variant="outline" size="sm">
                    View All Queue
                  </Button>
                </Link>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {demoReports.slice(0, 3).map((report) => (
                    <div
                      key={report.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{report.studentName}</span>
                          <Badge variant="info" size="sm">
                            Week {report.weekNumber}
                          </Badge>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{report.submissionDate}</span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                        "{report.summary}"
                      </p>

                      <div className="flex items-between justify-between pt-1">
                        <span className="text-[11px] font-mono text-slate-500">{report.companyName}</span>
                        <Button
                          variant="primary"
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-xs h-7 px-2"
                          onClick={() => setEvaluatingReport(report)}
                          leftIcon={<Check size={12} />}
                        >
                          Evaluate
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

      {/* Evaluate Report Modal */}
      <Modal
        isOpen={Boolean(evaluatingReport)}
        onClose={() => setEvaluatingReport(null)}
        title={`Academic Evaluation: Week ${evaluatingReport?.weekNumber}`}
      >
        <form onSubmit={handleApproveReport} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700">Student & Assignment</label>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mt-1">
              <div className="font-bold text-slate-900">{evaluatingReport?.studentName}</div>
              <div className="text-slate-500 font-mono mt-0.5">{evaluatingReport?.companyName}</div>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700">Student Weekly Synthesis</label>
            <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 mt-1 italic leading-relaxed">
              {evaluatingReport?.summary}
            </p>
          </div>

          <Input
            label="Evaluation Grade (Out of 5.0)"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={evaluationGrade}
            onChange={(e) => setEvaluationGrade(e.target.value)}
            required
          />

          <Textarea
            label="Academic Feedback & Recommendations"
            placeholder="Provide guidance on technical depth, documentation clarity, or sprint progress..."
            value={evaluationFeedback}
            onChange={(e) => setEvaluationFeedback(e.target.value)}
            rows={3}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setEvaluatingReport(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              Sign Off & Submit Grade
            </Button>
          </div>
        </form>
      </Modal>

      {/* Warning Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(warningTarget)}
        onClose={() => setWarningTarget(null)}
        onConfirm={handleSendWarning}
        title="Issue Official Academic Compliance Warning"
        description={`Are you sure you want to issue a formal compliance notice to ${warningTarget?.name} (${warningTarget?.roll})? This will be recorded on their permanent internship audit log.`}
        confirmText="Issue Warning"
        variant="danger"
      />

      {/* Contact Mentor Modal */}
      <Modal
        isOpen={Boolean(contactTarget)}
        onClose={() => setContactTarget(null)}
        title={`Contact Industry Mentor: ${contactTarget?.mentor}`}
      >
        <form onSubmit={handleContactMentor} className="space-y-4 text-xs">
          <Input
            label="Subject"
            defaultValue={`Academic Ingestion Notice: ${contactTarget?.name} (${contactTarget?.roll})`}
            disabled
          />
          <Textarea
            label="Formal Message to Supervisor"
            placeholder="Detail any academic discrepancies, log submission delays, or milestone clarifications..."
            rows={4}
            required
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setContactTarget(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              Send Dispatch
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
