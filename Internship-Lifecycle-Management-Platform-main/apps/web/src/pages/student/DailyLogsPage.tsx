import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Clock, CheckCircle2, Calendar, Sparkles, Send, Check } from 'lucide-react';

const pastLogs = [
  { id: 1, date: 'Today, 28 Jul 2026', hours: '8h', mood: '🚀', summary: 'Implemented OAuth2 PKCE login flow using React and Zustand state management. Resolved 3 latency bottlenecks in profile picture upload CDN pipeline.', status: 'Logged' },
  { id: 2, date: 'Yesterday, 27 Jul 2026', hours: '7.5h', mood: '😄', summary: 'Wrote unit tests for auth token refresh interceptor using Vitest and Mock Service Worker.', status: 'Approved' },
  { id: 3, date: '26 Jul 2026', hours: '8h', mood: '🙂', summary: 'Collaborated with UX designer on accessible modal drawer component and focus trapping.', status: 'Approved' },
  { id: 4, date: '25 Jul 2026', hours: '6.5h', mood: '😐', summary: 'Resolved PostgreSQL connection pooling errors in NestJS microservice under load.', status: 'Approved' },
  { id: 5, date: '24 Jul 2026', hours: '8h', mood: '🚀', summary: 'Deployed candidate evaluation metrics pipeline to staging cluster.', status: 'Approved' },
];

export default function DailyLogsPage() {
  const [activeMood, setActiveMood] = useState('😄');
  const [activeHours, setActiveHours] = useState('8h');
  const [logText, setLogText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logText.trim()) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="Daily Work Log" subtitle="Record your daily tasks, challenges, and hours" />
      
      <main className="max-w-6xl mx-auto p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Log Today's Work */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0D9488] flex items-center justify-center font-bold">
                  <Clock size={16} />
                </div>
                <h2 className="font-bold text-sm text-slate-900">Log Today's Work</h2>
              </div>
              <span className="text-xs font-mono font-bold text-[#0D9488] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                28 Jul 2026
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Technical Deliverables & Summary
                </label>
                <textarea 
                  rows={4}
                  value={logText}
                  onChange={(e) => setLogText(e.target.value)}
                  placeholder="Detail tasks completed, pull request links, tickets resolved, and challenges encountered..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none input-focus-ring"
                  style={{ '--primary': '#0D9488' } as React.CSSProperties}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
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
                          ? 'bg-[#0D9488] text-white shadow-xs' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Work Sentiment & Energy
                </label>
                <div className="flex gap-3">
                  {['😴', '😐', '🙂', '😄', '🚀'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setActiveMood(emoji)}
                      className={`text-xl p-2 rounded-xl border transition-all cursor-pointer ${
                        activeMood === emoji 
                          ? 'bg-teal-50 border-[#0D9488] scale-110 shadow-xs' 
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
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
              <h3 className="font-bold text-sm text-slate-900">Recent Log Ledger</h3>
              <span className="text-xs font-mono text-slate-400">Week 4 Sprint</span>
            </div>

            <div className="space-y-3">
              {pastLogs.map(log => (
                <div key={log.id} className="interactive-card p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{log.mood}</span>
                      <span className="font-mono font-bold text-slate-900">{log.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-slate-500">{log.hours}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {log.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
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
