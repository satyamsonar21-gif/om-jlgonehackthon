import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  Building2, 
  Shield, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Upload, 
  FileText, 
  Briefcase, 
  Globe, 
  Award, 
  KeyRound, 
  Clock, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { auth, db } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

type AccountType = 'STUDENT' | 'FACULTY' | 'COMPANY' | 'ADMIN';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { registerStudent, registerFaculty, registerCompany, registerAdmin } = useAuth();

  const [selectedType, setSelectedType] = useState<AccountType | null>(
    (searchParams.get('type')?.toUpperCase() as AccountType) || null
  );

  // Student Multi-step state (1: Personal, 2: Academic, 3: Skills & Resume, 4: Credentials, 5: Verification, 6: Complete)
  const [studentStep, setStudentStep] = useState(1);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    phone: '',
    collegeName: 'G.H. Raisoni College of Engineering (Autonomous)',
    rollNumber: '',
    studentId: '',
    branch: 'Computer Science & Engineering',
    department: 'Computer Science & Engineering',
    year: 3,
    semester: 6,
    cgpa: 8.5,
    backlogs: 0,
    passingYear: 2026,
    skills: 'React, TypeScript, Node.js, Python, PostgreSQL',
    resume: '',
    resumeUrl: '',
    resumeFileName: '',
    password: '',
    confirmPassword: '',
    verificationCode: '123456',
  });

  // Faculty state (1: Details, 2: Credentials, 3: Submitted)
  const [facultyStep, setFacultyStep] = useState(1);
  const [facultyData, setFacultyData] = useState({
    name: '',
    email: '',
    phone: '',
    facultyId: '',
    department: 'Computer Science & Engineering',
    designation: 'Assistant Professor',
    collegeName: 'G.H. Raisoni College of Engineering (Autonomous)',
    password: '',
    confirmPassword: '',
  });

  // Company state (1: Organization, 2: Contact, 3: Credentials, 4: Submitted)
  const [companyStep, setCompanyStep] = useState(1);
  const [companyData, setCompanyData] = useState({
    name: '',
    domain: 'Software & Cloud Engineering',
    website: '',
    location: 'Bangalore, Karnataka, India',
    description: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    password: '',
    confirmPassword: '',
  });

  // Administrator state (1: Registration Form, 2: Success Confirmation)
  const [adminStep, setAdminStep] = useState(1);
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'TNP_ADMIN',
    department: 'Training & Placement Cell',
    designation: 'Training & Placement Officer',
    collegeName: 'G.H. Raisoni College of Engineering (Autonomous)',
    password: '',
    confirmPassword: '',
  });
  const [createdAdminInfo, setCreatedAdminInfo] = useState<any>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password strength calculator
  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (!pwd) return 0;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;
    return score;
  };

  // Resume upload validation
  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Resume file size must be less than 5MB');
      return;
    }

    // Validate type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      toast.error('Only PDF, DOC, or DOCX resume formats are supported');
      return;
    }

    setResumeFile(file);
    setStudentData({
      ...studentData,
      resumeFileName: file.name,
      resumeUrl: '',
    });
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    toast.success(`Resume "${file.name}" (${sizeInMb} MB) selected for secure upload!`);
  };

  // Submit Student Registration
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Password mismatch check
    if (studentData.password !== studentData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // 2. Password strength validation
    if (studentData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    const fullName = studentData.name.trim();
    const email = studentData.email.trim().toLowerCase();
    const phone = studentData.phone.trim();
    const rollNumber = studentData.rollNumber.trim() || studentData.studentId.trim();
    const branch = studentData.branch.trim() || studentData.department.trim();
    const cgpa = Number(studentData.cgpa);
    const backlogs = Number(studentData.backlogs);
    const passingYear = Number(studentData.passingYear);

    if (!fullName) {
      toast.error('Please enter your full name');
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!phone) {
      toast.error('Please enter your mobile contact number');
      return;
    }

    if (!rollNumber) {
      toast.error('Please enter your enrollment / roll number (PRN)');
      return;
    }

    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
      toast.error('CGPA must be between 0.0 and 10.0');
      return;
    }

    if (isNaN(backlogs) || backlogs < 0) {
      toast.error('Active backlogs count cannot be negative');
      return;
    }

    if (isNaN(passingYear) || passingYear < 2000 || passingYear > 2100) {
      toast.error('Please enter a valid passing year (e.g. 2026)');
      return;
    }

    setLoading(true);
    try {
      const [firstName, ...restParts] = fullName.split(' ');
      const lastName = restParts.join(' ') || firstName || 'Student';

      await registerStudent({
        firstName,
        lastName,
        name: fullName,
        email: email,
        phone: phone,
        password: studentData.password,
        confirmPassword: studentData.confirmPassword,
        rollNumber: rollNumber,
        studentId: rollNumber,
        enrollmentNumber: rollNumber,
        branch: branch,
        department: branch,
        year: Number(studentData.year) || 3,
        semester: Number(studentData.semester) || 6,
        collegeName: studentData.collegeName,
        skills: studentData.skills,
        resumeFile: resumeFile,
        resumeUrl: '',
        cgpa: isNaN(cgpa) ? 8.0 : cgpa,
        backlogs: isNaN(backlogs) ? 0 : backlogs,
        passingYear: isNaN(passingYear) ? 2026 : passingYear,
      });

      navigate('/student');
    } catch {
      // Error is toasted in AuthProvider registerStudent()
    } finally {
      setLoading(false);
    }
  };

  // Submit Faculty Registration
  const handleFacultySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (facultyData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    if (facultyData.password !== facultyData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const fullName = facultyData.name.trim();
    const [firstName, ...restParts] = fullName.split(' ');
    const lastName = restParts.join(' ') || firstName || 'Faculty';

    setLoading(true);
    try {
      await registerFaculty({
        firstName,
        lastName,
        name: fullName,
        email: facultyData.email.trim().toLowerCase(),
        phone: facultyData.phone.trim(),
        password: facultyData.password,
        confirmPassword: facultyData.confirmPassword,
        facultyId: facultyData.facultyId.trim(),
        employeeId: facultyData.facultyId.trim(),
        department: facultyData.department,
        designation: facultyData.designation,
        collegeName: facultyData.collegeName,
      });
      navigate('/pending-approval');
    } catch {
      // Toast already shown in AuthProvider registerFaculty()
    } finally {
      setLoading(false);
    }
  };

  // Submit Company Registration
  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (companyData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    if (companyData.password !== companyData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const contactName = (companyData.contactPerson || companyData.name || '').trim();
    const [firstName, ...restParts] = contactName.split(' ');
    const lastName = restParts.join(' ') || firstName || 'Mentor';

    setLoading(true);
    try {
      await registerCompany({
        firstName,
        lastName,
        name: contactName,
        email: (companyData.contactEmail || companyData.name || '').trim().toLowerCase(),
        company: companyData.name.trim(),
        domain: companyData.domain,
        website: companyData.website,
        contactPerson: companyData.contactPerson,
        contactEmail: (companyData.contactEmail || companyData.name || '').trim().toLowerCase(),
        contactPhone: companyData.contactPhone,
        phone: companyData.contactPhone,
        location: companyData.location,
        description: companyData.description,
        designation: 'Corporate Mentor',
        password: companyData.password,
        confirmPassword: companyData.confirmPassword,
      });
      navigate('/pending-approval');
    } catch {
      // Toast already shown in AuthProvider registerCompany()
    } finally {
      setLoading(false);
    }
  };

  // Submit Admin Registration
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminData.name.trim()) {
      toast.error('Full name is required');
      return;
    }
    if (!adminData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminData.email.trim())) {
      toast.error('Please enter a valid official email address');
      return;
    }
    if (adminData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    if (!/[a-zA-Z]/.test(adminData.password) || !/[0-9]/.test(adminData.password)) {
      toast.error('Password must contain both letters and numbers');
      return;
    }
    if (adminData.password !== adminData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await registerAdmin({
        ...adminData,
        fullName: adminData.name.trim(),
        name: adminData.name.trim(),
        email: adminData.email.trim().toLowerCase(),
      });

      setCreatedAdminInfo({
        name: adminData.name,
        email: adminData.email,
        firebaseUid: res.uid,
        role: 'ADMIN',
        roleTier: adminData.role,
      });
      setAdminStep(2); // Move to Success Screen
    } catch {
      // Error toast already displayed in AuthProvider registerAdmin()
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-slate-900">
      <div className="w-full max-w-xl">
        {/* Top Navigation */}
        <div className="mb-6 flex items-center justify-between">
          {selectedType ? (
            <button
              type="button"
              onClick={() => setSelectedType(null)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Change Account Type</span>
            </button>
          ) : (
            <Link
              to="/sign-in"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Sign In</span>
            </Link>
          )}

          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700">
            <Sparkles size={14} />
            <span>ILMP Academic Platform</span>
          </Link>
        </div>

        {/* ─── STAGE 1: CHOOSE ACCOUNT TYPE ───────────────────────────────────── */}
        {!selectedType && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Institutional Account</h1>
              <p className="text-xs text-slate-500 font-medium">Select your stakeholder profile to begin enrollment</p>
            </div>

            <div className="space-y-3.5">
              {/* Option 1: Student */}
              <button
                type="button"
                onClick={() => {
                  setSelectedType('STUDENT');
                  setStudentStep(1);
                }}
                className="w-full p-4 flex items-start gap-4 cursor-pointer group rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 hover:shadow-sm transition-all duration-150 text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                  <GraduationCap size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm text-slate-900">Student & Intern</h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      Instant Access
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Explore verified internships, clock daily work logs, and submit weekly academic reports.
                  </p>
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-amber-600 transition-all flex-shrink-0 mt-1" />
              </button>

              {/* Option 2: Faculty */}
              <button
                type="button"
                onClick={() => {
                  setSelectedType('FACULTY');
                  setFacultyStep(1);
                }}
                className="w-full p-4 flex items-start gap-4 cursor-pointer group rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/20 hover:shadow-sm transition-all duration-150 text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                  <BookOpen size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm text-slate-900">Faculty Guide & Academic Mentor</h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Requires Approval
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Supervise assigned cohort progress, evaluate weekly milestone reports, and guide at-risk students.
                  </p>
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-600 transition-all flex-shrink-0 mt-1" />
              </button>

              {/* Option 3: Company */}
              <button
                type="button"
                onClick={() => {
                  setSelectedType('COMPANY');
                  setCompanyStep(1);
                }}
                className="w-full p-4 flex items-start gap-4 cursor-pointer group rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 hover:shadow-sm transition-all duration-150 text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                  <Building2 size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm text-slate-900">Company & Industry Supervisor</h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                      Requires Verification
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Publish verified internship listings, evaluate candidate dossiers, and manage active interns.
                  </p>
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-600 transition-all flex-shrink-0 mt-1" />
              </button>

              {/* Option 4: Institutional Administrator */}
              <button
                type="button"
                onClick={() => {
                  setSelectedType('ADMIN');
                  setAdminStep(1);
                }}
                className="w-full p-4 flex items-start gap-4 cursor-pointer group rounded-2xl bg-white border border-slate-200 hover:border-sky-400 hover:bg-sky-50/20 hover:shadow-sm transition-all duration-150 text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                  <Shield size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm text-slate-900">Institutional Administrator</h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                      Governance & T&P
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    University administration, T&P Director, HOD, and platform governance account registration.
                  </p>
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-sky-600 transition-all flex-shrink-0 mt-1" />
              </button>
            </div>

            {/* Institutional Security Notice */}
            <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200/80 text-xs text-sky-900 flex items-start gap-2.5">
              <Shield size={16} className="text-sky-600 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed text-[11px]">
                <span className="font-bold text-sky-950 block">Institutional Security & Role Governance</span>
                All accounts are cryptographically authenticated and subject to university role-based access control (RBAC).
              </div>
            </div>

            <div className="pt-2 text-center text-xs text-slate-500">
              <span>Already registered? </span>
              <Link to="/sign-in" className="font-semibold text-slate-800 hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        )}

        {/* ─── STAGE 2: STUDENT REGISTRATION ─────────────────────────────────── */}
        {selectedType === 'STUDENT' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
            {/* Header & Step Tracker */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900">Student Registration</h1>
                  <p className="text-xs text-slate-500">
                    Step {studentStep} of 5: {
                      studentStep === 1 ? 'Personal Information' :
                      studentStep === 2 ? 'Academic Credentials' :
                      studentStep === 3 ? 'Skills & Technical Resume' :
                      studentStep === 4 ? 'Account Password' :
                      'Email Verification'
                    }
                  </p>
                </div>
                <Badge variant="warning" className="font-mono text-xs">
                  {studentStep * 20}% Done
                </Badge>
              </div>
              <Progress value={studentStep * 20} />
            </div>

            {/* Step 1: Personal Details */}
            {studentStep === 1 && (
              <div className="space-y-4 text-xs">
                <Input
                  label="Full Name"
                  placeholder="e.g. Aarav Patil"
                  value={studentData.name}
                  onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                  leftIcon={<User size={15} />}
                  required
                />

                <Input
                  label="College / University Email"
                  type="email"
                  placeholder="e.g. aarav.patil@ghrce.edu"
                  value={studentData.email}
                  onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                  leftIcon={<Mail size={15} />}
                  required
                />

                <Input
                  label="Mobile Contact Number"
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={studentData.phone}
                  onChange={(e) => setStudentData({ ...studentData, phone: e.target.value })}
                  leftIcon={<Phone size={15} />}
                  required
                />

                <Input
                  label="Enrolled Institution"
                  value={studentData.collegeName}
                  onChange={(e) => setStudentData({ ...studentData, collegeName: e.target.value })}
                  required
                />

                <div className="flex justify-end pt-3 border-t border-slate-100">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      if (!studentData.name.trim() || !studentData.email.trim() || !studentData.phone.trim()) {
                        toast.error('Please complete all personal fields');
                        return;
                      }
                      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentData.email.trim())) {
                        toast.error('Please enter a valid email address');
                        return;
                      }
                      setStudentStep(2);
                    }}
                    rightIcon={<ArrowRight size={14} />}
                  >
                    Continue to Academic Details
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Academic Profile */}
            {studentStep === 2 && (
              <div className="space-y-4 text-xs">
                <Input
                  label="Enrollment / PRN / Roll Number"
                  placeholder="e.g. 2023BCSE042"
                  value={studentData.rollNumber || studentData.studentId}
                  onChange={(e) => setStudentData({ ...studentData, rollNumber: e.target.value, studentId: e.target.value })}
                  required
                />

                <Select
                  label="Department / Branch"
                  value={studentData.branch || studentData.department}
                  onChange={(e) => setStudentData({ ...studentData, branch: e.target.value, department: e.target.value })}
                  options={[
                    { label: 'Computer Science & Engineering', value: 'Computer Science & Engineering' },
                    { label: 'Information Technology', value: 'Information Technology' },
                    { label: 'Electronics & Telecommunication', value: 'Electronics & Telecommunication' },
                    { label: 'Mechanical Engineering', value: 'Mechanical Engineering' },
                    { label: 'Data Science & AI', value: 'Data Science & AI' },
                  ]}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Select
                    label="Current Year"
                    value={String(studentData.year)}
                    onChange={(e) => setStudentData({ ...studentData, year: Number(e.target.value) })}
                    options={[
                      { label: '1st Year', value: '1' },
                      { label: '2nd Year', value: '2' },
                      { label: '3rd Year', value: '3' },
                      { label: '4th Year', value: '4' },
                    ]}
                  />

                  <Select
                    label="Current Semester"
                    value={String(studentData.semester)}
                    onChange={(e) => setStudentData({ ...studentData, semester: Number(e.target.value) })}
                    options={[
                      { label: 'Semester 1', value: '1' },
                      { label: 'Semester 2', value: '2' },
                      { label: 'Semester 3', value: '3' },
                      { label: 'Semester 4', value: '4' },
                      { label: 'Semester 5', value: '5' },
                      { label: 'Semester 6', value: '6' },
                      { label: 'Semester 7', value: '7' },
                      { label: 'Semester 8', value: '8' },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Input
                    label="Cumulative CGPA"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    placeholder="8.50"
                    value={String(studentData.cgpa)}
                    onChange={(e) => setStudentData({ ...studentData, cgpa: Number(e.target.value) })}
                    required
                  />

                  <Input
                    label="Active Backlogs"
                    type="number"
                    min="0"
                    max="20"
                    placeholder="0"
                    value={String(studentData.backlogs)}
                    onChange={(e) => setStudentData({ ...studentData, backlogs: Number(e.target.value) })}
                    required
                  />

                  <Input
                    label="Passing Year"
                    type="number"
                    value={String(studentData.passingYear)}
                    onChange={(e) => setStudentData({ ...studentData, passingYear: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="flex justify-between pt-3 border-t border-slate-100">
                  <Button variant="outline" size="md" onClick={() => setStudentStep(1)}>
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      const roll = (studentData.rollNumber || studentData.studentId).trim();
                      if (!roll) {
                        toast.error('Please enter your enrollment / roll number (PRN)');
                        return;
                      }
                      const cgpaVal = Number(studentData.cgpa);
                      if (isNaN(cgpaVal) || cgpaVal < 0 || cgpaVal > 10) {
                        toast.error('CGPA must be between 0.0 and 10.0');
                        return;
                      }
                      const backlogsVal = Number(studentData.backlogs);
                      if (isNaN(backlogsVal) || backlogsVal < 0) {
                        toast.error('Active backlogs count cannot be negative');
                        return;
                      }
                      const passingYearVal = Number(studentData.passingYear);
                      if (isNaN(passingYearVal) || passingYearVal < 2000 || passingYearVal > 2100) {
                        toast.error('Please enter a valid passing year (e.g. 2026)');
                        return;
                      }
                      setStudentStep(3);
                    }}
                    rightIcon={<ArrowRight size={14} />}
                  >
                    Continue to Skills & Resume
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Skills & Resume */}
            {studentStep === 3 && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Technical Skills (Comma separated)
                  </label>
                  <Input
                    placeholder="e.g. React, Node.js, Python, PostgreSQL, Docker"
                    value={studentData.skills}
                    onChange={(e) => setStudentData({ ...studentData, skills: e.target.value })}
                  />
                </div>

                {/* Resume Upload File Box */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Resume Document (PDF, DOC, DOCX · Max 5MB)
                  </label>
                  <label className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/10 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeFileChange}
                      className="hidden"
                    />
                    <Upload size={22} className="text-amber-600 mb-1.5" />
                    {resumeFile ? (
                      <div className="text-center">
                        <span className="font-bold text-emerald-700 block">{resumeFile.name}</span>
                        <span className="text-[11px] text-emerald-600 font-medium">
                          {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB · Ready for secure Storage upload
                        </span>
                      </div>
                    ) : studentData.resumeFileName ? (
                      <span className="font-bold text-emerald-700">{studentData.resumeFileName} (Ready)</span>
                    ) : (
                      <>
                        <span className="font-bold text-slate-800">Click to upload academic CV</span>
                        <span className="text-[11px] text-slate-400 mt-0.5">PDF, DOC, or DOCX supported (Max 5MB)</span>
                      </>
                    )}
                  </label>
                </div>

                <div className="flex justify-between pt-3 border-t border-slate-100">
                  <Button variant="outline" size="md" onClick={() => setStudentStep(2)}>
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setStudentStep(4)}
                    rightIcon={<ArrowRight size={14} />}
                  >
                    Continue to Credentials
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Account Credentials */}
            {studentStep === 4 && (
              <form onSubmit={handleStudentSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <Input
                    label="Account Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 8 characters with letters & numbers"
                    value={studentData.password}
                    onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                    leftIcon={<Lock size={15} />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    }
                    required
                  />

                  {studentData.password && (
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                        <span>Password Strength:</span>
                        <span
                          className={
                            calculateStrength(studentData.password) >= 75
                              ? 'text-emerald-600 font-bold'
                              : calculateStrength(studentData.password) >= 50
                              ? 'text-amber-600 font-bold'
                              : 'text-rose-600 font-bold'
                          }
                        >
                          {calculateStrength(studentData.password) >= 75
                            ? 'Strong'
                            : calculateStrength(studentData.password) >= 50
                            ? 'Medium'
                            : 'Weak'}
                        </span>
                      </div>
                      <Progress value={calculateStrength(studentData.password)} />
                    </div>
                  )}
                </div>

                <Input
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={studentData.confirmPassword}
                  onChange={(e) => setStudentData({ ...studentData, confirmPassword: e.target.value })}
                  leftIcon={<Lock size={15} />}
                  required
                />

                <div className="flex justify-between pt-3 border-t border-slate-100">
                  <Button variant="outline" size="md" onClick={() => setStudentStep(3)}>
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={loading}
                    rightIcon={<ArrowRight size={14} />}
                  >
                    Create Student Account
                  </Button>
                </div>
              </form>
            )}

            {/* Step 5: Verification Code */}
            {studentStep === 5 && (
              <div className="space-y-5 text-center py-2 text-xs">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
                  <KeyRound size={28} />
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-slate-900">Email Verification Code</h2>
                  <p className="text-xs text-slate-500">
                    A 6-digit verification code has been generated for <span className="font-semibold text-slate-800">{studentData.email}</span>.
                  </p>
                </div>

                <div className="max-w-xs mx-auto space-y-3">
                  <Input
                    placeholder="123456"
                    value={studentData.verificationCode}
                    onChange={(e) => setStudentData({ ...studentData, verificationCode: e.target.value })}
                    className="text-center font-mono text-base tracking-widest"
                    maxLength={6}
                  />

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={async () => {
                      try {
                        if (studentData.verificationCode) {
                          await api.verifyEmail({ email: studentData.email, code: studentData.verificationCode });
                        }
                        toast.success('Email confirmed! Welcome to ILMP.');
                        navigate('/student');
                      } catch {
                        navigate('/student');
                      }
                    }}
                    rightIcon={<ArrowRight size={15} />}
                  >
                    Verify & Enter Student Portal
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── STAGE 3: FACULTY REGISTRATION ─────────────────────────────────── */}
        {selectedType === 'FACULTY' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-slate-900">Faculty Guide Registration</h1>
                <Badge variant="warning" className="font-mono text-xs">
                  Review Required
                </Badge>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Supervise student internships, review weekly logs, and grant institutional approvals.
              </p>
            </div>

            <form onSubmit={handleFacultySubmit} className="space-y-4 text-xs">
              <Input
                label="Full Name & Title"
                placeholder="e.g. Dr. Rajesh Kumar"
                value={facultyData.name}
                onChange={(e) => setFacultyData({ ...facultyData, name: e.target.value })}
                leftIcon={<User size={15} />}
                required
              />

              <Input
                label="Institutional Email Address"
                type="email"
                placeholder="e.g. rajesh.kumar@ghrce.edu"
                value={facultyData.email}
                onChange={(e) => setFacultyData({ ...facultyData, email: e.target.value })}
                leftIcon={<Mail size={15} />}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Employee / Faculty ID"
                  placeholder="e.g. FAC-8492"
                  value={facultyData.facultyId}
                  onChange={(e) => setFacultyData({ ...facultyData, facultyId: e.target.value })}
                  required
                />

                <Input
                  label="Official Designation"
                  placeholder="e.g. Associate Professor"
                  value={facultyData.designation}
                  onChange={(e) => setFacultyData({ ...facultyData, designation: e.target.value })}
                  required
                />
              </div>

              <Select
                label="Department Allocation"
                value={facultyData.department}
                onChange={(e) => setFacultyData({ ...facultyData, department: e.target.value })}
                options={[
                  { label: 'Computer Science & Engineering', value: 'Computer Science & Engineering' },
                  { label: 'Information Technology', value: 'Information Technology' },
                  { label: 'Electronics & Telecommunication', value: 'Electronics & Telecommunication' },
                  { label: 'Mechanical Engineering', value: 'Mechanical Engineering' },
                ]}
              />

              <Input
                label="Institution Name"
                value={facultyData.collegeName}
                onChange={(e) => setFacultyData({ ...facultyData, collegeName: e.target.value })}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  value={facultyData.password}
                  onChange={(e) => setFacultyData({ ...facultyData, password: e.target.value })}
                  leftIcon={<Lock size={15} />}
                  required
                />

                <Input
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={facultyData.confirmPassword}
                  onChange={(e) => setFacultyData({ ...facultyData, confirmPassword: e.target.value })}
                  leftIcon={<Lock size={15} />}
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <span className="font-bold block">Administrator Clearance Rule:</span>
                Faculty profiles require validation by the Dean/HOD before grading and report review capabilities are unlocked.
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  loading={loading}
                  rightIcon={<ArrowRight size={15} />}
                >
                  Submit Faculty Registration
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ─── STAGE 4: COMPANY REGISTRATION ─────────────────────────────────── */}
        {selectedType === 'COMPANY' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-slate-900">Company & Employer Registration</h1>
                <Badge variant="warning" className="font-mono text-xs">
                  Institutional MoU Review
                </Badge>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Post verified corporate internships, evaluate students, and issue binding corporate offer letters.
              </p>
            </div>

            <form onSubmit={handleCompanySubmit} className="space-y-4 text-xs">
              <Input
                label="Company / Enterprise Name"
                placeholder="e.g. TechCorp Solutions Inc."
                value={companyData.name}
                onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                leftIcon={<Building2 size={15} />}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Industry / Domain"
                  placeholder="e.g. Cloud Infrastructure"
                  value={companyData.domain}
                  onChange={(e) => setCompanyData({ ...companyData, domain: e.target.value })}
                  required
                />

                <Input
                  label="Official Website"
                  placeholder="e.g. https://techcorp.io"
                  value={companyData.website}
                  onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                  leftIcon={<Globe size={15} />}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Primary Contact Person"
                  placeholder="e.g. Vikram Nair"
                  value={companyData.contactPerson}
                  onChange={(e) => setCompanyData({ ...companyData, contactPerson: e.target.value })}
                  leftIcon={<User size={15} />}
                  required
                />

                <Input
                  label="Official Work Email"
                  type="email"
                  placeholder="e.g. mentor@techcorp.com"
                  value={companyData.contactEmail}
                  onChange={(e) => setCompanyData({ ...companyData, contactEmail: e.target.value })}
                  leftIcon={<Mail size={15} />}
                  required
                />
              </div>

              <Input
                label="HQ Location / City"
                placeholder="e.g. Bangalore, Karnataka"
                value={companyData.location}
                onChange={(e) => setCompanyData({ ...companyData, location: e.target.value })}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  value={companyData.password}
                  onChange={(e) => setCompanyData({ ...companyData, password: e.target.value })}
                  leftIcon={<Lock size={15} />}
                  required
                />

                <Input
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={companyData.confirmPassword}
                  onChange={(e) => setCompanyData({ ...companyData, confirmPassword: e.target.value })}
                  leftIcon={<Lock size={15} />}
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 leading-relaxed">
                <span className="font-bold block">T&P Partner Accreditation:</span>
                Only verified corporate partners can publish active internship listings to student cohorts.
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  loading={loading}
                  rightIcon={<ArrowRight size={15} />}
                >
                  Submit Company Registration
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ─── STAGE 5: INSTITUTIONAL ADMINISTRATOR REGISTRATION ─────────────── */}
        {selectedType === 'ADMIN' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
            {adminStep === 1 ? (
              <>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-slate-900">Institutional Administrator Registration</h1>
                    <Badge variant="info" className="font-mono text-xs">
                      Governance & T&P
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Provision university governance, T&P controllers, and institutional system administration credentials.
                  </p>
                </div>

                <form onSubmit={handleAdminSubmit} className="space-y-4 text-xs">
                  <Input
                    label="Administrator Full Name"
                    placeholder="e.g. Dr. Rajeshwar Deshpande"
                    value={adminData.name}
                    onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                    leftIcon={<User size={15} />}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Official Institutional Email"
                      type="email"
                      placeholder="e.g. dir.tnp@institution.edu"
                      value={adminData.email}
                      onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                      leftIcon={<Mail size={15} />}
                      required
                    />

                    <Input
                      label="Contact Phone Number"
                      type="tel"
                      placeholder="e.g. +91 9876543210"
                      value={adminData.phone}
                      onChange={(e) => setAdminData({ ...adminData, phone: e.target.value })}
                      leftIcon={<Phone size={15} />}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Select
                      label="Administrative Role Tier"
                      value={adminData.role}
                      onChange={(e) => setAdminData({ ...adminData, role: e.target.value })}
                      options={[
                        { value: 'TNP_ADMIN', label: 'T&P Director / Placement Cell' },
                        { value: 'HOD_ADMIN', label: 'Head of Department (HOD)' },
                        { value: 'ADMIN', label: 'Institutional Administrator' },
                      ]}
                      required
                    />

                    <Input
                      label="Department / Cell"
                      placeholder="e.g. Training & Placement Cell"
                      value={adminData.department}
                      onChange={(e) => setAdminData({ ...adminData, department: e.target.value })}
                      leftIcon={<Briefcase size={15} />}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min 8 characters (letters & numbers)"
                      value={adminData.password}
                      onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                      leftIcon={<Lock size={15} />}
                      required
                    />

                    <Input
                      label="Confirm Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={adminData.confirmPassword}
                      onChange={(e) => setAdminData({ ...adminData, confirmPassword: e.target.value })}
                      leftIcon={<Lock size={15} />}
                      required
                    />
                  </div>

                  {/* Password Strength Indicator */}
                  {adminData.password && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold text-slate-600">Password Security</span>
                        <span className="font-bold text-sky-700">
                          {calculateStrength(adminData.password) >= 75 ? 'Strong' : calculateStrength(adminData.password) >= 50 ? 'Moderate' : 'Weak'}
                        </span>
                      </div>
                      <Progress value={calculateStrength(adminData.password)} />
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950 leading-relaxed">
                    <span className="font-bold block">Institutional Access Guarantee:</span>
                    Your account is registered in Firebase Authentication and Firestore with role <code className="bg-sky-100 px-1 py-0.5 rounded font-mono font-bold text-sky-800">ADMIN</code> for governance access.
                  </div>

                  <div className="flex justify-end pt-3 border-t border-slate-100">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full bg-sky-600 hover:bg-sky-700"
                      loading={loading}
                      rightIcon={<ArrowRight size={15} />}
                    >
                      Provision Administrator Account
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              /* Success Confirmation */
              <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 size={30} />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-extrabold text-slate-900">Administrator Account Created!</h2>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Your institutional administrator account has been successfully provisioned and authorized.
                  </p>
                </div>

                {createdAdminInfo && (
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3 text-xs text-left">
                    <div className="flex justify-between pb-2 border-b border-slate-200">
                      <span className="text-slate-500 font-medium">Administrator</span>
                      <span className="font-bold text-slate-900">{createdAdminInfo.name || adminData.name}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-200">
                      <span className="text-slate-500 font-medium">Official Email</span>
                      <span className="font-mono font-bold text-slate-900">{createdAdminInfo.email || adminData.email}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-200">
                      <span className="text-slate-500 font-medium">Firebase UID</span>
                      <span className="font-mono text-[11px] font-bold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">
                        {createdAdminInfo.firebaseUid || createdAdminInfo.id}
                      </span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-200">
                      <span className="text-slate-500 font-medium">Assigned Role</span>
                      <Badge variant="danger" size="sm">
                        ADMIN ({adminData.role})
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Status</span>
                      <Badge variant="success" size="sm" dot>
                        ACTIVE & AUTHORIZED
                      </Badge>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    className="w-full"
                    onClick={() => {
                      setAdminStep(1);
                      setAdminData({
                        name: '',
                        email: '',
                        phone: '',
                        role: 'TNP_ADMIN',
                        department: 'Training & Placement Cell',
                        designation: 'Training & Placement Officer',
                        collegeName: 'G.H. Raisoni College of Engineering (Autonomous)',
                        password: '',
                        confirmPassword: '',
                      });
                    }}
                  >
                    Create Another Account
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    className="w-full bg-sky-600 hover:bg-sky-700"
                    onClick={() => navigate('/sign-in/admin')}
                    rightIcon={<ArrowRight size={15} />}
                  >
                    Proceed to Admin Sign In
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
