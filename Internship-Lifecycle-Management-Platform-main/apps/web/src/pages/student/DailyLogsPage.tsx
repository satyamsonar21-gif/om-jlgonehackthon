import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Clock, CheckCircle2, Calendar, Sparkles, Send, Check, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface DailyLog {
  id: number;
  date: string;
  hours: string;
  mood: string;
  summary: string;
  status: 'Logged' | 'Approved' | 'Pending Review';
}

const initialLogs: DailyLog[] = [
  { id: 1, date: 'Today, 28 Jul 2026', hours: '8h', mood: '🚀', summary: 'Implemented OAuth2 PKCE login flow using React and Zustand state management. Resolved 3 latency bottlenecks in profile picture upload CDN pipeline.', status: 'Logged' },
  { id: 2, date: 'Yesterday, 27 Jul 2026', hours: '7.5h', mood: '😄', summary: 'Wrote unit tests for auth token refresh interceptor using Vitest and Mock Service Worker.', status: 'Approved' },
  { id: 3, date: '26 Jul 2026', hours: '8h', mood: '🙂', summary: 'Collaborated with UX designer on accessible modal drawer component and focus trapping.', status: 'Approved' },
  { id: 4, date: '25 Jul 2026', hours: '6.5h', mood: '😐', summary: 'Resolved PostgreSQL connection pooling errors in NestJS microservice under load.', status: 'Approved' },
  { id: 5, date: '24 Jul 2026', hours: '8h', mood: '🚀', summary: 'Deployed candidate evaluation metrics pipeline to staging cluster.', status: 'Approved' },
];

export default function DailyLogsPage() {
  const [logs, setLogs] = useState<DailyLog[]>(initialLogs);
  const [activeMood, setActiveMood] = useState('😄');
  const [activeHours, setActiveHours] = useState('8h');
  const [logText, setLogText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logText.trim()) return;

    const newLog: DailyLog = {
      id: Date.now(),
      date: 'Just now',
      hours: activeHours,
      mood: activeMood,
      summary: logText,
      status: 'Logged'
    };

    setLogs([newLog, ...logs]);
    setSubmitted(true);
    toast.success("Daily work log saved & synchronized with supervisor dashboard!");
    setLogText('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-full pb-16" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header title="Daily Work Log & Sprint Deliverables" subtitle="Record daily tasks, pull request links, challenges, and hours clocked" />
      
      <main className="max-w-6xl mx-auto p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Log Today's Work */}
          <div 
            className="lg:col-span-6 rounded-2xl border shadow-sm p-6 space-y-5"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                  style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--role-accent, var(--cta))' }}
                >
                  <Clock size={16} />
                </div>
                <h2 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Log Today's Work Deliverables</h2>
              </div>
              <span 
                className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border"
                style={{
                  backgroundColor: 'var(--accent-soft)',
                  borderColor: 'var(--border)',
                  color: 'var(--role-accent, var(--cta))'
                }}
              >
                28 Jul 2026
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-mono font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Technical Deliverables & Summary
                </label>
                <textarea 
                  rows={4}
                  value={logText}
                  onChange={(e) => setLogText(e.target.value)}
                  placeholder="Detail tasks completed, pull request links, tickets resolved, and challenges encountered today..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-xs focus:outline-none"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Hours Clocked
                </label>
                <div className="flex gap-2">
                  {['4h', '6h', '8h', '9h+'].map(h => (
                    <button 
                      key={h} 
                      type="button"
                      onClick={() => setActiveHours(h)} 
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        activeHours === h 
                          ? 'bg-[#C2410C] text-white shadow-xs' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Work Sentiment & Energy
                </label>
                <div className="flex gap-2.5">
                  {['😴', '😐', '🙂', '😄', '🚀'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setActiveMood(emoji)}
                      className={`text-xl p-2.5 rounded-xl border transition-all cursor-pointer ${
                        activeMood === emoji 
                          ? 'bg-amber-50 dark:bg-amber-950/50 border-[#C2410C] scale-110 shadow-xs' 
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-white text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                style={{ backgroundColor: 'var(--cta)' }}
              >
                {submitted ? (
                  <>
                    <Check size={14} />
                    <span>Work Log Saved Successfully</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Submit Daily Log</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Historical Logs */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Sprint Log Ledger ({logs.length})</h3>
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Week 4 Sprint</span>
            </div>

            <div className="space-y-3">
              {logs.map(log => (
                <div 
                  key={log.id} 
                  className="rounded-2xl border p-4 space-y-2 shadow-xs transition-all"
                  style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{log.mood}</span>
                      <span className="font-mono font-bold" style={{ color: 'var(--text)' }}>{log.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold" style={{ color: 'var(--text-muted)' }}>{log.hours}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                        {log.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed p-3 rounded-xl border bg-slate-50/70 dark:bg-slate-900/60" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                    {log.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
