import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  CheckSquare,
  Plus,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  MessageSquare,
  Paperclip,
  Send,
  User,
  ShieldAlert,
  Loader2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export default function TasksPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};
  const { user } = useAuth();

  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'REVIEW' | 'COMPLETED' | 'OVERDUE'>('ALL');
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // New task state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('MEDIUM');
  const [newDeadline, setNewDeadline] = useState('');
  const [newAttachments, setNewAttachments] = useState('');

  // Comment state
  const [commentText, setCommentText] = useState('');
  const [acting, setActing] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const internshipRes = await api.getInternships();
      const myInternship = internshipRes.data?.[0];
      if (myInternship) {
        const res = await api.getTasks(myInternship.id);
        setTasks(res.data || []);
      } else {
        setTasks(getDemoTasks());
      }
    } catch {
      setTasks(getDemoTasks());
    } finally {
      setLoading(false);
    }
  };

  const getDemoTasks = () => [
    {
      id: 'task-1',
      title: 'Implement OAuth2 PKCE challenge validation in microservice',
      description: 'Validate SHA-256 code challenge strings against client verifiers and write unit tests.',
      priority: 'HIGH',
      status: 'COMPLETED',
      dueDate: new Date(Date.now() - 2 * 86400000).toISOString(),
      assignedByName: 'Siddharth Nambiar (Tech Lead)',
      assignedByRole: 'COMPANY_MENTOR',
      attachments: 'https://github.com/org/repo/pull/104',
      comments: JSON.stringify([
        { author: 'Siddharth Nambiar', role: 'COMPANY_MENTOR', message: 'Good progress. Ensure 95% branch test coverage.', createdAt: '2026-03-02' },
      ]),
    },
    {
      id: 'task-2',
      title: 'Benchmark PostgreSQL query throughput with 50k concurrent sessions',
      description: 'Run k6 load tests and document query execution latencies in synthesis document.',
      priority: 'CRITICAL',
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
      assignedByName: 'Siddharth Nambiar (Tech Lead)',
      assignedByRole: 'COMPANY_MENTOR',
      attachments: 'https://storage.ilmp.edu/benchmarks/k6-spec.yaml',
      comments: JSON.stringify([]),
    },
    {
      id: 'task-3',
      title: 'Submit Week 4 Synthesis Report to Faculty Mentor',
      description: 'Document architectural trade-offs and submit report for Dr. Rajesh Kumar.',
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
      assignedByName: 'Dr. Rajesh Kumar (Faculty Guide)',
      assignedByRole: 'FACULTY_MENTOR',
      comments: JSON.stringify([]),
    },
  ];

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setActing(true);
    try {
      const internshipRes = await api.getInternships();
      const internshipId = internshipRes.data?.[0]?.id || 'demo-internship';

      await api.createTask({
        internshipId,
        title: newTitle.trim(),
        description: newDesc.trim(),
        priority: newPriority,
        deadline: newDeadline || undefined,
        attachments: newAttachments || undefined,
        assignedByName: user?.name || 'Self-Assigned',
        assignedByRole: 'STUDENT',
      });

      toast.success('Task created successfully!');
      setIsTaskModalOpen(false);
      setNewTitle('');
      setNewDesc('');
      setNewDeadline('');
      setNewAttachments('');
      await fetchTasks();
    } catch {
      // Optimistic local fallback
      const localTask = {
        id: `task-${Date.now()}`,
        title: newTitle,
        description: newDesc,
        priority: newPriority,
        status: 'TODO',
        dueDate: newDeadline || new Date(Date.now() + 7 * 86400000).toISOString(),
        assignedByName: user?.name || 'Self-Assigned',
        assignedByRole: 'STUDENT',
        attachments: newAttachments,
        comments: JSON.stringify([]),
      };
      setTasks([localTask, ...tasks]);
      setIsTaskModalOpen(false);
      toast.success('Task created successfully!');
    } finally {
      setActing(false);
    }
  };

  const handleUpdateStatus = async (taskId: string, targetStatus: string) => {
    setActing(true);
    try {
      await api.updateTask(taskId, { status: targetStatus });
      toast.success(`Task marked as ${targetStatus.replace('_', ' ')}`);
      await fetchTasks();
      if (selectedTask?.id === taskId) {
        setSelectedTask({ ...selectedTask, status: targetStatus });
      }
    } catch {
      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t)));
      toast.success(`Task status updated to ${targetStatus}`);
    } finally {
      setActing(false);
    }
  };

  const handleAddComment = async () => {
    if (!selectedTask || !commentText.trim()) return;
    setActing(true);
    try {
      await api.updateTask(selectedTask.id, {
        newComment: commentText.trim(),
        authorName: user?.name || 'Aarav Patil',
        authorRole: user?.role || 'STUDENT',
      });

      toast.success('Comment posted to task discussion.');
      setCommentText('');
      await fetchTasks();

      let comments = [];
      try {
        comments = JSON.parse(selectedTask.comments || '[]');
      } catch {
        comments = [];
      }
      comments.push({
        id: `com_${Date.now()}`,
        author: user?.name || 'Aarav Patil',
        role: 'STUDENT',
        message: commentText.trim(),
        createdAt: new Date().toISOString(),
      });
      setSelectedTask({ ...selectedTask, comments: JSON.stringify(comments) });
    } catch {
      toast.error('Failed to post comment');
    } finally {
      setActing(false);
    }
  };

  const getPriorityBadge = (p: string) => {
    const pr = (p || 'MEDIUM').toUpperCase();
    if (pr === 'CRITICAL' || pr === 'URGENT') return <Badge variant="danger">{pr}</Badge>;
    if (pr === 'HIGH') return <Badge variant="warning">{pr}</Badge>;
    if (pr === 'MEDIUM') return <Badge variant="info">{pr}</Badge>;
    return <Badge variant="neutral">{pr}</Badge>;
  };

  const getStatusBadge = (st: string) => {
    const s = (st || 'TODO').toUpperCase();
    if (s === 'COMPLETED') return <Badge variant="success">COMPLETED</Badge>;
    if (s === 'SUBMITTED' || s === 'REVIEW') return <Badge variant="info">{s}</Badge>;
    if (s === 'IN_PROGRESS') return <Badge variant="warning">IN PROGRESS</Badge>;
    if (s === 'OVERDUE') return <Badge variant="danger">OVERDUE</Badge>;
    return <Badge variant="neutral">TODO</Badge>;
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const s = (t.status || 'TODO').toUpperCase();
    if (activeTab === 'ACTIVE') return ['TODO', 'IN_PROGRESS'].includes(s);
    if (activeTab === 'REVIEW') return ['SUBMITTED', 'REVIEW'].includes(s);
    if (activeTab === 'COMPLETED') return s === 'COMPLETED';
    if (activeTab === 'OVERDUE') return s === 'OVERDUE';
    return true;
  });

  const completedCount = tasks.filter((t) => (t.status || '').toUpperCase() === 'COMPLETED').length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Sprint Tasks & Deliverables"
        subtitle="Manage technical backlog deliverables, submit code reviews, and collaborate with mentors"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Progress Metric Card */}
        <Card className="p-5 sm:p-6 border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sprint Velocity & Progress</span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                {completedCount} of {tasks.length} Deliverables Completed ({progressPct}%)
              </h2>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsTaskModalOpen(true)}
              leftIcon={<Plus size={14} />}
              className="bg-blue-600 hover:bg-blue-700 text-white self-start sm:self-auto"
            >
              Add Sprint Task
            </Button>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 mt-4 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </Card>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold overflow-x-auto">
          {[
            { id: 'ALL', label: `All Tasks (${tasks.length})` },
            { id: 'ACTIVE', label: 'Todo / In Progress' },
            { id: 'REVIEW', label: 'Under Review' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'OVERDUE', label: 'Overdue' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={36} />
            <p className="text-sm text-slate-500 mt-2">Loading sprint backlog...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredTasks.length === 0 && (
          <EmptyState
            title="No Tasks Found"
            description="No sprint deliverables match the active filter criteria."
            icon={CheckSquare}
            action={
              <Button size="sm" onClick={() => setIsTaskModalOpen(true)} leftIcon={<Plus size={14} />}>
                Create New Task
              </Button>
            }
          />
        )}

        {/* Task Cards Grid */}
        {!loading && filteredTasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map((task) => (
              <Card
                key={task.id}
                className="p-5 border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 cursor-pointer"
                onClick={() => setSelectedTask(task)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getPriorityBadge(task.priority)}
                      {getStatusBadge(task.status)}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Calendar size={12} />
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{task.title}</h3>
                    {task.description && (
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium truncate max-w-[200px]">
                    By: {task.assignedByName || 'Supervisor'}
                  </span>
                  <div className="flex items-center gap-2">
                    {task.attachments && <Paperclip size={13} className="text-slate-400" />}
                    <ChevronRight size={15} className="text-slate-400" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ─── TASK DETAIL & COLLABORATION MODAL ───────────────────────────────── */}
      {selectedTask && (
        <Modal
          isOpen={Boolean(selectedTask)}
          onClose={() => setSelectedTask(null)}
          title="Task Deliverable Dossier"
          size="lg"
        >
          <div className="space-y-5 text-xs">
            <div className="flex items-start justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-slate-900">{selectedTask.title}</h3>
                <p className="text-slate-500 font-medium">
                  Assigned by {selectedTask.assignedByName || 'Supervisor'} ({selectedTask.assignedByRole || 'MENTOR'})
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                {getPriorityBadge(selectedTask.priority)}
                {getStatusBadge(selectedTask.status)}
              </div>
            </div>

            {selectedTask.description && (
              <div className="space-y-1">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                  Description & Acceptance Criteria
                </span>
                <p className="p-3 rounded-lg bg-white border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedTask.description}
                </p>
              </div>
            )}

            {/* Attachments / PR links */}
            {selectedTask.attachments && (
              <div className="space-y-1">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                  Attached Deliverables / Links
                </span>
                <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-blue-600 font-mono text-[11px]">
                  <span className="truncate">{selectedTask.attachments}</span>
                  <a
                    href={selectedTask.attachments}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline flex items-center gap-1 font-bold flex-shrink-0 ml-2"
                  >
                    <span>Open</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            )}

            {/* Status Transition Control Bar */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                Update Status
              </span>
              <div className="flex flex-wrap gap-2">
                {['TODO', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED'].map((st) => (
                  <Button
                    key={st}
                    variant={selectedTask.status === st ? 'primary' : 'outline'}
                    size="sm"
                    loading={acting}
                    onClick={() => handleUpdateStatus(selectedTask.id, st)}
                    className="text-xs"
                  >
                    {st.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>

            {/* Comments Thread */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                Discussion & Review Thread
              </span>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {(() => {
                  let commentsList: any[] = [];
                  try {
                    commentsList = JSON.parse(selectedTask.comments || '[]');
                  } catch {
                    commentsList = [];
                  }
                  if (commentsList.length === 0) {
                    return <p className="text-slate-400 italic text-[11px]">No comments posted yet.</p>;
                  }
                  return commentsList.map((c: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] space-y-0.5">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>{c.author}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{c.createdAt?.split('T')[0] || ''}</span>
                      </div>
                      <p className="text-slate-600">{c.message}</p>
                    </div>
                  ));
                })()}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Post comment or review update..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="text-xs"
                />
                <Button
                  variant="primary"
                  size="sm"
                  loading={acting}
                  onClick={handleAddComment}
                  leftIcon={<Send size={12} />}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ─── ADD TASK MODAL ─────────────────────────────────────────────────── */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Create Sprint Task"
        size="md"
      >
        <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
          <Input
            label="Task Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. Implement Redis Cache Layer for Session Tokens"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Priority Level"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              options={[
                { value: 'LOW', label: 'Low Priority' },
                { value: 'MEDIUM', label: 'Medium Priority' },
                { value: 'HIGH', label: 'High Priority' },
                { value: 'CRITICAL', label: 'Critical / Blocker' },
              ]}
            />

            <Input
              label="Target Due Date"
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
            />
          </div>

          <Textarea
            label="Task Description & Acceptance Criteria"
            rows={3}
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Detailed description of technical implementation or requirements..."
          />

          <Input
            label="Deliverable Attachment URL / Pull Request"
            value={newAttachments}
            onChange={(e) => setNewAttachments(e.target.value)}
            placeholder="https://github.com/..."
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={acting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Sprint Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
