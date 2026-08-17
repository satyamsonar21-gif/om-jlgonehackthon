import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft, CheckCircle2, Building2, Calendar, User, QrCode, Sparkles } from 'lucide-react';

export default function VerifyCertificatePage() {
  const { code } = useParams<{ code: string }>();
  const certificateId = code || 'CERT-2026-001';

  return (
    <div className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden text-white">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="w-full max-w-lg z-10">
        <div className="mb-4">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-slate-300 hover:text-white transition-colors">
            <ArrowLeft size={14} /> Back to Platform
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white text-[#0A192F] rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6"
        >
          {/* Top Verified Shield Badge */}
          <div className="flex flex-col items-center text-center space-y-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" as const, stiffness: 280, damping: 22, delay: 0.15 }}
              className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-xs"
            >
              <ShieldCheck size={32} />
            </motion.div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
                <CheckCircle2 size={12} />
                VERIFIED CREDENTIAL
              </div>
              <h1 className="text-xl font-bold text-[#0A192F] tracking-tight mt-2">
                Certificate of Industrial Completion
              </h1>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Authentic Digital Record Issued via ILMP
              </p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Credential Data Grid */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3.5 text-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/60">
              <span className="font-mono text-slate-500 uppercase">Certificate Identifier</span>
              <span className="font-mono font-bold text-[#0A192F]">{certificateId}</span>
            </div>

            <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/60">
              <span className="text-slate-500">Student Name</span>
              <span className="font-bold text-[#0A192F]">Priya Sharma (20CS101)</span>
            </div>

            <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/60">
              <span className="text-slate-500">Host Organization</span>
              <span className="font-semibold text-[#0A192F]">TechCorp Solutions Pvt. Ltd.</span>
            </div>

            <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/60">
              <span className="text-slate-500">Track & Specialization</span>
              <span className="font-semibold text-[#0A192F]">Software Engineering Track</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Term Duration</span>
              <span className="font-mono text-[#0A192F]">Jun 2026 – Sep 2026 (12 Weeks)</span>
            </div>
          </div>

          {/* QR Code Verification Block */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <QrCode size={24} />
              </div>
              <div className="text-xs">
                <span className="font-bold text-[#0A192F] block">Ed25519 Chain Validated</span>
                <span className="text-[10px] font-mono text-slate-400">Public Key Signoff Confirmed</span>
              </div>
            </div>

            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              VALID
            </span>
          </div>

          {/* Action Link */}
          <div className="pt-2 text-center">
            <Link
              to="/sign-in"
              className="w-full py-3 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] text-white text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Access Platform Hub</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
