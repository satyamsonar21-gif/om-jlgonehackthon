import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { 
  Plus, 
  User, 
  Send, 
  ChevronRight, 
  CheckCircle2, 
  Building2, 
  Search, 
  Filter, 
  Award,
  Clock,
  Star,
  Check,
  X,
  SlidersHorizontal,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';

export interface ActiveCompanyIntern {
  id: number;
  name: string;
  roll: string;
  role: string;
  attendance: number;
  tasksCompleted: number;
  totalTasks: number;
  lastLog: string;
  reportsApproved: number;
  totalReports: number;
  mentorRating: number;
  projectTeam: string;
  email: string;
}

export const activeCompanyInternsData: ActiveCompanyIntern[] = [
  { id: 1, name: 'Rahul Sharma', roll: '20CS101', role: 'Full Stack Engineering Intern', attendance: 92, tasksCompleted: 8, totalTasks: 10, lastLog: 'Today, 04:30 PM', reportsApproved: 4, totalReports: 4, mentorRating: 4.9, projectTeam: 'Core Infrastructure', email: 'rahul.s@college.edu' },
  { id: 2, name: 'Priya Patel', roll: '20CS102', role: 'Frontend React UI Intern', attendance: 88, tasksCompleted: 7, totalTasks: 9, lastLog: 'Today, 02:15 PM', reportsApproved: 4, totalReports: 4, mentorRating: 4.8, projectTeam: 'Design Systems', email: 'priya.p@college.edu' },
  { id: 3, name: 'Amit Kumar', roll: '20CS105', role: 'Backend Distributed API Dev', attendance: 95, tasksCompleted: 10, totalTasks: 10, lastLog: 'Today, 05:00 PM', reportsApproved: 3, totalReports: 3, mentorRating: 5.0, projectTeam: 'Platform Engine', email: 'amit.k@college.edu' },
  { id: 4, name: 'Sneha Gupta', roll: '20CS106', role: 'UI/UX Design Systems Intern', attendance: 89, tasksCompleted: 6, totalTasks: 8, lastLog: 'Today, 01:45 PM', reportsApproved: 4, totalReports: 4, mentorRating: 4.7, projectTeam: 'Product Design', email: 'sneha.g@college.edu' },
  { id: 5, name: 'Vikram Singh', roll: '20CS103', role: 'DevOps & SRE Cloud Intern', attendance: 75, tasksCompleted: 5, totalTasks: 9, lastLog: 'Yesterday, 06:10 PM', reportsApproved: 2, totalReports: 4, mentorRating: 4.1, projectTeam: 'Cloud Operations', email: 'vikram.s@college.edu' },
  { id: 6, name: 'Anjali Desai', roll: '20CS107', role: 'Machine Learning & LLM Specialist', attendance: 94, tasksCompleted: 9, totalTasks: 10, lastLog: 'Today, 03:20 PM', reportsApproved: 4, totalReports: 4, mentorRating: 4.9, projectTeam: 'AI Research', email: 'anjali.d@college.edu' },
  { id: 7, name: 'Rohan Mehta', roll: '20CS108', role: 'QA & Test Automation Engineer', attendance: 82, tasksCompleted: 6, totalTasks: 8, lastLog: 'Yesterday, 04:00 PM', reportsApproved: 3, totalReports: 4, mentorRating: 4.4, projectTeam: 'Quality Assurance', email: 'rohan.m@college.edu' },
  { id: 8, name: 'Divya Iyer', roll: '20CS109', role: 'Cloud Security & IAM Intern', attendance: 87, tasksCompleted: 7, totalTasks: 8, lastLog: 'Today, 11:30 AM', reportsApproved: 4, totalReports: 4, mentorRating: 4.6, projectTeam: 'Cyber Defense', email: 'divya.i@college.edu' },
  { id: 9, name: 'Karan Joshi', roll: '20CS110', role: 'Embedded Systems & RTOS Intern', attendance: 76, tasksCompleted: 5, totalTasks: 7, lastLog: '2 days ago', reportsApproved: 3, totalReports: 4, mentorRating: 4.2, projectTeam: 'IoT Hardware', email: 'karan.j@college.edu' },
  { id: 10, name: 'Pooja Verma', roll: '20CS111', role: 'Data Analytics & Reporting Intern', attendance: 91, tasksCompleted: 8, totalTasks: 9, lastLog: 'Today, 04:10 PM', reportsApproved: 4, totalReports: 4, mentorRating: 4.8, projectTeam: 'Business Intelligence', email: 'pooja.v@college.edu' },
  { id: 11, name: 'Aditya Rao', roll: '20CS112', role: 'NLP & Audio AI Intern', attendance: 80, tasksCompleted: 6, totalTasks: 8, lastLog: 'Yesterday, 05:45 PM', reportsApproved: 3, totalReports: 4, mentorRating: 4.5, projectTeam: 'Speech Lab', email: 'aditya.r@college.edu' },
  { id: 12, name: 'Swati Kulkarni', roll: '20CS114', role: 'Mobile Flutter & iOS Dev', attendance: 86, tasksCompleted: 7, totalTasks: 8, lastLog: 'Today, 10:50 AM', reportsApproved: 4, totalReports: 4, mentorRating: 4.7, projectTeam: 'Mobile Products', email: 'swati.k@college.edu' },
  { id: 13, name: 'Tanmay Bhatt', roll: '20CS119', role: 'Deep Learning Model Tuning', attendance: 92, tasksCompleted: 8, totalTasks: 9, lastLog: 'Today, 03:00 PM', reportsApproved: 4, totalReports: 4, mentorRating: 4.9, projectTeam: 'AI Platform', email: 'tanmay.b@college.edu' },
  { id: 14, name: 'Abhishek Roy', roll: '20CS125', role: 'PostgreSQL Index Architecture', attendance: 93, tasksCompleted: 9, totalTasks: 10, lastLog: 'Today, 02:30 PM', reportsApproved: 4, totalReports: 4, mentorRating: 4.8, projectTeam: 'Database Services', email: 'abhishek.r@college.edu' },
  { id: 15, name: 'Shreya Nambiar', roll: '20CS131', role: 'Site Reliability Engineering Intern', attendance: 95, tasksCompleted: 9, totalTasks: 9, lastLog: 'Today, 05:15 PM', reportsApproved: 4, totalReports: 4, mentorRating: 5.0, projectTeam: 'Core Infrastructure', email: 'shreya.n@college.edu' },
  { id: 16, name: 'Lavanya Sundaram', roll: '20CS141', role: 'Observability & Metrics Engineer', attendance: 96, reportsApproved: 4, totalReports: 4, tasksCompleted: 10, totalTasks: 10, lastLog: 'Today, 04:45 PM', mentorRating: 5.0, projectTeam: 'Core Infrastructure', email: 'lavanya.s@college.edu' },
];

export default function CompanyInternsPage() {
  const [interns, setInterns] = useState<ActiveCompanyIntern[]>(activeCompanyInternsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [evaluatingIntern, setEvaluatingIntern] = useState<ActiveCompanyIntern | null>(null);
  const [ratingValue, setRatingValue] = useState('5.0');
  const [feedbackNote, setFeedbackNote] = useState('');

  const teams = ['All', 'Core Infrastructure', 'Platform Engine', 'Design Systems', 'AI Research', 'Quality Assurance', 'Cloud Operations'];

  const filteredInterns = interns.filter(intern => {
    const matchesSearch = 
      intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.roll.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.projectTeam.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTeam = selectedTeam === 'All' || intern.projectTeam === selectedTeam;
    return matchesSearch && matchesTeam;
  });

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatingIntern) return;
    toast.success(`Evaluation recorded for ${evaluatingIntern.name} (Rating: ${ratingValue}/5)`);
    setEvaluatingIntern(null);
    setFeedbackNote('');
  };

  return (
    <div className="min-h-full pb-16" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header 
        title="Active Supervised Interns (16 Deployed)" 
        subtitle="Live sprint velocity, attendance compliance, and mentor evaluation ratings" 
      />
      
      <main className="max-w-6xl mx-auto p-6 md:p-8 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl border shadow-sm" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Deployed Interns</span>
            <div className="text-2xl font-black font-mono mt-1" style={{ color: 'var(--text)' }}>{interns.length}</div>
            <span className="text-[11px] font-mono text-indigo-600">Across 7 Project Teams</span>
          </div>

          <div className="p-4 rounded-2xl border shadow-sm" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Average Attendance</span>
            <div className="text-2xl font-black font-mono mt-1 text-emerald-600">89.4%</div>
            <span className="text-[11px] font-mono text-emerald-700">Biometric Clocked</span>
          </div>

          <div className="p-4 rounded-2xl border shadow-sm" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Sprint Task Velocity</span>
            <div className="text-2xl font-black font-mono mt-1" style={{ color: 'var(--text)' }}>84%</div>
            <span className="text-[11px] font-mono text-slate-500">124 Deliverables Done</span>
          </div>

          <div className="p-4 rounded-2xl border shadow-sm" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Average Mentor Rating</span>
            <div className="text-2xl font-black font-mono mt-1 text-amber-500">4.8 / 5.0</div>
            <span className="text-[11px] font-mono text-amber-600">98% Satisfaction</span>
          </div>
        </div>

        {/* Search & Team Filter Bar */}
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
              placeholder="Search 16 active interns by name, roll, role, team..." 
              className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {teams.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTeam(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedTeam === t
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Deployed Interns Table */}
        <div 
          className="rounded-2xl border shadow-sm overflow-hidden p-6 space-y-4"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Active Deployed Roster ({filteredInterns.length})</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>TechCorp Solutions Fall 2026 Cohort</p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-[#4F46E5]">
              Sprint 4 Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b text-slate-400 font-mono uppercase text-[10px]" style={{ borderColor: 'var(--border)' }}>
                  <th className="pb-3 font-semibold">Intern Candidate</th>
                  <th className="pb-3 font-semibold">Assigned Track & Team</th>
                  <th className="pb-3 font-semibold">Attendance</th>
                  <th className="pb-3 font-semibold">Sprint Velocity</th>
                  <th className="pb-3 font-semibold">Rating</th>
                  <th className="pb-3 font-semibold text-right">Evaluation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredInterns.map((intern) => {
                  const taskPercent = Math.round((intern.tasksCompleted / intern.totalTasks) * 100);

                  return (
                    <tr key={intern.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border shadow-xs"
                            style={{
                              backgroundColor: 'var(--accent-soft)',
                              color: 'var(--role-accent, var(--primary))',
                              borderColor: 'var(--border)'
                            }}
                          >
                            {intern.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold" style={{ color: 'var(--text)' }}>{intern.name}</div>
                            <div className="text-[11px] font-mono opacity-60" style={{ color: 'var(--text-muted)' }}>{intern.roll}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4">
                        <div className="font-medium" style={{ color: 'var(--text)' }}>{intern.role}</div>
                        <div className="text-[11px] font-mono text-[#4F46E5]">{intern.projectTeam}</div>
                      </td>

                      <td className="py-4">
                        <span className={`font-mono font-bold ${
                          intern.attendance < 80 ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {intern.attendance}%
                        </span>
                        <span className="text-[10px] font-mono block opacity-60">{intern.lastLog}</span>
                      </td>

                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-[#4F46E5]" 
                              style={{ width: `${taskPercent}%` }} 
                            />
                          </div>
                          <span className="font-mono text-[11px] font-semibold">{intern.tasksCompleted}/{intern.totalTasks}</span>
                        </div>
                        <span className="text-[10px] font-mono opacity-60 block mt-0.5">{intern.reportsApproved} Reports Approved</span>
                      </td>

                      <td className="py-4">
                        <div className="flex items-center gap-1 font-mono font-bold text-amber-500">
                          <Star size={13} className="fill-amber-400" />
                          <span>{intern.mentorRating}</span>
                        </div>
                      </td>

                      <td className="py-4 text-right">
                        <button 
                          onClick={() => {
                            setEvaluatingIntern(intern);
                            setRatingValue(String(intern.mentorRating));
                            toast.info(`Evaluating ${intern.name}`);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold inline-flex items-center gap-1 transition-all shadow-xs cursor-pointer hover:scale-105"
                        >
                          <span>Evaluate</span>
                          <ChevronRight size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Evaluation Modal */}
        {evaluatingIntern && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div 
              className="rounded-2xl border shadow-2xl p-6 max-w-lg w-full space-y-4 animate-in fade-in zoom-in-95"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                  <h3 className="font-bold text-sm">Industry Mentor Performance Review</h3>
                </div>
                <button onClick={() => setEvaluatingIntern(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveEvaluation} className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-900 space-y-1 font-mono" style={{ borderColor: 'var(--border)' }}>
                  <p><strong>Intern:</strong> {evaluatingIntern.name} ({evaluatingIntern.roll})</p>
                  <p><strong>Role:</strong> {evaluatingIntern.role}</p>
                  <p><strong>Team:</strong> {evaluatingIntern.projectTeam}</p>
                  <p><strong>Attendance:</strong> {evaluatingIntern.attendance}%</p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold font-mono uppercase text-slate-500 block">Performance Rating (1 to 5 Stars)</label>
                  <select
                    value={ratingValue}
                    onChange={(e) => setRatingValue(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 font-mono text-xs focus:outline-none"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                  >
                    <option value="5.0">5.0 - Exceptional Velocity & Code Quality</option>
                    <option value="4.8">4.8 - Exceeds Expectations</option>
                    <option value="4.5">4.5 - Strong Contributor</option>
                    <option value="4.0">4.0 - Meets Sprint Milestones</option>
                    <option value="3.5">3.5 - Needs Technical Mentorship</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold font-mono uppercase text-slate-500 block">Mentor Feedback & Rubric Notes</label>
                  <textarea
                    rows={3}
                    value={feedbackNote}
                    onChange={(e) => setFeedbackNote(e.target.value)}
                    placeholder="Enter observations on code reviews, pull requests, sprint retro, and technical delivery..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 focus:outline-none"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <button
                    type="button"
                    onClick={() => setEvaluatingIntern(null)}
                    className="px-4 py-2 rounded-xl border text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#4F46E5] text-white text-xs font-bold font-mono tracking-wider uppercase flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Check size={13} />
                    <span>Submit Mentor Evaluation</span>
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
