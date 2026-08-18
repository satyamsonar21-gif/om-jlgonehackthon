import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  UserCheck,
  Building2,
  PhoneCall,
  Award,
  Sparkles,
  ShieldCheck,
  XCircle,
  Check,
} from 'lucide-react';

export interface ApplicationTimelineProps {
  status: string;
  rejectionReason?: string;
  submittedAt?: string;
  facultyApprovedAt?: string;
  shortlistedAt?: string;
  interviewDate?: string;
  selectedAt?: string;
}

const STAGES = [
  { key: 'APPLIED', label: 'Applied', icon: FileText },
  { key: 'FACULTY_REVIEW', label: 'Faculty Review', icon: Clock },
  { key: 'FACULTY_APPROVED', label: 'Faculty Approved', icon: UserCheck },
  { key: 'COMPANY_REVIEW', label: 'Company Review', icon: Building2 },
  { key: 'SHORTLISTED', label: 'Shortlisted', icon: CheckSquareIcon },
  { key: 'INTERVIEW', label: 'Interview', icon: PhoneCall },
  { key: 'SELECTED', label: 'Selected', icon: Award },
  { key: 'INTERNSHIP_ACTIVE', label: 'Active', icon: ShieldCheck },
  { key: 'COMPLETED', label: 'Completed', icon: Sparkles },
];

function CheckSquareIcon(props: any) {
  return <CheckCircle2 {...props} />;
}

export function ApplicationTimeline({
  status,
  rejectionReason,
  submittedAt,
  facultyApprovedAt,
  shortlistedAt,
  interviewDate,
  selectedAt,
}: ApplicationTimelineProps) {
  const normStatus = (status || '').toUpperCase();
  const isRejected = normStatus === 'REJECTED';

  const getStageIndex = (st: string) => {
    switch (st) {
      case 'APPLIED':
      case 'SUBMITTED':
        return 0;
      case 'FACULTY_REVIEW':
        return 1;
      case 'FACULTY_APPROVED':
        return 2;
      case 'COMPANY_REVIEW':
      case 'UNDER_REVIEW':
        return 3;
      case 'SHORTLISTED':
      case 'ASSESSMENT':
        return 4;
      case 'INTERVIEW':
        return 5;
      case 'SELECTED':
      case 'OFFER_ISSUED':
      case 'OFFER_ACCEPTED':
      case 'TNP_VERIFIED':
        return 6;
      case 'INTERNSHIP_ACTIVE':
      case 'JOINED':
      case 'IN_PROGRESS':
      case 'COMPLETION_PENDING':
        return 7;
      case 'COMPLETED':
      case 'CERTIFICATE':
      case 'CERTIFICATE_ISSUED':
        return 8;
      default:
        return 0;
    }
  };

  const currentIndex = getStageIndex(normStatus);

  return (
    <div className="space-y-4">
      {/* Rejection Alert Box */}
      {isRejected && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-950 flex items-start gap-2.5">
          <XCircle size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-rose-900 block">Application Declined</span>
            <p className="text-rose-800 leading-relaxed font-mono text-[11px]">
              {rejectionReason || 'Application was not moved forward by the review committee.'}
            </p>
          </div>
        </div>
      )}

      {/* Horizontal / Wrapped Timeline Stepper */}
      <div className="relative flex items-center justify-between w-full overflow-x-auto py-2 px-1">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isPassed = !isRejected && currentIndex > idx;
          const isCurrent = !isRejected && currentIndex === idx;
          const isFuture = !isRejected && currentIndex < idx;

          return (
            <div
              key={stage.key}
              className="flex-1 min-w-[70px] flex flex-col items-center relative group text-center"
            >
              {/* Connecting Line */}
              {idx > 0 && (
                <div
                  className={`absolute top-4 -left-1/2 right-1/2 h-0.5 -z-0 transition-colors ${
                    isPassed || isCurrent ? 'bg-slate-900' : 'bg-slate-200'
                  }`}
                />
              )}

              {/* Node Icon */}
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 transition-all ${
                  isPassed
                    ? 'bg-slate-900 text-white'
                    : isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                    : isRejected && idx === currentIndex
                    ? 'bg-rose-600 text-white ring-4 ring-rose-100'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isPassed ? <Check size={14} /> : <Icon size={14} />}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] sm:text-[11px] mt-2 tracking-tight line-clamp-1 ${
                  isCurrent
                    ? 'font-bold text-blue-700'
                    : isPassed
                    ? 'font-semibold text-slate-900'
                    : 'font-medium text-slate-400'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
