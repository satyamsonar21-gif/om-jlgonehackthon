import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Building2, ShieldCheck, Plus } from 'lucide-react';
import { demoCompanies, CompanyPartner } from '@/data/demo';

export default function AdminCompaniesPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const columns = [
    {
      key: 'name',
      header: 'Partner Organization',
      sortable: true,
      render: (row: CompanyPartner) => (
        <div>
          <div className="font-bold text-slate-900">{row.name}</div>
          <div className="text-[11px] text-slate-500">{row.industry} · {row.location}</div>
        </div>
      ),
    },
    {
      key: 'leadMentor',
      header: 'Lead Industry Supervisor',
      render: (row: CompanyPartner) => (
        <div>
          <div className="font-semibold text-slate-800">{row.leadMentor}</div>
          <div className="text-[11px] font-mono text-slate-400">{row.leadMentorEmail}</div>
        </div>
      ),
    },
    {
      key: 'activeInternsCount',
      header: 'Active Interns',
      sortable: true,
      render: (row: CompanyPartner) => (
        <span className="font-mono font-bold text-slate-900">{row.activeInternsCount} Placements</span>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (row: CompanyPartner) => (
        <span className="font-mono text-slate-700 text-xs font-bold">{row.rating} / 5.0</span>
      ),
    },
    {
      key: 'mouStatus',
      header: 'Accreditation',
      render: (row: CompanyPartner) => (
        <Badge variant={row.mouStatus === 'Active' ? 'success' : 'warning'} size="sm">
          {row.mouStatus === 'Active' ? 'MoU Active' : 'Renewal Due'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Partner Organizations & MoUs"
        subtitle="142 university accredited industry partners and active compliance agreements"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Partner Companies Registry</h2>
            <p className="text-xs text-slate-500 font-mono">142 total approved industry partners</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={demoCompanies}
          searchKey="name"
          searchPlaceholder="Search company by name, sector, or mentor..."
        />
      </div>
    </div>
  );
}
