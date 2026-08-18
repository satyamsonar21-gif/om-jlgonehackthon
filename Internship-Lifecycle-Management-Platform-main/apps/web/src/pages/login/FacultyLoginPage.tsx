import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';

export default function FacultyLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('rajesh.kumar@university.edu');
  const [password, setPassword] = useState('demo123456');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Signed in as Dr. Rajesh Kumar (Faculty)');
    navigate('/faculty');
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
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Faculty Guide Sign In</h2>
              <p className="text-xs text-slate-500">Supervise cohort progress & evaluate synthesis reports</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            <span className="font-bold">Demo Account:</span> Pre-loaded with Dr. Rajesh Kumar (Dept. of CSE).
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="University Email / Faculty ID"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={15} />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock size={15} />}
              required
            />

            <Button type="submit" variant="primary" size="md" className="w-full bg-emerald-600 hover:bg-emerald-700" rightIcon={<ArrowRight size={14} />}>
              Enter Faculty Observatory
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
