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
import { toast } from 'sonner';

type AccountType = 'STUDENT' | 'FACULTY' | 'COMPANY';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { registerStudent, registerFaculty, registerCompany } = useAuth();

  const [selectedType, setSelectedType] = useState<AccountType | null>(
    (searchParams.get('type')?.toUpperCase() as AccountType) || null
  );

  // Student Multi-step state (1: Personal, 2: Academic, 3: Skills & Resume, 4: Credentials, 5: Verification, 6: Complete)
  const [studentStep, setStudentStep] = useState(1);
  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    phone: '',
    collegeName: 'G.H. Raisoni College of Engineering (Autonomous)',
    studentId: '',
    department: 'Computer Science & Engineering',
    year: 3,
    semester: 6,
    cgpa: 8.5,
    passingYear: 2026,
    skills: 'React, TypeScript, Node.js, Python, PostgreSQL',
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

    setStudentData({
      ...studentData,
      resumeFileName: file.name,
      resumeUrl: `https://storage.ilmp.edu/resumes/${encodeURIComponent(file.name)}`,
    });
    toast.success(`Resume "${file.name}" uploaded and validated!`);
  };

  // Submit Student Registration
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (studentData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    if (studentData.password !== studentData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await registerStudent({
        name: studentData.name,
        email: studentData.email,
        phone: studentData.phone,
        password: studentData.password,
        studentId: studentData.studentId,
        department: studentData.department,
        year: Number(studentData.year),
        semester: Number(studentData.semester),
        collegeName: studentData.collegeName,
        skills: studentData.skills,
        resumeUrl: studentData.resumeUrl || 'https://storage.ilmp.edu/resumes/default_resume.pdf',
        cgpa: Number(studentData.cgpa),
        passingYear: Number(studentData.passingYear),
      });
      setStudentStep(5); // Move to Verification code step
    } catch (err: any) {
      // Toast already shown in AuthProvider
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

    setLoading(true);
    try {
      await registerFaculty({
        name: facultyData.name,
        email: facultyData.email,
        phone: facultyData.phone,
        password: facultyData.password,
        facultyId: facultyData.facultyId,
        department: facultyData.department,
        designation: facultyData.designation,
        collegeName: facultyData.collegeName,
      });
      navigate('/pending-approval');
    } catch (err: any) {
      // Toast already shown in AuthProvider
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

    setLoading(true);
    try {
      await registerCompany({
        name: companyData.name,
        email: companyData.contactEmail,
        domain: companyData.domain,
        website: companyData.website,
        contactPerson: companyData.contactPerson,
        contactEmail: companyData.contactEmail,
        contactPhone: companyData.contactPhone,
        location: companyData.location,
        description: companyData.description,
        password: companyData.password,
      });
      navigate('/pending-approval');
    } catch (err: any) {
      // Toast already shown in AuthProvider
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
            </div>

            {/* Security Notice: No Public Admin Registration */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-start gap-2.5">
              <Shield size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed text-[11px]">
                <span className="font-bold text-slate-700 block">Institutional Governance Policy</span>
                Administrator and T&P Controller accounts cannot be registered publicly. They are provisioned directly by University System Administration.
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
                      if (!studentData.name || !studentData.email || !studentData.phone) {
                        toast.error('Please complete all personal fields');
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
                  value={studentData.studentId}
                  onChange={(e) => setStudentData({ ...studentData, studentId: e.target.value })}
                  required
                />

                <Select
                  label="Department / Branch"
                  value={studentData.department}
                  onChange={(e) => setStudentData({ ...studentData, department: e.target.value })}
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

                <div className="grid grid-cols-2 gap-3">
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
                    label="Expected Passing Year"
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
                      if (!studentData.studentId) {
                        toast.error('Please enter your enrollment / roll number');
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
                    {studentData.resumeFileName ? (
                      <span className="font-bold text-emerald-700">{studentData.resumeFileName} (Ready)</span>
                    ) : (
                      <>
                        <span className="font-bold text-slate-800">Click to upload academic CV</span>
                        <span className="text-[11px] text-slate-400 mt-0.5">PDF or Word format supported</span>
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
                    onClick={() => {
                      toast.success('Email confirmed! Welcome to ILMP.');
                      navigate('/student');
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
      </div>
    </div>
  );
}
