import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MessageSquare, Star, User, BookOpen, Building2, CheckCircle2 } from 'lucide-react';

interface FeedbackRecord {
  id: string;
  source: 'Industry Supervisor' | 'Faculty Advisor';
  author: string;
  role: string;
  date: string;
  rating: number;
  comments: string;
  milestone: string;
  strengths: string[];
}

const feedbackList: FeedbackRecord[] = [
  {
    id: 'f1',
    source: 'Industry Supervisor',
    author: 'Siddharth Nambiar',
    role: 'Lead Architect · TechCorp Solutions',
    date: 'Jul 24, 2026',
    rating: 5,
    milestone: 'Sprint 4 Architecture & OAuth2 Review',
    comments: 'Priya demonstrated exceptional technical autonomy while architecting the OAuth2 PKCE flow. Her unit test coverage was thorough and she resolved integration edge cases swiftly.',
    strengths: ['Go Microservices', 'Test Driven Development', 'System Diagramming'],
  },
  {
    id: 'f2',
    source: 'Faculty Advisor',
    author: 'Dr. Rajesh Kumar',
    role: 'Dept. of Computer Science & Engineering',
    date: 'Jul 20, 2026',
    rating: 4.8,
    milestone: 'Week 3 Synthesis Report Evaluation',
    comments: 'Strong documentation of relational database indexing and performance benchmarks. Good adherence to institutional reporting standards.',
    strengths: ['Academic Rigor', 'Analytical Reporting'],
  },
  {
    id: 'f3',
    source: 'Industry Supervisor',
    author: 'Siddharth Nambiar',
    role: 'Lead Architect · TechCorp Solutions',
    date: 'Jul 10, 2026',
    rating: 4.5,
    milestone: 'Sprint 2 Component Migration Evaluation',
    comments: 'Smooth onboarding sprint. Priya integrated with the team repository rapidly and delivered early on her first sprint milestone.',
    strengths: ['Team Collaboration', 'Git Workflow'],
  },
];

export default function FeedbackPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Mentor & Faculty Feedback"
        subtitle="Formal academic appraisals and industry supervisor performance evaluations"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Rating Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Supervisor Rating"
            value="4.9 / 5.0"
            sublabel="TechCorp Solutions"
            icon={Star}
            iconColor="#4F46E5"
          />
          <StatCard
            label="Faculty Grade"
            value="4.8 / 5.0"
            sublabel="Dept. of CSE"
            icon={BookOpen}
            iconColor="#059669"
          />
          <StatCard
            label="Appraisals Received"
            value="3 Formal"
            sublabel="100% Verified Sign-offs"
            icon={CheckCircle2}
            iconColor="#16A34A"
          />
        </div>

        {/* Feedback Timeline Cards */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Evaluation Dossier</h2>

          <div className="space-y-4">
            {feedbackList.map((item) => (
              <Card key={item.id} className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        item.source === 'Industry Supervisor'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {item.source === 'Industry Supervisor' ? <Building2 size={20} /> : <BookOpen size={20} />}
                    </div>

                    <div>
                      <div className="font-bold text-slate-900 text-sm">{item.author}</div>
                      <div className="text-[11px] text-slate-500">{item.role}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-amber-500 font-mono font-bold text-xs">
                      <Star size={14} className="fill-amber-400" />
                      <span>{item.rating} / 5.0</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">· {item.date}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                    {item.milestone}
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    "{item.comments}"
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-mono text-slate-400 font-semibold mr-1">Skills Highlighted:</span>
                  {item.strengths.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-white border border-slate-200 text-slate-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
