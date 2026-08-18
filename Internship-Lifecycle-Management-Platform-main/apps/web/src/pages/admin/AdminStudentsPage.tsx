import React, { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Users, Eye, FileSpreadsheet, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminStudentsPage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav: () => void }>() || {};

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [actionRemarks, setActionRemarks] = useState('');
  const [acting, setActing] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.getStudents();
      setStudents(res.data || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleVerifyStudent = async (studentId: string, status: 'VERIFIED' | 'REJECTED' | 'CORRECTION_REQUIRED') => {
    setActing(true);
    try {
      await api.verifyStudentProfile(studentId, {
        status,
        remarks: actionRemarks || `Marked as ${status} by T&P Administration.`,
      });
      toast.success(`Student profile status updated to ${status}`);
      await fetchStudents();
      setSelectedStudent(null);
      setActionRemarks('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update student verification status');
    } finally {
      setActing(false);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Student Name & ID',
      sortable: true,
      render: (row: any) => (
        <div>
          <div className="font-bold text-slate-900">{row.user?.name}</div>
          <div className="text-[11px] font-mono text-slate-400">
            {row.studentId} · {row.department} (Yr {row.year})
          </div>
        </div>
      ),
    },
    {
      key: 'cgpa',
      header: 'CGPA / Backlogs',
      sortable: true,
      render: (row: any) => (
        <div>
          <span className="font-mono font-bold text-slate-800">{row.cgpa ? row.cgpa.toFixed(2) : 'N/A'}</span>
          <span className="text-[11px] text-slate-400 ml-1.5">
            ({row.activeBacklogs || 0} backlogs)
          </span>
        </div>
      ),
    },
    {
      key: 'completeness',
      header: 'Profile Completeness',
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full ${row.profileCompletion >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${row.profileCompletion || 60}%` }}
            />
          </div>
          <span className="font-mono text-xs font-bold text-slate-700">{row.profileCompletion || 60}%</span>
        </div>
      ),
    },
    {
      key: 'verificationStatus',
      header: 'T&P Verification',
      render: (row: any) => {
        const v = row.verificationStatus || 'PENDING';
        return (
          <Badge
            variant={
              v === 'VERIFIED'
                ? 'success'
                : v === 'REJECTED'
                ? 'destructive'
                : 'warning'
            }
          >
            {v}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Review & Verify',
      render: (row: any) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSelectedStudent(row)}
          className="text-xs h-7 px-2.5 font-semibold"
        >
          Review
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Student Registry & Verification"
        subtitle="Manage student academic profiles, evaluate backlog counts, and grant institutional approvals"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <Card className="p-4 sm:p-6 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Enrolled Student Cohort</h3>
              <p className="text-xs text-slate-500">Live database records with calculated eligibility metrics</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p className="text-xs text-slate-500 mt-2">Loading student registry...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={students}
              searchPlaceholder="Search students by name, PRN, branch, or skills..."
            />
          )}
        </Card>

        {/* Student Verification Modal */}
        {selectedStudent && (
          <Modal
            isOpen={Boolean(selectedStudent)}
            onClose={() => setSelectedStudent(null)}
            title={`T&P Verification: ${selectedStudent.user?.name}`}
          >
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">{selectedStudent.user?.name}</span>
                  <Badge variant={selectedStudent.verificationStatus === 'VERIFIED' ? 'success' : 'warning'}>
                    {selectedStudent.verificationStatus || 'PENDING'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                  <div>PRN / Roll: <span className="font-mono font-bold text-slate-900">{selectedStudent.studentId}</span></div>
                  <div>Department: <span className="font-bold text-slate-900">{selectedStudent.department}</span></div>
                  <div>CGPA: <span className="font-mono font-bold text-slate-900">{selectedStudent.cgpa?.toFixed(2)}</span></div>
                  <div>Active Backlogs: <span className="font-mono font-bold text-slate-900">{selectedStudent.activeBacklogs || 0}</span></div>
                  <div>Passing Year: <span className="font-mono font-bold text-slate-900">{selectedStudent.passingYear || 2026}</span></div>
                  <div>Completeness: <span className="font-bold text-slate-900">{selectedStudent.profileCompletion}%</span></div>
                </div>
                {selectedStudent.skills && (
                  <div className="pt-1">
                    <span className="text-slate-500">Skills: </span>
                    <span className="font-mono text-slate-800">{selectedStudent.skills}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Verification Remarks / Notes (Sent to student)
                </label>
                <input
                  type="text"
                  value={actionRemarks}
                  onChange={(e) => setActionRemarks(e.target.value)}
                  placeholder="e.g. Academic credentials verified with registrar database."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={acting}
                  onClick={() => handleVerifyStudent(selectedStudent.id, 'REJECTED')}
                  className="text-rose-600 hover:bg-rose-50"
                >
                  Reject Profile
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={acting}
                    onClick={() => handleVerifyStudent(selectedStudent.id, 'CORRECTION_REQUIRED')}
                  >
                    Request Correction
                  </Button>
                  <Button
                    size="sm"
                    disabled={acting}
                    onClick={() => handleVerifyStudent(selectedStudent.id, 'VERIFIED')}
                    className="bg-emerald-600 hover:bg-emerald-700 font-semibold gap-1.5"
                  >
                    {acting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                    <span>Approve & Verify</span>
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
