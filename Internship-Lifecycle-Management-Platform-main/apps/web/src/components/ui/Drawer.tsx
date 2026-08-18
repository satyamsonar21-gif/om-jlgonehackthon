import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  position?: 'right' | 'left';
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  full: 'max-w-full',
};

export function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  position = 'right',
  size = 'md',
  className,
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const slideX = position === 'right' ? '100%' : '-100%';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          <div
            className={cn(
              'fixed inset-y-0 flex max-w-full pointer-events-none',
              position === 'right' ? 'right-0 pl-10' : 'left-0 pr-10'
            )}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ x: slideX }}
              animate={{ x: 0 }}
              exit={{ x: slideX }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className={cn(
                'w-screen bg-white shadow-2xl border-slate-200 pointer-events-auto flex flex-col justify-between',
                position === 'right' ? 'border-l' : 'border-r',
                sizeMap[size],
                className
              )}
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between flex-shrink-0">
                <div>
                  {title && (
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer ml-3"
                  aria-label="Close drawer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 overflow-y-auto flex-1">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default Drawer;
