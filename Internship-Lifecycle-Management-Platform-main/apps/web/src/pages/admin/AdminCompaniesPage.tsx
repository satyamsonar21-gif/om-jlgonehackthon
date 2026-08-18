import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Building2, ShieldCheck, Plus, CheckCircle2, Loader2, Globe, Mail } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminCompaniesPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [acting, setActing] = useState(false);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await api.getCompanies();
      setCompanies(res.data || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleVerifyCompany = async (companyId: string, status: 'VERIFIED' | 'REJECTED') => {
    setActing(true);
    try {
      await api.verifyCompany(companyId, {
        status,
        remarks: `Corporate partnership MoU ${status === 'VERIFIED' ? 'accredited' : 'rejected'} by T&P Administration.`,
      });
      toast.success(`Company partnership status updated to ${status}`);
      await fetchCompanies();
      setSelectedCompany(null);
    } catch (err: any) {
      toast.error('Failed to update company verification status');
    } finally {
      setActing(false);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Partner Organization',
      sortable: true,
      render: (row: any) => (
        <div>
          <div className="font-bold text-slate-900">{row.name}</div>
          <div className="text-[11px] text-slate-500">{row.domain || 'Technology'} · {row.location || 'Maharashtra'}</div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Point of Contact',
      render: (row: any) => (
        <div>
          <div className="font-semibold text-slate-800">{row.contactPerson || 'HR Lead'}</div>
          <div className="text-[11px] font-mono text-slate-400">{row.contactEmail}</div>
        </div>
      ),
    },
    {
      key: 'listingsCount',
      header: 'Published Listings',
      sortable: true,
      render: (row: any) => (
        <span className="font-mono font-bold text-slate-900">{row._count?.listings || row.listings?.length || 0} Openings</span>
      ),
    },
    {
      key: 'isVerified',
      header: 'MoU Accreditation',
      render: (row: any) => {
        const isV = row.isVerified || row.verificationStatus === 'VERIFIED';
        return (
          <Badge variant={isV ? 'success' : 'warning'}>
            {isV ? 'MoU Verified' : 'Pending Review'}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Review MoU',
      render: (row: any) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSelectedCompany(row)}
          className="text-xs h-7 px-2.5 font-semibold"
        >
          Review
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Corporate Partner Management"
        subtitle="Manage industry partnerships, accredited MoUs, and corporate mentor authorizations"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <Card className="p-4 sm:p-6 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Partner Corporate Registry</h3>
              <p className="text-xs text-slate-500">Live database records with verification statuses and hiring stats</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p className="text-xs text-slate-500 mt-2">Loading corporate partners...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={companies}
              searchPlaceholder="Search companies by name, domain, or location..."
            />
          )}
        </Card>

        {/* Company Verification Modal */}
        {selectedCompany && (
          <Modal
            isOpen={Boolean(selectedCompany)}
            onClose={() => setSelectedCompany(null)}
            title={`Corporate Partner: ${selectedCompany.name}`}
          >
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">{selectedCompany.name}</span>
                  <Badge variant={selectedCompany.isVerified ? 'success' : 'warning'}>
                    {selectedCompany.isVerified ? 'MoU Verified' : 'Pending Review'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>Domain: <span className="font-bold text-slate-900">{selectedCompany.domain}</span></div>
                  <div>Location: <span className="font-bold text-slate-900">{selectedCompany.location}</span></div>
                  <div>Contact Person: <span className="font-bold text-slate-900">{selectedCompany.contactPerson}</span></div>
                  <div>Email: <span className="font-mono font-bold text-slate-900">{selectedCompany.contactEmail}</span></div>
                </div>
                {selectedCompany.description && (
                  <p className="text-slate-600 text-[11px] pt-1 leading-relaxed">{selectedCompany.description}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={acting}
                  onClick={() => handleVerifyCompany(selectedCompany.id, 'REJECTED')}
                  className="text-rose-600 hover:bg-rose-50"
                >
                  Reject Partner
                </Button>

                <Button
                  size="sm"
                  disabled={acting}
                  onClick={() => handleVerifyCompany(selectedCompany.id, 'VERIFIED')}
                  className="bg-emerald-600 hover:bg-emerald-700 font-semibold gap-1.5"
                >
                  {acting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  <span>Approve & Verify MoU</span>
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
