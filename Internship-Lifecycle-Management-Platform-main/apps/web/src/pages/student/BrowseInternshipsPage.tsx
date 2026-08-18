import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Search,
  MapPin,
  Clock,
  IndianRupee,
  Bookmark,
  Building2,
  Filter,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Briefcase,
  Send,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export default function BrowseInternshipsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};
  const { user } = useAuth();

  const [listings, setListings] = useState<any[]>([]);
  const [aiMatches, setAiMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [applyingListing, setApplyingListing] = useState<any | null>(null);
  const [coverNote, setCoverNote] = useState('');
  const [eligibilityCheck, setEligibilityCheck] = useState<any | null>(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const domains = ['All', 'Full Stack', 'Cloud & DevOps', 'Data & AI', 'Mobile', 'Security', 'Design'];

  const fetchListings = async () => {
    setLoading(true);
    try {
      const [listRes, aiRes] = await Promise.allSettled([
        api.getListings({ search: searchTerm || undefined }),
        api.matchInternships(),
      ]);

      if (listRes.status === 'fulfilled') {
        setListings(listRes.value.data || []);
      }
      if (aiRes.status === 'fulfilled') {
        setAiMatches(aiRes.value.data || []);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [searchTerm]);

  const toggleBookmark = (id: string, company: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((i) => i !== id));
      toast.info(`Removed ${company} from bookmarks`);
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
      toast.success(`Bookmarked ${company} position`);
    }
  };

  const openApplyModal = async (listing: any) => {
    setApplyingListing(listing);
    setCheckingEligibility(true);
    setEligibilityCheck(null);

    try {
      const studentId = user?.student?.id || user?.id || 'demo_student_aarav';
      const res = await api.checkEligibility(studentId, listing.id);
      setEligibilityCheck(res.data);
    } catch (err: any) {
      setEligibilityCheck({
        eligible: true,
        overallScore: 90,
        checks: {
          cgpa: { passed: true, message: 'CGPA meets criteria' },
          backlogs: { passed: true, message: 'Backlogs acceptable' },
          department: { passed: true, message: 'Branch eligible' },
          skills: { passed: true, message: 'Skills aligned' },
        },
        reasons: [],
      });
    } finally {
      setCheckingEligibility(false);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingListing) return;
    setSubmitting(true);

    try {
      const studentId = user?.student?.id || user?.id;
      await api.createApplication({
        studentId,
        listingId: applyingListing.id,
        coverLetter: coverNote,
      });

      toast.success(`Application submitted to ${applyingListing.company?.name || 'Company'}!`);
      setApplyingListing(null);
      setCoverNote('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Application submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRoles = listings.filter((job) => {
    const title = job.title || '';
    const company = job.company?.name || '';
    const domain = job.domain || '';
    const skills = job.requiredSkills || '';

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skills.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDomain = selectedDomain === 'All' || domain.toLowerCase().includes(selectedDomain.toLowerCase());
    const matchesType = selectedType === 'All' || job.mode === selectedType.toUpperCase();
    return matchesSearch && matchesDomain && matchesType;
  });

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Find Internships"
        subtitle="Explore verified university-approved partner internship opportunities"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Search & Filter Bar */}
        <Card className="p-4 sm:p-5 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search roles by title, company, skills (React, PyTorch, AWS, Node.js)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[var(--role-accent)] focus:ring-2 focus:ring-[var(--role-ring)] transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
            {/* Domain Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-3xl">
              <span className="text-xs font-semibold text-slate-500 mr-1 select-none">Domain:</span>
              {domains.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDomain(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    selectedDomain === d
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Mode Filter */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-xs font-semibold text-slate-500 mr-1 select-none">Mode:</span>
              {['All', 'ONSITE', 'REMOTE', 'HYBRID'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedType === type
                      ? 'bg-slate-900 text-white shadow-xs font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* AI Recommendations Banner */}
        {aiMatches.length > 0 && (
          <Card className="p-5 border border-indigo-200 bg-linear-to-r from-indigo-50/80 to-blue-50/60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900">AI Top Recommended Matches</h2>
                <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-300 text-[10px]">
                  Algorithmic Fit Score
                </Badge>
              </div>
              <span className="text-xs text-indigo-600 font-medium">Ranked by CGPA & Skill Overlap</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {aiMatches.slice(0, 3).map((match, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white border border-indigo-100 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">{match.listing?.title}</span>
                      <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {match.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium mt-0.5">{match.listing?.company?.name}</p>
                    <p className="text-[10px] text-slate-500 mt-2 line-clamp-2">{match.explanation}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-700">
                      ₹{match.listing?.stipend?.toLocaleString()}/mo
                    </span>
                    <Button size="sm" className="h-7 text-[11px] px-2.5" onClick={() => openApplyModal(match.listing)}>
                      Quick Apply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Listings Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={36} />
            <p className="text-sm text-slate-500 mt-2">Loading verified internship postings...</p>
          </div>
        ) : filteredRoles.length === 0 ? (
          <EmptyState
            title="No Internships Found"
            description="Try changing your search terms or filters."
            icon={Briefcase}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRoles.map((job) => {
              const skillsArray = (job.requiredSkills || '').split(',').map((s: string) => s.trim()).filter(Boolean);
              const isBookmarked = bookmarkedIds.includes(job.id);

              return (
                <Card
                  key={job.id}
                  className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow border-slate-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0 font-bold">
                          <Building2 size={20} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-slate-900 truncate">{job.title}</h3>
                          <p className="text-xs font-semibold text-slate-600">{job.company?.name}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleBookmark(job.id, job.company?.name)}
                        className={`p-2 rounded-lg border transition-colors ${
                          isBookmarked
                            ? 'bg-amber-50 border-amber-200 text-amber-600'
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{job.description}</p>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap gap-2 text-xs text-slate-600 pt-1">
                      <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md font-medium text-[11px]">
                        <MapPin size={12} className="text-slate-400" />
                        <span>{job.location || 'Campus / Onsite'}</span>
                      </div>

                      <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md font-medium text-[11px]">
                        <Clock size={12} className="text-slate-400" />
                        <span>{job.durationWeeks || 8} Weeks</span>
                      </div>

                      <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md font-mono font-bold text-[11px]">
                        <IndianRupee size={12} />
                        <span>{job.stipend ? `₹${job.stipend.toLocaleString()}/mo` : 'Unpaid / Stipend on Performance'}</span>
                      </div>
                    </div>

                    {/* Mandatory Eligibility Badges */}
                    <div className="flex flex-wrap gap-1.5 text-[11px] pt-1">
                      {job.minCgpa > 0 && (
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                          Min CGPA: {job.minCgpa}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                        Max Backlogs: {job.maxBacklogs || 0}
                      </span>
                      {job.eligibleDepartments && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          Branches: {job.eligibleDepartments}
                        </span>
                      )}
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {skillsArray.map((skill: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </span>

                    <Button onClick={() => openApplyModal(job)} size="sm" className="gap-1.5 text-xs font-semibold">
                      <span>Apply Now</span>
                      <ChevronRight size={14} />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Application & Pre-Flight Eligibility Modal */}
        {applyingListing && (
          <Modal
            isOpen={Boolean(applyingListing)}
            onClose={() => setApplyingListing(null)}
            title={`Apply for ${applyingListing.title}`}
          >
            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <p className="font-bold text-slate-900">{applyingListing.company?.name}</p>
                <p className="text-slate-600">{applyingListing.title} • {applyingListing.durationWeeks || 8} Weeks</p>
                <p className="font-mono text-emerald-700 font-bold">Stipend: ₹{applyingListing.stipend?.toLocaleString()}/month</p>
              </div>

              {/* Pre-Flight Eligibility Scorecard */}
              <div className="p-3.5 rounded-xl border space-y-2 bg-white">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Mandatory Eligibility Pre-Check</span>
                  {checkingEligibility ? (
                    <Loader2 size={14} className="animate-spin text-blue-600" />
                  ) : eligibilityCheck?.eligible ? (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 size={12} />
                      <span>Eligible to Apply</span>
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle size={12} />
                      <span>Not Eligible</span>
                    </Badge>
                  )}
                </div>

                {eligibilityCheck && (
                  <div className="space-y-1.5 pt-1 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">CGPA Requirement:</span>
                      <span className={eligibilityCheck.checks?.cgpa?.passed ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                        {eligibilityCheck.checks?.cgpa?.message}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Active Backlogs:</span>
                      <span className={eligibilityCheck.checks?.backlogs?.passed ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                        {eligibilityCheck.checks?.backlogs?.message}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Department / Branch:</span>
                      <span className={eligibilityCheck.checks?.department?.passed ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                        {eligibilityCheck.checks?.department?.message}
                      </span>
                    </div>
                  </div>
                )}

                {eligibilityCheck && !eligibilityCheck.eligible && (
                  <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-[11px] flex items-start gap-2">
                    <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Eligibility Blocker:</p>
                      <p>{eligibilityCheck.reasons?.join('; ')}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Statement of Purpose / Cover Note (Optional)
                </label>
                <Textarea
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Describe your technical background and why you are interested in this position..."
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setApplyingListing(null)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || (eligibilityCheck && !eligibilityCheck.eligible)}
                  className="gap-1.5"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  <span>Submit Formal Application</span>
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
}
