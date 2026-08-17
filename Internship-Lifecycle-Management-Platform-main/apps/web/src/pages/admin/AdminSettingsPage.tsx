import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Building, Settings, Bell, Sparkles, AlertTriangle, Save, CheckCircle2, Shield, Key } from 'lucide-react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="System & Institutional Settings" subtitle="Configure campus compliance criteria, API keys, and security parameters" />
      
      <main className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Institution Details */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Building size={18} className="text-[#BE123C]" />
              <h3 className="font-bold text-sm text-slate-900">Institution Identity</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">Institution Legal Name</label>
                <input 
                  type="text" 
                  defaultValue="National Institute of Technology" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none input-focus-ring" 
                  style={{ '--primary': '#BE123C' } as React.CSSProperties}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">University Accreditation Code</label>
                <input 
                  type="text" 
                  defaultValue="NIT-ACCRED-2026" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none input-focus-ring" 
                  style={{ '--primary': '#BE123C' } as React.CSSProperties}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Thresholds */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Settings size={18} className="text-[#BE123C]" />
              <h3 className="font-bold text-sm text-slate-900">Compliance & At-Risk Thresholds</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">Min Required Attendance (%)</label>
                <input 
                  type="number" 
                  defaultValue={75} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none input-focus-ring font-mono" 
                  style={{ '--primary': '#BE123C' } as React.CSSProperties}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">Weekly Report Grace Period (Days)</label>
                <input 
                  type="number" 
                  defaultValue={3} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none input-focus-ring font-mono" 
                  style={{ '--primary': '#BE123C' } as React.CSSProperties}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Certificate Cryptography */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Key size={18} className="text-[#BE123C]" />
              <h3 className="font-bold text-sm text-slate-900">Certificate Digital Signature Keys</h3>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">Public Verification Hash Key</label>
              <input 
                type="text" 
                readOnly
                defaultValue="ed25519_pk_7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069" 
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-500 font-mono focus:outline-none" 
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#BE123C] hover:bg-[#9F1239] text-white text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              {saved ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Parameters Updated</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
