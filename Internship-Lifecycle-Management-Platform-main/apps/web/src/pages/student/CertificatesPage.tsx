import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Award, Download, ExternalLink, CheckCircle, ShieldCheck, QrCode, Building2, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';

export default function CertificatesPage() {
  const handleDownloadPDF = () => {
    toast.success('Official Signed Cryptographic Certificate (CERT-2026-001) downloaded!');
  };

  return (
    <div className="min-h-full pb-16" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header title="Verified Certificates Registry" subtitle="Cryptographically signed credentials issued by university & partner employers" />
      
      <main className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border shadow-md overflow-hidden"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="h-2 w-full" style={{ backgroundColor: 'var(--cta)' }} />

          <div className="p-6 md:p-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--border)' }}>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-mono font-bold mb-2">
                  <ShieldCheck size={13} />
                  AUTHENTICATED CRYPTOGRAPHIC CREDENTIAL
                </div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Certificate of Industrial Internship Completion</h2>
                <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--role-accent, var(--cta))' }}>Software Engineering Track · TechCorp Solutions Inc.</p>
              </div>

              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs border"
                style={{
                  backgroundColor: 'var(--accent-soft)',
                  color: 'var(--role-accent, var(--cta))',
                  borderColor: 'var(--border)'
                }}
              >
                <Award size={28} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="p-4 rounded-xl border bg-slate-50/70 dark:bg-slate-900/60" style={{ borderColor: 'var(--border)' }}>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">Issued To Recipient</span>
                <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>Priya Sharma (20CS101)</span>
              </div>

              <div className="p-4 rounded-xl border bg-slate-50/70 dark:bg-slate-900/60" style={{ borderColor: 'var(--border)' }}>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">Host Organization</span>
                <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>TechCorp Solutions Pvt. Ltd.</span>
              </div>

              <div className="p-4 rounded-xl border bg-slate-50/70 dark:bg-slate-900/60" style={{ borderColor: 'var(--border)' }}>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">Term Duration</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Jun 2026 - Sep 2026 (12 Weeks)</span>
              </div>

              <div className="p-4 rounded-xl border bg-slate-50/70 dark:bg-slate-900/60" style={{ borderColor: 'var(--border)' }}>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">Verification Code</span>
                <span className="text-sm font-mono font-bold" style={{ color: 'var(--role-accent, var(--cta))' }}>CERT-2026-001</span>
              </div>
            </div>

            <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center border bg-slate-50 dark:bg-slate-800" style={{ borderColor: 'var(--border)' }}>
                  <QrCode size={24} className="text-slate-700 dark:text-slate-300" />
                </div>
                <div className="text-xs">
                  <span className="font-bold block" style={{ color: 'var(--text)' }}>QR Verification</span>
                  <span className="font-mono text-[10px] opacity-75" style={{ color: 'var(--text-muted)' }}>Tamper-Proof SHA-256 Public Ledger</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <Link
                  to="/verify/CERT-2026-001"
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                >
                  <ExternalLink size={13} />
                  <span>Verify Public Page</span>
                </Link>
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-white text-xs font-bold font-mono tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all shadow-md hover:scale-105 cursor-pointer"
                  style={{ backgroundColor: 'var(--cta)' }}
                >
                  <Download size={13} />
                  <span>Download Signed PDF</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
