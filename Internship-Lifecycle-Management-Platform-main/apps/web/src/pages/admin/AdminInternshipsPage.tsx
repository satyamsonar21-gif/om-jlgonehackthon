import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Briefcase, Eye } from 'lucide-react';
import { demoInternships, InternshipListing } from '@/data/demo';

export default function AdminInternshipsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const columns = [
    {
      key: 'role',
      header: 'Role & Host Organization',
      sortable: true,
      render: (row: InternshipListing) => (
        <div>
          <div className="font-bold text-slate-900">{row.role}</div>
          <div className="text-[11px] text-slate-500">{row.company} · {row.domain}</div>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Mode & City',
      render: (row: InternshipListing) => (
        <span className="text-slate-600">{row.location} ({row.type})</span>
      ),
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
      header: 'Capacity',
      render: (row: InternshipListing) => (
        <span className="font-mono text-slate-800">{row.openings} Openings</span>
      ),
    },
    {
      key: 'status',
      header: 'Accreditation',
      render: () => <Badge variant="success" size="sm">Approved MoU</Badge>,
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Approved Internship Listings"
        subtitle="All campus-wide active and approved internship listings"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">University Approved Opportunities</h2>
            <p className="text-xs text-slate-500 font-mono">32 verified listings across 142 companies</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={demoInternships}
          searchKey="role"
          searchPlaceholder="Search opportunities by title, company, or domain..."
        />
      </div>
    </div>
  );
}
