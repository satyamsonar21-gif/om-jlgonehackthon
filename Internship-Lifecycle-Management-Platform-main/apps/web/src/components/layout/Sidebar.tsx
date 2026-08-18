import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Home, 
  Search, 
  FileText, 
  Briefcase, 
  Clock, 
  Calendar, 
  CheckSquare, 
  MessageSquare, 
  Award, 
  User, 
  Users, 
  Inbox, 
  BarChart, 
  Settings, 
  BookOpen, 
  Building2, 
  GraduationCap, 
  Shield,
  UserCheck,
  PanelLeftClose,
  PanelLeftOpen,
  HelpCircle,
  LucideIcon
} from 'lucide-react';
import { useSidebar } from './SidebarContext';

export type Role = 'STUDENT' | 'FACULTY' | 'COMPANY_MENTOR' | 'ADMIN';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  role: Role;
}

export function Sidebar({ role }: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const { isCollapsed, toggleSidebar } = useSidebar();

  const getNavStructure = (): { roleTitle: string; roleSubtitle: string; icon: LucideIcon; sections: NavSection[] } => {
    switch (role) {
      case 'STUDENT':
        return {
          roleTitle: 'ILMP Student',
          roleSubtitle: 'Student Portal',
          icon: GraduationCap,
          sections: [
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
                { href: '/student/active/feedback', label: 'Feedback', icon: MessageSquare },
              ],
            },
            {
              title: 'ACCOUNT',
              items: [
                { href: '/student/certificates', label: 'Certificates', icon: Award },
                { href: '/student/profile', label: 'Profile', icon: User },
              ],
            },
          ],
        };

      case 'FACULTY':
        return {
          roleTitle: 'ILMP Faculty',
          roleSubtitle: 'Academic Guide',
          icon: BookOpen,
          sections: [
            {
              title: 'MAIN',
              items: [
                { href: '/faculty', label: 'Dashboard', icon: Home },
                { href: '/faculty/applications', label: 'Applications', icon: UserCheck },
                { href: '/faculty/students', label: 'Students', icon: Users, badge: '42' },
                { href: '/faculty/reports', label: 'Review Queue', icon: Inbox, badge: '4' },
                { href: '/faculty/analytics', label: 'Analytics', icon: BarChart },
              ],
            },
            {
              title: 'MONITORING',
              items: [
                { href: '/faculty/students', label: 'At-Risk Students', icon: Users, badge: '3' },
              ],
            },
            {
              title: 'ACCOUNT',
              items: [
                { href: '/faculty/profile', label: 'Profile', icon: User },
              ],
            },
          ],
        };

      case 'COMPANY_MENTOR':
        return {
          roleTitle: 'TechCorp Portal',
          roleSubtitle: 'Industry Supervisor',
          icon: Building2,
          sections: [
            {
              title: 'MAIN',
              items: [
                { href: '/company', label: 'Dashboard', icon: Home },
                { href: '/company/interns', label: 'Active Interns', icon: Users, badge: '16' },
                { href: '/company/applications', label: 'Applications', icon: FileText, badge: '52' },
                { href: '/company/listings', label: 'Listings', icon: Briefcase },
              ],
            },
            {
              title: 'ACCOUNT',
              items: [
                { href: '/company/profile', label: 'Company Profile', icon: User },
              ],
            },
          ],
        };

      case 'ADMIN':
        return {
          roleTitle: 'ILMP Admin',
          roleSubtitle: 'University Oversight',
          icon: Shield,
          sections: [
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
                { href: '/admin/audit-logs', label: 'Audit Ledger', icon: Shield },
                { href: '/admin/settings', label: 'Settings', icon: Settings },
                { href: '/admin/profile', label: 'Admin Profile', icon: User },
              ],
            },
          ],
        };
    }
  };

  const { roleTitle, roleSubtitle, icon: RoleIcon, sections } = getNavStructure();

  return (
    <aside
      className={`hidden lg:flex flex-col flex-shrink-0 bg-white border-r border-slate-200 text-slate-800 transition-all duration-200 select-none z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header / Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs"
            style={{
              backgroundColor: 'var(--role-accent)',
              color: '#FFFFFF',
            }}
          >
            <RoleIcon size={20} />
          </div>

          {!isCollapsed && (
            <div className="min-w-0 transition-opacity duration-150">
              <div className="font-bold tracking-tight text-slate-900 leading-tight truncate">
                {roleTitle}
              </div>
              <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider truncate">
                {roleSubtitle}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={toggleSidebar}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
        </button>
      </div>

      {/* Grouped Nav Sections */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {sections.map((section, secIdx) => (
          <div key={secIdx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 select-none">
                {section.title}
              </div>
            )}

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    title={isCollapsed ? item.label : undefined}
                    className={`relative flex items-center ${
                      isCollapsed ? 'justify-center px-2' : 'justify-between px-3'
                    } py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-[var(--role-accent)] text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        size={17}
                        className={`flex-shrink-0 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-400">
        {!isCollapsed ? (
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-mono">Academic SaaS v2.4</span>
            <Link to="/verify/CERT-2026-001" className="hover:text-slate-700 text-[11px]" title="Verify Certificate">
              <Shield size={14} />
            </Link>
          </div>
        ) : (
          <div className="mx-auto">
            <Shield size={14} />
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
