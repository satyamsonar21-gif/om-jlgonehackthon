import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { CheckSquare, Clock, AlertCircle, CheckCircle2, Plus, Calendar, User } from 'lucide-react';

const initialTasks = [
  { id: '1', title: 'Implement JWT Auth Guard & User Sync API', dueDate: 'Jul 28, 2026', status: 'IN_PROGRESS', priority: 'HIGH', desc: 'Create NestJS AuthModule with Clerk webhook synchronization and local mock fallback.' },
  { id: '2', title: 'Swagger OpenAPI Endpoint Documentation', dueDate: 'Jul 30, 2026', status: 'IN_PROGRESS', priority: 'MEDIUM', desc: 'Annotate all NestJS controllers with Swagger DTO definitions and response schemas.' },
  { id: '3', title: 'Setup Prisma PostgreSQL Relational Schema', dueDate: 'Jul 20, 2026', status: 'COMPLETED', priority: 'HIGH', desc: 'Create models for Student, Faculty, Company, DailyLog, and Certificate entities.' },
  { id: '4', title: 'Design Grounded Theming System & Sliding Pill', dueDate: 'Jul 27, 2026', status: 'COMPLETED', priority: 'MEDIUM', desc: 'Ensure smooth role color transitions and responsive layout morphs.' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED' } : t));
  };

  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="Assigned Sprint Tasks" subtitle="Technical deliverables assigned by TechCorp industry mentor" />
      
      <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
            <p className="text-2xl font-bold font-mono text-slate-900">{tasks.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Total Assigned</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
            <p className="text-2xl font-bold font-mono text-[#0D9488]">{tasks.filter(t => t.status === 'IN_PROGRESS').length}</p>
            <p className="text-xs text-slate-500 mt-0.5">In Progress</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
            <p className="text-2xl font-bold font-mono text-emerald-700">{tasks.filter(t => t.status === 'COMPLETED').length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Completed</p>
          </div>
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
                className={`interactive-card p-5 flex items-start gap-4 transition-all ${
                  isCompleted ? 'bg-slate-50 border-slate-200 opacity-80' : 'bg-white border-slate-200'
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`mt-0.5 p-1 rounded-lg border transition-colors cursor-pointer ${
                    isCompleted 
                      ? 'bg-emerald-500 text-white border-emerald-500' 
                      : 'bg-slate-50 text-slate-400 border-slate-300 hover:border-[#0D9488]'
                  }`}
                >
                  <CheckCircle2 size={16} />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className={`font-bold text-sm ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        task.priority === 'HIGH' 
                          ? 'bg-rose-50 text-rose-800 border border-rose-200' 
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {task.priority} PRIORITY
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock size={11} /> Due {task.dueDate}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {task.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
