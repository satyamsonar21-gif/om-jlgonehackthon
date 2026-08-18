import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { Award, ShieldCheck, ExternalLink, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CertificateRecord {
  id: string;
  certCode: string;
  studentName: string;
  studentRoll: string;
  company: string;
  issueDate: string;
  grade: string;
  status: 'ISSUED' | 'PENDING_SIGNATURE';
}

const initialCertificates: CertificateRecord[] = [
  { id: '1', certCode: 'CERT-2026-001', studentName: 'Priya Sharma', studentRoll: '20CS101', company: 'TechCorp Solutions', issueDate: 'Jul 28, 2026', grade: 'A+', status: 'ISSUED' },
  { id: '2', certCode: 'CERT-2026-002', studentName: 'Rahul Patel', studentRoll: '20CS102', company: 'Innovatech Labs', issueDate: 'Jul 28, 2026', grade: 'A', status: 'ISSUED' },
  { id: '3', certCode: 'CERT-2026-003', studentName: 'Sneha Gupta', studentRoll: '20CS106', company: 'Creative Studio Inc', issueDate: 'Jul 27, 2026', grade: 'A+', status: 'ISSUED' },
  { id: '4', certCode: 'CERT-2026-004', studentName: 'Amit Kumar', studentRoll: '20CS105', company: 'TechCorp Solutions', issueDate: 'Jul 26, 2026', grade: 'A', status: 'ISSUED' },
  { id: '5', certCode: 'CERT-2026-005', studentName: 'Vikram Singh', studentRoll: '20CS104', company: 'Global Logistics IT', issueDate: 'Pending', grade: 'B', status: 'PENDING_SIGNATURE' },
];

export default function AdminCertificatesPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [certificates, setCertificates] = useState<CertificateRecord[]>(initialCertificates);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState('Deepak Nair (20CS107)');
  const [newCompany, setNewCompany] = useState('CyberShield Security');
  const [newGrade, setNewGrade] = useState('A');

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();

    const newCert: CertificateRecord = {
      id: String(Date.now()),
      certCode: `CERT-2026-${String(certificates.length + 1).padStart(3, '0')}`,
      studentName: newStudent.split(' (')[0],
      studentRoll: newStudent.split('(')[1]?.replace(')', '') || '20CS107',
      company: newCompany,
      issueDate: 'Today, Jul 28, 2026',
      grade: newGrade,
      status: 'ISSUED',
    };

    setCertificates([newCert, ...certificates]);
    setIsIssueModalOpen(false);
    toast.success(`Cryptographic Certificate ${newCert.certCode} issued successfully!`);
  };

  const columns = [
    {
      key: 'certCode',
      header: 'Certificate ID',
      render: (row: CertificateRecord) => (
        <span className="font-mono font-bold text-slate-900 text-xs">{row.certCode}</span>
      ),
    },
    {
      key: 'studentName',
      header: 'Recipient Student',
      sortable: true,
      render: (row: CertificateRecord) => (
        <div>
          <div className="font-bold text-slate-900">{row.studentName}</div>
          <div className="text-[11px] font-mono text-slate-400">{row.studentRoll}</div>
        </div>
      ),
    },
    {
      key: 'company',
      header: 'Host Organization',
      render: (row: CertificateRecord) => <span className="text-slate-700 font-medium">{row.company}</span>,
    },
    {
      key: 'grade',
      header: 'Grade',
      render: (row: CertificateRecord) => (
        <span className="font-mono font-bold text-emerald-700">{row.grade}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: CertificateRecord) => (
        <Badge variant={row.status === 'ISSUED' ? 'success' : 'warning'} size="sm">
          {row.status === 'ISSUED' ? 'Ed25519 Signed' : 'Pending Signature'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Verification Link',
      align: 'right' as const,
      render: (row: CertificateRecord) => (
        <Link to={`/verify/${row.certCode}`}>
          <Button variant="outline" size="sm" rightIcon={<ExternalLink size={12} />}>
            Verify
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Cryptographic Certificate Registry"
        subtitle="Issue and manage tamper-proof university internship completion credentials"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Certificate Registry</h2>
            <p className="text-xs text-slate-500 font-mono">923 total verifiable certificates on university ledger</p>
          </div>

          <Button
            variant="primary"
            size="sm"
            className="bg-sky-600 hover:bg-sky-700"
            onClick={() => setIsIssueModalOpen(true)}
            leftIcon={<Plus size={14} />}
          >
            Issue Certificate
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={certificates}
          searchKey="studentName"
          searchPlaceholder="Search certificates by student name, PRN, or code..."
        />
      </div>

      {/* Issue Certificate Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Issue Digitally Signed Certificate"
        size="md"
      >
        <form onSubmit={handleIssueCertificate} className="space-y-4 text-xs">
          <Input
            label="Student Name & Roll"
            value={newStudent}
            onChange={(e) => setNewStudent(e.target.value)}
            required
          />

          <Input
            label="Host Organization"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
            required
          />

          <Select
            label="Graduating Academic Grade"
            value={newGrade}
            onChange={(e) => setNewGrade(e.target.value)}
            options={[
              { label: 'Grade A+ (Distinction)', value: 'A+' },
              { label: 'Grade A (First Class with Distinction)', value: 'A' },
              { label: 'Grade B+ (First Class)', value: 'B+' },
              { label: 'Grade B (Pass)', value: 'B' },
            ]}
          />

          <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-[11px] leading-relaxed">
            <span className="font-bold">Cryptographic Key:</span> This certificate will be stamped with university master key and given a public QR verification URL.
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsIssueModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="bg-sky-600 hover:bg-sky-700" leftIcon={<ShieldCheck size={14} />}>
              Authorize & Sign
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
