import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Link } from 'react-router-dom';
import { ChevronLeft, Plus, Briefcase, IndianRupee, Calendar, Users, CheckCircle, Send } from 'lucide-react';

export default function NewListingPage() {
  const [created, setCreated] = useState(false);
  const [form, setForm] = useState({
    title: '',
    domain: 'Software Engineering',
    mode: 'Remote',
    stipend: '15000',
    duration: '12 weeks',
    openings: '3',
    description: '',
    skills: 'React, Node.js, TypeScript, PostgreSQL',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreated(true);
  };

  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="Post New Internship Listing" subtitle="Publish a verified industrial training opportunity" />
      
      <main className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
        <Link 
          to="/company/listings" 
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#0284C7] hover:underline"
        >
          <ChevronLeft size={14} /> Back to Open Listings
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8"
        >
          {created ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Internship Listing Published!</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your role has been verified and is now live across student candidate dashboards.
              </p>
              <div className="pt-4">
                <Link 
                  to="/company/listings" 
                  className="px-6 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-xs"
                >
                  Return to Listings
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900">Internship Role Specification</h3>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block">Job Title / Role</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Junior Full Stack Engineer"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none input-focus-ring" 
                  style={{ '--primary': '#0284C7' } as React.CSSProperties}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block">Technical Domain</label>
                  <select 
                    value={form.domain}
                    onChange={e => setForm({ ...form, domain: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none input-focus-ring" 
                    style={{ '--primary': '#0284C7' } as React.CSSProperties}
                  >
                    <option>Software Engineering</option>
                    <option>Data Science & AI</option>
                    <option>UI/UX Product Design</option>
                    <option>DevOps & Cloud Infrastructure</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block">Work Mode</label>
                  <select 
                    value={form.mode}
                    onChange={e => setForm({ ...form, mode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none input-focus-ring" 
                    style={{ '--primary': '#0284C7' } as React.CSSProperties}
                  >
                    <option>Remote</option>
                    <option>Hybrid (Bangalore)</option>
                    <option>On-site</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block">Monthly Stipend (₹)</label>
                  <input 
                    type="number" 
                    value={form.stipend}
                    onChange={e => setForm({ ...form, stipend: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none input-focus-ring" 
                    style={{ '--primary': '#0284C7' } as React.CSSProperties}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block">Duration</label>
                  <input 
                    type="text" 
                    value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none input-focus-ring" 
                    style={{ '--primary': '#0284C7' } as React.CSSProperties}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block">Openings</label>
                  <input 
                    type="number" 
                    value={form.openings}
                    onChange={e => setForm({ ...form, openings: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none input-focus-ring" 
                    style={{ '--primary': '#0284C7' } as React.CSSProperties}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block">Required Skills (Comma separated)</label>
                <input 
                  type="text" 
                  value={form.skills}
                  onChange={e => setForm({ ...form, skills: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none input-focus-ring" 
                  style={{ '--primary': '#0284C7' } as React.CSSProperties}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Send size={14} /> Publish Opportunity
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </main>
    </div>
  );
}
