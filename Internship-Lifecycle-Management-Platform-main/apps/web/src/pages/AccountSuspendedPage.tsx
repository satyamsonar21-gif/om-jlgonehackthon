import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, Mail, Phone, LogOut, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';

export default function AccountSuspendedPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 text-slate-900">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
          <AlertOctagon size={32} />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-600 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 inline-block">
            Account Inactive / Suspended
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Institutional Access Suspended
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your platform access has been temporarily suspended by the Training & Placement Administration due to an academic compliance review or administrative action.
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left space-y-2">
          <div className="flex justify-between items-center text-slate-600">
            <span>Account Holder:</span>
            <span className="font-bold text-slate-900">{user?.name || 'Registered User'}</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Email:</span>
            <span className="font-mono text-slate-700">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Role:</span>
            <span className="font-mono font-bold text-slate-800">{user?.role}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-left space-y-1.5 text-amber-950">
          <span className="font-bold block">Institutional Grievance Contact:</span>
          <p className="text-[11px] text-amber-900">
            To appeal this restriction or submit required academic clearance documentation, please contact the University Grievance Officer:
          </p>
          <div className="text-[11px] space-y-1 pt-1 font-mono">
            <div>Email: <span className="font-bold">grievance.committee@ghrce.edu</span></div>
            <div>T&P Helpline: <span className="font-bold">+91 (07104) 242-350</span></div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-center">
          <Button variant="outline" size="md" className="w-full text-slate-700" onClick={logout} leftIcon={<LogOut size={15} />}>
            Sign Out of Account
          </Button>
        </div>
      </div>
    </div>
  );
}
