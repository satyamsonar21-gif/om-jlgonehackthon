import React from 'react';
import { cn } from '@/lib/utils';
import { Inbox, AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center my-auto',
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mb-3.5 shadow-xs">
        <Icon size={24} />
      </div>
      <h4 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h4>
      {description && (
        <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Failed to load information',
  message = 'An unexpected error occurred while communicating with university servers.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'p-6 sm:p-8 rounded-2xl bg-rose-50/50 border border-rose-200 text-center flex flex-col items-center justify-center space-y-3 my-4',
        className
      )}
    >
      <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
        <AlertTriangle size={20} />
      </div>
      <div className="space-y-1 max-w-md">
        <h4 className="text-sm font-bold text-rose-950">{title}</h4>
        <p className="text-xs text-rose-800 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry}
          leftIcon={<RotateCcw size={13} />}
          className="bg-white border-rose-300 text-rose-800 hover:bg-rose-100/50 text-xs"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
