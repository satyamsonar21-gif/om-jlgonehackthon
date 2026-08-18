import React, { useState } from 'react';
import { useParams, Link, useOutletContext, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
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
  Share2
} from 'lucide-react';
import { demoInternships } from '@/data/demo';
import { toast } from 'sonner';

export default function InternshipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const internshipId = parseInt(id || '1', 10);
  const job = demoInternships.find((i) => i.id === internshipId) || demoInternships[0];

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Application submitted to ${job.company} for ${job.role}!`);
    setIsApplyModalOpen(false);
    navigate('/student/applications');
  };

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title={job.role}
        subtitle={`${job.company} · ${job.location}`}
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <div>
          <Link
            to="/student/internships"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Find Internships</span>
          </Link>
        </div>

        {/* Hero Role Card */}
        <Card className="space-y-6 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-xs">
                {job.company.substring(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {job.role}
                  </h1>
                  <Badge variant="success" size="sm">
                    Verified Partner
                  </Badge>
                </div>
                <div className="text-sm font-semibold text-amber-700 mt-1">{job.company}</div>
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
                <Bookmark size={15} className={isBookmarked ? 'fill-amber-600 text-amber-600' : ''} />
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => setIsApplyModalOpen(true)}
                rightIcon={<Send size={14} />}
              >
                Apply Now
              </Button>
            </div>
          </div>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Location</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{job.location} ({job.type})</span>
            </div>
            <div>
              <span className="text-slate-500 block">Stipend</span>
              <span className="font-bold text-slate-900 font-mono mt-0.5 block">{job.stipend}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Duration</span>
              <span className="font-bold text-slate-900 font-mono mt-0.5 block">{job.duration}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Openings</span>
              <span className="font-bold text-slate-900 font-mono mt-0.5 block">{job.openings} Positions</span>
            </div>
          </div>

          {/* Role Overview */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Role Overview & Description
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">{job.description}</p>
          </div>

          {/* Key Requirements */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Requirements & Qualifications
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Skills */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Tech Stack & Domain Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-slate-100 border border-slate-200 text-slate-800"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply to ${job.company}`}
        size="md"
      >
        <form onSubmit={handleApply} className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 text-sm">{job.role}</div>
            <div className="text-xs font-semibold text-amber-700">
              {job.company} · {job.stipend}
            </div>
          </div>

          <div className="p-3 rounded-xl border border-slate-100 bg-white font-mono text-[11px] space-y-1">
            <span className="text-slate-500 font-semibold block">Applicant:</span>
            <div className="text-slate-800 font-bold">Priya Sharma (PRN: 20CS101)</div>
            <div className="text-slate-500">CGPA: 8.9 · Dept. of Computer Science & Engineering</div>
          </div>

          <Textarea
            label="Candidate Statement / Cover Note"
            rows={4}
            value={coverNote}
            onChange={(e) => setCoverNote(e.target.value)}
            placeholder="Describe your technical deliverables, past project GitHub repos, and why you are interested in this position..."
            required
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" leftIcon={<Send size={13} />}>
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
