import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  FileText,
  Briefcase,
  User,
  Users,
  Inbox,
  BarChart,
  Award,
  Building2,
  Shield,
  Clock,
} from 'lucide-react';
import { Role } from './Sidebar';

interface MobileBottomNavProps {
  role: Role;
}

export function MobileBottomNav({ role }: MobileBottomNavProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const getNavItems = () => {
    switch (role) {
      case 'STUDENT':
        return [
          { href: '/student', label: 'Home', icon: Home },
          { href: '/student/internships', label: 'Explore', icon: Search },
          { href: '/student/applications', label: 'Applications', icon: FileText },
          { href: '/student/active', label: 'Progress', icon: Clock },
          { href: '/student/profile', label: 'Profile', icon: User },
        ];
      case 'FACULTY':
        return [
          { href: '/faculty', label: 'Overview', icon: Home },
          { href: '/faculty/students', label: 'Students', icon: Users },
          { href: '/faculty/applications', label: 'Applications', icon: FileText },
          { href: '/faculty/reports', label: 'Reports', icon: Inbox },
          { href: '/faculty/profile', label: 'Profile', icon: User },
        ];
      case 'COMPANY_MENTOR':
        return [
          { href: '/company', label: 'Overview', icon: Home },
          { href: '/company/listings', label: 'Internships', icon: Briefcase },
          { href: '/company/applications', label: 'Applications', icon: FileText },
          { href: '/company/interns', label: 'Interns', icon: Users },
          { href: '/company/profile', label: 'Profile', icon: User },
        ];
      case 'ADMIN':
        return [
          { href: '/admin', label: 'Overview', icon: Home },
          { href: '/admin/students', label: 'Users', icon: Users },
          { href: '/admin/companies', label: 'Companies', icon: Building2 },
          { href: '/admin/certificates', label: 'Certificates', icon: Award },
          { href: '/admin/analytics', label: 'Analytics', icon: BarChart },
        ];
      default:
        return [];
    }
  };

  const items = getNavItems();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg safe-area-bottom"
    >
      {items.map((item) => {
        const isActive =
          item.href === '/student' || item.href === '/faculty' || item.href === '/company' || item.href === '/admin'
            ? pathname === item.href
            : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            to={item.href}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1.5 rounded-xl transition-all duration-150 ${
              isActive
                ? 'text-slate-950 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div
              className={`p-1 rounded-lg transition-colors ${
                isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-500'
              }`}
            >
              <Icon size={18} />
            </div>
            <span
              className={`text-[10px] tracking-tight leading-tight mt-0.5 truncate max-w-[64px] ${
                isActive ? 'font-bold text-slate-950' : 'font-medium text-slate-500'
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
