import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Building2, Shield, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const portals = [
  {
    role: 'Student Portal',
    href: '/student',
    icon: GraduationCap,
    tagline: 'Students & Interns',
    description: 'Track active internship sprint milestones, clock daily work logs, and submit weekly technical synthesis reports.',
    color: '#D97706',
  },
  {
    role: 'Faculty Guide Portal',
    href: '/faculty',
    icon: BookOpen,
    tagline: 'Academic Mentors & HODs',
    description: 'Supervise enrolled cohort telemetry, evaluate weekly progress reports, and guide at-risk students.',
    color: '#059669',
  },
  {
    role: 'Company Mentor Portal',
    href: '/company',
    icon: Building2,
    tagline: 'Industry Supervisors',
    description: 'Manage active intern technical tasks, review milestone deliverables, and evaluate candidate applications.',
    color: '#4F46E5',
  },
  {
    role: 'Administrator Portal',
    href: '/admin',
    icon: Shield,
    tagline: 'Institutional Governance',
    description: 'Campus-wide compliance analytics, partner MoU governance, multi-department analytics, and certificate issuance.',
    color: '#0284C7',
  },
];

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-slate-900">
      <div className="w-full max-w-xl">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft size={14} />
            <span>Back to Platform Home</span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Sparkles size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">ILMP</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Choose Your Portal
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Select your institutional role to enter the appropriate dashboard
          </p>
        </div>

        <div className="space-y-3.5">
          {portals.map((portal) => (
            <Link
              key={portal.role}
              to={portal.href}
              className="p-5 flex items-start gap-4 cursor-pointer group rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-150 block"
            >
              <div
                className="w-11 h-11 rounded-xl text-white flex items-center justify-center shadow-xs flex-shrink-0"
                style={{ backgroundColor: portal.color }}
              >
                <portal.icon size={22} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-slate-900">{portal.role}</h3>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {portal.tagline}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{portal.description}</p>
              </div>

              <ArrowRight
                size={16}
                className="text-slate-300 group-hover:translate-x-0.5 group-hover:text-slate-800 transition-all flex-shrink-0 mt-1"
              />
            </Link>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <Link to="/sign-in" className="font-semibold text-slate-800 hover:underline">
            Already have an account? Sign In
          </Link>
          <Link to="/verify/CERT-2026-001" className="hover:text-slate-700">
            Verify Certificate
          </Link>
        </div>
      </div>
    </div>
  );
}
