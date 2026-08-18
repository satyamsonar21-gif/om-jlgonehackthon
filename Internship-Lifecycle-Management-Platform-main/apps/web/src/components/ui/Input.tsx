import React from 'react';
import { cn } from '@/lib/utils';

// --- FormField Container ---
export interface FormFieldProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5 flex flex-col', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-xs font-semibold text-slate-700 flex items-center gap-1 select-none"
        >
          <span>{label}</span>
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-[11px] text-slate-500">{hint}</p>}
      {error && <p className="text-[11px] font-medium text-rose-600 animate-in fade-in">{error}</p>}
    </div>
  );
}

// --- Text Input ---
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, leftIcon, rightIcon, id, required, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const inputNode = (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 transition-colors focus:border-[var(--role-accent)] focus:ring-2 focus:ring-[var(--role-ring)] focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            error && 'border-rose-300 focus:border-rose-500 focus:ring-rose-200',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 text-slate-400 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
    );

    if (label || hint || error) {
      return (
        <FormField label={label} hint={hint} error={error} required={required} htmlFor={inputId}>
          {inputNode}
        </FormField>
      );
    }

    return inputNode;
  }
);
Input.displayName = 'Input';

// --- Textarea ---
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, id, required, rows = 3, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const textareaNode = (
      <textarea
        id={textareaId}
        ref={ref}
        rows={rows}
        className={cn(
          'w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-900 placeholder:text-slate-400 transition-colors focus:border-[var(--role-accent)] focus:ring-2 focus:ring-[var(--role-ring)] focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 resize-y',
          error && 'border-rose-300 focus:border-rose-500 focus:ring-rose-200',
          className
        )}
        {...props}
      />
    );

    if (label || hint || error) {
      return (
        <FormField label={label} hint={hint} error={error} required={required} htmlFor={textareaId}>
          {textareaNode}
        </FormField>
      );
    }

    return textareaNode;
  }
);
Textarea.displayName = 'Textarea';

// --- Select ---
export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options?: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, hint, error, options, children, id, required, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const selectNode = (
      <select
        id={selectId}
        ref={ref}
        className={cn(
          'w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 transition-colors focus:border-[var(--role-accent)] focus:ring-2 focus:ring-[var(--role-ring)] focus:outline-none cursor-pointer',
          error && 'border-rose-300 focus:border-rose-500 focus:ring-rose-200',
          className
        )}
        {...props}
      >
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
    );

    if (label || hint || error) {
      return (
        <FormField label={label} hint={hint} error={error} required={required} htmlFor={selectId}>
          {selectNode}
        </FormField>
      );
    }

    return selectNode;
  }
);
Select.displayName = 'Select';

// --- Checkbox ---
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const checkId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className="flex items-start gap-2.5">
        <input
          id={checkId}
          type="checkbox"
          ref={ref}
          className={cn(
            'mt-0.5 h-4 w-4 rounded border-slate-300 text-[var(--role-accent)] focus:ring-[var(--role-accent)] focus:ring-offset-0 cursor-pointer',
            className
          )}
          {...props}
        />
        {label && (
          <div className="text-xs">
            <label htmlFor={checkId} className="font-medium text-slate-800 cursor-pointer select-none">
              {label}
            </label>
            {description && <p className="text-slate-500 text-[11px] mt-0.5">{description}</p>}
          </div>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';
