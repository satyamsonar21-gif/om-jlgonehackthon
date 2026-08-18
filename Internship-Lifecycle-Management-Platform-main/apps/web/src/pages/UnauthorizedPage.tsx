import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth, getRoleDashboardPath } from '@/lib/auth';

export default function UnauthorizedPage() {
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();

  const required = searchParams.get('required') || 'Elevated Institutional Access';
  const actual = searchParams.get('actual') || user?.role || 'Guest';
  const dashboardPath = user ? getRoleDashboardPath(user.role, user.status) : '/sign-in';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 text-slate-900">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert size={32} />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-600 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 inline-block">
            403 · Access Forbidden
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Unauthorized Portal Request
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your current account credentials do not have permission to view or manage this institutional area.
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left space-y-2">
          <div className="flex justify-between items-center text-slate-600">
            <span>Your Active Role:</span>
            <span className="font-mono font-bold text-slate-900">{actual}</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Required Clearance:</span>
            <span className="font-mono font-bold text-rose-600">{required}</span>
          </div>
          {user?.name && (
            <div className="flex justify-between items-center text-slate-600 pt-1 border-t border-slate-200">
              <span>Account:</span>
              <span className="font-medium text-slate-800">{user.name}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <Link to={dashboardPath} className="w-full">
            <Button variant="primary" size="md" className="w-full" leftIcon={<Home size={15} />}>
              Return to My Dashboard
            </Button>
          </Link>
          <Button
            variant="outline"
            size="md"
            className="w-full text-slate-700 hover:bg-slate-50"
            onClick={logout}
            leftIcon={<LogOut size={15} />}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
