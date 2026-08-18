import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface PriorityBannerProps {
  badgeText?: string;
  title: string;
  description: string;
  actionText: string;
  actionHref?: string;
  onActionClick?: () => void;
  actionIcon?: React.ReactNode;
  secondaryText?: string;
  secondaryHref?: string;
  onSecondaryClick?: () => void;
  type?: 'priority' | 'urgent' | 'info';
  deadline?: string;
  className?: string;
}

export function PriorityBanner({
  badgeText = 'TODAY’S PRIORITY',
  title,
  description,
  actionText,
  actionHref,
  onActionClick,
  actionIcon,
  secondaryText,
  secondaryHref,
  onSecondaryClick,
  type = 'priority',
  deadline,
  className,
}: PriorityBannerProps) {
  const typeConfig = {
    priority: {
      border: 'border-amber-200',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      badgeIcon: Sparkles,
    },
    urgent: {
      border: 'border-rose-200',
      badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
      badgeIcon: AlertTriangle,
    },
    info: {
      border: 'border-blue-200',
      badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
      badgeIcon: Clock,
    },
  };

  const currentConfig = typeConfig[type];
  const BadgeIcon = currentConfig.badgeIcon;

  return (
    <div
      className={cn(
        'bg-white border rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all',
        currentConfig.border,
        className
      )}
    >
      <div className="space-y-2 max-w-2xl">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border',
              currentConfig.badgeBg
            )}
          >
            <BadgeIcon size={12} />
            <span>{badgeText}</span>
          </span>

          {deadline && (
            <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
              <Clock size={11} />
              <span>{deadline}</span>
            </span>
          )}
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
          {title}
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed max-w-xl">{description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
        {actionHref ? (
          <Link to={actionHref}>
            <Button
              variant="primary"
              size="md"
              leftIcon={actionIcon}
              rightIcon={<ArrowRight size={14} />}
            >
              {actionText}
            </Button>
          </Link>
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={onActionClick}
            leftIcon={actionIcon}
            rightIcon={<ArrowRight size={14} />}
          >
            {actionText}
          </Button>
        )}

        {secondaryText && (
          secondaryHref ? (
            <Link to={secondaryHref}>
              <Button variant="secondary" size="md">
                {secondaryText}
              </Button>
            </Link>
          ) : (
            <Button variant="secondary" size="md" onClick={onSecondaryClick}>
              {secondaryText}
            </Button>
          )
        )}
      </div>
    </div>
  );
}

export default PriorityBanner;
