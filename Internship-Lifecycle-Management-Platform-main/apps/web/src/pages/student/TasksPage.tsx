import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { CheckSquare, Clock, AlertCircle, CheckCircle2, Plus, Calendar, User, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface SprintTask {
  id: string;
  title: string;
  dueDate: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  desc: string;
  assignee: string;
}

const initialTasks: SprintTask[] = [
  { id: '1', title: 'Implement JWT Auth Guard & User Sync API', dueDate: 'Jul 28, 2026', status: 'IN_PROGRESS', priority: 'HIGH', desc: 'Create NestJS AuthModule with Clerk webhook synchronization and local mock fallback.', assignee: 'Siddharth Nambiar' },
  { id: '2', title: 'Swagger OpenAPI Endpoint Documentation', dueDate: 'Jul 30, 2026', status: 'IN_PROGRESS', priority: 'MEDIUM', desc: 'Annotate all NestJS controllers with Swagger DTO definitions and response schemas.', assignee: 'Siddharth Nambiar' },
  { id: '3', title: 'Setup Prisma PostgreSQL Relational Schema', dueDate: 'Jul 20, 2026', status: 'COMPLETED', priority: 'HIGH', desc: 'Create models for Student, Faculty, Company, DailyLog, and Certificate entities.', assignee: 'Siddharth Nambiar' },
  { id: '4', title: 'Design Grounded Theming System & Sliding Pill', dueDate: 'Jul 27, 2026', status: 'COMPLETED', priority: 'MEDIUM', desc: 'Ensure smooth role color transitions and responsive layout morphs.', assignee: 'Siddharth Nambiar' },
  { id: '5', title: 'Redis Cache Layer for Student Attendance API', dueDate: 'Aug 02, 2026', status: 'IN_PROGRESS', priority: 'HIGH', desc: 'Configure 10-minute cache TTL with cache invalidation upon biometric clock-ins.', assignee: 'Siddharth Nambiar' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<SprintTask[]>(initialTasks);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [newDueDate, setNewDueDate] = useState('Aug 05, 2026');

  const toggleTask = (id: string, title: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
        toast.success(`Task "${title}" marked as ${nextStatus === 'COMPLETED' ? 'Completed' : 'In Progress'}`);
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const task: SprintTask = {
      id: String(Date.now()),
      title: newTitle,
      desc: newDesc || 'Deliverable assigned for current industrial sprint cycle.',
      dueDate: newDueDate,
      priority: newPriority,
      status: 'IN_PROGRESS',
      assignee: 'Siddharth Nambiar'
    };

    setTasks([task, ...tasks]);
    setShowAddModal(false);
    toast.success(`Sprint task "${newTitle}" created!`);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="min-h-full pb-16" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header title="Assigned Sprint Tasks & Deliverables" subtitle="Technical deliverables assigned by TechCorp industry mentor" />
      
      <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border shadow-sm text-center" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <p className="text-2xl font-bold font-mono" style={{ color: 'var(--text)' }}>{tasks.length}</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>Total Assigned</p>
          </div>
          <div className="p-4 rounded-2xl border shadow-sm text-center" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <p className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">{tasks.filter(t => t.status === 'IN_PROGRESS').length}</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>In Progress</p>
          </div>
          <div className="p-4 rounded-2xl border shadow-sm text-center" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{tasks.filter(t => t.status === 'COMPLETED').length}</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>Completed</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Active Sprint Backlog ({tasks.length})</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl text-white text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:scale-105"
            style={{ backgroundColor: 'var(--cta)' }}
          >
            <Plus size={14} />
            <span>Add Sprint Task</span>
          </button>
        </div>

        {/* Tasks List */}
        <div className="space-y-3.5">
          {tasks.map((task) => {
            const isCompleted = task.status === 'COMPLETED';

            return (
              <motion.div 
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border p-5 flex items-start gap-4 shadow-sm transition-all"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                  opacity: isCompleted ? 0.75 : 1
                }}
              >
                <button
                  onClick={() => toggleTask(task.id, task.title)}
                  title={isCompleted ? "Mark In Progress" : "Mark Completed"}
                  className={`mt-0.5 p-1 rounded-lg border transition-all cursor-pointer ${
                    isCompleted 
                      ? 'bg-emerald-500 text-white border-emerald-500 scale-105' 
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700 hover:border-emerald-500'
                  }`}
                >
                  <CheckCircle2 size={18} />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className={`font-bold text-sm sm:text-base ${isCompleted ? 'line-through opacity-60' : ''}`} style={{ color: 'var(--text)' }}>
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${
                        task.priority === 'HIGH' 
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300' 
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300'
                      }`}>
                        {task.priority} PRIORITY
                      </span>
                      <span className="text-[11px] font-mono opacity-70 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                        <Clock size={12} /> Due {task.dueDate}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {task.desc}
                  </p>

                  <div className="pt-2 text-[11px] font-mono opacity-60" style={{ color: 'var(--text-muted)' }}>
                    Assigned by: {task.assignee}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Add Task Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div 
              className="rounded-2xl border shadow-2xl p-6 max-w-lg w-full space-y-4 animate-in fade-in zoom-in-95"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-[#C2410C]" />
                  <h3 className="font-bold text-sm">Add New Sprint Deliverable</h3>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddTask} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold font-mono uppercase text-slate-500 block">Task Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Build Rate Limiter Middleware for Auth API"
                    className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 focus:outline-none"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold font-mono uppercase text-slate-500 block">Task Description & Deliverables</label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Describe implementation details, PR links, and acceptance criteria..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 focus:outline-none"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold font-mono uppercase text-slate-500 block">Priority Level</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 font-mono text-xs focus:outline-none"
                      style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                    >
                      <option value="HIGH">High Priority</option>
                      <option value="MEDIUM">Medium Priority</option>
                      <option value="LOW">Low Priority</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold font-mono uppercase text-slate-500 block">Due Date</label>
                    <input
                      type="text"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      placeholder="e.g. Aug 05, 2026"
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 font-mono text-xs focus:outline-none"
                      style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#C2410C] text-white text-xs font-bold font-mono tracking-wider uppercase flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus size={13} />
                    <span>Create Task</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
