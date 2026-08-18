import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  GraduationCap,
  Briefcase,
  Building2,
  FileText,
  CheckSquare,
  ArrowRight,
  Clock,
  Shield,
  X,
  Award,
  BarChart,
  Settings,
  User,
  Inbox,
  AlertTriangle,
} from 'lucide-react';
import { getRoleFromPath, type RoleKey } from '@/design-system/tokens';
import { demoStudents, demoInternships, demoCompanies, demoReports } from '@/data/demo';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: 'Navigation' | 'Internships' | 'Students' | 'Companies' | 'Reports' | 'Governance';
  icon: React.ElementType;
  url: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentRole = getRoleFromPath(location.pathname);

  // Focus on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 40);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Index role-aware search records
  const results: SearchResult[] = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    const list: SearchResult[] = [];

    // 1. Role-aware navigation shortcuts
    const allNavShortcuts: { role: RoleKey[]; item: SearchResult }[] = [
      // Student Shortcuts
      {
        role: ['student'],
        item: { id: 'nav-stu-home', title: 'Student Dashboard', subtitle: 'Overview, sprint metrics & next milestone', category: 'Navigation', icon: GraduationCap, url: '/student' },
      },
      {
        role: ['student'],
        item: { id: 'nav-stu-jobs', title: 'Find Internships', subtitle: 'Search verified corporate placement listings', category: 'Navigation', icon: Search, url: '/student/internships' },
      },
      {
        role: ['student'],
        item: { id: 'nav-stu-apps', title: 'My Applications', subtitle: 'Track submission stage & interview status', category: 'Navigation', icon: FileText, url: '/student/applications' },
      },
      {
        role: ['student'],
        item: { id: 'nav-stu-logs', title: 'Daily Work Logs', subtitle: 'Record hours worked and learning achievements', category: 'Navigation', icon: Clock, url: '/student/active/logs' },
      },
      {
        role: ['student'],
        item: { id: 'nav-stu-reports', title: 'Weekly Reports', subtitle: 'Draft and submit weekly technical synthesis', category: 'Navigation', icon: FileText, url: '/student/active/reports' },
      },
      {
        role: ['student'],
        item: { id: 'nav-stu-certs', title: 'Issued Certificates', subtitle: 'View tamper-proof credentials with QR verification', category: 'Navigation', icon: Award, url: '/student/certificates' },
      },
      {
        role: ['student'],
        item: { id: 'nav-stu-profile', title: 'Profile & Resume', subtitle: 'Manage portfolio, skills and completion rating', category: 'Navigation', icon: User, url: '/student/profile' },
      },

      // Faculty Shortcuts
      {
        role: ['faculty'],
        item: { id: 'nav-fac-home', title: 'Faculty Guide Dashboard', subtitle: 'Cohort monitoring and attention radar', category: 'Navigation', icon: Shield, url: '/faculty' },
      },
      {
        role: ['faculty'],
        item: { id: 'nav-fac-students', title: 'Monitored Students', subtitle: 'View student dossiers, attendance & progress', category: 'Navigation', icon: GraduationCap, url: '/faculty/students' },
      },
      {
        role: ['faculty'],
        item: { id: 'nav-fac-reports', title: 'Weekly Report Review Queue', subtitle: 'Grade pending student synthesis submissions', category: 'Navigation', icon: Inbox, url: '/faculty/reports' },
      },
      {
        role: ['faculty'],
        item: { id: 'nav-fac-analytics', title: 'Department Analytics', subtitle: 'Placement benchmarks and attendance trends', category: 'Navigation', icon: BarChart, url: '/faculty/analytics' },
      },

      // Company Mentor Shortcuts
      {
        role: ['company'],
        item: { id: 'nav-comp-home', title: 'Company Overview', subtitle: 'Active interns and candidate pipeline', category: 'Navigation', icon: Building2, url: '/company' },
      },
      {
        role: ['company'],
        item: { id: 'nav-comp-listings', title: 'Internship Listings', subtitle: 'Manage active job postings and requirements', category: 'Navigation', icon: Briefcase, url: '/company/listings' },
      },
      {
        role: ['company'],
        item: { id: 'nav-comp-new', title: 'Post New Internship', subtitle: 'Create a new verified corporate internship listing', category: 'Navigation', icon: Briefcase, url: '/company/listings/new' },
      },
      {
        role: ['company'],
        item: { id: 'nav-comp-interns', title: 'Active Interns', subtitle: 'Monitor deliverables, tasks & sprint milestones', category: 'Navigation', icon: CheckSquare, url: '/company/interns' },
      },

      // Admin Shortcuts
      {
        role: ['admin'],
        item: { id: 'nav-adm-home', title: 'Institutional Admin Console', subtitle: 'Campus-wide governance and macro KPIs', category: 'Navigation', icon: Shield, url: '/admin' },
      },
      {
        role: ['admin'],
        item: { id: 'nav-adm-analytics', title: 'Placement Analytics', subtitle: '7-dimension institutional benchmarks and skill gaps', category: 'Navigation', icon: BarChart, url: '/admin/analytics' },
      },
      {
        role: ['admin'],
        item: { id: 'nav-adm-audit', title: 'Compliance & Audit Ledger', subtitle: 'Immutable ledger recording privileged mutations', category: 'Navigation', icon: Shield, url: '/admin/audit-logs' },
      },
      {
        role: ['admin'],
        item: { id: 'nav-adm-certs', title: 'Certificate Registry', subtitle: 'Batch cryptographic approval & signature verify', category: 'Navigation', icon: Award, url: '/admin/certificates' },
      },
      {
        role: ['admin'],
        item: { id: 'nav-adm-companies', title: 'Partner MoUs', subtitle: 'Accredited employer verification agreements', category: 'Navigation', icon: Building2, url: '/admin/companies' },
      },
    ];

    const authorizedShortcuts = allNavShortcuts
      .filter((s) => s.role.includes(currentRole))
      .map((s) => s.item);

    if (!q) {
      return authorizedShortcuts.slice(0, 6);
    }

    // Filter Navigation
    authorizedShortcuts.forEach((item) => {
      if (item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)) {
        list.push(item);
      }
    });

    // 2. Filter Internships (Available to Student, Company, Admin)
    if (['student', 'company', 'admin'].includes(currentRole)) {
      demoInternships.forEach((job) => {
        if (
          job.role.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.skills.some((s) => s.toLowerCase().includes(q)) ||
          job.location.toLowerCase().includes(q)
        ) {
          list.push({
            id: `job-${job.id}`,
            title: `${job.role} at ${job.company}`,
            subtitle: `${job.type} · ${job.stipend} · ${job.skills.slice(0, 3).join(', ')}`,
            category: 'Internships',
            icon: Briefcase,
            url: currentRole === 'student' ? `/student/internships/${job.id}` : `/company/listings`,
          });
        }
      });
    }

    // 3. Filter Students (Only for Faculty and Admin)
    if (['faculty', 'admin'].includes(currentRole)) {
      demoStudents.forEach((s) => {
        if (
          s.name.toLowerCase().includes(q) ||
          s.roll.toLowerCase().includes(q) ||
          s.dept.toLowerCase().includes(q) ||
          s.company.toLowerCase().includes(q)
        ) {
          list.push({
            id: `student-${s.id}`,
            title: `${s.name} (${s.roll})`,
            subtitle: `${s.dept} · ${s.role} at ${s.company} · ${s.attendance}% Attendance`,
            category: 'Students',
            icon: GraduationCap,
            url: `/faculty/students/${s.id}`,
          });
        }
      });
    }

    // 4. Filter Companies (Available to all authorized)
    if (['admin', 'faculty', 'student'].includes(currentRole)) {
      demoCompanies.forEach((c) => {
        if (c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q)) {
          list.push({
            id: `company-${c.id}`,
            title: c.name,
            subtitle: `${c.industry} · ${c.activeInternsCount} Active Interns · ${c.rating}★ Rating`,
            category: 'Companies',
            icon: Building2,
            url: currentRole === 'admin' ? `/admin/companies` : `/student/internships`,
          });
        }
      });
    }

    return list.slice(0, 8);
  }, [query, currentRole]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex].url);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleSelect = (url: string) => {
    navigate(url);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex items-start justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Dialog Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 text-slate-900"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-white">
              <Search size={18} className="text-slate-400 mr-3 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search pages, internships, students..."
                className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-50">
              {results.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 space-y-1">
                  <Search size={24} className="mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-600">No results found</p>
                  <p className="text-[11px] text-slate-400">
                    Try searching for a different keyword or navigating directly from the sidebar.
                  </p>
                </div>
              ) : (
                results.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item.url)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-3 text-xs cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold truncate">{item.title}</span>
                            <span
                              className={`px-1.5 py-0.2 text-[9px] font-mono rounded font-semibold uppercase tracking-wider ${
                                isSelected
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {item.category}
                            </span>
                          </div>
                          <p
                            className={`text-[11px] truncate mt-0.5 ${
                              isSelected ? 'text-slate-300' : 'text-slate-500'
                            }`}
                          >
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <ArrowRight
                        size={14}
                        className={`flex-shrink-0 transition-transform ${
                          isSelected
                            ? 'text-white translate-x-0.5'
                            : 'text-slate-400'
                        }`}
                      />
                    </button>
                  );
                })
              )}
            </div>

            {/* Keyboard Shortcuts Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <div className="flex items-center gap-2">
                <span>Navigate:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 shadow-2xs text-[10px]">
                  ↑
                </kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 shadow-2xs text-[10px]">
                  ↓
                </kbd>
                <span className="ml-2">Select:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 shadow-2xs text-[10px]">
                  ↵ Enter
                </kbd>
              </div>

              <div className="flex items-center gap-1.5">
                <span>Close:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 shadow-2xs text-[10px]">
                  Esc
                </kbd>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
