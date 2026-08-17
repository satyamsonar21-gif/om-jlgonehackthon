import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Send, CheckCircle, UserPlus, Briefcase, ClipboardCheck, Award, LucideIcon } from 'lucide-react';

export interface LifecycleRailProps {
  currentStage?: number;
  onStageClick?: (stageIndex: number) => void;
  variant?: 'full' | 'compact';
  className?: string;
  showLabel?: boolean;
  contextLabel?: string;
}

interface StageData {
  name: string;
  label: string;
  icon: LucideIcon;
}

const STAGES: StageData[] = [
  { name: 'DISCOVER', label: 'Discover', icon: Search },
  { name: 'APPLY', label: 'Apply', icon: Send },
  { name: 'SELECT', label: 'Select', icon: CheckCircle },
  { name: 'ONBOARD', label: 'Onboard', icon: UserPlus },
  { name: 'WORK', label: 'Work Log', icon: Briefcase },
  { name: 'REVIEW', label: 'Review', icon: ClipboardCheck },
  { name: 'CERTIFY', label: 'Certify', icon: Award },
];

export const LifecycleRail: React.FC<LifecycleRailProps> = ({
  currentStage = 4,
  onStageClick,
  variant = 'full',
  className = '',
  showLabel = true,
  contextLabel,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const isFull = variant === 'full';

  return (
    <div 
      className={`w-full overflow-x-auto py-8 rounded-2xl border shadow-md px-6 ${className}`}
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        color: 'var(--text)',
      }}
    >
      <div className="flex items-center min-w-max mx-auto justify-center">
        {STAGES.map((stage, index) => {
          const isCompleted = index < currentStage;
          const isActive = index === currentStage;
          const isFuture = index > currentStage;
          const Icon = stage.icon;

          return (
            <React.Fragment key={stage.name}>
              {/* Connecting Line Segment */}
              {index > 0 && (
                <div 
                  className="flex-1 min-w-[36px] sm:min-w-[64px] h-[3px] mx-1 relative overflow-hidden rounded-full"
                  style={{ backgroundColor: 'var(--surface-muted)' }}
                >
                  <motion.div
                    className="absolute top-0 left-0 h-full"
                    style={{ backgroundColor: 'var(--highlights, var(--cta))' }}
                    initial={{ width: '0%' }}
                    animate={{ width: index <= currentStage ? '100%' : '0%' }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                </div>
              )}

              {/* Stage Node */}
              <div 
                className="relative flex flex-col items-center cursor-pointer group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onStageClick?.(index)}
              >
                <motion.div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                    isActive 
                      ? 'shadow-md ring-4' 
                      : isCompleted 
                        ? 'shadow-xs' 
                        : 'opacity-50'
                  }`}
                  style={{
                    backgroundColor: isActive 
                      ? 'var(--cta)' 
                      : isCompleted 
                        ? 'var(--primary)' 
                        : 'var(--surface-muted)',
                    color: isActive 
                      ? 'var(--cta-text)' 
                      : isCompleted 
                        ? '#FFFFFF' 
                        : 'var(--text-muted)',
                    borderColor: 'var(--border)',
                    boxShadow: isActive ? '0 0 0 4px var(--ring-color)' : undefined
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={18} />
                </motion.div>

                {/* Stage Label */}
                {showLabel && isFull && (
                  <div className="mt-3 text-center">
                    <span 
                      className={`text-xs font-semibold block transition-colors ${
                        isActive ? 'font-bold' : ''
                      }`}
                      style={{
                        color: isActive 
                          ? 'var(--highlights, var(--cta))' 
                          : isCompleted 
                            ? 'var(--text)' 
                            : 'var(--text-muted)'
                      }}
                    >
                      {stage.label}
                    </span>
                    <span className="text-[10px] font-mono opacity-50 block mt-0.5">
                      Stage 0{index + 1}
                    </span>
                  </div>
                )}

                {/* Active Indicator Pulse Ring */}
                {isActive && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2"
                    style={{ 
                      backgroundColor: 'var(--cta)',
                      borderColor: 'var(--surface)'
                    }}
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default LifecycleRail;
