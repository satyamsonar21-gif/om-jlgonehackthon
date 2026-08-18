import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { 
  Search, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Bookmark, 
  Building2, 
  Filter, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  Briefcase,
  X,
  Send,
  SlidersHorizontal,
  BookmarkCheck
} from 'lucide-react';
import { toast } from 'sonner';

interface InternshipRole {
  id: number;
  company: string;
  initials: string;
  role: string;
  domain: string;
  location: string;
  duration: string;
  stipend: string;
  skills: string[];
  openings: number;
  verified: boolean;
  type: 'Remote' | 'Hybrid' | 'On-site';
}

const allRolesData: InternshipRole[] = [
  { id: 1, company: 'TechCorp Solutions', initials: 'TC', role: 'Full Stack Web Developer', domain: 'Software', location: 'Bangalore', duration: '12 weeks', stipend: '₹18,000/mo', skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'], openings: 5, verified: true, type: 'Hybrid' },
  { id: 2, company: 'Analytics Pro Labs', initials: 'AP', role: 'Data Science & AI Intern', domain: 'Data & AI', location: 'Remote', duration: '8 weeks', stipend: '₹20,000/mo', skills: ['Python', 'Pandas', 'TensorFlow', 'SQL'], openings: 3, verified: true, type: 'Remote' },
  { id: 3, company: 'Creative Studio Inc', initials: 'CS', role: 'UI/UX Product Designer', domain: 'Design', location: 'Mumbai', duration: '10 weeks', stipend: '₹15,000/mo', skills: ['Figma', 'Design Systems', 'User Research'], openings: 2, verified: true, type: 'On-site' },
  { id: 4, company: 'CloudBase Systems', initials: 'CB', role: 'DevOps & SRE Intern', domain: 'Cloud & DevOps', location: 'Hyderabad', duration: '12 weeks', stipend: '₹22,000/mo', skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'], openings: 4, verified: true, type: 'Hybrid' },
  { id: 5, company: 'FinTech Nexus', initials: 'FN', role: 'Backend API Engineer', domain: 'Software', location: 'Delhi NCR', duration: '12 weeks', stipend: '₹25,000/mo', skills: ['Go', 'Microservices', 'Redis', 'Kafka'], openings: 3, verified: true, type: 'Hybrid' },
  { id: 6, company: 'CyberShield Security', initials: 'CS', role: 'Cyber Security Analyst', domain: 'Security', location: 'Pune', duration: '8 weeks', stipend: '₹18,000/mo', skills: ['Penetration Testing', 'Wireshark', 'SOC', 'Linux'], openings: 2, verified: true, type: 'On-site' },
  { id: 7, company: 'NextGen AI Labs', initials: 'NA', role: 'Generative AI & LLM Engineer', domain: 'Data & AI', location: 'Remote', duration: '12 weeks', stipend: '₹30,000/mo', skills: ['PyTorch', 'LangChain', 'OpenAI API', 'Vector DBs'], openings: 4, verified: true, type: 'Remote' },
  { id: 8, company: 'MobileCraft Studios', initials: 'MC', role: 'Flutter Mobile App Developer', domain: 'Mobile', location: 'Bangalore', duration: '10 weeks', stipend: '₹16,000/mo', skills: ['Flutter', 'Dart', 'Firebase', 'State Management'], openings: 3, verified: true, type: 'Hybrid' },
  { id: 9, company: 'BlockChain Orbit', initials: 'BO', role: 'Solidity Smart Contract Intern', domain: 'Web3', location: 'Remote', duration: '8 weeks', stipend: '₹24,000/mo', skills: ['Solidity', 'Ethereum', 'Web3.js', 'Hardhat'], openings: 2, verified: true, type: 'Remote' },
  { id: 10, company: 'IoT Dynamics Corp', initials: 'ID', role: 'Embedded Systems & IoT Engineer', domain: 'IoT', location: 'Chennai', duration: '12 weeks', stipend: '₹16,000/mo', skills: ['C/C++', 'ESP32', 'MQTT', 'RTOS'], openings: 3, verified: true, type: 'On-site' },
  { id: 11, company: 'Quantum Logic Systems', initials: 'QL', role: 'Frontend React/Next.js Dev', domain: 'Software', location: 'Remote', duration: '8 weeks', stipend: '₹18,000/mo', skills: ['Next.js', 'TailwindCSS', 'Zustand', 'GraphQL'], openings: 6, verified: true, type: 'Remote' },
  { id: 12, company: 'BioData Solutions', initials: 'BS', role: 'Bioinformatics Data Analyst', domain: 'Data & AI', location: 'Hyderabad', duration: '10 weeks', stipend: '₹19,000/mo', skills: ['R', 'Biopython', 'Genomics Pipelines', 'SQL'], openings: 2, verified: true, type: 'Hybrid' },
  { id: 13, company: 'GameCraft Interactive', initials: 'GI', role: 'Unity 3D Game Developer', domain: 'Gaming', location: 'Pune', duration: '12 weeks', stipend: '₹15,000/mo', skills: ['Unity', 'C#', '3D Physics', 'Shader Graph'], openings: 3, verified: true, type: 'Hybrid' },
  { id: 14, company: 'RoboTech Automation', initials: 'RA', role: 'Robotics Software Intern', domain: 'IoT', location: 'Bangalore', duration: '12 weeks', stipend: '₹22,000/mo', skills: ['ROS 2', 'Python', 'Computer Vision', 'Gazebo'], openings: 2, verified: true, type: 'On-site' },
  { id: 15, company: 'HealthEdge Medical', initials: 'HE', role: 'HealthTech Backend Developer', domain: 'Software', location: 'Delhi NCR', duration: '10 weeks', stipend: '₹20,000/mo', skills: ['Java', 'Spring Boot', 'PostgreSQL', 'HIPAA'], openings: 4, verified: true, type: 'Hybrid' },
  { id: 16, company: 'OmniCloud Infra', initials: 'OI', role: 'Terraform & Infrastructure As Code', domain: 'Cloud & DevOps', location: 'Remote', duration: '8 weeks', stipend: '₹25,000/mo', skills: ['Terraform', 'GCP', 'Ansible', 'Prometheus'], openings: 3, verified: true, type: 'Remote' },
  { id: 17, company: 'PixelPerfect Media', initials: 'PM', role: 'Design Systems & Motion Designer', domain: 'Design', location: 'Mumbai', duration: '8 weeks', stipend: '₹14,000/mo', skills: ['Figma', 'Framer', 'After Effects', 'Prototyping'], openings: 2, verified: true, type: 'Hybrid' },
  { id: 18, company: 'SecuRate Networks', initials: 'SN', role: 'Network Security Intern', domain: 'Security', location: 'Bangalore', duration: '10 weeks', stipend: '₹17,000/mo', skills: ['TCP/IP', 'Firewalls', 'IDS/IPS', 'Cisco Packet Tracer'], openings: 3, verified: true, type: 'On-site' },
  { id: 19, company: 'SwiftNative Labs', initials: 'SL', role: 'iOS Swift Developer', domain: 'Mobile', location: 'Remote', duration: '10 weeks', stipend: '₹22,000/mo', skills: ['Swift', 'SwiftUI', 'CoreData', 'Combine'], openings: 2, verified: true, type: 'Remote' },
  { id: 20, company: 'DataWeave AI', initials: 'DA', role: 'Computer Vision Research Intern', domain: 'Data & AI', location: 'Bangalore', duration: '12 weeks', stipend: '₹28,000/mo', skills: ['OpenCV', 'YOLO', 'PyTorch', 'Image Processing'], openings: 3, verified: true, type: 'Hybrid' },
  { id: 21, company: 'SaaSify Hub', initials: 'SH', role: 'Product Management Intern', domain: 'Product', location: 'Remote', duration: '8 weeks', stipend: '₹15,000/mo', skills: ['Jira', 'Product Analytics', 'User Stories', 'Roadmapping'], openings: 2, verified: true, type: 'Remote' },
  { id: 22, company: 'ZeroBug Quality Labs', initials: 'ZQ', role: 'QA Automation Engineer', domain: 'Software', location: 'Hyderabad', duration: '10 weeks', stipend: '₹16,000/mo', skills: ['Selenium', 'Cypress', 'Playwright', 'Jest'], openings: 4, verified: true, type: 'Hybrid' },
  { id: 23, company: 'EdgeCompute AI', initials: 'EC', role: 'Edge AI & TinyML Developer', domain: 'IoT', location: 'Chennai', duration: '12 weeks', stipend: '₹20,000/mo', skills: ['TensorFlow Lite', 'Microcontrollers', 'C++', 'Edge TPU'], openings: 2, verified: true, type: 'On-site' },
  { id: 24, company: 'UrbanMobility EV', initials: 'UM', role: 'CAN Bus & Automotive Software', domain: 'IoT', location: 'Pune', duration: '12 weeks', stipend: '₹22,000/mo', skills: ['Embedded C', 'CAN Protocol', 'Simulink', 'BMS'], openings: 3, verified: true, type: 'On-site' },
  { id: 25, company: 'RetailSpire Systems', initials: 'RS', role: 'E-commerce Microservices Intern', domain: 'Software', location: 'Bangalore', duration: '10 weeks', stipend: '₹19,000/mo', skills: ['Node.js', 'GraphQL', 'MongoDB', 'AWS Lambda'], openings: 5, verified: true, type: 'Hybrid' },
  { id: 26, company: 'DeepNLP Labs', initials: 'DL', role: 'Multilingual NLP Intern', domain: 'Data & AI', location: 'Remote', duration: '8 weeks', stipend: '₹24,000/mo', skills: ['Transformers', 'HuggingFace', 'BERT', 'FastAPI'], openings: 3, verified: true, type: 'Remote' },
  { id: 27, company: 'AeroDrone Dynamics', initials: 'AD', role: 'Autonomous Navigation Intern', domain: 'IoT', location: 'Bangalore', duration: '12 weeks', stipend: '₹25,000/mo', skills: ['PX4', 'MAVLink', 'ROS', 'C++'], openings: 2, verified: true, type: 'On-site' },
  { id: 28, company: 'GreenGrid Solar AI', initials: 'GG', role: 'Energy Optimization Analytics', domain: 'Data & AI', location: 'Delhi NCR', duration: '10 weeks', stipend: '₹18,000/mo', skills: ['Python', 'Time Series Forecasting', 'Scikit-Learn'], openings: 3, verified: true, type: 'Hybrid' },
  { id: 29, company: 'CryptoShield Vaults', initials: 'CV', role: 'Smart Contract Auditor', domain: 'Web3', location: 'Remote', duration: '8 weeks', stipend: '₹30,000/mo', skills: ['Slither', 'Foundry', 'EVM Internals', 'Rust'], openings: 2, verified: true, type: 'Remote' },
  { id: 30, company: 'SynthAudio AI', initials: 'SA', role: 'Audio DSP & Speech AI Intern', domain: 'Data & AI', location: 'Remote', duration: '12 weeks', stipend: '₹26,000/mo', skills: ['Whisper', 'Librosa', 'PyTorch', 'Digital Signal Processing'], openings: 2, verified: true, type: 'Remote' },
  { id: 31, company: 'EnterpriseHub ERP', initials: 'EH', role: 'Enterprise SAP/Java Developer', domain: 'Software', location: 'Mumbai', duration: '12 weeks', stipend: '₹17,000/mo', skills: ['Java', 'Oracle DB', 'Hibernate', 'REST'], openings: 4, verified: true, type: 'Hybrid' },
  { id: 32, company: 'Acuity Vision AI', initials: 'AV', role: '3D Point Cloud Perception Intern', domain: 'Data & AI', location: 'Bangalore', duration: '12 weeks', stipend: '₹27,000/mo', skills: ['LiDAR', 'PCL', 'C++', 'PyTorch3D'], openings: 2, verified: true, type: 'Hybrid' },
];

export default function BrowseInternshipsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([1, 4, 7]);
  const [applyingRole, setApplyingRole] = useState<InternshipRole | null>(null);
  const [coverNote, setCoverNote] = useState('');

  const domains = ['All', 'Software', 'Data & AI', 'Cloud & DevOps', 'Design', 'Security', 'Mobile', 'IoT', 'Web3'];

  const filteredRoles = allRolesData.filter(job => {
    const matchesSearch = 
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDomain = selectedDomain === 'All' || job.domain === selectedDomain;
    const matchesType = selectedType === 'All' || job.type === selectedType;
    return matchesSearch && matchesDomain && matchesType;
  });

  const toggleBookmark = (id: number, company: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter(i => i !== id));
      toast.info(`Removed ${company} from bookmarks`);
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
      toast.success(`Bookmarked ${company} role`);
    }
  };

  const handleQuickApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingRole) return;
    toast.success(`Application submitted to ${applyingRole.company} for ${applyingRole.role}!`);
    setApplyingRole(null);
    setCoverNote('');
  };

  return (
    <div className="min-h-full pb-16" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header 
        title="Discover 30+ Industrial Roles" 
        subtitle="Explore verified university-approved partner internship opportunities" 
      />
      
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
        {/* Search & Filter Bar */}
        <div 
          className="rounded-2xl border shadow-sm p-5 space-y-4"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 30+ roles by company, title, domain, location, or skills (e.g. React, PyTorch, AWS, Figma)..." 
              className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
            {/* Domain Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-3xl">
              <span className="text-xs font-mono font-bold uppercase mr-1" style={{ color: 'var(--text-muted)' }}>Domain:</span>
              {domains.map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDomain(d)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedDomain === d
                      ? 'bg-[#C2410C] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Mode Filter */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-xs font-mono font-bold uppercase mr-1" style={{ color: 'var(--text-muted)' }}>Mode:</span>
              {['All', 'Remote', 'Hybrid', 'On-site'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedType === type
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          <span><strong>{filteredRoles.length}</strong> of 32 verified listings match your criteria</span>
          <span>Academic Year 2026</span>
        </div>

        {/* Internships Grid (30+ roles) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRoles.map((job) => {
            const isBookmarked = bookmarkedIds.includes(job.id);

            return (
              <motion.div 
                key={job.id} 
                initial={{ opacity: 0, y: 12 }} 
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border p-6 flex flex-col justify-between space-y-4 shadow-sm transition-all hover:scale-[1.01] hover:shadow-md"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)'
                }}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 border shadow-xs"
                        style={{
                          backgroundColor: 'var(--accent-soft)',
                          color: 'var(--role-accent, var(--cta))',
                          borderColor: 'var(--border)'
                        }}
                      >
                        {job.initials}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm leading-tight" style={{ color: 'var(--text)' }}>
                          {job.role}
                        </h3>
                        <span className="text-[11px] font-semibold block mt-0.5" style={{ color: 'var(--role-accent, var(--cta))' }}>
                          {job.company}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => toggleBookmark(job.id, job.company)}
                      title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      {isBookmarked ? <BookmarkCheck size={18} className="text-amber-500 fill-amber-500" /> : <Bookmark size={18} />}
                    </button>
                  </div>

                  <div className="space-y-1.5 mt-4 pt-3 border-t text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                      <span>{job.location} ({job.type})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-slate-400 flex-shrink-0" />
                      <span>{job.duration} · {job.openings} Openings</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono font-bold" style={{ color: 'var(--text)' }}>
                      <IndianRupee size={13} className="text-slate-400 flex-shrink-0" />
                      <span>{job.stipend}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {job.skills.map(s => (
                      <span 
                        key={s} 
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
                  <Link 
                    to={`/student/internships/${job.id}`} 
                    className="flex-1 py-2 rounded-xl border text-center text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                  >
                    View Details
                  </Link>
                  <button 
                    onClick={() => setApplyingRole(job)}
                    className="py-2 px-4 rounded-xl text-white text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-xs hover:scale-105 cursor-pointer"
                    style={{ backgroundColor: 'var(--cta)' }}
                  >
                    Quick Apply
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Apply Modal */}
        {applyingRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div 
              className="rounded-2xl border shadow-2xl p-6 max-w-lg w-full space-y-4 animate-in fade-in zoom-in-95"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#C2410C]" />
                  <h3 className="font-bold text-sm">Quick Apply for Internship</h3>
                </div>
                <button onClick={() => setApplyingRole(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border space-y-1" style={{ borderColor: 'var(--border)' }}>
                <div className="font-bold text-xs">{applyingRole.role}</div>
                <div className="text-xs font-mono text-[#C2410C]">{applyingRole.company} · {applyingRole.stipend}</div>
              </div>

              <form onSubmit={handleQuickApply} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold font-mono uppercase text-slate-500 block">Applicant Profile</label>
                  <div className="p-2.5 rounded-xl border bg-white dark:bg-slate-800 font-mono" style={{ borderColor: 'var(--border)' }}>
                    Priya Sharma (20CS101) · 3rd Year CSE · CGPA: 8.7
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold font-mono uppercase text-slate-500 block">Cover Pitch / Candidate Statement</label>
                  <textarea
                    rows={3}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Briefly state your relevant projects and why you'd be a great fit..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 focus:outline-none"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <button
                    type="button"
                    onClick={() => setApplyingRole(null)}
                    className="px-4 py-2 rounded-xl border text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#C2410C] text-white text-xs font-bold font-mono tracking-wider uppercase flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Send size={13} />
                    <span>Submit Application</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
