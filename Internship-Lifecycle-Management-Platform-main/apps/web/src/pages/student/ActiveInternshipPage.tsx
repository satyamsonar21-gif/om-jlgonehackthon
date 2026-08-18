import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Link } from 'react-router-dom';
import { 
  PenLine, 
  FileText, 
  Calendar, 
  CheckSquare, 
  MessageSquare, 
  ChevronRight, 
  Building2, 
  User, 
  Clock, 
  Sparkles, 
  Search, 
  Filter, 
  Award, 
  CheckCircle2, 
  Briefcase,
  Layers,
  MapPin,
  IndianRupee,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { toast } from 'sonner';

const enrolledInternship = {
  company: 'TechCorp Solutions', 
  role: 'Software Engineering Intern',
  mentor: 'Siddharth Nambiar (Principal Architect)', 
  facultyAdvisor: 'Dr. Rajesh Kumar',
  startDate: 'Jul 1, 2026', 
  endDate: 'Sep 30, 2026',
  mode: 'Hybrid (Bangalore Campus)', 
  week: 4,
  totalWeeks: 12,
  track: 'Full Stack Distributed Systems'
};

const activeHubModules = [
  { title: 'Daily Work Logs', desc: 'Record daily pull requests, Jira commits & sprint progress', href: '/student/active/logs', icon: PenLine, badge: "Today's Log Pending", color: 'var(--highlights)' },
  { title: 'Weekly Reports', desc: 'Submit formal synthesized reports for academic review', href: '/student/active/reports', icon: FileText, badge: 'Week 5 Due Tomorrow', color: 'var(--cta)' },
  { title: 'Attendance Ledger', desc: 'View date-wise biometric geolocation clock-in history', href: '/student/active/attendance', icon: Calendar, badge: '92.5% Clocked', color: '#10B981' },
  { title: 'Assigned Tasks', desc: 'Sprint deliverables, GitHub code reviews & backlog items', href: '/student/active/tasks', icon: CheckSquare, badge: '8 / 10 Completed', color: 'var(--highlights)' },
  { title: 'Mentor Feedback', desc: 'Performance ratings, rubric evaluation & code quality notes', href: '/student/active/feedback', icon: MessageSquare, badge: '1 New Review', color: '#F59E0B' },
  { title: 'Certificates Registry', desc: 'Cryptographically signed completion certificate', href: '/student/certificates', icon: Award, badge: 'Eligible Post W12', color: 'var(--cta)' },
];

interface ActiveBatchInternship {
  id: number;
  company: string;
  role: string;
  cohort: string;
  studentsEnrolled: number;
  mode: string;
  location: string;
  stipend: string;
  leadMentor: string;
  status: 'In Progress' | 'Mid-Term Review' | 'Final Evaluation';
  skills: string[];
}

const activeInternshipsList: ActiveBatchInternship[] = [
  { id: 1, company: 'TechCorp Solutions', role: 'Full Stack Cloud Microservices', cohort: 'CSE-2026-A1', studentsEnrolled: 8, mode: 'Hybrid', location: 'Bangalore', stipend: '₹18,000/mo', leadMentor: 'Siddharth Nambiar', status: 'In Progress', skills: ['React', 'Node.js', 'PostgreSQL', 'Docker'] },
  { id: 2, company: 'Analytics Pro Labs', role: 'Data Science & Predictive AI', cohort: 'DS-2026-B1', studentsEnrolled: 6, mode: 'Remote', location: 'Hyderabad', stipend: '₹20,000/mo', leadMentor: 'Dr. Neha Verma', status: 'In Progress', skills: ['Python', 'TensorFlow', 'SQL', 'FastAPI'] },
  { id: 3, company: 'Creative Studio Inc', role: 'Product Design & Design Systems', cohort: 'DES-2026-A', studentsEnrolled: 4, mode: 'On-site', location: 'Mumbai', stipend: '₹15,000/mo', leadMentor: 'Rohan Deshmukh', status: 'In Progress', skills: ['Figma', 'UI/UX Research', 'Framer'] },
  { id: 4, company: 'CloudBase Systems', role: 'DevOps & SRE Engineering', cohort: 'IT-2026-C2', studentsEnrolled: 5, mode: 'Hybrid', location: 'Hyderabad', stipend: '₹22,000/mo', leadMentor: 'Aakash Mehra', status: 'In Progress', skills: ['AWS', 'Kubernetes', 'Terraform', 'Prometheus'] },
  { id: 5, company: 'FinTech Nexus Global', role: 'High-Frequency Backend API', cohort: 'CSE-2026-FN', studentsEnrolled: 7, mode: 'Hybrid', location: 'Delhi NCR', stipend: '₹25,000/mo', leadMentor: 'Pooja Bhatia', status: 'Mid-Term Review', skills: ['Go', 'Kafka', 'Redis', 'Microservices'] },
  { id: 6, company: 'CyberShield Security', role: 'SOC & Penetration Testing', cohort: 'SEC-2026-A', studentsEnrolled: 3, mode: 'On-site', location: 'Pune', stipend: '₹18,000/mo', leadMentor: 'Vikram Joshi', status: 'In Progress', skills: ['Wireshark', 'Burp Suite', 'Linux', 'Splunk'] },
  { id: 7, company: 'NextGen AI Labs', role: 'LLM & Generative Agents', cohort: 'AI-2026-G1', studentsEnrolled: 5, mode: 'Remote', location: 'Remote', stipend: '₹30,000/mo', leadMentor: 'Dr. Sandeep Rao', status: 'In Progress', skills: ['LangChain', 'PyTorch', 'Vector DB', 'RAG'] },
  { id: 8, company: 'MobileCraft Studios', role: 'Cross-Platform Mobile Dev', cohort: 'IT-2026-M1', studentsEnrolled: 4, mode: 'Hybrid', location: 'Bangalore', stipend: '₹16,000/mo', leadMentor: 'Ananya Roy', status: 'In Progress', skills: ['Flutter', 'Dart', 'Firebase'] },
  { id: 9, company: 'BlockChain Orbit', role: 'Smart Contracts & Web3 Security', cohort: 'CSE-2026-W3', studentsEnrolled: 3, mode: 'Remote', location: 'Remote', stipend: '₹24,000/mo', leadMentor: 'Varun Nair', status: 'Mid-Term Review', skills: ['Solidity', 'Hardhat', 'Ethers.js'] },
  { id: 10, company: 'IoT Dynamics Corp', role: 'Embedded Systems & Firmware', cohort: 'ECE-2026-I1', studentsEnrolled: 6, mode: 'On-site', location: 'Chennai', stipend: '₹16,000/mo', leadMentor: 'K. Balaji', status: 'In Progress', skills: ['Embedded C', 'ESP32', 'FreeRTOS'] },
  { id: 11, company: 'Quantum Logic Systems', role: 'Frontend Architecture & SSR', cohort: 'CSE-2026-Q1', studentsEnrolled: 5, mode: 'Remote', location: 'Remote', stipend: '₹18,000/mo', leadMentor: 'Meera Sen', status: 'In Progress', skills: ['Next.js', 'TypeScript', 'Tailwind'] },
  { id: 12, company: 'BioData Solutions', role: 'Genomics Computational Biology', cohort: 'BIO-2026-A', studentsEnrolled: 3, mode: 'Hybrid', location: 'Hyderabad', stipend: '₹19,000/mo', leadMentor: 'Dr. Kavita Iyer', status: 'In Progress', skills: ['R', 'Biopython', 'BLAST', 'SQL'] },
  { id: 13, company: 'GameCraft Interactive', role: '3D Simulation & Game Physics', cohort: 'CSE-2026-G', studentsEnrolled: 4, mode: 'Hybrid', location: 'Pune', stipend: '₹15,000/mo', leadMentor: 'Sameer Khan', status: 'In Progress', skills: ['Unity', 'C#', 'ShaderLab'] },
  { id: 14, company: 'RoboTech Automation', role: 'Autonomous Rover & ROS 2', cohort: 'MECH-2026-R', studentsEnrolled: 4, mode: 'On-site', location: 'Bangalore', stipend: '₹22,000/mo', leadMentor: 'Gaurav Patil', status: 'Mid-Term Review', skills: ['ROS 2', 'OpenCV', 'Python'] },
  { id: 15, company: 'HealthEdge Medical', role: 'Healthcare EHR & API Integrations', cohort: 'CSE-2026-H', studentsEnrolled: 5, mode: 'Hybrid', location: 'Delhi NCR', stipend: '₹20,000/mo', leadMentor: 'Dr. Arjun Dixit', status: 'In Progress', skills: ['Spring Boot', 'HL7 FHIR', 'PostgreSQL'] },
  { id: 16, company: 'OmniCloud Infra', role: 'Multi-Cloud Automation & Terraform', cohort: 'IT-2026-OC', studentsEnrolled: 4, mode: 'Remote', location: 'Remote', stipend: '₹25,000/mo', leadMentor: 'Naveen Kumar', status: 'In Progress', skills: ['Terraform', 'GCP', 'Ansible'] },
  { id: 17, company: 'PixelPerfect Media', role: 'Motion UI & Brand Experience', cohort: 'DES-2026-P', studentsEnrolled: 2, mode: 'Hybrid', location: 'Mumbai', stipend: '₹14,000/mo', leadMentor: 'Tanvi Shah', status: 'In Progress', skills: ['Figma', 'After Effects', 'Prototyping'] },
  { id: 18, company: 'SecuRate Networks', role: 'Enterprise Perimeter Defense', cohort: 'SEC-2026-B', studentsEnrolled: 3, mode: 'On-site', location: 'Bangalore', stipend: '₹17,000/mo', leadMentor: 'M. Sridhar', status: 'In Progress', skills: ['Firewalls', 'TCP/IP', 'Linux'] },
  { id: 19, company: 'SwiftNative Labs', role: 'Native iOS Swift Development', cohort: 'IT-2026-iOS', studentsEnrolled: 3, mode: 'Remote', location: 'Remote', stipend: '₹22,000/mo', leadMentor: 'Kiran Desai', status: 'In Progress', skills: ['Swift', 'SwiftUI', 'CoreData'] },
  { id: 20, company: 'DataWeave AI', role: 'Vision Transformers & Deep Learning', cohort: 'AI-2026-CV', studentsEnrolled: 4, mode: 'Hybrid', location: 'Bangalore', stipend: '₹28,000/mo', leadMentor: 'Dr. Manoj Pillai', status: 'Mid-Term Review', skills: ['PyTorch', 'YOLO', 'Torchvision'] },
  { id: 21, company: 'SaaSify Hub', role: 'Agile Product Management & Metrics', cohort: 'MBA-2026-P', studentsEnrolled: 3, mode: 'Remote', location: 'Remote', stipend: '₹15,000/mo', leadMentor: 'Pooja Agarwal', status: 'In Progress', skills: ['Jira', 'Mixpanel', 'Roadmaps'] },
  { id: 22, company: 'ZeroBug Quality Labs', role: 'Full Suite Test Automation', cohort: 'CSE-2026-QA', studentsEnrolled: 5, mode: 'Hybrid', location: 'Hyderabad', stipend: '₹16,000/mo', leadMentor: 'Rajeev Menon', status: 'In Progress', skills: ['Playwright', 'Cypress', 'Jest'] },
  { id: 23, company: 'EdgeCompute AI', role: 'Embedded Neural Networks', cohort: 'ECE-2026-E', studentsEnrolled: 3, mode: 'On-site', location: 'Chennai', stipend: '₹20,000/mo', leadMentor: 'L. Natarajan', status: 'In Progress', skills: ['TensorFlow Lite', 'C++', 'Microcontrollers'] },
  { id: 24, company: 'UrbanMobility EV', role: 'Automotive Telematics & BMS', cohort: 'EEE-2026-EV', studentsEnrolled: 4, mode: 'On-site', location: 'Pune', stipend: '₹22,000/mo', leadMentor: 'Deepak Sawant', status: 'In Progress', skills: ['CAN Bus', 'Embedded C', 'Simulink'] },
  { id: 25, company: 'RetailSpire Systems', role: 'Omnichannel Commerce APIs', cohort: 'CSE-2026-R', studentsEnrolled: 6, mode: 'Hybrid', location: 'Bangalore', stipend: '₹19,000/mo', leadMentor: 'Harish Varma', status: 'In Progress', skills: ['Node.js', 'GraphQL', 'AWS'] },
  { id: 26, company: 'DeepNLP Labs', role: 'Conversational Bot Architecture', cohort: 'AI-2026-NLP', studentsEnrolled: 4, mode: 'Remote', location: 'Remote', stipend: '₹24,000/mo', leadMentor: 'Dr. Shilpa Sethi', status: 'In Progress', skills: ['HuggingFace', 'Transformers', 'FastAPI'] },
];

export default function ActiveInternshipPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCohort, setSelectedCohort] = useState('All');
  const [inspectingProject, setInspectingProject] = useState<ActiveBatchInternship | null>(null);

  const progress = Math.round((enrolledInternship.week / enrolledInternship.totalWeeks) * 100);

  const filteredInternships = activeInternshipsList.filter(item => {
    const matchesSearch = 
      item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.leadMentor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCohort = selectedCohort === 'All' || item.mode === selectedCohort;
    return matchesSearch && matchesCohort;
  });

  return (
    <div className="min-h-full pb-16" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header 
        title="Active Internship Workspace & All Batch Tracks" 
        subtitle="Live telemetry for enrolled industrial sprint & 25+ partner batch programs" 
      />
      
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* Enrolled Internship Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border shadow-sm p-6 sm:p-7 space-y-5"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-xs border flex-shrink-0"
                style={{
                  backgroundColor: 'var(--accent-soft)',
                  color: 'var(--role-accent, var(--cta))',
                  borderColor: 'var(--border)'
                }}
              >
                TC
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
                    {enrolledInternship.role}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    CURRENTLY ENROLLED
                  </span>
                </div>
                <p className="text-xs font-semibold" style={{ color: 'var(--role-accent, var(--cta))' }}>
                  {enrolledInternship.company} · <span className="font-normal opacity-80" style={{ color: 'var(--text-muted)' }}>{enrolledInternship.track}</span>
                </p>
                <div className="flex flex-wrap gap-4 mt-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1.5"><User size={13} /> {enrolledInternship.mentor}</span>
                  <span className="flex items-center gap-1.5"><Clock size={13} /> {enrolledInternship.startDate} – {enrolledInternship.endDate}</span>
                  <span className="flex items-center gap-1.5"><Building2 size={13} /> {enrolledInternship.mode}</span>
                </div>
              </div>
            </div>

            <div 
              className="p-4 rounded-xl border space-y-1 text-left md:text-right flex-shrink-0"
              style={{ backgroundColor: 'var(--surface-muted)', borderColor: 'var(--border)' }}
            >
              <span className="text-xs font-mono font-semibold" style={{ color: 'var(--text-muted)' }}>Term Sprint Status</span>
              <div className="text-2xl font-bold font-mono" style={{ color: 'var(--text)' }}>
                Week {enrolledInternship.week} of {enrolledInternship.totalWeeks}
              </div>
              <span className="text-[11px] font-mono block font-semibold text-emerald-600">
                {progress}% Syllabus Completed
              </span>
            </div>
          </div>

          <div className="pt-1">
            <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }} 
                animate={{ width: `${progress}%` }} 
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-full rounded-full"
                style={{ backgroundColor: 'var(--cta)' }}
              />
            </div>
          </div>
        </motion.div>

        {/* 6 Core Hub Action Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Sprint Execution Modules</h3>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Active Telemetry</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeHubModules.map((hub, i) => (
              <Link
                key={i}
                to={hub.href}
                className="rounded-2xl border p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-sm transition-all hover:scale-[1.01] hover:shadow-md cursor-pointer group"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)'
                }}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center shadow-xs border transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: 'var(--accent-soft)',
                        color: hub.color,
                        borderColor: 'var(--border)'
                      }}
                    >
                      <hub.icon size={20} />
                    </div>
                    <span 
                      className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border bg-slate-100 dark:bg-slate-800"
                      style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                    >
                      {hub.badge}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm mt-3" style={{ color: 'var(--text)' }}>{hub.title}</h4>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{hub.desc}</p>
                </div>

                <div className="pt-3 border-t flex items-center justify-between text-xs font-semibold" style={{ borderColor: 'var(--border)', color: hub.color }}>
                  <span>Open Module</span>
                  <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 25+ Active Internships Directory Section */}
        <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base sm:text-lg tracking-tight" style={{ color: 'var(--text)' }}>
                All 25+ Active Institutional Partner Programs
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Explore live industry tracks running concurrently across the university engineering cohort
              </p>
            </div>

            <div className="flex items-center gap-2">
              {['All', 'Remote', 'Hybrid', 'On-site'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setSelectedCohort(mode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedCohort === mode
                      ? 'bg-[#C2410C] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar for 25+ Active Internships */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 25+ active tracks by role, company, mentor, or skills..." 
              className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>

          {/* 25+ Internships Table/Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInternships.map((track) => (
              <div
                key={track.id}
                className="rounded-2xl border p-5 space-y-3 shadow-xs transition-all hover:scale-[1.01]"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm leading-tight" style={{ color: 'var(--text)' }}>
                      {track.role}
                    </h4>
                    <span className="text-xs font-semibold block mt-0.5" style={{ color: 'var(--role-accent, var(--cta))' }}>
                      {track.company}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    {track.studentsEnrolled} Interns
                  </span>
                </div>

                <div className="text-xs space-y-1 font-mono" style={{ color: 'var(--text-muted)' }}>
                  <div>Lead: <span className="font-medium" style={{ color: 'var(--text)' }}>{track.leadMentor}</span></div>
                  <div>Mode: <span className="font-medium">{track.location} ({track.mode})</span></div>
                  <div>Stipend: <span className="font-bold text-[#C2410C]">{track.stipend}</span></div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {track.skills.slice(0, 3).map(s => (
                    <span key={s} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 border" style={{ borderColor: 'var(--border)' }}>
                      {s}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-[10px] font-mono font-semibold" style={{ color: 'var(--text-muted)' }}>Cohort: {track.cohort}</span>
                  <button
                    onClick={() => {
                      setInspectingProject(track);
                      toast.info(`Inspecting ${track.company} syllabus`);
                    }}
                    className="text-xs font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                    style={{ color: 'var(--role-accent, var(--cta))' }}
                  >
                    <span>Track Details</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track Details Modal */}
        {inspectingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div 
              className="rounded-2xl border shadow-2xl p-6 max-w-lg w-full space-y-4 animate-in fade-in zoom-in-95"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#C2410C]" />
                  <h3 className="font-bold text-sm">Industrial Track Syllabus & Mentorship</h3>
                </div>
                <button onClick={() => setInspectingProject(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-900 space-y-1 font-mono" style={{ borderColor: 'var(--border)' }}>
                  <p><strong>Role:</strong> {inspectingProject.role}</p>
                  <p><strong>Company:</strong> {inspectingProject.company}</p>
                  <p><strong>Lead Mentor:</strong> {inspectingProject.leadMentor}</p>
                  <p><strong>Location:</strong> {inspectingProject.location} ({inspectingProject.mode})</p>
                  <p><strong>Stipend:</strong> {inspectingProject.stipend}</p>
                  <p><strong>Cohort Code:</strong> {inspectingProject.cohort}</p>
                  <p><strong>Enrolled Students:</strong> {inspectingProject.studentsEnrolled} Active</p>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold block">Verified Technical Competencies:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {inspectingProject.skills.map(s => (
                      <span key={s} className="px-2.5 py-1 rounded-lg font-mono text-xs bg-slate-100 dark:bg-slate-800 border" style={{ borderColor: 'var(--border)' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <button
                  onClick={() => setInspectingProject(null)}
                  className="px-4 py-2 rounded-xl bg-[#C2410C] text-white text-xs font-bold font-mono tracking-wider uppercase cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
