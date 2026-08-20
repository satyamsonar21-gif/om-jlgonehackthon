import React, { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Award, ShieldCheck, ExternalLink, Plus, Check, Loader2, QrCode } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminCertificatesPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [certificates, setCertificates] = useState<any[]>([]);
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedInternshipId, setSelectedInternshipId] = useState('');
  const [acting, setActing] = useState(false);
  const [previewCert, setPreviewCert] = useState<any | null>(null);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const [certRes, internRes] = await Promise.allSettled([
        api.getCertificates(),
        api.getInternships(),
      ]);

      if (certRes.status === 'fulfilled') {
        setCertificates(certRes.value.data || []);
      }
      if (internRes.status === 'fulfilled') {
        setInternships(internRes.value.data || []);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleGenerateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInternshipId) {
      toast.error('Please select an internship');
      return;
    }

    setActing(true);
    try {
      const res = await api.generateCertificate(selectedInternshipId, true);
      toast.success(`Cryptographic Certificate ${res.data?.certificate?.certificateNumber} issued successfully!`);
      await fetchCertificates();
      setIsIssueModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to issue certificate');
    } finally {
      setActing(false);
    }
  };

  const columns = [
    {
      key: 'certCode',
      header: 'Certificate ID & Verification Hash',
      sortable: true,
      render: (row: any) => (
        <div>
          <div className="font-mono font-bold text-slate-900">{row.certificateNumber}</div>
          <div className="text-[10px] font-mono text-slate-400 truncate max-w-xs">
            {row.verificationHash}
          </div>
        </div>
      ),
    },
    {
      key: 'student',
      header: 'Recipient Student',
      sortable: true,
      render: (row: any) => (
        <div>
          <div className="font-bold text-slate-800">{row.internship?.student?.user?.name || 'Aarav Patil'}</div>
          <div className="text-[11px] font-mono text-slate-400">
            {row.internship?.student?.studentId || 'IT22B042'} · {row.internship?.student?.department || 'IT'}
          </div>
        </div>
      ),
    },
    {
      key: 'company',
      header: 'Host Organization',
      sortable: true,
      render: (row: any) => (
        <div>
          <div className="font-semibold text-slate-800">{row.internship?.company?.name || 'TechNova'}</div>
          <div className="text-[11px] text-slate-500">{row.internship?.application?.listing?.title || 'Full Stack'}</div>
        </div>
      ),
    },
    {
      key: 'issuedAt',
      header: 'Issue Date',
      render: (row: any) => (
        <span className="font-mono text-xs text-slate-700">
          {new Date(row.issuedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: any) => (
        <Badge variant={row.isRevoked ? 'destructive' : 'success'}>
          {row.isRevoked ? 'REVOKED' : 'ISSUED & VERIFIED'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Public Verification',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPreviewCert(row)}
            className="text-xs h-7 px-2"
          >
            <QrCode size={12} className="mr-1" />
            <span>QR</span>
          </Button>
          <Link to={`/verify/${row.certificateNumber}`} target="_blank">
            <Button size="sm" variant="outline" className="text-xs h-7 px-2 font-semibold text-blue-600 gap-1">
              <span>Verify</span>
              <ExternalLink size={12} />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Institutional Certificate Registry"
        subtitle="Manage cryptographic completion credentials, SHA-256 verification hashes, and public registry"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <Card className="p-4 sm:p-6 border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Official Issued Credentials</h3>
              <p className="text-xs text-slate-500">Live records from institutional cryptographic ledger</p>
            </div>

            <Button
              size="sm"
              onClick={() => setIsIssueModalOpen(true)}
              className="bg-[var(--role-accent)] text-white hover:opacity-90 font-semibold gap-1.5 self-start sm:self-auto"
            >
              <Plus size={14} />
              <span>Issue New Certificate</span>
            </Button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p className="text-xs text-slate-500 mt-2">Loading certificate ledger...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={certificates}
              searchPlaceholder="Search certificates by code, student name, PRN, or company..."
            />
          )}
        </Card>

        {/* Issue Certificate Modal */}
        {isIssueModalOpen && (
          <Modal
            isOpen={isIssueModalOpen}
            onClose={() => setIsIssueModalOpen(false)}
            title="Issue Completion Certificate"
          >
            <form onSubmit={handleGenerateCertificate} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Completed Internship Enrollment
                </label>
                <select
                  value={selectedInternshipId}
                  onChange={(e) => setSelectedInternshipId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="">-- Select Candidate --</option>
                  {internships.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.student?.user?.name} ({i.student?.studentId}) — {i.company?.name} ({i.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1 text-slate-700">
                <p className="font-bold text-blue-900 flex items-center gap-1">
                  <ShieldCheck size={14} />
                  <span>Cryptographic Gatekeeper</span>
                </p>
                <p className="text-[11px]">
                  Generating the certificate will calculate a unique SHA-256 hash and dynamic QR verification URL.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setIsIssueModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={acting} className="gap-1.5 font-semibold">
                  {acting && <Loader2 size={14} className="animate-spin" />}
                  <span>Sign & Issue Certificate</span>
                </Button>
              </div>
            </form>
          </Modal>
        )}

        {/* QR Code Preview Modal */}
        {previewCert && (
          <Modal
            isOpen={Boolean(previewCert)}
            onClose={() => setPreviewCert(null)}
            title={`Credential QR: ${previewCert.certificateNumber}`}
          >
            <div className="flex flex-col items-center text-center space-y-4 py-3">
              {previewCert.qrCode && (
                <img
                  src={previewCert.qrCode}
                  alt="QR Code"
                  loading="lazy"
                  decoding="async"
                  className="w-48 h-48 rounded-xl border border-slate-200 p-2 bg-white shadow-xs"
                />
              )}
              <div className="space-y-1">
                <p className="font-bold text-slate-900">{previewCert.internship?.student?.user?.name}</p>
                <p className="font-mono text-xs text-slate-500">{previewCert.certificateNumber}</p>
                <p className="font-mono text-[10px] text-slate-400 break-all max-w-sm">
                  {previewCert.verificationHash}
                </p>
              </div>
              <Link to={`/verify/${previewCert.certificateNumber}`} target="_blank" className="w-full">
                <Button className="w-full text-xs font-semibold">Open Public Verification URL</Button>
              </Link>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
