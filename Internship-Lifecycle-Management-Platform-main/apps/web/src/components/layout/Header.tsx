import React, { useState } from 'react';
import { Search, Bell, Sparkles, PanelLeftClose, PanelLeftOpen, Check } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { toast } from 'sonner';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Weekly Report Due', desc: 'Week 5 synthesis report deadline in 24 hours', time: '10m ago', unread: true },
    { id: 2, title: 'Attendance Clocked', desc: 'Morning biometric check-in verified', time: '2h ago', unread: false },
    { id: 3, title: 'Evaluation Sign-off', desc: 'Faculty mentor approved Sprint 4 milestone', time: '1d ago', unread: false },
  ];

  return (
    <header 
      className="h-16 flex items-center justify-between px-4 sm:px-8 border-b sticky top-0 z-20 backdrop-blur-md transition-colors"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        color: 'var(--text)',
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          title={isCollapsed ? "Expand Sidebar Menu" : "Collapse Sidebar Menu"}
          className="p-2 rounded-xl border transition-colors cursor-pointer flex items-center justify-center flex-shrink-0"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--surface-muted, var(--bg))',
            color: 'var(--text)',
          }}
          aria-label="Toggle Slidebar"
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold tracking-tight leading-tight truncate" style={{ color: 'var(--text)' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs font-medium mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2.5 relative">
        <button 
          onClick={() => toast.info('System Search: Press Ctrl+K or type in any search bar')}
          className="p-2 rounded-xl border transition-colors cursor-pointer"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--surface-muted, var(--bg))',
            color: 'var(--text)',
          }}
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl border transition-colors cursor-pointer"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--surface-muted, var(--bg))',
              color: 'var(--text)',
            }}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span 
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2 ring-white" 
              style={{ backgroundColor: 'var(--highlights, var(--cta))' }}
            />
          </button>

          {showNotifications && (
            <div 
              className="absolute right-0 mt-2 w-80 rounded-2xl border shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="font-bold text-xs">Notifications (3)</span>
                <button 
                  onClick={() => {
                    toast.success('All notifications marked as read');
                    setShowNotifications(false);
                  }}
                  className="text-[11px] font-mono hover:underline cursor-pointer" 
                  style={{ color: 'var(--role-accent, var(--cta))' }}
                >
                  Mark all read
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{n.title}</span>
                      <span className="text-[10px] font-mono opacity-50">{n.time}</span>
                    </div>
                    <p className="text-[11px] leading-snug" style={{ color: 'var(--text-muted)' }}>{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
