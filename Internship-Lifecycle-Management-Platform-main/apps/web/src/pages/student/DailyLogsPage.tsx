import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { Clock, Plus, Calendar, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface LogItem {
  id: string;
  date: string;
  hours: number;
  tasks: string;
  status: 'APPROVED' | 'SUBMITTED';
  mentorRemarks?: string;
}

const initialLogs: LogItem[] = [
  { id: '1', date: 'Today, Jul 28, 2026', hours: 8, tasks: 'Configured Redis cluster session adapter and authored auth middleware tests', status: 'SUBMITTED' },
  { id: '2', date: 'Jul 27, 2026', hours: 8, tasks: 'Implemented OAuth2 PKCE challenge generation & verifier check in Go', status: 'APPROVED', mentorRemarks: 'Clean implementation, merged to main branch.' },
  { id: '3', date: 'Jul 26, 2026', hours: 8, tasks: 'Benchmarked PostgreSQL connection pooling latencies under high concurrency', status: 'APPROVED', mentorRemarks: 'Good benchmark documentation.' },
  { id: '4', date: 'Jul 25, 2026', hours: 7.5, tasks: 'Refactored user permissions RBAC layer and resolved integration test failures', status: 'APPROVED' },
  { id: '5', date: 'Jul 24, 2026', hours: 8, tasks: 'Weekly sprint planning, backlog grooming, and API specification review with team', status: 'APPROVED' },
];

export default function DailyLogsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [logs, setLogs] = useState<LogItem[]>(initialLogs);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logHours, setLogHours] = useState('8');
  const [logTasks, setLogTasks] = useState('');

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logTasks.trim()) return;

    const newLog: LogItem = {
      id: String(Date.now()),
      date: 'Today, Jul 28, 2026',
      hours: parseFloat(logHours) || 8,
      tasks: logTasks,
      status: 'SUBMITTED',
    };

    setLogs([newLog, ...logs]);
    setIsLogModalOpen(false);
    setLogTasks('');
    toast.success('Daily work log submitted successfully!');
  };

  const columns = [
    {
      key: 'date',
      header: 'Date',
      render: (row: LogItem) => (
        <div className="font-mono text-slate-800 font-semibold">{row.date}</div>
      ),
    },
    {
      key: 'hours',
      header: 'Hours',
      render: (row: LogItem) => (
        <span className="font-mono font-bold text-slate-900">{row.hours} hrs</span>
      ),
    },
    {
      key: 'tasks',
      header: 'Deliverables & Technical Summary',
      render: (row: LogItem) => (
        <div>
          <p className="text-slate-800 leading-relaxed font-medium">{row.tasks}</p>
          {row.mentorRemarks && (
            <p className="text-[11px] text-emerald-700 mt-1 font-semibold">
              Mentor: "{row.mentorRemarks}"
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: LogItem) => <StatusBadge status={row.status} size="sm" />,
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Daily Work Logs"
        subtitle="Record daily sprint deliverables and track verified working hours"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Work Logs History</h2>
            <p className="text-xs text-slate-500">160 total verified hours logged this semester</p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsLogModalOpen(true)}
            leftIcon={<Plus size={14} />}
          >
            Log Today's Work
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={logs}
          searchKey="tasks"
          searchPlaceholder="Search work log entries..."
        />
      </div>

      {/* Log Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log Work Deliverables"
        size="md"
      >
        <form onSubmit={handleAddLog} className="space-y-4 text-xs">
          <Input
            label="Hours Clocked Today"
            type="number"
            min="1"
            max="12"
            step="0.5"
            value={logHours}
            onChange={(e) => setLogHours(e.target.value)}
            required
          />

          <Textarea
            label="Tasks Completed & Deliverables"
            rows={4}
            value={logTasks}
            onChange={(e) => setLogTasks(e.target.value)}
            placeholder="Describe the modules developed, pull requests authored, bug fixes, and testing done..."
            required
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsLogModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Work Log
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
