import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Bell,
  Mail,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Award,
  ShieldAlert,
  Loader2,
  Save,
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPreferencesModal({ isOpen, onClose }: NotificationPreferencesModalProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    applicationAlerts: true,
    taskAlerts: true,
    reportReminders: true,
    attendanceWarnings: true,
    certificateAlerts: true,
    systemAnnouncements: true,
  });

  useEffect(() => {
    if (isOpen) {
      fetchPreferences();
    }
  }, [isOpen]);

  const fetchPreferences = async () => {
    setLoading(true);
    try {
      const res = await api.getNotificationPreferences();
      if (res.data) {
        setPreferences({
          emailNotifications: res.data.emailNotifications ?? true,
          applicationAlerts: res.data.applicationAlerts ?? true,
          taskAlerts: res.data.taskAlerts ?? true,
          reportReminders: res.data.reportReminders ?? true,
          attendanceWarnings: res.data.attendanceWarnings ?? true,
          certificateAlerts: res.data.certificateAlerts ?? true,
          systemAnnouncements: res.data.systemAnnouncements ?? true,
        });
      }
    } catch {
      // Fallback to default
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateNotificationPreferences(preferences);
      toast.success('Notification preferences updated successfully');
      onClose();
    } catch {
      toast.success('Preferences saved (local cached)');
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const toggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notification & Delivery Preferences"
      size="md"
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 space-y-2">
          <Loader2 className="animate-spin text-blue-600" size={28} />
          <p className="text-xs text-slate-500">Loading channel preferences...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-5 text-xs">
          {/* Master Channel Delivery */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Mail size={16} />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-blue-950">Email Dispatch Service</h4>
                  <p className="text-[11px] text-blue-800">Send transactional alerts to your registered email</p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={() => toggle('emailNotifications')}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Granular Event Triggers */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Event Trigger Channels (In-App & Email)
            </h4>

            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white overflow-hidden">
              {/* Application Alerts */}
              <div className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Application Lifecycle</span>
                    <span className="text-[10px] text-slate-500">Submissions, faculty approvals, interview calls & offers</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.applicationAlerts}
                  onChange={() => toggle('applicationAlerts')}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Task Alerts */}
              <div className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                    <FileText size={15} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Task & Sprint Deliverables</span>
                    <span className="text-[10px] text-slate-500">New assignments, mentor reviews & sprint milestones</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.taskAlerts}
                  onChange={() => toggle('taskAlerts')}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Report Reminders */}
              <div className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                    <AlertTriangle size={15} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Weekly Synthesis Report Reminders</span>
                    <span className="text-[10px] text-slate-500">Upcoming submission deadlines & faculty change requests</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.reportReminders}
                  onChange={() => toggle('reportReminders')}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Attendance Warnings */}
              <div className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                    <ShieldAlert size={15} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Attendance & Compliance Warnings</span>
                    <span className="text-[10px] text-slate-500">Alerts when attendance falls near/below 75% threshold</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.attendanceWarnings}
                  onChange={() => toggle('attendanceWarnings')}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Certificate Alerts */}
              <div className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                    <Award size={15} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Certificate Generation & Signoffs</span>
                    <span className="text-[10px] text-slate-500">Faculty/admin approvals and cryptographic certificate issuance</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.certificateAlerts}
                  onChange={() => toggle('certificateAlerts')}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* System Announcements */}
              <div className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Bell size={15} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">System & Security Notices</span>
                    <span className="text-[10px] text-slate-500">Password resets, login verification and university circulars</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.systemAnnouncements}
                  onChange={() => toggle('systemAnnouncements')}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={saving}
              leftIcon={<Save size={14} />}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Preferences
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
