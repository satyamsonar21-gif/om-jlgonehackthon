import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Award, ShieldCheck, Download, ExternalLink, QrCode, Calendar, Building2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CertificatesPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const handleDownload = () => {
    toast.success('Downloading official PDF certificate (CERT-2026-001.pdf)');
  };

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Completion Certificates"
        subtitle="Verified cryptographic certificates accredited by university academic council"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Certificate Spotlight Card */}
        <Card className="p-6 sm:p-8 space-y-6 border-slate-300 shadow-md bg-white">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center font-bold shadow-xs flex-shrink-0">
                <Award size={30} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    Industrial Internship Completion Certificate
                  </h2>
                  <Badge variant="success" size="sm">
                    Verified
                  </Badge>
                </div>
                <div className="text-xs text-slate-500 font-mono mt-1">
                  Certificate ID: <strong className="text-slate-800">CERT-2026-001</strong> · Ed25519 Cryptographically Signed
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                leftIcon={<Download size={14} />}
              >
                Download PDF
              </Button>
              <Link to="/verify/CERT-2026-001">
                <Button variant="primary" size="sm" rightIcon={<ExternalLink size={14} />}>
                  Public Verification Page
                </Button>
              </Link>
            </div>
          </div>

          {/* Certificate Academic Spec Preview */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="text-center space-y-1 pb-4 border-b border-slate-200">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block">
                University Institution of Engineering & Technology
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Department of Computer Science & Engineering
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="space-y-1">
                <span className="text-slate-400 font-mono text-[11px] block">Awarded To</span>
                <span className="font-bold text-slate-900 text-sm">Priya Sharma</span>
                <span className="text-slate-500 block">PRN / Roll: 20CS101 (Tier-1)</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-mono text-[11px] block">Host Organization</span>
                <span className="font-bold text-slate-900 text-sm">TechCorp Solutions Pvt. Ltd.</span>
                <span className="text-slate-500 block">Track: Software Engineering & Cloud</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-mono text-[11px] block">Internship Period</span>
                <span className="font-mono text-slate-800 font-semibold">Jun 01, 2026 – Aug 30, 2026 (12 Weeks)</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-mono text-[11px] block">Academic Grade</span>
                <span className="font-mono font-bold text-emerald-700">Grade A+ · 4.0 Credits Granted</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <QrCode size={18} className="text-slate-700" />
                <span className="font-mono text-[11px]">QR Validation: https://ilmp.edu/verify/CERT-2026-001</span>
              </div>

              <span className="text-[11px] font-mono font-bold text-slate-500">
                Signed by: Dr. Rajesh Kumar (HOD)
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
