import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  Activity, 
  Calendar, 
  Clock, 
  CheckSquare, 
  MessageSquare, 
  Award, 
  User, 
  Users, 
  Inbox, 
  BarChart, 
  Briefcase, 
  Settings, 
  BookOpen, 
  Building2, 
  GraduationCap, 
  Shield,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { SafeUserButton } from '@/lib/clerk-provider';
import { useSidebar } from './SidebarContext';

export type Role = 'STUDENT' | 'FACULTY' | 'COMPANY_MENTOR' | 'ADMIN';

interface SidebarProps {
  role: Role;
}

export function Sidebar({ role }: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const { isCollapsed, toggleSidebar } = useSidebar();

  // STUDENT SIDEBAR
  if (role === 'STUDENT') {
    const navItems = [
      { href: '/student', label: 'Launch Overview', icon: LayoutDashboard },
      { href: '/student/internships', label: 'Discover Roles', icon: Search },
      { href: '/student/applications', label: 'Applications', icon: FileText },
      { href: '/student/active', label: 'Active Internship', icon: Activity },
      { href: '/student/active/logs', label: 'Daily Work Logs', icon: Clock },
      { href: '/student/active/reports', label: 'Weekly Reports', icon: FileText },
      { href: '/student/active/attendance', label: 'Attendance', icon: Calendar },
      { href: '/student/active/tasks', label: 'Assigned Tasks', icon: CheckSquare },
      { href: '/student/active/feedback', label: 'Mentor Feedback', icon: MessageSquare },
      { href: '/student/certificates', label: 'Certificates', icon: Award },
      { href: '/student/profile', label: 'My Profile & Dossier', icon: User },
    ];

    return (
      <aside 
        className={`${isCollapsed ? 'w-20' : 'w-64'} flex-shrink-0 flex flex-col bg-[#F8FAFC] dark:bg-[#090D16] border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out text-slate-800 dark:text-slate-200 select-none z-30`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#C2410C] to-[#EA580C] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <GraduationCap size={20} />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 transition-opacity duration-200">
                <div className="font-bold tracking-tight text-slate-900 dark:text-white leading-tight truncate">ILMP Launchpad</div>
                <div className="text-[10px] font-mono font-bold text-[#C2410C] dark:text-[#FB923C] uppercase tracking-wider truncate">Student Portal</div>
              </div>
            )}
          </div>
          
          <button
            onClick={toggleSidebar}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                to={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`relative flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3.5'} py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive 
                    ? 'text-white font-bold bg-[#C2410C] shadow-sm' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </div>

        <div className={`p-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} bg-white/50 dark:bg-slate-900/50`}>
          <SafeUserButton role={role} />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">Priya Sharma</div>
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">20CS101 · CSE Tier-1</div>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // FACULTY SIDEBAR
  if (role === 'FACULTY') {
    const navItems = [
      { href: '/faculty', label: 'Observatory', icon: LayoutDashboard },
      { href: '/faculty/students', label: 'Supervised Cohort', icon: Users, badge: '42' },
      { href: '/faculty/reports', label: 'Review Queue', icon: Inbox, badge: '5' },
      { href: '/faculty/analytics', label: 'Cohort Analytics', icon: BarChart },
      { href: '/faculty/profile', label: 'Faculty Profile', icon: User },
    ];

    return (
      <aside 
        className={`${isCollapsed ? 'w-20' : 'w-64'} flex-shrink-0 flex flex-col bg-[#F4FBF7] dark:bg-[#061811] border-r border-[#D1FAE5]/60 dark:border-emerald-950/60 transition-all duration-300 ease-in-out text-[#064E3B] dark:text-emerald-100 select-none z-30`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#D1FAE5]/80 dark:border-emerald-950 bg-white/80 dark:bg-emerald-950/40 backdrop-blur-md">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#064E3B] to-[#059669] text-[#FBB02D] flex items-center justify-center flex-shrink-0 shadow-sm">
              <BookOpen size={20} />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 transition-opacity duration-200">
                <div className="font-bold tracking-tight text-[#064E3B] dark:text-white leading-tight truncate">ILMP Faculty</div>
                <div className="text-[10px] font-mono font-bold text-[#059669] dark:text-emerald-400 uppercase tracking-wider truncate">Academic Guide</div>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className="p-1.5 rounded-lg text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                to={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-3.5'} py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive 
                    ? 'text-white font-bold bg-[#059669] shadow-sm' 
                    : 'text-[#064E3B] dark:text-emerald-200 hover:bg-[#D1FAE5]/60 dark:hover:bg-emerald-900/40 hover:text-[#022C22]'
                }`}
              >
                <div className="flex items-center min-w-0">
                  <item.icon className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0 ${isActive ? 'text-[#FBB02D]' : 'text-[#059669] dark:text-emerald-400'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!isCollapsed && item.badge && (
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-[#FBB02D] text-[#081C15]' : 'bg-[#D1FAE5] dark:bg-emerald-900 text-[#064E3B] dark:text-emerald-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className={`p-3.5 border-t border-[#D1FAE5]/80 dark:border-emerald-950 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} bg-white/60 dark:bg-emerald-950/40`}>
          <SafeUserButton role={role} />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-[#064E3B] dark:text-white truncate">Dr. Rajesh Kumar</div>
              <div className="text-[10px] font-mono text-[#059669] dark:text-emerald-400 truncate">Dept. of CSE</div>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // COMPANY SIDEBAR
  if (role === 'COMPANY_MENTOR') {
    const navItems = [
      { href: '/company', label: 'Mission Control', icon: LayoutDashboard },
      { href: '/company/listings', label: 'Internship Listings', icon: Briefcase },
      { href: '/company/applications', label: 'Applications', icon: Users, badge: '52' },
      { href: '/company/interns', label: 'Active Interns', icon: User, badge: '16' },
      { href: '/company/profile', label: 'Company Profile', icon: Building2 },
    ];

    return (
      <aside 
        className={`${isCollapsed ? 'w-20' : 'w-64'} flex-shrink-0 flex flex-col bg-[#F8FAFF] dark:bg-[#0B091E] border-r border-[#E0E7FF]/70 dark:border-indigo-950 transition-all duration-300 ease-in-out text-[#1E1B4B] dark:text-indigo-200 select-none z-30`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#E0E7FF] dark:border-indigo-950 bg-white/80 dark:bg-indigo-950/40 backdrop-blur-md">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1E1B4B] to-[#4F46E5] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Building2 size={20} />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 transition-opacity duration-200">
                <div className="font-bold tracking-tight text-[#1E1B4B] dark:text-white leading-tight truncate">TechCorp Hub</div>
                <div className="text-[10px] font-mono font-bold text-[#4F46E5] dark:text-indigo-400 uppercase tracking-wider truncate">Industry Portal</div>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className="p-1.5 rounded-lg text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/60 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                to={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-3.5'} py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive 
                    ? 'text-white font-bold bg-[#4F46E5] shadow-sm' 
                    : 'text-[#1E1B4B] dark:text-indigo-200 hover:bg-[#E0E7FF]/60 dark:hover:bg-indigo-900/40 hover:text-[#0F0E26]'
                }`}
              >
                <div className="flex items-center min-w-0">
                  <item.icon className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0 ${isActive ? 'text-indigo-200' : 'text-[#4F46E5] dark:text-indigo-400'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!isCollapsed && item.badge && (
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-indigo-100 text-[#1E1B4B]' : 'bg-[#E0E7FF] dark:bg-indigo-900 text-[#4F46E5] dark:text-indigo-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className={`p-3.5 border-t border-[#E0E7FF] dark:border-indigo-950 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} bg-white/60 dark:bg-indigo-950/40`}>
          <SafeUserButton role={role} />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-[#1E1B4B] dark:text-white truncate">TechCorp Solutions</div>
              <div className="text-[10px] font-mono text-[#4F46E5] dark:text-indigo-400 truncate">Partner ID: #TC-2026</div>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // ADMIN SIDEBAR
  const navItems = [
    { href: '/admin', label: 'Command Overview', icon: LayoutDashboard },
    { href: '/admin/students', label: 'Students Directory', icon: GraduationCap },
    { href: '/admin/faculty', label: 'Faculty Guides', icon: BookOpen },
    { href: '/admin/companies', label: 'Partner Companies', icon: Building2 },
    { href: '/admin/internships', label: 'All Internships', icon: Briefcase },
    { href: '/admin/certificates', label: 'Certificates Registry', icon: Award },
    { href: '/admin/analytics', label: 'System Analytics', icon: BarChart },
    { href: '/admin/settings', label: 'Institution Settings', icon: Settings },
    { href: '/admin/profile', label: 'Admin Profile', icon: Shield },
  ];

  return (
    <aside 
      className={`${isCollapsed ? 'w-20' : 'w-64'} flex-shrink-0 flex flex-col bg-[#F8FAFC] dark:bg-[#07131F] border-r border-[#E0F2FE]/70 dark:border-sky-950 transition-all duration-300 ease-in-out text-[#0F172A] dark:text-sky-200 select-none z-30`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#E0F2FE] dark:border-sky-950 bg-white/80 dark:bg-sky-950/40 backdrop-blur-md">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0F172A] to-[#0284C7] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Shield size={20} />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 transition-opacity duration-200">
              <div className="font-bold tracking-tight text-[#0F172A] dark:text-white leading-tight truncate">ILMP Admin</div>
              <div className="text-[10px] font-mono font-bold text-[#0284C7] dark:text-sky-400 uppercase tracking-wider truncate">Governance Node</div>
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className="p-1.5 rounded-lg text-sky-700 dark:text-sky-300 hover:bg-sky-100/60 dark:hover:bg-sky-900/60 transition-colors cursor-pointer"
        >
          {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              to={item.href}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3.5'} py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive 
                  ? 'text-white font-bold bg-[#0284C7] shadow-sm' 
                  : 'text-slate-600 dark:text-sky-200 hover:bg-[#E0F2FE]/60 dark:hover:bg-sky-900/40 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0 ${isActive ? 'text-sky-100' : 'text-[#0284C7] dark:text-sky-400'}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </div>

      <div className={`p-3.5 border-t border-[#E0F2FE] dark:border-sky-950 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} bg-white/60 dark:bg-sky-950/40`}>
        <SafeUserButton role={role} />
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-[#0F172A] dark:text-white truncate">Super Administrator</div>
            <div className="text-[10px] font-mono text-[#0284C7] dark:text-sky-400 truncate">Master Governance Node</div>
          </div>
        )}
      </div>
    </aside>
  );
}
export default Sidebar;
