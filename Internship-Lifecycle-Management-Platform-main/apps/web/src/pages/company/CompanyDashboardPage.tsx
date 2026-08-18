import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { PriorityBanner } from '@/components/common/PriorityBanner';
import { StatCard, Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { 
  Users, 
  Briefcase, 
  FileText, 
  Star, 
  Plus, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Eye
} from 'lucide-react';
import { demoStudents, demoInternships } from '@/data/demo';

export default function CompanyDashboardPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const activeInterns = demoStudents.slice(0, 6);

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Company Mentor Dashboard"
        subtitle="TechCorp Solutions · Industry Supervisor & Mentorship Hub"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* 1. Priority Action Banner */}
        <PriorityBanner
          badgeText="PENDING ACTIONS"
          title="5 Candidate Applications & 3 Milestone Work Logs Awaiting Sign-Off"
          description="Screen 5 new applicant dossiers for Full Stack Developer listing and review Sprint 4 work logs submitted by active interns."
          actionText="Review Applications"
          actionHref="/company/applications"
          actionIcon={<FileText size={15} />}
          secondaryText="Post New Listing"
          secondaryHref="/company/listings/new"
        />

        {/* 2. Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            label="Supervised Interns"
            value="16 Active"
            sublabel="Across 7 Project Teams"
            icon={Users}
            iconColor="#4F46E5"
          />
          <StatCard
            label="Candidate Pipeline"
            value="52 Applicants"
            sublabel="Fall 2026 Batch"
            icon={FileText}
            iconColor="#2563EB"
          />
          <StatCard
            label="Open Listings"
            value="6 Roles"
            sublabel="Verified University MoUs"
            icon={Briefcase}
            iconColor="#0284C7"
          />
          <StatCard
            label="Mentor Satisfaction"
            value="4.8 / 5.0"
            sublabel="98% Institutional Rating"
            icon={Star}
            iconColor="#16A34A"
          />
        </div>

        {/* 3. Active Supervised Interns & Sprint Velocity */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>Active Supervised Interns</CardTitle>
                  <Badge variant="info" size="sm">
                    {activeInterns.length} Team Members
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Live sprint progress, work log submissions, and attendance tracking
                </p>
              </div>
              <Link to="/company/interns">
                <Button variant="outline" size="sm">
                  Complete Roster (16)
                </Button>
              </Link>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeInterns.map((intern) => (
                  <div
                    key={intern.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 leading-snug">
                            {intern.name}
                          </h4>
                          <span className="text-xs text-indigo-700 font-semibold block mt-0.5">
                            {intern.role}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 font-medium">
                            {intern.roll} · {intern.dept.split('&')[0]}
                          </span>
                        </div>
                        <StatusBadge status={intern.status === 'at_risk' ? 'AT_RISK' : 'ACTIVE'} size="sm" />
                      </div>

                      <div className="mt-3 space-y-1.5">
                        <div className="flex justify-between text-[11px] font-mono text-slate-500">
                          <span>Sprint Velocity (8/10 Tasks)</span>
                          <span className="font-bold text-slate-700">80%</span>
                        </div>
                        <Progress value={80} size="sm" variant={intern.status === 'at_risk' ? 'danger' : 'primary'} />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500">Last: {intern.lastLogDate}</span>
                      <Link
                        to={`/company/interns/${intern.id}`}
                        className="font-bold text-indigo-700 hover:underline flex items-center gap-1"
                      >
                        <span>Evaluate</span>
                        <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
