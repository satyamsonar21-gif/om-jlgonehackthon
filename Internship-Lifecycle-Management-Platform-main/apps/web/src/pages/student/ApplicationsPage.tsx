import React, { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { VerifiedCompanyBadge } from '@/components/company/VerifiedCompanyBadge';
import { ApplicationTimeline } from '@/components/application/ApplicationTimeline';
import {
  Building2,
  Calendar,
  Clock,
  ArrowRight,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Award,
  ChevronRight,
  ExternalLink,
  PhoneCall,
  Sparkles,
  UserCheck,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export default function ApplicationsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};
  const { user } = useAuth();

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'REVIEW' | 'INTERVIEW' | 'SELECTED' | 'REJECTED'>('ALL');
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [acting, setActing] = useState(false);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const studentId = user?.student?.id || user?.id;
      const res = await api.getApplications({ studentId });
      setApplications(res.data || []);
    } catch {
      // Fallback demo data if offline
      setApplications([
        {
          id: 'app-demo-1',
          status: 'INTERVIEW',
          submittedAt: '2026-03-01T10:00:00.000Z',
          interviewDate: '2026-03-12T14:30:00.000Z',
          companyRemarks: 'Strong full-stack architecture background. Proceeding to live technical interview.',
          listing: {
            title: 'Full Stack Cloud Engineer',
            stipend: 35000,
            durationWeeks: 16,
            location: 'Pune, Maharashtra',
            company: {
              name: 'TechCorp Solutions Inc.',
              isVerified: true,
              verificationStatus: 'VERIFIED',
            },
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [user]);

  const handleAcceptOffer = async (appId: string) => {
    setActing(true);
    try {
      await api.updateApplicationStatus(appId, {
        status: 'OFFER_ACCEPTED',
        remarks: 'Accepted by student on portal.',
      });
      toast.success('Corporate offer letter accepted! Forwarded for final T&P Verification.');
      await fetchApps();
      if (selectedApp?.id === appId) setSelectedApp(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to accept offer');
    } finally {
      setActing(false);
    }
  };

  const handleRejectOffer = async (appId: string) => {
    setActing(true);
    try {
      await api.updateApplicationStatus(appId, {
        status: 'REJECTED',
        remarks: 'Offer declined by candidate.',
      });
      toast.info('Offer declined.');
      await fetchApps();
      if (selectedApp?.id === appId) setSelectedApp(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to decline offer');
    } finally {
      setActing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'SELECTED' || s === 'OFFER_ACCEPTED' || s === 'INTERNSHIP_ACTIVE' || s === 'COMPLETED' || s === 'CERTIFICATE') {
      return <Badge variant="success">{s.replace('_', ' ')}</Badge>;
    }
    if (s === 'SHORTLISTED' || s === 'INTERVIEW' || s === 'OFFER_ISSUED') {
      return <Badge variant="info">{s.replace('_', ' ')}</Badge>;
    }
    if (s === 'FACULTY_REVIEW' || s === 'FACULTY_APPROVED' || s === 'COMPANY_REVIEW' || s === 'UNDER_REVIEW') {
      return <Badge variant="warning">{s.replace('_', ' ')}</Badge>;
    }
    if (s === 'REJECTED') {
      return <Badge variant="destructive">DECLINED</Badge>;
    }
    return <Badge variant="neutral">{s}</Badge>;
  };

  // Filtered Applications
  const filteredApps = applications.filter((app) => {
    const s = (app.status || '').toUpperCase();
    if (activeTab === 'ACTIVE') return !['REJECTED', 'WITHDRAWN', 'CLOSED'].includes(s);
    if (activeTab === 'REVIEW') return ['APPLIED', 'SUBMITTED', 'FACULTY_REVIEW', 'FACULTY_APPROVED', 'COMPANY_REVIEW', 'UNDER_REVIEW'].includes(s);
    if (activeTab === 'INTERVIEW') return ['SHORTLISTED', 'INTERVIEW'].includes(s);
    if (activeTab === 'SELECTED') return ['SELECTED', 'OFFER_ISSUED', 'OFFER_ACCEPTED', 'INTERNSHIP_ACTIVE', 'COMPLETED'].includes(s);
    if (activeTab === 'REJECTED') return s === 'REJECTED';
    return true;
  });

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="My Internship Applications"
        subtitle="Track real-time status progression across faculty review, corporate screening, interviews, and binding offers"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold overflow-x-auto">
          {[
            { id: 'ALL', label: `All Applications (${applications.length})` },
            { id: 'ACTIVE', label: 'Active Pipeline' },
            { id: 'REVIEW', label: 'In Review' },
            { id: 'INTERVIEW', label: 'Shortlist / Interview' },
            { id: 'SELECTED', label: 'Selected & Offers' },
            { id: 'REJECTED', label: 'Declined' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={36} />
            <p className="text-sm text-slate-500 mt-2">Loading applications pipeline...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredApps.length === 0 && (
          <EmptyState
            title="No Applications Found"
            description="You have no applications matching this filter category."
            icon={FileText}
            action={
              <Link to="/internships">
                <Button size="sm">Explore Open Opportunities</Button>
              </Link>
            }
          />
        )}

        {/* Applications List */}
        {!loading && filteredApps.length > 0 && (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <Card key={app.id} className="p-5 sm:p-6 border-slate-200 hover:shadow-md transition-shadow space-y-5">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-sm flex-shrink-0 shadow-xs">
                      {(app.listing?.company?.name || 'TC').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                          {app.listing?.title}
                        </h3>
                        {getStatusBadge(app.status)}
                      </div>

                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-semibold text-slate-700">
                          {app.listing?.company?.name}
                        </span>
                        <VerifiedCompanyBadge
                          isVerified={app.listing?.company?.isVerified}
                          status={app.listing?.company?.verificationStatus}
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar size={12} />
                          <span>Applied: {new Date(app.submittedAt).toLocaleDateString()}</span>
                        </span>
                        <span className="font-mono font-bold text-emerald-700">
                          ₹{(app.listing?.stipend || 0).toLocaleString()}/mo
                        </span>
                        {app.offerLetter && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                            Offer Letter Available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedApp(app)}
                      className="text-xs"
                      rightIcon={<ChevronRight size={13} />}
                    >
                      View Details
                    </Button>
                  </div>
                </div>

                {/* Visual Timeline Component */}
                <div className="pt-3 border-t border-slate-100">
                  <ApplicationTimeline
                    status={app.status}
                    rejectionReason={app.rejectionReason}
                    submittedAt={app.submittedAt}
                    facultyApprovedAt={app.facultyApprovedAt}
                    shortlistedAt={app.shortlistedAt}
                    interviewDate={app.interviewDate}
                    selectedAt={app.selectedAt}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ─── APPLICATION DETAIL MODAL ───────────────────────────────────────── */}
      {selectedApp && (
        <Modal
          isOpen={Boolean(selectedApp)}
          onClose={() => setSelectedApp(null)}
          title="Application Progression Dossier"
          size="lg"
        >
          <div className="space-y-5 text-xs">
            {/* Header identity */}
            <div className="flex items-start justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">{selectedApp.listing?.title}</h3>
                <p className="text-slate-600 font-semibold mt-0.5">{selectedApp.listing?.company?.name}</p>
                <div className="flex items-center gap-3 mt-2 text-slate-500 font-mono text-[11px]">
                  <span>Stipend: ₹{(selectedApp.listing?.stipend || 0).toLocaleString()}/mo</span>
                  <span>•</span>
                  <span>Duration: {selectedApp.listing?.durationWeeks || 12} Weeks</span>
                </div>
              </div>
              {getStatusBadge(selectedApp.status)}
            </div>

            {/* Embedded Timeline */}
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-2">
                Stage Progression
              </span>
              <ApplicationTimeline
                status={selectedApp.status}
                rejectionReason={selectedApp.rejectionReason}
                submittedAt={selectedApp.submittedAt}
                facultyApprovedAt={selectedApp.facultyApprovedAt}
                shortlistedAt={selectedApp.shortlistedAt}
                interviewDate={selectedApp.interviewDate}
                selectedAt={selectedApp.selectedAt}
              />
            </div>

            {/* Remarks / Review Notes */}
            {selectedApp.facultyRemarks && (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-[11px]">
                  <UserCheck size={14} />
                  <span>Faculty Academic Approval Notes</span>
                </span>
                <p className="font-mono text-[11px]">{selectedApp.facultyRemarks}</p>
              </div>
            )}

            {selectedApp.companyRemarks && (
              <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-[11px]">
                  <Building2 size={14} />
                  <span>Corporate Review Feedback</span>
                </span>
                <p className="font-mono text-[11px]">{selectedApp.companyRemarks}</p>
              </div>
            )}

            {/* Offer Letter Action */}
            {selectedApp.offerLetter && selectedApp.offerLetter.status === 'ISSUED' && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-3">
                <span className="font-bold flex items-center gap-1.5 text-xs text-emerald-900">
                  <Sparkles size={16} />
                  <span>Binding Offer Letter Received!</span>
                </span>
                <p className="text-emerald-800 text-[11px]">
                  The company has extended a formal internship offer. Review terms and accept to notify T&P.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="primary"
                    size="sm"
                    loading={acting}
                    onClick={() => handleAcceptOffer(selectedApp.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Accept Corporate Offer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    loading={acting}
                    onClick={() => handleRejectOffer(selectedApp.id)}
                    className="text-rose-700 border-rose-200 hover:bg-rose-50"
                  >
                    Decline Offer
                  </Button>
                </div>
              </div>
            )}

            {/* Footer Close */}
            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button variant="secondary" size="sm" onClick={() => setSelectedApp(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
