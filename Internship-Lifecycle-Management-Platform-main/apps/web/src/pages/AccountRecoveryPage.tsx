import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, ArrowLeft, ArrowRight, HelpCircle, FileText, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { toast } from 'sonner';

export default function AccountRecoveryPage() {
  const [role, setRole] = useState('STUDENT');
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Account recovery ticket submitted to the University T&P Helpdesk.');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 text-slate-900">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            to="/sign-in"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Sign In</span>
          </Link>
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Helpdesk</span>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-slate-900">Institutional Account Recovery</h1>
              <p className="text-xs text-slate-500 leading-relaxed">
                If you have lost access to your college email, enrollment ID, or multi-factor credentials, submit an identity verification request to the campus registrar.
              </p>
            </div>

            <Select
              label="Institutional Stakeholder Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={[
                { label: 'Enrolled Student / Intern', value: 'STUDENT' },
                { label: 'Faculty Guide / Department HOD', value: 'FACULTY' },
                { label: 'Corporate Employer / Industry Mentor', value: 'COMPANY' },
              ]}
            />

            <Input
              label="PRN / Roll Number / Faculty Employee ID"
              type="text"
              placeholder="e.g. 2023BCSE042 or EMP-8492"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />

            <Input
              label="Alternate Contact Email"
              type="email"
              placeholder="e.g. personal.email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={15} />}
              required
            />

            <Textarea
              label="Explanation of Issue & Verification Evidence"
              rows={3}
              placeholder="Describe why you cannot access your account (e.g. lost phone, domain migration, forgot security keys)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" size="lg" className="w-full mt-2" rightIcon={<ArrowRight size={15} />}>
              Submit Recovery Dossier
            </Button>
          </form>
        ) : (
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck size={32} />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Recovery Ticket Dispatched</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ticket Reference: <span className="font-mono font-bold text-slate-800">REC-2026-NITT-9182</span>. The T&P Registrar will verify your academic enrollment record and reach out to <span className="font-mono font-semibold text-slate-800">{email}</span> within 24 business hours.
              </p>
            </div>
            <Link to="/sign-in" className="w-full block">
              <Button variant="primary" size="md" className="w-full">
                Return to Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
