import React from 'react';
import { cn } from '@/lib/utils';

export type StatusType =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'approved'
  | 'pending'
  | 'rejected'
  | 'in-progress'
  | 'completed'
  | 'active'
  | 'at-risk'
  | 'watch';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: StatusType;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const statusStyles: Record<StatusType, { bg: string; text: string; border: string; dot: string }> = {
  success: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  approved: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  completed: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  active: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  warning: {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  watch: {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  danger: {
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
  },
  rejected: {
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
  },
  'at-risk': {
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  'in-progress': {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  neutral: {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
  },
};

export function Badge({
  variant = 'neutral',
  size = 'md',
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  const normalizedVariant = (variant?.toLowerCase() || 'neutral') as StatusType;
  const config = statusStyles[normalizedVariant] || statusStyles.neutral;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-mono font-medium rounded-full border select-none',
        config.bg,
        config.text,
        config.border,
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs',
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dot)} />}
      <span>{children}</span>
    </span>
  );
}

export function StatusBadge({
  status,
  size = 'md',
  dot = true,
  className,
}: {
  status: string;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}) {
  const cleanStatus = status.replace(/_/g, ' ');
  let variant: StatusType = 'neutral';

  const s = status.toUpperCase();
  if (['ACTIVE', 'COMPLETED', 'APPROVED', 'SELECTED', 'ON_TRACK', 'PRESENT'].includes(s)) {
    variant = 'success';
  } else if (['PENDING', 'WATCH', 'UNDER_REVIEW', 'HALF_DAY', 'DUE'].includes(s)) {
    variant = 'warning';
  } else if (['REJECTED', 'AT_RISK', 'ABSENT', 'INTERVENTION', 'TERMINATED'].includes(s)) {
    variant = 'danger';
  } else if (['SUBMITTED', 'IN_PROGRESS', 'OPEN'].includes(s)) {
    variant = 'info';
  }

  return (
    <Badge variant={variant} size={size} dot={dot} className={className}>
      {cleanStatus.charAt(0).toUpperCase() + cleanStatus.slice(1).toLowerCase()}
    </Badge>
  );
}

export default Badge;
