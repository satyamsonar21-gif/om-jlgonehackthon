import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';

// --- Base Card ---
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs text-slate-900 transition-all duration-150',
        hover && 'hover:border-slate-300 hover:shadow-sm',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-start justify-between gap-4 mb-4 pb-1', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug', className)} {...props} />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-xs text-slate-500 mt-0.5 leading-relaxed', className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-4', className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs', className)}
      {...props}
    />
  );
}

// --- Stat Card ---
export interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ElementType;
  iconColor?: string;
  className?: string;
  badge?: string;
}

export function StatCard({
  label,
  value,
  sublabel,
  change,
  trend = 'neutral',
  icon: Icon,
  iconColor,
  badge,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('p-5 flex flex-col justify-between space-y-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        {Icon && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: 'var(--surface-muted, #F1F5F9)',
              color: iconColor || 'var(--role-accent, #2563EB)',
            }}
          >
            <Icon size={16} />
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">{value}</div>
        {(sublabel || change) && (
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
            {change && (
              <span
                className={cn(
                  'font-semibold inline-flex items-center gap-0.5',
                  trend === 'up' && 'text-emerald-600',
                  trend === 'down' && 'text-rose-600',
                  trend === 'neutral' && 'text-slate-600'
                )}
              >
                {trend === 'up' && <TrendingUp size={12} />}
                {trend === 'down' && <TrendingDown size={12} />}
                {trend === 'neutral' && <Minus size={12} />}
                {change}
              </span>
            )}
            {sublabel && <span className="truncate">{sublabel}</span>}
          </div>
        )}
      </div>

      {badge && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono font-medium text-slate-400">
          <span>{badge}</span>
        </div>
      )}
    </Card>
  );
}

// --- Action Card ---
export interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick?: () => void;
  href?: string;
  badge?: string;
  className?: string;
}

export function ActionCard({
  title,
  description,
  icon: Icon,
  onClick,
  badge,
  className,
}: ActionCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group p-4 rounded-xl border border-slate-200 bg-white hover:border-[var(--role-accent)] hover:shadow-xs transition-all duration-150 cursor-pointer flex items-start gap-3.5 select-none',
        className
      )}
    >
      <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 text-[var(--role-accent)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--role-accent-light)] transition-colors">
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-bold text-slate-900 group-hover:text-[var(--role-accent)] transition-colors">
            {title}
          </h4>
          {badge && (
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {badge}
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
      <ArrowRight size={14} className="text-slate-300 group-hover:text-[var(--role-accent)] group-hover:translate-x-0.5 transition-all mt-1 flex-shrink-0" />
    </div>
  );
}
