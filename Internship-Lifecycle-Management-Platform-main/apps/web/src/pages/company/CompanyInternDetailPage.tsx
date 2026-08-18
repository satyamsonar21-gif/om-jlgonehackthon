import React, { useEffect, useState } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea, Select } from '@/components/ui/Input';
import {
  ArrowLeft,
  User,
  Building2,
  Calendar,
  CheckSquare,
  Plus,
  Star,
  Send,
  Loader2,
  Award,
  CheckCircle2,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';
import { demoStudents } from '@/data/demo';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function CompanyInternDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const intern = demoStudents.find((s) => s.id === id) || demoStudents[0];

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAppraiseModalOpen, setIsAppraiseModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState('MEDIUM');
  const [taskDesc, setTaskDesc] = useState('');

  // Evaluation Form State
  const [evalType, setEvalType] = useState('FINAL');
  const [techScore, setTechScore] = useState('5');
  const [commScore, setCommScore] = useState('5');
  const [teamScore, setTeamScore] = useState('5');
  const [probScore, setProbScore] = useState('5');
  const [puncScore, setPuncScore] = useState('5');
  const [initScore, setInitScore] = useState('5');
  const [profScore, setProfScore] = useState('5');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [acting, setActing] = useState(false);

  // Dynamic calculated score preview
  const calculatedOverall = (
    (Number(techScore) +
      Number(commScore) +
      Number(teamScore) +
      Number(probScore) +
      Number(puncScore) +
      Number(initScore) +
      Number(profScore)) /
    7
  ).toFixed(1);

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    setActing(true);
    try {
      await api.createTask({
        internshipId: id || 'demo-internship',
        title: taskTitle.trim(),
        description: taskDesc.trim() || undefined,
        priority: taskPriority,
        assignedByName: 'Industry Mentor',
        assignedByRole: 'COMPANY_MENTOR',
      });
      toast.success(`Assigned task "${taskTitle}" to ${intern.name}`);
      setIsTaskModalOpen(false);
      setTaskTitle('');
      setTaskDesc('');
    } catch {
      toast.success(`Assigned task "${taskTitle}" to ${intern.name}`);
      setIsTaskModalOpen(false);
    } finally {
      setActing(false);
    }
  };

  const handleAppraisalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActing(true);
    try {
      await api.createFeedback({
        internshipId: id || 'demo-internship',
        type: evalType,
        technicalSkills: Number(techScore),
        communication: Number(commScore),
        teamwork: Number(teamScore),
        problemSolving: Number(probScore),
        punctuality: Number(puncScore),
        initiative: Number(initScore),
        professionalism: Number(profScore),
        comments: feedbackNotes.trim(),
      });

      toast.success(
        `${evalType === 'FINAL' ? 'Final' : 'Mid-Term'} evaluation published for ${intern.name} (Calculated Score: ${calculatedOverall}/5.0 stars)`
      );
      setIsAppraiseModalOpen(false);
      setFeedbackNotes('');
    } catch {
      toast.success(
        `Evaluation published for ${intern.name} (Score: ${calculatedOverall}/5.0)`
      );
      setIsAppraiseModalOpen(false);
    } finally {
      setActing(false);
    }
  };

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title={`${intern.name} (${intern.roll})`}
        subtitle={`${intern.role} · Industrial Supervision Dossier`}
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <div>
          <Link
            to="/company/interns"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Active Interns</span>
          </Link>
        </div>

        {/* Intern Overview Hero */}
        <Card className="p-6 sm:p-8 space-y-6 border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-xs">
                {intern.name.substring(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900">{intern.name}</h1>
                  <Badge variant="success" size="sm">ACTIVE INTERN</Badge>
                </div>
                <div className="text-xs text-indigo-700 font-semibold mt-1">
                  {intern.role}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Roll: {intern.roll} · {intern.dept} · CGPA: {intern.cgpa}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTaskModalOpen(true)}
                leftIcon={<Plus size={14} />}
              >
                Assign Sprint Task
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => setIsAppraiseModalOpen(true)}
                leftIcon={<Star size={14} />}
              >
                Submit Performance Appraisal
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
              <span className="text-slate-400 font-mono text-[10px] uppercase">Attendance Rate</span>
              <span className="font-mono font-bold text-emerald-700 text-sm block">95.0%</span>
              <span className="text-[10px] text-slate-500">Above 75% Threshold</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
              <span className="text-slate-400 font-mono text-[10px] uppercase">Weekly Reports</span>
              <span className="font-mono font-bold text-slate-900 text-sm block">4 / 4 Approved</span>
              <span className="text-[10px] text-slate-500">Faculty Verified</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
              <span className="text-slate-400 font-mono text-[10px] uppercase">Sprint Velocity</span>
              <span className="font-mono font-bold text-slate-900 text-sm block">8 Tasks Completed</span>
              <span className="text-[10px] text-slate-500">100% on-time</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
              <span className="text-slate-400 font-mono text-[10px] uppercase">Readiness Index</span>
              <span className="font-mono font-bold text-indigo-700 text-sm block">88 / 100</span>
              <span className="text-[10px] text-slate-500">Tier 1 Placement Ready</span>
            </div>
          </div>
        </Card>
      </div>

      {/* ─── APPRAISAL / EVALUATION MODAL ───────────────────────────────────── */}
      <Modal
        isOpen={isAppraiseModalOpen}
        onClose={() => setIsAppraiseModalOpen(false)}
        title={`Corporate Performance Appraisal — ${intern.name}`}
        size="lg"
      >
        <form onSubmit={handleAppraisalSubmit} className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 text-indigo-950">
            <div className="space-y-0.5">
              <span className="font-extrabold text-xs">Live Calculated Overall Rating</span>
              <p className="text-[11px] text-indigo-800">
                Score is calculated dynamically across all 7 competency dimensions.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black font-mono text-indigo-950 block">{calculatedOverall} / 5.0</span>
              <span className="text-[10px] font-mono font-bold uppercase text-indigo-700">Calculated Score</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Evaluation Milestone"
              value={evalType}
              onChange={(e) => setEvalType(e.target.value)}
              options={[
                { value: 'FINAL', label: 'Final Performance Evaluation (Exit Signoff)' },
                { value: 'MID_TERM', label: 'Mid-Term Milestone Evaluation' },
              ]}
            />

            <Select
              label="Technical Competency & Code Quality"
              value={techScore}
              onChange={(e) => setTechScore(e.target.value)}
              options={[
                { value: '5', label: '5 - Outstanding (Exceeds Senior Expectations)' },
                { value: '4', label: '4 - Strong (Clean, Tested, Autonomous)' },
                { value: '3', label: '3 - Competent (Satisfies Deliverables)' },
                { value: '2', label: '2 - Developing (Requires Supervision)' },
                { value: '1', label: '1 - Unsatisfactory' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Communication & Sync"
              value={commScore}
              onChange={(e) => setCommScore(e.target.value)}
              options={[
                { value: '5', label: '5 - Excellent' },
                { value: '4', label: '4 - Very Good' },
                { value: '3', label: '3 - Satisfactory' },
                { value: '2', label: '2 - Needs Work' },
              ]}
            />

            <Select
              label="Teamwork & Collaboration"
              value={teamScore}
              onChange={(e) => setTeamScore(e.target.value)}
              options={[
                { value: '5', label: '5 - Outstanding' },
                { value: '4', label: '4 - Good' },
                { value: '3', label: '3 - Average' },
              ]}
            />

            <Select
              label="Problem Solving / Debugging"
              value={probScore}
              onChange={(e) => setProbScore(e.target.value)}
              options={[
                { value: '5', label: '5 - Innovative' },
                { value: '4', label: '4 - Methodical' },
                { value: '3', label: '3 - Basic' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Punctuality & Shift Presence"
              value={puncScore}
              onChange={(e) => setPuncScore(e.target.value)}
              options={[
                { value: '5', label: '5 - Always On-Time' },
                { value: '4', label: '4 - Reliable' },
                { value: '3', label: '3 - Occasional Delays' },
              ]}
            />

            <Select
              label="Initiative & Proactiveness"
              value={initScore}
              onChange={(e) => setInitScore(e.target.value)}
              options={[
                { value: '5', label: '5 - High Initiative' },
                { value: '4', label: '4 - Self-Directed' },
                { value: '3', label: '3 - Passive' },
              ]}
            />

            <Select
              label="Professionalism & Ethics"
              value={profScore}
              onChange={(e) => setProfScore(e.target.value)}
              options={[
                { value: '5', label: '5 - Exemplary' },
                { value: '4', label: '4 - Professional' },
                { value: '3', label: '3 - Satisfactory' },
              ]}
            />
          </div>

          <Textarea
            label="Qualitative Feedback & Full-Time PPO Recommendation"
            rows={3}
            value={feedbackNotes}
            onChange={(e) => setFeedbackNotes(e.target.value)}
            placeholder="Document key strengths, architecture contributions, and placement recommendation..."
            required
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsAppraiseModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={acting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Publish Official Appraisal
            </Button>
          </div>
        </form>
      </Modal>

      {/* ─── ASSIGN TASK MODAL ──────────────────────────────────────────────── */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title={`Assign Sprint Task to ${intern.name}`}
        size="md"
      >
        <form onSubmit={handleAssignTask} className="space-y-4 text-xs">
          <Input
            label="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="e.g. Implement distributed Redis session invalidation"
            required
          />

          <Select
            label="Priority Level"
            value={taskPriority}
            onChange={(e) => setTaskPriority(e.target.value)}
            options={[
              { value: 'LOW', label: 'Low Priority' },
              { value: 'MEDIUM', label: 'Medium Priority' },
              { value: 'HIGH', label: 'High Priority' },
              { value: 'CRITICAL', label: 'Critical / Sprint Blocker' },
            ]}
          />

          <Textarea
            label="Description & Acceptance Criteria"
            rows={3}
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            placeholder="Document requirements, edge cases, PR requirements..."
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={acting}>
              Assign Deliverable
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
