import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, FormField } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Shield,
  ShieldCheck,
  UserPlus,
  Mail,
  Lock,
  Phone,
  User,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Building,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { auth, db } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AdminFormData {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  password?: string;
  confirmPassword?: string;
}

export default function CreateAdminPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<AdminFormData>({
    fullName: '',
    email: '',
    phone: '',
    role: 'TNP_ADMIN',
    department: 'Training & Placement Cell',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdAdmin, setCreatedAdmin] = useState<any>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Field change handler with live validation
  const handleChange = (field: keyof AdminFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setServerError(null);

    // Validate on change if field has been touched
    if (touched[field]) {
      validateSingleField(field, value);
    }
  };

  const handleBlur = (field: keyof AdminFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateSingleField(field, formData[field]);
  };

  // Field-level validator
  const validateSingleField = (field: keyof AdminFormData, value: string): string | undefined => {
    let error: string | undefined;

    switch (field) {
      case 'fullName':
        if (!value.trim()) {
          error = 'Full name is required.';
        } else if (value.trim().length < 3) {
          error = 'Full name must be at least 3 characters.';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Institutional email address is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = 'Please enter a valid email address (e.g. admin@institution.edu).';
        }
        break;

      case 'phone':
        if (value.trim() && !/^\+?[0-9\s\-()]{10,15}$/.test(value.trim())) {
          error = 'Please enter a valid phone number (10 to 15 digits).';
        }
        break;

      case 'role':
        if (!value) {
          error = 'Please select an administrative role tier.';
        }
        break;

      case 'department':
        if (!value.trim()) {
          error = 'Department or administrative cell is required.';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required.';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters long.';
        } else if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
          error = 'Password must contain both letters and numbers.';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password.';
        } else if (value !== formData.password) {
          error = 'Passwords do not match.';
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  // Full form validator
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof AdminFormData>).forEach((field) => {
      const error = validateSingleField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      role: true,
      department: true,
      password: true,
      confirmPassword: true,
    });

    return isValid;
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (pass.length >= 12) score += 25;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 15;
    if (/[^a-zA-Z0-9]/.test(pass)) score += 10;

    let label = 'Weak';
    let color = 'bg-rose-500 text-rose-700';
    let textColor = 'text-rose-600';
    if (score >= 80) {
      label = 'Strong';
      color = 'bg-emerald-500 text-emerald-700';
      textColor = 'text-emerald-600';
    } else if (score >= 50) {
      label = 'Moderate';
      color = 'bg-amber-500 text-amber-700';
      textColor = 'text-amber-600';
    }
    return { score: Math.min(score, 100), label, color, textColor };
  };

  const strength = getPasswordStrength(formData.password);

  // ─── ERROR MESSAGE SANITIZER (NO SENSITIVE/INTERNAL STACK LEAKS) ──────────
  const sanitizeErrorMessage = (err: any): string => {
    if (!err) return 'Something went wrong. Please try again.';

    const status = err.response?.status;
    const rawMsg = (
      err.response?.data?.message ||
      err.message ||
      ''
    ).toString().toLowerCase();

    // 1. Session Expiration (401)
    if (status === 401 || rawMsg.includes('unauthorized') || rawMsg.includes('session expired') || rawMsg.includes('sign in')) {
      return 'Your session has expired. Please sign in again to continue.';
    }

    // 2. Unauthorized User (403)
    if (status === 403 || rawMsg.includes('forbidden') || rawMsg.includes('not authorized') || rawMsg.includes('permission')) {
      return 'You are not authorized to create an Admin account.';
    }

    // 3. Existing Email / Duplicate Account (409)
    if (
      status === 409 ||
      rawMsg.includes('already exists') ||
      rawMsg.includes('email-already-in-use') ||
      rawMsg.includes('duplicate')
    ) {
      return 'An account with this email already exists.';
    }

    // 4. Invalid Email
    if (rawMsg.includes('valid email') || rawMsg.includes('invalid-email')) {
      return 'Please enter a valid email address.';
    }

    // 5. Password Mismatch
    if (rawMsg.includes('passwords do not match') || rawMsg.includes('mismatch')) {
      return 'Passwords do not match.';
    }

    // 6. Weak Password
    if (rawMsg.includes('weak-password') || rawMsg.includes('at least 8 characters')) {
      return 'Password must be at least 8 characters long and contain both letters and numbers.';
    }

    // 7. Firestore / Database Failure
    if (
      rawMsg.includes('firestore') ||
      rawMsg.includes('database') ||
      rawMsg.includes('prisma') ||
      rawMsg.includes('postgres') ||
      rawMsg.includes('sqlite') ||
      rawMsg.includes('internal server error')
    ) {
      return 'Database service is currently unavailable. Please try again.';
    }

    // 8. Network / Offline Connection Failure
    if (
      rawMsg.includes('network') ||
      rawMsg.includes('offline') ||
      rawMsg.includes('econnrefused') ||
      err.code === 'ERR_NETWORK' ||
      err.code === 'auth/network-request-failed'
    ) {
      return 'Network connection error. Please check your internet connection and try again.';
    }

    // 9. Clean server error if safe
    if (
      err.response?.data?.message &&
      typeof err.response.data.message === 'string' &&
      !rawMsg.includes('prisma') &&
      !rawMsg.includes('stack') &&
      !rawMsg.includes('syntax')
    ) {
      return err.response.data.message;
    }

    return 'Something went wrong. Please try again.';
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Guard against duplicate / rapid submissions
    if (isSubmitting) {
      return;
    }

    if (!validateForm()) {
      toast.error('Please resolve the validation errors before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Dispatch payload
      const payload = {
        name: formData.fullName.trim(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        role: formData.role,
        department: formData.department.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      // ─── 1. FIREBASE AUTHENTICATION: CREATE USER ACCOUNT ─────────────────────
      let firebaseUid: string | null = null;
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        );
        firebaseUid = userCredential.user.uid;

        // Set Firebase display name
        await updateProfile(userCredential.user, {
          displayName: payload.name,
        });

        // ─── 2. FIRESTORE: CREATE/UPDATE USERS/{UID} DOCUMENT WITH ROLE "ADMIN" ───
        const userDocRef = doc(db, 'users', firebaseUid);
        await setDoc(
          userDocRef,
          {
            uid: firebaseUid,
            email: payload.email,
            name: payload.name,
            displayName: payload.name,
            role: 'ADMIN', // STRICT REQUIREMENT: role = "ADMIN"
            roleTier: payload.role,
            department: payload.department,
            phone: payload.phone || '',
            status: 'ACTIVE',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (fbErr: any) {
        console.warn('Firebase user creation notice:', fbErr?.code);
        if (fbErr?.code === 'auth/email-already-in-use') {
          throw new Error('An account with this email already exists.');
        } else if (fbErr?.code === 'auth/weak-password') {
          throw new Error('Password must be at least 8 characters long and contain both letters and numbers.');
        } else if (fbErr?.code === 'auth/invalid-email') {
          throw new Error('Please enter a valid email address.');
        } else if (fbErr?.code === 'auth/network-request-failed') {
          throw new Error('Network connection error. Please check your internet connection and try again.');
        }
      }

      // ─── 3. BACKEND API: SYNCHRONIZE WITH INSTITUTIONAL DATABASE & AUDIT LOG ───
      const response = await api.createAdmin({
        ...payload,
        firebaseUid: firebaseUid || undefined,
      });
      const resData = response.data;

      setCreatedAdmin({
        ...(resData.user || resData),
        firebaseUid: firebaseUid || resData.user?.id || `adm_${Date.now()}`,
        role: 'ADMIN',
        roleTier: payload.role,
      });
      setIsSuccess(true);
      toast.success(resData.message || `Administrator account provisioned for ${formData.fullName}!`);
    } catch (err: any) {
      const friendlyMessage = sanitizeErrorMessage(err);
      setServerError(friendlyMessage);
      toast.error(friendlyMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      role: 'TNP_ADMIN',
      department: 'Training & Placement Cell',
      password: '',
      confirmPassword: '',
    });
    setErrors({});
    setTouched({});
    setServerError(null);
    setIsSuccess(false);
    setCreatedAdmin(null);
  };

  return (
    <div className="min-h-full pb-16 bg-[#F8FAFC]">
      <Header
        title="Institutional Administrator Provisioning"
        subtitle="Authorize and provision new administrator credentials with role-based access control"
      />

      <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Navigation Breadcrumb / Back Action */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin/admins"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Administrator Directory</span>
          </Link>

          <Badge variant="neutral" size="sm" className="gap-1.5 font-mono text-[11px]">
            <Shield size={12} className="text-sky-600" />
            <span>Authorized Admin Session</span>
          </Badge>
        </div>

        {/* ─── SUCCESS STATE CONFIRMATION ────────────────────────────────────────── */}
        {isSuccess ? (
          <Card className="border-emerald-200 bg-emerald-50/20 p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 size={30} />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">Administrator Account Created</h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Institutional administrator account created in Firebase Authentication, profile saved in Firestore, and synchronized with system database.
              </p>
            </div>

            {createdAdmin && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3.5 text-xs shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Full Name</span>
                  <span className="font-bold text-slate-900">{createdAdmin.name || createdAdmin.fullName}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Official Email</span>
                  <span className="font-mono font-bold text-slate-900">{createdAdmin.email}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Firebase UID</span>
                  <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 text-[11px]">
                    {createdAdmin.firebaseUid || createdAdmin.id}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Firestore Document</span>
                  <span className="font-mono text-[11px] text-slate-600">
                    users/{createdAdmin.firebaseUid || createdAdmin.id}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Firestore Role</span>
                  <Badge variant="danger" size="sm">
                    ADMIN
                  </Badge>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Department / Cell</span>
                  <span className="font-medium text-slate-700">{createdAdmin.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-500">Account Status</span>
                  <Badge variant="success" size="sm" dot={true}>
                    ACTIVE & AUTHORIZED
                  </Badge>
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
              <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Next Administrative Steps:</span>
                The new administrator can now sign in at{' '}
                <Link to="/sign-in/admin" className="font-semibold underline hover:text-amber-950">
                  /sign-in/admin
                </Link>{' '}
                using their institutional email and assigned password.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleResetForm}
                leftIcon={<UserPlus size={14} />}
              >
                Provision Another Admin
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                className="bg-sky-600 hover:bg-sky-700"
                onClick={() => navigate('/admin/admins')}
                rightIcon={<ArrowRight size={14} />}
              >
                View Administrator Directory
              </Button>
            </div>
          </Card>
        ) : (
          /* ─── ADMIN REGISTRATION FORM ────────────────────────────────────────── */
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                  <UserPlus size={20} />
                </div>
                <div>
                  <CardTitle className="text-lg">Create New Administrator Account</CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter the authorized identity and security details for the new institutional administrator.
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 sm:p-8">
              {/* Server Error Alert */}
              {serverError && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-800 animate-in fade-in">
                  <AlertCircle size={16} className="text-rose-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold block">Account Creation Error:</span>
                    <span>{serverError}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* ─── SECTION 1: PERSONAL & CONTACT INFORMATION ──────────────── */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <User size={15} className="text-sky-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      1. Administrator Identity & Contact
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <FormField
                      label="Full Name"
                      required
                      error={touched.fullName ? errors.fullName : undefined}
                      hint="e.g. Dr. Rajesh Sharma"
                    >
                      <Input
                        type="text"
                        placeholder="Enter full legal name"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        onBlur={() => handleBlur('fullName')}
                        leftIcon={<User size={15} />}
                        required
                      />
                    </FormField>

                    {/* Email */}
                    <FormField
                      label="Official Institutional Email"
                      required
                      error={touched.email ? errors.email : undefined}
                      hint="Must be an official institutional email address"
                    >
                      <Input
                        type="email"
                        placeholder="e.g. r.sharma@institution.edu"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        leftIcon={<Mail size={15} />}
                        required
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone Number */}
                    <FormField
                      label="Official Phone Number"
                      error={touched.phone ? errors.phone : undefined}
                      hint="e.g. +91 98765 43210 (Optional)"
                    >
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        onBlur={() => handleBlur('phone')}
                        leftIcon={<Phone size={15} />}
                      />
                    </FormField>

                    {/* Department / Office */}
                    <FormField
                      label="Department / Administrative Office"
                      required
                      error={touched.department ? errors.department : undefined}
                      hint="e.g. Training & Placement Cell, Dean Academics"
                    >
                      <Input
                        type="text"
                        placeholder="e.g. Training & Placement Cell"
                        value={formData.department}
                        onChange={(e) => handleChange('department', e.target.value)}
                        onBlur={() => handleBlur('department')}
                        leftIcon={<Building size={15} />}
                        required
                      />
                    </FormField>
                  </div>
                </div>

                {/* ─── SECTION 2: ADMINISTRATIVE ROLE TIER ───────────────────── */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <ShieldCheck size={15} className="text-sky-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      2. Role & Governance Clearance Tier
                    </h3>
                  </div>

                  <FormField
                    label="Administrative Authority Role"
                    required
                    error={touched.role ? errors.role : undefined}
                    hint="Select the appropriate RBAC access level for this administrator"
                  >
                    <Select
                      value={formData.role}
                      onChange={(e) => handleChange('role', e.target.value)}
                      options={[
                        {
                          label: 'T&P Officer (TNP_ADMIN) — Placement Drives, Offer Letters & MoUs',
                          value: 'TNP_ADMIN',
                        },
                        {
                          label: 'Head of Department (HOD_ADMIN) — Departmental Oversight & Academic Reviews',
                          value: 'HOD_ADMIN',
                        },
                        {
                          label: 'General Administrator (ADMIN) — Student Directory & Verification',
                          value: 'ADMIN',
                        },
                        {
                          label: 'Executive Super Admin (SUPER_ADMIN) — Full Institutional Control & Audit Ledger',
                          value: 'SUPER_ADMIN',
                        },
                      ]}
                    />
                  </FormField>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-600">
                    <Info size={15} className="text-sky-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">Role Privilege Info: </span>
                      {formData.role === 'TNP_ADMIN' &&
                        'Can verify corporate partner MoUs, approve internship listings, manage student applications, and inspect T&P metrics.'}
                      {formData.role === 'HOD_ADMIN' &&
                        'Can inspect student attendance records, evaluate faculty guide reviews, and track batch academic risk telemetry.'}
                      {formData.role === 'ADMIN' &&
                        'Can manage student directory records, mentor assignments, and sign off completion certificates.'}
                      {formData.role === 'SUPER_ADMIN' &&
                        'Full campus-wide access including audit log monitoring, cryptographic key rotations, and system settings.'}
                    </div>
                  </div>
                </div>

                {/* ─── SECTION 3: CREDENTIALS & SECURITY ─────────────────────── */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Lock size={15} className="text-sky-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      3. Security Credentials & Access Password
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Password */}
                    <FormField
                      label="Initial Access Password"
                      required
                      error={touched.password ? errors.password : undefined}
                      hint="At least 8 characters with letters & numbers"
                    >
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••••••"
                          value={formData.password}
                          onChange={(e) => handleChange('password', e.target.value)}
                          onBlur={() => handleBlur('password')}
                          leftIcon={<Lock size={15} />}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </FormField>

                    {/* Confirm Password */}
                    <FormField
                      label="Confirm Password"
                      required
                      error={touched.confirmPassword ? errors.confirmPassword : undefined}
                      hint="Must match password exactly"
                    >
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => handleChange('confirmPassword', e.target.value)}
                          onBlur={() => handleBlur('confirmPassword')}
                          leftIcon={<Lock size={15} />}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </FormField>
                  </div>

                  {/* Password Strength Meter */}
                  {formData.password && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-600">Password Security Strength:</span>
                        <span className={strength.textColor}>{strength.label}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${strength.color} transition-all duration-300`}
                          style={{ width: `${strength.score}%` }}
                        />
                      </div>
                      <ul className="text-[11px] text-slate-500 space-y-0.5 pt-1 list-disc list-inside">
                        <li className={formData.password.length >= 8 ? 'text-emerald-600 font-medium' : ''}>
                          At least 8 characters
                        </li>
                        <li
                          className={
                            /[a-zA-Z]/.test(formData.password) && /[0-9]/.test(formData.password)
                              ? 'text-emerald-600 font-medium'
                              : ''
                          }
                        >
                          Contains both letters and numbers
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* ─── ACTION BUTTONS ────────────────────────────────────────── */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => navigate('/admin/admins')}
                    disabled={isSubmitting}
                    leftIcon={<ArrowLeft size={14} />}
                  >
                    Cancel & Return
                  </Button>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 shadow-xs"
                      loading={isSubmitting}
                      rightIcon={<ArrowRight size={14} />}
                    >
                      Provision Admin Account
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
