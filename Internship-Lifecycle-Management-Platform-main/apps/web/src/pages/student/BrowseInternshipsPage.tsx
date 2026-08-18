import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useOutletContext, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { VerifiedCompanyBadge } from '@/components/company/VerifiedCompanyBadge';
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
  SlidersHorizontal,
  RotateCcw,
  Calendar,
  Grid,
  List,
  ArrowUpDown,
  ExternalLink,
  ChevronDown,
  AlertCircle,
  X,
  Compass,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

// Skeleton Loading Component
function InternshipCardSkeleton() {
  return (
    <Card className="p-5 border-slate-200 animate-pulse space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 w-3/4">
          <div className="w-11 h-11 rounded-xl bg-slate-200 flex-shrink-0" />
          <div className="space-y-2 w-full">
            <div className="h-4 bg-slate-200 rounded w-2/3" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
          </div>
        </div>
        <div className="h-6 bg-slate-200 rounded-full w-20" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 bg-slate-100 rounded-md w-16" />
        <div className="h-5 bg-slate-100 rounded-md w-20" />
        <div className="h-5 bg-slate-100 rounded-md w-14" />
      </div>
      <div className="h-px bg-slate-100" />
      <div className="flex justify-between items-center pt-1">
        <div className="h-4 bg-slate-200 rounded w-28" />
        <div className="h-8 bg-slate-200 rounded-lg w-24" />
      </div>
    </Card>
  );
}

const DOMAINS = [
  'All',
  'Full Stack',
  'Cloud & DevOps',
  'Data & AI',
  'Cybersecurity',
  'Mobile Development',
  'Frontend',
  'Backend',
  'Embedded Systems',
];

const POPULAR_SKILLS = [
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'Docker',
  'PostgreSQL',
  'AWS',
  'Java',
  'Kubernetes',
  'GraphQL',
];

const LOCATIONS = [
  'All',
  'Pune',
  'Bangalore',
  'Hyderabad',
  'Mumbai',
  'Delhi-NCR',
  'Remote',
];

export default function BrowseInternshipsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // ─── STATE DERIVED FROM URL QUERY PARAMS ──────────────────────────────────
  const searchFromUrl = searchParams.get('search') || '';
  const domainFromUrl = searchParams.get('domain') || 'All';
  const modeFromUrl = searchParams.get('mode') || 'All';
  const locationFromUrl = searchParams.get('location') || 'All';
  const minStipendFromUrl = searchParams.get('minStipend') || '';
  const durationFromUrl = searchParams.get('duration') || 'All';
  const sortFromUrl = searchParams.get('sort') || 'best_match';
  const eligibleOnlyFromUrl = searchParams.get('eligibleOnly') === 'true';
  const skillFromUrl = searchParams.get('skill') || '';

  // Local state for instant inputs
  const [searchInput, setSearchInput] = useState(searchFromUrl);
  const [selectedDomain, setSelectedDomain] = useState(domainFromUrl);
  const [selectedMode, setSelectedMode] = useState(modeFromUrl);
  const [selectedLocation, setSelectedLocation] = useState(locationFromUrl);
  const [minStipend, setMinStipend] = useState(minStipendFromUrl);
  const [selectedDuration, setSelectedDuration] = useState(durationFromUrl);
  const [selectedSort, setSelectedSort] = useState(sortFromUrl);
  const [eligibleOnly, setEligibleOnly] = useState(eligibleOnlyFromUrl);
  const [selectedSkill, setSelectedSkill] = useState(skillFromUrl);

  // Layout & Mobile drawer state
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('ilmp_bookmarked_jobs') || '[]');
    } catch {
      return [];
    }
  });

  // Data & API states
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── URL SYNCHRONIZATION ──────────────────────────────────────────────────
  const syncParamsToUrl = useCallback(
    (params: Record<string, string | boolean | undefined>) => {
      const nextParams = new URLSearchParams(searchParams);
      Object.entries(params).forEach(([key, val]) => {
        if (val === undefined || val === '' || val === 'All' || val === false) {
          nextParams.delete(key);
        } else {
          nextParams.set(key, String(val));
        }
      });
      setSearchParams(nextParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // Debounce search input $\rightarrow$ sync URL
  useEffect(() => {
    const timer = setTimeout(() => {
      syncParamsToUrl({ search: searchInput });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, syncParamsToUrl]);

  // Sync state when URL params change (e.g. Browser Back/Forward)
  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
    setSelectedDomain(searchParams.get('domain') || 'All');
    setSelectedMode(searchParams.get('mode') || 'All');
    setSelectedLocation(searchParams.get('location') || 'All');
    setMinStipend(searchParams.get('minStipend') || '');
    setSelectedDuration(searchParams.get('duration') || 'All');
    setSelectedSort(searchParams.get('sort') || 'best_match');
    setEligibleOnly(searchParams.get('eligibleOnly') === 'true');
    setSelectedSkill(searchParams.get('skill') || '');
  }, [searchParams]);

  // ─── FETCH LISTINGS FROM API ──────────────────────────────────────────────
  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryPayload: any = {
        search: searchFromUrl || undefined,
        domain: domainFromUrl !== 'All' ? domainFromUrl : undefined,
        mode: modeFromUrl !== 'All' ? modeFromUrl : undefined,
        location: locationFromUrl !== 'All' ? locationFromUrl : undefined,
        minStipend: minStipendFromUrl || undefined,
        durationWeeks: durationFromUrl !== 'All' ? durationFromUrl : undefined,
        sort: sortFromUrl,
        eligibleOnly: eligibleOnlyFromUrl ? 'true' : undefined,
        studentId: user?.student?.id || user?.id,
      };

      const res = await api.getListings(queryPayload);
      let data = res.data || [];

      // If specific skill filter is active, filter client-side as well
      if (skillFromUrl) {
        const sLower = skillFromUrl.toLowerCase();
        data = data.filter((item: any) =>
          (item.requiredSkills || '').toLowerCase().includes(sLower)
        );
      }

      setListings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load verified internship postings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [
    searchFromUrl,
    domainFromUrl,
    modeFromUrl,
    locationFromUrl,
    minStipendFromUrl,
    durationFromUrl,
    sortFromUrl,
    eligibleOnlyFromUrl,
    skillFromUrl,
    user,
  ]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Bookmark Toggle
  const toggleBookmark = (id: string, companyName: string) => {
    const updated = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter((x) => x !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(updated);
    localStorage.setItem('ilmp_bookmarked_jobs', JSON.stringify(updated));
    if (updated.includes(id)) {
      toast.success(`Internship saved to your bookmarks`);
    } else {
      toast.info(`Removed from bookmarks`);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchInput('');
    setSelectedDomain('All');
    setSelectedMode('All');
    setSelectedLocation('All');
    setMinStipend('');
    setSelectedDuration('All');
    setSelectedSort('best_match');
    setEligibleOnly(false);
    setSelectedSkill('');
    setSearchParams({}, { replace: true });
  };

  const activeFilterCount = [
    searchFromUrl,
    domainFromUrl !== 'All',
    modeFromUrl !== 'All',
    locationFromUrl !== 'All',
    Boolean(minStipendFromUrl),
    durationFromUrl !== 'All',
    eligibleOnlyFromUrl,
    Boolean(skillFromUrl),
  ].filter(Boolean).length;

  return (
    <div className="min-h-full pb-20 bg-[#F8FAFC]">
      <Header
        title="Explore Verified Internships"
        subtitle="Discover accredited corporate opportunities with AI skill-compatibility scoring and automated eligibility checks"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* ─── SEARCH BAR & TOP QUICK CONTROLS ───────────────────────────────── */}
        <Card className="p-4 sm:p-5 space-y-4 border-slate-200">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Main Search Input */}
            <div className="relative flex-1">
              <Input
                placeholder="Search internships by role, tech stack, company, or domain..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                leftIcon={<Search size={16} className="text-slate-400" />}
                className="w-full text-xs sm:text-sm pl-9 pr-8"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Quick Sort Dropdown */}
            <div className="flex items-center gap-2">
              <div className="w-48">
                <Select
                  value={selectedSort}
                  onChange={(e) => {
                    setSelectedSort(e.target.value);
                    syncParamsToUrl({ sort: e.target.value });
                  }}
                  options={[
                    { label: '✨ Best AI Match', value: 'best_match' },
                    { label: '🕒 Newest First', value: 'newest' },
                    { label: '⏳ Closing Soonest', value: 'deadline' },
                    { label: '💰 Highest Stipend', value: 'stipend' },
                    { label: '📍 Shortest Distance', value: 'distance' },
                  ]}
                />
              </div>

              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsMobileFilterOpen(true)}
                className="md:hidden flex items-center gap-1.5 whitespace-nowrap"
              >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              {/* Desktop Layout Switcher */}
              <div className="hidden lg:flex items-center p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setViewLayout('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewLayout === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Grid View"
                >
                  <Grid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewLayout('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewLayout === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Compact List View"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Domain Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1 flex-shrink-0 mr-1">
              <Compass size={13} />
              <span>Domain:</span>
            </span>
            {DOMAINS.map((dom) => {
              const isActive = selectedDomain === dom;
              return (
                <button
                  key={dom}
                  type="button"
                  onClick={() => {
                    const next = isActive && dom !== 'All' ? 'All' : dom;
                    setSelectedDomain(next);
                    syncParamsToUrl({ domain: next });
                  }}
                  className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dom}
                </button>
              );
            })}
          </div>

          {/* Quick Skills Pills */}
          <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-t border-slate-100 pt-2.5">
            <span className="text-slate-400 font-semibold flex items-center gap-1 flex-shrink-0 mr-1">
              <span>Stack:</span>
            </span>
            {POPULAR_SKILLS.map((sk) => {
              const isActive = selectedSkill === sk;
              return (
                <button
                  key={sk}
                  type="button"
                  onClick={() => {
                    const next = isActive ? '' : sk;
                    setSelectedSkill(next);
                    syncParamsToUrl({ skill: next });
                  }}
                  className={`px-2.5 py-0.5 rounded-md whitespace-nowrap text-[11px] font-mono transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  {sk}
                </button>
              );
            })}
          </div>
        </Card>

        {/* ─── MAIN CONTENT AREA (SIDEBAR + LISTINGS) ────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block md:col-span-1 space-y-5">
            <Card className="p-5 space-y-5 border-slate-200 sticky top-20">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Filter size={14} />
                  <span>Refine Listings</span>
                </span>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-[11px] font-semibold text-rose-600 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw size={11} />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Eligibility Toggle */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-950 select-none">
                  <input
                    type="checkbox"
                    checked={eligibleOnly}
                    onChange={(e) => {
                      setEligibleOnly(e.target.checked);
                      syncParamsToUrl({ eligibleOnly: e.target.checked });
                    }}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Eligible for Me Only</span>
                </label>
                <p className="text-[11px] text-amber-800 leading-tight">
                  Auto-evaluates your CGPA ({user?.student?.cgpa || '8.8'}), branch, & backlogs.
                </p>
              </div>

              {/* Work Mode Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Work Mode</label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-medium">
                  {['All', 'REMOTE', 'HYBRID', 'ONSITE'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setSelectedMode(m);
                        syncParamsToUrl({ mode: m });
                      }}
                      className={`py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                        selectedMode === m
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {m === 'All' ? 'All' : m === 'REMOTE' ? 'Remote' : m === 'HYBRID' ? 'Hybrid' : 'Onsite'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Geographic Location</label>
                <Select
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    syncParamsToUrl({ location: e.target.value });
                  }}
                  options={LOCATIONS.map((loc) => ({ label: loc, value: loc }))}
                />
              </div>

              {/* Minimum Stipend */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Minimum Stipend</label>
                <Select
                  value={minStipend}
                  onChange={(e) => {
                    setMinStipend(e.target.value);
                    syncParamsToUrl({ minStipend: e.target.value });
                  }}
                  options={[
                    { label: 'Any Stipend', value: '' },
                    { label: '₹10,000+ / month', value: '10000' },
                    { label: '₹20,000+ / month', value: '20000' },
                    { label: '₹30,000+ / month', value: '30000' },
                    { label: '₹50,000+ / month', value: '50000' },
                  ]}
                />
              </div>

              {/* Duration Weeks */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Target Duration</label>
                <Select
                  value={selectedDuration}
                  onChange={(e) => {
                    setSelectedDuration(e.target.value);
                    syncParamsToUrl({ duration: e.target.value });
                  }}
                  options={[
                    { label: 'Any Duration', value: 'All' },
                    { label: '8 Weeks (2 Months)', value: '8' },
                    { label: '12 Weeks (3 Months)', value: '12' },
                    { label: '16 Weeks (4 Months)', value: '16' },
                    { label: '24 Weeks (6 Months)', value: '24' },
                  ]}
                />
              </div>
            </Card>
          </div>

          {/* ─── LISTINGS FEED ──────────────────────────────────────────────── */}
          <div className="col-span-1 md:col-span-3 space-y-4">
            {/* Header info / count */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                Showing <strong className="text-slate-900 font-mono">{listings.length}</strong> verified opportunities
              </span>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="font-semibold text-rose-600 hover:underline flex items-center gap-1 md:hidden"
                >
                  <RotateCcw size={12} />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>

            {/* Error State */}
            {error && (
              <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-3">
                <AlertCircle size={32} className="text-rose-600 mx-auto" />
                <h3 className="font-bold text-sm text-rose-950">Unable to load opportunities</h3>
                <p className="text-xs text-rose-800 max-w-md mx-auto">{error}</p>
                <Button variant="outline" size="sm" onClick={fetchListings}>
                  Retry Query
                </Button>
              </div>
            )}

            {/* Skeleton Loading State */}
            {loading && (
              <div className={viewLayout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-3'}>
                {[1, 2, 3, 4].map((n) => (
                  <InternshipCardSkeleton key={n} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && listings.length === 0 && (
              <EmptyState
                title="No Matching Internships Found"
                description="We could not find any active listings matching your combination of filters. Try widening your criteria."
                icon={Briefcase}
                action={
                  <Button size="sm" onClick={handleResetFilters} leftIcon={<RotateCcw size={13} />}>
                    Reset All Filters
                  </Button>
                }
              />
            )}

            {/* Active Listings Grid / List */}
            {!loading && !error && listings.length > 0 && (
              <div
                className={
                  viewLayout === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
                    : 'space-y-3'
                }
              >
                {listings.map((job) => {
                  const skillsArray = (job.requiredSkills || '')
                    .split(',')
                    .map((s: string) => s.trim())
                    .filter(Boolean);
                  const isBookmarked = bookmarkedIds.includes(job.id);
                  const daysLeft = Math.ceil(
                    (new Date(job.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  );

                  return (
                    <Card
                      key={job.id}
                      className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow border-slate-200"
                    >
                      <div className="space-y-3.5">
                        {/* Top Company & Title Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0 font-extrabold text-sm shadow-xs">
                              {(job.company?.name || 'TC').substring(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-sm font-bold text-slate-900 truncate leading-snug">
                                {job.title}
                              </h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-xs font-semibold text-slate-700 truncate">
                                  {job.company?.name}
                                </span>
                                <VerifiedCompanyBadge
                                  isVerified={job.company?.isVerified}
                                  status={job.company?.verificationStatus}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Bookmark Button */}
                          <button
                            type="button"
                            onClick={() => toggleBookmark(job.id, job.company?.name)}
                            className={`p-2 rounded-lg border transition-colors ${
                              isBookmarked
                                ? 'bg-amber-50 border-amber-200 text-amber-600'
                                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                            }`}
                            title={isBookmarked ? 'Remove bookmark' : 'Bookmark internship'}
                          >
                            <Bookmark size={15} className={isBookmarked ? 'fill-amber-500' : ''} />
                          </button>
                        </div>

                        {/* Badges: AI Match & Eligibility */}
                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                          {/* AI Match Badge */}
                          {job.matchScore !== undefined && (
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-bold inline-flex items-center gap-1 border ${
                                job.matchScore >= 80
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : job.matchScore >= 50
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                              title={job.matchExplanation || 'AI Compatibility Score'}
                            >
                              <Sparkles size={11} className="text-purple-600" />
                              <span>{job.matchScore}% Match</span>
                            </span>
                          )}

                          {/* Eligibility Badge */}
                          {job.isEligible ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold inline-flex items-center gap-1">
                              <CheckCircle2 size={11} />
                              <span>Eligible</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                              Min CGPA: {job.minCgpa || 6.0}
                            </span>
                          )}

                          {/* Work Mode Badge */}
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium font-mono text-[10px]">
                            {job.mode}
                          </span>
                        </div>

                        {/* Required Skill Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {skillsArray.slice(0, 4).map((sk: string) => (
                            <span
                              key={sk}
                              className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 font-mono text-[11px]"
                            >
                              {sk}
                            </span>
                          ))}
                          {skillsArray.length > 4 && (
                            <span className="px-1.5 py-0.5 text-slate-400 text-[10px] font-mono">
                              +{skillsArray.length - 4} more
                            </span>
                          )}
                        </div>

                        {/* Core Details Grid */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <IndianRupee size={13} className="text-slate-400" />
                            <span className="font-mono font-bold text-slate-900">
                              ₹{(job.stipend || 0).toLocaleString()}/mo
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={13} className="text-slate-400" />
                            <span>{job.durationWeeks || 12} Weeks</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                            <span className="truncate">{job.location || 'Maharashtra'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-slate-400" />
                            <span className={daysLeft <= 5 ? 'font-bold text-rose-600' : ''}>
                              {daysLeft > 0 ? `${daysLeft} days left` : 'Closes today'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-100 mt-3">
                        <Link to={`/student/internships/${job.id}`} className="w-full">
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full justify-center text-xs"
                            rightIcon={<ChevronRight size={13} />}
                          >
                            View Details & Apply
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── MOBILE DRAWER / BOTTOM SHEET ───────────────────────────────────── */}
      <Modal
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title="Filter & Refine Internships"
        size="md"
      >
        <div className="space-y-4 text-xs">
          {/* Eligibility Toggle */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
            <label className="flex items-center gap-2 font-bold text-amber-950 cursor-pointer">
              <input
                type="checkbox"
                checked={eligibleOnly}
                onChange={(e) => setEligibleOnly(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded"
              />
              <span>Eligible for Me Only</span>
            </label>
            <p className="text-[11px] text-amber-800">Filters according to your CGPA & branch.</p>
          </div>

          {/* Work Mode */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">Work Mode</label>
            <Select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              options={[
                { label: 'All Modes', value: 'All' },
                { label: 'Remote', value: 'REMOTE' },
                { label: 'Hybrid', value: 'HYBRID' },
                { label: 'Onsite', value: 'ONSITE' },
              ]}
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">Location</label>
            <Select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              options={LOCATIONS.map((l) => ({ label: l, value: l }))}
            />
          </div>

          {/* Min Stipend */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">Min Stipend</label>
            <Select
              value={minStipend}
              onChange={(e) => setMinStipend(e.target.value)}
              options={[
                { label: 'Any Stipend', value: '' },
                { label: '₹10,000+ / mo', value: '10000' },
                { label: '₹20,000+ / mo', value: '20000' },
                { label: '₹30,000+ / mo', value: '30000' },
                { label: '₹50,000+ / mo', value: '50000' },
              ]}
            />
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">Duration</label>
            <Select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              options={[
                { label: 'Any Duration', value: 'All' },
                { label: '8 Weeks', value: '8' },
                { label: '12 Weeks', value: '12' },
                { label: '16 Weeks', value: '16' },
                { label: '24 Weeks', value: '24' },
              ]}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleResetFilters();
                setIsMobileFilterOpen(false);
              }}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                syncParamsToUrl({
                  mode: selectedMode,
                  location: selectedLocation,
                  minStipend,
                  duration: selectedDuration,
                  eligibleOnly,
                });
                setIsMobileFilterOpen(false);
              }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
