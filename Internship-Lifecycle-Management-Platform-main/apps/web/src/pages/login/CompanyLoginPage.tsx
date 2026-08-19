import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import { useAuth, getRoleDashboardPath } from '@/lib/auth';

export default function CompanyLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both your work email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email: email.trim(), password: password.trim() });
      const userRole = res?.user?.role || res?.role || 'COMPANY';
      const targetPath = getRoleDashboardPath(userRole, res?.status);
      navigate(targetPath);
    } catch {
      // Handled in AuthProvider toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] text-slate-900">
      <div className="w-full max-w-md mx-auto my-auto p-6 space-y-6">
        <div>
          <Link to="/sign-in" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft size={14} />
            <span>Back to Role Selection</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Company Mentor Sign In</h2>
              <p className="text-xs text-slate-500">Manage sprint tasks, intern logs & candidate pipelines</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work Email Address"
              type="email"
              placeholder="e.g. mentor@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={15} />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock size={15} />}
              required
            />

            <Button type="submit" variant="primary" size="md" className="w-full bg-indigo-600 hover:bg-indigo-700" loading={loading} rightIcon={<ArrowRight size={14} />}>
              Enter Company Mission Control
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
