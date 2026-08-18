import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { PriorityBanner } from '@/components/common/PriorityBanner';
import { StatCard, Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
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
  ExternalLink 
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const stats = [
    { label: 'Enrolled Students', value: '1,284', sublabel: 'Across 6 Engineering Departments', icon: Users, iconColor: '#0284C7' },
    { label: 'Active Placements', value: '386', sublabel: '100% Industry Verified MoUs', icon: Building2, iconColor: '#16A34A' },
    { label: 'Partner Organizations', value: '142', sublabel: '12 Onboarded This Term', icon: Activity, iconColor: '#4F46E5' },
    { label: 'Verified Certificates', value: '923', sublabel: 'Ed25519 Cryptographically Signed', icon: Award, iconColor: '#D97706' },
  ];

  const auditEvents = [
    { id: 1, text: 'Priya Sharma (20CS101) submitted Week 4 Synthesis Report for TechCorp Solutions', time: '10 mins ago', type: 'report' },
    { id: 2, text: 'TechCorp Solutions approved 5 new full-time conversion offer letters', time: '1 hour ago', type: 'offer' },
    { id: 3, text: 'Dr. Rajesh Kumar completed midterm academic evaluation for 18 CSE students', time: '2 hours ago', type: 'faculty' },
    { id: 4, text: 'Campus-wide database automated backup and encryption verification completed', time: '4 hours ago', type: 'system' },
    { id: 5, text: 'New Tamper-Proof Certificate issued to Amit Kumar (CERT-2026-089)', time: '5 hours ago', type: 'cert' },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Institutional Administration Dashboard"
        subtitle="University System Oversight & Governance"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* 1. Priority Action Banner */}
        <PriorityBanner
          badgeText="GOVERNANCE ACTION"
          title="12 Partner MoU Renewals & 5 Cryptographic Certificate Issuances Ready"
          description="Review accredited partner company compliance agreements and authorize cryptographically signed batch certificates for graduating interns."
          actionText="Issue Certificates"
          actionHref="/admin/certificates"
          actionIcon={<Award size={15} />}
          secondaryText="Review Partner MoUs"
          secondaryHref="/admin/companies"
        />

        {/* 2. Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
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
            <Card>
              <CardHeader>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle>Institutional Event & Compliance Ledger</CardTitle>
                    <Badge variant="success" size="sm" dot={true}>
                      Active Stream
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Real-time immutable audit log of university internship lifecycle events
                  </p>
                </div>
              </CardHeader>

              <CardContent>
                <div className="divide-y divide-slate-100">
                  {auditEvents.map((item) => (
                    <div key={item.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 text-sky-700 flex items-center justify-center flex-shrink-0 font-bold">
                          <CheckCircle2 size={16} />
                        </div>
                        <span className="font-medium text-slate-900 leading-snug">{item.text}</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400 whitespace-nowrap flex-shrink-0">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Administration Actions & Governance Tools (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Governance Directories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2.5 text-xs">
                  <Link
                    to="/admin/students"
                    className="p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 flex items-center justify-between transition-colors block"
                  >
                    <div className="flex items-center gap-3">
                      <Users size={16} className="text-sky-700" />
                      <div>
                        <span className="font-bold text-slate-900 block">Enrolled Students Registry</span>
                        <span className="text-[11px] text-slate-500">1,284 student dossiers</span>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-slate-400" />
                  </Link>

                  <Link
                    to="/admin/faculty"
                    className="p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 flex items-center justify-between transition-colors block"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 size={16} className="text-emerald-700" />
                      <div>
                        <span className="font-bold text-slate-900 block">Academic Faculty Guides</span>
                        <span className="text-[11px] text-slate-500">Department guides & advisors</span>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-slate-400" />
                  </Link>

                  <Link
                    to="/admin/companies"
                    className="p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 flex items-center justify-between transition-colors block"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 size={16} className="text-indigo-700" />
                      <div>
                        <span className="font-bold text-slate-900 block">Partner Companies & MoUs</span>
                        <span className="text-[11px] text-slate-500">142 accredited partners</span>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-slate-400" />
                  </Link>

                  <Link
                    to="/admin/certificates"
                    className="p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 flex items-center justify-between transition-colors block"
                  >
                    <div className="flex items-center gap-3">
                      <Award size={16} className="text-amber-700" />
                      <div>
                        <span className="font-bold text-slate-900 block">Cryptographic Certificate Registry</span>
                        <span className="text-[11px] text-slate-500">QR-verifiable credentials</span>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-slate-400" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
