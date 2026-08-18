import React, { useState } from 'react';
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
  Briefcase,
  X,
  Send,
  BookmarkCheck
} from 'lucide-react';
import { demoInternships, InternshipListing } from '@/data/demo';
import { toast } from 'sonner';

export default function BrowseInternshipsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([1, 4, 7]);
  const [applyingRole, setApplyingRole] = useState<InternshipListing | null>(null);
  const [coverNote, setCoverNote] = useState('');

  const domains = ['All', 'Software', 'Data & AI', 'Cloud & DevOps', 'Design', 'Security', 'Mobile'];

  const filteredRoles = demoInternships.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDomain = selectedDomain === 'All' || job.domain === selectedDomain;
    const matchesType = selectedType === 'All' || job.type === selectedType;
    return matchesSearch && matchesDomain && matchesType;
  });

  const toggleBookmark = (id: number, company: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((i) => i !== id));
      toast.info(`Removed ${company} from bookmarks`);
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
      toast.success(`Bookmarked ${company} role`);
    }
  };

  const handleQuickApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingRole) return;
    toast.success(`Application submitted to ${applyingRole.company} for ${applyingRole.role}!`);
    setApplyingRole(null);
    setCoverNote('');
  };

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
              placeholder="Search roles by title, company, skills (React, PyTorch, AWS, Figma)..."
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
                      ? 'bg-[var(--role-accent)] text-white shadow-xs font-bold'
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
              {['All', 'Remote', 'Hybrid', 'On-site'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    selectedType === type
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
          <span><strong>{filteredRoles.length}</strong> verified partner listings available</span>
          <span>Academic Term 2026</span>
        </div>

        {/* Internships Grid */}
        {filteredRoles.length === 0 ? (
          <EmptyState
            title="No internships match your search"
            description="Try adjusting your keywords or clearing the domain filters."
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDomain('All');
                  setSelectedType('All');
                }}
              >
                Clear All Filters
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRoles.map((job) => {
              const isBookmarked = bookmarkedIds.includes(job.id);

              return (
                <Card
                  key={job.id}
                  hover={true}
                  className="flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {job.company.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 leading-snug">
                            {job.role}
                          </h3>
                          <span className="text-xs text-amber-700 font-semibold block mt-0.5">
                            {job.company}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleBookmark(job.id, job.company)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                        aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark role'}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck size={18} className="text-amber-600 fill-amber-600" />
                        ) : (
                          <Bookmark size={18} />
                        )}
                      </button>
                    </div>

                    <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                        <span>{job.location} ({job.type})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={13} className="text-slate-400 flex-shrink-0" />
                        <span>{job.duration} · {job.openings} Openings</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono font-bold text-slate-900">
                        <IndianRupee size={13} className="text-slate-400 flex-shrink-0" />
                        <span>{job.stipend}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.skills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-50 border border-slate-200 text-slate-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <Link
                      to={`/student/internships/${job.id}`}
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        Details
                      </Button>
                    </Link>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setApplyingRole(job)}
                    >
                      Quick Apply
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Apply Modal */}
      <Modal
        isOpen={!!applyingRole}
        onClose={() => setApplyingRole(null)}
        title="Apply for Internship"
        size="md"
      >
        {applyingRole && (
          <form onSubmit={handleQuickApply} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 text-sm">{applyingRole.role}</div>
              <div className="text-xs font-semibold text-amber-700">
                {applyingRole.company} · {applyingRole.stipend} ({applyingRole.location})
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 bg-white space-y-1 font-mono text-[11px]">
              <span className="text-slate-500 block font-semibold">Applicant Profile:</span>
              <div className="text-slate-800 font-bold">Priya Sharma (PRN: 20CS101)</div>
              <div className="text-slate-600">3rd Year B.Tech Computer Science · CGPA: 8.9</div>
            </div>

            <Textarea
              label="Candidate Pitch / Note"
              rows={4}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="Highlight your relevant project experience, GitHub repositories, and availability..."
              required
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="secondary" size="sm" onClick={() => setApplyingRole(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" leftIcon={<Send size={13} />}>
                Submit Application
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
