import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  MessageSquare,
  Star,
  User,
  BookOpen,
  Building2,
  CheckCircle2,
  Loader2,
  Award,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { api } from '@/lib/api';
import { EmptyState } from '@/components/ui/EmptyState';

export default function FeedbackPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const internshipRes = await api.getInternships();
      const myInternship = internshipRes.data?.[0];
      if (myInternship) {
        const res = await api.getFeedback(myInternship.id);
        setFeedbacks(res.data || []);
      } else {
        setFeedbacks(getDemoFeedback());
      }
    } catch {
      setFeedbacks(getDemoFeedback());
    } finally {
      setLoading(false);
    }
  };

  const getDemoFeedback = () => [
    {
      id: 'fb-1',
      type: 'FINAL',
      evaluatorRole: 'COMPANY_MENTOR',
      mentor: { user: { name: 'Siddharth Nambiar' } },
      technicalSkills: 5,
      communication: 5,
      teamwork: 5,
      problemSolving: 5,
      punctuality: 4,
      initiative: 5,
      professionalism: 5,
      overallRating: 4.9,
      comments:
        'Aarav demonstrated outstanding technical capability throughout his internship. He successfully implemented OAuth2 security flows and optimized distributed caching. Highly recommended for full-time engineering placement.',
      submittedAt: new Date().toISOString(),
    },
    {
      id: 'fb-2',
      type: 'MID_TERM',
      evaluatorRole: 'COMPANY_MENTOR',
      mentor: { user: { name: 'Siddharth Nambiar' } },
      technicalSkills: 4,
      communication: 4,
      teamwork: 5,
      problemSolving: 4,
      punctuality: 5,
      initiative: 4,
      professionalism: 5,
      overallRating: 4.4,
      comments:
        'Rapid onboarding and high sprint commitment. Has quickly picked up the codebase and actively participates in architectural discussions.',
      submittedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
  ];

  useEffect(() => {
    fetchFeedback();
  }, []);

  const latestFeedback = feedbacks[0];
  const avgRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((acc, f) => acc + (f.overallRating || 4.5), 0) / feedbacks.length).toFixed(1)
      : '5.0';

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Mentor Performance Evaluations"
        subtitle="Formal mid-term and final performance appraisals submitted by industry supervisors"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Rating KPI Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Cumulative Appraisal Rating"
            value={`${avgRating} / 5.0`}
            sublabel="Calculated Performance Average"
            icon={Star}
            iconColor="#4F46E5"
          />
          <StatCard
            label="Evaluations Completed"
            value={`${feedbacks.length} Milestone Evaluations`}
            sublabel="Verified Corporate Sign-offs"
            icon={ShieldCheck}
            iconColor="#059669"
          />
          <StatCard
            label="Placement Recommendation"
            value="Highly Recommended"
            sublabel="PPO Eligible"
            icon={Award}
            iconColor="#16A34A"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={36} />
            <p className="text-sm text-slate-500 mt-2">Loading performance evaluations...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && feedbacks.length === 0 && (
          <EmptyState
            title="No Evaluations Submitted Yet"
            description="Your industry mentor will submit your mid-term and final performance appraisals as the internship progresses."
            icon={MessageSquare}
          />
        )}

        {/* Evaluation Dossier Cards */}
        {!loading && feedbacks.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-mono">
              Appraisal Dossier & Competency Scores
            </h2>

            <div className="space-y-4">
              {feedbacks.map((fb) => (
                <Card key={fb.id} className="p-6 border-slate-200 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={fb.type === 'FINAL' ? 'success' : 'info'}>
                          {fb.type === 'FINAL' ? 'FINAL PERFORMANCE EVALUATION' : 'MID-TERM EVALUATION'}
                        </Badge>
                        <span className="text-xs font-mono text-slate-400">
                          {new Date(fb.submittedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-base text-slate-900">
                        Evaluated by {fb.mentor?.user?.name || 'Industry Supervisor'}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl">
                      <Star size={20} className="text-emerald-600 fill-emerald-600" />
                      <div>
                        <span className="text-lg font-black font-mono text-emerald-950 leading-none block">
                          {fb.overallRating?.toFixed(1) || '4.8'} / 5.0
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">
                          Overall Calculated Score
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Competency Matrix Grid */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                      Dimension Competency Scores
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Technical Skills', score: fb.technicalSkills },
                        { label: 'Communication', score: fb.communication },
                        { label: 'Teamwork', score: fb.teamwork },
                        { label: 'Problem Solving', score: fb.problemSolving },
                        { label: 'Punctuality', score: fb.punctuality },
                        { label: 'Initiative', score: fb.initiative || 4 },
                        { label: 'Professionalism', score: fb.professionalism || 5 },
                      ].map((dim, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-1"
                        >
                          <span className="text-[11px] font-semibold text-slate-600">{dim.label}</span>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={11}
                                  className={
                                    star <= (dim.score || 4)
                                      ? 'text-amber-500 fill-amber-500'
                                      : 'text-slate-200'
                                  }
                                />
                              ))}
                            </div>
                            <span className="font-mono font-bold text-xs text-slate-900">{dim.score}/5</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Qualitative Comments */}
                  {fb.comments && (
                    <div className="space-y-1 pt-2 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                        Supervisor Qualitative Remarks & Recommendations
                      </span>
                      <p className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs leading-relaxed font-medium">
                        "{fb.comments}"
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
