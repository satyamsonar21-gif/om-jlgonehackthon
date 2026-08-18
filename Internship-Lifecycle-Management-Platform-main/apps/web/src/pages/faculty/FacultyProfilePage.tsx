import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { BookOpen, User, Mail, Phone, Building2, Save, Check, Award, GraduationCap, Calendar, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function FacultyProfilePage() {
  const [saved, setSaved] = useState(false);
  const [researchAreas, setResearchAreas] = useState([
    'Distributed Systems & Cloud Computing',
    'Applied Artificial Intelligence in Healthcare',
    'Database Optimization & Indexing Algorithms',
    'Software Architecture & Agile Methodologies'
  ]);
  const [newArea, setNewArea] = useState('');

  const handleAddArea = () => {
    if (newArea.trim() && !researchAreas.includes(newArea.trim())) {
      setResearchAreas([...researchAreas, newArea.trim()]);
      setNewArea('');
      toast.success('Research area added');
    }
  };

  const handleRemoveArea = (area: string) => {
    setResearchAreas(researchAreas.filter(a => a !== area));
    toast.info('Research area removed');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    toast.success('Faculty profile details updated successfully');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-full pb-16" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header 
        title="Faculty Advisor Profile & Dossier" 
        subtitle="Manage academic credentials, supervised cohorts, and office consultation hours" 
      />

      <main className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
        {/* Profile Card Header */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border shadow-sm p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="w-20 h-20 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-[#059669] flex items-center justify-center text-2xl font-black shadow-xs flex-shrink-0 border border-emerald-300 dark:border-emerald-800">
            RK
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Dr. Rajesh Kumar, Ph.D.</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                FAC-CSE-408
              </span>
            </div>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              Senior Professor & Industry Internship Coordinator · Dept. of Computer Science & Engineering
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-mono pt-2" style={{ color: 'var(--text-muted)' }}>
              <span>42 Assigned Interns</span>
              <span>•</span>
              <span>12 Industry Partners</span>
              <span>•</span>
              <span>Experience: 14 Years</span>
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="rounded-2xl border shadow-sm p-6 space-y-6" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="border-b pb-3 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Faculty Academic & Institutional Information</h3>
            <span className="text-xs font-mono font-semibold" style={{ color: 'var(--highlights)' }}>Term Q3 2026</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                Official University Email
              </label>
              <input 
                type="email" 
                defaultValue="rajesh.kumar@university.edu" 
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-xs focus:outline-none" 
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                Department Office & Extension
              </label>
              <input 
                type="text" 
                defaultValue="Academic Block 3, Room 412 (Ext: 8412)" 
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-xs focus:outline-none" 
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                Office Consultation Hours
              </label>
              <input 
                type="text" 
                defaultValue="Mon, Wed, Fri (03:00 PM – 05:00 PM)" 
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-xs focus:outline-none" 
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                Contact Phone / WhatsApp
              </label>
              <input 
                type="text" 
                defaultValue="+91 98234 56780" 
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-xs focus:outline-none" 
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>
          </div>

          {/* Research & Specialization Tags */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
              Faculty Specialization & Research Focus Areas
            </label>
            
            <div className="flex flex-wrap gap-2">
              {researchAreas.map(area => (
                <span 
                  key={area} 
                  className="px-3 py-1 rounded-xl text-xs font-mono font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5"
                >
                  <span>{area}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveArea(area)} 
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
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                placeholder="Add specialization (e.g. Cyber Security)..."
                className="flex-1 bg-slate-50 dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs focus:outline-none"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              />
              <button
                type="button"
                onClick={handleAddArea}
                className="px-4 py-2 rounded-xl bg-[#059669] text-white text-xs font-semibold hover:bg-[#047857] transition-colors cursor-pointer"
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
                  <span>Save Faculty Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
