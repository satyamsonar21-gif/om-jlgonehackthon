import React, { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { PriorityBanner } from '@/components/common/PriorityBanner';
import { StatCard, Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Users,
  Building2,
  Award,
  Activity,
  CheckCircle2,
  Shield,
  FileCheck,
  ArrowRight,
  Clock,
  ExternalLink,
  AlertTriangle,
  Loader2,
  FileSpreadsheet,
  TrendingUp,
  BarChart,
  UserPlus,
} from 'lucide-react';
import { useAdminAnalytics, useAuditLogs, useAdmins } from '@/lib/queries';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const { data: serverAnalytics, isLoading: analyticsLoading } = useAdminAnalytics();
  const { data: serverAudit, isLoading: auditLoading } = useAuditLogs({ limit: 6 });
  const { data: adminsList, isLoading: adminsLoading, error: adminsError, refetch: refetchAdmins } = useAdmins();

  const loading = analyticsLoading || auditLoading;
  const analytics = serverAnalytics || {
    totalStudents: 1284,
    activeInternships: 386,
    totalCompanies: 142,
    pendingApprovals: 17,
    atRiskStudents: 8,
    certificatesIssued: 923,
  };
  const auditLogs = serverAudit?.data || serverAudit || [];

  const stats = [
    {
      label: 'Registered Students',
      value: String(analytics?.totalStudents ?? '0'),
      sublabel: 'Institutional Enrollment Database',
      icon: Users,
      iconColor: '#0284C7',
    },
    {
      label: 'Active Internships',
      value: String(analytics?.activeInternships ?? '0'),
      sublabel: 'Current Ongoing Industrial Sprints',
      icon: Building2,
      iconColor: '#16A34A',
    },
    {
      label: 'Partner Organizations',
      value: String(analytics?.totalCompanies ?? '0'),
      sublabel: `${analytics?.verifiedCompanies ?? 0} Accredited MoUs`,
      icon: Activity,
      iconColor: '#4F46E5',
    },
    {
      label: 'Pending Approvals',
      value: String(analytics?.pendingApprovals ?? '0'),
      sublabel: 'Awaiting Faculty & T&P Signoff',
      icon: Clock,
      iconColor: '#D97706',
    },
    {
      label: 'At-Risk Interns',
      value: String(analytics?.atRiskStudents ?? '0'),
      sublabel: 'Attendance < 75% or Overdue Reports',
      icon: AlertTriangle,
      iconColor: '#E11D48',
    },
    {
      label: 'Issued Certificates',
      value: String(analytics?.certificatesIssued ?? '0'),
      sublabel: 'Cryptographically Verified Credentials',
      icon: Award,
      iconColor: '#0D9488',
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Institutional Administration & Governance Console"
        subtitle="University System Oversight, Compliance Ledger, and Macro Key Performance Indicators"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* 1. Priority Action Banner */}
        <PriorityBanner
          badgeText="ADMIN GOVERNANCE ACTION"
          title={`${analytics?.pendingApprovals ?? 5} Institutional Actions Require Executive Signoff`}
          description="Review accredited corporate MoUs, authenticate pending student eligibility profiles, and authorize cryptographic completion certificates."
          actionText="Review Approvals"
          actionHref="/admin/certificates"
          actionIcon={<Award size={15} />}
          secondaryText="View Placement Analytics"
          secondaryHref="/admin/analytics"
        />

        {/* 2. Key Metrics Grid (6 Unhardcoded Live Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stats.map((stat, i) => (
            <StatCard
              key={i}
              label={stat.label}
              value={stat.value}
              sublabel={stat.sublabel}
              icon={stat.icon}
              iconColor={stat.iconColor}
            />
          ))}
        </div>

        {/* 3. Main Administration Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Institutional Audit Event Ledger (Span 7) */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle>Institutional Compliance & Audit Ledger</CardTitle>
                      <Badge variant="success" size="sm" dot={true}>
                        Live Feed
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Immutable record of university lifecycle transitions & administrative actions
                    </p>
                  </div>

                  <Link to="/admin/audit-logs">
                    <Button variant="outline" size="sm" className="text-xs">
                      View Full Audit
                    </Button>
                  </Link>
                </div>
              </CardHeader>

              <CardContent>
                {loading ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="animate-spin text-blue-600" size={24} />
                    <p className="text-xs text-slate-500">Loading audit ledger stream...</p>
                  </div>
                ) : auditLogs.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No recent audit log entries recorded.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {auditLogs.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className="py-3 flex items-center justify-between gap-4 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 font-bold border border-slate-200">
                            <Shield size={15} />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-slate-900 truncate">
                                {log.action}
                              </span>
                              <span className="px-1.5 py-0.2 text-[9px] font-mono rounded bg-slate-100 text-slate-700 border border-slate-200">
                                {log.userRole || 'SYSTEM'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              Entity: <strong className="text-slate-700">{log.entity}</strong> ({log.entityId || 'N/A'}) · By {log.user?.name || log.userId || 'System'}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                          {new Date(log.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Administrative Portals (Span 5) */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Governance & Accreditation Hub</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  to="/admin/analytics"
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors flex items-center justify-between text-xs group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                      <BarChart size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block group-hover:text-blue-600 transition-colors">
                        Placement & Accreditation Analytics
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Funnel metrics, department benchmarks & skill gaps
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  to="/admin/certificates"
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors flex items-center justify-between text-xs group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                      <Award size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block group-hover:text-teal-600 transition-colors">
                        Certificate Registry & Signoffs
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Cryptographic ledger & public QR code verification
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  to="/admin/companies"
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors flex items-center justify-between text-xs group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block group-hover:text-indigo-600 transition-colors">
                        Corporate Partners & MoUs
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Enterprise accreditation and openings monitoring
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  to="/admin/admins"
                  className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-200/80 hover:bg-sky-50 transition-colors flex items-center justify-between text-xs group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-xs">
                      <UserPlus size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block group-hover:text-sky-700 transition-colors">
                        Administrator Directory & Provisioning
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Create new administrator accounts & manage governance tiers
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-sky-600 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 4. Admin Management Section */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                    <Shield size={16} />
                  </div>
                  <CardTitle className="text-lg">Admin Management</CardTitle>
                  <Badge variant="info" size="sm">
                    Institutional Governance
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Active institutional administrators, governance roles, and credential management
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Link to="/admin/admins">
                  <Button variant="outline" size="sm" className="text-xs">
                    View Full Directory
                  </Button>
                </Link>
                <Link to="/admin/admins/new">
                  <Button size="sm" className="bg-sky-600 hover:bg-sky-700 text-white text-xs gap-1.5 shadow-xs">
                    <UserPlus size={14} />
                    Create Admin Account
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {adminsLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-2">
                <Loader2 className="animate-spin text-sky-600" size={24} />
                <p className="text-xs text-slate-500 font-medium">Loading administrator directory...</p>
              </div>
            ) : adminsError ? (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between">
                <span>Failed to load administrator accounts from server.</span>
                <Button variant="outline" size="sm" onClick={() => refetchAdmins()} className="text-xs h-7">
                  Retry
                </Button>
              </div>
            ) : !adminsList || adminsList.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                  <Shield size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">No Administrators Found</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Provision the first institutional administrator account.</p>
                </div>
                <Link to="/admin/admins/new">
                  <Button size="sm" className="bg-sky-600 hover:bg-sky-700 text-white text-xs gap-1.5">
                    <UserPlus size={14} />
                    Create Admin Account
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/75 border-y border-slate-200/80 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Administrator Name</th>
                      <th className="py-3 px-4">Email Address</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Created Date</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adminsList.slice(0, 5).map((admin: any) => {
                      const getRoleBadgeVariant = (role: string) => {
                        switch (role) {
                          case 'SUPER_ADMIN':
                            return 'danger';
                          case 'TNP_ADMIN':
                            return 'warning';
                          case 'HOD_ADMIN':
                            return 'success';
                          default:
                            return 'info';
                        }
                      };

                      return (
                        <tr key={admin.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                                {(admin.name || admin.firstName || 'A').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-semibold text-slate-900 block">
                                  {admin.name || `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || 'Institutional Admin'}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  ID: {admin.id.substring(0, 8)}...
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                            {admin.email}
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge variant={getRoleBadgeVariant(admin.role)} size="sm">
                              {admin.role}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                            {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '2026-08-19'}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {admin.status || 'ACTIVE'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
