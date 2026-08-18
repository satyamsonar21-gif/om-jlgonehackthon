import React, { useState } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Textarea, Input } from '@/components/ui/Input';
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  Clock, 
  FileText, 
  User, 
  Mail, 
  AlertTriangle, 
  CheckCircle2, 
  Award,
  Send
} from 'lucide-react';
import { demoStudents, demoReports } from '@/data/demo';
import { toast } from 'sonner';

export default function FacultyStudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const student = demoStudents.find((s) => s.id === id) || demoStudents[0];
  const reports = demoReports.filter((r) => r.studentId === student.id || r.studentRoll === student.roll);

  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleIssueWarning = () => {
    toast.success(`Formal academic notice issued to ${student.name} (${student.roll})`);
    setIsWarningOpen(false);
  };

  const handleContactMentor = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Dispatched formal inquiry to ${student.mentor} (${student.mentorEmail})`);
    setIsContactOpen(false);
  };

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title={`${student.name} (${student.roll})`}
        subtitle={`${student.role} · ${student.company}`}
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <div>
          <Link
            to="/faculty/students"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Supervised Cohort</span>
          </Link>
        </div>

        {/* Student Dossier Overview Hero */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-xs">
                {student.name.substring(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                    {student.name}
                  </h1>
                  <Badge
                    variant={student.status === 'at_risk' ? 'danger' : student.status === 'watch' ? 'warning' : 'success'}
                    size="sm"
                  >
                    {student.status === 'at_risk' ? 'At Risk' : student.status === 'watch' ? 'Watchlist' : 'On Track'}
                  </Badge>
                </div>

                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Roll: {student.roll} · {student.dept} · CGPA: {student.cgpa}
                </p>
                <p className="text-xs font-semibold text-emerald-700 mt-1">
                  {student.role} at {student.company}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="secondary" size="sm" onClick={() => setIsContactOpen(true)}>
                Contact Mentor
              </Button>
              {student.status === 'at_risk' && (
                <Button variant="danger" size="sm" onClick={() => setIsWarningOpen(true)}>
                  Issue Warning
                </Button>
              )}
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Attendance Rate</span>
              <span
                className={`font-bold font-mono text-sm block mt-0.5 ${
                  student.attendance < 75 ? 'text-rose-600' : 'text-slate-900'
                }`}
              >
                {student.attendance}%
              </span>
            </div>

            <div>
              <span className="text-slate-500 block">Readiness Score</span>
              <span className="font-bold font-mono text-sm text-slate-900 block mt-0.5">
                {student.score} / 100
              </span>
            </div>

            <div>
              <span className="text-slate-500 block">Industry Supervisor</span>
              <span className="font-bold text-slate-900 block mt-0.5 truncate">
                {student.mentor}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block">Missing Logs</span>
              <span
                className={`font-bold font-mono text-sm block mt-0.5 ${
                  student.missingLogs > 0 ? 'text-rose-600' : 'text-emerald-700'
                }`}
              >
                {student.missingLogs} Days
              </span>
            </div>
          </div>
        </Card>

        {/* Weekly Submissions History */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Academic Synthesis Submissions</CardTitle>
          </CardHeader>

          <CardContent>
            {reports.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No synthesis reports filed by this student yet.
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        Week {r.weekNumber}: {r.title}
                      </span>
                      <StatusBadge status={r.status} size="sm" />
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium">"{r.summary}"</p>
                    {r.grade && (
                      <div className="text-[11px] font-mono text-emerald-700 font-bold">
                        Academic Grade: {r.grade}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Warning Dialog */}
      <ConfirmDialog
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
        onConfirm={handleIssueWarning}
        title={`Dispatch Academic Warning to ${student.name}?`}
        description={`This will send an official compliance warning notice regarding ${student.attendance}% attendance and ${student.missingLogs} missing work logs.`}
        confirmText="Dispatch Warning"
        variant="danger"
      />

      {/* Contact Mentor Modal */}
      <Modal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        title={`Contact Industry Mentor (${student.mentor})`}
        size="md"
      >
        <form onSubmit={handleContactMentor} className="space-y-4 text-xs">
          <Input
            label="Subject"
            value={contactSubject || `Regarding ${student.name}'s (${student.roll}) progress at ${student.company}`}
            onChange={(e) => setContactSubject(e.target.value)}
            required
          />

          <Textarea
            label="Message"
            rows={4}
            value={contactMessage || `Dear ${student.mentor},\n\nI am writing to check in on ${student.name}'s deliverables and attendance for this week. Please let us know if any academic interventions or adjustments are needed.\n\nBest regards,\nDr. Rajesh Kumar`}
            onChange={(e) => setContactMessage(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsContactOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" leftIcon={<Send size={13} />}>
              Send Inquiry
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
