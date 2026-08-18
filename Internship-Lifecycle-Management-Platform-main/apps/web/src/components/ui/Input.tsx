import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Search, Calendar, UploadCloud, X, Check, AlertCircle } from 'lucide-react';

// --- Validation Message ---
export function ValidationMessage({ message, type = 'error' }: { message?: string; type?: 'error' | 'warning' | 'info' }) {
  if (!message) return null;
  const colors = {
    error: 'text-rose-600',
    warning: 'text-amber-600',
    info: 'text-blue-600',
  };
  return (
    <p className={cn('text-[11px] font-medium flex items-center gap-1 mt-1 animate-in fade-in', colors[type])}>
      <AlertCircle size={12} className="flex-shrink-0" />
      <span>{message}</span>
    </p>
  );
}

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
      <ValidationMessage message={error} type="error" />
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
            'w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
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

// --- Search Input ---
export interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        leftIcon={<Search size={14} />}
        rightIcon={
          value && onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="text-slate-400 hover:text-slate-600 p-0.5"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          ) : undefined
        }
        value={value}
        onChange={onChange}
        className={className}
        {...props}
      />
    );
  }
);
SearchInput.displayName = 'SearchInput';

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
          'w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 resize-y',
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
          'w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none cursor-pointer',
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

// --- DatePicker Input ---
export interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, hint, error, id, required, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="date"
        label={label}
        hint={hint}
        error={error}
        id={id}
        required={required}
        leftIcon={<Calendar size={14} />}
        className={className}
        {...props}
      />
    );
  }
);
DatePicker.displayName = 'DatePicker';

// --- FileUpload ---
export interface FileUploadProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  accept?: string;
  maxSizeMb?: number;
  fileName?: string;
  onFileSelect?: (file: File | null) => void;
  className?: string;
}

export function FileUpload({
  label,
  hint,
  error,
  required,
  accept = '.pdf,.doc,.docx',
  maxSizeMb = 10,
  fileName,
  onFileSelect,
  className,
}: FileUploadProps) {
  const [selectedName, setSelectedName] = useState<string | undefined>(fileName);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedName(file.name);
      onFileSelect?.(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedName(undefined);
    onFileSelect?.(null);
  };

  return (
    <FormField label={label} hint={hint || `Accepted formats: ${accept} (Max ${maxSizeMb}MB)`} error={error} required={required} className={className}>
      <label className="relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer">
        <input type="file" accept={accept} onChange={handleChange} className="sr-only" />
        {selectedName ? (
          <div className="flex items-center gap-2 text-xs text-slate-800">
            <span className="font-semibold truncate max-w-xs">{selectedName}</span>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-200 cursor-pointer"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-center">
            <UploadCloud size={20} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-700">Click to upload document</span>
            <span className="text-[10px] text-slate-400">or drag and drop file here</span>
          </div>
        )}
      </label>
    </FormField>
  );
}

// --- MultiSelect ---
export interface MultiSelectProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  options: { label: string; value: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  className?: string;
}

export function MultiSelect({
  label,
  hint,
  error,
  required,
  options,
  selectedValues,
  onChange,
  className,
}: MultiSelectProps) {
  const toggleOption = (val: string) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((v) => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  return (
    <FormField label={label} hint={hint} error={error} required={required} className={className}>
      <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-white border border-slate-200 min-h-[38px]">
        {options.map((opt) => {
          const isSelected = selectedValues.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleOption(opt.value)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer select-none',
                isSelected
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
            >
              {isSelected && <Check size={12} />}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </FormField>
  );
}

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
            'mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer',
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
