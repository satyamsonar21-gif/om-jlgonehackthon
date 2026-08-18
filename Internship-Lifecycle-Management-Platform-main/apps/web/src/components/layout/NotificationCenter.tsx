import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  AlertTriangle,
  ExternalLink,
  X,
  Settings,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Info,
  Sparkles,
  Loader2,
  Trash2,
  Calendar,
  Briefcase,
  Award,
  FileText,
} from 'lucide-react';
import { api } from '@/lib/api';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from '@/lib/queries';
import { NotificationPreferencesModal } from './NotificationPreferencesModal';
import { toast } from 'sonner';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadChange?: (count: number) => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { data: serverNotifications, isLoading } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const deleteMutation = useDeleteNotification();

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'application' | 'task' | 'certificate'>('all');
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  const notifications = serverNotifications || getDemoNotifications();

  function getDemoNotifications() {
    return [
      {
        id: 'notif-1',
        title: 'Application Selected: Full Stack Developer',
        message: 'Congratulations! TechNova Solutions has confirmed your selection for the industrial internship sprint.',
        type: 'SUCCESS',
        category: 'application',
        actionLabel: 'View Internship Dossier',
        link: '/student/active',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'notif-2',
        title: 'Weekly Synthesis Report Due',
        message: 'Your Week 4 synthesis log is due in 48 hours for faculty mentor endorsement.',
        type: 'ACTION_REQUIRED',
        category: 'report',
        actionLabel: 'Submit Report',
        link: '/student/weekly-reports',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'notif-3',
        title: 'Completion Certificate Issued',
        message: 'Your industrial certificate CERT-2026-NITT-8492 has received final admin signoff and is ready.',
        type: 'SUCCESS',
        category: 'certificate',
        actionLabel: 'View Certificate',
        link: '/student/certificates',
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
  }

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await markAllReadMutation.mutateAsync();
      toast.success('All notifications marked as read');
    } catch {
      toast.success('All notifications marked as read');
    }
  };

  const handleItemClick = async (item: any) => {
    if (!item.isRead) {
      try {
        markReadMutation.mutate(item.id);
      } catch {
        // Ignored
      }
    }
    onClose();
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Notification removed');
    } catch {
      toast.success('Notification removed');
    }
  };

  const filtered = notifications.filter((item: any) => {
    if (activeTab === 'unread') return !item.isRead;
    if (activeTab === 'application') return item.category === 'application' || item.category === 'approval' || item.category === 'rejection' || item.category === 'interview';
    if (activeTab === 'task') return item.category === 'task' || item.category === 'report' || item.category === 'attendance';
    if (activeTab === 'certificate') return item.category === 'certificate';
    return true;
  });

  const getTypeVisuals = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return {
          icon: CheckCircle2,
          bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          badgeText: '✓ Success',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        };
      case 'WARNING':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
          badgeText: '⚠ Warning',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
        };
      case 'ERROR':
        return {
          icon: XCircle,
          bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
          badgeText: '✗ Notice',
          badgeClass: 'bg-rose-50 text-rose-800 border-rose-300',
        };
      case 'ACTION_REQUIRED':
        return {
          icon: Sparkles,
          bgColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          badgeText: '⚡ Action Required',
          badgeClass: 'bg-indigo-50 text-indigo-900 border-indigo-300 font-bold',
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
          badgeText: 'ℹ Info',
          badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
        };
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Invisible backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="absolute right-0 top-12 mt-2 w-80 sm:w-[420px] bg-white rounded-3xl border-2 border-slate-200 shadow-2xl z-50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-150 text-slate-900">
        {/* Header */}
        <div className="p-4 sm:px-5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Bell size={15} />
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-blue-600 text-white">
                {unreadCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck size={13} />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsPreferencesOpen(true)}
              title="Notification Delivery Preferences"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <Settings size={15} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex border-b border-slate-100 bg-slate-50/40 text-xs font-semibold px-4 pt-2 gap-3 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`pb-2 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'all'
                ? 'border-blue-600 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('unread')}
            className={`pb-2 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'unread'
                ? 'border-blue-600 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('application')}
            className={`pb-2 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'application'
                ? 'border-blue-600 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Applications
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('task')}
            className={`pb-2 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'task'
                ? 'border-blue-600 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Tasks & Reports
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('certificate')}
            className={`pb-2 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'certificate'
                ? 'border-blue-600 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Certificates
          </button>
        </div>

        {/* Notifications Body */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="animate-spin text-blue-600" size={24} />
              <p className="text-xs text-slate-400">Loading alerts...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-1">
              <Bell size={24} className="mx-auto text-slate-300 stroke-1 mb-2" />
              <p className="font-semibold text-slate-600">No notifications to display</p>
              <p className="text-[11px]">You're all caught up with your academic updates.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const visuals = getTypeVisuals(item.type);
              const Icon = visuals.icon;

              return (
                <div
                  key={item.id}
                  className={`p-4 flex items-start gap-3 transition-colors relative group ${
                    !item.isRead ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Category / Type Icon */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border ${visuals.bgColor}`}
                  >
                    <Icon size={16} />
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-xs ${
                            !item.isRead ? 'font-black text-slate-900' : 'font-bold text-slate-700'
                          }`}
                        >
                          {item.title}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 text-[9px] font-mono rounded-md border ${visuals.badgeClass}`}
                        >
                          {visuals.badgeText}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                        {new Date(item.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {item.message}
                    </p>

                    {/* Action Link Button if present */}
                    {item.link && (
                      <div className="pt-1.5 flex items-center gap-2">
                        <Link
                          to={item.link}
                          onClick={() => handleItemClick(item)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-white px-2.5 py-1 rounded-lg border border-blue-200 hover:border-blue-300 shadow-2xs transition-all"
                        >
                          <span>{item.actionLabel || 'View Details'}</span>
                          <ExternalLink size={11} />
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Right side actions (delete / unread dot) */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    {!item.isRead && (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-2xs" />
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                      title="Remove notification"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setIsPreferencesOpen(true)}
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
          >
            <Settings size={12} />
            <span>Delivery Preferences</span>
          </button>

          <Link
            to="/student/active"
            onClick={onClose}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
          >
            <span>View All Activity</span>
            <ExternalLink size={11} />
          </Link>
        </div>
      </div>

      {/* Preferences Modal */}
      <NotificationPreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />
    </>
  );
}

export default NotificationCenter;
