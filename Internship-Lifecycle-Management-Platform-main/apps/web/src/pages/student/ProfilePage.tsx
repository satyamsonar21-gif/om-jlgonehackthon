import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { GraduationCap, Upload, Save, CheckCircle2, User, Mail, Phone, MapPin, Building2, Check } from 'lucide-react';

const initialSkills = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS', 'Git', 'REST APIs'];

export default function ProfilePage() {
  const [skills, setSkills] = useState(initialSkills);
  const [newSkill, setNewSkill] = useState('');
  const [saved, setSaved] = useState(false);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-full pb-16 text-slate-900">
      <Header title="Student Profile & Dossier" subtitle="Manage your academic records, resume link, and skill tags" />
      
      <main className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        {/* Profile Card Header */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5"
        >
          <div className="w-20 h-20 rounded-2xl bg-teal-50 border border-teal-200 text-[#0D9488] flex items-center justify-center text-2xl font-black shadow-xs">
            PS
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <h2 className="text-xl font-bold text-slate-900">Priya Sharma</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-50 text-[#0D9488] border border-teal-200">
                20CS101
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">B.Tech Computer Science & Engineering · 3rd Year (Term 6)</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 font-mono pt-1">
              <span>CGPA: 8.7 / 10.0</span>
              <span>•</span>
              <span>Host: TechCorp Solutions</span>
              <span>•</span>
              <span>Faculty Guide: Dr. Rajesh Kumar</span>
            </div>
          </div>
        </motion.div>

        {/* Edit Details Form */}
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Personal & Academic Contact Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">Official College Email</label>
              <input 
                type="email" 
                defaultValue="priya.sharma@college.edu" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none input-focus-ring" 
                style={{ '--primary': '#0D9488' } as React.CSSProperties}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">Contact Mobile</label>
              <input 
                type="text" 
                defaultValue="+91 98765 43210" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none input-focus-ring" 
                style={{ '--primary': '#0D9488' } as React.CSSProperties}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">GitHub Profile URL</label>
              <input 
                type="text" 
                defaultValue="https://github.com/priyasharma" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none input-focus-ring" 
                style={{ '--primary': '#0D9488' } as React.CSSProperties}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">LinkedIn Profile URL</label>
              <input 
                type="text" 
                defaultValue="https://linkedin.com/in/priyasharma" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none input-focus-ring" 
                style={{ '--primary': '#0D9488' } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Technical Skills Tags */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block">
              Verified Technical Skill Tags
            </label>
            
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <span 
                  key={s} 
                  className="px-3 py-1 rounded-xl text-xs font-mono font-semibold bg-teal-50 text-[#0D9488] border border-teal-200 flex items-center gap-1.5"
                >
                  <span>{s}</span>
                  <button 
                    type="button" 
                    onClick={() => removeSkill(s)} 
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
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add new skill (e.g. Docker)..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none input-focus-ring"
                style={{ '--primary': '#0D9488' } as React.CSSProperties}
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              {saved ? (
                <>
                  <Check size={14} />
                  <span>Profile Saved</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
