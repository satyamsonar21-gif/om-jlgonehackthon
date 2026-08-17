import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, fmt = 'MMM dd, yyyy') {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, fmt);
}

export function formatRelative(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

export function getStatusColor(status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  const map: Record<string, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
    ACTIVE: 'success',
    COMPLETED: 'success',
    APPROVED: 'success',
    SELECTED: 'success',
    FACULTY_APPROVED: 'info',
    SUBMITTED: 'info',
    UNDER_REVIEW: 'info',
    OPEN: 'info',
    IN_PROGRESS: 'warning',
    REVISION_REQUESTED: 'warning',
    PENDING: 'warning',
    REJECTED: 'error',
    FACULTY_REJECTED: 'error',
    TERMINATED: 'error',
    CLOSED: 'neutral',
    DRAFT: 'neutral',
    ABSENT: 'error',
    PRESENT: 'success',
    HALF_DAY: 'warning',
    LEAVE: 'neutral',
  };
  return map[status] || 'neutral';
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    FACULTY_APPROVED: 'Faculty Approved',
    FACULTY_REJECTED: 'Faculty Rejected',
    UNDER_REVIEW: 'Under Review',
    IN_PROGRESS: 'In Progress',
    REVISION_REQUESTED: 'Revision Needed',
    COMPANY_MENTOR: 'Company Mentor',
    PLACEMENT_CELL: 'Placement Cell',
    HALF_DAY: 'Half Day',
    MID_TERM: 'Mid-term',
    REMOTE: 'Remote',
    ONSITE: 'On-site',
  };
  return map[status] || status.charAt(0) + status.slice(1).toLowerCase();
}

export function calculatePlacementScore(data: {
  attendancePercentage: number;
  reportSubmissionRate: number;
  taskCompletionRate: number;
  companyFeedbackScore: number;
  facultyEvaluationScore: number;
  profileCompleteness: number;
}): number {
  const normalizedFeedback = (data.companyFeedbackScore / 5) * 100;
  const normalizedFaculty = (data.facultyEvaluationScore / 5) * 100;
  const score =
    data.attendancePercentage * 0.2 +
    data.reportSubmissionRate * 0.15 +
    data.taskCompletionRate * 0.15 +
    normalizedFeedback * 0.25 +
    normalizedFaculty * 0.15 +
    data.profileCompleteness * 0.1;
  return Math.round(score * 100) / 100;
}

export function getScoreColor(score: number) {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-amber-500';
  return 'text-rose-500';
}

export function getScoreBg(score: number) {
  if (score >= 80) return 'from-emerald-500 to-emerald-600';
  if (score >= 60) return 'from-amber-500 to-amber-600';
  return 'from-rose-500 to-rose-600';
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function truncate(str: string, len = 100) {
  return str.length > len ? str.substring(0, len) + '…' : str;
}
