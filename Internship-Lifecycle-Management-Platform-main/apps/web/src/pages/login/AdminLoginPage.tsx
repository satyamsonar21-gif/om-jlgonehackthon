import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin.root@institution.edu');
  const [password, setPassword] = useState('demo123456');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Signed in as University Super Administrator');
    navigate('/admin');
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
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Institutional Admin Sign In</h2>
              <p className="text-xs text-slate-500">Campus-wide governance, audits & certification registries</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900">
            <span className="font-bold">Demo Account:</span> Pre-loaded with Institutional Root Administrator.
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Administrator Email / Key ID"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={15} />}
              required
            />

            <Input
              label="Access Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock size={15} />}
              required
            />

            <Button type="submit" variant="primary" size="md" className="w-full bg-sky-600 hover:bg-sky-700" rightIcon={<ArrowRight size={14} />}>
              Enter Administration Control
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
