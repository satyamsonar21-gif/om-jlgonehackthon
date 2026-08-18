import React, { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
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
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export default function ApplicationsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};
  const { user } = useAuth();

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [acting, setActing] = useState(false);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const studentId = user?.student?.id || user?.id;
      const res = await api.getApplications({ studentId });
      setApplications(res.data || []);
    } catch {
      // Fallback
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
      toast.success('Corporate offer letter accepted! Awaiting T&P Verification.');
      await fetchApps();
      setSelectedApp(null);
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
        remarks: 'Declined by student.',
      });
      toast.info('Offer declined.');
      await fetchApps();
      setSelectedApp(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to decline offer');
    } finally {
      setActing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SELECTED':
      case 'OFFER_ISSUED':
      case 'OFFER_ACCEPTED':
      case 'TNP_VERIFIED':
      case 'JOINED':
      case 'COMPLETED':
        return 'success';
      case 'SHORTLISTED':
      case 'UNDER_REVIEW':
        return 'warning';
      case 'REJECTED':
        return 'destructive';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="My Applications"
        subtitle="Track submitted internship applications, selection decisions, and corporate offers"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={36} />
            <p className="text-sm text-slate-500 mt-2">Loading applications pipeline...</p>
          </div>
        ) : applications.length === 0 ? (
          <EmptyState
            title="No Applications Yet"
            description="You have not applied for any internships yet. Browse open listings to get started."
            icon={FileText}
            action={
              <Link to="/student/internships">
                <Button size="sm">Browse Listings</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id} className="p-5 border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0">
                      <Building2 size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{app.listing?.title}</h3>
                        <Badge variant={getStatusColor(app.status)}>{app.status}</Badge>
                      </div>
                      <p className="text-xs font-semibold text-slate-600 mt-0.5">{app.listing?.company?.name}</p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar size={12} />
                          <span>Applied: {new Date(app.submittedAt).toLocaleDateString()}</span>
                        </span>
                        <span className="font-mono font-bold text-emerald-700">
                          ₹{app.listing?.stipend?.toLocaleString()}/mo
                        </span>
                        {app.offerLetter && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium text-[10px]">
                            Offer Letter Issued
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {app.status === 'OFFER_ISSUED' && (
                      <Button
                        size="sm"
                        onClick={() => setSelectedApp(app)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold gap-1"
                      >
                        <Award size={14} />
                        <span>Review Offer</span>
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => setSelectedApp(app)} className="text-xs">
                      View Timeline
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Timeline & Offer Action Modal */}
        {selectedApp && (
          <Modal
            isOpen={Boolean(selectedApp)}
            onClose={() => setSelectedApp(null)}
            title={`Application Details: ${selectedApp.listing?.title}`}
          >
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900">{selectedApp.listing?.company?.name}</p>
                  <Badge variant={getStatusColor(selectedApp.status)}>{selectedApp.status}</Badge>
                </div>
                <p className="text-slate-600">Location: {selectedApp.listing?.location || 'Onsite'}</p>
                <p className="font-mono text-emerald-700 font-bold">
                  Stipend: ₹{selectedApp.listing?.stipend?.toLocaleString()}/month
                </p>
              </div>

              {/* Offer Letter Details If Available */}
              {selectedApp.offerLetter && (
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <Award size={16} className="text-emerald-600" />
                      <span>Formal Corporate Offer</span>
                    </span>
                    <Badge variant="success">{selectedApp.offerLetter.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-900">
                    <div>
                      <span className="text-emerald-700">Designation:</span>{' '}
                      <span className="font-bold">{selectedApp.offerLetter.designation}</span>
                    </div>
                    <div>
                      <span className="text-emerald-700">Stipend:</span>{' '}
                      <span className="font-bold">₹{selectedApp.offerLetter.stipend?.toLocaleString()}/mo</span>
                    </div>
                  </div>

                  {selectedApp.status === 'OFFER_ISSUED' && (
                    <div className="flex items-center gap-2 pt-2 border-t border-emerald-200">
                      <Button
                        size="sm"
                        disabled={acting}
                        onClick={() => handleAcceptOffer(selectedApp.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-xs w-full"
                      >
                        {acting ? <Loader2 size={14} className="animate-spin" /> : 'Accept & Proceed to T&P'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={acting}
                        onClick={() => handleRejectOffer(selectedApp.id)}
                        className="text-xs text-rose-600 hover:bg-rose-50"
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Status History Timeline */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Audit History & Timeline</h4>
                <div className="space-y-2 border-l-2 border-slate-200 pl-3 ml-1.5">
                  {selectedApp.statusHistory?.map((hist: any) => (
                    <div key={hist.id} className="relative text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{hist.toStatus}</span>
                        <span className="font-mono text-slate-400">
                          {new Date(hist.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-500">{hist.reason}</p>
                    </div>
                  )) || <p className="text-slate-400">No milestone history logged.</p>}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setSelectedApp(null)}>
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
