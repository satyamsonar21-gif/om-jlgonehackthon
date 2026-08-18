import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Shield, ChevronDown, Check } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { toast } from 'sonner';

export interface ProfileDropdownProps {
  role: 'STUDENT' | 'FACULTY' | 'COMPANY_MENTOR' | 'ADMIN';
}

const roleData = {
  STUDENT: {
    name: 'Priya Sharma',
    identifier: '20CS101 · CSE Tier-1',
    email: 'priya.sharma@college.edu',
    profileUrl: '/student/profile',
    roleLabel: 'Student',
  },
  FACULTY: {
    name: 'Dr. Rajesh Kumar',
    identifier: 'Dept. of CSE · Guide',
    email: 'rajesh.kumar@university.edu',
    profileUrl: '/faculty/profile',
    roleLabel: 'Faculty Guide',
  },
  COMPANY_MENTOR: {
    name: 'Siddharth Nambiar',
    identifier: 'TechCorp Solutions · Lead Architect',
    email: 'mentor@techcorp.com',
    profileUrl: '/company/profile',
    roleLabel: 'Company Mentor',
  },
  ADMIN: {
    name: 'Super Administrator',
    identifier: 'Master Governance Node',
    email: 'admin.root@institution.edu',
    profileUrl: '/admin/profile',
    roleLabel: 'Administrator',
  },
};

export function ProfileDropdown({ role }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const data = roleData[role] || roleData.STUDENT;

  const handleSignOut = () => {
    toast.info('Signed out of session');
    setIsOpen(false);
    navigate('/sign-in');
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User profile menu"
      >
        <Avatar name={data.name} size="sm" />
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[110px]">
            {data.name}
          </span>
          <span className="text-[10px] text-slate-500 font-mono leading-tight truncate max-w-[110px]">
            {data.roleLabel}
          </span>
        </div>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 top-12 mt-1.5 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            {/* User Profile Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <Avatar name={data.name} size="md" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{data.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono truncate">{data.email}</div>
                  <span className="inline-block mt-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--role-accent-light)] text-[var(--role-text)] border border-[var(--role-border)]">
                    {data.roleLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu Links */}
            <div className="p-1.5 space-y-0.5 text-xs text-slate-700">
              <Link
                to={data.profileUrl}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <User size={15} className="text-slate-400" />
                <span>My Profile</span>
              </Link>

              <Link
                to="/admin/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Settings size={15} className="text-slate-400" />
                <span>Account Settings</span>
              </Link>
            </div>

            {/* Switch Role Fast Navigation */}
            <div className="p-1.5 border-t border-slate-100 bg-slate-50/50">
              <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase text-slate-400">
                Switch Portal
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <Link
                  to="/student"
                  onClick={() => setIsOpen(false)}
                  className={`px-2.5 py-1.5 rounded-md font-medium text-center transition-colors ${
                    role === 'STUDENT'
                      ? 'bg-amber-100 text-amber-900 font-bold'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  Student
                </Link>
                <Link
                  to="/faculty"
                  onClick={() => setIsOpen(false)}
                  className={`px-2.5 py-1.5 rounded-md font-medium text-center transition-colors ${
                    role === 'FACULTY'
                      ? 'bg-emerald-100 text-emerald-900 font-bold'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  Faculty
                </Link>
                <Link
                  to="/company"
                  onClick={() => setIsOpen(false)}
                  className={`px-2.5 py-1.5 rounded-md font-medium text-center transition-colors ${
                    role === 'COMPANY_MENTOR'
                      ? 'bg-indigo-100 text-indigo-900 font-bold'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  Company
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className={`px-2.5 py-1.5 rounded-md font-medium text-center transition-colors ${
                    role === 'ADMIN'
                      ? 'bg-sky-100 text-sky-900 font-bold'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  Admin
                </Link>
              </div>
            </div>

            {/* Sign Out Action */}
            <div className="p-1.5 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProfileDropdown;
