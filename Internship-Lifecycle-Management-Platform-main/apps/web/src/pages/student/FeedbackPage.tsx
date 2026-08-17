import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Star, MessageSquare, Building2, User, Award, Calendar, CheckCircle2 } from 'lucide-react';

const feedbacks = [
  {
    id: '1',
    mentorName: 'Siddharth Nambiar',
    mentorRole: 'Lead Architect & Engineering Manager',
    company: 'TechCorp Solutions',
    date: 'Jul 20, 2026',
    ratings: { technicalSkills: 4.8, communication: 4.5, problemSolving: 4.8, punctuality: 5.0, teamwork: 4.9 },
    overallScore: 4.8,
    comments: 'Priya has shown remarkable mastery in backend API architecture and high-performance caching. She proactively completed the OAuth2 PKCE integration sprint ahead of schedule.',
  },
  {
    id: '2',
    mentorName: 'Dr. Rajesh Kumar',
    mentorRole: 'Academic Faculty Guide',
    company: 'Dept. of Computer Science',
    date: 'Jul 10, 2026',
    ratings: { technicalSkills: 4.6, communication: 4.7, problemSolving: 4.5, punctuality: 4.9, teamwork: 4.8 },
    overallScore: 4.7,
    comments: 'Consistently submits structured technical synthesis reports on time with exemplary documentation and reproducible code samples.',
  },
];

export default function FeedbackPage() {
  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="Supervisor & Faculty Feedback" subtitle="Formal evaluations from industry guides and academic advisors" />
      
      <main className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
        {feedbacks.map((fb, i) => (
          <motion.div 
            key={fb.id} 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-teal-50 text-[#0D9488] border border-teal-200 flex items-center justify-center font-bold text-sm">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{fb.mentorName}</h3>
                  <p className="text-xs text-slate-500">{fb.mentorRole} · <span className="font-semibold text-slate-700">{fb.company}</span></p>
                  <span className="text-[11px] font-mono text-slate-400 mt-0.5 block">{fb.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                <Star size={16} className="text-amber-500 fill-amber-500" />
                <span className="font-mono font-bold text-base text-slate-900">{fb.overallScore}</span>
                <span className="text-xs text-slate-400 font-mono">/ 5.0</span>
              </div>
            </div>

            {/* Ratings Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {Object.entries(fb.ratings).map(([key, val]) => (
                <div key={key} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#0D9488]">{val} / 5</span>
                </div>
              ))}
            </div>

            {/* Comments Quote */}
            <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200/60 text-xs text-slate-700 leading-relaxed italic">
              "{fb.comments}"
            </div>
          </motion.div>
        ))}
      </main>
    </div>
  );
}
