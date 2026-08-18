import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import { 
  FileText, 
  Check, 
  X, 
  User, 
  GraduationCap, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Calendar, 
  Send,
  Sparkles,
  Award,
  ChevronRight,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

export interface CompanyCandidateApplication {
  id: number;
  name: string;
  roll: string;
  college: string;
  department: string;
  cgpa: string;
  role: string;
  appliedDate: string;
  skills: string[];
  status: 'Pending' | 'Shortlisted' | 'Interviewing' | 'Accepted' | 'Rejected';
  email: string;
  portfolio: string;
}

const companyApplicationsList: CompanyCandidateApplication[] = [
  { id: 1, name: 'Rahul Sharma', roll: '20CS101', college: 'CSE Dept', department: 'Computer Science', cgpa: '8.7', role: 'Full Stack Engineering Intern', appliedDate: '1 day ago', skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'], status: 'Accepted', email: 'rahul.s@college.edu', portfolio: 'https://github.com/rahulsharma' },
  { id: 2, name: 'Priya Patel', roll: '20CS102', college: 'IT Dept', department: 'Information Tech', cgpa: '9.2', role: 'Frontend React & UI/UX Intern', appliedDate: '2 days ago', skills: ['React', 'Tailwind', 'Figma', 'Framer'], status: 'Accepted', email: 'priya.p@college.edu', portfolio: 'https://priyapatel.design' },
  { id: 3, name: 'Amit Kumar', roll: '20CS105', college: 'CSE Dept', department: 'Computer Science', cgpa: '8.4', role: 'Backend Distributed Systems Intern', appliedDate: '3 days ago', skills: ['Node.js', 'Express', 'Redis', 'PostgreSQL'], status: 'Accepted', email: 'amit.k@college.edu', portfolio: 'https://github.com/amitk' },
  { id: 4, name: 'Sneha Gupta', roll: '20CS106', college: 'Design School', department: 'Product Design', cgpa: '8.9', role: 'UI/UX Design Systems Intern', appliedDate: '3 days ago', skills: ['Figma', 'User Research', 'Design Tokens'], status: 'Accepted', email: 'sneha.g@college.edu', portfolio: 'https://snehagupta.me' },
  { id: 5, name: 'Anjali Desai', roll: '20CS107', college: 'AI & Data', department: 'Artificial Intelligence', cgpa: '9.4', role: 'Machine Learning & LLM Intern', appliedDate: '4 days ago', skills: ['PyTorch', 'LangChain', 'Python', 'FastAPI'], status: 'Shortlisted', email: 'anjali.d@college.edu', portfolio: 'https://github.com/anjalidesai' },
  { id: 6, name: 'Rohan Mehta', roll: '20CS108', college: 'CSE Dept', department: 'Computer Science', cgpa: '8.2', role: 'Full Stack Web Developer', appliedDate: '4 days ago', skills: ['Next.js', 'Node.js', 'MongoDB', 'Docker'], status: 'Interviewing', email: 'rohan.m@college.edu', portfolio: 'https://rohanmehta.dev' },
  { id: 7, name: 'Divya Iyer', roll: '20CS109', college: 'Cloud Dept', department: 'Information Tech', cgpa: '8.8', role: 'DevOps & SRE Cloud Intern', appliedDate: '5 days ago', skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'], status: 'Shortlisted', email: 'divya.i@college.edu', portfolio: 'https://github.com/divyaiyer' },
  { id: 8, name: 'Karan Joshi', roll: '20CS110', college: 'ECE Dept', department: 'Electronics & Comm', cgpa: '8.1', role: 'IoT & Embedded Systems Intern', appliedDate: '5 days ago', skills: ['C++', 'ESP32', 'FreeRTOS', 'MQTT'], status: 'Interviewing', email: 'karan.j@college.edu', portfolio: 'https://github.com/karanjoshi' },
  { id: 9, name: 'Pooja Verma', roll: '20CS111', college: 'CSE Dept', department: 'Computer Science', cgpa: '8.6', role: 'Data Analytics & SQL Intern', appliedDate: '6 days ago', skills: ['SQL', 'Tableau', 'Python', 'PowerBI'], status: 'Shortlisted', email: 'pooja.v@college.edu', portfolio: 'https://poojaverma.io' },
  { id: 10, name: 'Aditya Rao', roll: '20CS112', college: 'AI Dept', department: 'Artificial Intelligence', cgpa: '9.0', role: 'NLP & Speech Processing Intern', appliedDate: '1 week ago', skills: ['HuggingFace', 'Transformers', 'Python'], status: 'Shortlisted', email: 'aditya.r@college.edu', portfolio: 'https://github.com/adityarao' },
  { id: 11, name: 'Manish Tiwari', roll: '20CS113', college: 'Cyber Sec', department: 'Computer Science', cgpa: '8.5', role: 'Cyber Security Operations Intern', appliedDate: '1 week ago', skills: ['Penetration Testing', 'Linux', 'Wireshark'], status: 'Interviewing', email: 'manish.t@college.edu', portfolio: 'https://manishtiwari.sec' },
  { id: 12, name: 'Swati Kulkarni', roll: '20CS114', college: 'IT Dept', department: 'Information Tech', cgpa: '8.7', role: 'React Native Mobile Developer', appliedDate: '1 week ago', skills: ['React Native', 'Redux', 'TypeScript'], status: 'Shortlisted', email: 'swati.k@college.edu', portfolio: 'https://github.com/swatik' },
  { id: 13, name: 'Deepak Nair', roll: '20CS115', college: 'CSE Dept', department: 'Computer Science', cgpa: '7.4', role: 'QA & Automation Engineer', appliedDate: '1 week ago', skills: ['Selenium', 'Cypress', 'Java'], status: 'Pending', email: 'deepak.n@college.edu', portfolio: 'https://github.com/deepaknair' },
  { id: 14, name: 'Ritu Agarwal', roll: '20CS116', college: 'AI Dept', department: 'Artificial Intelligence', cgpa: '9.5', role: 'Computer Vision Research Intern', appliedDate: '1 week ago', skills: ['OpenCV', 'YOLO', 'PyTorch'], status: 'Shortlisted', email: 'ritu.a@college.edu', portfolio: 'https://github.com/rituagarwal' },
  { id: 15, name: 'Gaurav Sen', roll: '20CS117', college: 'CSE Dept', department: 'Computer Science', cgpa: '8.3', role: 'Go Microservices Developer', appliedDate: '2 weeks ago', skills: ['Go', 'gRPC', 'Docker', 'PostgreSQL'], status: 'Interviewing', email: 'gaurav.s@college.edu', portfolio: 'https://gauravsen.dev' },
  { id: 16, name: 'Megha Kapoor', roll: '20CS118', college: 'CSE Dept', department: 'Computer Science', cgpa: '8.9', role: 'Enterprise Java Spring Boot Intern', appliedDate: '2 weeks ago', skills: ['Java', 'Spring Boot', 'Hibernate'], status: 'Shortlisted', email: 'megha.k@college.edu', portfolio: 'https://github.com/meghakapoor' },
  { id: 17, name: 'Tanmay Bhatt', roll: '20CS119', college: 'Data Dept', department: 'Data Science', cgpa: '9.1', role: 'Deep Learning & Neural Nets', appliedDate: '2 weeks ago', skills: ['TensorFlow', 'Keras', 'Python', 'CUDA'], status: 'Interviewing', email: 'tanmay.b@college.edu', portfolio: 'https://tanmaybhatt.ai' },
  { id: 18, name: 'Kavita Pillai', roll: '20CS120', college: 'Biotech Dept', department: 'Bioinformatics', cgpa: '8.8', role: 'Bioinformatics Computational Intern', appliedDate: '2 weeks ago', skills: ['Biopython', 'R', 'Genomic Pipelines'], status: 'Pending', email: 'kavita.p@college.edu', portfolio: 'https://github.com/kavitapillai' },
  { id: 19, name: 'Sanjay Mishra', roll: '20CS121', college: 'IT Dept', department: 'Information Tech', cgpa: '8.2', role: 'GraphQL & Node Backend Intern', appliedDate: '2 weeks ago', skills: ['GraphQL', 'Apollo', 'Node.js', 'MongoDB'], status: 'Pending', email: 'sanjay.m@college.edu', portfolio: 'https://sanjaymishra.tech' },
  { id: 20, name: 'Simran Kaur', roll: '20CS122', college: 'CSE Dept', department: 'Computer Science', cgpa: '9.3', role: 'Cloud Infrastructure & SRE', appliedDate: '2 weeks ago', skills: ['Kubernetes', 'Helm', 'GCP', 'Terraform'], status: 'Shortlisted', email: 'simran.k@college.edu', portfolio: 'https://github.com/simrankaur' },
  { id: 21, name: 'Nikhil Saxena', roll: '20CS123', college: 'CSE Dept', department: 'Computer Science', cgpa: '8.0', role: 'Smart Contract & Web3 Intern', appliedDate: '3 weeks ago', skills: ['Solidity', 'Web3.js', 'Hardhat'], status: 'Pending', email: 'nikhil.s@college.edu', portfolio: 'https://github.com/nikhilsaxena' },
  { id: 22, name: 'Pallavi Chawla', roll: '20CS124', college: 'Design School', department: 'Product Design', cgpa: '9.0', role: 'UI/UX Visual Interaction Designer', appliedDate: '3 weeks ago', skills: ['Figma', 'Prototyping', 'User Testing'], status: 'Interviewing', email: 'pallavi.c@college.edu', portfolio: 'https://pallavichawla.design' },
  { id: 23, name: 'Abhishek Roy', roll: '20CS125', college: 'CSE Dept', department: 'Computer Science', cgpa: '8.4', role: 'Database Optimization & SQL Intern', appliedDate: '3 weeks ago', skills: ['PostgreSQL', 'Index Tuning', 'MySQL'], status: 'Pending', email: 'abhishek.r@college.edu', portfolio: 'https://abhishekroy.io' },
  { id: 24, name: 'Ishita Ganguly', roll: '20CS126', college: 'Data Dept', department: 'Data Science', cgpa: '8.7', role: 'Data Pipeline & ETL Engineer', appliedDate: '3 weeks ago', skills: ['Apache Spark', 'Airflow', 'Python', 'SQL'], status: 'Shortlisted', email: 'ishita.g@college.edu', portfolio: 'https://github.com/ishitaganguly' },
  { id: 25, name: 'Varun Grover', roll: '20CS127', college: 'IT Dept', department: 'Information Tech', cgpa: '8.5', role: 'Linux System Administration Intern', appliedDate: '3 weeks ago', skills: ['Bash Scripting', 'Linux', 'Networking'], status: 'Pending', email: 'varun.g@college.edu', portfolio: 'https://varungrover.net' },
  { id: 26, name: 'Harshit Jain', roll: '20CS128', college: 'CSE Dept', department: 'Computer Science', cgpa: '9.0', role: 'Fintech Microservices Intern', appliedDate: '3 weeks ago', skills: ['Java', 'Kafka', 'Redis', 'Spring Boot'], status: 'Interviewing', email: 'harshit.j@college.edu', portfolio: 'https://github.com/harshitjain' },
  { id: 27, name: 'Bhavna Sethi', roll: '20CS129', college: 'CSE Dept', department: 'Computer Science', cgpa: '8.6', role: 'Healthcare Cloud Compliance Dev', appliedDate: '3 weeks ago', skills: ['FastAPI', 'PostgreSQL', 'Docker'], status: 'Pending', email: 'bhavna.s@college.edu', portfolio: 'https://bhavnasethi.com' },
  { id: 28, name: 'Yash Vardhan', roll: '20CS130', college: 'Cyber Sec', department: 'Computer Science', cgpa: '8.3', role: 'Network Security Penetration Tester', appliedDate: '4 weeks ago', skills: ['Nmap', 'Metasploit', 'Python Security'], status: 'Pending', email: 'yash.v@college.edu', portfolio: 'https://yashvardhan.sec' },
  { id: 29, name: 'Shreya Nambiar', roll: '20CS131', college: 'CSE Dept', department: 'Computer Science', cgpa: '9.4', role: 'Full Stack Performance Testing', appliedDate: '4 weeks ago', skills: ['k6', 'JMeter', 'Node.js', 'React'], status: 'Shortlisted', email: 'shreya.n@college.edu', portfolio: 'https://github.com/shreyanambiar' },
  { id: 30, name: 'Arnav Goswami', roll: '20CS132', college: 'IT Dept', department: 'Information Tech', cgpa: '8.9', role: 'Rust High Performance Computing', appliedDate: '4 weeks ago', skills: ['Rust', 'Concurrency', 'WebAssembly'], status: 'Interviewing', email: 'arnav.g@college.edu', portfolio: 'https://arnavgoswami.dev' },
  { id: 31, name: 'Komal Pandey', roll: '20CS133', college: 'CSE Dept', department: 'Computer Science', cgpa: '8.7', role: 'Payment Gateway Integration Dev', appliedDate: '4 weeks ago', skills: ['Stripe API', 'Razorpay', 'Node.js'], status: 'Pending', email: 'komal.p@college.edu', portfolio: 'https://komalpandey.tech' },
  { id: 32, name: 'Kartik Somani', roll: '20CS134', college: 'IT Dept', department: 'Information Tech', cgpa: '9.1', role: 'Ansible & Infrastructure Automator', appliedDate: '4 weeks ago', skills: ['Ansible', 'Terraform', 'AWS'], status: 'Shortlisted', email: 'kartik.s@college.edu', portfolio: 'https://github.com/kartiksomani' },
  { id: 33, name: 'Prerna Hegde', roll: '20CS135', college: 'AI Dept', department: 'Artificial Intelligence', cgpa: '8.8', role: 'Speech AI & Audio DSP Specialist', appliedDate: '4 weeks ago', skills: ['Whisper', 'PyTorch', 'Audio DSP'], status: 'Pending', email: 'prerna.h@college.edu', portfolio: 'https://prernahegde.ai' },
  { id: 34, name: 'Siddhesh Parab', roll: '20CS136', college: 'Data Dept', department: 'Data Science', cgpa: '8.5', role: 'Tableau Business Intelligence Intern', appliedDate: '1 month ago', skills: ['Tableau', 'SQL', 'Data Modelling'], status: 'Pending', email: 'siddhesh.p@college.edu', portfolio: 'https://siddheshparab.io' },
  { id: 35, name: 'Ananya Basu', roll: '20CS137', college: 'AI Dept', department: 'Artificial Intelligence', cgpa: '9.2', role: 'NLP Sentiment Analytics Researcher', appliedDate: '1 month ago', skills: ['BERT', 'RoBERTa', 'HuggingFace'], status: 'Interviewing', email: 'ananya.b@college.edu', portfolio: 'https://ananyabasu.dev' },
  { id: 36, name: 'Devendra Rathore', roll: '20CS138', college: 'CSE Dept', department: 'Computer Science', cgpa: '8.1', role: 'OpenAPI Documentation & Testing', appliedDate: '1 month ago', skills: ['Swagger', 'Postman', 'JavaScript'], status: 'Pending', email: 'devendra.r@college.edu', portfolio: 'https://github.com/devendrar' },
  { id: 37, name: 'Namrata Shinde', roll: '20CS139', college: 'CSE Dept', department: 'Computer Science', cgpa: '8.9', role: 'Web3 Frontend & Wagmi Engineer', appliedDate: '1 month ago', skills: ['Wagmi', 'Viem', 'Next.js', 'Tailwind'], status: 'Pending', email: 'namrata.s@college.edu', portfolio: 'https://namratashinde.eth' },
  { id: 38, name: 'Tushar Deshpande', roll: '20CS140', college: 'Biotech Dept', department: 'Bioinformatics', cgpa: '9.0', role: 'Computational Genomics Researcher', appliedDate: '1 month ago', skills: ['Biopython', 'R', 'Nextflow'], status: 'Shortlisted', email: 'tushar.d@college.edu', portfolio: 'https://github.com/tushardeshpande' },
  { id: 39, name: 'Lavanya Sundaram', roll: '20CS141', college: 'CSE Dept', department: 'Computer Science', cgpa: '9.5', role: 'SRE Observability & Prometheus', appliedDate: '1 month ago', skills: ['Grafana', 'Prometheus', 'Go', 'Kubernetes'], status: 'Interviewing', email: 'lavanya.s@college.edu', portfolio: 'https://lavanyas.cloud' },
  { id: 40, name: 'Naveen Reddy', roll: '20CS142', college: 'IT Dept', department: 'Information Tech', cgpa: '8.8', role: 'Payment Core Transaction Engine', appliedDate: '1 month ago', skills: ['Java', 'PostgreSQL', 'Distributed Locks'], status: 'Pending', email: 'naveen.r@college.edu', portfolio: 'https://github.com/naveenreddy' },
  { id: 41, name: 'Tarun Varma', roll: '20CS143', college: 'CSE Dept', department: 'Computer Science', cgpa: '7.8', role: 'Frontend React Intern', appliedDate: '1 month ago', skills: ['HTML', 'CSS', 'JavaScript'], status: 'Rejected', email: 'tarun.v@college.edu', portfolio: 'https://github.com/tarunv' },
  { id: 42, name: 'Garima Sharma', roll: '20CS144', college: 'IT Dept', department: 'Information Tech', cgpa: '7.6', role: 'Backend Developer', appliedDate: '1 month ago', skills: ['PHP', 'MySQL'], status: 'Rejected', email: 'garima.s@college.edu', portfolio: 'https://github.com/garimas' },
  { id: 43, name: 'Akash Solanki', roll: '20CS145', college: 'CSE Dept', department: 'Computer Science', cgpa: '7.2', role: 'Python Developer', appliedDate: '1 month ago', skills: ['Python Basics', 'Flask'], status: 'Rejected', email: 'akash.s@college.edu', portfolio: 'https://github.com/akashs' },
  { id: 44, name: 'Ritika Roy', roll: '20CS146', college: 'Design School', department: 'UI/UX Design', cgpa: '7.5', role: 'UI Designer', appliedDate: '1 month ago', skills: ['Photoshop', 'Illustrator'], status: 'Rejected', email: 'ritika.r@college.edu', portfolio: 'https://ritikaroy.art' },
  { id: 45, name: 'Pankaj Dubey', roll: '20CS147', college: 'IT Dept', department: 'Information Tech', cgpa: '7.1', role: 'QA Tester', appliedDate: '1 month ago', skills: ['Manual Testing'], status: 'Rejected', email: 'pankaj.d@college.edu', portfolio: 'https://github.com/pankajd' },
  { id: 46, name: 'Ankur Chauhan', roll: '20CS148', college: 'CSE Dept', department: 'Computer Science', cgpa: '7.3', role: 'Data Analyst Intern', appliedDate: '1 month ago', skills: ['Excel', 'PowerPoint'], status: 'Rejected', email: 'ankur.c@college.edu', portfolio: 'https://github.com/ankurc' },
  { id: 47, name: 'Siddhant Jain', roll: '20CS149', college: 'CSE Dept', department: 'Computer Science', cgpa: '8.5', role: 'Full Stack Engineering Intern', appliedDate: '1 month ago', skills: ['React', 'Node.js', 'MongoDB'], status: 'Pending', email: 'siddhant.j@college.edu', portfolio: 'https://siddhantjain.dev' },
  { id: 48, name: 'Radhika Nair', roll: '20CS150', college: 'AI Dept', department: 'Artificial Intelligence', cgpa: '9.1', role: 'Generative AI Prompt Engineer', appliedDate: '1 month ago', skills: ['GPT-4', 'Python', 'LangChain'], status: 'Shortlisted', email: 'radhika.n@college.edu', portfolio: 'https://github.com/radhikanair' },
  { id: 49, name: 'Chirag Seth', roll: '20CS151', college: 'ECE Dept', department: 'Electronics', cgpa: '8.4', role: 'Robotics Perception Developer', appliedDate: '1 month ago', skills: ['ROS', 'OpenCV', 'C++'], status: 'Interviewing', email: 'chirag.s@college.edu', portfolio: 'https://chiragseth.io' },
  { id: 50, name: 'Natasha Thomas', roll: '20CS152', college: 'CSE Dept', department: 'Computer Science', cgpa: '8.9', role: 'Distributed Caching Intern', appliedDate: '1 month ago', skills: ['Redis', 'Memcached', 'Go'], status: 'Pending', email: 'natasha.t@college.edu', portfolio: 'https://github.com/natashat' },
  { id: 51, name: 'Kalyan Chakravarthy', roll: '20CS153', college: 'IT Dept', department: 'Information Tech', cgpa: '8.7', role: 'Cloud Security Audit Intern', appliedDate: '1 month ago', skills: ['AWS IAM', 'Prowler', 'Python'], status: 'Pending', email: 'kalyan.c@college.edu', portfolio: 'https://kalyanc.sec' },
  { id: 52, name: 'Meenakshi Iyer', roll: '20CS154', college: 'CSE Dept', department: 'Computer Science', cgpa: '9.3', role: 'Full Stack Distributed Architecture', appliedDate: '1 month ago', skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'], status: 'Shortlisted', email: 'meenakshi.i@college.edu', portfolio: 'https://meenakshiiyer.dev' },
];

export default function CompanyApplicationsPage() {
  const [apps, setApps] = useState<CompanyCandidateApplication[]>(companyApplicationsList);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [inspectingCandidate, setInspectingCandidate] = useState<CompanyCandidateApplication | null>(null);

  const totalCount = apps.length; // 52
  const acceptedCount = apps.filter(a => a.status === 'Accepted').length;
  const shortlistedCount = apps.filter(a => a.status === 'Shortlisted').length;
  const interviewingCount = apps.filter(a => a.status === 'Interviewing').length;
  const pendingCount = apps.filter(a => a.status === 'Pending').length;
  const rejectedCount = apps.filter(a => a.status === 'Rejected').length;

  const handleAction = (id: number, newStatus: CompanyCandidateApplication['status']) => {
    setApps(apps.map(app => app.id === id ? { ...app, status: newStatus } : app));
    toast.success(`Application status updated to ${newStatus}`);
    if (inspectingCandidate && inspectingCandidate.id === id) {
      setInspectingCandidate({ ...inspectingCandidate, status: newStatus });
    }
  };

  const filteredApps = apps.filter(app => {
    const matchesTab = activeTab === 'All' || app.status === activeTab;
    const matchesSearch = 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.roll.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-full pb-16" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header 
        title="Candidate Application Pipeline (50+ Submissions)" 
        subtitle="Screen resumes, technical portfolios, CGPA rankings, and manage hiring stages" 
      />
      
      <main className="max-w-6xl mx-auto p-6 md:p-8 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          {[
            { label: 'All Candidates', value: totalCount, tab: 'All', color: 'text-slate-900 dark:text-slate-100' },
            { label: 'Accepted', value: acceptedCount, tab: 'Accepted', color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Shortlisted', value: shortlistedCount, tab: 'Shortlisted', color: 'text-indigo-600 dark:text-indigo-400' },
            { label: 'Interviewing', value: interviewingCount, tab: 'Interviewing', color: 'text-sky-600 dark:text-sky-400' },
            { label: 'Pending Review', value: pendingCount, tab: 'Pending', color: 'text-amber-600 dark:text-amber-400' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(item.tab)}
              className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                activeTab === item.tab ? 'ring-2 ring-[#4F46E5] shadow-sm' : 'hover:scale-[1.01]'
              }`}
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className={`text-2xl font-black font-mono ${item.color}`}>{item.value}</div>
              <div className="text-xs mt-0.5 font-semibold" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
            </button>
          ))}
        </div>

        {/* Search & Status Filter Bar */}
        <div 
          className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center p-4 rounded-2xl border shadow-sm"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 50+ candidates by name, roll, role, or skills..." 
              className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {['All', 'Accepted', 'Shortlisted', 'Interviewing', 'Pending', 'Rejected'].map((tab) => {
              const count = tab === 'All' ? totalCount : apps.filter(a => a.status === tab).length;
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#4F46E5] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span>{tab}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          <span>Displaying <strong>{filteredApps.length}</strong> candidate applications</span>
          <span>Batch Intake Q3 2026</span>
        </div>

        {/* 50+ Candidate Cards List */}
        <div className="space-y-3.5">
          {filteredApps.map((app) => {
            const isAccepted = app.status === 'Accepted';
            const isShortlisted = app.status === 'Shortlisted';
            const isInterviewing = app.status === 'Interviewing';
            const isPending = app.status === 'Pending';
            const isRejected = app.status === 'Rejected';

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border p-5 sm:p-6 space-y-4 shadow-sm transition-all hover:shadow-md"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-start gap-3.5">
                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm border shadow-xs flex-shrink-0"
                      style={{
                        backgroundColor: 'var(--accent-soft)',
                        color: 'var(--role-accent, var(--primary))',
                        borderColor: 'var(--border)'
                      }}
                    >
                      {app.name.split(' ').map(n => n[0]).join('')}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm sm:text-base" style={{ color: 'var(--text)' }}>
                          {app.name}
                        </h3>
                        <span className="text-xs font-mono text-slate-400 font-semibold">({app.roll})</span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950 text-[#4F46E5] dark:text-indigo-300 border border-indigo-200">
                          CGPA: {app.cgpa}
                        </span>
                      </div>
                      <p className="text-xs font-semibold" style={{ color: 'var(--role-accent, var(--cta))' }}>
                        {app.role} · <span className="font-normal opacity-80" style={{ color: 'var(--text-muted)' }}>{app.college}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono opacity-60" style={{ color: 'var(--text-muted)' }}>{app.appliedDate}</span>
                    
                    {/* High-Contrast Status Badges */}
                    {isAccepted && (
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Accepted & Enrolled
                      </span>
                    )}
                    {isShortlisted && (
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 flex items-center gap-1">
                        <Sparkles size={12} /> Shortlisted
                      </span>
                    )}
                    {isInterviewing && (
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 flex items-center gap-1">
                        <Calendar size={12} /> Interview Scheduled
                      </span>
                    )}
                    {isPending && (
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 flex items-center gap-1">
                        <Clock size={12} /> Pending Review
                      </span>
                    )}
                    {isRejected && (
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 flex items-center gap-1">
                        <X size={12} /> Declined
                      </span>
                    )}
                  </div>
                </div>

                {/* Skills & Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap gap-1.5">
                    {app.skills.map(s => (
                      <span 
                        key={s} 
                        className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] border"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        setInspectingCandidate(app);
                        toast.info(`Inspecting dossier for ${app.name}`);
                      }}
                      className="px-3.5 py-1.5 rounded-xl border text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1"
                      style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                    >
                      <span>Review Dossier</span>
                      <ChevronRight size={13} />
                    </button>

                    {isPending && (
                      <>
                        <button
                          onClick={() => handleAction(app.id, 'Rejected')}
                          className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950 cursor-pointer"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleAction(app.id, 'Shortlisted')}
                          className="px-4 py-1.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-xs cursor-pointer"
                        >
                          Shortlist
                        </button>
                      </>
                    )}

                    {isShortlisted && (
                      <button
                        onClick={() => handleAction(app.id, 'Interviewing')}
                        className="px-4 py-1.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <Calendar size={13} />
                        <span>Schedule Interview</span>
                      </button>
                    )}

                    {isInterviewing && (
                      <button
                        onClick={() => handleAction(app.id, 'Accepted')}
                        className="px-4 py-1.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <Check size={13} />
                        <span>Issue Offer Letter</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Candidate Dossier Modal */}
        {inspectingCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div 
              className="rounded-2xl border shadow-2xl p-6 max-w-lg w-full space-y-4 animate-in fade-in zoom-in-95"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#4F46E5]" />
                  <h3 className="font-bold text-sm">Candidate Full Evaluation Dossier</h3>
                </div>
                <button onClick={() => setInspectingCandidate(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-900 space-y-1.5" style={{ borderColor: 'var(--border)' }}>
                  <p><strong>Candidate:</strong> {inspectingCandidate.name} ({inspectingCandidate.roll})</p>
                  <p><strong>Department:</strong> {inspectingCandidate.department}</p>
                  <p><strong>College Email:</strong> {inspectingCandidate.email}</p>
                  <p><strong>CGPA:</strong> {inspectingCandidate.cgpa} / 10.0</p>
                  <p><strong>Target Position:</strong> {inspectingCandidate.role}</p>
                  <p><strong>Portfolio / GitHub:</strong> {inspectingCandidate.portfolio}</p>
                  <p><strong>Current Status:</strong> {inspectingCandidate.status.toUpperCase()}</p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="font-bold block">Verified Technical Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {inspectingCandidate.skills.map(s => (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-[#4F46E5] border border-indigo-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <button
                  onClick={() => handleAction(inspectingCandidate.id, 'Shortlisted')}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Shortlist Candidate
                </button>
                <button
                  onClick={() => handleAction(inspectingCandidate.id, 'Accepted')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Issue Acceptance
                </button>
                <button
                  onClick={() => setInspectingCandidate(null)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer"
                  style={{ borderColor: 'var(--border)' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
