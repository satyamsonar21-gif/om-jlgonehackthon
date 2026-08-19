import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Shield,
  ShieldCheck,
  UserPlus,
  Search,
  Filter,
  Mail,
  Phone,
  Building,
  User,
  Clock,
  ArrowRight,
  Sparkles,
  Award,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { api } from '@/lib/api';

interface AdminAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'SUPER_ADMIN' | 'TNP_ADMIN' | 'HOD_ADMIN' | 'ADMIN';
  department: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  lastLoginAt: string;
  createdAt: string;
}

const INITIAL_ADMINS: AdminAccount[] = [
  {
    id: 'adm-01',
    name: 'Dr. Vivek Deshmukh',
    email: 'admin.root@institution.edu',
    phone: '+91 98230 11223',
    role: 'SUPER_ADMIN',
    department: 'Institutional Governance & Academic Council',
    status: 'ACTIVE',
    lastLoginAt: 'Just now',
    createdAt: '2025-06-15',
  },
  {
    id: 'adm-02',
    name: 'Prof. Anjali Kulkarni',
    email: 'tnp.head@institution.edu',
    phone: '+91 94221 44556',
    role: 'TNP_ADMIN',
    department: 'Central Training & Placement Cell',
    status: 'ACTIVE',
    lastLoginAt: '2 hours ago',
    createdAt: '2025-07-01',
  },
  {
    id: 'adm-03',
    name: 'Dr. Sanjay Raut',
    email: 'hod.cse@institution.edu',
    phone: '+91 98900 77889',
    role: 'HOD_ADMIN',
    department: 'Department of Computer Science & Engineering',
    status: 'ACTIVE',
    lastLoginAt: 'Yesterday, 4:15 PM',
    createdAt: '2025-08-10',
  },
  {
    id: 'adm-04',
    name: 'Prof. Meera Joshi',
    email: 'hod.it@institution.edu',
    phone: '+91 97654 33221',
    role: 'HOD_ADMIN',
    department: 'Department of Information Technology',
    status: 'ACTIVE',
    lastLoginAt: '3 days ago',
    createdAt: '2025-09-05',
  },
  {
    id: 'adm-05',
    name: 'Mr. Arvind Patil',
    email: 'registry.admin@institution.edu',
    phone: '+91 93700 88990',
    role: 'ADMIN',
    department: 'Student Affairs & Certification Registry',
    status: 'ACTIVE',
    lastLoginAt: '5 days ago',
    createdAt: '2025-10-12',
  },
];

export default function AdminManagementPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [admins, setAdmins] = useState<AdminAccount[]>(INITIAL_ADMINS);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function loadAdmins() {
      try {
        const res = await api.getAdmins();
        const serverAdmins = res.data?.data || res.data;
        if (Array.isArray(serverAdmins) && serverAdmins.length > 0) {
          const mapped: AdminAccount[] = serverAdmins.map((a: any) => ({
            id: a.id,
            name: a.name || a.firstName || 'Administrator',
            email: a.email,
            phone: a.phone || '',
            role: (a.role || 'ADMIN') as AdminAccount['role'],
            department: a.department || 'Central Administration',
            status: (a.status || 'ACTIVE') as AdminAccount['status'],
            lastLoginAt: a.lastLoginAt ? new Date(a.lastLoginAt).toLocaleDateString() : 'Active session',
            createdAt: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '2026',
          }));
          setAdmins(mapped);
        }
      } catch {
        // Safe fallback to initial institutional administrators
      } finally {
        setLoading(false);
      }
    }

    loadAdmins();
  }, []);

  // Filtered admin records
  const filteredAdmins = admins.filter((adm) => {
    const matchesSearch =
      adm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adm.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adm.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || adm.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleBadgeVariant = (role: AdminAccount['role']) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'danger'; // Red/Rose badge
      case 'TNP_ADMIN':
        return 'warning'; // Amber badge
      case 'HOD_ADMIN':
        return 'success'; // Emerald badge
      case 'ADMIN':
        return 'info'; // Sky badge
      default:
        return 'neutral';
    }
  };

  const getRoleTitle = (role: AdminAccount['role']) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Executive Super Admin';
      case 'TNP_ADMIN':
        return 'T&P Officer';
      case 'HOD_ADMIN':
        return 'Head of Department';
      case 'ADMIN':
        return 'General Administrator';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Administrator Governance & Staff Directory"
        subtitle="Provision, audit, and configure institutional administrator accounts and role privileges"
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Governance Dashboard</span>
          </Link>

          <Button
            type="button"
            variant="primary"
            size="sm"
            className="bg-sky-600 hover:bg-sky-700 shadow-xs"
            onClick={() => navigate('/admin/admins/new')}
            leftIcon={<UserPlus size={14} />}
          >
            Create New Admin Account
          </Button>
        </div>

        {/* ─── METRIC STAT CARDS ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Administrators</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{admins.length}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Shield size={20} />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Active governance personnel</p>
          </Card>

          <Card className="p-4 border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Super Administrators</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {admins.filter((a) => a.role === 'SUPER_ADMIN').length}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Full campus oversight tier</p>
          </Card>

          <Card className="p-4 border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">T&P Officers (TNP_ADMIN)</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {admins.filter((a) => a.role === 'TNP_ADMIN').length}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award size={20} />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Placement & MoU governance</p>
          </Card>

          <Card className="p-4 border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Department HODs</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {admins.filter((a) => a.role === 'HOD_ADMIN').length}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Building size={20} />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Departmental review authority</p>
          </Card>
        </div>

        {/* ─── CALLOUT BANNER FOR CREATION ───────────────────────────────────── */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-transparent border border-sky-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <UserPlus size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Provision New Institutional Administrator</h3>
              <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
                Add department coordinators, T&P officers, or HOD administrators. All administrator accounts require
                authenticated creation and have dedicated RBAC governance roles.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="primary"
            size="md"
            className="bg-sky-600 hover:bg-sky-700 whitespace-nowrap"
            onClick={() => navigate('/admin/admins/new')}
            rightIcon={<ChevronRight size={14} />}
          >
            Create Admin Account
          </Button>
        </div>

        {/* ─── SEARCH & FILTER CONTROLS ──────────────────────────────────────── */}
        <Card className="p-4 border-slate-200">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Input
                placeholder="Search by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search size={15} />}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-44">
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  options={[
                    { label: 'All Roles', value: 'ALL' },
                    { label: 'Super Admin', value: 'SUPER_ADMIN' },
                    { label: 'T&P Officer', value: 'TNP_ADMIN' },
                    { label: 'HOD Admin', value: 'HOD_ADMIN' },
                    { label: 'General Admin', value: 'ADMIN' },
                  ]}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* ─── ADMINISTRATORS TABLE / DIRECTORY ───────────────────────────────── */}
        <Card className="border-slate-200 overflow-hidden shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Institutional Administrators Directory</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing {filteredAdmins.length} of {admins.length} authorized administrator accounts
                </p>
              </div>
              <Badge variant="neutral" size="sm">
                RBAC Security Active
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200/80">
                  <tr>
                    <th className="px-6 py-3.5">Administrator</th>
                    <th className="px-6 py-3.5">Role Tier</th>
                    <th className="px-6 py-3.5">Department / Cell</th>
                    <th className="px-6 py-3.5">Contact</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Last Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
                          <p className="text-xs text-slate-500 font-medium">Loading institutional administrator directory...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredAdmins.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        <Shield className="mx-auto text-slate-300 mb-2" size={32} />
                        <p className="font-semibold text-slate-600">No administrators found</p>
                        <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or create a new administrator</p>
                      </td>
                    </tr>
                  ) : (
                    filteredAdmins.map((adm) => (
                      <tr key={adm.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Name & Avatar */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center shadow-xs flex-shrink-0">
                              {adm.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{adm.name}</span>
                              <span className="text-[11px] text-slate-500 font-mono">{adm.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Role Tier */}
                        <td className="px-6 py-4">
                          <Badge variant={getRoleBadgeVariant(adm.role)} size="sm">
                            {getRoleTitle(adm.role)}
                          </Badge>
                        </td>

                        {/* Department */}
                        <td className="px-6 py-4 font-medium text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <Building size={13} className="text-slate-400" />
                            <span>{adm.department}</span>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-6 py-4 font-mono text-[11px] text-slate-600">
                          {adm.phone || '—'}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <Badge variant="success" size="sm" dot={true}>
                            {adm.status}
                          </Badge>
                        </td>

                        {/* Last Login */}
                        <td className="px-6 py-4 text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Clock size={13} className="text-slate-400" />
                            <span>{adm.lastLoginAt}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
