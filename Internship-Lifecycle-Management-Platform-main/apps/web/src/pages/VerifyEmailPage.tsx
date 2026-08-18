import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowRight, ArrowLeft, RefreshCw, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [code, setCode] = useState(searchParams.get('code') || '');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your account email');
      return;
    }
    if (!code || code.length < 6) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    try {
      await api.verifyEmail({ email: email.trim(), code: code.trim() });
      toast.success('Email verified successfully!');
      setIsVerified(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Please enter your email first');
      return;
    }
    setResending(true);
    try {
      const res = await api.resendVerification(email);
      if (res.data?.code) {
        setCode(res.data.code);
      }
      toast.success('Verification code resent to your email');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to resend code');
    } finally {
      setResending(false);
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
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Security</span>
        </div>

        {!isVerified ? (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-slate-900">Verify Your Email</h1>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter the 6-digit confirmation code dispatched to your institutional or corporate email address.
              </p>
            </div>

            <Input
              label="Account Email"
              type="email"
              placeholder="e.g. aarav.patil@ghrce.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={15} />}
              required
            />

            <Input
              label="6-Digit Verification Code"
              type="text"
              placeholder="123456"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              leftIcon={<KeyRound size={15} />}
              required
            />

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Didn't receive a code?</span>
              <button
                type="button"
                disabled={resending}
                onClick={handleResend}
                className="font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                {resending && <RefreshCw size={12} className="animate-spin" />}
                <span>Resend Code</span>
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={loading}
              rightIcon={<ArrowRight size={15} />}
            >
              Verify & Activate Email
            </Button>
          </form>
        ) : (
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 size={32} />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Email Verified Successfully</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your email address has been confirmed and your account credentials are now active.
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
