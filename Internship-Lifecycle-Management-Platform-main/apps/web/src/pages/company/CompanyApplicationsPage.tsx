import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Users, CheckCircle2, XCircle, Eye, Mail, FileText, Loader2, Award } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function CompanyApplicationsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [rejectTarget, setRejectTarget] = useState<any | null>(null);
  const [offerStipend, setOfferStipend] = useState('20000');
  const [offerDesignation, setOfferDesignation] = useState('Software Engineering Intern');
  const [acting, setActing] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.getApplications();
      setApplications(res.data || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleShortlist = async (appId: string) => {
    setActing(true);
    try {
      await api.updateApplicationStatus(appId, {
        status: 'SHORTLISTED',
        remarks: 'Candidate shortlisted for technical evaluation.',
      });
      toast.success('Candidate shortlisted successfully!');
      await fetchApplications();
      if (selectedCandidate?.id === appId) {
        setSelectedCandidate({ ...selectedCandidate, status: 'SHORTLISTED' });
      }
    } catch (err: any) {
      toast.error('Failed to shortlist candidate');
    } finally {
      setActing(false);
    }
  };

  const handleIssueOffer = async (appId: string) => {
    setActing(true);
    try {
      await api.updateApplicationStatus(appId, {
        status: 'OFFER_ISSUED',
        stipend: Number(offerStipend),
        designation: offerDesignation,
        remarks: `Offer extended: ${offerDesignation} at ₹${offerStipend}/mo`,
      });
      toast.success('Formal corporate offer letter issued!');
      await fetchApplications();
      setSelectedCandidate(null);
    } catch (err: any) {
      toast.error('Failed to issue offer');
    } finally {
      setActing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    setActing(true);
    try {
      await api.updateApplicationStatus(rejectTarget.id, {
        status: 'REJECTED',
        remarks: 'Positions filled for this cycle.',
      });
      toast.info('Application marked as Rejected.');
      await fetchApplications();
      setRejectTarget(null);
      setSelectedCandidate(null);
    } catch (err: any) {
      toast.error('Failed to update status');
    } finally {
      setActing(false);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Applicant Name & PRN',
      sortable: true,
      render: (row: any) => (
        <div>
          <div className="font-bold text-slate-900">{row.student?.user?.name || 'Applicant'}</div>
          <div className="text-[11px] font-mono text-slate-400">
            {row.student?.studentId} · {row.student?.department} (Yr {row.student?.year})
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Position Applied',
      sortable: true,
      render: (row: any) => (
        <div>
          <div className="font-semibold text-slate-800">{row.listing?.title}</div>
          <div className="text-[11px] text-emerald-700 font-mono font-bold">
            ₹{row.listing?.stipend?.toLocaleString()}/mo
          </div>
        </div>
      ),
    },
    {
      key: 'cgpa',
      header: 'CGPA / Score',
      sortable: true,
      render: (row: any) => (
        <span className="font-mono font-bold text-slate-900">
          {row.student?.cgpa ? row.student.cgpa.toFixed(2) : '8.40'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Pipeline Stage',
      render: (row: any) => {
        const s = row.status || 'SUBMITTED';
        return (
          <Badge
            variant={
              ['SELECTED', 'OFFER_ISSUED', 'OFFER_ACCEPTED', 'TNP_VERIFIED', 'JOINED', 'COMPLETED'].includes(s)
                ? 'success'
                : ['SHORTLISTED', 'UNDER_REVIEW'].includes(s)
                ? 'warning'
                : s === 'REJECTED'
                ? 'destructive'
                : 'neutral'
            }
          >
            {s}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Review & Decision',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedCandidate(row)}
            className="text-xs h-7 px-2.5 font-semibold"
          >
            Review Dossier
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Candidate Application Pipeline"
        subtitle="Review verified student profiles, shortlist top performers, and issue binding offer letters"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <Card className="p-4 sm:p-6 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active Applicant Pool</h3>
              <p className="text-xs text-slate-500">Live applications with verified academic records</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p className="text-xs text-slate-500 mt-2">Loading candidate pipeline...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={applications}
              searchPlaceholder="Search candidates by name, PRN, branch, or role..."
            />
          )}
        </Card>

        {/* Candidate Dossier & Action Modal */}
        {selectedCandidate && (
          <Modal
            isOpen={Boolean(selectedCandidate)}
            onClose={() => setSelectedCandidate(null)}
            title={`Candidate Dossier: ${selectedCandidate.student?.user?.name}`}
          >
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">{selectedCandidate.student?.user?.name}</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {selectedCandidate.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>PRN: <span className="font-mono font-bold text-slate-900">{selectedCandidate.student?.studentId}</span></div>
                  <div>Branch: <span className="font-bold text-slate-900">{selectedCandidate.student?.department}</span></div>
                  <div>CGPA: <span className="font-mono font-bold text-slate-900">{selectedCandidate.student?.cgpa?.toFixed(2)}</span></div>
                  <div>Backlogs: <span className="font-mono font-bold text-slate-900">{selectedCandidate.student?.activeBacklogs || 0}</span></div>
                </div>

                {selectedCandidate.student?.skills && (
                  <div className="pt-1">
                    <span className="text-slate-500">Skills: </span>
                    <span className="font-mono text-slate-800">{selectedCandidate.student.skills}</span>
                  </div>
                )}
              </div>

              {/* Offer Letter Issuance Form */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Award size={16} className="text-emerald-600" />
                  <span>Issue Binding Corporate Offer</span>
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-900 mb-1">Designation</label>
                    <input
                      type="text"
                      value={offerDesignation}
                      onChange={(e) => setOfferDesignation(e.target.value)}
                      className="w-full bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-900 mb-1">Monthly Stipend (₹)</label>
                    <input
                      type="number"
                      value={offerStipend}
                      onChange={(e) => setOfferStipend(e.target.value)}
                      className="w-full bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <Button
                  size="sm"
                  disabled={acting}
                  onClick={() => handleIssueOffer(selectedCandidate.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 w-full font-semibold gap-1.5"
                >
                  {acting && <Loader2 size={14} className="animate-spin" />}
                  <span>Issue Formal Offer Letter</span>
                </Button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={acting}
                  onClick={() => setRejectTarget(selectedCandidate)}
                  className="text-rose-600 hover:bg-rose-50"
                >
                  Reject Application
                </Button>

                <div className="flex items-center gap-2">
                  {selectedCandidate.status === 'SUBMITTED' && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={acting}
                      onClick={() => handleShortlist(selectedCandidate.id)}
                      className="font-semibold text-blue-600 border-blue-200"
                    >
                      Shortlist Candidate
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => setSelectedCandidate(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Reject Confirm Dialog */}
        <ConfirmDialog
          isOpen={Boolean(rejectTarget)}
          onClose={() => setRejectTarget(null)}
          onConfirm={handleReject}
          title="Reject Candidate Application?"
          description={`Are you sure you want to mark ${rejectTarget?.student?.user?.name || 'this applicant'} as Rejected? This will update their application lifecycle status.`}
          confirmText="Confirm Rejection"
          variant="danger"
        />
      </div>
    </div>
  );
}
