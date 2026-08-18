import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { CheckSquare, Plus, CheckCircle2, Clock, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TaskItem {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  description: string;
}

const initialTasks: TaskItem[] = [
  { id: '1', title: 'Implement OAuth2 PKCE challenge validation in Go backend', category: 'Backend Security', dueDate: 'Jul 28, 2026', completed: true, priority: 'High', description: 'Validate SHA-256 code challenge strings against verifiers.' },
  { id: '2', title: 'Author Jest unit tests for token expiration refresh flow', category: 'Testing', dueDate: 'Jul 27, 2026', completed: true, priority: 'Medium', description: 'Reach minimum 90% branch coverage on auth refresh route.' },
  { id: '3', title: 'Benchmark PostgreSQL query throughput with 50k concurrent sessions', category: 'Database', dueDate: 'Jul 31, 2026', completed: false, priority: 'High', description: 'Run k6 load tests and document query execution latencies.' },
  { id: '4', title: 'Author Week 5 Synthesis Report and link merged pull requests', category: 'Academic', dueDate: 'Jul 29, 2026', completed: false, priority: 'High', description: 'Prepare 5-page synthesis report for Faculty Guide Dr. Rajesh Kumar.' },
  { id: '5', title: 'Review Kubernetes ingress load balancer SSL certificates', category: 'DevOps', dueDate: 'Aug 04, 2026', completed: false, priority: 'Low', description: 'Verify cert-manager automated renewal on staging cluster.' },
];

export default function TasksPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Development');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newDueDate, setNewDueDate] = useState('Aug 02, 2026');
  const [newDesc, setNewDesc] = useState('');

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          const next = !t.completed;
          toast.success(next ? `Marked "${t.title}" as completed` : `Reopened "${t.title}"`);
          return { ...t, completed: next };
        }
        return t;
      })
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: TaskItem = {
      id: String(Date.now()),
      title: newTitle,
      category: newCategory,
      dueDate: newDueDate,
      completed: false,
      priority: newPriority,
      description: newDesc,
    };

    setTasks([newTask, ...tasks]);
    setIsTaskModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    toast.success('Sprint task created successfully!');
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Sprint Tasks & Deliverables"
        subtitle="Manage sprint tasks assigned by mentor Siddharth Nambiar"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Sprint 4 Milestones</h2>
            <p className="text-xs text-slate-500 font-mono">
              {completedCount} of {tasks.length} deliverables completed ({Math.round((completedCount / tasks.length) * 100)}%)
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsTaskModalOpen(true)}
            leftIcon={<Plus size={14} />}
          >
            Add Task
          </Button>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className={`p-4 flex items-start justify-between gap-4 transition-all ${
                task.completed ? 'bg-slate-50/70 border-slate-200' : 'bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className="mt-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                  aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  <CheckCircle2
                    size={18}
                    className={task.completed ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'}
                  />
                </button>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs font-bold leading-snug ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {task.category}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        task.priority === 'High'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : task.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-[11px] text-slate-500 leading-relaxed">{task.description}</p>
                  )}
                </div>
              </div>

              <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                {task.dueDate}
              </span>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Add Sprint Deliverable"
        size="md"
      >
        <form onSubmit={handleAddTask} className="space-y-4 text-xs">
          <Input
            label="Task Title / Objective"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. Implement Redis caching on user profiles"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              options={[
                { label: 'Development', value: 'Development' },
                { label: 'Security', value: 'Security' },
                { label: 'Testing', value: 'Testing' },
                { label: 'Database', value: 'Database' },
                { label: 'Academic', value: 'Academic' },
              ]}
            />

            <Select
              label="Priority"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as any)}
              options={[
                { label: 'High', value: 'High' },
                { label: 'Medium', value: 'Medium' },
                { label: 'Low', value: 'Low' },
              ]}
            />
          </div>

          <Textarea
            label="Description & Acceptance Criteria"
            rows={3}
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Details, PR expectations, and required benchmarks..."
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Deliverable
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
