import React, { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import {
  Shield,
  Search,
  Filter,
  Download,
  Loader2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  RefreshCw,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuditLogs } from '@/lib/queries';
import { useDebounce } from '@/lib/useDebounce';
import { toast } from 'sonner';

export default function AdminAuditLogPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [exporting, setExporting] = useState(false);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedAction, setSelectedAction] = useState('all');
  const [page, setPage] = useState(1);

  const queryParams = {
    search: debouncedSearch.trim() || undefined,
    userRole: selectedRole !== 'all' ? selectedRole : undefined,
    action: selectedAction !== 'all' ? selectedAction : undefined,
    page,
    limit: 15,
  };

  const { data: queryResult, isLoading: loading } = useAuditLogs(queryParams);

  const logs = queryResult?.data || (Array.isArray(queryResult) ? queryResult : []);
  const totalPages = queryResult?.pagination?.totalPages || 1;
  const totalCount = queryResult?.pagination?.total || logs.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const res = await api.exportAuditLogsCsv({
        userRole: selectedRole !== 'all' ? selectedRole : undefined,
        action: selectedAction !== 'all' ? selectedAction : undefined,
      });

      if (res.data?.csv) {
        const blob = new Blob([res.data.csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', res.data.filename || 'ilmp_audit_ledger.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Exported audit log ledger to CSV');
      }
    } catch {
      toast.error('Failed to export audit log CSV');
    } finally {
      setExporting(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
      case 'SUPER_ADMIN':
      case 'TNP_ADMIN':
        return 'danger';
      case 'FACULTY':
      case 'FACULTY_MENTOR':
        return 'warning';
      case 'COMPANY_MENTOR':
        return 'info';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Institutional Audit & Compliance Ledger"
        subtitle="Immutable institutional ledger recording privileged actor mutations, verification approvals, and security events"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Filter & Search Bar */}
        <Card className="p-4 sm:p-5 border-slate-200 shadow-xs">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex-1 w-full flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by actor name, action, entity or ID..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  setPage(1);
                }}
                className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
              >
                <option value="all">All Actor Roles</option>
                <option value="ADMIN">ADMIN</option>
                <option value="FACULTY_MENTOR">FACULTY_MENTOR</option>
                <option value="COMPANY_MENTOR">COMPANY_MENTOR</option>
                <option value="STUDENT">STUDENT</option>
              </select>

              <select
                value={selectedAction}
                onChange={(e) => {
                  setSelectedAction(e.target.value);
                  setPage(1);
                }}
                className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
              >
                <option value="all">All Action Types</option>
                <option value="VERIFY_COMPANY">VERIFY_COMPANY</option>
                <option value="APPROVE_CERTIFICATE">APPROVE_CERTIFICATE</option>
                <option value="FACULTY_APPROVE">FACULTY_APPROVE</option>
                <option value="SUBMIT_FEEDBACK">SUBMIT_FEEDBACK</option>
                <option value="FORCE_PASSWORD_RESET">FORCE_PASSWORD_RESET</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-shrink-0">
              <Button type="submit" variant="primary" size="sm" className="bg-slate-900 text-white">
                Apply Search
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleExportCsv}
                disabled={exporting}
                leftIcon={<FileSpreadsheet size={14} className="text-emerald-600" />}
              >
                Export CSV
              </Button>
            </div>
          </form>
        </Card>

        {/* Audit Log Table Card */}
        <Card className="border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-slate-700" />
              <span className="font-bold text-slate-900 text-xs">
                Ledger Entries ({totalCount} Total Recorded Events)
              </span>
            </div>

            <span className="text-[11px] font-mono text-slate-400">
              Page {page} of {totalPages}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/40 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="p-3.5 font-bold">Timestamp</th>
                  <th className="p-3.5 font-bold">Actor</th>
                  <th className="p-3.5 font-bold">Role</th>
                  <th className="p-3.5 font-bold">Action Taken</th>
                  <th className="p-3.5 font-bold">Target Entity</th>
                  <th className="p-3.5 font-bold">Reason / Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <Loader2 className="animate-spin text-blue-600 mx-auto mb-2" size={24} />
                      <span>Loading immutable ledger...</span>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No audit log entries matching criteria.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-mono text-slate-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>

                      <td className="p-3.5 font-bold text-slate-900 whitespace-nowrap">
                        {log.user?.name || log.userId || 'System'}
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <Badge variant={getRoleBadgeVariant(log.userRole)} size="sm">
                          {log.userRole || 'SYSTEM'}
                        </Badge>
                      </td>

                      <td className="p-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {log.action}
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <span className="font-semibold text-slate-800">{log.entity}</span>
                        {log.entityId && (
                          <span className="text-[10px] font-mono text-slate-400 block">
                            ID: {log.entityId}
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 max-w-xs truncate text-slate-500 font-mono text-[11px]">
                        {log.reason || log.metadata || '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Showing entries {(page - 1) * 15 + 1} – {Math.min(page * 15, totalCount)} of {totalCount}
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                leftIcon={<ChevronLeft size={14} />}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                rightIcon={<ChevronRight size={14} />}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
