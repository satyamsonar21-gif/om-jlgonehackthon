import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, Building2, MapPin, Clock, IndianRupee, Calendar, Users, CheckCircle, Send, Sparkles } from 'lucide-react';

export default function InternshipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="Internship Role Specification" subtitle="Software Engineering Intern · TechCorp Solutions" />
      
      <main className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        <Link 
          to="/student/internships" 
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#0D9488] hover:underline"
        >
          <ChevronLeft size={14} /> Back to Browse Internships
        </Link>

        {/* Opportunity Card */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#0D9488] border border-teal-200 flex items-center justify-center font-bold text-xl shadow-xs flex-shrink-0">
                TC
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-slate-900">Software Engineering Intern</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-50 text-[#0D9488] border border-teal-200">
                    VERIFIED PARTNER
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">TechCorp Solutions · Hybrid (Bangalore)</p>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-600 font-mono">
                  <span className="flex items-center gap-1 font-semibold text-slate-900"><IndianRupee size={12} /> ₹15,000 / month</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> 12 weeks</span>
                  <span className="flex items-center gap-1"><Users size={12} /> 3 openings</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> Apply by Aug 15, 2026</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-2">About the Role</h3>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                We are looking for a motivated Software Engineering Intern to join our backend engineering team. You will work directly alongside senior engineers building scalable REST APIs, microservices, and database schemas using React, Node.js, and PostgreSQL.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-2">Key Required Competencies</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Node.js', 'REST APIs', 'PostgreSQL', 'Git'].map(s => (
                  <span key={s} className="px-3 py-1 rounded-xl text-xs font-mono font-medium bg-slate-100 border border-slate-200 text-slate-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Application Box */}
          <div className="pt-6 border-t border-slate-100">
            {applied ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-emerald-800 space-y-1">
                <div className="flex items-center justify-center gap-1.5 font-bold text-sm">
                  <CheckCircle size={16} /> Application Submitted Successfully!
                </div>
                <p className="text-xs text-emerald-700">Your profile and dossier were forwarded to TechCorp HR.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setApplied(true); }} className="space-y-4">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block">
                  Candidate Note / Cover Statement
                </label>
                <textarea
                  rows={3}
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  placeholder="Briefly highlight your relevant projects or coursework (e.g. built OAuth2 system with React)..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none input-focus-ring"
                  style={{ '--primary': '#0D9488' } as React.CSSProperties}
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Send size={14} /> Submit Application
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
