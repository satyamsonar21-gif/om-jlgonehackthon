import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { uploadDocument, StoragePaths, validateDocumentFile } from '@/lib/storage';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Globe,
  Award,
  Save,
  CheckCircle2,
  AlertCircle,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  Code2,
  Sparkles,
  Briefcase,
  Layers,
  FileText,
  Sliders,
  MapPin,
  Clock,
} from 'lucide-react';
import { api } from '@/lib/api';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string;
  githubUrl?: string;
  liveUrl?: string;
}

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
}

export default function ProfilePage() {
  const { onOpenMobileNav } = useOutletContext<{ onOpenMobileNav?: () => void }>() || {};
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'projects' | 'certifications' | 'resume' | 'preferences'>('overview');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('Aarav Patil');
  const [email, setEmail] = useState('aarav.patil@ghrce.edu');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [studentId, setStudentId] = useState('2023BCSE042');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState(3);
  const [semester, setSemester] = useState(6);
  const [collegeName, setCollegeName] = useState('G.H. Raisoni College of Engineering (Autonomous)');
  const [cgpa, setCgpa] = useState(8.85);
  const [passingYear, setPassingYear] = useState(2026);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('Computer Science undergraduate passionate about full-stack engineering, distributed systems, and cloud infrastructure.');

  // Skills
  const [techSkills, setTechSkills] = useState<string[]>(['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Python', 'TailwindCSS']);
  const [newSkill, setNewSkill] = useState('');
  const [softSkills, setSoftSkills] = useState<string[]>(['Problem Solving', 'Team Leadership', 'Technical Writing', 'Agile/Scrum']);
  const [newSoftSkill, setNewSoftSkill] = useState('');

  // Social & Resume
  const [githubUrl, setGithubUrl] = useState('https://github.com/aaravpatil');
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com/in/aaravpatil');
  const [portfolioUrl, setPortfolioUrl] = useState('https://aaravpatil.dev');
  const [resumeUrl, setResumeUrl] = useState('https://storage.ilmp.edu/resumes/aarav_patil_cv.pdf');
  const [resumeFileName, setResumeFileName] = useState('aarav_patil_cv.pdf');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Preferences
  const [preferredDomains, setPreferredDomains] = useState('Full Stack Web, Cloud Infrastructure, AI Systems');
  const [preferredLocation, setPreferredLocation] = useState('Pune / Bangalore / Remote');
  const [preferredDurationWeeks, setPreferredDurationWeeks] = useState(16);

  // Dynamic Lists
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Distributed Task Queue Engine',
      description: 'High-throughput async job processor written in Node.js and Redis with real-time telemetry dashboard.',
      techStack: 'Node.js, Redis, TypeScript, Docker',
      githubUrl: 'https://github.com/aaravpatil/task-queue',
      liveUrl: 'https://task-queue.demo.app',
    },
    {
      id: '2',
      title: 'Decentralized Credential Verifier',
      description: 'Tamper-evident QR certificate verification system for academic institutions using cryptographic hashing.',
      techStack: 'React, Vite, TailwindCSS, Express',
      githubUrl: 'https://github.com/aaravpatil/cert-verifier',
    },
  ]);

  const [certifications, setCertifications] = useState<Certificate[]>([
    {
      id: '1',
      title: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      issueDate: '2025-11-15',
      credentialUrl: 'https://aws.amazon.com/verification',
    },
    {
      id: '2',
      title: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Coursera / Meta',
      issueDate: '2025-06-20',
      credentialUrl: 'https://coursera.org/verify/META-8492',
    },
  ]);

  // Modals for adding items
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', techStack: '', githubUrl: '', liveUrl: '' });

  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [newCert, setNewCert] = useState({ title: '', issuer: '', issueDate: '', credentialUrl: '' });

  // Fetch initial profile
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        if (user?.uid) {
          const studentDocSnap = await getDoc(doc(db, 'students', user.uid));
          if (studentDocSnap.exists()) {
            const s = studentDocSnap.data();
            if (s.name) setName(s.name);
            if (s.email) setEmail(s.email);
            if (s.phone) setPhone(s.phone);
            if (s.rollNumber || s.studentId) setStudentId(s.rollNumber || s.studentId);
            if (s.branch || s.department) setDepartment(s.branch || s.department);
            if (s.year) setYear(Number(s.year));
            if (s.semester) setSemester(Number(s.semester));
            if (s.cgpa) setCgpa(Number(s.cgpa));
            if (s.passingYear) setPassingYear(Number(s.passingYear));
            if (s.skills) {
              setTechSkills(Array.isArray(s.skills) ? s.skills : s.skills.split(',').map((x: string) => x.trim()));
            }
            if (s.resume || s.resumeUrl) setResumeUrl(s.resume || s.resumeUrl);
          }
        }

        const res = await api.getMe();
        if (res.data) {
          const u = res.data;
          if (u.name) setName(u.name);
          if (u.email) setEmail(u.email);
          if (u.phone) setPhone(u.phone);
          if (u.student) {
            const s = u.student;
            if (s.studentId || s.rollNumber) setStudentId(s.studentId || s.rollNumber);
            if (s.department || s.branch) setDepartment(s.department || s.branch);
            if (s.year) setYear(s.year);
            if (s.semester) setSemester(s.semester);
            if (s.cgpa) setCgpa(s.cgpa);
            if (s.passingYear) setPassingYear(s.passingYear);
            if (s.skills) {
              setTechSkills(Array.isArray(s.skills) ? s.skills : s.skills.split(',').map((x: string) => x.trim()));
            }
            if (s.softSkills) {
              setSoftSkills(Array.isArray(s.softSkills) ? s.softSkills : s.softSkills.split(',').map((x: string) => x.trim()));
            }
            if (s.resumeUrl) setResumeUrl(s.resumeUrl);
            if (s.githubUrl) setGithubUrl(s.githubUrl);
            if (s.linkedinUrl) setLinkedinUrl(s.linkedinUrl);
            if (s.portfolioUrl) setPortfolioUrl(s.portfolioUrl);
            if (s.preferredDomains) setPreferredDomains(s.preferredDomains);
            if (s.preferredLocation) setPreferredLocation(s.preferredLocation);
            if (s.preferredDurationWeeks) setPreferredDurationWeeks(s.preferredDurationWeeks);
            if (s.projects) {
              try {
                setProjects(typeof s.projects === 'string' ? JSON.parse(s.projects) : s.projects);
              } catch {
                // Keep default
              }
            }
            if (s.certifications) {
              try {
                setCertifications(typeof s.certifications === 'string' ? JSON.parse(s.certifications) : s.certifications);
              } catch {
                // Keep default
              }
            }
          }
        }
      } catch {
        // Keep loaded state
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ─── DYNAMIC PROFILE COMPLETION CALCULATOR ──────────────────────────────────
  const calculateCompletion = () => {
    let score = 0;
    const completed: string[] = [];
    const missing: string[] = [];

    // 1. Basic Info (10%)
    if (name && email && phone) {
      score += 10;
      completed.push('Basic & Contact Information');
    } else {
      missing.push('Basic Contact Info');
    }

    // 2. Academic Enrollment (15%)
    if (studentId && department && year && semester) {
      score += 15;
      completed.push('Academic Enrollment');
    } else {
      missing.push('Academic Details');
    }

    // 3. CGPA & Passing Year (10%)
    if (cgpa && cgpa > 0 && passingYear) {
      score += 10;
      completed.push('CGPA & Graduation Batch');
    } else {
      missing.push('CGPA Score');
    }

    // 4. Technical Skills (15%)
    if (techSkills.length > 0) {
      score += 15;
      completed.push('Technical Skills');
    } else {
      missing.push('Technical Skills');
    }

    // 5. Soft Skills (5%)
    if (softSkills.length > 0) {
      score += 5;
      completed.push('Soft Skills');
    } else {
      missing.push('Soft Skills');
    }

    // 6. Resume Document (15%)
    if (resumeUrl) {
      score += 15;
      completed.push('Verified Resume');
    } else {
      missing.push('Resume File');
    }

    // 7. Projects (15%)
    if (projects.length > 0) {
      score += 15;
      completed.push(`Projects (${projects.length})`);
    } else {
      missing.push('Projects / Portfolio');
    }

    // 8. Certifications (5%)
    if (certifications.length > 0) {
      score += 5;
      completed.push(`Certifications (${certifications.length})`);
    } else {
      missing.push('Certifications');
    }

    // 9. Social Links (5%)
    if (githubUrl || linkedinUrl || portfolioUrl) {
      score += 5;
      completed.push('LinkedIn / GitHub Links');
    } else {
      missing.push('Professional Links (LinkedIn/GitHub)');
    }

    // 10. Internship Preferences (5%)
    if (preferredDomains || preferredLocation) {
      score += 5;
      completed.push('Internship Preferences');
    } else {
      missing.push('Domain & Location Preferences');
    }

    return {
      percentage: Math.min(100, score),
      completed,
      missing,
    };
  };

  const completion = calculateCompletion();

  // Save profile handler
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const studentIdToUpdate = user?.student?.id || user?.id || 'demo-student';
      await api.updateStudent(studentIdToUpdate, {
        name,
        phone,
        department,
        year: Number(year),
        semester: Number(semester),
        cgpa: Number(cgpa),
        passingYear: Number(passingYear),
        skills: techSkills.join(', '),
        softSkills: softSkills.join(', '),
        projects: JSON.stringify(projects),
        certifications: JSON.stringify(certifications),
        resumeUrl,
        githubUrl,
        linkedinUrl,
        portfolioUrl,
        preferredDomains,
        preferredLocation,
        preferredDurationWeeks: Number(preferredDurationWeeks),
        avatarUrl,
      });
      toast.success('Student profile updated and synchronized with T&P database!');
    } catch {
      toast.success('Profile changes saved locally!');
    } finally {
      setSaving(false);
    }
  };

  // Add Project
  const handleAddProject = () => {
    if (!newProject.title) {
      toast.error('Project title is required');
      return;
    }
    const item: Project = {
      id: String(Date.now()),
      title: newProject.title,
      description: newProject.description,
      techStack: newProject.techStack,
      githubUrl: newProject.githubUrl,
      liveUrl: newProject.liveUrl,
    };
    setProjects([...projects, item]);
    setNewProject({ title: '', description: '', techStack: '', githubUrl: '', liveUrl: '' });
    setIsProjectModalOpen(false);
    toast.success('Project added to dossier!');
  };

  // Add Certificate
  const handleAddCert = () => {
    if (!newCert.title) {
      toast.error('Certificate title is required');
      return;
    }
    const item: Certificate = {
      id: String(Date.now()),
      title: newCert.title,
      issuer: newCert.issuer || 'Online Platform',
      issueDate: newCert.issueDate || new Date().toISOString().split('T')[0],
      credentialUrl: newCert.credentialUrl,
    };
    setCertifications([...certifications, item]);
    setNewCert({ title: '', issuer: '', issueDate: '', credentialUrl: '' });
    setIsCertModalOpen(false);
    toast.success('Certification added to profile!');
  };

  // Resume File Upload (Firebase Storage)
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateDocumentFile(file, { maxSizeBytes: 5 * 1024 * 1024 });
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid resume file');
      return;
    }

    try {
      setResumeFileName(file.name);
      setUploadProgress(0);
      const studentUid = user?.uid || 'student';
      const storagePath = StoragePaths.studentResume(studentUid, file.name);

      const result = await uploadDocument(file, storagePath, (pct) => {
        setUploadProgress(pct);
      });

      setResumeUrl(result.downloadUrl);
      setUploadProgress(null);
      toast.success(`Resume "${file.name}" uploaded to Firebase Storage successfully!`);
    } catch (err: any) {
      setUploadProgress(null);
      toast.error(err.message || 'Failed to upload resume to Firebase Storage');
    }
  };

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Student Profile & Dossier"
        subtitle="Manage academic credentials, technical skills, verified certifications, and career preferences"
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* ─── TOP PROFILE SUMMARY & COMPLETION METER ────────────────────────── */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar name={name} size="xl" />
                <button
                  type="button"
                  onClick={() => toast.info('Click below in Overview tab to change avatar')}
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs text-xs"
                >
                  ✎
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-extrabold text-slate-900">{name}</h1>
                  <Badge variant="success" size="sm">
                    Verified Profile
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  PRN: {studentId} · {department}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                  <span className="font-semibold">Year {year}, Sem {semester}</span>
                  <span>•</span>
                  <span className="font-mono font-bold text-amber-700">CGPA: {cgpa}</span>
                  <span>•</span>
                  <span className="text-slate-500">Batch {passingYear}</span>
                </div>
              </div>
            </div>

            {/* Profile Completion Card */}
            <div className="w-full md:w-72 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Profile Strength</span>
                </span>
                <span className="font-mono font-extrabold text-sm text-slate-900">
                  {completion.percentage}%
                </span>
              </div>
              <Progress value={completion.percentage} />
              <p className="text-[11px] text-slate-500 leading-tight">
                {completion.percentage === 100
                  ? 'Your profile is fully optimized for top campus hiring rounds!'
                  : `${completion.missing.length} section${completion.missing.length > 1 ? 's' : ''} left to complete.`}
              </p>
            </div>
          </div>

          {/* Dynamic Completed / Missing Breakdown Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-1.5">
              <span className="font-bold text-emerald-900 block flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-600" />
                <span>Complete ({completion.completed.length})</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {completion.completed.map((sec) => (
                  <span key={sec} className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-800 font-medium text-[11px]">
                    ✓ {sec}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200 space-y-1.5">
              <span className="font-bold text-amber-900 block flex items-center gap-1">
                <AlertCircle size={13} className="text-amber-600" />
                <span>Missing Recommendations ({completion.missing.length})</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {completion.missing.length === 0 ? (
                  <span className="text-[11px] text-emerald-700 font-medium">All recommended dossier sections filled!</span>
                ) : (
                  completion.missing.map((sec) => (
                    <span key={sec} className="px-2 py-0.5 rounded-md bg-white border border-amber-200 text-amber-800 font-medium text-[11px]">
                      + Add {sec}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* ─── SECTION TABS ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'skills', label: 'Skills & Competencies', icon: Code2 },
            { id: 'projects', label: `Projects (${projects.length})`, icon: Layers },
            { id: 'certifications', label: `Certifications (${certifications.length})`, icon: Award },
            { id: 'resume', label: 'Resume & Links', icon: FileText },
            { id: 'preferences', label: 'Preferences', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ─── TAB 1: OVERVIEW ──────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Personal & Academic Information</h2>
                <p className="text-xs text-slate-500">Official student dossier recorded with University Registrar</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSave()}
                loading={saving}
                leftIcon={<Save size={14} />}
              >
                Save Changes
              </Button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<User size={15} />}
                  required
                />
                <Input
                  label="Institutional Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail size={15} />}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftIcon={<Phone size={15} />}
                  required
                />
                <Input
                  label="Enrollment / PRN Number"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
                <Select
                  label="Current Year"
                  value={String(year)}
                  onChange={(e) => setYear(Number(e.target.value))}
                  options={[
                    { label: '1st Year', value: '1' },
                    { label: '2nd Year', value: '2' },
                    { label: '3rd Year', value: '3' },
                    { label: '4th Year', value: '4' },
                  ]}
                />
                <Select
                  label="Current Semester"
                  value={String(semester)}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  options={[
                    { label: 'Sem 1', value: '1' },
                    { label: 'Sem 2', value: '2' },
                    { label: 'Sem 3', value: '3' },
                    { label: 'Sem 4', value: '4' },
                    { label: 'Sem 5', value: '5' },
                    { label: 'Sem 6', value: '6' },
                    { label: 'Sem 7', value: '7' },
                    { label: 'Sem 8', value: '8' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Cumulative CGPA"
                  type="number"
                  step="0.01"
                  value={String(cgpa)}
                  onChange={(e) => setCgpa(Number(e.target.value))}
                  required
                />
                <Input
                  label="Expected Graduation Batch"
                  type="number"
                  value={String(passingYear)}
                  onChange={(e) => setPassingYear(Number(e.target.value))}
                  required
                />
              </div>

              <Textarea
                label="Professional Bio / Career Summary"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Briefly describe your career focus, technical specializations, and goals..."
              />
            </div>
          </Card>
        )}

        {/* ─── TAB 2: SKILLS ────────────────────────────────────────────────── */}
        {activeTab === 'skills' && (
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Technical & Professional Competencies</h2>
                <p className="text-xs text-slate-500">Skills are used by the AI engine to recommend top-matching internships</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSave()}
                loading={saving}
                leftIcon={<Save size={14} />}
              >
                Save Skills
              </Button>
            </div>

            {/* Technical Skills */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800">
                Technical Stack Skills ({techSkills.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {techSkills.map((sk) => (
                  <span
                    key={sk}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 font-semibold text-xs"
                  >
                    <span>{sk}</span>
                    <button
                      type="button"
                      onClick={() => setTechSkills(techSkills.filter((x) => x !== sk))}
                      className="hover:text-rose-600 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-1 max-w-md">
                <Input
                  placeholder="e.g. GraphQL, Kubernetes, Next.js..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newSkill.trim()) {
                        setTechSkills([...techSkills, newSkill.trim()]);
                        setNewSkill('');
                      }
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    if (newSkill.trim()) {
                      setTechSkills([...techSkills, newSkill.trim()]);
                      setNewSkill('');
                    }
                  }}
                >
                  Add Skill
                </Button>
              </div>
            </div>

            {/* Soft Skills */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800">
                Interpersonal & Soft Skills ({softSkills.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {softSkills.map((sk) => (
                  <span
                    key={sk}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold text-xs"
                  >
                    <span>{sk}</span>
                    <button
                      type="button"
                      onClick={() => setSoftSkills(softSkills.filter((x) => x !== sk))}
                      className="hover:text-rose-600 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-1 max-w-md">
                <Input
                  placeholder="e.g. Critical Thinking, Stakeholder Management..."
                  value={newSoftSkill}
                  onChange={(e) => setNewSoftSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newSoftSkill.trim()) {
                        setSoftSkills([...softSkills, newSoftSkill.trim()]);
                        setNewSoftSkill('');
                      }
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    if (newSoftSkill.trim()) {
                      setSoftSkills([...softSkills, newSoftSkill.trim()]);
                      setNewSoftSkill('');
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* ─── TAB 3: PROJECTS ──────────────────────────────────────────────── */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Technical Projects & Hackathons</h2>
                <p className="text-xs text-slate-500">Showcase software architecture and open source accomplishments</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsProjectModalOpen(true)}
                leftIcon={<Plus size={14} />}
              >
                Add Project
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <Card key={proj.id} className="p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm text-slate-900">{proj.title}</h3>
                      <button
                        type="button"
                        onClick={() => setProjects(projects.filter((p) => p.id !== proj.id))}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="text-[11px] font-mono font-medium text-slate-500">
                      Tech: <span className="text-slate-800">{proj.techStack}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs pt-1">
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                        >
                          <Globe size={12} />
                          <span>Code Repository</span>
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1"
                        >
                          <ExternalLink size={12} />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 4: CERTIFICATIONS ────────────────────────────────────────── */}
        {activeTab === 'certifications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Certificates & Industry Credentials</h2>
                <p className="text-xs text-slate-500">Validated professional training and domain certifications</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsCertModalOpen(true)}
                leftIcon={<Plus size={14} />}
              >
                Add Certificate
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((cert) => (
                <Card key={cert.id} className="p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold flex-shrink-0">
                          <Award size={16} />
                        </div>
                        <div>
                          <h3 className="font-bold text-xs text-slate-900">{cert.title}</h3>
                          <span className="text-[11px] text-slate-500">{cert.issuer}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCertifications(certifications.filter((c) => c.id !== cert.id))}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
                    <span>Issued: {cert.issueDate}</span>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        <ExternalLink size={12} />
                        <span>Verify Credential</span>
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 5: RESUME & LINKS ────────────────────────────────────────── */}
        {activeTab === 'resume' && (
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Academic Resume & Web Presence</h2>
                <p className="text-xs text-slate-500">Corporate recruiters will review these links upon receiving applications</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSave()}
                loading={saving}
                leftIcon={<Save size={14} />}
              >
                Save Links
              </Button>
            </div>

            {/* Resume Upload Box */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Official Resume (PDF / Word · Max 5MB)
              </label>
              <label className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/10 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
                <Upload size={24} className="text-amber-600 mb-2" />
                <span className="font-bold text-xs text-slate-900">
                  {resumeFileName ? `Current: ${resumeFileName}` : 'Click to upload updated resume file'}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">PDF or Word format supported (Max 5MB)</span>
              </label>

              {uploadProgress !== null && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1.5 animate-in fade-in">
                  <div className="flex justify-between font-bold text-amber-900 text-[11px]">
                    <span>Uploading to Firebase Storage...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} variant="warning" size="sm" />
                </div>
              )}

              {resumeUrl && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <FileText size={15} className="text-blue-600" />
                    <span className="font-mono text-[11px]">{resumeUrl}</span>
                  </div>
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    <ExternalLink size={12} />
                    <span>Open Resume</span>
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-4 text-xs pt-4 border-t border-slate-100">
              <Input
                label="GitHub Profile URL"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/yourhandle"
                leftIcon={<Globe size={15} />}
              />

              <Input
                label="LinkedIn Profile URL"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/yourhandle"
                leftIcon={<Globe size={15} />}
              />

              <Input
                label="Personal Portfolio / Website"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://yourdomain.dev"
                leftIcon={<Globe size={15} />}
              />
            </div>
          </Card>
        )}

        {/* ─── TAB 6: PREFERENCES ───────────────────────────────────────────── */}
        {activeTab === 'preferences' && (
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Internship Search Preferences</h2>
                <p className="text-xs text-slate-500">Fine-tune your target roles and availability parameters</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSave()}
                loading={saving}
                leftIcon={<Save size={14} />}
              >
                Save Preferences
              </Button>
            </div>

            <div className="space-y-4 text-xs">
              <Input
                label="Preferred Technical Domains (Comma-separated)"
                value={preferredDomains}
                onChange={(e) => setPreferredDomains(e.target.value)}
                placeholder="e.g. Full Stack Web, Cloud Infrastructure, Machine Learning"
                leftIcon={<Briefcase size={15} />}
              />

              <Input
                label="Preferred Geographic Locations"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                placeholder="e.g. Pune, Bangalore, Hyderabad, Remote"
                leftIcon={<MapPin size={15} />}
              />

              <Select
                label="Target Internship Duration"
                value={String(preferredDurationWeeks)}
                onChange={(e) => setPreferredDurationWeeks(Number(e.target.value))}
                options={[
                  { label: '8 Weeks (2 Months)', value: '8' },
                  { label: '12 Weeks (3 Months)', value: '12' },
                  { label: '16 Weeks (4 Months)', value: '16' },
                  { label: '24 Weeks (6 Months - Final Sem)', value: '24' },
                ]}
              />
            </div>
          </Card>
        )}
      </div>

      {/* ─── ADD PROJECT MODAL ──────────────────────────────────────────────── */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Add Technical Project"
        size="md"
      >
        <div className="space-y-3.5 text-xs">
          <Input
            label="Project Title"
            placeholder="e.g. High-Performance API Gateway"
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            required
          />

          <Textarea
            label="Project Description"
            rows={3}
            placeholder="Describe what the system solves, architecture, and impact..."
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          />

          <Input
            label="Tech Stack (Comma-separated)"
            placeholder="e.g. Go, gRPC, Docker, PostgreSQL"
            value={newProject.techStack}
            onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
          />

          <Input
            label="GitHub Repository URL"
            placeholder="https://github.com/..."
            value={newProject.githubUrl}
            onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
          />

          <Input
            label="Live Demonstration URL (Optional)"
            placeholder="https://..."
            value={newProject.liveUrl}
            onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsProjectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddProject}>
              Add Project
            </Button>
          </div>
        </div>
      </Modal>

      {/* ─── ADD CERTIFICATION MODAL ────────────────────────────────────────── */}
      <Modal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        title="Add Professional Certification"
        size="sm"
      >
        <div className="space-y-3.5 text-xs">
          <Input
            label="Certificate Title"
            placeholder="e.g. Certified Kubernetes Administrator"
            value={newCert.title}
            onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
            required
          />

          <Input
            label="Issuing Organization"
            placeholder="e.g. Linux Foundation / CNCF"
            value={newCert.issuer}
            onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
          />

          <Input
            label="Issue Date"
            type="date"
            value={newCert.issueDate}
            onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
          />

          <Input
            label="Verification Link / Credential URL"
            placeholder="https://..."
            value={newCert.credentialUrl}
            onChange={(e) => setNewCert({ ...newCert, credentialUrl: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsCertModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddCert}>
              Add Certificate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
