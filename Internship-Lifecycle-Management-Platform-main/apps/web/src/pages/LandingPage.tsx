import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Search, 
  FileText, 
  CheckCircle2, 
  Users, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck,
  Building2,
  BookOpen,
  Sparkles,
  ChevronRight,
  Shield,
  Clock,
  Award,
  Lock,
  Layers,
  Send,
  UserCheck,
  Check,
  QrCode,
  ArrowUpRight,
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';

const lifecycleSteps = [
  {
    step: 1,
    title: 'Discover',
    role: 'Student',
    desc: 'Browse verified listings from accredited industry partners with transparent compensation and skill prerequisites.',
    icon: Search,
    detailHeading: 'Verified Partner Marketplace',
    detailSub: '32+ approved opportunities updated weekly by verified corporate partners.',
    sampleTag: '32 Active Listings',
  },
  {
    step: 2,
    title: 'Apply',
    role: 'Student & Faculty',
    desc: 'Submit application dossiers with instant academic department clearance and automated NOC generation.',
    icon: Send,
    detailHeading: 'Automated Faculty Clearance',
    detailSub: 'Department HODs approve dossiers with digital sign-off and prerequisite verification.',
    sampleTag: 'Automated NOC Protocol',
  },
  {
    step: 3,
    title: 'Select',
    role: 'Company Mentor',
    desc: 'Conduct interviews, screen candidates, and issue formal selection letters with digital offer management.',
    icon: CheckCircle2,
    detailHeading: 'Structured Candidate Screening',
    detailSub: 'Direct interview scheduling, technical screening, and institutional offer letters.',
    sampleTag: 'Instant Offer Letters',
  },
  {
    step: 4,
    title: 'Onboard',
    role: 'Institution & Company',
    desc: 'Formalize MoUs, assign academic guides, and complete compliance documentation automatically.',
    icon: UserCheck,
    detailHeading: 'Institutional MoU Governance',
    detailSub: 'Automatic binding of college guide, corporate mentor, and 12-week syllabus roadmap.',
    sampleTag: 'MoU Compliance Stamped',
  },
  {
    step: 5,
    title: 'Work',
    role: 'Student & Mentor',
    desc: 'Clock in daily biometric attendance, document deliverables, and complete sprint milestones.',
    icon: Briefcase,
    detailHeading: 'Daily Telemetry & Sprint Milestones',
    detailSub: 'Biometric shift clock-in, daily task notes, and GitHub pull request linking.',
    sampleTag: 'Live Telemetry & Work Logs',
  },
  {
    step: 6,
    title: 'Review',
    role: 'Faculty & Mentor',
    desc: 'Weekly synthesis evaluations, academic progress tracking, and formal supervisor feedback.',
    icon: FileText,
    detailHeading: 'Dual-Review Evaluation Framework',
    detailSub: 'Both corporate supervisor and university faculty evaluate weekly progress out of 5.0.',
    sampleTag: 'Academic Grade Appraisals',
  },
  {
    step: 7,
    title: 'Certify',
    role: 'Administrator',
    desc: 'Generate digitally signed, QR-verifiable certificates accredited by the university academic council.',
    icon: Award,
    detailHeading: 'Ed25519 Cryptographic Certification',
    detailSub: 'Tamper-proof verifiable credentials with public QR code validation.',
    sampleTag: 'QR Public Verification',
  },
];

const partnerCompanies = [
  { name: 'TechCorp Solutions', domain: 'Enterprise Cloud & SaaS', interns: 16 },
  { name: 'Innovatech Labs', domain: 'AI & Data Science', interns: 12 },
  { name: 'CloudScale Systems', domain: 'DevOps & SRE', interns: 8 },
  { name: 'CyberShield Security', domain: 'AppSec & Cryptography', interns: 6 },
  { name: 'Creative Studio Inc', domain: 'UI/UX & Product Design', interns: 5 },
  { name: 'Apex Robotics', domain: 'Embedded Systems & IoT', interns: 7 },
];

const faqs = [
  {
    q: 'How does ILMP enforce institutional attendance compliance?',
    a: 'ILMP tracks daily biometric timestamps and verified work logs. When a student falls below the mandatory 75% attendance threshold, automated alerts are dispatched to the Faculty Guide and Administrator.',
  },
  {
    q: 'How are internship completion certificates cryptographically verified?',
    a: 'Every issued certificate is stamped with an Ed25519 cryptographic signature and assigned a unique URL and QR code. Employers and background check services can verify authenticity instantly on the public validation portal.',
  },
  {
    q: 'Can students apply for internships across multiple departments?',
    a: 'Yes, students can browse all university-approved listings. However, every application automatically triggers an academic department clearance and NOC sign-off to ensure curriculum alignment.',
  },
  {
    q: 'How do company mentors evaluate student deliverables?',
    a: 'Company mentors have a dedicated dashboard to assign sprint deliverables, approve daily work logs, and submit structured appraisals on a 5.0 rubric scale.',
  },
];

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState<number>(5); // Default WORK stage
  const [certInput, setCertInput] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = certInput.trim() || 'CERT-2026-001';
    navigate(`/verify/${code}`);
  };

  const selectedLifecycle = lifecycleSteps.find((s) => s.step === activeStep) || lifecycleSteps[4];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Sparkles size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-slate-900 leading-tight">ILMP</span>
              <span className="text-[10px] font-mono text-slate-500 tracking-wider">Academic Edition</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#roles" className="hover:text-slate-900 transition-colors">Portals & Roles</a>
            <a href="#partners" className="hover:text-slate-900 transition-colors">Partners</a>
            <a href="#verification" className="hover:text-slate-900 transition-colors">Verify Credential</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/sign-in">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight size={14} />}>
                Choose Portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* 2. Hero Section */}
        <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-mono font-semibold shadow-xs mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>University Internship Lifecycle Management Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.18] max-w-4xl mx-auto">
            Manage Every University Internship From One Unified Platform
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto mt-5 font-normal">
            Connect students, academic faculty guides, industry supervisors, and institutional administrators through one transparent, auditable lifecycle.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link to="/sign-in" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                Launch Demonstration Portal
              </Button>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Explore 7-Stage Lifecycle
              </Button>
            </a>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-14 pt-8 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">1,280+</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Enrolled Students</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">142</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Accredited Corporate MoUs</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600">92.4%</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Placement Conversion</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">920+</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Signed Certificates</div>
            </div>
          </div>
        </section>

        {/* 3. Four Role Portals Grid */}
        <section id="roles" className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-1.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--role-accent)]">
                Four Specialized Portals
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Designed for Every University Stakeholder
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Tailored workflows optimized for each participant in the internship process.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Student Portal */}
              <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-amber-400 hover:shadow-md transition-all">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Student Portal</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Discover verified roles, clock daily work logs, submit weekly synthesis reports, and earn accredited certificates.
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/80">
                  <Link to="/student" className="text-xs font-bold text-amber-700 hover:underline inline-flex items-center gap-1">
                    <span>Enter Student Portal</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Faculty Guide Portal */}
              <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-emerald-400 hover:shadow-md transition-all">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Faculty Guide Portal</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Track supervised student cohort attendance, evaluate weekly academic synthesis submissions, and guide at-risk interns.
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/80">
                  <Link to="/faculty" className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1">
                    <span>Enter Faculty Portal</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Company Mentor Portal */}
              <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-indigo-400 hover:shadow-md transition-all">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Company Mentor Portal</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Post verified listings, allocate sprint technical deliverables, evaluate work milestone logs, and provide feedback.
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/80">
                  <Link to="/company" className="text-xs font-bold text-indigo-700 hover:underline inline-flex items-center gap-1">
                    <span>Enter Company Portal</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Administrator Portal */}
              <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-sky-400 hover:shadow-md transition-all">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Administrator Portal</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Campus-wide compliance oversight, partner MoU governance, multi-department analytics, and cryptographic certificate issuance.
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/80">
                  <Link to="/admin" className="text-xs font-bold text-sky-700 hover:underline inline-flex items-center gap-1">
                    <span>Enter Admin Portal</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. 7-Stage Stepper & Interactive Simulator Section */}
        <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              End-to-End Lifecycle
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              7-Stage Structured Internship Progression
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Click any stage below to explore real-time institutional workflows.
            </p>
          </div>

          {/* Stepper Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {lifecycleSteps.map((item) => {
              const isActive = activeStep === item.step;
              const StepIcon = item.icon;

              return (
                <div
                  key={item.step}
                  onClick={() => setActiveStep(item.step)}
                  className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between select-none ${
                    isActive
                      ? 'bg-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <StepIcon size={16} />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        0{item.step}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {item.role}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-1.5">{item.title}</h4>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 text-[10px] font-mono text-slate-400">
                    Stage 0{item.step}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Stage Preview Card */}
          <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  STAGE 0{selectedLifecycle.step} · {selectedLifecycle.title.toUpperCase()}
                </span>
                <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                  {selectedLifecycle.sampleTag}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {selectedLifecycle.detailHeading}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedLifecycle.desc}
              </p>

              <p className="text-xs font-medium text-slate-500">
                {selectedLifecycle.detailSub}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <Link to="/sign-in" className="w-full sm:w-auto">
                <Button variant="primary" size="md" className="w-full sm:w-auto" rightIcon={<ArrowRight size={14} />}>
                  Explore Stage 0{selectedLifecycle.step} in Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Accredited Corporate Partners Showcase */}
        <section id="partners" className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                Industry Collaboration
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Accredited Corporate Partners
              </h2>
              <p className="text-xs text-slate-600">
                142 verified industry leaders offering structured placements and formal student appraisals.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {partnerCompanies.map((comp) => (
                <div
                  key={comp.name}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1 hover:border-slate-300 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs mx-auto shadow-2xs">
                    {comp.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="font-bold text-xs text-slate-900 truncate">{comp.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{comp.domain}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Cryptographic Certificate Public Verification */}
        <section id="verification" className="py-20 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck size={28} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Instant Public Certificate Verification
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                Enter any certificate ID to verify authenticity, student PRN, host organization, academic grade, and cryptographic signature in real time.
              </p>
            </div>

            {/* Interactive Verification Form */}
            <form onSubmit={handleVerifySubmit} className="max-w-md mx-auto flex items-center gap-2">
              <input
                type="text"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                placeholder="Enter Certificate Code (e.g. CERT-2026-001)"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all font-mono"
              />
              <Button type="submit" variant="secondary" size="md" rightIcon={<ArrowRight size={14} />}>
                Verify
              </Button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 pt-2">
              <span>Try sample credentials:</span>
              <button
                type="button"
                onClick={() => setCertInput('CERT-2026-001')}
                className="font-mono text-amber-400 hover:underline cursor-pointer"
              >
                CERT-2026-001
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setCertInput('CERT-2026-002')}
                className="font-mono text-amber-400 hover:underline cursor-pointer"
              >
                CERT-2026-002
              </button>
            </div>
          </div>
        </section>

        {/* 7. FAQ Accordion */}
        <section id="faq" className="py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Institutional Platform Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx;

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/60"
                  >
                    <span className="font-bold text-xs text-slate-900">{item.q}</span>
                    <ChevronDown
                      size={16}
                      className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-slate-900' : ''}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* 8. Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              I
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900">ILMP Platform</span>
              <span className="text-[10px] font-mono text-slate-400">University Internship Lifecycle Protocol</span>
            </div>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link to="/sign-in" className="hover:text-slate-900">Sign In</Link>
            <Link to="/sign-up" className="hover:text-slate-900">Choose Portal</Link>
            <Link to="/verify/CERT-2026-001" className="hover:text-slate-900">Verify Credential</Link>
          </div>

          <p className="text-[11px] font-mono">© 2026 ILMP. Academic Production Edition.</p>
        </div>
      </footer>
    </div>
  );
}
