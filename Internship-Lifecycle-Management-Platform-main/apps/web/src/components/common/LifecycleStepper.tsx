import React from "react";
import { Check, Clock, AlertCircle } from "lucide-react";

export type StepState = "completed" | "current" | "upcoming" | "action_needed";

export interface LifecycleStep {
  id: string;
  title: string;
  subtitle: string;
  status: StepState;
  date?: string;
}

interface LifecycleStepperProps {
  steps: LifecycleStep[];
  className?: string;
  onStepClick?: (step: LifecycleStep) => void;
}

export const LifecycleStepper: React.FC<LifecycleStepperProps> = ({ steps, className = "", onStepClick }) => {
  return (
    <div className={`w-full py-4 ${className}`}>
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between w-full relative">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;

            return (
              <li 
                key={step.id} 
                className={`relative flex-1 ${!isLast ? "pr-8" : ""} ${onStepClick ? "cursor-pointer" : ""}`}
                onClick={() => onStepClick?.(step)}
              >
                {/* Connecting Line */}
                {!isLast && (
                  <div
                    className={`absolute top-4 left-7 right-0 h-0.5 -translate-y-1/2 transition-colors ${
                      step.status === "completed"
                        ? "bg-emerald-500 dark:bg-emerald-600"
                        : "bg-slate-200 dark:bg-slate-800"
                    }`}
                  />
                )}

                <div className="group relative flex flex-col items-start">
                  {/* Step Icon Badge */}
                  <span className="flex items-center h-8">
                    {step.status === "completed" && (
                      <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-emerald-500 text-white rounded-full shadow-xs">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </span>
                    )}
                    {step.status === "current" && (
                      <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-full shadow-xs ring-4 ring-indigo-100 dark:ring-indigo-950">
                        <Clock className="w-4 h-4 animate-pulse" />
                      </span>
                    )}
                    {step.status === "action_needed" && (
                      <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-amber-500 text-white rounded-full shadow-xs ring-4 ring-amber-100 dark:ring-amber-950">
                        <AlertCircle className="w-4 h-4" />
                      </span>
                    )}
                    {step.status === "upcoming" && (
                      <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-400 rounded-full">
                        <span className="w-2 h-2 bg-slate-300 dark:bg-slate-700 rounded-full" />
                      </span>
                    )}
                  </span>

                  {/* Step Text Labels */}
                  <div className="mt-2">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {step.title}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      {step.subtitle}
                    </p>
                    {step.date && (
                      <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">
                        {step.date}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default LifecycleStepper;
