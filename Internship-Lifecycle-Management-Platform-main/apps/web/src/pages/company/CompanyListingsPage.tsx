import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Briefcase, Plus, Users, Eye, Edit } from 'lucide-react';
import { demoInternships, InternshipListing } from '@/data/demo';

export default function CompanyListingsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const companyListings = demoInternships.slice(0, 5);

  const columns = [
    {
      key: 'role',
      header: 'Listing Title & Domain',
      sortable: true,
      render: (row: InternshipListing) => (
        <div>
          <div className="font-bold text-slate-900">{row.role}</div>
          <div className="text-[11px] text-indigo-700 font-medium">{row.domain} · {row.type}</div>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (row: InternshipListing) => <span className="text-slate-600">{row.location}</span>,
    },
    {
      key: 'stipend',
      header: 'Stipend',
      render: (row: InternshipListing) => (
        <span className="font-mono font-bold text-slate-900">{row.stipend}</span>
      ),
    },
    {
      key: 'openings',
      header: 'Openings',
      render: (row: InternshipListing) => (
        <span className="font-mono font-bold text-slate-800">{row.openings} Seats</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: () => <StatusBadge status="ACTIVE" size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (row: InternshipListing) => (
        <div className="flex items-center justify-end gap-2">
          <Link to="/company/applications">
            <Button variant="outline" size="sm" leftIcon={<Users size={12} />}>
              Applicants (12)
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Internship Listings"
        subtitle="Manage active job openings, applicant pipelines, and compensation specs"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Active Listings</h2>
            <p className="text-xs text-slate-500 font-mono">6 total approved partner roles posted</p>
          </div>

          <Link to="/company/listings/new">
            <Button variant="primary" size="sm" className="bg-indigo-600 hover:bg-indigo-700" leftIcon={<Plus size={14} />}>
              Post New Listing
            </Button>
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={companyListings}
          searchKey="role"
          searchPlaceholder="Search listings..."
        />
      </div>
    </div>
  );
}
