import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Search, MapPin, Clock, IndianRupee, Bookmark, Building2, Filter, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';

const internships = [
  { id: 1, company: 'TechCorp Solutions', initials: 'TC', domain: 'Software Engineering', location: 'Hybrid, Bangalore', duration: '12 weeks', stipend: '₹15,000/mo', skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'], verified: true },
  { id: 2, analytics: true, company: 'Analytics Pro Labs', initials: 'AP', domain: 'Data Science & AI', location: 'Remote', duration: '8 weeks', stipend: '₹18,000/mo', skills: ['Python', 'Pandas', 'TensorFlow', 'SQL'], verified: true },
  { id: 3, company: 'Creative Studio Inc', initials: 'CS', domain: 'UI/UX & Product Design', location: 'On-site, Mumbai', duration: '10 weeks', stipend: '₹12,000/mo', skills: ['Figma', 'Design Systems', 'User Research'], verified: true },
  { id: 4, company: 'StartupXYZ', initials: 'SX', domain: 'Full Stack Engineering', location: 'Remote', duration: '8 weeks', stipend: '₹14,000/mo', skills: ['Next.js', 'TailwindCSS', 'REST APIs'], verified: true },
  { id: 5, company: 'FinanceHub Global', initials: 'FH', domain: 'Financial Analytics', location: 'Hybrid, Delhi', duration: '12 weeks', stipend: '₹16,000/mo', skills: ['Excel Modelling', 'PowerBI', 'Tableau'], verified: true },
  { id: 6, company: 'CloudBase Systems', initials: 'CB', domain: 'DevOps & Cloud', location: 'Remote', duration: '8 weeks', stipend: '₹20,000/mo', skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'], verified: true },
];

export default function BrowseInternshipsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');

  const filtered = internships.filter(job => {
    const matchesSearch = job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDomain = selectedDomain === 'All' || job.domain.includes(selectedDomain);
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="Discover Internships" subtitle="Explore verified university-approved partner roles" />
      
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by company, role, skills (e.g., React, Python, UI/UX)..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none input-focus-ring"
              style={{ '--primary': '#0D9488' } as React.CSSProperties}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase mr-1">Filter:</span>
            {['All', 'Software', 'Data', 'Design', 'Cloud'].map(domain => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedDomain === domain
                    ? 'bg-[#0D9488] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-500">
          <span>{filtered.length} verified listings available</span>
          <span>Fall 2026 Batch</span>
        </div>

        {/* Internships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((job) => (
            <motion.div 
              key={job.id} 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }}
              className="interactive-card p-6 flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-teal-50 text-[#0D9488] border border-teal-200 font-bold text-sm flex items-center justify-center">
                      {job.initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{job.company}</h3>
                      <span className="text-[11px] font-mono text-[#0D9488] font-semibold">{job.domain}</span>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                    <Bookmark size={16} />
                  </button>
                </div>

                <div className="space-y-1.5 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2"><MapPin size={13} className="text-slate-400" /> {job.location}</div>
                  <div className="flex items-center gap-2"><Clock size={13} className="text-slate-400" /> {job.duration}</div>
                  <div className="flex items-center gap-2 font-mono font-semibold text-slate-900"><IndianRupee size={13} className="text-slate-400" /> {job.stipend}</div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {job.skills.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <Link 
                  to={`/student/internships/${job.id}`} 
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold text-center transition-colors"
                >
                  View Details
                </Link>
                <Link 
                  to="/student/applications" 
                  className="py-2 px-4 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  Quick Apply
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
