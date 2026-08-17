import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Download, Ban, FileText, CheckCircle2, ShieldCheck, ExternalLink, QrCode } from 'lucide-react';

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState([
    { id: 'CERT-2026-001', student: 'Priya Sharma', roll: '20CS101', company: 'TechCorp Solutions', duration: '12 Weeks', date: 'Jul 28, 2026', status: 'Active' },
    { id: 'CERT-2026-002', student: 'Rahul Patel', roll: '20CS102', company: 'Innovatech Labs', duration: '8 Weeks', date: 'Jul 26, 2026', status: 'Active' },
    { id: 'CERT-2026-003', student: 'Amit Kumar', roll: '20CS105', company: 'TechCorp Solutions', duration: '12 Weeks', date: 'Jul 25, 2026', status: 'Active' },
    { id: 'CERT-2026-004', student: 'Sneha Reddy', roll: '20CS104', company: 'DataSystems Inc', duration: '10 Weeks', date: 'Jul 20, 2026', status: 'Active' },
    { id: 'CERT-2026-005', student: 'Vikram Singh', roll: '20CS103', company: 'DataSystems Inc', duration: '6 Weeks', date: 'Jul 15, 2026', status: 'Revoked' },
  ]);

  const toggleRevocation = (id: string) => {
    setCerts(certs.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Revoked' : 'Active' } : c));
  };

  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="Cryptographic Certificate Registry" subtitle="Issue, manage and verify digital graduation credentials" />
      
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
        {/* Metric KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
            <span className="text-2xl font-bold font-mono text-[#BE123C]">923</span>
            <span className="text-xs text-slate-500 block mt-0.5">Total Issued</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
            <span className="text-2xl font-bold font-mono text-emerald-700">901</span>
            <span className="text-xs text-slate-500 block mt-0.5">Active & Valid</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
            <span className="text-2xl font-bold font-mono text-rose-700">22</span>
            <span className="text-xs text-slate-500 block mt-0.5">Revoked Records</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
            <span className="text-2xl font-bold font-mono text-amber-700">12</span>
            <span className="text-xs text-slate-500 block mt-0.5">Pending Signoff</span>
          </div>
        </div>

        {/* Certificate Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Registered Credentials Ledger</h3>
            <span className="text-xs font-mono text-slate-400">Ed25519 Chain Validated</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="p-4 font-semibold">Certificate ID</th>
                  <th className="p-4 font-semibold">Recipient</th>
                  <th className="p-4 font-semibold">Host Organization</th>
                  <th className="p-4 font-semibold">Duration</th>
                  <th className="p-4 font-semibold">Date Issued</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {certs.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#BE123C]">{c.id}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{c.student}</div>
                      <div className="text-[11px] font-mono text-slate-400">{c.roll}</div>
                    </td>
                    <td className="p-4 text-slate-700 font-medium">{c.company}</td>
                    <td className="p-4 text-slate-500 font-mono">{c.duration}</td>
                    <td className="p-4 text-slate-500 font-mono">{c.date}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        c.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/verify/${c.id}`} 
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium inline-flex items-center gap-1"
                        >
                          <ExternalLink size={12} /> Verify
                        </Link>
                        <button 
                          onClick={() => toggleRevocation(c.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                            c.status === 'Active' ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {c.status === 'Active' ? 'Revoke' : 'Reactivate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
