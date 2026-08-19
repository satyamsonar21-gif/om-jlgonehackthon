import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, KeyRound, CheckCircle2, ArrowLeft, ArrowRight, ShieldCheck, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Progress';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password strength calculation
  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (!pwd) return 0;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;
    return score;
  };

  const strength = calculateStrength(newPassword);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    setLoading(true);
    try {
      await api.forgotPassword(email.trim());
      toast.success('If the account exists, a verification code has been dispatched to your email.');
      setStep('reset');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to dispatch verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || token.length < 6) {
      toast.error('Please enter a valid 6-digit verification code');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword({
        email,
        token: token.trim(),
        newPassword,
      });
      toast.success('Password reset successfully!');
      setStep('success');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 text-slate-900">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            to="/sign-in"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Sign In</span>
          </Link>
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Account Recovery</span>
        </div>

        {step === 'request' && (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div className="space-y-1.5">
              <h1 className="text-xl font-bold text-slate-900">Forgot Password</h1>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter the email address associated with your student, faculty, or company account to receive a 6-digit verification code.
              </p>
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. aarav.patil@ghrce.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={15} />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={loading}
              rightIcon={<ArrowRight size={15} />}
            >
              Send Reset Code
            </Button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <h1 className="text-xl font-bold text-slate-900">Enter Verification Code</h1>
              <p className="text-xs text-slate-500 leading-relaxed">
                We sent a 6-digit verification code to <span className="font-mono font-semibold text-slate-800">{email}</span>.
              </p>
            </div>

            <Input
              label="6-Digit Verification Code"
              type="text"
              placeholder="123456"
              maxLength={6}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              leftIcon={<KeyRound size={15} />}
              required
            />

            <div className="space-y-1.5">
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters with letters & numbers"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                leftIcon={<Lock size={15} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
                required
              />

              {newPassword && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                    <span>Password Strength:</span>
                    <span
                      className={
                        strength >= 75
                          ? 'text-emerald-600 font-bold'
                          : strength >= 50
                          ? 'text-amber-600 font-bold'
                          : 'text-rose-600 font-bold'
                      }
                    >
                      {strength >= 75 ? 'Strong' : strength >= 50 ? 'Medium' : 'Weak'}
                    </span>
                  </div>
                  <Progress value={strength} />
                </div>
              )}
            </div>

            <Input
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock size={15} />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={loading}
              leftIcon={<ShieldCheck size={15} />}
            >
              Reset Password & Sign In
            </Button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 size={32} />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Password Updated Successfully</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your credentials have been securely updated. You can now log into your institutional portal with your new password.
              </p>
            </div>
            <Link to="/sign-in" className="w-full block">
              <Button variant="primary" size="md" className="w-full">
                Proceed to Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
