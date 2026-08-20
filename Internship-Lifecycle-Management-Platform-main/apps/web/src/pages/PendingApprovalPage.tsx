import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ShieldCheck, RefreshCw, Mail, Phone, LogOut, CheckCircle2, Building2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export default function PendingApprovalPage() {
  const { user, refreshUser, logout } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshUser();
      toast.info('Account review status checked. Still pending administrator verification.');
    } catch {
      toast.info('Account review status checked. Still pending administrator verification.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const isFaculty = user?.role === 'FACULTY_MENTOR' || user?.role === 'FACULTY';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 text-slate-900">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shadow-xs flex-shrink-0">
            {isFaculty ? <BookOpen size={24} /> : <Building2 size={24} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">Account Pending Verification</h1>
              <Badge variant="warning" size="sm">
                Under Review
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isFaculty ? 'Faculty Guide Registration' : 'Corporate Partner Accreditation'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 space-y-2 leading-relaxed">
          <div className="font-bold flex items-center gap-1.5 text-amber-900">
            <Clock size={15} />
            <span>Institutional Governance Protocol</span>
          </div>
          <p>
            Thank you for registering, <span className="font-semibold">{user?.name || 'Academic Associate'}</span>. To protect student welfare and uphold university compliance standards, all {isFaculty ? 'faculty supervisor' : 'company partner'} profiles are manually reviewed and verified by the University Training & Placement (T&P) Administration.
          </p>
        </div>

        <div className="space-y-2.5 text-xs text-slate-600">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Verification Roadmap</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">1. Registration Credentials Dispatched</span>
                <span className="text-[11px] text-emerald-800">Profile data and institutional email recorded in database.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-950">
              <Clock size={16} className="text-blue-600 flex-shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="font-bold block">2. Institutional Identity & MoU Verification</span>
                <span className="text-[11px] text-blue-800">
                  {isFaculty
                    ? 'Faculty ID and Department allocation being cross-referenced by Dean / HOD.'
                    : 'Company registration and corporate domain being validated by T&P cell.'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500">
              <ShieldCheck size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">3. Clearance & Portal Access Activation</span>
                <span className="text-[11px] text-slate-500">
                  {isFaculty
                    ? 'Access granted to review weekly reports and guide active student interns.'
                    : 'Access granted to post verified internship listings and evaluate applications.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
          <span className="font-bold text-slate-800 block">Need expedited clearance?</span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-500 text-[11px]">
            <span className="flex items-center gap-1">
              <Mail size={13} className="text-slate-400" />
              <span>tnp.office@ghrce.edu</span>
            </span>
            <span className="flex items-center gap-1">
              <Phone size={13} className="text-slate-400" />
              <span>+91 (07104) 242-345</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-slate-100">
          <Button
            variant="primary"
            size="md"
            className="w-full"
            loading={isRefreshing}
            onClick={handleRefresh}
            leftIcon={<RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />}
          >
            Check Status Again
          </Button>
          <Button
            variant="outline"
            size="md"
            className="w-full text-slate-700"
            onClick={logout}
            leftIcon={<LogOut size={14} />}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
