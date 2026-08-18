import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function SessionExpiredPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 text-slate-900">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
          <Clock size={32} />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-700 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 inline-block">
            Security Timeout
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Session Expired
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your authentication token has expired due to inactivity. Please sign in again to resume your active work session.
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-left space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Shield size={14} className="text-emerald-600" />
            <span>Automatic Data Preservation</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Any uncommitted drafts have been preserved in local storage. Re-authenticating will restore your session.
          </p>
        </div>

        <div className="pt-2">
          <Link to="/sign-in" className="w-full block">
            <Button variant="primary" size="md" className="w-full" rightIcon={<ArrowRight size={15} />}>
              Sign In Again
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
