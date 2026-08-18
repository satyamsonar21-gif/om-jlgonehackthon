import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Building2, Globe, MapPin, Mail, Phone, Save, Check, Users, Briefcase, Star, Award } from 'lucide-react';
import { toast } from 'sonner';

export default function CompanyProfilePage() {
  const [saved, setSaved] = useState(false);
  const [techStack, setTechStack] = useState([
    'React', 'Node.js', 'TypeScript', 'Go', 'PostgreSQL', 'AWS Cloud', 'Docker', 'Kubernetes'
  ]);
  const [newTech, setNewTech] = useState('');

  const handleAddTech = () => {
    if (newTech.trim() && !techStack.includes(newTech.trim())) {
      setTechStack([...techStack, newTech.trim()]);
      setNewTech('');
      toast.success('Technology added to company stack');
    }
  };

  const handleRemoveTech = (item: string) => {
    setTechStack(techStack.filter(t => t !== item));
    toast.info('Technology removed');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    toast.success('Company profile & recruitment parameters saved');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-full pb-16" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header 
        title="Partner Organization Profile" 
        subtitle="TechCorp Solutions · Industry Partner Workspace & Mentor Settings" 
      />

      <main className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
        {/* Profile Card Header */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border shadow-sm p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="w-20 h-20 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-[#4F46E5] flex items-center justify-center text-2xl font-black shadow-xs flex-shrink-0 border border-indigo-300 dark:border-indigo-800">
            TC
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>TechCorp Solutions Inc.</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100 dark:bg-indigo-950 text-[#4F46E5] dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                MoU Tier-1 Partner
              </span>
            </div>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              Enterprise Cloud Infrastructure & Software Engineering Solutions
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-mono pt-2" style={{ color: 'var(--text-muted)' }}>
              <span>Headquarters: Bangalore, India</span>
              <span>•</span>
              <span>16 Active Supervised Interns</span>
              <span>•</span>
              <span>Lead Mentor: Siddharth Nambiar</span>
            </div>
          </div>
        </motion.div>

        {/* Company Settings Form */}
        <form onSubmit={handleSave} className="rounded-2xl border shadow-sm p-6 space-y-6" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="border-b pb-3 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Company Organization & Contact Directory</h3>
            <span className="text-xs font-mono font-semibold" style={{ color: 'var(--highlights)' }}>Partner ID: #TC-2026</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                Industry Sector
              </label>
              <input 
                type="text" 
                defaultValue="Information Technology & Cloud Services" 
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-xs focus:outline-none" 
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                Company Website
              </label>
              <input 
                type="url" 
                defaultValue="https://techcorp-solutions.io" 
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-xs focus:outline-none" 
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                Mentor / Coordinator Email
              </label>
              <input 
                type="email" 
                defaultValue="internships@techcorp-solutions.io" 
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-xs focus:outline-none" 
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                Recruitment Office Phone
              </label>
              <input 
                type="text" 
                defaultValue="+91 80 4123 9900" 
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-xs focus:outline-none" 
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>
          </div>

          {/* Primary Engineering Stack */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
              Primary Technology Stack & Candidate Evaluation Criteria
            </label>
            
            <div className="flex flex-wrap gap-2">
              {techStack.map(item => (
                <span 
                  key={item} 
                  className="px-3 py-1 rounded-xl text-xs font-mono font-semibold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-800 flex items-center gap-1.5"
                >
                  <span>{item}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTech(item)} 
                    className="hover:text-rose-600 font-bold ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 max-w-sm pt-1">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="Add skill requirement (e.g. GraphQL)..."
                className="flex-1 bg-slate-50 dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs focus:outline-none"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-4 py-2 rounded-xl bg-[#4F46E5] text-white text-xs font-semibold hover:bg-[#4338CA] transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end" style={{ borderColor: 'var(--border)' }}>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold font-mono tracking-wider uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer text-white"
              style={{ backgroundColor: 'var(--cta)' }}
            >
              {saved ? (
                <>
                  <Check size={14} />
                  <span>Profile Saved</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save Organization Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
