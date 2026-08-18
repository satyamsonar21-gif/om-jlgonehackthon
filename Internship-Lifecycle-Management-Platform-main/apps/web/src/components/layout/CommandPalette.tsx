import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ExternalLink
} from 'lucide-react';
import { demoStudents, demoInternships, demoCompanies, demoReports } from '@/data/demo';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: 'Students' | 'Internships' | 'Companies' | 'Reports' | 'Navigation';
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

  // Keyboard shortcut listener
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Index search data
  const results: SearchResult[] = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    const list: SearchResult[] = [];

    // System Navigation Shortcuts
    const navShortcuts: SearchResult[] = [
      { id: 'nav-1', title: 'Student Dashboard', subtitle: 'Overview, sprint progress & next action', category: 'Navigation', icon: GraduationCap, url: '/student' },
      { id: 'nav-2', title: 'Find Internships', subtitle: '32+ verified partner opportunities', category: 'Navigation', icon: Search, url: '/student/internships' },
      { id: 'nav-3', title: 'Daily Work Logs', subtitle: 'Log today deliverables and sprint tasks', category: 'Navigation', icon: Clock, url: '/student/active/logs' },
      { id: 'nav-4', title: 'Weekly Reports', subtitle: 'Submit weekly technical synthesis report', category: 'Navigation', icon: FileText, url: '/student/active/reports' },
      { id: 'nav-5', title: 'Faculty Dashboard', subtitle: 'Cohort monitoring and attention radar', category: 'Navigation', icon: Shield, url: '/faculty' },
      { id: 'nav-6', title: 'Faculty Review Queue', subtitle: 'Evaluate pending student submissions', category: 'Navigation', icon: FileText, url: '/faculty/reports' },
      { id: 'nav-7', title: 'Company Dashboard', subtitle: 'Active interns and candidate pipeline', category: 'Navigation', icon: Building2, url: '/company' },
      { id: 'nav-8', title: 'Post New Listing', subtitle: 'Create new internship opening', category: 'Navigation', icon: Briefcase, url: '/company/listings/new' },
      { id: 'nav-9', title: 'Admin Dashboard', subtitle: 'Campus-wide governance and audits', category: 'Navigation', icon: Shield, url: '/admin' },
      { id: 'nav-10', title: 'Verify Certificate', subtitle: 'Cryptographic Ed25519 credential check', category: 'Navigation', icon: Shield, url: '/verify/CERT-2026-001' },
    ];

    if (!q) {
      return navShortcuts.slice(0, 6);
    }

    // Filter Navigation
    navShortcuts.forEach((item) => {
      if (item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)) {
        list.push(item);
      }
    });

    // Filter Students
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
          subtitle: `${s.role} at ${s.company} · ${s.attendance}% Attendance`,
          category: 'Students',
          icon: GraduationCap,
          url: `/faculty/students/${s.id}`,
        });
      }
    });

    // Filter Internships
    demoInternships.forEach((job) => {
      if (
        job.role.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.domain.toLowerCase().includes(q) ||
        job.skills.some((sk) => sk.toLowerCase().includes(q))
      ) {
        list.push({
          id: `job-${job.id}`,
          title: job.role,
          subtitle: `${job.company} · ${job.location} · ${job.stipend}`,
          category: 'Internships',
          icon: Briefcase,
          url: `/student/internships/${job.id}`,
        });
      }
    });

    // Filter Companies
    demoCompanies.forEach((c) => {
      if (c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q)) {
        list.push({
          id: `comp-${c.id}`,
          title: c.name,
          subtitle: `${c.industry} · ${c.activeInternsCount} Active Interns`,
          category: 'Companies',
          icon: Building2,
          url: '/admin/companies',
        });
      }
    });

    // Filter Reports
    demoReports.forEach((r) => {
      if (r.title.toLowerCase().includes(q) || r.studentName.toLowerCase().includes(q)) {
        list.push({
          id: `report-${r.id}`,
          title: `Week ${r.weekNumber}: ${r.title}`,
          subtitle: `${r.studentName} (${r.companyName}) · ${r.status}`,
          category: 'Reports',
          icon: FileText,
          url: '/faculty/reports',
        });
      }
    });

    return list.slice(0, 10);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      navigate(results[selectedIndex].url);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelect = (result: SearchResult) => {
    navigate(result.url);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 pb-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-10 flex flex-col"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search students, internships, companies, reports, or navigate..."
                className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X size={14} />
                </button>
              )}
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200 hidden sm:inline-block">
                ESC
              </span>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-50">
              {results.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-500">
                  <p className="font-semibold text-slate-700">No results found for "{query}"</p>
                  <p className="mt-1">Try searching by student name, roll number, skill, or role title.</p>
                </div>
              ) : (
                results.map((item, idx) => {
                  const isSelected = selectedIndex === idx;
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-slate-100/90 text-slate-900'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-white shadow-xs text-[var(--role-accent)]' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-900 truncate">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">{item.subtitle}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {item.category}
                        </span>
                        <ArrowRight
                          size={13}
                          className={`transition-transform ${
                            isSelected ? 'translate-x-0.5 text-slate-800' : 'text-slate-300'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Navigation Guide */}
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <div className="flex items-center gap-3">
                <span><kbd className="px-1.5 py-0.5 bg-white border rounded text-[9px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white border rounded text-[9px]">↓</kbd> to navigate</span>
                <span><kbd className="px-1.5 py-0.5 bg-white border rounded text-[9px]">↵</kbd> to select</span>
              </div>
              <span>ILMP Fast Search</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CommandPalette;
