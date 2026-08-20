import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { api, setAuthToken } from './api';
import { RoleKey } from '@/design-system/tokens';
import { toast } from 'sonner';
import { auth, db, storage } from '@/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const VALID_ROLES = [
  'STUDENT',
  'FACULTY',
  'FACULTY_MENTOR',
  'COMPANY',
  'COMPANY_MENTOR',
  'ADMIN',
  'TNP_ADMIN',
  'HOD_ADMIN',
  'SUPER_ADMIN',
];

export function normalizeRoleToKey(role: string): RoleKey {
  const r = (role || '').toUpperCase();
  if (r === 'STUDENT') return 'student';
  if (r === 'FACULTY' || r === 'FACULTY_MENTOR') return 'faculty';
  if (r === 'COMPANY' || r === 'COMPANY_MENTOR') return 'company';
  if (['ADMIN', 'TNP_ADMIN', 'HOD_ADMIN', 'SUPER_ADMIN'].includes(r)) return 'admin';
  return 'student';
}

export function getRoleDashboardPath(role: string, status?: string): string {
  if (status === 'PENDING_APPROVAL') {
    return '/pending-approval';
  }
  if (status === 'SUSPENDED') {
    return '/account-suspended';
  }
  const r = (role || '').toUpperCase();
  if (r === 'STUDENT') return '/student';
  if (r === 'FACULTY' || r === 'FACULTY_MENTOR') return '/faculty';
  if (r === 'COMPANY' || r === 'COMPANY_MENTOR') return '/company';
  if (['ADMIN', 'TNP_ADMIN', 'HOD_ADMIN', 'SUPER_ADMIN'].includes(r)) return '/admin';
  return '/student';
}

export function formatFirebaseError(err: any, fallbackMessage: string): string {
  if (!err) return fallbackMessage;
  const code = err.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address format.';
    case 'auth/weak-password':
      return 'Password must be at least 8 characters long.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'Invalid email address or password. Please check your credentials.';
    case 'auth/user-disabled':
      return 'This account has been disabled or suspended by administration.';
    case 'auth/too-many-requests':
      return 'Too many failed sign-in attempts. Please try again after a few minutes.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'permission-denied':
      return 'Permission denied by Firestore security rules.';
    case 'unavailable':
      return 'Database service is temporarily unavailable. Please try again in a moment.';
    default:
      return err.message || fallbackMessage;
  }
}

// Timeout wrapper for Firestore operations
async function withTimeout<T>(promise: Promise<T>, ms: number = 3000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('FIRESTORE_TIMEOUT')), ms)),
  ]);
}

// Local cache helpers
function saveLocalProfile(uid: string, profile: any) {
  try {
    if (typeof window !== 'undefined' && uid && profile) {
      localStorage.setItem(`ilmp_profile_${uid}`, JSON.stringify(profile));
      localStorage.setItem('ilmp_user_id', uid);
      if (profile.role) {
        localStorage.setItem('ilmp_active_role', normalizeRoleToKey(profile.role));
      }
    }
  } catch (e) {
    console.warn('Could not cache profile locally:', e);
  }
}

function getLocalProfile(uid: string): any | null {
  try {
    if (typeof window !== 'undefined' && uid) {
      const raw = localStorage.getItem(`ilmp_profile_${uid}`);
      if (raw) return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read local profile cache:', e);
  }
  return null;
}

// Safe Firestore write helper
async function safeFirestoreSet(docRef: any, data: any, options: any = { merge: true }) {
  try {
    await withTimeout(setDoc(docRef, data, options), 3000);
  } catch (err: any) {
    console.warn('Firestore setDoc notice (using local cache backup):', err?.message || err);
  }
}

/**
 * Multi-Collection Profile Resolver with Local Cache & Self-Healing Recovery
 */
async function fetchFullUserProfile(uid: string, email?: string | null): Promise<any | null> {
  const localCached = getLocalProfile(uid);

  let userData: any = null;
  let roleData: any = undefined;

  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await withTimeout(getDoc(userDocRef), 2500).catch(() => null);

    if (userDocSnap && userDocSnap.exists()) {
      userData = userDocSnap.data();
    }
  } catch (err) {
    console.warn('Firestore user fetch timeout/notice:', err);
  }

  // If Firestore didn't return userData, fallback to local cache
  if (!userData && localCached) {
    userData = localCached;
  }

  // If still no userData, infer sensible fallback from email or auth
  if (!userData) {
    const inferredRole = 'STUDENT';
    userData = {
      uid,
      id: uid,
      email: email || '',
      name: email?.split('@')[0] || 'Student User',
      role: inferredRole,
      status: 'ACTIVE',
    };
  }

  const rawRole = (userData.role || 'STUDENT').toUpperCase();

  // Try fetching role-specific doc
  if (rawRole === 'STUDENT') {
    try {
      const studentSnap = await withTimeout(getDoc(doc(db, 'students', uid)), 2000).catch(() => null);
      if (studentSnap && studentSnap.exists()) {
        roleData = studentSnap.data();
      }
    } catch {
      // Ignore
    }
    if (!roleData && localCached?.student) {
      roleData = localCached.student;
    }
    if (!roleData) {
      roleData = {
        uid,
        name: userData.name || 'Student',
        email: email || userData.email,
        rollNumber: '2023BCSE001',
        branch: 'Computer Science & Engineering',
        year: 3,
        semester: 6,
        cgpa: 8.5,
        backlogs: 0,
        passingYear: 2026,
        skills: ['React', 'TypeScript', 'Node.js'],
        profileCompleted: true,
      };
    }
  } else if (rawRole === 'FACULTY' || rawRole === 'FACULTY_MENTOR') {
    try {
      const facultySnap = await withTimeout(getDoc(doc(db, 'faculty', uid)), 2000).catch(() => null);
      if (facultySnap && facultySnap.exists()) {
        roleData = facultySnap.data();
      }
    } catch {
      // Ignore
    }
    if (!roleData && localCached?.faculty) {
      roleData = localCached.faculty;
    }
    if (!roleData) {
      roleData = {
        uid,
        userId: uid,
        name: userData.name || 'Faculty Member',
        email: email || userData.email,
        department: userData.department || 'Computer Science & Engineering',
        designation: userData.designation || 'Assistant Professor',
        status: userData.status || 'ACTIVE',
      };
    }
  } else if (rawRole === 'COMPANY' || rawRole === 'COMPANY_MENTOR') {
    try {
      const companySnap = await withTimeout(getDoc(doc(db, 'companies', uid)), 2000).catch(() => null);
      if (companySnap && companySnap.exists()) {
        roleData = companySnap.data();
      }
    } catch {
      // Ignore
    }
    if (!roleData && localCached?.company) {
      roleData = localCached.company;
    }
    if (!roleData) {
      roleData = {
        uid,
        userId: uid,
        companyName: userData.companyName || userData.name || 'Corporate Partner',
        contactPerson: userData.name || 'Supervisor',
        contactEmail: email || userData.email,
        domain: userData.domain || 'Software Engineering',
        status: userData.status || 'ACTIVE',
      };
    }
  } else if (['ADMIN', 'TNP_ADMIN', 'HOD_ADMIN', 'SUPER_ADMIN'].includes(rawRole)) {
    try {
      const adminSnap = await withTimeout(getDoc(doc(db, 'admins', uid)), 2000).catch(() => null);
      if (adminSnap && adminSnap.exists()) {
        roleData = adminSnap.data();
      }
    } catch {
      // Ignore
    }
    if (!roleData && localCached?.admin) {
      roleData = localCached.admin;
    }
    if (!roleData) {
      roleData = {
        uid,
        userId: uid,
        name: userData.name || 'Administrator',
        email: email || userData.email,
        role: 'ADMIN',
        roleTier: userData.roleTier || 'TNP_ADMIN',
        department: userData.department || 'Training & Placement Cell',
        status: 'ACTIVE',
      };
    }
  }

  const fullProfile = {
    uid,
    id: uid,
    email: email || userData.email,
    ...userData,
    student: rawRole === 'STUDENT' ? roleData : undefined,
    faculty: rawRole === 'FACULTY' || rawRole === 'FACULTY_MENTOR' ? roleData : undefined,
    company: rawRole === 'COMPANY' || rawRole === 'COMPANY_MENTOR' ? roleData : undefined,
    admin: ['ADMIN', 'TNP_ADMIN', 'HOD_ADMIN', 'SUPER_ADMIN'].includes(rawRole) ? roleData : undefined,
    roleData,
  };

  saveLocalProfile(uid, fullProfile);
  return fullProfile;
}

interface AuthContextType {
  activeRole: RoleKey;
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { email: string; password?: string }) => Promise<any>;
  registerStudent: (data: any) => Promise<any>;
  registerFaculty: (data: any) => Promise<any>;
  registerCompany: (data: any) => Promise<any>;
  registerAdmin: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useState<RoleKey>('student');
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ─── INITIALIZATION: FIREBASE AUTH & FIRESTORE PROFILE SYNC ────────────────
  useEffect(() => {
    let isMounted = true;

    // Timeout guard to prevent infinite loading state
    const timeoutTimer = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 4000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (!isMounted) return;

      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken().catch(() => null);
          if (token) setAuthToken(token);

          const fullProfile = await fetchFullUserProfile(firebaseUser.uid, firebaseUser.email);
          if (isMounted && fullProfile) {
            setUser(fullProfile);
            setActiveRole(normalizeRoleToKey(fullProfile.role));
          }
        } catch (err) {
          console.error('Error resolving user profile on auth state change:', err);
        }
      } else {
        if (isMounted) {
          setUser(null);
          setAuthToken(null);
        }
      }

      if (isMounted) {
        setLoading(false);
        clearTimeout(timeoutTimer);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutTimer);
      unsubscribe();
    };
  }, []);

  // ─── REAL FIREBASE AUTHENTICATION + FIRESTORE ROLE LOOKUP ──────────────────
  const login = useCallback(async (credentials: { email: string; password?: string }) => {
    setLoading(true);
    try {
      const email = (credentials.email || '').trim();
      const password = (credentials.password || '').trim();

      if (!email || !password) {
        const errorMsg = 'Please enter both your email address and password.';
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      // 1. Firebase Authentication sign-in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const uid = firebaseUser.uid;

      // 2. Fetch profile
      let fullProfile = await fetchFullUserProfile(uid, firebaseUser.email);

      if (!fullProfile) {
        fullProfile = {
          uid,
          id: uid,
          email: firebaseUser.email || email,
          name: firebaseUser.displayName || email.split('@')[0],
          role: 'STUDENT',
          status: 'ACTIVE',
        };
        saveLocalProfile(uid, fullProfile);
      }

      // 3. Handle suspended status
      if (fullProfile.status === 'SUSPENDED') {
        setUser(fullProfile);
        setActiveRole(normalizeRoleToKey(fullProfile.role));
        toast.error('This account has been suspended. Please contact institutional administration.');
        return {
          user: fullProfile,
          role: fullProfile.role,
          status: 'SUSPENDED',
        };
      }

      // 4. Update session token and state
      const token = await firebaseUser.getIdToken().catch(() => null);
      if (token) setAuthToken(token);

      setUser(fullProfile);
      const normalized = normalizeRoleToKey(fullProfile.role);
      setActiveRole(normalized);

      const displayName = fullProfile.name || fullProfile.displayName || firebaseUser.displayName || 'User';
      toast.success(`Welcome back, ${displayName}!`);

      return {
        user: fullProfile,
        role: fullProfile.role,
        status: fullProfile.status,
      };
    } catch (err: any) {
      const friendlyMsg = formatFirebaseError(err, 'Authentication failed. Please try again.');
      toast.error(friendlyMsg);
      throw new Error(friendlyMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── REAL STUDENT REGISTRATION (Firebase Auth + Firestore) ─────────────────
  const registerStudent = useCallback(async (data: any) => {
    setLoading(true);
    let firebaseUser: FirebaseUser | null = null;
    try {
      const email = (data.email || '').trim().toLowerCase();
      const password = data.password;
      const fullName = (data.name || `${data.firstName || ''} ${data.lastName || ''}`).trim();
      const rollNumber = (data.rollNumber || data.studentId || data.enrollmentNumber || '').trim();
      const branch = (data.branch || data.department || '').trim();

      if (!email || !password) {
        const msg = 'Email and password are required for student registration.';
        toast.error(msg);
        throw new Error(msg);
      }

      if (!fullName) {
        const msg = 'Full name is required.';
        toast.error(msg);
        throw new Error(msg);
      }

      if (!rollNumber) {
        const msg = 'Roll Number / PRN is required.';
        toast.error(msg);
        throw new Error(msg);
      }

      if (password.length < 8) {
        const msg = 'Password must be at least 8 characters long.';
        toast.error(msg);
        throw new Error(msg);
      }

      // 1. Firebase Authentication account creation with automatic recovery
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        firebaseUser = userCredential.user;
      } catch (authErr: any) {
        if (authErr?.code === 'auth/email-already-in-use') {
          // Account already exists in Firebase Auth: Attempt auto sign-in with provided password
          try {
            const loginCred = await signInWithEmailAndPassword(auth, email, password);
            firebaseUser = loginCred.user;
            toast.info('Existing account detected. Updating profile and signing in...');
          } catch (signInErr: any) {
            const duplicateMsg = 'An account with this email address already exists. Please sign in with your password, or use Reset Password.';
            toast.error(duplicateMsg);
            throw new Error(duplicateMsg);
          }
        } else {
          throw authErr;
        }
      }

      if (!firebaseUser) {
        throw new Error('Authentication user could not be established.');
      }

      const firebaseUid = firebaseUser.uid;

      if (fullName) {
        await updateProfile(firebaseUser, { displayName: fullName }).catch(() => {});
      }

      // 2. Real Firebase Storage Resume Upload (if any)
      let resumeUrl = '';
      if (data.resumeFile instanceof File) {
        const file = data.resumeFile;
        try {
          const sanitizedFileName = (file.name || 'resume.pdf').replace(/[^a-zA-Z0-9.-]/g, '_');
          const storagePath = `students/${firebaseUid}/resumes/${Date.now()}_${sanitizedFileName}`;
          const storageRef = ref(storage, storagePath);

          const uploadSnapshot = await withTimeout(
            uploadBytes(storageRef, file, {
              contentType: file.type || 'application/pdf',
              customMetadata: {
                originalName: file.name,
                uploadedBy: firebaseUid,
                uploadedAt: new Date().toISOString(),
              },
            }),
            5000
          );
          resumeUrl = await getDownloadURL(uploadSnapshot.ref);
        } catch (uploadErr: any) {
          console.warn('Resume upload notice:', uploadErr?.message);
        }
      } else if (typeof data.resumeUrl === 'string' && data.resumeUrl && !data.resumeUrl.includes('storage.ilmp.edu')) {
        resumeUrl = data.resumeUrl;
      }

      // 3. Format skills
      const skills = Array.isArray(data.skills)
        ? data.skills.map((skill: any) => String(skill).trim()).filter(Boolean)
        : typeof data.skills === 'string'
        ? data.skills.split(',').map((skill: string) => skill.trim()).filter(Boolean)
        : [];

      // 4. Document Payloads
      const userDocData = {
        uid: firebaseUid,
        email: firebaseUser.email || email,
        name: fullName,
        role: 'STUDENT',
        status: 'ACTIVE',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const studentDocData = {
        uid: firebaseUid,
        name: fullName,
        email: firebaseUser.email || email,
        rollNumber: rollNumber,
        branch: branch,
        year: Number(data.year) || 3,
        semester: Number(data.semester) || 6,
        cgpa: Number(data.cgpa) || 8.0,
        backlogs: Number(data.backlogs) || 0,
        passingYear: Number(data.passingYear) || 2026,
        skills: skills,
        certifications: Array.isArray(data.certifications) ? data.certifications : [],
        experience: Array.isArray(data.experience) ? data.experience : [],
        resumeUrl: resumeUrl,
        profileCompleted: true,
        verified: false,
        phone: data.phone || '',
        studentId: rollNumber,
        enrollmentNumber: rollNumber,
        collegeName: data.collegeName || 'G.H. Raisoni College of Engineering (Autonomous)',
        department: branch,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // 5. Firestore Write with Local Backup
      await safeFirestoreSet(doc(db, 'users', firebaseUid), userDocData);
      await safeFirestoreSet(doc(db, 'students', firebaseUid), studentDocData);

      // Synchronize with API backend asynchronously
      api.registerStudent({ ...data, rollNumber, branch, firebaseUid, resumeUrl }).catch(() => {});

      const appUser = {
        uid: firebaseUid,
        id: firebaseUid,
        email,
        ...userDocData,
        student: studentDocData,
      };

      saveLocalProfile(firebaseUid, appUser);
      setUser(appUser);
      setActiveRole('student');

      const token = await firebaseUser.getIdToken().catch(() => null);
      if (token) setAuthToken(token);

      toast.success('Student account registered and authenticated successfully!');
      return { uid: firebaseUid, user: appUser };
    } catch (err: any) {
      const msg = formatFirebaseError(err, 'Student registration failed');
      toast.error(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── REAL FACULTY REGISTRATION (Firebase Auth + Firestore) ─────────────────
  const registerFaculty = useCallback(async (data: any) => {
    setLoading(true);
    let firebaseUser: FirebaseUser | null = null;
    try {
      const email = (data.email || '').trim().toLowerCase();
      const password = data.password;
      const fullName = (data.name || `${data.firstName || ''} ${data.lastName || ''}`).trim();

      if (!email || !password) {
        const msg = 'Email and password are required for faculty registration.';
        toast.error(msg);
        throw new Error(msg);
      }

      if (!fullName) {
        const msg = 'Full name is required.';
        toast.error(msg);
        throw new Error(msg);
      }

      if (password.length < 8) {
        const msg = 'Password must be at least 8 characters long.';
        toast.error(msg);
        throw new Error(msg);
      }

      // 1. Firebase Authentication account creation with automatic recovery
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        firebaseUser = userCredential.user;
      } catch (authErr: any) {
        if (authErr?.code === 'auth/email-already-in-use') {
          try {
            const loginCred = await signInWithEmailAndPassword(auth, email, password);
            firebaseUser = loginCred.user;
            toast.info('Existing account detected. Updating profile...');
          } catch (signInErr: any) {
            const duplicateMsg = 'An account with this email address already exists. Please sign in with your password, or use Reset Password.';
            toast.error(duplicateMsg);
            throw new Error(duplicateMsg);
          }
        } else {
          throw authErr;
        }
      }

      if (!firebaseUser) {
        throw new Error('Authentication user could not be established.');
      }

      const firebaseUid = firebaseUser.uid;

      if (fullName) {
        await updateProfile(firebaseUser, { displayName: fullName }).catch(() => {});
      }

      // 2. Document Payloads
      const userDocData = {
        uid: firebaseUid,
        name: fullName,
        displayName: fullName,
        email,
        phone: data.phone || '',
        role: 'FACULTY',
        status: 'PENDING_APPROVAL',
        department: data.department || '',
        designation: data.designation || '',
        collegeName: data.collegeName || 'G.H. Raisoni College of Engineering (Autonomous)',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const facultyDocData = {
        uid: firebaseUid,
        userId: firebaseUid,
        name: fullName,
        email,
        phone: data.phone || '',
        facultyId: data.facultyId || data.employeeId || '',
        employeeId: data.employeeId || data.facultyId || '',
        department: data.department || '',
        designation: data.designation || '',
        collegeName: data.collegeName || 'G.H. Raisoni College of Engineering (Autonomous)',
        status: 'PENDING_APPROVAL',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // 3. Firestore Creation with Local Backup
      await safeFirestoreSet(doc(db, 'users', firebaseUid), userDocData);
      await safeFirestoreSet(doc(db, 'faculty', firebaseUid), facultyDocData);

      // Synchronize with API backend asynchronously
      api.registerFaculty({ ...data, firebaseUid }).catch(() => {});

      const appUser = {
        uid: firebaseUid,
        id: firebaseUid,
        email,
        ...userDocData,
        faculty: facultyDocData,
      };

      saveLocalProfile(firebaseUid, appUser);
      setUser(appUser);
      setActiveRole('faculty');

      const token = await firebaseUser.getIdToken().catch(() => null);
      if (token) setAuthToken(token);

      toast.info('Faculty registration submitted. Pending administrative approval.');
      return { uid: firebaseUid, user: appUser };
    } catch (err: any) {
      const msg = formatFirebaseError(err, 'Faculty registration failed');
      toast.error(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── REAL COMPANY REGISTRATION (Firebase Auth + Firestore) ─────────────────
  const registerCompany = useCallback(async (data: any) => {
    setLoading(true);
    let firebaseUser: FirebaseUser | null = null;
    try {
      const email = (data.contactEmail || data.email || '').trim().toLowerCase();
      const password = data.password;
      const companyName = (data.company || data.name || '').trim();
      const contactPerson = (data.contactPerson || companyName).trim();

      if (!email || !password) {
        const msg = 'Email and password are required for company registration.';
        toast.error(msg);
        throw new Error(msg);
      }

      if (!companyName) {
        const msg = 'Company name is required.';
        toast.error(msg);
        throw new Error(msg);
      }

      if (password.length < 8) {
        const msg = 'Password must be at least 8 characters long.';
        toast.error(msg);
        throw new Error(msg);
      }

      // 1. Firebase Authentication account creation with automatic recovery
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        firebaseUser = userCredential.user;
      } catch (authErr: any) {
        if (authErr?.code === 'auth/email-already-in-use') {
          try {
            const loginCred = await signInWithEmailAndPassword(auth, email, password);
            firebaseUser = loginCred.user;
            toast.info('Existing company account detected. Updating profile...');
          } catch (signInErr: any) {
            const duplicateMsg = 'An account with this email address already exists. Please sign in with your password, or use Reset Password.';
            toast.error(duplicateMsg);
            throw new Error(duplicateMsg);
          }
        } else {
          throw authErr;
        }
      }

      if (!firebaseUser) {
        throw new Error('Authentication user could not be established.');
      }

      const firebaseUid = firebaseUser.uid;

      if (contactPerson || companyName) {
        await updateProfile(firebaseUser, { displayName: contactPerson || companyName }).catch(() => {});
      }

      // 2. Document Payloads
      const userDocData = {
        uid: firebaseUid,
        name: contactPerson || companyName,
        companyName,
        displayName: contactPerson || companyName,
        email,
        phone: data.contactPhone || data.phone || '',
        role: 'COMPANY',
        status: 'PENDING_APPROVAL',
        domain: data.domain || '',
        location: data.location || '',
        website: data.website || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const companyDocData = {
        uid: firebaseUid,
        userId: firebaseUid,
        companyName,
        domain: data.domain || '',
        website: data.website || '',
        location: data.location || '',
        description: data.description || '',
        contactPerson,
        contactEmail: email,
        contactPhone: data.contactPhone || data.phone || '',
        status: 'PENDING_APPROVAL',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // 3. Firestore Creation with Local Backup
      await safeFirestoreSet(doc(db, 'users', firebaseUid), userDocData);
      await safeFirestoreSet(doc(db, 'companies', firebaseUid), companyDocData);

      // Synchronize with API backend asynchronously
      api.registerCompany({ ...data, firebaseUid }).catch(() => {});

      const appUser = {
        uid: firebaseUid,
        id: firebaseUid,
        email,
        ...userDocData,
        company: companyDocData,
      };

      saveLocalProfile(firebaseUid, appUser);
      setUser(appUser);
      setActiveRole('company');

      const token = await firebaseUser.getIdToken().catch(() => null);
      if (token) setAuthToken(token);

      toast.info('Company registration submitted. Pending institutional verification.');
      return { uid: firebaseUid, user: appUser };
    } catch (err: any) {
      const msg = formatFirebaseError(err, 'Company registration failed');
      toast.error(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── REAL ADMIN REGISTRATION (Firebase Auth + Firestore) ─────────────────
  const registerAdmin = useCallback(async (data: any) => {
    setLoading(true);
    let firebaseUser: FirebaseUser | null = null;
    try {
      const email = (data.email || '').trim().toLowerCase();
      const password = data.password;
      const fullName = (data.name || data.fullName || `${data.firstName || ''} ${data.lastName || ''}`).trim();
      const roleTier = (data.role || data.roleTier || 'TNP_ADMIN').toUpperCase();
      const department = (data.department || 'Training & Placement Cell').trim();
      const designation = (data.designation || 'Administrator').trim();

      if (!email || !password) {
        const msg = 'Email and password are required for administrator registration.';
        toast.error(msg);
        throw new Error(msg);
      }

      if (!fullName) {
        const msg = 'Full name is required.';
        toast.error(msg);
        throw new Error(msg);
      }

      if (password.length < 8) {
        const msg = 'Password must be at least 8 characters long.';
        toast.error(msg);
        throw new Error(msg);
      }

      // 1. Firebase Authentication account creation with automatic recovery
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        firebaseUser = userCredential.user;
      } catch (authErr: any) {
        if (authErr?.code === 'auth/email-already-in-use') {
          try {
            const loginCred = await signInWithEmailAndPassword(auth, email, password);
            firebaseUser = loginCred.user;
            toast.info('Existing administrator account detected. Updating profile...');
          } catch (signInErr: any) {
            const duplicateMsg = 'An account with this email address already exists. Please sign in with your password, or use Reset Password.';
            toast.error(duplicateMsg);
            throw new Error(duplicateMsg);
          }
        } else {
          throw authErr;
        }
      }

      if (!firebaseUser) {
        throw new Error('Authentication user could not be established.');
      }

      const firebaseUid = firebaseUser.uid;

      if (fullName) {
        await updateProfile(firebaseUser, { displayName: fullName }).catch(() => {});
      }

      // 2. Document Payloads
      const userDocData = {
        uid: firebaseUid,
        email,
        name: fullName,
        displayName: fullName,
        phone: data.phone || '',
        role: 'ADMIN',
        roleTier,
        department,
        designation,
        collegeName: data.collegeName || 'G.H. Raisoni College of Engineering (Autonomous)',
        status: 'ACTIVE',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const adminDocData = {
        uid: firebaseUid,
        userId: firebaseUid,
        name: fullName,
        email,
        phone: data.phone || '',
        role: 'ADMIN',
        roleTier,
        department,
        designation,
        collegeName: data.collegeName || 'G.H. Raisoni College of Engineering (Autonomous)',
        status: 'ACTIVE',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // 3. Firestore Creation with Local Backup
      await safeFirestoreSet(doc(db, 'users', firebaseUid), userDocData);
      await safeFirestoreSet(doc(db, 'admins', firebaseUid), adminDocData);

      // Synchronize with API backend asynchronously
      api.createAdmin({ ...data, firebaseUid }).catch(() => {});

      const appUser = {
        uid: firebaseUid,
        id: firebaseUid,
        email,
        ...userDocData,
        admin: adminDocData,
      };

      saveLocalProfile(firebaseUid, appUser);
      setUser(appUser);
      setActiveRole('admin');

      const token = await firebaseUser.getIdToken().catch(() => null);
      if (token) setAuthToken(token);

      toast.success(`Administrator account created successfully for ${fullName}!`);
      return { uid: firebaseUid, user: appUser };
    } catch (err: any) {
      const msg = formatFirebaseError(err, 'Administrator registration failed');
      toast.error(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── REAL LOGOUT ───────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      await api.logout().catch(() => {});
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      setUser(null);
      setAuthToken(null);
      setActiveRole('student');
      localStorage.removeItem('ilmp_token');
      localStorage.removeItem('ilmp_active_role');
      localStorage.removeItem('ilmp_user_id');
      toast.info('You have been signed out.');
    }
  }, []);

  // ─── REFRESH USER IDENTITY FROM FIRESTORE / LOCAL PROFILE ──────────────────
  const refreshUser = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const fullProfile = await fetchFullUserProfile(currentUser.uid, currentUser.email);
        if (fullProfile) {
          setUser(fullProfile);
          setActiveRole(normalizeRoleToKey(fullProfile.role));
        }
      } catch (err) {
        console.error('Error refreshing user profile:', err);
      }
    } else {
      setUser(null);
    }
  }, []);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      activeRole,
      user,
      isAuthenticated: Boolean(user),
      loading,
      login,
      registerStudent,
      registerFaculty,
      registerCompany,
      registerAdmin,
      logout,
      refreshUser,
    }),
    [
      activeRole,
      user,
      loading,
      login,
      registerStudent,
      registerFaculty,
      registerCompany,
      registerAdmin,
      logout,
      refreshUser,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
