import React, { useState } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { ArrowLeft, User, Building2, Calendar, CheckSquare, Plus, Star, Send } from 'lucide-react';
import { demoStudents } from '@/data/demo';
import { toast } from 'sonner';

export default function CompanyInternDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const intern = demoStudents.find((s) => s.id === id) || demoStudents[0];

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAppraiseModalOpen, setIsAppraiseModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [rating, setRating] = useState('5');
  const [feedback, setFeedback] = useState('');

  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Assigned task "${taskTitle}" to ${intern.name}`);
    setIsTaskModalOpen(false);
    setTaskTitle('');
  };

  const handleAppraisalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Formal appraisal submitted for ${intern.name} (${rating}/5.0 stars)`);
    setIsAppraiseModalOpen(false);
    setFeedback('');
  };

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title={`${intern.name} (${intern.roll})`}
        subtitle={`${intern.role} · Cloud Architecture Team`}
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
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-xs">
                {intern.name.substring(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900">{intern.name}</h1>
                  <StatusBadge status={intern.status === 'at_risk' ? 'AT_RISK' : 'ACTIVE'} size="sm" />
                </div>
                <div className="text-xs text-indigo-700 font-semibold mt-1">
                  {intern.role} · Cloud Architecture Team
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
                Assign Task
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setIsAppraiseModalOpen(true)}
                leftIcon={<Star size={14} />}
              >
                Submit Appraisal
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Attendance</span>
              <span className="font-bold font-mono text-slate-900 mt-0.5 block">{intern.attendance}%</span>
            </div>
            <div>
              <span className="text-slate-500 block">Sprint Tasks</span>
              <span className="font-bold font-mono text-slate-900 mt-0.5 block">8 / 10 Completed</span>
            </div>
            <div>
              <span className="text-slate-500 block">Hours Completed</span>
              <span className="font-bold font-mono text-slate-900 mt-0.5 block">160 Hours</span>
            </div>
            <div>
              <span className="text-slate-500 block">Faculty Advisor</span>
              <span className="font-bold text-slate-900 mt-0.5 block truncate">Dr. Rajesh Kumar</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Assign Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title={`Assign Sprint Task to ${intern.name}`}
        size="md"
      >
        <form onSubmit={handleAssignTask} className="space-y-4 text-xs">
          <Input
            label="Task Objective"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="e.g. Implement rate limiting on API endpoints"
            required
          />

          <Textarea
            label="Requirements & Acceptance Criteria"
            rows={3}
            placeholder="Specify technical constraints and test requirements..."
            required
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              Assign Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Appraisal Modal */}
      <Modal
        isOpen={isAppraiseModalOpen}
        onClose={() => setIsAppraiseModalOpen(false)}
        title={`Submit Milestone Appraisal for ${intern.name}`}
        size="md"
      >
        <form onSubmit={handleAppraisalSubmit} className="space-y-4 text-xs">
          <Select
            label="Performance Rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            options={[
              { label: '5.0 - Exceptional Autonomy & Quality', value: '5' },
              { label: '4.5 - Strong Performance & Velocity', value: '4.5' },
              { label: '4.0 - Meets All Engineering Requirements', value: '4' },
              { label: '3.5 - Needs Guidance on Testing', value: '3.5' },
              { label: '3.0 - Action Plan Required', value: '3' },
            ]}
          />

          <Textarea
            label="Appraisal Feedback & Strengths"
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Document technical contributions, code quality, and team collaboration remarks..."
            required
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsAppraiseModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="bg-indigo-600 hover:bg-indigo-700" leftIcon={<Send size={13} />}>
              Submit Appraisal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
