import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Input, Textarea } from '@/components/ui/Input';
import { VerifiedCompanyBadge } from '@/components/company/VerifiedCompanyBadge';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Globe,
  Mail,
  Phone,
  MapPin,
  FileText,
  Search,
  ExternalLink,
  ShieldAlert,
  Users,
  Briefcase,
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminCompaniesPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'QUEUE' | 'VERIFIED' | 'SUSPENDED'>('ALL');
  const [search, setSearch] = useState('');

  // Selected company for detailed dossier review
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [acting, setActing] = useState(false);

  // Dialog states
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState('');

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await api.getCompanies();
      setCompanies(res.data || []);
    } catch {
      // Fallback demo data
      setCompanies([
        {
          id: 'comp-1',
          name: 'TechCorp Solutions Inc.',
          domain: 'Cloud Infrastructure & AI',
          industry: 'Software & Technology',
          location: 'Bangalore, Karnataka',
          website: 'https://techcorp.io',
          contactPerson: 'Vikram Nair',
          contactEmail: 'mentor@techcorp.com',
          contactPhone: '+91 (080) 4123-4567',
          description: 'Provider of automated cloud microservices and scalable devops tooling.',
          isVerified: true,
          verificationStatus: 'VERIFIED',
          verifiedAt: '2025-08-15T10:30:00.000Z',
          _count: { listings: 4, internships: 16 },
        },
        {
          id: 'comp-2',
          name: 'InnovateAI Labs',
          domain: 'Machine Learning & GenAI',
          industry: 'Artificial Intelligence',
          location: 'Pune, Maharashtra',
          website: 'https://innovateai.tech',
          contactPerson: 'Dr. Shruti Sen',
          contactEmail: 'partnerships@innovateai.tech',
          contactPhone: '+91 (020) 2567-8901',
          description: 'Cutting edge generative AI research and enterprise model fine-tuning.',
          isVerified: false,
          verificationStatus: 'UNDER_REVIEW',
          _count: { listings: 2, internships: 0 },
        },
        {
          id: 'comp-3',
          name: 'CyberShield InfoSec Pvt Ltd',
          domain: 'Cybersecurity & SOC',
          industry: 'Information Security',
          location: 'Hyderabad, Telangana',
          website: 'https://cybershield.security',
          contactPerson: 'Anand Roy',
          contactEmail: 'recruitment@cybershield.security',
          contactPhone: '+91 (040) 6789-0123',
          description: 'Managed detection and response, SOC 2 compliance, and zero trust security.',
          isVerified: false,
          verificationStatus: 'PENDING',
          _count: { listings: 1, internships: 0 },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleVerify = async (companyId: string, status: 'VERIFIED' | 'UNDER_REVIEW') => {
    setActing(true);
    try {
      await api.verifyCompany(companyId, {
        status,
        remarks: `Company verification ${status === 'VERIFIED' ? 'approved' : 'moved to under review'} by T&P Administration.`,
      });
      toast.success(`Company status updated to ${status}`);
      await fetchCompanies();
      if (selectedCompany?.id === companyId) {
        setSelectedCompany({
          ...selectedCompany,
          verificationStatus: status,
          isVerified: status === 'VERIFIED',
        });
      }
    } catch {
      toast.error('Failed to update company verification status');
    } finally {
      setActing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please specify a formal rejection reason');
      return;
    }
    setActing(true);
    try {
      await api.verifyCompany(selectedCompany.id, {
        status: 'REJECTED',
        remarks: rejectionReason.trim(),
      });
      toast.info('Company registration rejected');
      setIsRejectModalOpen(false);
      setRejectionReason('');
      await fetchCompanies();
      setSelectedCompany(null);
    } catch {
      toast.error('Failed to submit rejection decision');
    } finally {
      setActing(false);
    }
  };

  const handleSuspend = async () => {
    if (!suspensionReason.trim()) {
      toast.error('Please specify a suspension rationale');
      return;
    }
    setActing(true);
    try {
      await api.verifyCompany(selectedCompany.id, {
        status: 'SUSPENDED',
        remarks: suspensionReason.trim(),
      });
      toast.warning('Corporate partner accreditation suspended');
      setIsSuspendModalOpen(false);
      setSuspensionReason('');
      await fetchCompanies();
      setSelectedCompany(null);
    } catch {
      toast.error('Failed to suspend partner accreditation');
    } finally {
      setActing(false);
    }
  };

  // Filtered List
  const filteredCompanies = companies.filter((c) => {
    const status = (c.verificationStatus || (c.isVerified ? 'VERIFIED' : 'PENDING')).toUpperCase();
    if (activeFilter === 'QUEUE' && status !== 'PENDING' && status !== 'UNDER_REVIEW') return false;
    if (activeFilter === 'VERIFIED' && status !== 'VERIFIED') return false;
    if (activeFilter === 'SUSPENDED' && status !== 'SUSPENDED' && status !== 'REJECTED') return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.domain && c.domain.toLowerCase().includes(q)) ||
        (c.contactPerson && c.contactPerson.toLowerCase().includes(q)) ||
        (c.contactEmail && c.contactEmail.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // KPI Metrics
  const totalCount = companies.length;
  const queueCount = companies.filter((c) => c.verificationStatus === 'PENDING' || c.verificationStatus === 'UNDER_REVIEW' || !c.isVerified).length;
  const verifiedCount = companies.filter((c) => c.isVerified || c.verificationStatus === 'VERIFIED').length;
  const suspendedCount = companies.filter((c) => c.verificationStatus === 'SUSPENDED' || c.verificationStatus === 'REJECTED').length;

  const columns = [
    {
      key: 'name',
      header: 'Partner Organization',
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
            {row.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-slate-900">{row.name}</div>
            <div className="text-[11px] text-slate-500">{row.domain || 'Technology'} · {row.location || 'India'}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Point of Contact',
      render: (row: any) => (
        <div>
          <div className="font-semibold text-slate-800">{row.contactPerson || 'HR Supervisor'}</div>
          <div className="text-[11px] font-mono text-slate-400">{row.contactEmail}</div>
        </div>
      ),
    },
    {
      key: 'metrics',
      header: 'Campus Activity',
      render: (row: any) => (
        <div className="text-xs text-slate-600 space-y-0.5">
          <span className="font-semibold font-mono text-slate-900 block">
            {row._count?.listings || 0} Openings
          </span>
          <span className="text-[11px] text-slate-400">
            {row._count?.internships || 0} Enrolled Interns
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Verification Status',
      render: (row: any) => (
        <VerifiedCompanyBadge
          isVerified={row.isVerified}
          status={row.verificationStatus}
          showUnverifiedNotice={true}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      render: (row: any) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedCompany(row)}
          className="text-xs"
        >
          Review Dossier
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Corporate Partner Governance & Verification"
        subtitle="Review institutional registration dossiers, accredit partner companies, and enforce MoU compliance"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* ─── SUMMARY KPI TILES ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Total Partner Network</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{totalCount}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Building2 size={20} />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Verification Queue</span>
              <span className="text-2xl font-extrabold text-amber-600 mt-1 block">{queueCount}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
              <Clock size={20} />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Accredited Partners</span>
              <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">{verifiedCount}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 size={20} />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Suspended / Rejected</span>
              <span className="text-2xl font-extrabold text-rose-600 mt-1 block">{suspendedCount}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center font-bold">
              <AlertTriangle size={20} />
            </div>
          </Card>
        </div>

        {/* ─── MAIN DIRECTORY & QUEUE CARD ──────────────────────────────────── */}
        <Card className="p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Organizations ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('QUEUE')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeFilter === 'QUEUE' ? 'bg-white text-amber-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Verification Queue</span>
                {queueCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-mono text-[10px]">
                    {queueCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('VERIFIED')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeFilter === 'VERIFIED' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Verified Partners ({verifiedCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('SUSPENDED')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeFilter === 'SUSPENDED' ? 'bg-white text-rose-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Suspended ({suspendedCount})
              </button>
            </div>

            {/* Search Input */}
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search by name, domain, contact..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search size={14} />}
              />
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredCompanies}
            loading={loading}
            emptyTitle="No Partner Organizations Found"
            emptyDescription="No partner organizations matching your active filter criteria."
          />
        </Card>
      </div>

      {/* ─── REVIEW DOSSIER MODAL ───────────────────────────────────────────── */}
      {selectedCompany && (
        <Modal
          isOpen={Boolean(selectedCompany)}
          onClose={() => setSelectedCompany(null)}
          title="Corporate Partner Accreditation Dossier"
          size="lg"
        >
          <div className="space-y-5 text-xs">
            {/* Top Company Identity Header */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                  {selectedCompany.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">{selectedCompany.name}</h3>
                  <p className="text-slate-500 font-medium">{selectedCompany.domain || 'Technology & Systems'}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{selectedCompany.location}</p>
                </div>
              </div>
              <VerifiedCompanyBadge
                isVerified={selectedCompany.isVerified}
                status={selectedCompany.verificationStatus}
                size="md"
              />
            </div>

            {/* Overview / Description */}
            <div className="space-y-1">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Organization Overview
              </span>
              <p className="p-3 rounded-lg bg-white border border-slate-200 text-slate-600 leading-relaxed">
                {selectedCompany.description || 'No corporate description provided upon registration.'}
              </p>
            </div>

            {/* Point of Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium block">Lead Supervisor Contact</span>
                <span className="font-bold text-slate-900 block">{selectedCompany.contactPerson || 'Not Provided'}</span>
                <span className="font-mono text-slate-600 text-[11px] block">{selectedCompany.contactEmail}</span>
                {selectedCompany.contactPhone && (
                  <span className="text-slate-500 text-[11px] block">{selectedCompany.contactPhone}</span>
                )}
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium block">Web Presence & Industry</span>
                <span className="font-bold text-slate-900 block">{selectedCompany.industry || 'Information Technology'}</span>
                {selectedCompany.website ? (
                  <a
                    href={selectedCompany.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-blue-600 hover:underline inline-flex items-center gap-1 text-[11px]"
                  >
                    <Globe size={12} />
                    <span>{selectedCompany.website}</span>
                  </a>
                ) : (
                  <span className="text-slate-400 text-[11px]">No website listed</span>
                )}
              </div>
            </div>

            {/* Previous Verification Notes */}
            {selectedCompany.verificationRemarks && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                <span className="font-bold block text-[11px]">Institutional Review History</span>
                <p className="text-[11px] font-mono">{selectedCompany.verificationRemarks}</p>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRejectModalOpen(true)}
                  className="text-rose-700 hover:bg-rose-50 border-rose-200"
                >
                  Reject Registration
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSuspendModalOpen(true)}
                  className="text-slate-700"
                >
                  Suspend MoU
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {selectedCompany.verificationStatus !== 'UNDER_REVIEW' && (
                  <Button
                    variant="outline"
                    size="sm"
                    loading={acting}
                    onClick={() => handleVerify(selectedCompany.id, 'UNDER_REVIEW')}
                  >
                    Mark Under Review
                  </Button>
                )}

                <Button
                  variant="primary"
                  size="sm"
                  loading={acting}
                  onClick={() => handleVerify(selectedCompany.id, 'VERIFIED')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  leftIcon={<ShieldCheck size={14} />}
                >
                  Approve & Accredit Partner
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ─── REJECTION DIALOG ──────────────────────────────────────────────── */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject Corporate Registration"
        size="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Specify the institutional rejection reason. This will be transmitted to the company contact and recorded in the audit registry.
          </p>

          <Textarea
            label="Formal Rejection Reason"
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g. Incomplete corporate GST/CIN documentation, domain mismatch..."
            required
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 text-white"
              loading={acting}
              onClick={handleReject}
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>

      {/* ─── SUSPENSION DIALOG ─────────────────────────────────────────────── */}
      <Modal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        title="Suspend Corporate Partner MoU"
        size="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Suspending an organization immediately de-activates their published listings and pauses intern onboarding permissions.
          </p>

          <Textarea
            label="Suspension Rationale"
            rows={3}
            value={suspensionReason}
            onChange={(e) => setSuspensionReason(e.target.value)}
            placeholder="e.g. Compliance dispute, student stipend delay under inquiry..."
            required
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsSuspendModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 text-white"
              loading={acting}
              onClick={handleSuspend}
            >
              Confirm Suspension
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
