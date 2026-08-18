import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Search, 
  CheckSquare, 
  Bell, 
  User, 
  X, 
  GraduationCap, 
  BookOpen, 
  Building2, 
  Shield,
  FileText,
  Clock,
  Calendar,
  Award,
  Users,
  Inbox,
  BarChart,
  Briefcase,
  Settings
} from 'lucide-react';
import { Role } from './Sidebar';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role;
}

export function MobileNav({ isOpen, onClose, role }: MobileNavProps) {
  const location = useLocation();
  const pathname = location.pathname;

  // Determine nav items per role
  const getNavSections = () => {
    switch (role) {
      case 'STUDENT':
        return [
          {
            title: 'MAIN',
            items: [
              { href: '/student', label: 'Dashboard', icon: Home },
              { href: '/student/internships', label: 'Find Internships', icon: Search },
              { href: '/student/applications', label: 'Applications', icon: FileText },
              { href: '/student/active', label: 'My Internship', icon: Briefcase },
            ],
          },
          {
            title: 'INTERNSHIP',
            items: [
              { href: '/student/active/tasks', label: 'Tasks', icon: CheckSquare },
              { href: '/student/active/logs', label: 'Work Logs', icon: Clock },
              { href: '/student/active/reports', label: 'Weekly Reports', icon: FileText },
              { href: '/student/active/attendance', label: 'Attendance', icon: Calendar },
              { href: '/student/active/feedback', label: 'Feedback', icon: Inbox },
            ],
          },
          {
            title: 'ACCOUNT',
            items: [
              { href: '/student/certificates', label: 'Certificates', icon: Award },
              { href: '/student/profile', label: 'Profile', icon: User },
            ],
          },
        ];

      case 'FACULTY':
        return [
          {
            title: 'MAIN',
            items: [
              { href: '/faculty', label: 'Dashboard', icon: Home },
              { href: '/faculty/students', label: 'Students', icon: Users },
              { href: '/faculty/reports', label: 'Reports Queue', icon: Inbox },
              { href: '/faculty/analytics', label: 'Analytics', icon: BarChart },
            ],
          },
          {
            title: 'ACCOUNT',
            items: [{ href: '/faculty/profile', label: 'Profile', icon: User }],
          },
        ];

      case 'COMPANY_MENTOR':
        return [
          {
            title: 'MAIN',
            items: [
              { href: '/company', label: 'Dashboard', icon: Home },
              { href: '/company/interns', label: 'Interns', icon: Users },
              { href: '/company/applications', label: 'Applications', icon: FileText },
              { href: '/company/listings', label: 'Listings', icon: Briefcase },
            ],
          },
          {
            title: 'ACCOUNT',
            items: [{ href: '/company/profile', label: 'Profile', icon: User }],
          },
        ];

      case 'ADMIN':
        return [
          {
            title: 'MAIN',
            items: [
              { href: '/admin', label: 'Dashboard', icon: Home },
              { href: '/admin/students', label: 'Students', icon: Users },
              { href: '/admin/faculty', label: 'Faculty', icon: BookOpen },
              { href: '/admin/companies', label: 'Companies', icon: Building2 },
            ],
          },
          {
            title: 'MANAGEMENT',
            items: [
              { href: '/admin/internships', label: 'Internships', icon: Briefcase },
              { href: '/admin/certificates', label: 'Certificates', icon: Award },
            ],
          },
          {
            title: 'SYSTEM',
            items: [
              { href: '/admin/analytics', label: 'Analytics', icon: BarChart },
              { href: '/admin/settings', label: 'Settings', icon: Settings },
            ],
          },
        ];
    }
  };

  const sections = getNavSections();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white shadow-2xl flex flex-col justify-between z-10 border-r border-slate-200"
          >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--role-accent)] text-white flex items-center justify-center font-bold">
                  {role === 'STUDENT' && <GraduationCap size={18} />}
                  {role === 'FACULTY' && <BookOpen size={18} />}
                  {role === 'COMPANY_MENTOR' && <Building2 size={18} />}
                  {role === 'ADMIN' && <Shield size={18} />}
                </div>
                <div className="font-bold text-sm text-slate-900 leading-tight">ILMP Portal</div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Close navigation"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav Menu */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {sections.map((sec, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-3">
                    {sec.title}
                  </div>
                  <div className="space-y-0.5">
                    {sec.items.map((item) => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={onClose}
                          className={`flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-semibold min-h-[44px] transition-colors ${
                            isActive
                              ? 'bg-[var(--role-accent)] text-white font-bold'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 font-mono">
              <span>ILMP Academic Edition 2026</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default MobileNav;
