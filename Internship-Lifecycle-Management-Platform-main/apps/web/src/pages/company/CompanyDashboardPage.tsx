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
  ChevronRight, 
} from 'lucide-react';
import { demoStudents } from '@/data/demo';
import { useAuth } from '@/lib/auth';

export default function CompanyDashboardPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};
  const { user } = useAuth();

  const companyName = user?.companyName || user?.company?.companyName || user?.name || 'Corporate Partner';
  const domain = user?.domain || user?.company?.domain || 'Industry Mentorship & Innovation Partner';

  const activeInterns = demoStudents.slice(0, 6);

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Company Mentor Dashboard"
        subtitle={`${companyName} · ${domain}`}
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
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-3 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{intern.name}</div>
                        <div className="text-[11px] font-mono text-slate-500">{intern.roll}</div>
                      </div>
                      <StatusBadge status={intern.status} size="sm" />
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Milestone Progress</span>
                        <span className="font-mono font-bold text-indigo-600">{intern.score}%</span>
                      </div>
                      <Progress value={intern.score} max={100} variant="primary" size="sm" />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-500 font-mono">Advisor: {intern.facultyAdvisor}</span>
                      <Link to={`/company/interns/${intern.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" rightIcon={<ChevronRight size={12} />}>
                          Dossier
                        </Button>
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
