import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface VerifiedCompanyBadgeProps {
  isVerified?: boolean;
  status?: string;
  size?: 'sm' | 'md';
  showUnverifiedNotice?: boolean;
}

export function VerifiedCompanyBadge({
  isVerified = false,
  status = 'PENDING',
  size = 'sm',
  showUnverifiedNotice = false,
}: VerifiedCompanyBadgeProps) {
  const normStatus = (status || '').toUpperCase();

  if (isVerified || normStatus === 'VERIFIED') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${
          size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
        }`}
        title="Verified Corporate Partner accredited by University T&P Cell"
      >
        <CheckCircle2 size={size === 'sm' ? 12 : 14} className="text-emerald-600 flex-shrink-0" />
        <span>Verified Partner</span>
      </span>
    );
  }

  if (normStatus === 'UNDER_REVIEW') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${
          size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
        }`}
      >
        <Clock size={size === 'sm' ? 12 : 14} className="text-blue-600 flex-shrink-0" />
        <span>Under Review</span>
      </span>
    );
  }

  if (normStatus === 'SUSPENDED' || normStatus === 'REJECTED') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${
          size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
        }`}
      >
        <AlertTriangle size={size === 'sm' ? 12 : 14} className="text-rose-600 flex-shrink-0" />
        <span>{normStatus === 'SUSPENDED' ? 'Suspended' : 'Rejected'}</span>
      </span>
    );
  }

  if (showUnverifiedNotice) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${
          size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
        }`}
      >
        <Clock size={size === 'sm' ? 12 : 14} className="text-amber-600 flex-shrink-0" />
        <span>Pending Approval</span>
      </span>
    );
  }

  return null;
}

export default VerifiedCompanyBadge;
