import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, CheckCheck, Clock, AlertTriangle, ExternalLink, X } from 'lucide-react';
import { demoNotifications, NotificationItem } from '@/data/demo';
import { toast } from 'sonner';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(demoNotifications);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success('All notifications marked as read');
  };

  const handleItemClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
    onClose();
  };

  const filtered = activeTab === 'unread' ? notifications.filter((n) => n.unread) : notifications;

  if (!isOpen) return null;

  return (
    <>
      {/* Invisible backdrop to dismiss */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div
        className="absolute right-0 top-12 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-150"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[var(--role-accent)] text-white">
                {unreadCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-mono font-medium text-[var(--role-accent)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck size={12} />
                <span>Mark all read</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/30 text-xs font-semibold px-4 pt-2 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`pb-2 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'all'
                ? 'border-[var(--role-accent)] text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('unread')}
            className={`pb-2 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'unread'
                ? 'border-[var(--role-accent)] text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notification Items List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              <p>No notifications to display</p>
            </div>
          ) : (
            filtered.map((item) => (
              <Link
                key={item.id}
                to={item.link || '#'}
                onClick={() => handleItemClick(item.id)}
                className={`p-3.5 flex items-start gap-3 transition-colors block ${
                  item.unread ? 'bg-slate-50/80 hover:bg-slate-100/80' : 'hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    item.type === 'warning'
                      ? 'bg-amber-100 text-amber-700'
                      : item.type === 'success'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {item.type === 'warning' ? <AlertTriangle size={14} /> : <Bell size={14} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs ${
                        item.unread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'
                      } truncate`}
                    >
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                      {item.timeAgo}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {item.unread && (
                  <span className="w-2 h-2 rounded-full bg-[var(--role-accent)] flex-shrink-0 mt-1.5" />
                )}
              </Link>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
          <Link
            to="/student/active"
            onClick={onClose}
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1"
          >
            <span>View All Activity</span>
            <ExternalLink size={11} />
          </Link>
        </div>
      </div>
    </>
  );
}

export default NotificationCenter;
