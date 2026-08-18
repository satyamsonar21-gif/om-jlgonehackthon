import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft, CheckCircle2, Building2, Calendar, User, QrCode, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function VerifyCertificatePage() {
  const { code } = useParams<{ code: string }>();
  const certificateId = code || 'CERT-2026-001';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 text-slate-900">
      <div className="w-full max-w-lg">
        <div className="mb-4">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft size={14} />
            <span>Back to Platform Home</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
          {/* Top Verified Shield Badge */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-xs">
              <ShieldCheck size={28} />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
                <CheckCircle2 size={12} />
                <span>OFFICIAL VERIFIED CREDENTIAL</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-2">
                Certificate of Industrial Internship Completion
              </h1>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Cryptographically Signed via ILMP Protocol
              </p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Credential Data Grid */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/60">
              <span className="font-mono text-slate-500 uppercase">Certificate ID</span>
              <span className="font-mono font-bold text-slate-900">{certificateId}</span>
            </div>

            <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/60">
              <span className="text-slate-500">Student Name</span>
              <span className="font-bold text-slate-900">Priya Sharma (20CS101)</span>
            </div>

            <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/60">
              <span className="text-slate-500">Host Organization</span>
              <span className="font-semibold text-slate-900">TechCorp Solutions Pvt. Ltd.</span>
            </div>

            <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/60">
              <span className="text-slate-500">Specialization Track</span>
              <span className="font-semibold text-slate-900">Software Engineering Track</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Duration & Term</span>
              <span className="font-mono text-slate-900">Jun 2026 – Sep 2026 (12 Weeks)</span>
            </div>
          </div>

          {/* QR Code Verification Block */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <QrCode size={20} />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Ed25519 Chain Validated</span>
                <span className="text-[10px] font-mono text-slate-400">Institutional Public Key Verified</span>
              </div>
            </div>

            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              VALID
            </span>
          </div>

          {/* Action Link */}
          <div className="pt-2">
            <Link to="/sign-in" className="w-full block">
              <Button variant="primary" size="md" className="w-full">
                Enter Platform Portal
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
