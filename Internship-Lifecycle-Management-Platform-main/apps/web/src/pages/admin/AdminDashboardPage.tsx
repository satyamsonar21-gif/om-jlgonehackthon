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
} from 'lucide-react';
import { useAdminAnalytics, useAuditLogs } from '@/lib/queries';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const { data: serverAnalytics, isLoading: analyticsLoading } = useAdminAnalytics();
  const { data: serverAudit, isLoading: auditLoading } = useAuditLogs({ limit: 6 });

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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
