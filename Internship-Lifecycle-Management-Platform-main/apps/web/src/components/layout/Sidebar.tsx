import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  Activity, 
  Calendar, 
  Clock, 
  CheckSquare, 
  MessageSquare, 
  TrendingUp, 
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
  Sparkles
} from 'lucide-react';
import { SafeUserButton } from '@/lib/clerk-provider';

export type Role = 'STUDENT' | 'FACULTY' | 'COMPANY_MENTOR' | 'ADMIN';

interface SidebarProps {
  role: Role;
}

export function Sidebar({ role }: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;

  // STUDENT SIDEBAR (#F3E9DD / #E6D5C1 / #A67C52 / #6B4E3D)
  if (role === 'STUDENT') {
    const navItems = [
      { href: '/student', label: 'Launch Overview', icon: LayoutDashboard, num: '◉' },
      { href: '/student/internships', label: 'Discover Roles', icon: Search, num: '01' },
      { href: '/student/applications', label: 'Applications', icon: FileText, num: '02' },
      { href: '/student/active', label: 'Active Internship', icon: Activity, num: '03' },
      { href: '/student/active/logs', label: 'Daily Work Logs', icon: Clock, num: '04' },
      { href: '/student/active/reports', label: 'Weekly Reports', icon: FileText, num: '05' },
      { href: '/student/active/attendance', label: 'Attendance', icon: Calendar, num: '06' },
      { href: '/student/active/tasks', label: 'Assigned Tasks', icon: CheckSquare, num: '07' },
      { href: '/student/active/feedback', label: 'Mentor Feedback', icon: MessageSquare, num: '08' },
      { href: '/student/placement', label: 'Placement Readiness', icon: TrendingUp, num: '09' },
      { href: '/student/certificates', label: 'Certificates', icon: Award, num: '10' },
    ];

    return (
      <aside className="w-64 flex-shrink-0 flex flex-col bg-[#F3E9DD] border-r border-[#E6D5C1] text-[#6B4E3D]">
        <div className="h-16 flex items-center px-6 border-b border-[#E6D5C1] bg-[#E6D5C1]/40">
          <div className="w-8 h-8 rounded-lg bg-[#6B4E3D] text-white flex items-center justify-center mr-3 shadow-xs">
            <GraduationCap size={18} />
          </div>
          <div>
            <div className="font-bold tracking-tight text-[#6B4E3D] leading-tight">ILMP</div>
            <div className="text-[10px] font-mono font-bold text-[#A67C52] uppercase tracking-wider">Student Launchpad</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                to={item.href}
                className={`relative flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive 
                    ? 'text-white font-bold bg-[#6B4E3D] shadow-xs' 
                    : 'text-[#6B4E3D] hover:bg-[#E6D5C1]/60'
                }`}
              >
                <span className={`w-5 text-[11px] font-mono mr-2 ${isActive ? 'text-[#F3E9DD] font-bold' : 'text-[#8C7362]'}`}>
                  {item.num}
                </span>
                <item.icon className={`w-4 h-4 mr-2.5 ${isActive ? 'text-[#F3E9DD]' : 'text-[#A67C52]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#E6D5C1] flex items-center gap-3 bg-[#E6D5C1]/30">
          <SafeUserButton role={role} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-[#6B4E3D] truncate">Priya Sharma</div>
            <div className="text-[10px] font-mono text-[#A67C52]">20CS101 · Tier 1</div>
          </div>
        </div>
      </aside>
    );
  }

  // FACULTY SIDEBAR (#F4F8F6 / #1B4322 / #038666 / #FBB02D / #0D2B20)
  if (role === 'FACULTY') {
    const navItems = [
      { href: '/faculty', label: 'Observatory', icon: LayoutDashboard },
      { href: '/faculty/students', label: 'Supervised Cohort', icon: Users, badge: '28' },
      { href: '/faculty/reports', label: 'Review Queue', icon: Inbox, badge: '5 Pending' },
      { href: '/faculty/analytics', label: 'Cohort Analytics', icon: BarChart },
    ];

    return (
      <aside className="w-64 flex-shrink-0 flex flex-col bg-[#F4F8F6] border-r border-[#D0E4D8] text-[#0D2B20]">
        <div className="h-16 flex items-center px-6 border-b border-[#D0E4D8] bg-[#E8F2EC]/60">
          <div className="w-8 h-8 rounded-lg bg-[#1B4322] text-[#FBB02D] flex items-center justify-center mr-3 shadow-xs">
            <BookOpen size={18} />
          </div>
          <div>
            <div className="font-bold tracking-tight text-[#0D2B20] leading-tight">ILMP</div>
            <div className="text-[10px] font-mono font-bold text-[#038666] uppercase tracking-wider">Faculty Guide</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                to={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive 
                    ? 'text-white font-bold bg-[#1B4322] shadow-xs' 
                    : 'text-[#0D2B20] hover:bg-[#E8F2EC]'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className={`w-4 h-4 mr-2.5 ${isActive ? 'text-[#FBB02D]' : 'text-[#038666]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-[#FBB02D] text-[#081C15]' : 'bg-[#E0F0E6] text-[#1B4322]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#D0E4D8] flex items-center gap-3 bg-[#E8F2EC]/40">
          <SafeUserButton role={role} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-[#0D2B20] truncate">Dr. Rajesh Kumar</div>
            <div className="text-[10px] font-mono text-[#038666]">Dept. of CSE</div>
          </div>
        </div>
      </aside>
    );
  }

  // COMPANY SIDEBAR (#FFF8F0 / #5400DE / #9E2A2B / #E089F3 / #1E1428)
  if (role === 'COMPANY_MENTOR') {
    const navItems = [
      { href: '/company', label: 'Mission Control', icon: LayoutDashboard },
      { href: '/company/listings', label: 'Internship Listings', icon: Briefcase },
      { href: '/company/applications', label: 'Applications', icon: Users, badge: '12' },
      { href: '/company/interns', label: 'Active Interns', icon: User, badge: '5 Active' },
    ];

    return (
      <aside className="w-64 flex-shrink-0 flex flex-col bg-[#FFF8F0] border-r border-[#E2D9D2] text-[#1E1428]">
        <div className="h-16 flex items-center px-6 border-b border-[#E2D9D2] bg-[#FAF0E6]/60">
          <div className="w-8 h-8 rounded-lg bg-[#5400DE] text-white flex items-center justify-center mr-3 shadow-xs">
            <Building2 size={18} />
          </div>
          <div>
            <div className="font-bold tracking-tight text-[#1E1428] leading-tight">ILMP</div>
            <div className="text-[10px] font-mono font-bold text-[#5400DE] uppercase tracking-wider">Company Hub</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                to={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive 
                    ? 'text-white font-bold bg-[#5400DE] shadow-xs' 
                    : 'text-[#1E1428] hover:bg-[#FAF0E6]'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className={`w-4 h-4 mr-2.5 ${isActive ? 'text-[#E089F3]' : 'text-[#5400DE]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-[#E089F3] text-[#240046]' : 'bg-[#F8E9FC] text-[#5400DE]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#E2D9D2] flex items-center gap-3 bg-[#FAF0E6]/40">
          <SafeUserButton role={role} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-[#1E1428] truncate">TechCorp Solutions</div>
            <div className="text-[10px] font-mono text-[#5400DE]">Partner ID: #TC-2026</div>
          </div>
        </div>
      </aside>
    );
  }

  // ADMIN SIDEBAR (#FAF5FF / #E9D5FF / #3C096C / #FBB02D / #03071E - Lighter Airy Lavender)
  const navItems = [
    { href: '/admin', label: 'Command Overview', icon: LayoutDashboard },
    { href: '/admin/students', label: 'Students Directory', icon: GraduationCap },
    { href: '/admin/faculty', label: 'Faculty Guides', icon: BookOpen },
    { href: '/admin/companies', label: 'Partner Companies', icon: Building2 },
    { href: '/admin/internships', label: 'All Internships', icon: Briefcase },
    { href: '/admin/certificates', label: 'Certificates Registry', icon: Award },
    { href: '/admin/analytics', label: 'System Analytics', icon: BarChart },
    { href: '/admin/settings', label: 'Institution Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-[#FAF5FF] border-r border-[#E9D5FF] text-[#03071E]">
      <div className="h-16 flex items-center px-6 border-b border-[#E9D5FF] bg-[#F3E8FF]/60">
        <div className="w-8 h-8 rounded-lg bg-[#3C096C] text-[#FBB02D] flex items-center justify-center mr-3 shadow-xs">
          <Shield size={18} />
        </div>
        <div>
          <div className="font-bold tracking-tight text-[#03071E] leading-tight">ILMP</div>
          <div className="text-[10px] font-mono font-bold text-[#7C3AED] uppercase tracking-wider">Admin Governance</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              to={item.href}
              className={`flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive 
                  ? 'text-white font-bold bg-[#3C096C] shadow-xs' 
                  : 'text-[#03071E] hover:bg-[#F3E8FF]'
              }`}
            >
              <item.icon className={`w-4 h-4 mr-2.5 ${isActive ? 'text-[#FBB02D]' : 'text-[#7C3AED]'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-[#E9D5FF] flex items-center gap-3 bg-[#F3E8FF]/40">
        <SafeUserButton role={role} />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-[#03071E] truncate">Super Administrator</div>
          <div className="text-[10px] font-mono text-[#7C3AED]">Master Key Node</div>
        </div>
      </div>
    </aside>
  );
}
