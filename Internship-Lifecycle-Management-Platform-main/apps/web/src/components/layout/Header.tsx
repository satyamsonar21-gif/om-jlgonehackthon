import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Menu, Sparkles } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { CommandPalette } from './CommandPalette';
import { NotificationCenter } from './NotificationCenter';
import { ProfileDropdown } from './ProfileDropdown';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Role } from './Sidebar';
import { getRoleFromPath } from '@/design-system/tokens';

import { useUnreadNotificationCount } from '@/lib/queries';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onOpenMobileNav?: () => void;
}

const roleMap: Record<string, Role> = {
  student: 'STUDENT',
  faculty: 'FACULTY',
  company: 'COMPANY_MENTOR',
  admin: 'ADMIN',
};

export const Header = React.memo(function Header({ title, subtitle, onOpenMobileNav }: HeaderProps) {
  const location = useLocation();
  const roleKey = getRoleFromPath(location.pathname);
  const role = roleMap[roleKey] || 'STUDENT';

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute Breadcrumb items from pathname
  const breadcrumbItems = React.useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length <= 1) return [];

    const items = pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const label =
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

      return { label, href };
    });

    return items;
  }, [location.pathname]);

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-8 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-20 transition-colors">
      {/* Left: Mobile Toggle & Page Info */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0">
          {breadcrumbItems.length > 1 ? (
            <Breadcrumb items={breadcrumbItems} className="mb-0.5" />
          ) : null}

          {title && (
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight truncate">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 relative">
        {/* Search CTA with shortcut badge */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer text-xs"
          aria-label="Search platform (Ctrl+K)"
        >
          <Search size={15} />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline-block text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-400">
            Ctrl+K
          </kbd>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer relative"
            aria-label="Open notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white font-mono font-black text-[10px] flex items-center justify-center shadow-xs border-2 border-white animate-in zoom-in">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <NotificationCenter
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
        </div>

        {/* Profile Dropdown */}
        <ProfileDropdown role={role} />
      </div>

      {/* Global Command Palette Dialog */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
});

export default Header;
