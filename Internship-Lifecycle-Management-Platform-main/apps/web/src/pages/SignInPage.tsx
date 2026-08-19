import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  Building2, 
  Shield, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Checkbox } from '@/components/ui/Input';
import { RoleKey } from '@/design-system/tokens';
import { toast } from 'sonner';
import { useAuth, getRoleDashboardPath } from '@/lib/auth';

interface RoleOption {
  id: RoleKey;
  label: string;
  badge: string;
  icon: React.ElementType;
  heading: string;
  subheading: string;
  defaultEmail: string;
  targetPath: string;
  color: string;
}

const roleOptions: RoleOption[] = [
  {
    id: 'student',
    label: 'Student',
    badge: 'Student Portal',
    icon: GraduationCap,
    heading: 'Student Portal',
    subheading: 'Access active internships, clock work logs, and submit weekly reports.',
    defaultEmail: 'priya.sharma@college.edu',
    targetPath: '/student',
    color: '#D97706',
  },
  {
    id: 'faculty',
    label: 'Faculty',
    badge: 'Academic Guide',
    icon: BookOpen,
    heading: 'Faculty Guide Portal',
    subheading: 'Monitor cohort telemetry, review weekly reports, and guide at-risk interns.',
    defaultEmail: 'rajesh.kumar@university.edu',
    targetPath: '/faculty',
    color: '#059669',
  },
  {
    id: 'company',
    label: 'Company Mentor',
    badge: 'Industry Supervisor',
    icon: Building2,
    heading: 'Company Mentor Portal',
    subheading: 'Manage active intern tasks, evaluate milestone submissions, and assess candidates.',
    defaultEmail: 'mentor@techcorp.com',
    targetPath: '/company',
    color: '#4F46E5',
  },
  {
    id: 'admin',
    label: 'Administrator',
    badge: 'Institutional Governance',
    icon: Shield,
    heading: 'Administrator Portal',
    subheading: 'Campus-wide governance, partner MoUs, and cryptographic certificate issuance.',
    defaultEmail: 'admin.root@institution.edu',
    targetPath: '/admin',
    color: '#0284C7',
  },
];

export default function SignInPage() {
  const { login } = useAuth();
  const [activeRole, setActiveRole] = useState<RoleKey>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const currentRole = roleOptions.find((r) => r.id === activeRole) || roleOptions[0];
  const IconComponent = currentRole.icon;

  const handleRoleChange = (roleId: RoleKey) => {
    setActiveRole(roleId);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      // Firebase Authentication + Firestore Role Retrieval
      const res = await login({ email: email.trim(), password: password.trim() });
      if (res?.status === 'PENDING_APPROVAL') {
        navigate('/pending-approval');
        return;
      }
      if (res?.status === 'SUSPENDED') {
        navigate('/account-suspended');
        return;
      }
      const userRole = res?.role || res?.user?.role || 'STUDENT';
      const targetPath = getRoleDashboardPath(userRole, res?.status);
      navigate(targetPath);
    } catch {
      // Handled and toasted cleanly in login()
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#F8FAFC] text-slate-900">
      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-2 group">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Sparkles size={18} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">ILMP</span>
        </Link>
        <p className="text-xs text-slate-500 font-medium">
          University Internship Lifecycle Management Platform
        </p>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        {/* Institutional Authentication Banner */}
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2.5 text-xs text-blue-900">
          <Shield size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold block">Institutional Single Sign-On</span>
            <span>Sign in with your university or corporate credentials to access your dashboard.</span>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
            Select Your Role
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
            {roleOptions.map((role) => {
              const isSelected = activeRole === role.id;
              const RoleIcon = role.icon;

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleChange(role.id)}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/60'
                  }`}
                >
                  <RoleIcon size={14} className={isSelected ? 'text-[var(--role-accent)]' : 'text-slate-400'} />
                  <span className="truncate">{role.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Role Header Info */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-xs"
            style={{ backgroundColor: currentRole.color }}
          >
            <IconComponent size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 leading-tight truncate">
              {currentRole.heading}
            </h2>
            <p className="text-xs text-slate-500 leading-snug mt-0.5 truncate">
              {currentRole.subheading}
            </p>
          </div>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <Input
            label="Email Address / University ID"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={15} />}
            required
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Forgot password?
              </Link>
            </div>

            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock size={15} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
              required
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <Checkbox
              label="Remember this device"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={isLoading}
            rightIcon={<ArrowRight size={15} />}
          >
            Enter {currentRole.label} Dashboard
          </Button>
        </form>

        {/* Alternative Role View */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>New to the platform?</span>
          <Link to="/sign-up" className="font-semibold text-slate-800 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-6 flex items-center gap-4 text-xs text-slate-400 font-medium">
        <Link to="/" className="hover:text-slate-700">Platform Home</Link>
        <span>•</span>
        <Link to="/forgot-password" className="hover:text-slate-700">Forgot Password</Link>
        <span>•</span>
        <Link to="/account-recovery" className="hover:text-slate-700">Account Recovery</Link>
        <span>•</span>
        <Link to="/verify/CERT-2026-001" className="hover:text-slate-700">Verify Credential</Link>
      </div>
    </div>
  );
}
