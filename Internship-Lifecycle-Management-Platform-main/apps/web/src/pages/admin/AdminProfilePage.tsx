import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Shield, Key, Lock, User, Mail, Save, Check, ShieldCheck, Database, Server, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProfilePage() {
  const [saved, setSaved] = useState(false);
  const [rotatedKey, setRotatedKey] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    toast.success('Administrator master configuration updated');
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRotateKey = () => {
    setRotatedKey(true);
    toast.success('Cryptographic Certificate Signing Key Rotated');
    setTimeout(() => setRotatedKey(false), 4000);
  };

  return (
    <div className="min-h-full pb-16" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header 
        title="Super Administrator Security & Governance Profile" 
        subtitle="System Master Key Node · Root Certificate Authority Oversight" 
      />

      <main className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
        {/* Profile Card Header */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border shadow-sm p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="w-20 h-20 rounded-2xl bg-sky-100 dark:bg-sky-950 text-[#0284C7] flex items-center justify-center text-2xl font-black shadow-xs flex-shrink-0 border border-sky-300 dark:border-sky-800">
            <Shield size={36} />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Institutional System Administrator</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-100 dark:bg-sky-950 text-[#0284C7] dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                ROOT SUPERUSER
              </span>
            </div>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              Office of the Registrar & Academic Council IT Infrastructure
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-mono pt-2" style={{ color: 'var(--text-muted)' }}>
              <span>Governance Node: #ADM-001</span>
              <span>•</span>
              <span>Audit Status: Active 24/7</span>
              <span>•</span>
              <span>Encryption: RSA-4096 / SHA-256</span>
            </div>
          </div>
        </motion.div>

        {/* Admin Form */}
        <form onSubmit={handleSave} className="rounded-2xl border shadow-sm p-6 space-y-6" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="border-b pb-3 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Master Administrator Identity & Access Credentials</h3>
            <span className="text-xs font-mono font-semibold" style={{ color: 'var(--highlights)' }}>Node Live</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                Master Admin Email
              </label>
              <input 
                type="email" 
                defaultValue="admin.governance@university.edu" 
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-xs focus:outline-none" 
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                Institutional Authority ID
              </label>
              <input 
                type="text" 
                defaultValue="UNIV-GOV-2026-ROOT-KEY" 
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-xs focus:outline-none" 
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                Emergency Security Contact
              </label>
              <input 
                type="text" 
                defaultValue="+91 80 2345 6789 (SOC Hotline)" 
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-xs focus:outline-none" 
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                Certificate Authority Domain
              </label>
              <input 
                type="text" 
                defaultValue="verify.university-ilmp.edu.in" 
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-xs focus:outline-none" 
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>
          </div>

          {/* Cryptographic Key Management */}
          <div className="p-4 rounded-xl border bg-slate-50/70 dark:bg-slate-900/50 space-y-3" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#0284C7]" />
                <span className="font-bold text-xs">Certificate Master Cryptographic Signing Key</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                ACTIVE & VERIFIED
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Used to generate tamper-proof QR code signatures for digital student internship certificates. Last rotated: 14 days ago.
            </p>
            <div className="pt-1 flex gap-2">
              <button
                type="button"
                onClick={handleRotateKey}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw size={13} className={rotatedKey ? 'animate-spin' : ''} />
                <span>Rotate Signing Key</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end" style={{ borderColor: 'var(--border)' }}>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold font-mono tracking-wider uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer text-white"
              style={{ backgroundColor: 'var(--cta)' }}
            >
              {saved ? (
                <>
                  <Check size={14} />
                  <span>Settings Saved</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save Administrator Configuration</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
