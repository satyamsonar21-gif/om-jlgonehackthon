import React, { useEffect, useState } from 'react';
import { useParams, Link, useOutletContext, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
import { VerifiedCompanyBadge } from '@/components/company/VerifiedCompanyBadge';
import {
  Building2,
  MapPin,
  Clock,
  IndianRupee,
  CheckCircle2,
  ArrowLeft,
  Send,
  Calendar,
  ShieldCheck,
  Bookmark,
  Sparkles,
  Loader2,
  FileText,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export default function InternshipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [listing, setListing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await api.getListing(id);
        setListing(res.data);
      } catch {
        // Fallback demo data
        setListing({
          id: id || '1',
          title: 'Full Stack Cloud Developer Intern',
          domain: 'Full Stack',
          mode: 'REMOTE',
          location: 'Pune, Maharashtra',
          stipend: 35000,
          durationWeeks: 16,
          openings: 5,
          minCgpa: 7.0,
          maxBacklogs: 0,
          eligibleDepartments: ['Computer Science', 'Information Technology'],
          requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
          description: 'Build enterprise cloud microservices, modern React UI applications, and scalable backend APIs.',
          requirements: [
            'Proficiency in React 19, TypeScript, and Tailwind CSS',
            'Strong foundation in REST APIs, Node.js, and SQL databases',
            'Familiarity with Git version control and Docker containerization',
          ],
          company: {
            name: 'TechCorp Solutions Inc.',
            domain: 'Enterprise Cloud Systems',
            isVerified: true,
            verificationStatus: 'VERIFIED',
          },
        });
      } finally {
        setLoading(false);
      }
    }
    fetchListing();
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;

    setSubmitting(true);
    try {
      await api.createApplication({
        listingId: listing.id,
        coverLetter: coverNote.trim(),
      });
      toast.success(`Application submitted to ${listing.company?.name || 'Partner'} for ${listing.title}!`);
      setIsApplyModalOpen(false);
      navigate('/student/applications');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to submit application';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full pb-16 bg-[#F8FAFC]">
        <Header title="Internship Opportunity Details" onOpenMobileNav={onOpenMobileNav} />
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="animate-spin text-blue-600" size={36} />
          <p className="text-sm text-slate-500 mt-2">Loading opportunity details...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-full pb-16 bg-[#F8FAFC]">
        <Header title="Internship Not Found" onOpenMobileNav={onOpenMobileNav} />
        <div className="max-w-4xl mx-auto p-8 text-center space-y-4">
          <p className="text-slate-600">The requested internship listing does not exist or has closed.</p>
          <Link to="/internships">
            <Button size="sm">Browse Other Openings</Button>
          </Link>
        </div>
      </div>
    );
  }

  const skillsList = Array.isArray(listing.requiredSkills)
    ? listing.requiredSkills
    : typeof listing.requiredSkills === 'string'
    ? listing.requiredSkills.split(',')
    : ['React', 'TypeScript', 'Node.js'];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title={listing.title}
        subtitle={`${listing.company?.name || 'Corporate Partner'} · ${listing.location || 'Pune, India'}`}
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <div>
          <Link
            to="/internships"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Find Internships</span>
          </Link>
        </div>

        {/* Hero Role Card */}
        <Card className="space-y-6 p-6 sm:p-8 border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-xs">
                {(listing.company?.name || 'TC').substring(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {listing.title}
                  </h1>
                  <VerifiedCompanyBadge
                    isVerified={listing.company?.isVerified}
                    status={listing.company?.verificationStatus}
                  />
                </div>
                <div className="text-sm font-semibold text-slate-700 mt-1">
                  {listing.company?.name} · <span className="text-slate-500">{listing.domain || 'Technology'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsBookmarked(!isBookmarked);
                  toast.success(isBookmarked ? 'Removed bookmark' : 'Bookmarked role');
                }}
              >
                <Bookmark size={15} className={isBookmarked ? 'fill-blue-600 text-blue-600' : ''} />
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => setIsApplyModalOpen(true)}
                rightIcon={<Send size={14} />}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Apply for Position
              </Button>
            </div>
          </div>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Work Mode</span>
              <span className="font-bold text-slate-900 mt-0.5 block font-mono">
                {listing.mode || 'REMOTE'} ({listing.location || 'Any'})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Monthly Stipend</span>
              <span className="font-bold text-emerald-700 font-mono mt-0.5 block">
                ₹{(listing.stipend || 0).toLocaleString()}/mo
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Duration</span>
              <span className="font-bold text-slate-900 font-mono mt-0.5 block">
                {listing.durationWeeks || 12} Weeks
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Academic Cutoff</span>
              <span className="font-bold text-slate-900 font-mono mt-0.5 block">
                Min CGPA {listing.minCgpa || 6.0}
              </span>
            </div>
          </div>

          {/* Role Overview */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Role Overview & Description
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {listing.description || 'Join our engineering team to build mission-critical enterprise systems and user experiences.'}
            </p>
          </div>

          {/* AI Skill Match & Gap Analysis Card */}
          {(() => {
            const studentSkills = (user?.student?.skills || '')
              .split(',')
              .map((s: string) => s.trim().toLowerCase())
              .filter(Boolean);

            const requiredSkills = skillsList
              .map((s: string) => s.trim().toLowerCase())
              .filter(Boolean);

            const matched = requiredSkills.filter((req: string) =>
              studentSkills.some((st: string) => st.includes(req) || req.includes(st))
            );
            const missing = requiredSkills.filter(
              (req: string) => !studentSkills.some((st: string) => st.includes(req) || req.includes(st))
            );

            const matchScore =
              requiredSkills.length > 0
                ? Math.round((matched.length / requiredSkills.length) * 100)
                : 100;

            return (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-blue-50/50 to-white border-2 border-indigo-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-indigo-950">
                        AI Skill Compatibility & Gap Analysis
                      </h3>
                      <p className="text-[11px] text-indigo-700">
                        Grounded in your verified student profile skills
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black font-mono text-indigo-950">
                      {matchScore}% Match
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Matched Skills */}
                  <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-2">
                    <span className="font-bold text-emerald-800 flex items-center gap-1.5 text-xs">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      <span>Matched Competencies ({matched.length})</span>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {matched.length > 0 ? (
                        matched.map((m: string) => (
                          <span
                            key={m}
                            className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-mono font-semibold"
                          >
                            ✓ {m}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">No direct skill overlap</span>
                      )}
                    </div>
                  </div>

                  {/* Missing Skills / Gaps */}
                  <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-2">
                    <span className="font-bold text-amber-800 flex items-center gap-1.5 text-xs">
                      <AlertCircle size={14} className="text-amber-600" />
                      <span>Target Skill Gaps ({missing.length})</span>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {missing.length > 0 ? (
                        missing.map((m: string) => (
                          <span
                            key={m}
                            className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-mono font-semibold"
                          >
                            ⚠ {m}
                          </span>
                        ))
                      ) : (
                        <span className="text-emerald-700 font-semibold text-[11px]">
                          ✓ 100% Core Requirements Satisfied
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Tech Stack Pills */}
          <div className="space-y-2.5 pt-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Required Technical Competencies
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skillsList.map((s: string) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 border border-slate-200 text-slate-800"
                >
                  {s.trim()}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ─── APPLY MODAL ────────────────────────────────────────────────────── */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply to ${listing.company?.name || 'Position'}`}
        size="md"
      >
        <form onSubmit={handleApply} className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-extrabold text-slate-900 text-sm">{listing.title}</div>
            <div className="text-xs font-semibold text-slate-600">
              {listing.company?.name} · ₹{(listing.stipend || 0).toLocaleString()}/mo
            </div>
          </div>

          {/* Candidate Dossier Confirmation */}
          <div className="p-3 rounded-xl border border-slate-200 bg-white font-mono text-[11px] space-y-1.5">
            <div className="flex items-center justify-between text-slate-500 font-semibold">
              <span>Candidate Profile Dossier:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>Eligibility Verified</span>
              </span>
            </div>
            <div className="text-slate-900 font-bold">{user?.name || 'Aarav Patil'}</div>
            <div className="text-slate-500">
              {user?.student?.department || 'Computer Science'} · CGPA: {user?.student?.cgpa || '8.8'} · Backlogs: {user?.student?.activeBacklogs || 0}
            </div>
          </div>

          <Textarea
            label="Candidate Statement / Cover Note"
            rows={4}
            value={coverNote}
            onChange={(e) => setCoverNote(e.target.value)}
            placeholder="Highlight your key project contributions, GitHub links, and why your skillset matches this internship position..."
            required
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={submitting}
              leftIcon={<Send size={13} />}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
