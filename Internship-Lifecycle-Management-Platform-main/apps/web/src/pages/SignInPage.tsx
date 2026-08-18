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
import { Modal } from '@/components/ui/Modal';
import { RoleKey } from '@/design-system/tokens';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';

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
  const { switchRole, login } = useAuth();
  const [activeRole, setActiveRole] = useState<RoleKey>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('aarav.patil@ghrce.edu');
  const [password, setPassword] = useState('demo123456');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'code' | 'reset' | 'done'>('email');
  const [forgotEmail, setForgotEmail] = useState('');

  const navigate = useNavigate();
  const currentRole = roleOptions.find((r) => r.id === activeRole) || roleOptions[0];
  const IconComponent = currentRole.icon;

  const handleRoleChange = async (roleId: RoleKey) => {
    setActiveRole(roleId);
    await switchRole(roleId);
    const chosen = roleOptions.find((r) => r.id === roleId);
    if (chosen) {
      setEmail(chosen.defaultEmail);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await switchRole(activeRole);
      toast.success(`Signed in successfully as ${currentRole.label}`);
      navigate(currentRole.targetPath);
    } catch {
      navigate(currentRole.targetPath);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotStep === 'email') {
      setForgotStep('code');
      toast.info(`Verification code sent to ${forgotEmail || email}`);
    } else if (forgotStep === 'code') {
      setForgotStep('reset');
    } else if (forgotStep === 'reset') {
      setForgotStep('done');
      toast.success('Password reset successfully');
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
        {/* Explicit Demo Environment Disclaimer Banner */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
          <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold block">Demonstration Environment</span>
            <span>You're using a demonstration account. Select any role below to explore live workflows.</span>
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
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setForgotStep('email');
                  setIsForgotModalOpen(true);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
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
          <span>Need to switch account?</span>
          <Link to="/sign-up" className="font-semibold text-slate-800 hover:underline">
            Choose Your Portal
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Reset Password"
        size="sm"
      >
        <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
          {forgotStep === 'email' && (
            <>
              <p className="text-slate-600 leading-relaxed">
                Enter your university or company email address and we will send you a 6-digit verification code.
              </p>
              <Input
                label="Email Address"
                type="email"
                value={forgotEmail || email}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setIsForgotModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Send Code
                </Button>
              </div>
            </>
          )}

          {forgotStep === 'code' && (
            <>
              <p className="text-slate-600 leading-relaxed">
                A verification code has been dispatched. Enter the 6-digit code below:
              </p>
              <Input label="Verification Code" defaultValue="849201" placeholder="6-digit code" required />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setForgotStep('email')}>
                  Back
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Verify Code
                </Button>
              </div>
            </>
          )}

          {forgotStep === 'reset' && (
            <>
              <p className="text-slate-600 leading-relaxed">Create a new secure password for your account.</p>
              <Input label="New Password" type="password" defaultValue="newpassword123" required />
              <Input label="Confirm Password" type="password" defaultValue="newpassword123" required />
              <div className="flex justify-end gap-2 pt-2">
                <Button type="submit" variant="primary" size="sm">
                  Update Password
                </Button>
              </div>
            </>
          )}

          {forgotStep === 'done' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Password Updated</h4>
              <p className="text-slate-500">You can now sign in with your updated credentials.</p>
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => setIsForgotModalOpen(false)}
              >
                Return to Sign In
              </Button>
            </div>
          )}
        </form>
      </Modal>

      {/* Footer Navigation */}
      <div className="mt-6 flex items-center gap-4 text-xs text-slate-400 font-medium">
        <Link to="/" className="hover:text-slate-700">Platform Home</Link>
        <span>•</span>
        <Link to="/verify/CERT-2026-001" className="hover:text-slate-700">Verify Credential</Link>
      </div>
    </div>
  );
}
