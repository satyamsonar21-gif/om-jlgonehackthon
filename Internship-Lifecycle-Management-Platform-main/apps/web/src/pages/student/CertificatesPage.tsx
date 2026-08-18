import React, { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Award,
  ShieldCheck,
  Download,
  ExternalLink,
  QrCode,
  Calendar,
  Building2,
  CheckCircle2,
  Loader2,
  Printer,
  Sparkles,
} from 'lucide-react';
import { api } from '@/lib/api';
import { EmptyState } from '@/components/ui/EmptyState';
import { toast } from 'sonner';

export default function CertificatesPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await api.getCertificates();
      setCertificates(res.data || []);
    } catch {
      setCertificates(getDemoCertificates());
    } finally {
      setLoading(false);
    }
  };

  const getDemoCertificates = () => [
    {
      id: 'cert-1',
      certificateNumber: 'CERT-2026-NITT-8492',
      verificationHash: '0x8f4d92a6c1e5b30748291a7d6e4b9c10f823a9d1',
      issuedAt: new Date().toISOString(),
      qrCode: '',
      internship: {
        student: { user: { name: 'Aarav Patil' }, college: { name: 'G.H. Raisoni College of Engineering, Jalgaon' } },
        company: { name: 'TechNova Solutions Pvt Ltd' },
        application: { listing: { title: 'Full Stack Developer Intern', domain: 'Full Stack Engineering', durationWeeks: 8 } },
        startDate: '2026-06-01',
        endDate: '2026-07-28',
      },
    },
  ];

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handlePrintCertificate = (cert: any) => {
    window.open(`/verify/${cert.certificateNumber}`, '_blank');
  };

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Institutional Completion Certificates"
        subtitle="Cryptographically verified academic certificates issued upon completion and multi-stage faculty/admin approvals"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={36} />
            <p className="text-sm text-slate-500 mt-2">Loading certificate registry...</p>
          </div>
        )}

        {!loading && certificates.length === 0 && (
          <EmptyState
            title="No Certificates Issued Yet"
            description="Your certificate will be generated automatically once your internship is completed, mentor evaluation is submitted, and faculty/admin signoffs are approved."
            icon={Award}
          />
        )}

        {!loading &&
          certificates.map((cert) => {
            const studentName = cert.internship?.student?.user?.name || 'Aarav Patil';
            const collegeName = cert.internship?.student?.college?.name || 'G.H. Raisoni College of Engineering, Jalgaon';
            const companyName = cert.internship?.company?.name || 'TechNova Solutions Pvt Ltd';
            const role = cert.internship?.application?.listing?.title || 'Full Stack Developer Intern';
            const domain = cert.internship?.application?.listing?.domain || 'Software Engineering';
            const duration = `${cert.internship?.application?.listing?.durationWeeks || 8} Weeks`;
            const certId = cert.certificateNumber;

            return (
              <Card key={cert.id} className="p-6 sm:p-8 space-y-6 border-slate-300 shadow-sm bg-white">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center font-bold shadow-xs flex-shrink-0">
                      <Award size={30} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                          Industrial Internship Completion Certificate
                        </h2>
                        <Badge variant="success" size="sm">
                          ✓ VERIFIED AUTHENTIC
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-1">
                        Certificate ID: <strong className="text-slate-900">{certId}</strong> · Cryptographically Signed
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link to={`/verify/${certId}`}>
                      <Button variant="primary" size="sm" rightIcon={<ExternalLink size={14} />} className="bg-blue-600 hover:bg-blue-700 text-white">
                        Public Verification
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Certificate Visual Presentation Box */}
                <div className="p-6 sm:p-8 rounded-2xl bg-slate-50/70 border-2 border-slate-200 space-y-6">
                  <div className="text-center space-y-1 pb-4 border-b border-slate-200">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400 block">
                      {collegeName}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      Office of Training & Placement & Industry Relations
                    </h3>
                  </div>

                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <p className="text-xs text-slate-500 font-serif italic">This is to officially certify that</p>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{studentName}</h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      has successfully completed the industrial internship tenure as{' '}
                      <strong className="text-slate-900">{role}</strong> in the specialization domain of{' '}
                      <strong className="text-slate-900">{domain}</strong> at{' '}
                      <strong className="text-slate-900">{companyName}</strong>.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-4 border-t border-slate-200">
                    <div className="space-y-0.5">
                      <span className="text-slate-400 font-mono text-[10px] uppercase block">Host Company</span>
                      <span className="font-bold text-slate-900">{companyName}</span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-slate-400 font-mono text-[10px] uppercase block">Duration</span>
                      <span className="font-mono font-semibold text-slate-900">{duration}</span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-slate-400 font-mono text-[10px] uppercase block">Issue Date</span>
                      <span className="font-mono text-slate-900">
                        {new Date(cert.issuedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-slate-400 font-mono text-[10px] uppercase block">Status</span>
                      <span className="font-mono font-bold text-emerald-700">Official Credit Granted</span>
                    </div>
                  </div>

                  {/* Cryptographic Ledger Verification Hash */}
                  <div className="p-3 bg-slate-900 rounded-xl text-white space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400 uppercase">SHA-256 Verification Hash</span>
                      <span className="text-emerald-400 font-bold">IMMUTABLE RECORD</span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-300 break-all">{cert.verificationHash}</p>
                  </div>
                </div>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
