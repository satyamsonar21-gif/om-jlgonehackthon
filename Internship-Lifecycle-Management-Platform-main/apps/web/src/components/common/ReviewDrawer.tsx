import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle, FileText, Calendar, Building2, User } from "lucide-react";

export interface StudentReviewData {
  id: string;
  name: string;
  rollNo: string;
  company: string;
  weekNumber: number;
  workSummary: string;
  hoursLogged: number;
  riskStatus: "low" | "medium" | "high";
  mentorFeedback?: string;
}

interface ReviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: StudentReviewData | null;
  onApprove: (id: string) => void;
  onRequestRevision: (id: string, comment: string) => void;
}

export const ReviewDrawer: React.FC<ReviewDrawerProps> = ({
  isOpen,
  onClose,
  data,
  onApprove,
  onRequestRevision,
}) => {
  const [comment, setComment] = React.useState("");

  React.useEffect(() => {
    if (data?.mentorFeedback) {
      setComment(data.mentorFeedback);
    } else {
      setComment("");
    }
  }, [data]);

  if (!data) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="w-screen max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Week {data.weekNumber} Report
                    </span>
                    {data.riskStatus === "high" && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        <AlertTriangle className="w-3 h-3" /> Attention Required
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-1.5 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" /> {data.name}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono">PRN / Roll: {data.rollNo}</p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1 text-sm text-slate-700 dark:text-slate-300">
                {/* Meta details */}
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="text-slate-500">Company</div>
                      <div className="font-medium text-slate-800 dark:text-slate-200">{data.company}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="text-slate-500">Hours Logged</div>
                      <div className="font-medium text-slate-800 dark:text-slate-200">{data.hoursLogged} hrs / week</div>
                    </div>
                  </div>
                </div>

                {/* Log summary */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Weekly Submission Log
                  </h4>
                  <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 leading-relaxed whitespace-pre-wrap">
                    {data.workSummary}
                  </div>
                </div>

                {/* Mentor Feedback Input */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Mentor Remarks / Action Items
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="Enter actionable remarks or request modifications..."
                    className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600"
                  />
                </div>
              </div>

              {/* Drawer Action Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => onRequestRevision(data.id, comment)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Request Revision
                </button>
                <button
                  type="button"
                  onClick={() => onApprove(data.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs transition-transform active:scale-95 cursor-pointer"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Approve Log
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReviewDrawer;
