import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Award, Download, ExternalLink, CheckCircle, ShieldCheck, QrCode, Building2, Calendar, User } from 'lucide-react';

export default function CertificatesPage() {
  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="Verified Certificates Registry" subtitle="Cryptographically signed credentials issued by university" />
      
      <main className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden"
        >
          <div className="h-2 w-full bg-[#0D9488]" />

          <div className="p-6 md:p-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold mb-2">
                  <ShieldCheck size={13} />
                  AUTHENTICATED CREDENTIAL
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Certificate of Internship Completion</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Software Engineering Track · TechCorp Solutions</p>
              </div>

              <div className="w-14 h-14 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-center text-[#0D9488] shadow-xs">
                <Award size={28} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">Issued To Recipient</span>
                <span className="text-sm font-bold text-slate-900">Priya Sharma (20CS101)</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">Host Organization</span>
                <span className="text-sm font-bold text-slate-900">TechCorp Solutions Pvt. Ltd.</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">Term Duration</span>
                <span className="text-sm font-semibold text-slate-800">Jun 2026 - Sep 2026 (12 Weeks)</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">Verification Code</span>
                <span className="text-sm font-mono font-bold text-[#0D9488]">CERT-2026-001</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-700">
                  <QrCode size={24} />
                </div>
                <div className="text-xs text-slate-500">
                  <span className="font-bold text-slate-900 block">QR Verification</span>
                  <span className="font-mono text-[10px]">Tamper-Proof SHA-256 Ledger</span>
                </div>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <Link
                  to="/verify/CERT-2026-001"
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink size={13} /> Verify Public Page
                </Link>
                <button
                  onClick={() => alert('Downloading official signed PDF certificate...')}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Download size={13} /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
